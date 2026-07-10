import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { AuthLayout } from '../layouts/PlatformLayout'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to manage your love creations">
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        {error && <p className="auth-form__error">{error}</p>}
        <button type="submit" className="platform-btn platform-btn--primary" disabled={loading}>
          {loading ? 'Logging in...' : 'Log in'}
        </button>
        <p className="auth-form__footer">
          No account? <Link to="/register">Sign up free</Link>
        </p>
      </form>
    </AuthLayout>
  )
}
