"use client"

import React, { useEffect, useState } from 'react'

// Icons removed for simplified profile view

export default function MyProfile({ setActiveScreen, showNotification }) {
  // Vehicles removed from profile; keep profile focused on user data
  const [apiProfile, setApiProfile] = useState(null)
  const [loadingProfile, setLoadingProfile] = useState(false)

  // No vehicles state

  // Fetch profile from backend when user logs in. Use apiProfile over Auth0 user when available.
  useEffect(() => {
    let mounted = true
    const controller = new AbortController()
    const fetchProfile = async () => {
      setLoadingProfile(true)
      try {
        const res = await fetch('/api/profile', { signal: controller.signal })
        if (!res.ok) throw new Error(`Status ${res.status}`)
        const json = await res.json()
        // backend responds { data: { id, name, email } }
        const profileData = json?.data || json
        if (mounted) setApiProfile(profileData)
      } catch (err) {
        if (mounted && showNotification) showNotification('No se pudo obtener el perfil desde el servidor', 'warning')
      } finally {
        if (mounted) setLoadingProfile(false)
      }
    }

      // Fetch on mount; server will return 401 if not authenticated
      fetchProfile()

      return () => { mounted = false; controller.abort() }
    }, [showNotification])

  // Vehicle helpers removed

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Mi Perfil</h2>
      <div className="space-y-6">
        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200">
          <h3 className="font-semibold text-gray-800 text-lg mb-3">Mis Datos</h3>
          {loadingProfile ? (
            <div className="text-sm text-gray-600">Cargando perfil...</div>
          ) : (
            <div>
              {apiProfile?.name && <div className="font-semibold text-gray-800">{apiProfile.name}</div>}
              {apiProfile?.email && <div className="text-sm text-gray-600">{apiProfile.email}</div>}
              {apiProfile?.id && (
                <p className="text-gray-700 text-sm break-words mt-2">ID de usuario: <span className="font-mono">{apiProfile.id}</span></p>
              )}
            </div>
          )}
        </div>
          {/* Vehicles section removed */}
      </div>
    </div>
  )
}
