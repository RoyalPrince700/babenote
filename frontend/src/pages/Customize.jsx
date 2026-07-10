import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'
import ContentEditor from '../components/ContentEditor'
import TemplateRenderer from '../templates/TemplateRenderer'

export default function Customize() {
  const { slug } = useParams()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('edit')
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [template, setTemplate] = useState(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState(null)
  const [theme, setTheme] = useState('dark')
  const [saving, setSaving] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/customize/${slug}` } })
    }
  }, [isAuthenticated, navigate, slug])

  useEffect(() => {
    async function load() {
      try {
        const { template: t } = await api.getTemplate(slug)
        setTemplate(t)
        setTheme(t.theme)

        if (editId) {
          const { creations } = await api.getCreations()
          const existing = creations.find((c) => c._id === editId)
          if (existing) {
            setTitle(existing.title)
            setContent(existing.content)
            setTheme(existing.theme)
            setShareUrl(`${window.location.origin}/p/${existing.shareId}`)
            return
          }
        }

        setTitle(`For ${t.defaultContent.herName}`)
        setContent(structuredClone(t.defaultContent))
      } catch (err) {
        setError(err.message)
      }
    }
    if (isAuthenticated) load()
  }, [slug, editId, isAuthenticated])

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      if (editId) {
        const { creation } = await api.updateCreation(editId, { title, content, theme })
        setShareUrl(`${window.location.origin}/p/${creation.shareId}`)
      } else {
        const { creation } = await api.createCreation({
          templateSlug: slug,
          title,
          content,
          theme,
        })
        setShareUrl(`${window.location.origin}/p/${creation.shareId}`)
        navigate(`/customize/${slug}?edit=${creation._id}`, { replace: true })
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (!isAuthenticated) return null
  if (error && !template) return <div className="platform-main"><p className="auth-form__error">{error}</p></div>
  if (!template || !content) return <div className="platform-main"><p className="empty-state">Loading editor...</p></div>

  return (
    <div className="customize-layout">
      <aside className="customize-editor">
        <Link to="/templates" style={{ fontSize: '0.85rem', color: '#c45c7a' }}>&larr; Back to templates</Link>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', margin: '1rem 0 0.25rem' }}>{template.name}</h2>
        <p style={{ color: '#6b5860', fontSize: '0.9rem', marginBottom: '1.25rem' }}>Customize every detail, then save & share.</p>

        <div className="editor-field">
          <label>Page title (for your dashboard)</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div className="editor-field">
          <label>Theme</label>
          <select value={theme} onChange={(e) => setTheme(e.target.value)} style={{ padding: '0.6rem', borderRadius: 8, border: '1px solid #e8d8de' }}>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </div>

        <ContentEditor category={template.category} content={content} onChange={setContent} />

        {error && <p className="auth-form__error">{error}</p>}

        <button type="button" className="platform-btn platform-btn--primary" onClick={handleSave} disabled={saving} style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
          {saving ? 'Saving...' : editId ? 'Update & get link' : 'Save & get share link'}
        </button>

        {shareUrl && (
          <div className="share-box">
            <strong>Share this with your babe:</strong>
            <input type="text" readOnly value={shareUrl} onFocus={(e) => e.target.select()} />
          </div>
        )}
      </aside>

      <div className="customize-preview">
        <div className="customize-preview__label">Live preview</div>
        <TemplateRenderer category={template.category} content={content} theme={theme} />
      </div>
    </div>
  )
}
