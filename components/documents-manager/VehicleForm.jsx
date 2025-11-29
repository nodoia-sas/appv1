"use client"
import React, { useState } from "react"

export const VehicleForm = ({ onSuccess, onCancel, showMessage }) => {
    const CAR_CATEGORY_ID = '8cea5918-63d0-4037-a14f-09d066b5a336'
    const MOTO_CATEGORY_ID = '9cbb096b-a2ef-40b2-bed4-9e5c398c1ef5'

    const [vehicleCategoryId, setVehicleCategoryId] = useState(CAR_CATEGORY_ID)
    const [vehicleLastTwo, setVehicleLastTwo] = useState('')
    const [vehicleName, setVehicleName] = useState('')
    const [vehicleModel, setVehicleModel] = useState('')
    const [vehicleBrand, setVehicleBrand] = useState('')
    const [vehicleLine, setVehicleLine] = useState('')

    const handleVehicleSubmit = async (e) => {
        e.preventDefault()
        if (vehicleLastTwo && (!/^[0-9]{2}$/.test(vehicleLastTwo))) {
            showMessage({ type: 'error', text: 'Los últimos 2 dígitos deben ser numéricos y tener 2 dígitos' })
            return
        }

        const payload = {
            vehicleCategoryId: vehicleCategoryId,
            name: vehicleName || 'Sin nombre',
            identification: vehicleLastTwo || '',
            model: vehicleModel ? Number(vehicleModel) : 0,
            brand: vehicleBrand || '',
            line: vehicleLine || '',
        }

        try {
            const res = await fetch('/api/hooks/vehicles/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (!res.ok) {
                const txt = await res.text()
                console.error('Vehicle API error', res.status, txt)
                const detail = txt ? ` - ${txt}` : ''
                showMessage({ type: 'error', text: `Error al guardar vehículo: ${res.status}${detail}` })
                return
            }

            const data = await res.json().catch(() => null)
            console.log('Vehicle API response', data)
            showMessage({ type: 'success', text: 'Vehículo guardado correctamente.' }, 4000)
            if (onSuccess) onSuccess()
        } catch (err) {
            console.error('Vehicle submit failed', err)
            showMessage({ type: 'error', text: 'Error de comunicación con el servidor' })
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
            <h4 className="text-lg font-semibold mb-4 text-gray-800">Nuevo Vehículo</h4>
            <form onSubmit={handleVehicleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Vehículo</label>
                        <select
                            value={vehicleCategoryId}
                            onChange={(e) => setVehicleCategoryId(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value={CAR_CATEGORY_ID}>Carro / Camioneta</option>
                            <option value={MOTO_CATEGORY_ID}>Motocicleta</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Placa (Últimos 2 dígitos)</label>
                        <input
                            type="text"
                            maxLength="2"
                            value={vehicleLastTwo}
                            onChange={(e) => setVehicleLastTwo(e.target.value.replace(/[^0-9]/g, ''))}
                            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Ej: 89"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Vehículo</label>
                        <input
                            type="text"
                            value={vehicleName}
                            onChange={(e) => setVehicleName(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Ej: Mi Carro Rojo"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Modelo (Año)</label>
                        <input
                            type="number"
                            value={vehicleModel}
                            onChange={(e) => setVehicleModel(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Ej: 2022"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                        <input
                            type="text"
                            value={vehicleBrand}
                            onChange={(e) => setVehicleBrand(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Ej: Mazda"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Línea</label>
                        <input
                            type="text"
                            value={vehicleLine}
                            onChange={(e) => setVehicleLine(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Ej: CX-5"
                        />
                    </div>
                </div>
                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-5 py-2 rounded-lg text-gray-600 hover:bg-gray-100 font-medium text-sm transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-5 py-2 rounded-lg bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 shadow-md transition-colors"
                    >
                        Guardar Vehículo
                    </button>
                </div>
            </form>
        </div>
    )
}
