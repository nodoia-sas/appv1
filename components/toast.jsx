"use client"

import { useEffect, useState } from 'react'
import * as Icons from './icons'

export default function Toast({ message, type = 'info', visible, onRequestClose, onHidden }) {
  const [mounted, setMounted] = useState(visible)
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (visible) {
      setMounted(true)
      // allow next tick for transition
      requestAnimationFrame(() => setShow(true))
    } else if (mounted) {
      setShow(false)
      const t = setTimeout(() => {
        setMounted(false)
        if (onHidden) onHidden()
      }, 300)
      return () => clearTimeout(t)
    }
  }, [visible])

  if (!mounted) return null

  const bgClass = type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : type === 'warning' ? 'bg-yellow-400 text-black' : 'bg-blue-600'
  const icon = type === 'success' ? <Icons.CalendarCheckIcon className="w-5 h-5 text-white" /> : type === 'error' ? <Icons.XIcon className="w-5 h-5 text-white" /> : type === 'warning' ? <Icons.FileWarningIcon className="w-5 h-5 text-black" /> : <Icons.InfoIcon className="w-5 h-5 text-white" />

  return (
    <div
      className={`${bgClass} text-white rounded-lg shadow-lg ring-1 ring-black/10 overflow-hidden fixed bottom-6 right-6 z-50 w-auto max-w-xs transform transition-all duration-300 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3 p-3">
        <div className="flex-shrink-0 rounded-full bg-white/20 p-2">
          {icon}
        </div>
        <div className="flex-1 text-sm">{message}</div>
        <button
          className="ml-2 p-1 rounded-full hover:bg-white/10"
          onClick={() => {
            if (onRequestClose) onRequestClose()
          }}
          aria-label="Cerrar notificación"
        >
          <Icons.XIcon className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  )
}
