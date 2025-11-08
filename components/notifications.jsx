"use client"
import React from "react"

export default function Notifications({
  setActiveScreen,
  registeredVehicles,
  checkPicoYPlacaStatus,
  documents,
  calculateDaysRemaining,
  showNotification,
}) {
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
    </div>
  )
}
