"use client"
import React, { useState } from "react"
import { DocumentCard } from "./DocumentCard"

export const VehicleCard = ({ vehicle: v, onUpdate, onDelete, showMessage }) => {
    const [deletingVehicleId, setDeletingVehicleId] = useState(null)
    const MOTO_CATEGORY_ID = '9cbb096b-a2ef-40b2-bed4-9e5c398c1ef5'

    const id = v.id || v.vehicleId || v._id || v.identification || Math.random()
    const deleteId = v.id || v.vehicleId || v._id || null
    const name = v.name || v.displayName || `${v.brand || ''} ${v.model || ''}`
    const identification = v.identification || v.license || ''
    const docs = v.documents || []

    const findDocByType = (typeId) => {
        if (!Array.isArray(docs)) return null
        return docs.find(d => d.type == typeId) || null
    }

    const soat = findDocByType(1)
    const tarjeta = findDocByType(2)
    const tecnico = findDocByType(3)

    const categoryId = v.vehicleCategory?.id || v.vehicleCategoryId || v.vehicleCategoryId || ''
    const categoryName = (v.vehicleCategory?.name || v.vehicleCategoryName || '').toString().toLowerCase()
    let icon = '🚗'
    if (categoryName.includes('moto') || categoryId === MOTO_CATEGORY_ID) icon = '🏍️'

    const handleDelete = async () => {
        const ok = window.confirm('¿Estás seguro de eliminar este vehículo? Esta acción es irreversible.')
        if (!ok) return
        try {
            setDeletingVehicleId(deleteId)
            const res = await fetch(`/api/hooks/vehicles/delete?id=${encodeURIComponent(deleteId)}`, { method: 'DELETE' })
            if (!res.ok) {
                const txt = await res.text().catch(() => '')
                console.error('vehicleDelete error', res.status, txt)
                showMessage({ type: 'error', text: `No se pudo eliminar (${res.status})${txt ? ' - ' + txt : ''}` })
                return
            }
            showMessage({ type: 'success', text: 'Vehículo eliminado.' })
            if (onDelete) onDelete(deleteId)
        } catch (err) {
            console.error('delete failed', err)
            showMessage({ type: 'error', text: 'Error al eliminar vehículo' })
        } finally {
            setDeletingVehicleId(null)
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="text-3xl bg-white p-2 rounded-full shadow-sm">{icon}</div>
                    <div>
                        <h4 className="text-lg font-bold text-gray-800">{name}</h4>
                        <div className="text-sm text-gray-500 flex items-center space-x-2">
                            <span>Placa: ••••{identification}</span>
                            <span>•</span>
                            <span>{v.brand} {v.line} {v.model}</span>
                        </div>
                    </div>
                </div>
                {deleteId && (
                    <button
                        onClick={handleDelete}
                        disabled={deletingVehicleId === deleteId}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-colors"
                        title="Eliminar vehículo"
                    >
                        🗑️
                    </button>
                )}
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <DocumentCard
                        label="SOAT"
                        doc={soat}
                        vehicleId={id}
                        onUpload={onUpdate}
                        showMessage={showMessage}
                    />
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <DocumentCard
                        label="Tarjeta de Propiedad"
                        doc={tarjeta}
                        vehicleId={id}
                        onUpload={onUpdate}
                        showMessage={showMessage}
                        hideExpiry={true}
                    />
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <DocumentCard
                        label="Técnico Mecánica"
                        doc={tecnico}
                        vehicleId={id}
                        onUpload={onUpdate}
                        showMessage={showMessage}
                    />
                </div>
            </div>
        </div>
    )
}
