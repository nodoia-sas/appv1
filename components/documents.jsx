"use client"

import React from "react"

export default function Documents({
  setActiveScreen,
  documents,
  calculateDaysRemaining,
  handleDocumentUpload,
  deleteDocument,
  showNotification,
  addDocument,
  setDocuments,
  saveToLocalStorage,
  ALL_DOCUMENTS_DATA,
}) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Mis Documentos</h2>

      <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
        {documents && documents.length === 0 && (
          <p className="text-gray-600 text-center">Aún no tienes documentos registrados.</p>
        )}

        {documents.map((doc) => {
          const daysRemaining = calculateDaysRemaining(doc.dueDate)
          const statusColor =
            daysRemaining <= 30 ? "text-red-500" : daysRemaining <= 90 ? "text-orange-500" : "text-green-500"
          return (
            <div
              key={doc.id}
              className="bg-white p-4 rounded-xl shadow-md border border-gray-200 flex items-center justify-between"
            >
              <div>
                <h3 className="font-semibold text-gray-800">{doc.name}</h3>
                <p className="text-sm text-gray-600">Vencimiento: {doc.dueDate}</p>
                <p className={`text-sm font-bold ${statusColor}`}>
                  {daysRemaining > 0 ? `Faltan ${daysRemaining} días` : "Vencido"}
                </p>
                <p className="text-xs text-gray-500 mt-1">{doc.uploaded ? "Estado: Subido" : "Estado: No subido"}</p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    handleDocumentUpload(doc.id)
                  }}
                  className="bg-blue-600 text-white py-2 px-3 rounded-full text-sm hover:bg-blue-700 transition-colors duration-200 shadow-md"
                >
                  {doc.uploaded ? "Marcar no subido" : "Marcar subido"}
                </button>
                <button
                  onClick={() => {
                    if (confirm('¿Eliminar documento?')) {
                      deleteDocument(doc.id)
                      showNotification('Documento eliminado', 'info')
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
                const name = prompt('Nombre del documento (ej: Licencia de Conducción):')
                if (!name) return
                const dueDate = prompt('Fecha de vencimiento (YYYY-MM-DD):')
                if (!dueDate) return
                await addDocument({ name, dueDate, uploaded: false })
                showNotification('Documento agregado', 'success')
              }}
              className="bg-green-600 text-white py-2 px-4 rounded-full text-sm hover:bg-green-700 transition-colors duration-200 shadow-md"
            >
              Agregar Documento
            </button>
            <button
              onClick={() => {
                setDocuments(ALL_DOCUMENTS_DATA)
                saveToLocalStorage('transit-user-documents', ALL_DOCUMENTS_DATA)
                showNotification('Documentos restaurados (simulado)', 'info')
              }}
              className="bg-gray-100 text-gray-700 py-2 px-4 rounded-full text-sm hover:bg-gray-200 transition-colors duration-200 shadow-sm"
            >
              Restaurar por defecto
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
