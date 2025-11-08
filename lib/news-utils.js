// news-utils: central source for news data and future API integration

export const DEFAULT_NEWS_ITEMS = [
  {
    id: 1,
    title: "Actualización de normas de tránsito",
    summary: "Resumen breve de cambios en la normativa.",
    fullContent: "Detalle ampliado de la noticia.",
    imageUrl: "",
  },
]

// Stub for fetching news from an API in the future
export async function fetchNews(apiUrl) {
  if (!apiUrl) return DEFAULT_NEWS_ITEMS
  try {
    const res = await fetch(apiUrl)
    if (!res.ok) throw new Error('Network response was not ok')
    const data = await res.json()
    return data
  } catch (e) {
    console.warn('fetchNews failed, falling back to default', e)
    return DEFAULT_NEWS_ITEMS
  }
}
