"use client"

import React from 'react'

export default function Terms({ setActiveScreen }) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Términos y Privacidad</h2>
      <section className="bg-white p-5 rounded-xl shadow-md border border-gray-200 mb-4">
        <h3 className="font-semibold text-gray-800 mb-2">Términos de Uso</h3>
        <p className="text-gray-700 text-sm">Estos términos describen las reglas y condiciones para el uso de Transit IA. Al usar la aplicación aceptas no utilizarla para actividades ilegales y respetar la propiedad intelectual del contenido proporcionado.</p>
      </section>

      <section className="bg-white p-5 rounded-xl shadow-md border border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-2">Política de Privacidad</h3>
        <p className="text-gray-700 text-sm mb-2">Respetamos tu privacidad. La información de perfil provista por Auth0 (nombre, correo, foto) se usa únicamente para personalizar la experiencia dentro de la app. No compartimos datos personales con terceros sin tu consentimiento, salvo requerimiento legal.</p>
        <p className="text-gray-700 text-sm">Los datos almacenados en el navegador (vehículos, documentos, preferencias) se guardan en localStorage en tu dispositivo. Si necesitas eliminar tus datos, borra el almacenamiento local o utiliza la funcionalidad correspondiente en la app.</p>
      </section>
    </div>
  )
}
