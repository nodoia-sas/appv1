// Utilities for handling favorites storage and queries
export function getFavorites() {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('transit-favorites') : null
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    return []
  }
}

export function saveFavorites(favorites) {
  try {
    if (typeof window !== 'undefined') localStorage.setItem('transit-favorites', JSON.stringify(favorites))
  } catch (e) {
    // ignore
  }
}

export function hasFavorite(favorites, originalId, type) {
  if (!Array.isArray(favorites)) return false
  return favorites.some((f) => f && f.originalId === originalId && f.type === type)
}

export function toggleFavorite(favorites, item, type) {
  const exists = hasFavorite(favorites, item.id || item.originalId, type)
  let updated = Array.isArray(favorites) ? [...favorites] : []
  if (exists) {
    updated = updated.filter((f) => !(f.originalId === (item.id || item.originalId) && f.type === type))
  } else {
    updated.push({ originalId: item.id || item.originalId, type, addedAt: new Date().toISOString() })
  }
  saveFavorites(updated)
  return updated
}
