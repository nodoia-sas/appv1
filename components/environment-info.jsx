"use client"

import { useState, useEffect } from "react"
import * as Icons from './icons'

export default function EnvironmentInfo({ isVisible, onClose }) {
  const [envInfo, setEnvInfo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [validating, setValidating] = useState(false)

  const fetchEnvironmentInfo = async (validate = false) => {
    try {
      setLoading(true)
      if (validate) setValidating(true)
      
      const url = `/api/config/environment${validate ? '?validate=true' : ''}`
      const response = await fetch(url)
      const data = await response.json()
      
      setEnvInfo(data)
    } catch (error) {
      console.error('Error fetching environment info:', error)
      setEnvInfo({ error: error.message })
    } finally {
      setLoading(false)
      setValidating(false)
    }
  }

  useEffect(() => {
    if (isVisible) {
      fetchEnvironmentInfo()
    }
  }, [isVisible])

  if (!isVisible) return null

  const getStatusColor = (status) => {
    if (status === undefined) return 'text-gray-500'
    return status ? 'text-green-600' : 'text-red-600'
  }

  const getStatusIcon = (status) => {
    if (status === undefined) return '⚪'
    return status ? '✅' : '❌'
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              🔧 Configuración de Ambiente
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Icons.XIcon className="w-6 h-6" />
            </button>
          </div>

          {loading && !envInfo && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Cargando configuración...</p>
            </div>
          )}

          {envInfo && !envInfo.error && (
            <div className="space-y-6">
              {/* Información del Ambiente */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">🌍 Ambiente Actual</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-blue-700">Ambiente:</span>
                    <span className="ml-2 font-mono bg-blue-100 px-2 py-1 rounded">
                      {envInfo.environment.current}
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-700">Nombre:</span>
                    <span className="ml-2">{envInfo.environment.name}</span>
                  </div>
                  <div>
                    <span className="text-blue-700">NODE_ENV:</span>
                    <span className="ml-2 font-mono">{envInfo.environment.nodeEnv}</span>
                  </div>
                  <div>
                    <span className="text-blue-700">APP_ENV:</span>
                    <span className="ml-2 font-mono">
                      {envInfo.environment.appEnv || 'auto'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Configuración de API */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">🔗 Configuración de API</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-green-700">URL Final:</span>
                    <div className="font-mono bg-green-100 p-2 rounded mt-1 break-all">
                      {envInfo.api.finalUrl}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-green-700">Base URL:</span>
                      <div className="font-mono text-xs">{envInfo.api.baseUrl}</div>
                    </div>
                    <div>
                      <span className="text-green-700">Base Path:</span>
                      <div className="font-mono text-xs">{envInfo.api.basePath}</div>
                    </div>
                  </div>
                  {envInfo.api.isOverridden && (
                    <div className="bg-yellow-100 p-2 rounded">
                      <span className="text-yellow-800">⚠️ Override activo:</span>
                      <div className="font-mono text-xs">{envInfo.api.overrideValue}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Validación de Conectividad */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-900">🔍 Conectividad</h3>
                  <button
                    onClick={() => fetchEnvironmentInfo(true)}
                    disabled={validating}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                  >
                    {validating ? 'Validando...' : 'Validar'}
                  </button>
                </div>
                
                {envInfo.validation.available !== undefined ? (
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <span className={getStatusColor(envInfo.validation.available)}>
                        {getStatusIcon(envInfo.validation.available)}
                      </span>
                      <span className="ml-2">
                        Estado: {envInfo.validation.available ? 'Disponible' : 'No disponible'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-700">Status:</span>
                      <span className="ml-2 font-mono">{envInfo.validation.status}</span>
                    </div>
                    <div>
                      <span className="text-gray-700">URL:</span>
                      <div className="font-mono text-xs break-all">{envInfo.validation.url}</div>
                    </div>
                    {envInfo.validation.error && (
                      <div className="bg-red-100 p-2 rounded">
                        <span className="text-red-800">Error:</span>
                        <div className="text-xs">{envInfo.validation.error}</div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-600 text-sm">{envInfo.validation.message}</p>
                )}
              </div>

              {/* Timestamp */}
              <div className="text-xs text-gray-500 text-center">
                Última actualización: {new Date(envInfo.timestamp).toLocaleString()}
              </div>
            </div>
          )}

          {envInfo?.error && (
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-semibold text-red-900 mb-2">❌ Error</h3>
              <p className="text-red-700">{envInfo.error}</p>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}