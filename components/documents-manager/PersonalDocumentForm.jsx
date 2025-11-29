"use client"
import React, { useState } from "react"

export const PersonalDocumentForm = ({ onSuccess, onCancel, showMessage }) => {
    const [docType, setDocType] = useState('Cedula')
    const [documentName, setDocumentName] = useState('Cédula')
    const [licenseType, setLicenseType] = useState('A1')
    const [expiryDate, setExpiryDate] = useState('')
    const [file, setFile] = useState(null)

    const licenseOptions = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!docType) { showMessage({ type: 'error', text: 'Selecciona el tipo de documento' }); return }
        if ((docType === 'Licencia' || docType === 'Pasaporte') && !expiryDate) { showMessage({ type: 'error', text: 'Ingresa la fecha de expiración' }); return }
        if (!file) { showMessage({ type: 'error', text: 'Adjunta un archivo (imagen o pdf)' }); return }

        let typeId = 0
        if (docType === 'Cedula') typeId = 4
        else if (docType === 'Pasaporte') typeId = 5
        else if (docType === 'Licencia') typeId = 6

        if (typeId === 0) {
            showMessage({ type: 'error', text: 'Tipo de documento no válido.' })
            return
        }

        try {
            const formData = new FormData()
            formData.append('type', typeId)
            formData.append('name', documentName)
            formData.append('file', file)

            if (expiryDate) {
                formData.append('expirationAt', new Date(expiryDate).toISOString())
            }
            if (typeId === 6) {
                formData.append('description', licenseType)
            }

            showMessage({ type: 'info', text: 'Subiendo documento...' })

            const res = await fetch('/api/hooks/documents/add', {
                method: 'POST',
                body: formData,
            })

            if (!res.ok) {
                const txt = await res.text()
                console.error('Document add error:', txt)
                throw new Error('Error al subir el documento')
            }

            const data = await res.json()
            console.log('Document added:', data)
            showMessage({ type: 'success', text: 'Documento agregado correctamente.' })
            if (onSuccess) onSuccess()
        } catch (err) {
            console.error('Submit failed', err)
            showMessage({ type: 'error', text: err.message || 'Error al guardar documento' })
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
            <h4 className="text-lg font-semibold mb-4 text-gray-800">Nuevo Documento</h4>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Documento</label>
                        <select
                            value={docType}
                            onChange={(e) => {
                                const v = e.target.value
                                setDocType(v)
                                if (v === 'Cedula') setDocumentName('Cédula')
                                else if (v === 'Pasaporte') setDocumentName('Pasaporte')
                                else if (v === 'Licencia') setDocumentName('Licencia de Conducción')
                            }}
                            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="Cedula">Cédula de Ciudadanía</option>
                            <option value="Pasaporte">Pasaporte</option>
                            <option value="Licencia">Licencia de Conducción</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Personalizado</label>
                        <input
                            type="text"
                            value={documentName}
                            onChange={(e) => setDocumentName(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    {docType === 'Licencia' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                            <select
                                value={licenseType}
                                onChange={(e) => setLicenseType(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                {licenseOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>
                    )}
                    {(docType === 'Licencia' || docType === 'Pasaporte') && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Vencimiento</label>
                            <input
                                type="date"
                                value={expiryDate}
                                onChange={(e) => setExpiryDate(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    )}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Archivo del Documento</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                            <input
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="text-gray-500">
                                {file ? (
                                    <span className="text-blue-600 font-medium">{file.name}</span>
                                ) : (
                                    <span>Arrastra un archivo o haz clic para seleccionar (PDF, Imagen)</span>
                                )}
                            </div>
                        </div>
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
                        Guardar Documento
                    </button>
                </div>
            </form>
        </div>
    )
}
