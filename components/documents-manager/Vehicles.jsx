"use client"
import React, { useState, useEffect, useCallback } from "react"
import { VehicleCard } from "./VehicleCard"
import { VehicleForm } from "./VehicleForm"

export const Vehicles = ({ showMessage }) => {
    const [vehicles, setVehicles] = useState(null)
    const [vehiclesLoading, setVehiclesLoading] = useState(false)
    const [showVehicleForm, setShowVehicleForm] = useState(false)

    const fetchVehicles = useCallback(async (opts = {}) => {
        setVehiclesLoading(true)
        try {
            const query = opts.query || ''
            const url = `/api/hooks/vehicles/list${query ? `?${query}` : ''}`
            const res = await fetch(url)
            if (!res.ok) {
                const txt = await res.text().catch(() => '')
                console.error('vehicleList error', res.status, txt)
                showMessage({ type: 'error', text: `No fue posible cargar vehículos (${res.status})` })
                setVehicles([])
                return
            }
            const body = await res.json().catch(() => null)
            const list = body?.data ?? body ?? []
            setVehicles(Array.isArray(list) ? list : [])
        } catch (err) {
            console.error('fetchVehicles failed', err)
            showMessage({ type: 'error', text: 'Error al obtener vehículos' })
            setVehicles([])
        } finally {
            setVehiclesLoading(false)
        }
    }, [showMessage])

    useEffect(() => {
        fetchVehicles()
    }, [fetchVehicles])

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-xl font-semibold text-gray-800">Mis Vehículos</h3>
                    <p className="text-sm text-gray-500">Administra tus vehículos y su documentación legal</p>
                </div>
                <button
                    onClick={() => setShowVehicleForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center"
                >
                    <span className="mr-2">+</span> Agregar Vehículo
                </button>
            </div>

            {showVehicleForm && (
                <VehicleForm
                    onSuccess={() => {
                        setShowVehicleForm(false)
                        fetchVehicles()
                    }}
                    onCancel={() => setShowVehicleForm(false)}
                    showMessage={showMessage}
                />
            )}

            {vehiclesLoading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="space-y-6">
                    {vehicles && vehicles.length > 0 ? (
                        vehicles.map((v) => (
                            <VehicleCard
                                key={v.id || v.vehicleId || v._id || Math.random()}
                                vehicle={v}
                                onUpdate={fetchVehicles}
                                onDelete={(id) => setVehicles((prev) => (Array.isArray(prev) ? prev.filter(it => (it.id || it.vehicleId || it._id) !== id) : prev))}
                                showMessage={showMessage}
                            />
                        ))
                    ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            <p className="text-gray-500">No tienes vehículos registrados.</p>
                            <button onClick={() => setShowVehicleForm(true)} className="text-blue-600 font-medium mt-2 hover:underline">
                                Agregar el primero
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
