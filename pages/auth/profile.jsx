import { useEffect, useState } from 'react'

export default function AuthProfile() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/auth/me')
        if (!mounted) return
        if (res.ok) {
          const json = await res.json()
          setData(json)
        } else {
          setData(null)
        }
      } catch (e) {
        setData(null)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  if (loading) return <div className="p-6">Cargando sesión...</div>

  if (!data || !data.user) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">No hay sesión iniciada</h1>
        <p className="mb-4">Inicia sesión para ver tu perfil.</p>
        <a href="/api/auth/login" className="inline-block bg-blue-600 text-white py-2 px-4 rounded">Iniciar sesión</a>
      </div>
    )
  }

  const { user } = data

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Perfil de usuario</h1>
      <div className="bg-white p-4 rounded shadow-sm">
        <p className="mb-2"><strong>Nombre:</strong> {user.name || user.nickname || user.email}</p>
        <p className="mb-2"><strong>Email:</strong> {user.email}</p>
        <p className="mb-2"><strong>ID:</strong> <span className="font-mono">{user.sub}</span></p>
        <div className="mt-4 space-x-2">
          <a href="/" className="inline-block bg-gray-200 py-2 px-4 rounded">Volver</a>
          <a href="/api/auth/logout" className="inline-block bg-red-600 text-white py-2 px-4 rounded">Cerrar sesión</a>
        </div>
      </div>
    </div>
  )
}
