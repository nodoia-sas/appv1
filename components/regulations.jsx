"use client"
import React from "react"

export default function Regulations({ regulationsData, setActiveScreen, setSelectedRegulation }) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Normatividad Vial</h2>
      <button
        onClick={() => setActiveScreen("home")}
        className="mb-4 bg-gray-300 text-gray-800 py-2 px-4 rounded-full text-sm hover:bg-gray-400 transition-colors duration-200 shadow-md"
      >
        ← Volver al Inicio
      </button>
      <p className="text-gray-600 text-center mb-6">Principales normas de tránsito en Colombia.</p>
      <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
        {regulationsData.map((regulation) => (
          <div
            key={regulation.id}
            className="bg-white p-5 rounded-xl shadow-md border border-gray-200 transition-all duration-200 hover:shadow-lg"
          >
            <h3 className="font-semibold text-gray-800 text-lg mb-2">{regulation.title}</h3>
            <p className="text-gray-700 text-sm leading-relaxed">{regulation.summary}</p>
            <button
              onClick={() => {
                setActiveScreen("regulation-detail")
                setSelectedRegulation(regulation)
              }}
              className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded-full text-sm hover:bg-blue-600 transition-colors duration-200 shadow-md hover:shadow-lg"
              aria-label={`Ver detalle de ${regulation.title}`}
            >
              Ver en detalle
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
