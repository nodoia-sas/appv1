"use client"
import React from "react"

export default function RegulationDetail({ selectedRegulation, setActiveScreen, setSelectedRegulation }) {
  return (
    <div className="p-6">
      <button
        onClick={() => {
          setActiveScreen("regulations-main")
          setSelectedRegulation(null)
        }}
        className="mb-4 bg-gray-300 text-gray-800 py-2 px-4 rounded-full text-sm hover:bg-gray-400 transition-colors duration-200 shadow-md"
      >
        ← Volver a Normatividad
      </button>
      {selectedRegulation && (
        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 max-h-[calc(100vh-150px)] overflow-y-auto pr-2">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">{selectedRegulation.title}</h2>
          <p className="text-gray-700 text-sm leading-relaxed mb-4">{selectedRegulation.summary}</p>
          <h3 className="text-xl font-bold text-gray-800 mb-3">Artículos Clave:</h3>
          <div className="space-y-4">
            {selectedRegulation.articles && selectedRegulation.articles.length > 0 ? (
              selectedRegulation.articles.map((article, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <p className="font-semibold text-gray-800">Artículo {article.number}:</p>
                  <p className="text-sm text-gray-700">{article.summary}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-600 italic">No hay artículos detallados disponibles para esta normativa.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
