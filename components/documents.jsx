"use client"

import React, { useEffect, useState } from "react"
import {
  loadDocuments,
  saveDocuments,
  addDocument as addDocumentUtil,
  deleteDocument as deleteDocumentUtil,
  restoreDefaults as restoreDefaultsUtil,
} from "../lib/documents-utils"

export default function Documents({ setActiveScreen }) {
  const [documents, setDocuments] = useState([])
  const [notification, setNotification] = useState({ message: "", visible: false, type: "" })

  useEffect(() => {
    const docs = loadDocuments()
    setDocuments(docs)
  }, [])

  const showNotification = (message, type = "info") => {
    setNotification({ message, visible: true, type })
    setTimeout(() => setNotification({ message: "", visible: false, type: "" }), 3000)
  }

  const calculateDaysRemaining = (dueDate) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const handleDocumentUpload = (id) => {
    const updated = documents.map((doc) => (doc.id === id ? { ...doc, uploaded: !doc.uploaded } : doc))
    setDocuments(updated)
    saveDocuments(updated)
  }

  const deleteDocument = (id) => {
    const updated = deleteDocumentUtil(id)
    setDocuments(updated)
  }

  const addDocument = async ({ name, dueDate, uploaded = false }) => {
    const newDoc = addDocumentUtil({ name, dueDate, uploaded })
    // addDocumentUtil already persists; update local state to reflect saved doc
    setDocuments((prev) => [...prev, newDoc])
    return newDoc
  }

  const restoreDefaults = () => {
    const defaults = restoreDefaultsUtil()
    setDocuments(defaults)
    showNotification("Documentos restaurados (simulado)", "info")
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Mis Documentos</h2>

      <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
        {documents && documents.length === 0 && (
          <p className="text-gray-600 text-center">Aún no tienes documentos registrados.</p>
        )}

        {documents.map((doc) => {
          const daysRemaining = calculateDaysRemaining(doc.dueDate)
          const statusColor = daysRemaining <= 30 ? "text-red-500" : daysRemaining <= 90 ? "text-orange-500" : "text-green-500"
          return (
            <div
              key={doc.id}
              className="bg-white p-4 rounded-xl shadow-md border border-gray-200 flex items-center justify-between"
            >
              <div>
                <h3 className="font-semibold text-gray-800">{doc.name}</h3>
                <p className="text-sm text-gray-600">Vencimiento: {doc.dueDate}</p>
                <p className={`text-sm font-bold ${statusColor}`}>{daysRemaining > 0 ? `Faltan ${daysRemaining} días` : "Vencido"}</p>
                <p className="text-xs text-gray-500 mt-1">{doc.uploaded ? "Estado: Subido" : "Estado: No subido"}</p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDocumentUpload(doc.id)}
                  className="bg-blue-600 text-white py-2 px-3 rounded-full text-sm hover:bg-blue-700 transition-colors duration-200 shadow-md"
                >
                  {doc.uploaded ? "Marcar no subido" : "Marcar subido"}
                </button>
                <button
                  onClick={() => {
                    if (confirm("¿Eliminar documento?")) {
                      deleteDocument(doc.id)
                      showNotification("Documento eliminado", "info")
                    }
                  }}
                  className="bg-red-100 text-red-600 py-2 px-3 rounded-full text-sm hover:bg-red-200 transition-colors duration-200 shadow-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>
          )
        })}

        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-3">Agregar documento</h3>
          <p className="text-sm text-gray-600 mb-3">Puedes agregar un documento rápidamente desde aquí.</p>
          <div className="flex space-x-2">
            <button
              onClick={async () => {
                const name = prompt("Nombre del documento (ej: Licencia de Conducción):")
                if (!name) return
                const dueDate = prompt("Fecha de vencimiento (YYYY-MM-DD):")
                if (!dueDate) return
                await addDocument({ name, dueDate, uploaded: false })
                showNotification("Documento agregado", "success")
              }}
              className="bg-green-600 text-white py-2 px-4 rounded-full text-sm hover:bg-green-700 transition-colors duration-200 shadow-md"
            >
              Agregar Documento
            </button>
            <button onClick={restoreDefaults} className="bg-gray-100 text-gray-700 py-2 px-4 rounded-full text-sm hover:bg-gray-200 transition-colors duration-200 shadow-sm">
              Restaurar por defecto
            </button>
          </div>
        </div>
      </div>

      {notification.visible && (
        <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full shadow-lg text-white z-50 transition-all duration-300 ${notification.type === "success" ? "bg-green-500" : "bg-blue-500"}`}>
          {notification.message}
        </div>
      )}
    </div>
  )
}
