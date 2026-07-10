import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Heart, LogOut, LayoutDashboard, Sparkles, Menu, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import './platform.css'

export default function PlatformLayout() {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  const handleLogout = () => {
    setMenuOpen(false)
    logout()
    navigate('/')
  }

  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="platform">
      <header className="platform-header">
        <Link to="/" className="platform-logo" onClick={closeMenu}>
          <Heart size={20} className="platform-logo__icon" />
          BabeLove
        </Link>

        <button
          type="button"
          className={`platform-nav-toggle ${menuOpen ? 'platform-nav-toggle--open' : ''}`}
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="platform-nav"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {menuOpen && (
          <button
            type="button"
            className="platform-nav-backdrop"
            aria-label="Close menu"
            onClick={closeMenu}
          />
        )}

        <nav
          id="platform-nav"
          className={`platform-nav ${menuOpen ? 'platform-nav--open' : ''}`}
        >
          <Link to="/templates" onClick={closeMenu}>Templates</Link>
          <Link to="/do-you-miss-me" onClick={closeMenu}>Miss Me?</Link>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" onClick={closeMenu}>
                <LayoutDashboard size={16} /> Dashboard
              </Link>
              <span className="platform-nav__user">Hi, {user.name.split(' ')[0]}</span>
              <button type="button" className="platform-btn platform-btn--ghost" onClick={handleLogout}>
                <LogOut size={16} /> Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu}>Log in</Link>
              <Link to="/register" className="platform-btn platform-btn--primary" onClick={closeMenu}>
                Sign up
              </Link>
            </>
          )}
        </nav>
      </header>
      <Outlet />
    </div>
  )
}

export function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__header">
          <Sparkles size={24} className="auth-card__icon" />
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  )
}
