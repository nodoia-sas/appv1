"use client"
import React, { useEffect, useState, useCallback } from "react"
import Pqr from "./pqr"
import { fetchPqrs, addPqr, clearPqrs } from "../lib/pqr-utils"

export default function PqrMain({ setActiveScreen, showNotification }) {
  const [pqrQuestion, setPqrQuestion] = useState("")
  const [pqrs, setPqrs] = useState([])

  useEffect(() => {
    const data = fetchPqrs()
    setPqrs(data)
  }, [])

  const handlePqrSubmit = useCallback(async () => {
    if (pqrQuestion.trim() === "") {
      if (typeof showNotification === "function") showNotification("Por favor, escribe tu pregunta antes de enviar.", "info")
      return
    }

    const pqrData = {
      id: Date.now().toString(),
      question: pqrQuestion,
      timestamp: new Date().toISOString(),
    }

    const updated = addPqr(pqrData)
    if (updated) {
      setPqrs(updated)
      if (typeof showNotification === "function") showNotification("¡Gracias! Tu pregunta ha sido enviada.", "success")
      setPqrQuestion("")
    } else {
      if (typeof showNotification === "function") showNotification("No se pudo guardar tu pregunta. Intenta de nuevo.", "error")
    }
  }, [pqrQuestion, showNotification])

  const handleClearHistory = useCallback(() => {
    const cleared = clearPqrs()
    if (cleared !== null) {
      setPqrs([])
      if (typeof showNotification === "function") showNotification("Historial borrado.", "info")
    } else {
      if (typeof showNotification === "function") showNotification("No se pudo borrar el historial.", "error")
    }
  }, [showNotification])

  return (
    <div>
      <Pqr
        setActiveScreen={setActiveScreen}
        pqrQuestion={pqrQuestion}
        setPqrQuestion={setPqrQuestion}
        handlePqrSubmit={handlePqrSubmit}
      />

      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Historial de PQRs</h3>
        {pqrs.length === 0 ? (
          <p className="text-gray-600">No hay preguntas enviadas aún.</p>
        ) : (
          <div className="space-y-3 max-h-[200px] overflow-y-auto">
            {pqrs
              .slice()
              .reverse()
              .map((p) => (
                <div key={p.id} className="bg-white p-3 rounded-lg border border-gray-200">
                  <div className="text-sm text-gray-700">{p.question}</div>
                  <div className="text-xs text-gray-400 mt-1">{new Date(p.timestamp).toLocaleString()}</div>
                </div>
              ))}
          </div>
        )}

        <div className="mt-4 flex space-x-2">
          <button
            onClick={handleClearHistory}
            className="bg-red-500 text-white py-2 px-3 rounded-full text-sm hover:bg-red-600 transition-colors duration-150"
          >
            Borrar historial
          </button>
        </div>
      </div>
    </div>
  )
}
