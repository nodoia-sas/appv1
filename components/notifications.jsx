"use client"
import React, { useEffect, useState } from "react"
import { checkPicoYPlacaStatus } from "../lib/pico-utils"

export default function Notifications({ setActiveScreen }) {
  const [registeredVehicles, setRegisteredVehicles] = useState([])
  const [documents, setDocuments] = useState([])
  const [notification, setNotification] = useState({ message: "", visible: false, type: "" })

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("transit-user-vehicles") || "[]")
      setRegisteredVehicles(Array.isArray(saved) ? saved : [])
    } catch (e) {
      setRegisteredVehicles([])
    }

    try {
      const docs = JSON.parse(localStorage.getItem("transit-user-documents") || "[]")
      setDocuments(Array.isArray(docs) ? docs : [])
    } catch (e) {
      setDocuments([])
    }
  }, [])

  const showNotification = (message, type = "info") => {
    setNotification({ message, visible: true, type })
    setTimeout(() => setNotification({ message: "", visible: false, type: "" }), 3000)
  }

  const calculateDaysRemaining = (dueDate) => {
    try {
      const today = new Date()
      const due = new Date(dueDate)
      const diffTime = due - today
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays
    } catch (e) {
      return Infinity
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Notificaciones</h2>
      <button
        onClick={() => setActiveScreen("home")}
        className="mb-4 bg-gray-300 text-gray-800 py-2 px-4 rounded-full text-sm hover:bg-gray-400 transition-colors duration-200 shadow-md"
      >
        ← Volver al Inicio
      </button>
      <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 mb-6">
        <h3 className="font-semibold text-gray-800 text-lg mb-3">Tus Multas</h3>
        <p className="text-green-600 font-semibold">No tienes multas registradas en las páginas oficiales</p>
        <button
          onClick={() => showNotification("Redirigir a consulta SIMIT (simulado)", "info")}
          className="mt-4 w-full bg-orange-500 text-white py-2 px-4 rounded-full hover:bg-orange-600 transition-colors duration-200 text-sm shadow-md"
          aria-label="Consultar multas en SIMIT"
        >
          Consultar en SIMIT
        </button>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 mb-6">
        <h3 className="font-semibold text-gray-800 text-lg mb-3">Pico y Placa para tus Vehículos Registrados</h3>
        {registeredVehicles.length === 0 ? (
          <p className="text-gray-600">Aún no tienes vehículos registrados. Regístralos para recibir notificaciones de pico y placa.</p>
        ) : (
          <ul className="space-y-3">
            {registeredVehicles.map((vehicle) => (
              <li key={vehicle.id} className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700 shadow-sm">
                <p>
                  <span className="font-semibold">Placa (últimos 2):</span> {vehicle.lastTwoDigits}
                </p>
                <p>
                  <span className="font-semibold">Tipo:</span> {vehicle.type}
                </p>
                <p>
                  <span className="font-semibold">Ciudad:</span> {vehicle.city}
                </p>
                <p className={`text-base font-bold mt-1 ${checkPicoYPlacaStatus(vehicle.lastTwoDigits, vehicle.type, vehicle.city).includes("Tiene") ? "text-red-500" : "text-green-500"}`}>
                  {checkPicoYPlacaStatus(vehicle.lastTwoDigits, vehicle.type, vehicle.city)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200">
        <h3 className="font-semibold text-gray-800 text-lg mb-3">Recordatorio de Documentos</h3>
        <div className="space-y-3">
          {documents.map((doc) => {
            const daysRemaining = calculateDaysRemaining(doc.dueDate)
            const statusColor = daysRemaining <= 30 ? "text-red-500" : daysRemaining <= 90 ? "text-orange-500" : "text-green-500"
            return (
              <div key={doc.id} className="flex items-center justify-between text-gray-700 text-sm">
                <span>{doc.name}</span>
                <span className={`font-bold ${statusColor}`}>{daysRemaining > 0 ? `Faltan ${daysRemaining} días` : "Vencido"}</span>
              </div>
            )
          })}
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
