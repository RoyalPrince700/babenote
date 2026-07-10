export const CATEGORIES = [
  { id: 'love-story', label: 'Love Story', description: 'Full story with memories & letter' },
  { id: 'love-letter', label: 'Love Letter', description: 'A heartfelt written letter' },
  { id: 'love-message', label: 'Love Message', description: 'Short & sweet daily love note' },
  { id: 'marriage-proposal', label: 'Marriage Proposal', description: 'Ask the big question in style' },
  { id: 'i-miss-you', label: 'I Miss You', description: 'When distance makes the heart grow fonder' },
]

export const THEMES = [
  { id: 'dark', label: 'Dark', description: 'Romantic dark rose tones' },
  { id: 'light', label: 'Light', description: 'Soft blush & cream palette' },
]

export function getCategoryLabel(id) {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id
}
