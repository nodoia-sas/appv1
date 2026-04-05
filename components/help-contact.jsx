"use client"

import React from 'react'

const CONTACT_PHONE = process.env.NEXT_PUBLIC_CONTACT_PHONE || '573165678851'
const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'nodo.ia.sas@gmail.com'
const COMPANY_WEBSITE = process.env.NEXT_PUBLIC_COMPANY_WEBSITE || 'https://nodoia.co/'

export default function HelpContact({ setActiveScreen }) {
  const waMessage = encodeURIComponent('Hola NodoIA, necesito ayuda con la app')

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Ayuda / Contacto</h2>

      <section className="bg-white p-5 rounded-xl shadow-md border border-gray-200 mb-4">
        <h3 className="font-semibold text-gray-800 mb-2">Contáctanos</h3>
        <ul className="text-gray-700 text-sm space-y-2">
          <li className="flex items-center space-x-3">
            <div>
              <strong>Teléfono:</strong>{' '}
              <a href={`tel:+${CONTACT_PHONE}`} className="text-blue-600 hover:underline">+{CONTACT_PHONE}</a>
            </div>
            <div>
              {/* WhatsApp quick link with a prefixed message */}
              <a
                href={`https://wa.me/${CONTACT_PHONE}?text=${waMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1 rounded-full bg-green-500 text-white text-sm hover:bg-green-600"
                aria-label="Enviar mensaje por WhatsApp"
              >
                WhatsApp
              </a>
            </div>
          </li>
          <li>
            <strong>Email:</strong>{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-blue-600 hover:underline">{CONTACT_EMAIL}</a>
          </li>
          <li>
            <strong>Sitio web:</strong>{' '}
            <a href={COMPANY_WEBSITE} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{COMPANY_WEBSITE}</a>
          </li>
        </ul>
      </section>
    </div>
  )
}
