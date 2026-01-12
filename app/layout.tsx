import type React from "react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { NavigationProvider } from "@/lib/navigation";
import { PerformanceProvider } from "@/lib/performance/PerformanceProvider";
import { PWANavigationHandler } from "@/lib/pwa";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0ea5e9" },
    { media: "(prefers-color-scheme: dark)", color: "#1e3a8a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Often desired for "app-like" feel on iOS
};

export const metadata: Metadata = {
  title: "Transit IA - Tu asesor inteligente de tránsito",
  description:
    "Aplicación colombiana para consultar normas de tránsito, pico y placa, documentos vehiculares y más.",
  generator: "v0.app",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon.svg",
    apple: [{ url: "/icons/icon-192.png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TransitIA",
  },
  keywords: [
    "tránsito",
    "Colombia",
    "pico y placa",
    "documentos vehiculares",
    "normas de tránsito",
    "asistente IA",
    "TransitIA",
  ],
  authors: [{ name: "TransitIA Team" }],
  creator: "TransitIA",
  publisher: "TransitIA",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "https://transitia.app",
    siteName: "TransitIA",
    title: "Transit IA - Tu asesor inteligente de tránsito",
    description:
      "Aplicación colombiana para consultar normas de tránsito, pico y placa, documentos vehiculares y más.",
    images: [
      {
        url: "/icons/icon-512.png",
        width: 512,
        height: 512,
        alt: "TransitIA Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Transit IA - Tu asesor inteligente de tránsito",
    description:
      "Aplicación colombiana para consultar normas de tránsito, pico y placa, documentos vehiculares y más.",
    images: ["/icons/icon-512.png"],
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PerformanceProvider>
            <NavigationProvider>
              <PWANavigationHandler>{children}</PWANavigationHandler>
            </NavigationProvider>
          </PerformanceProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
