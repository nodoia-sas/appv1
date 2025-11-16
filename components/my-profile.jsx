"use client"

import React, { useEffect, useState } from 'react'

// Icons removed for simplified profile view

export default function MyProfile({ setActiveScreen, showNotification, user }) {
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

    // Only fetch when an authenticated user exists
    try {
      const hasUser = typeof user !== 'undefined' && user !== null
      if (hasUser) fetchProfile()
    } catch (e) {}

    return () => { mounted = false; controller.abort() }
  }, [user, showNotification])

  // Vehicle helpers removed

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Mi Perfil</h2>
      <div className="space-y-6">
        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200">
          <h3 className="font-semibold text-gray-800 text-lg mb-3">Mis Datos</h3>
          {user?.picture && (
            <div className="flex items-center space-x-3 mb-3">
              <div>
                {user?.name && <div className="font-semibold text-gray-800">{user.name}</div>}
                {user?.email && <div className="text-sm text-gray-600">{user.email}</div>}
              </div>
            </div>
          )}
          {user?.sub && (
            <p className="text-gray-700 text-sm break-words">
              ID de usuario: <span className="font-mono">{user.sub}</span>
            </p>
          )}
        </div>
          {/* Vehicles section removed */}
      </div>
    </div>
  )
}
