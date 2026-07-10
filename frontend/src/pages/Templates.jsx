import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { api } from '../api/client'
import { CATEGORIES, THEMES, getCategoryLabel } from '../constants/templates'

export default function Templates() {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('')
  const [theme, setTheme] = useState('')

  useEffect(() => {
    setLoading(true)
    const params = {}
    if (category) params.category = category
    if (theme) params.theme = theme
    api.getTemplates(params)
      .then(({ templates: t }) => setTemplates(t))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [category, theme])

  return (
    <div className="platform-main">
      <h1 className="platform-section-title">Choose a template</h1>
      <p className="platform-section-sub">Pick a category and theme, then customize every word for your babe.</p>

      <div className="filters">
        <button
          type="button"
          className={`filter-chip ${!category ? 'filter-chip--active' : ''}`}
          onClick={() => setCategory('')}
        >
          All categories
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`filter-chip ${category === c.id ? 'filter-chip--active' : ''}`}
            onClick={() => setCategory(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="filters">
        <button
          type="button"
          className={`filter-chip ${!theme ? 'filter-chip--active' : ''}`}
          onClick={() => setTheme('')}
        >
          All themes
        </button>
        {THEMES.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`filter-chip ${theme === t.id ? 'filter-chip--active' : ''}`}
            onClick={() => setTheme(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="empty-state">Loading templates...</p>
      ) : templates.length === 0 ? (
        <div className="empty-state">
          <p>No templates found. Make sure the backend is running and seeded.</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>Run: <code>npm run seed</code> in the backend folder.</p>
        </div>
      ) : (
        <div className="template-grid">
          {templates.map((t) => (
            <article key={t._id} className="template-card">
              <div className={`template-card__preview template-card__preview--${t.theme}`}>
                <Heart size={36} strokeWidth={1.25} style={{ color: t.previewAccent }} />
                <span className="template-card__badge">{t.theme}</span>
              </div>
              <div className="template-card__body">
                <h3>{t.name}</h3>
                <p>{t.description}</p>
                <div className="template-card__meta">
                  <span className="template-card__tag">{getCategoryLabel(t.category)}</span>
                  <span className="template-card__tag">{t.theme}</span>
                </div>
                <Link to={`/customize/${t.slug}`} className="platform-btn platform-btn--primary">
                  Customize
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
