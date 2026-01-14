/**
 * News Service
 * Handles news data fetching and business logic
 */

const DEFAULT_NEWS_ITEMS = [
  {
    id: 1,
    title: "Actualización de normas de tránsito",
    summary: "Resumen breve de cambios en la normativa.",
    fullContent: "Detalle ampliado de la noticia.",
    imageUrl: "",
  },
];

/**
 * Fetch news from API or return defaults
 * @param {string} apiUrl - Optional API endpoint
 * @returns {Promise<Array>} News items
 */
export async function fetchNews(apiUrl) {
  if (!apiUrl) return DEFAULT_NEWS_ITEMS;

  try {
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error("Network response was not ok");
    const data = await res.json();
    return Array.isArray(data) ? data : DEFAULT_NEWS_ITEMS;
  } catch (e) {
    console.warn("fetchNews failed, falling back to default", e);
    return DEFAULT_NEWS_ITEMS;
  }
}

export const newsService = {
  fetchNews,
  getDefaultNews: () => DEFAULT_NEWS_ITEMS,
};
