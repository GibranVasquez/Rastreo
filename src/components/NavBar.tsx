import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export function NavBar() {
  const { session } = useAuth()
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  if (!session) return null

  const email = session.user.email ?? ''
  const inicial = email.charAt(0).toUpperCase()

  return (
    <nav className={`navbar${pathname.startsWith('/scanner') ? ' navbar-dark' : ''}`}>
      <div className="brand-lockup">
        <NavLink to="/" style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/app-icon.svg" alt="" className="brand-mark" />
        </NavLink>
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

        <div className="navbar-avatar-wrap" ref={menuRef}>
          <button
            type="button"
            className="navbar-avatar"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Cuenta"
          >
            {inicial}
          </button>
          {menuOpen && (
            <div className="navbar-menu">
              <div className="navbar-menu-email">{email}</div>
              <button
                type="button"
                className="link-btn danger"
                onClick={() => supabase.auth.signOut()}
              >
                Salir
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
