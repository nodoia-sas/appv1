# V0

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/duvanquilindobolanos-7651-4545a885/v0-v0)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/qDXesNcFfab)

# Transitia - Transit IA

Front-end construido con Next.js + React (App Router). Aplicación cliente con UI basada en TailwindCSS. Este README explica cómo instalar y ejecutar el proyecto en desarrollo y producción.

## 📦 Requisitos previos
- Node.js >= 18.x (comprobar con `node -v`)
- npm (recomendado, por la presencia de `package-lock.json`) — viene incluido con Node.js
- Git

## 🔧 Clonar el repositorio

Opciones:

- SSH:

	git clone git@github.com:Duvan88/Transitia-Duvan.git

- HTTPS:

	git clone https://github.com/Duvan88/Transitia-Duvan.git

Entra en el directorio del proyecto:

	cd Transitia-Duvan

## ⚙️ Instalación de dependencias

En PowerShell (Windows):

	npm install

Esto instalará todas las dependencias definidas en `package.json`.

## 🚀 Ejecutar en modo desarrollo

	npm run dev

Abrirá la app en modo dev (por defecto Next.js en http://localhost:3000). Actualizaciones en caliente habilitadas.

## 🏗️ Construir y ejecutar en producción (local)

1. Construir:

	 npm run build

2. Ejecutar producción:

	 pnpm start

## 🔎 Linter

	pnpm lint

## Notas importantes
- El proyecto usa `Next.js` (App Router) y la UI está mayormente contenida en `components/transit-app.jsx`.
- La app utiliza `localStorage` para persistencia local; no hay backend ni base de datos configurados por defecto.
- Hay una llamada de ejemplo al servicio generativo (Google Gemini) en `components/transit-app.jsx` donde la variable `apiKey` está vacía. No se recomienda exponer claves en el cliente.
 - PWA: se añadió soporte básico PWA. Para producción se recomienda usar `next-pwa` (configurado en `next.config.mjs`) y generar el service worker durante el build.

### Pasos PWA (producción)
1. Asegúrate de tener `next-pwa` en `devDependencies` (ya está incluido).
2. Reemplaza los iconos en `public/icons/` por versiones PNG 192x192 y 512x512 si quieres compatibilidad máxima.
3. Construye para producción (genera SW):

	pnpm build

	next-pwa generará el service worker y lo colocará en `public/`.
4. Inicia la app en modo producción local:

	pnpm start

5. Verifica en Chrome DevTools → Application → Service Workers y Manifest.

Si quieres que automatice la generación de iconos o gestione notificaciones de nueva versión de SW, puedo implementarlo.

