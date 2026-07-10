import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { AuthLayout } from '../layouts/PlatformLayout'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(name, email, password)
      navigate('/templates')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Create your account" subtitle="Start building love pages in minutes">
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Your name
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />
        </label>
        {error && <p className="auth-form__error">{error}</p>}
        <button type="submit" className="platform-btn platform-btn--primary" disabled={loading}>
          {loading ? 'Creating account...' : 'Sign up'}
        </button>
        <p className="auth-form__footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </AuthLayout>
  )
}
