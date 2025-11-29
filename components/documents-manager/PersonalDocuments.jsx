"use client"
import React, { useState, useEffect, useCallback } from "react"
import { DocumentCard } from "./DocumentCard"
import { PersonalDocumentForm } from "./PersonalDocumentForm"

export const PersonalDocuments = ({ showMessage }) => {
    const [personalDocs, setPersonalDocs] = useState(null)
    const [personalDocsLoading, setPersonalDocsLoading] = useState(false)
    const [showPersonalForm, setShowPersonalForm] = useState(false)
    const [deletingDocId, setDeletingDocId] = useState(null)

    const fetchPersonalDocs = useCallback(async () => {
        setPersonalDocsLoading(true)
        try {
            const res = await fetch('/api/hooks/documents/list')
            if (!res.ok) {
                const txt = await res.text().catch(() => '')
                console.error('personalDocsList error', res.status, txt)
                showMessage({ type: 'error', text: `No fue posible cargar documentos personales (${res.status})` })
                setPersonalDocs([])
                return
            }
            const body = await res.json().catch(() => null)
            const list = Array.isArray(body) ? body : (body?.data || [])
            setPersonalDocs(list.filter(doc => !doc.vehicleId))
        } catch (err) {
            console.error('fetchPersonalDocs failed', err)
            showMessage({ type: 'error', text: 'Error al obtener documentos personales' })
            setPersonalDocs([])
        } finally {
            setPersonalDocsLoading(false)
        }
    }, [showMessage])

    useEffect(() => {
        fetchPersonalDocs()
    }, [fetchPersonalDocs])

    const handleDelete = async (docId) => {
        if (!docId) return
        if (!window.confirm('¿Estás seguro de eliminar este documento?')) return
        setDeletingDocId(docId)
        try {
            const res = await fetch(`/api/hooks/documents/delete?id=${docId}`, { method: 'DELETE' })
            if (!res.ok) throw new Error('Error al eliminar')
            showMessage({ type: 'success', text: 'Documento eliminado' })
            setPersonalDocs(prev => prev.filter(d => d.id !== docId))
        } catch (e) {
            console.error(e)
            showMessage({ type: 'error', text: 'No se pudo eliminar el documento' })
        } finally {
            setDeletingDocId(null)
        }
    }

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-xl font-semibold text-gray-800">Documentos Personales</h3>
                    <p className="text-sm text-gray-500">Gestiona tus documentos de identidad y licencias</p>
                </div>
                <button
                    onClick={() => setShowPersonalForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center"
                >
                    <span className="mr-2">+</span> Agregar Documento
                </button>
            </div>

            {showPersonalForm && (
                <PersonalDocumentForm
                    onSuccess={() => {
                        setShowPersonalForm(false)
                        fetchPersonalDocs()
                    }}
                    onCancel={() => setShowPersonalForm(false)}
                    showMessage={showMessage}
                />
            )}

            {personalDocsLoading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {personalDocs && personalDocs.length > 0 ? (
                        personalDocs.map((doc) => (
                            <div key={doc.id || Math.random()} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="p-2 bg-blue-50 rounded-lg text-2xl">📄</div>
                                    <button
                                        onClick={() => handleDelete(doc.id)}
                                        disabled={deletingDocId === doc.id}
                                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                        title="Eliminar documento"
                                    >
                                        {deletingDocId === doc.id ? '...' : '🗑️'}
                                    </button>
                                </div>
                                <DocumentCard
                                    label={doc.name}
                                    doc={doc}
                                    onUpload={fetchPersonalDocs}
                                    showMessage={showMessage}
                                />
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            <p className="text-gray-500">No tienes documentos personales registrados.</p>
                            <button onClick={() => setShowPersonalForm(true)} className="text-blue-600 font-medium mt-2 hover:underline">
                                Agregar el primero
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
