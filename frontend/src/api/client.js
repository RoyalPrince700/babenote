const API_BASE = '/api'

function getToken() {
  return localStorage.getItem('token')
}

async function request(path, options = {}) {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })
  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong')
  }
  return data
}

export const api = {
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  me: () => request('/auth/me'),
  getTemplates: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return request(`/templates${query ? `?${query}` : ''}`)
  },
  getTemplate: (slug) => request(`/templates/${slug}`),
  getCreations: () => request('/creations'),
  getPublicCreation: (shareId) => request(`/creations/public/${shareId}`),
  createCreation: (body) => request('/creations', { method: 'POST', body: JSON.stringify(body) }),
  updateCreation: (id, body) => request(`/creations/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteCreation: (id) => request(`/creations/${id}`, { method: 'DELETE' }),
}
