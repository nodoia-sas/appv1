"use client"
import React, { useEffect, useState } from "react"
import { DEFAULT_NEWS_ITEMS, fetchNews } from "../lib/news-utils"
import { getFavorites, toggleFavorite, hasFavorite } from "../lib/favorites-utils"
import { StarIcon as DefaultStar } from "./icons-placeholder"

export default function News({ setActiveScreen }) {
  const [newsItems, setNewsItems] = useState(DEFAULT_NEWS_ITEMS)
  const [expandedState, setExpandedState] = useState({})
  const StarIcon = DefaultStar

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const data = await fetchNews()
      if (mounted) {
        const items = Array.isArray(data) ? data : DEFAULT_NEWS_ITEMS
        const favs = getFavorites()
        setNewsItems(items.map((it) => ({ ...it, saved: hasFavorite(favs, it.id, "news") })))
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const toggleNewsExpanded = (id) => setExpandedState((s) => ({ ...s, [id]: !s[id] }))

  const handleToggleFavorite = (item) => {
    try {
      const favs = getFavorites()
      const updated = toggleFavorite(favs, item, "news")
      const nowSaved = hasFavorite(updated, item.id, "news")
      setNewsItems((prev) => prev.map((n) => (n.id === item.id ? { ...n, saved: nowSaved } : n)))
    } catch (e) {
      // ignore
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Noticias y Novedades</h2>
      <button
        onClick={() => setActiveScreen("home")}
        className="mb-4 bg-gray-300 text-gray-800 py-2 px-4 rounded-full text-sm hover:bg-gray-400 transition-colors duration-200 shadow-md"
      >
        ← Volver al Inicio
      </button>
      <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
        {newsItems.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-xl shadow-md border border-gray-200 transition-all duration-200 hover:shadow-lg">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-gray-800 text-lg pr-4">{item.title}</h3>
              <button
                onClick={() => handleToggleFavorite(item)}
                className="p-1 rounded-full text-gray-400 hover:text-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors duration-200"
                aria-label={item.saved ? "Eliminar de Favoritos" : "Guardar en Favoritos"}
              >
                <StarIcon className={`w-6 h-6 ${item.saved ? "text-yellow-400" : "text-gray-400"}`} />
              </button>
            </div>
            {item.imageUrl && (
              <div className="mb-4 flex justify-center">
                <img src={item.imageUrl || "/placeholder.svg"} alt={`Imagen de ${item.title}`} className="rounded-lg max-h-40 w-full object-cover" />
              </div>
            )}
            <p className="text-gray-700 mt-2 text-sm leading-relaxed">{expandedState[item.id] ? item.fullContent : item.summary}</p>
            <button
              onClick={() => toggleNewsExpanded(item.id)}
              className="mt-4 w-full bg-purple-500 text-white py-2 px-4 rounded-full hover:bg-purple-600 transition-colors duration-200 text-sm shadow-md hover:shadow-lg"
            >
              {expandedState[item.id] ? "Ver menos" : "Ver más"}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
