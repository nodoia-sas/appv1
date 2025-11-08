import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Transit IA - Tu asesor inteligente de tránsito",
  description: "Aplicación colombiana para consultar normas de tránsito, pico y placa, documentos vehiculares y más.",
  generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0ea5e9" />
        <link rel="icon" href="/icons/icon.svg" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
