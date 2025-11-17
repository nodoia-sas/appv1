"use client"

import React, { useState, useEffect, useCallback, useRef } from "react"

export default function Documents() {
  const [showPersonalForm, setShowPersonalForm] = useState(false)
  const [docType, setDocType] = useState('Cedula')
  const [documentName, setDocumentName] = useState('Cédula')
  const [licenseType, setLicenseType] = useState('A1')
  const [expiryDate, setExpiryDate] = useState('')
  const [file, setFile] = useState(null)
  const [showVehicleForm, setShowVehicleForm] = useState(false)
  // Vehicle category ids (example). Replace with real ids from your system if needed.
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

  const fetchVehicles = useCallback(async (opts = {}) => {
    setVehiclesLoading(true)
    try {
      // allow passing query overrides via opts.query
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
      // try common shapes: { data: [...] } or [...] directly
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

  useEffect(() => {
    fetchVehicles()
  }, [fetchVehicles])

  const showMessage = (msgObj, duration = 5000) => {
    // clear existing timeout
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

  const licenseOptions = ['A1','A2','B1','B2','C1','C2']

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

  const handleSubmit = (e) => {
    e.preventDefault()
    // Basic validation
    if (!docType) { setMessage({ type: 'error', text: 'Selecciona el tipo de documento' }); return }
    if ((docType === 'Licencia' || docType === 'Pasaporte') && !expiryDate) { setMessage({ type: 'error', text: 'Ingresa la fecha de expiración' }); return }
    if (!file) { setMessage({ type: 'error', text: 'Adjunta un archivo (imagen o pdf)' }); return }
    // For now just log and show success — actual upload/persist not implemented
    const payload = {
      type: docType,
      name: documentName,
      licenseType: docType === 'Licencia' ? licenseType : undefined,
      expiryDate: (docType === 'Licencia' || docType === 'Pasaporte') ? expiryDate : undefined,
      fileName: file.name,
      fileType: file.type,
      size: file.size,
    }
    console.log('Personal document submit:', payload)
    setMessage({ type: 'success', text: 'Documento preparado (sin subida real).' })
    resetForm()
    setShowPersonalForm(false)
  }

  const handleVehicleSubmit = async (e) => {
    e.preventDefault()
    // validate last two digits: optional but if provided must be 2 numeric chars
    if (vehicleLastTwo && (!/^[0-9]{2}$/.test(vehicleLastTwo))) {
      setMessage({ type: 'error', text: 'Los últimos 2 dígitos deben ser numéricos y tener 2 dígitos' })
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
      // refresh list after creating a vehicle
      try {
        await fetchVehicles()
      } catch (e) {
        console.error('refresh after add failed', e)
      }
    } catch (err) {
      console.error('Vehicle submit failed', err)
      showMessage({ type: 'error', text: 'Error de comunicación con el servidor' })
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Mis Documentos</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">📋</span>
            <div>
              <div className="font-semibold text-gray-800">Mis documentos</div>
              <div className="text-sm text-gray-600">Gestiona tus documentos personales</div>
            </div>
          </div>
          <div>
            <button onClick={() => { setShowPersonalForm(true); setShowVehicleForm(false); }} className="bg-green-600 text-white py-2 px-4 rounded-full text-sm">Agregar</button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🚗</span>
            <div>
              <div className="font-semibold text-gray-800">Mis Vehículos</div>
              <div className="text-sm text-gray-600">Registra tus vehículos y documentación</div>
            </div>
          </div>
          <div>
            <button onClick={() => { setShowVehicleForm(true); setShowPersonalForm(false); }} className="bg-green-600 text-white py-2 px-4 rounded-full text-sm">Agregar</button>
          </div>
        </div>
      </div>
      
      {/* Personal document form (inline) */}
      {showPersonalForm && (
        <div className="bg-white rounded-lg shadow-md w-full p-6 mt-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Agregar documento personal</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select value={docType} onChange={(e) => {
                const v = e.target.value
                setDocType(v)
                if (v === 'Cedula') setDocumentName('Cédula')
                else if (v === 'Pasaporte') setDocumentName('Pasaporte')
                else if (v === 'Licencia') setDocumentName('Licencia de Conducción')
              }} className="w-full border rounded p-2">
                <option value="Cedula">Cédula</option>
                <option value="Pasaporte">Pasaporte</option>
                <option value="Licencia">Licencia</option>
              </select>
            </div>
            
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del documento</label>
              <input type="text" value={documentName} onChange={(e) => setDocumentName(e.target.value)} className="w-full border rounded p-2" />
            </div>
            {docType === 'Licencia' && (
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de licencia</label>
                <select value={licenseType} onChange={(e) => setLicenseType(e.target.value)} className="w-full border rounded p-2">
                  {licenseOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            )}

            {(docType === 'Licencia' || docType === 'Pasaporte') && (
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de expiración</label>
                <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} className="w-full border rounded p-2" />
              </div>
            )}

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Archivo (imagen o PDF)</label>
              <input accept="image/*,application/pdf" type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="w-full" />
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              <button type="button" onClick={() => { setShowPersonalForm(false); resetForm() }} className="px-4 py-2 rounded bg-gray-100">Cancelar</button>
              <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">Guardar</button>
            </div>
          </form>
        </div>
      )}

      {/* Vehicle form (inline) */}
      {showVehicleForm && (
        <div className="bg-white rounded-lg shadow-md w-full p-6 mt-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Agregar vehículo</h3>
          <form onSubmit={handleVehicleSubmit}>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select value={vehicleCategoryId} onChange={(e) => setVehicleCategoryId(e.target.value)} className="w-full border rounded p-2">
                <option value={CAR_CATEGORY_ID}>Carro</option>
                <option value={MOTO_CATEGORY_ID}>Moto</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Últimos 2 dígitos de la placa</label>
              <input type="text" value={vehicleLastTwo} onChange={(e) => setVehicleLastTwo(e.target.value.replace(/[^0-9]/g, '').slice(0,2))} className="w-full border rounded p-2" />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input type="text" value={vehicleName} onChange={(e) => setVehicleName(e.target.value)} className="w-full border rounded p-2" />
            </div>

            <div className="mb-3 grid grid-cols-1 md:grid-cols-3 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
                <input type="number" min="0" step="1" value={vehicleModel} onChange={(e) => setVehicleModel(String(e.target.value).replace(/[^0-9]/g, ''))} className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marca (opcional)</label>
                <input type="text" value={vehicleBrand} onChange={(e) => setVehicleBrand(e.target.value)} className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Línea (opcional)</label>
                <input type="text" value={vehicleLine} onChange={(e) => setVehicleLine(e.target.value)} className="w-full border rounded p-2" />
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              <button type="button" onClick={() => { setShowVehicleForm(false); resetVehicleForm() }} className="px-4 py-2 rounded bg-gray-100">Cancelar</button>
              <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">Guardar</button>
            </div>
          </form>
        </div>
      )}

      {/* Vehicles list */}
      <div className="mt-6">
        {vehiclesLoading && <div className="text-sm text-gray-600">Cargando vehículos...</div>}

        {!vehiclesLoading && (!vehicles || vehicles.length === 0) && (
          <div className="text-sm text-gray-600">No tienes vehículos registrados.</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          {vehicles && vehicles.map((v) => {
            const id = v.id || v.vehicleId || v._id || v.identification || Math.random()
            const deleteId = v.id || v.vehicleId || v._id || null
            const name = v.name || v.displayName || `${v.brand || ''} ${v.model || ''}`
            const identification = v.identification || v.license || ''

            // documents may be in v.documents or v.documentsList
            const docs = v.documents || v.documentsList || v.documentsDto || []
            const findDoc = (typeKeywords) => {
              if (!Array.isArray(docs)) return null
              const key = (t) => t.toString().toLowerCase()
              return docs.find(d => {
                const target = (d.type || d.name || d.documentType || '') .toString().toLowerCase()
                return typeKeywords.some(k => target.includes(k))
              }) || null
            }

            const soat = findDoc(['soat'])
            const tarjeta = findDoc(['tarjeta', 'propiedad'])
            const tecnico = findDoc(['tecnico', 'tecnic', 'tecnico-mecanica', 'tecnico mecanica'])

            const renderDoc = (doc) => {
              if (!doc) return <div className="text-sm text-gray-500">Sin registro</div>
              const txt = doc.expiryDate || doc.expiration || doc.validUntil || doc.date || doc.nombre || ''
              return (
                <div className="text-sm">
                  <div className="font-medium">{doc.type || doc.name || doc.documentType || 'Documento'}</div>
                  {txt && <div className="text-xs text-gray-600">Vence: {String(txt)}</div>}
                </div>
              )
            }

            // determine icon based on vehicle category/type
            const categoryId = v.vehicleCategory?.id || v.vehicleCategoryId || v.vehicleCategoryId || ''
            const categoryName = (v.vehicleCategory?.name || v.vehicleCategoryName || '').toString().toLowerCase()
            let icon = '🚗'
            if (categoryName.includes('moto') || categoryId === MOTO_CATEGORY_ID) icon = '🏍️'
            else if (categoryName.includes('car') || categoryName.includes('carro') || categoryName.includes('auto')) icon = '🚗'

            return (
              <div key={id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{name}</div>
                    <div className="text-sm text-gray-600">Placa/ID: {identification}</div>
                    <div className="text-sm text-gray-600">{v.brand ? `${v.brand} • ${v.model || ''} • ${v.line || ''}` : ''}</div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <div className="text-2xl">{icon}</div>
                    {deleteId && (
                      <button
                        onClick={async () => {
                          // confirmation
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
                            // remove from list
                            setVehicles((prev) => (Array.isArray(prev) ? prev.filter(it => (it.id || it.vehicleId || it._id) !== deleteId) : prev))
                          } catch (err) {
                            console.error('delete failed', err)
                            showMessage({ type: 'error', text: 'Error al eliminar vehículo' })
                          } finally {
                            setDeletingVehicleId(null)
                          }
                        }}
                        disabled={deletingVehicleId === deleteId}
                        className="text-sm text-red-600 hover:underline"
                      >
                        {deletingVehicleId === deleteId ? 'Eliminando...' : 'Eliminar'}
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-1 gap-3 mt-3">
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="text-xs text-gray-500">SOAT</div>
                    {renderDoc(soat)}
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="text-xs text-gray-500">Tarjeta de propiedad</div>
                    {renderDoc(tarjeta)}
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="text-xs text-gray-500">Técnico mecánica</div>
                    {renderDoc(tecnico)}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {message && (
        <div className={`fixed bottom-24 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full shadow-lg text-white z-50 ${message.type === 'success' ? 'bg-green-600' : 'bg-red-500'}`}>
          {message.text}
        </div>
      )}
    </div>
  )
}
