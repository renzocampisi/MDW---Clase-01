import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import './App.css'
import { AuthProvider, useAuth } from './auth/AuthContext'
import { PrivateRoute, RoleRoute } from './auth/guards'
import { Admin, AuthForm, Dashboard, Forbidden, Home, NotFound } from './pages/Pages'

function NavBar() {
  const { user, logout } = useAuth()
  return (
    <nav style={{ display: 'flex', gap: 16, padding: 16, justifyContent: 'center' }}>
      <Link to="/">Inicio</Link>
      {user && <Link to="/dashboard">Panel</Link>}
      {user?.role === 'admin' && <Link to="/admin">Admin</Link>}
      {user ? (
        <button onClick={logout}>Salir ({user.email})</button>
      ) : (
        <>
          <Link to="/login">Ingresar</Link>
          <Link to="/register">Registrarse</Link>
        </>
      )}
    </nav>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NavBar />
        <main style={{ padding: 16 }}>
          <Routes>
            {/* Públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<AuthForm mode="login" />} />
            <Route path="/register" element={<AuthForm mode="register" />} />
            <Route path="/forbidden" element={<Forbidden />} />

            {/* Privadas: requieren sesión */}
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>

            {/* Privadas por rol: requieren sesión + rol admin */}
            <Route element={<RoleRoute roles={['admin']} />}>
              <Route path="/admin" element={<Admin />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
