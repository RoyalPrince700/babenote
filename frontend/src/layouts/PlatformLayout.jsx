import { Outlet } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import './platform.css'

export default function PlatformLayout() {
  return (
    <div className="platform platform--miss-me platform--no-nav">
      {/* Navbar commented out — site not ready; Miss Me is the landing page
      <header className="platform-header">
        <Link to="/" className="platform-logo">
          <Heart size={20} className="platform-logo__icon" />
          BabeLove
        </Link>
        <nav id="platform-nav" className="platform-nav">
          <Link to="/templates">Templates</Link>
          <Link to="/do-you-miss-me">Miss Me?</Link>
          <Link to="/login">Log in</Link>
          <Link to="/register" className="platform-btn platform-btn--primary">Sign up</Link>
        </nav>
      </header>
      */}
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
