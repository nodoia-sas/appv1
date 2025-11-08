"use client"
import React, { useState, useEffect } from "react"
import { VEHICLE_TYPES as DEFAULT_VEHICLE_TYPES, COLOMBIAN_CITIES_WITH_PICO_Y_PLACA as DEFAULT_CITIES, checkPicoYPlacaStatus as defaultCheck }
  from "../lib/pico-utils"

export default function PicoYPlaca({ setActiveScreen }) {
  // Local state: component autonomous, loads/saves registered vehicles from localStorage
  const [picoYPlacaPlateDomicile, setPicoYPlacaPlateDomicile] = useState("")
  const [picoYPlacaVehicleTypeDomicile, setPicoYPlacaVehicleTypeDomicile] = useState("")
  const [picoYPlacaCityDomicile, setPicoYPlacaCityDomicile] = useState(DEFAULT_CITIES[0] || "")

  const [picoYPlacaPlateOther, setPicoYPlacaPlateOther] = useState("")
  const [picoYPlacaVehicleTypeOther, setPicoYPlacaVehicleTypeOther] = useState("")
  const [picoYPlacaCityOther, setPicoYPlacaCityOther] = useState("")

  const [registeredVehicles, setRegisteredVehicles] = useState([])
  const [consultResult, setConsultResult] = useState("")

  const VEHICLE_TYPES = DEFAULT_VEHICLE_TYPES
  const COLOMBIAN_CITIES_WITH_PICO_Y_PLACA = DEFAULT_CITIES
  const checkPicoYPlacaStatus = defaultCheck

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("transit-user-vehicles") || "[]")
      setRegisteredVehicles(Array.isArray(saved) ? saved : [])
    } catch (e) {
      setRegisteredVehicles([])
    }
  }, [])

  const handlePicoYPlacaConsultDomicile = () => {
    const message = checkPicoYPlacaStatus(picoYPlacaPlateDomicile, picoYPlacaVehicleTypeDomicile, picoYPlacaCityDomicile)
    setConsultResult(message)
  }

  const handlePicoYPlacaConsultOther = () => {
    const message = checkPicoYPlacaStatus(picoYPlacaPlateOther, picoYPlacaVehicleTypeOther, picoYPlacaCityOther)
    setConsultResult(message)
  }

  const forgetVehicle = (id) => {
    const updated = registeredVehicles.filter((v) => v.id !== id)
    setRegisteredVehicles(updated)
    try {
      localStorage.setItem("transit-user-vehicles", JSON.stringify(updated))
    } catch (e) {
      // ignore
    }
  }
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Pico y Placa</h2>
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-md mb-6 text-sm" role="alert">
        <strong className="font-bold">¡Atención!</strong>
        <span className="block sm:inline"> La funcionalidad de Pico y Placa es una simulación. Las reglas reales varían y se actualizan constantemente por cada ciudad. Para información precisa, consulte fuentes oficiales.</span>
      </div>

    <div className="space-y-6">
        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200">
          <h3 className="font-semibold text-gray-800 text-lg mb-3">Pico y Placa en tu Ciudad de Domicilio</h3>
          <div className="mb-4">
            <label htmlFor="pico-plate-domicile" className="block text-gray-700 text-sm font-bold mb-2">Placa:</label>
            <input
              type="text"
              id="pico-plate-domicile"
              placeholder="Ej: ABC123"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={picoYPlacaPlateDomicile}
              onChange={(e) => setPicoYPlacaPlateDomicile(e.target.value.toUpperCase())}
              aria-label="Ingresar placa para Pico y Placa de domicilio"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="pico-vehicle-type-domicile" className="block text-gray-700 text-sm font-bold mb-2">Tipo de Vehículo:</label>
            <select
              id="pico-vehicle-type-domicile"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
              value={picoYPlacaVehicleTypeDomicile}
              onChange={(e) => setPicoYPlacaVehicleTypeDomicile(e.target.value)}
              aria-label="Seleccionar tipo de vehículo para Pico y Placa de domicilio"
            >
              <option value="">Selecciona</option>
              {VEHICLE_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="pico-city-domicile" className="block text-gray-700 text-sm font-bold mb-2">Ciudad:</label>
            <select
              id="pico-city-domicile"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
              value={picoYPlacaCityDomicile}
              onChange={(e) => setPicoYPlacaCityDomicile(e.target.value)}
              aria-label="Seleccionar ciudad de domicilio para Pico y Placa"
            >
              {COLOMBIAN_CITIES_WITH_PICO_Y_PLACA.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          <button onClick={handlePicoYPlacaConsultDomicile} className="w-full bg-orange-500 text-white py-3 px-4 rounded-full font-semibold hover:bg-orange-600 transition-colors duration-200 shadow-md">Consultar</button>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200">
          <h3 className="font-semibold text-gray-800 text-lg mb-3">Pico y Placa en Otra Ciudad</h3>
          <div className="mb-4">
            <label htmlFor="pico-plate-other" className="block text-gray-700 text-sm font-bold mb-2">Placa:</label>
            <input
              type="text"
              id="pico-plate-other"
              placeholder="Ej: XYZ789"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={picoYPlacaPlateOther}
              onChange={(e) => setPicoYPlacaPlateOther(e.target.value.toUpperCase())}
              aria-label="Ingresar placa para Pico y Placa en otra ciudad"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="pico-vehicle-type-other" className="block text-gray-700 text-sm font-bold mb-2">Tipo de Vehículo:</label>
            <select id="pico-vehicle-type-other" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white" value={picoYPlacaVehicleTypeOther} onChange={(e) => setPicoYPlacaVehicleTypeOther(e.target.value)} aria-label="Seleccionar tipo de vehículo para Pico y Placa en otra ciudad">
              <option value="">Selecciona</option>
              {VEHICLE_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="pico-city-other" className="block text-gray-700 text-sm font-bold mb-2">Ciudad:</label>
            <select id="pico-city-other" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white" value={picoYPlacaCityOther} onChange={(e) => setPicoYPlacaCityOther(e.target.value)} aria-label="Seleccionar ciudad para Pico y Placa en otra ciudad">
              <option value="">Selecciona una ciudad</option>
              {COLOMBIAN_CITIES_WITH_PICO_Y_PLACA.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          <button onClick={handlePicoYPlacaConsultOther} className="w-full bg-orange-500 text-white py-3 px-4 rounded-full font-semibold hover:bg-orange-600 transition-colors duration-200 shadow-md">Consultar</button>
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="font-semibold text-gray-800 text-lg mb-3">Resultado</h3>
        {consultResult ? (
          <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700 shadow-sm mb-4">
            <p className={`text-base font-bold ${consultResult.includes("Tiene") ? "text-red-500" : "text-green-500"}`}>{consultResult}</p>
          </div>
        ) : (
          <p className="text-gray-600">Realiza una consulta para ver el resultado aquí.</p>
        )}

        <h3 className="font-semibold text-gray-800 text-lg mb-3 mt-4">Vehículos Registrados</h3>
        {registeredVehicles.length === 0 ? (
          <p className="text-gray-600">No hay vehículos registrados.</p>
        ) : (
          <ul className="space-y-3">
            {registeredVehicles.map((vehicle) => (
              <li key={vehicle.id} className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700 shadow-sm flex justify-between items-start">
                <div>
                  <p><span className="font-semibold">Placa (últimos 2):</span> {vehicle.lastTwoDigits}</p>
                  <p><span className="font-semibold">Tipo:</span> {vehicle.type}</p>
                  <p><span className="font-semibold">Ciudad:</span> {vehicle.city}</p>
                  <p className={`text-base font-bold mt-1 ${checkPicoYPlacaStatus(vehicle.lastTwoDigits, vehicle.type, vehicle.city).includes("Tiene") ? "text-red-500" : "text-green-500"}`}>{checkPicoYPlacaStatus(vehicle.lastTwoDigits, vehicle.type, vehicle.city)}</p>
                </div>
                <div>
                  <button onClick={() => forgetVehicle(vehicle.id)} className="ml-4 bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs hover:bg-red-200">Olvidar</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
