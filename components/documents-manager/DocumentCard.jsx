"use client"
import React, { useState, useEffect } from "react"

export const DocumentCard = ({ label, doc, vehicleId, onUpload, showMessage, hideExpiry = false }) => {
    const [file, setFile] = useState(null)
    const [expiryDate, setExpiryDate] = useState('')
    const [loading, setLoading] = useState(false)
    const [isEditing, setIsEditing] = useState(false)

    const getExpiryColor = (dateString) => {
        if (!dateString) return 'text-gray-600'
        const date = new Date(dateString)
        const now = new Date()
        const oneMonthFromNow = new Date()
        oneMonthFromNow.setMonth(now.getMonth() + 1)
        return date < oneMonthFromNow ? 'text-red-600' : 'text-green-600'
    }

    useEffect(() => {
        if (doc && (doc.expiryDate || doc.expiration || doc.expirationAt)) {
            const d = doc.expiryDate || doc.expiration || doc.expirationAt
            if (d) setExpiryDate(String(d).split('T')[0])
        }
    }, [doc])

    const hasPath = doc && (doc.path || doc.url)

    const handleUpload = async () => {
        if (!file) {
            if (showMessage) showMessage({ type: 'error', text: 'Por favor selecciona un archivo' })
            else alert('Por favor selecciona un archivo')
            return
        }
        if (!expiryDate && !hideExpiry) {
            if (showMessage) showMessage({ type: 'error', text: 'Por favor selecciona la fecha de expiración' })
            else alert('Por favor selecciona la fecha de expiración')
            return
        }

        setLoading(true)
        try {
            const docId = doc?.id
            if (!docId) {
                throw new Error('No se encontró ID del documento. El documento debe existir previamente.')
            }

            const formData = new FormData()
            formData.append('file', file)
            if (expiryDate) {
                // Ensure we send a valid ISO string
                formData.append('expirationAt', new Date(expiryDate).toISOString())
            }

            const res = await fetch(`/api/hooks/documents/edit?id=${docId}`, {
                method: 'PATCH',
                body: formData,
            })

            if (!res.ok) {
                const txt = await res.text()
                console.error('Upload error response:', txt)
                throw new Error('Falló la subida del archivo')
            }

            if (showMessage) showMessage({ type: 'success', text: 'Documento subido correctamente' })
            setIsEditing(false)
            if (onUpload) onUpload()
        } catch (error) {
            console.error('Upload failed', error)
            if (showMessage) showMessage({ type: 'error', text: error.message || 'Error al subir documento' })
        } finally {
            setLoading(false)
        }
    }

    if (hasPath && !isEditing) {
        const isExpired = doc.expirationAt ? new Date(doc.expirationAt) < new Date() : false
        const expiryLabel = isExpired ? "Ya venció el:" : "Vence:"

        return (
            <div className="text-sm">
                <div className="font-medium text-gray-800">{doc.name || label}</div>
                {doc.expirationAt && <div className={`text-xs ${getExpiryColor(doc.expirationAt)}`}>{expiryLabel} {new Date(doc.expirationAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })}</div>}

                <div className="flex items-center mt-2 justify-between">
                    <a
                        href={"https://transt-ia-filestore.s3.us-east-1.amazonaws.com/" + doc.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 text-green-600 hover:text-green-800 hover:bg-green-50 transition-all group shadow-sm"
                        title="Ver/Descargar documento"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 group-hover:scale-110 transition-transform">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M7.5 10.5l4.5 4.5m0 0l4.5-4.5m-4.5 4.5v-12" />
                        </svg>
                    </a>

                    <button
                        onClick={() => setIsEditing(true)}
                        className="text-xs bg-white hover:bg-gray-50 text-blue-600 px-3 py-1 rounded border border-blue-200 transition-colors shadow-sm"
                    >
                        Cambiar documento
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="text-sm">
            <div className="font-medium text-gray-800 mb-1">{label}</div>
            {doc && !hasPath && <div className="text-xs text-orange-600 mb-2">Documento registrado sin archivo</div>}
            {!doc && <div className="text-xs text-gray-500 mb-2">No registrado</div>}
            {isEditing && <div className="text-xs text-blue-600 mb-2">Actualizando documento...</div>}

            <div className="space-y-2 mt-2 border-t pt-2 border-gray-100">
                {!hideExpiry && (
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Fecha de expiración</label>
                        <input
                            type="date"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                            className="w-full text-xs border border-gray-300 rounded p-1"
                        />
                    </div>
                )}
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Subir archivo</label>
                    <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="w-full text-xs text-gray-500"
                    />
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={handleUpload}
                        disabled={loading}
                        className="flex-1 bg-blue-600 text-white text-xs py-1.5 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                        {loading ? 'Subiendo...' : 'Guardar y Subir'}
                    </button>
                    {isEditing && (
                        <button
                            onClick={() => setIsEditing(false)}
                            className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs rounded hover:bg-gray-200 border border-gray-200"
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
