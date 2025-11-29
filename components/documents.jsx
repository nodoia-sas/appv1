"use client"

import React, { useState, useEffect, useCallback, useRef } from "react"

const VehicleDocument = ({ label, doc, vehicleId, onUpload, showMessage, hideExpiry = false }) => {
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

export default function Documents() {
  const [activeTab, setActiveTab] = useState('personal') // 'personal' or 'vehicles'
  const [showPersonalForm, setShowPersonalForm] = useState(false)
  const [docType, setDocType] = useState('Cedula')
  const [documentName, setDocumentName] = useState('Cédula')
  const [licenseType, setLicenseType] = useState('A1')
  const [expiryDate, setExpiryDate] = useState('')
  const [file, setFile] = useState(null)

  // Vehicle Form State
  const [showVehicleForm, setShowVehicleForm] = useState(false)
  const CAR_CATEGORY_ID = '8cea5918-63d0-4037-a14f-09d066b5a336'
  const MOTO_CATEGORY_ID = '9cbb096b-a2ef-40b2-bed4-9e5c398c1ef5'
  const [vehicleCategoryId, setVehicleCategoryId] = useState(CAR_CATEGORY_ID)
  const [vehicleLastTwo, setVehicleLastTwo] = useState('')
  const [vehicleName, setVehicleName] = useState('')
  const [vehicleModel, setVehicleModel] = useState('')
  const [vehicleBrand, setVehicleBrand] = useState('')
  const [vehicleLine, setVehicleLine] = useState('')

  const [message, setMessage] = useState(null)
  const messageTimeoutRef = useRef(null)

  const [vehicles, setVehicles] = useState(null)
  const [vehiclesLoading, setVehiclesLoading] = useState(false)
  const [deletingVehicleId, setDeletingVehicleId] = useState(null)

  const [personalDocs, setPersonalDocs] = useState(null)
  const [personalDocsLoading, setPersonalDocsLoading] = useState(false)
  const [deletingDocId, setDeletingDocId] = useState(null)

  const showMessage = (msgObj, duration = 5000) => {
    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current)
      messageTimeoutRef.current = null
    }
    setMessage(msgObj)
    messageTimeoutRef.current = setTimeout(() => {
      setMessage(null)
      messageTimeoutRef.current = null
    }, duration)
  }

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
  }, [])

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
      // Filter out vehicle documents if they are mixed in (usually vehicle docs have vehicleId or type 1,2,3)
      // Assuming types 4, 5, 6 are personal. Or just show all that don't belong to a vehicle if API returns mixed.
      // For now, assume the list endpoint returns what we need.
      const list = Array.isArray(body) ? body : (body?.data || [])
      // Filter out documents that have a vehicleId, as those are vehicle documents
      setPersonalDocs(list.filter(doc => !doc.vehicleId))
    } catch (err) {
      console.error('fetchPersonalDocs failed', err)
      showMessage({ type: 'error', text: 'Error al obtener documentos personales' })
      setPersonalDocs([])
    } finally {
      setPersonalDocsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (activeTab === 'vehicles') fetchVehicles()
    if (activeTab === 'personal') fetchPersonalDocs()
  }, [activeTab, fetchVehicles, fetchPersonalDocs])

  const licenseOptions = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

  const resetForm = () => {
    setDocType('Cedula')
    setDocumentName('Cédula')
    setLicenseType('A1')
    setExpiryDate('')
    setFile(null)
  }

  const resetVehicleForm = () => {
    setVehicleCategoryId(CAR_CATEGORY_ID)
    setVehicleLastTwo('')
    setVehicleName('')
    setVehicleModel('')
    setVehicleBrand('')
    setVehicleLine('')
  }

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
      resetForm()
      setShowPersonalForm(false)
      fetchPersonalDocs()
    } catch (err) {
      console.error('Submit failed', err)
      showMessage({ type: 'error', text: err.message || 'Error al guardar documento' })
    }
  }

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
      resetVehicleForm()
      setShowVehicleForm(false)
      fetchVehicles()
    } catch (err) {
      console.error('Vehicle submit failed', err)
      showMessage({ type: 'error', text: 'Error de comunicación con el servidor' })
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Gestión de Documentos</h2>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 p-1 rounded-full inline-flex">
          <button
            onClick={() => { setActiveTab('personal'); setShowVehicleForm(false); }}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'personal' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            Mis Documentos
          </button>
          <button
            onClick={() => { setActiveTab('vehicles'); setShowPersonalForm(false); }}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'vehicles' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            Mis Vehículos
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {activeTab === 'personal' && (
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
                      onClick={() => { setShowPersonalForm(false); resetForm() }}
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
                          onClick={async () => {
                            if (!doc.id) return
                            if (!window.confirm('¿Estás seguro de eliminar este documento?')) return
                            setDeletingDocId(doc.id)
                            try {
                              const res = await fetch(`/api/hooks/documents/delete?id=${doc.id}`, { method: 'DELETE' })
                              if (!res.ok) throw new Error('Error al eliminar')
                              showMessage({ type: 'success', text: 'Documento eliminado' })
                              setPersonalDocs(prev => prev.filter(d => d.id !== doc.id))
                            } catch (e) {
                              console.error(e)
                              showMessage({ type: 'error', text: 'No se pudo eliminar el documento' })
                            } finally {
                              setDeletingDocId(null)
                            }
                          }}
                          disabled={deletingDocId === doc.id}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          title="Eliminar documento"
                        >
                          {deletingDocId === doc.id ? '...' : '🗑️'}
                        </button>
                      </div>
                      <VehicleDocument
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
        )}

        {activeTab === 'vehicles' && (
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
                      onClick={() => { setShowVehicleForm(false); resetVehicleForm() }}
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
            )}

            {vehiclesLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {vehicles && vehicles.length > 0 ? (
                  vehicles.map((v) => {
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

                    return (
                      <div key={id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
                              onClick={async () => {
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
                                  setVehicles((prev) => (Array.isArray(prev) ? prev.filter(it => (it.id || it.vehicleId || it._id) !== deleteId) : prev))
                                } catch (err) {
                                  console.error('delete failed', err)
                                  showMessage({ type: 'error', text: 'Error al eliminar vehículo' })
                                } finally {
                                  setDeletingVehicleId(null)
                                }
                              }}
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
                            <VehicleDocument
                              label="SOAT"
                              doc={soat}
                              vehicleId={id}
                              onUpload={fetchVehicles}
                              showMessage={showMessage}
                            />
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                            <VehicleDocument
                              label="Tarjeta de Propiedad"
                              doc={tarjeta}
                              vehicleId={id}
                              onUpload={fetchVehicles}
                              showMessage={showMessage}
                              hideExpiry={true}
                            />
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                            <VehicleDocument
                              label="Técnico Mecánica"
                              doc={tecnico}
                              vehicleId={id}
                              onUpload={fetchVehicles}
                              showMessage={showMessage}
                            />
                          </div>
                        </div>
                      </div>
                    )
                  })
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
        )}
      </div>

      {message && (
        <div className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full shadow-xl text-white z-50 flex items-center space-x-2 ${message.type === 'success' ? 'bg-green-600' : message.type === 'info' ? 'bg-blue-600' : 'bg-red-500'}`}>
          <span>{message.type === 'success' ? '✅' : message.type === 'info' ? 'ℹ️' : '⚠️'}</span>
          <span>{message.text}</span>
        </div>
      )}
    </div>
  )
}
