"use client"

import React, { useEffect, useState } from 'react'
import { VEHICLE_TYPES, COLOMBIAN_CITIES_WITH_PICO_Y_PLACA } from '../lib/pico-utils'

// Minimal icons used by the profile component (copied locally to avoid coupling)
const PlusIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
)

const XIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

export default function MyProfile({ setActiveScreen, showNotification, user }) {
  const [registeredVehicles, setRegisteredVehicles] = useState([])
  const [showRegisterVehicleForm, setShowRegisterVehicleForm] = useState(false)
  const [newVehicleLastTwoDigits, setNewVehicleLastTwoDigits] = useState("")
  const [newVehicleType, setNewVehicleType] = useState("")
  const [newVehicleCity, setNewVehicleCity] = useState("")
  const [apiProfile, setApiProfile] = useState(null)
  const [loadingProfile, setLoadingProfile] = useState(false)

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('transit-user-vehicles') || '[]')
      setRegisteredVehicles(Array.isArray(saved) ? saved : [])
    } catch (e) {
      setRegisteredVehicles([])
    }
  }, [])

  // Call server-side proxy to fetch profile (will attach Auth0 token on server)
  useEffect(() => {
    let mounted = true
    const controller = new AbortController()
    const fetchProfile = async () => {
      setLoadingProfile(true)
      try {
        const res = await fetch('/api/profile', { signal: controller.signal })
        if (!res.ok) throw new Error(`Status ${res.status}`)
        const data = await res.json()
        if (mounted) setApiProfile(data)
      } catch (err) {
        if (mounted && showNotification) showNotification('No se pudo obtener el perfil desde el servidor', 'warning')
      } finally {
        if (mounted) setLoadingProfile(false)
      }
    }
    fetchProfile()
    return () => { mounted = false; controller.abort() }
  }, [showNotification])

  const saveVehicles = (items) => {
    setRegisteredVehicles(items)
    try {
      localStorage.setItem('transit-user-vehicles', JSON.stringify(items))
    } catch (e) {
      // ignore
    }
  }

  const handleForgetVehicle = (id) => {
    const updated = registeredVehicles.filter((v) => v.id !== id)
    saveVehicles(updated)
    if (showNotification) showNotification('Vehículo olvidado correctamente.', 'info')
  }

  const handleRegisterVehicle = () => {
    if (!newVehicleLastTwoDigits || !newVehicleType || !newVehicleCity) {
      if (showNotification) showNotification('Por favor, completa todos los campos para registrar el vehículo.', 'error')
      return
    }
    if (newVehicleLastTwoDigits.length !== 2 || isNaN(newVehicleLastTwoDigits)) {
      if (showNotification) showNotification('Los últimos dos dígitos de la placa deben ser numéricos y tener 2 dígitos.', 'error')
      return
    }

    const newVehicle = {
      id: Date.now().toString(),
      lastTwoDigits: newVehicleLastTwoDigits,
      type: newVehicleType,
      city: newVehicleCity,
    }
    const updated = [...registeredVehicles, newVehicle]
    saveVehicles(updated)
    if (showNotification) showNotification(`Vehículo ${newVehicleLastTwoDigits} (${newVehicleType}) registrado con éxito.`, 'success')
    setNewVehicleLastTwoDigits('')
    setNewVehicleType('')
    setNewVehicleCity('')
    setShowRegisterVehicleForm(false)
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Mi Perfil</h2>
      <div className="space-y-6">
        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200">
          <h3 className="font-semibold text-gray-800 text-lg mb-3">Mis Datos</h3>
          {user?.picture && (
            <div className="flex items-center space-x-3 mb-3">
              <div>
                {user?.name && <div className="font-semibold text-gray-800">{user.name}</div>}
                {user?.email && <div className="text-sm text-gray-600">{user.email}</div>}
              </div>
            </div>
          )}
          {user?.sub && (
            <p className="text-gray-700 text-sm break-words">
              ID de usuario: <span className="font-mono">{user.sub}</span>
            </p>
          )}
        </div>

        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-800 text-lg">Vehículos Registrados</h3>
            <button
              onClick={() => setShowRegisterVehicleForm((prev) => !prev)}
              className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 shadow-md"
              aria-label={showRegisterVehicleForm ? 'Cerrar formulario de registro de vehículo' : 'Abrir formulario de registro de vehículo'}
            >
              <PlusIcon className="w-6 h-6" />
            </button>
          </div>

          {registeredVehicles.length === 0 ? (
            <p className="text-gray-600 text-center">Aún no tienes vehículos registrados.</p>
          ) : (
            <ul className="space-y-3">
              {registeredVehicles.map((vehicle) => (
                <li key={vehicle.id} className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700 flex justify-between items-center shadow-sm">
                  <span>
                    Placa (últimos 2): <span className="font-semibold">{vehicle.lastTwoDigits}</span> - Tipo:{' '}
                    <span className="font-semibold">{vehicle.type}</span> - Ciudad: <span className="font-semibold">{vehicle.city}</span>
                  </span>
                  <button
                    onClick={() => handleForgetVehicle(vehicle.id)}
                    className="p-1 rounded-full text-red-500 hover:bg-red-100 transition-colors duration-200"
                    aria-label={`Olvidar vehículo con últimos 2 dígitos ${vehicle.lastTwoDigits}`}
                  >
                    <XIcon className="w-5 h-5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {showRegisterVehicleForm && (
          <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200">
            <h3 className="font-semibold text-gray-800 text-lg mb-3">Registra un Nuevo Vehículo</h3>
            <div className="mb-4">
              <label htmlFor="last-two-digits" className="block text-gray-700 text-sm font-bold mb-2">Últimos 2 dígitos de la placa:</label>
              <input
                type="text"
                id="last-two-digits"
                placeholder="Ej: 23"
                maxLength="2"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newVehicleLastTwoDigits}
                onChange={(e) => setNewVehicleLastTwoDigits(e.target.value.replace(/[^0-9]/g, ''))}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="new-vehicle-type" className="block text-gray-700 text-sm font-bold mb-2">Tipo de Vehículo:</label>
              <select id="new-vehicle-type" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" value={newVehicleType} onChange={(e) => setNewVehicleType(e.target.value)}>
                <option value="">Selecciona</option>
                {VEHICLE_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="new-vehicle-city" className="block text-gray-700 text-sm font-bold mb-2">Ciudad:</label>
              <select id="new-vehicle-city" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" value={newVehicleCity} onChange={(e) => setNewVehicleCity(e.target.value)}>
                <option value="">Selecciona una ciudad</option>
                {COLOMBIAN_CITIES_WITH_PICO_Y_PLACA.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <button onClick={handleRegisterVehicle} className="w-full bg-blue-600 text-white py-3 px-4 rounded-full font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md">Guardar Vehículo</button>
          </div>
        )}
      </div>
    </div>
  )
}
