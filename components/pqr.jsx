"use client"
import React from "react"

export default function Pqr({ setActiveScreen, pqrQuestion, setPqrQuestion, handlePqrSubmit }) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Preguntas, Quejas y Reclamos (PQR)</h2>
      <button
        onClick={() => setActiveScreen("home")}
        className="mb-4 bg-gray-300 text-gray-800 py-2 px-4 rounded-full text-sm hover:bg-gray-400 transition-colors duration-200 shadow-md"
      >
        ← Volver al Inicio
      </button>
      <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
        <p className="text-gray-700 mb-4">
          ¿Tienes alguna pregunta sobre tránsito que te gustaría que incluimos en nuestra sección de Conocimiento?
          ¡Escríbenos!
        </p>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 resize-none"
          rows={6}
          placeholder="Escribe tu mensaje aquí"
          value={pqrQuestion}
          onChange={(e) => setPqrQuestion(e.target.value)}
          aria-label="Campo para escribir tu pregunta, queja o reclamo"
        ></textarea>
        <button
          onClick={handlePqrSubmit}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-full font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md"
        >
          Enviar Pregunta
        </button>
      </div>
    </div>
  )
}
