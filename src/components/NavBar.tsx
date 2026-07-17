import { NavLink, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export function NavBar() {
  const { session } = useAuth()
  const { pathname } = useLocation()
  if (!session) return null

  return (
    <nav className={`navbar${pathname.startsWith('/scanner') ? ' navbar-dark' : ''}`}>
      <div className="brand-lockup">
        <NavLink to="/" style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/app-icon.svg" alt="" className="brand-mark" />
        </NavLink>
        <span className="navbar-user">{session.user.email}</span>
      </div>
      <div className="navbar-links">
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
          Inicio
        </NavLink>
        <NavLink to="/scanner" className={({ isActive }) => (isActive ? 'active' : '')}>
          Escanear
        </NavLink>
        <NavLink to="/listado" className={({ isActive }) => (isActive ? 'active' : '')}>
          Listado
        </NavLink>
        <NavLink to="/almacenes" className={({ isActive }) => (isActive ? 'active' : '')}>
          Almacenes
        </NavLink>
        <button className="link-btn" onClick={() => supabase.auth.signOut()}>
          Salir
        </button>
      </div>
    </nav>
  )
}
