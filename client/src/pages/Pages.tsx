import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { api, useAuth } from '../auth/AuthContext'

function ApiMessage({ path, auth }: { path: string; auth?: boolean }) {
  const { token } = useAuth()
  const [msg, setMsg] = useState('Consultando al backend…')
  useEffect(() => {
    api<{ message: string }>(path, auth ? token : null)
      .then((r) => setMsg(r.message))
      .catch((e: Error) => setMsg(`Error: ${e.message}`))
  }, [path, auth, token])
  return (
    <p>
      Respuesta del backend: <strong>{msg}</strong>
    </p>
  )
}

export function Home() {
  return (
    <>
      <h1>Inicio (pública)</h1>
      <ApiMessage path="/public" />
    </>
  )
}

export function Dashboard() {
  const { user } = useAuth()
  return (
    <>
      <h1>Panel privado</h1>
      <p>
        Hola {user?.name} ({user?.role})
      </p>
      <ApiMessage path="/private" auth />
    </>
  )
}

export function Admin() {
  return (
    <>
      <h1>Administración (solo rol admin)</h1>
      <ApiMessage path="/admin" auth />
    </>
  )
}

export function Forbidden() {
  return <h1>403 – No tenés el rol necesario para ver esta página</h1>
}

export function NotFound() {
  return <h1>404 – Página no encontrada</h1>
}

export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/dashboard'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    try {
      if (mode === 'login') await login(email, password)
      else await register(name, email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ display: 'grid', gap: 8, maxWidth: 320, margin: '0 auto' }}>
      <h1>{mode === 'login' ? 'Iniciar sesión' : 'Registrarse'}</h1>
      {mode === 'register' && (
        <input placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} required />
      )}
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input
        type="password"
        placeholder="Contraseña (mín. 6)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        minLength={6}
        required
      />
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      <button type="submit">{mode === 'login' ? 'Entrar' : 'Crear cuenta'}</button>
      <Link to={mode === 'login' ? '/register' : '/login'}>
        {mode === 'login' ? '¿No tenés cuenta? Registrate' : '¿Ya tenés cuenta? Iniciá sesión'}
      </Link>
    </form>
  )
}
