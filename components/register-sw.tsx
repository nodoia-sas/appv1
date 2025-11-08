"use client"

import { useEffect } from "react"

export default function RegisterSW() {
  useEffect(() => {
    if (typeof window === "undefined") return
    if (!('serviceWorker' in navigator)) return

    const register = async () => {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js')
        // eslint-disable-next-line no-console
        console.log('ServiceWorker registered:', reg)
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('ServiceWorker registration failed:', err)
      }
    }

    register()
  }, [])

  return null
}
