import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'
import type { Role } from './AuthContext'

// Ruta privada: solo usuarios autenticados
export function PrivateRoute() {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return <p>Cargando…</p>
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />
  return <Outlet />
}

// Ruta privada protegida por rol: autenticado y con alguno de los roles requeridos
export function RoleRoute({ roles }: { roles: Role[] }) {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return <p>Cargando…</p>
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />
  if (!roles.includes(user.role)) return <Navigate to="/forbidden" replace />
  return <Outlet />
}
