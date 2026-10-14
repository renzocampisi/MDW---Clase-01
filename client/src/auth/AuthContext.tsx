import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

export type Role = 'user' | 'admin'
export interface User {
  id: string
  name: string
  email: string
  role: Role
}

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'
const TOKEN_KEY = 'token'

interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthState | null>(null)

export async function api<T>(path: string, token?: string | null, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message ?? `Error ${res.status}`)
  return data as T
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(!!token)

  // Al cargar la app, si hay token guardado se revalida contra /auth/me
  useEffect(() => {
    if (!token) return
    api<{ user: User }>('/auth/me', token)
      .then((r) => setUser(r.user))
      .catch(() => logout())
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function startSession(r: { token: string; user: User }) {
    localStorage.setItem(TOKEN_KEY, r.token)
    setToken(r.token)
    setUser(r.user)
  }

  async function login(email: string, password: string) {
    startSession(await api('/auth/login', null, { method: 'POST', body: JSON.stringify({ email, password }) }))
  }

  async function register(name: string, email: string, password: string) {
    startSession(
      await api('/auth/register', null, { method: 'POST', body: JSON.stringify({ name, email, password }) }),
    )
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
