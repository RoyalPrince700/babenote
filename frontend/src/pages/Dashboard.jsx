import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ExternalLink, Pencil, Trash2 } from 'lucide-react'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { getCategoryLabel } from '../constants/templates'

export default function Dashboard() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [creations, setCreations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    api.getCreations()
      .then(({ creations: c }) => setCreations(c))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [isAuthenticated, navigate])

  const handleDelete = async (id) => {
    if (!confirm('Delete this creation?')) return
    await api.deleteCreation(id)
    setCreations((prev) => prev.filter((c) => c._id !== id))
  }

  if (!isAuthenticated) return null

  return (
    <div className="platform-main">
      <h1 className="platform-section-title">My creations</h1>
      <p className="platform-section-sub">Edit, preview, or share your love pages.</p>

      {loading ? (
        <p className="empty-state">Loading...</p>
      ) : creations.length === 0 ? (
        <div className="empty-state">
          <p>You have not created anything yet.</p>
          <Link to="/templates" className="platform-btn platform-btn--primary" style={{ marginTop: '1rem' }}>
            Browse templates
          </Link>
        </div>
      ) : (
        <div className="dashboard-list">
          {creations.map((c) => (
            <div key={c._id} className="creation-row">
              <div>
                <h3>{c.title}</h3>
                <p>{getCategoryLabel(c.category)} · {c.theme} theme · Updated {new Date(c.updatedAt).toLocaleDateString()}</p>
              </div>
              <div className="creation-row__actions">
                <Link to={`/p/${c.shareId}`} className="platform-btn platform-btn--ghost" target="_blank">
                  <ExternalLink size={14} /> View
                </Link>
                <Link to={`/customize/${c.template.slug}?edit=${c._id}`} className="platform-btn platform-btn--outline">
                  <Pencil size={14} /> Edit
                </Link>
                <button type="button" className="platform-btn platform-btn--ghost" onClick={() => handleDelete(c._id)}>
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
