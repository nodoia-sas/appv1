"use client"

import React from "react"

const UnderConstruction = ({ setActiveScreen, showNotification }) => {
  return (
    <div className="p-6 flex flex-col items-center justify-center h-full">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-2">Módulo en construcción</h2>
        <p className="text-gray-600 mb-4">
          Estamos trabajando. Pronto estará disponible con contenido.
        </p>
        <div className="flex items-center justify-center space-x-3">
          <button
            onClick={() => setActiveScreen("home")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-150"
          >
            Volver al inicio
          </button>
          <button
            onClick={() => {
              // Simulate subscribe action
              try {
                const subs = JSON.parse(localStorage.getItem("transit-knowledge-subs") || "[]")
                subs.push({ id: Date.now().toString(), date: new Date().toISOString() })
                localStorage.setItem("transit-knowledge-subs", JSON.stringify(subs))
                showNotification("Te avisaremos cuando el módulo esté listo", "success")
              } catch (e) {
                showNotification("No se pudo suscribir en este momento", "error")
              }
            }}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-150"
          >
            Avisarme
          </button>
        </div>
      </div>
      <div className="mt-6 text-xs text-gray-500">Versión beta — contenido sujeto a cambios</div>
    </div>
  )
}

export default UnderConstruction
