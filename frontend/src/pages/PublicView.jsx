import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../api/client'
import TemplateRenderer from '../templates/TemplateRenderer'

export default function PublicView() {
  const { shareId } = useParams()
  const [creation, setCreation] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.getPublicCreation(shareId)
      .then(({ creation: c }) => setCreation(c))
      .catch((err) => setError(err.message))
  }, [shareId])

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f0a0c', color: '#f5e6eb' }}>
        <p>{error}</p>
      </div>
    )
  }

  if (!creation) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f0a0c', color: '#f5e6eb' }}>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <TemplateRenderer
      category={creation.category}
      content={creation.content}
      theme={creation.theme}
    />
  )
}
