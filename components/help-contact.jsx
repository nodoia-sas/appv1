"use client"

import React from 'react'

export default function HelpContact({ setActiveScreen }) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Ayuda / Contacto</h2>

      <section className="bg-white p-5 rounded-xl shadow-md border border-gray-200 mb-4">
        <h3 className="font-semibold text-gray-800 mb-2">Contáctanos</h3>
        <ul className="text-gray-700 text-sm space-y-2">
          <li className="flex items-center space-x-3">
            <div>
              <strong>Teléfono:</strong>{' '}
              <a href="tel:+573165678851" className="text-blue-600 hover:underline">+57 3165678851</a>
            </div>
            <div>
              {/* WhatsApp quick link with a prefixed message */}
              <a
                href="https://wa.me/573165678851?text=Hola%20NodoIA%2C%20necesito%20ayuda%20con%20la%20app"
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
            <a href="mailto:nodo.ia.sas@gmail.com" className="text-blue-600 hover:underline">nodo.ia.sas@gmail.com</a>
          </li>
          <li>
            <strong>Sitio web:</strong>{' '}
            <a href="https://nodoia.co/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://nodoia.co/</a>
          </li>
        </ul>
      </section>
    </div>
  )
}
