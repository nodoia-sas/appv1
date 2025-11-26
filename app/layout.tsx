import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const viewport: Viewport = {
  themeColor: "#0ea5e9",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Often desired for "app-like" feel on iOS
}

export const metadata: Metadata = {
  title: "Transit IA - Tu asesor inteligente de tránsito",
  description: "Aplicación colombiana para consultar normas de tránsito, pico y placa, documentos vehiculares y más.",
  generator: 'v0.app',
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/icon.svg',
    apple: [
      { url: '/icons/icon-192.png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: "TransitIA",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
