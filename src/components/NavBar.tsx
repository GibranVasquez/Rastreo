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
        <img src="/app-icon.svg" alt="" className="brand-mark" />
        <span className="navbar-user">{session.user.email}</span>
      </div>
      <div className="navbar-links">
        <NavLink to="/scanner" className={({ isActive }) => (isActive ? 'active' : '')}>
          Escanear
        </NavLink>
        <NavLink to="/listado" className={({ isActive }) => (isActive ? 'active' : '')}>
          Listado
        </NavLink>
        <button className="link-btn" onClick={() => supabase.auth.signOut()}>
          Salir
        </button>
      </div>
    </nav>
  )
}
