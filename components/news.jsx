"use client"
import React from "react"

export default function News({ setActiveScreen, newsItems, toggleNewsExpanded, handleToggleFavorite, StarIcon }) {
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
                onClick={() => handleToggleFavorite(item, "news")}
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
            <p className="text-gray-700 mt-2 text-sm leading-relaxed">{item.expanded ? item.fullContent : item.summary}</p>
            <button
              onClick={() => toggleNewsExpanded(item.id)}
              className="mt-4 w-full bg-purple-500 text-white py-2 px-4 rounded-full hover:bg-purple-600 transition-colors duration-200 text-sm shadow-md hover:shadow-lg"
            >
              {item.expanded ? "Ver menos" : "Ver más"}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
