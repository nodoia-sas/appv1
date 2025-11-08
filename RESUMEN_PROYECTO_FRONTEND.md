# RESUMEN EJECUTIVO - PROYECTO FRONTEND

Este documento resume de forma breve y ejecutiva la arquitectura y las decisiones principales del código fuente del frontend.

## 🏗️ Estructura del Proyecto
- Patrón dominante: Single-page UI con un componente contenedor monolítico (no se sigue un patrón formal tipo Atomic Design). La mayor parte de la lógica y las vistas están en un único componente cliente: `components/transit-app.jsx`.
- Directorios y archivos clave:
  - `app/` — Entry points del App Router de Next.js (`layout.tsx`, `page.tsx`).
  - `components/` — Componentes y provider: `transit-app.jsx`, `theme-provider.tsx`.
  - `lib/` — Utilidades pequeñas (`lib/utils.ts`).
  - `public/`, `styles/` y `globals.css` — activos estáticos y estilos globales.
  - `package.json` — dependencias y scripts.

## ⚙️ Tecnologías Clave
- Framework / Librería: Next.js (App Router) + React (Next 15 / React 19 según `package.json`).
- Estilos y UI: TailwindCSS (clases utilitarias ampliamente usadas) y utilidades como `tailwind-merge` y `clsx`.
- Componentes UI / accesibilidad: Radix UI (`@radix-ui/*`) y bibliotecas variadas (icons inline en `transit-app.jsx`).
- Otras librerías importantes: `next-themes` (tema), `react-hook-form`, `zod`, `date-fns`, `recharts`, `sonner`.

## ⚛️ Manejo del Estado Global
- Estrategia principal: Hooks de React (useState, useEffect, useRef) dentro de `components/transit-app.jsx`.
- Persistencia: `localStorage` para estados persistentes (perfil, vehículos, documentos, favoritos, progreso de quiz).
- No hay uso de Redux/Zustand/React Query; tampoco hay stores centralizados. Solo existe un `ThemeProvider` para el manejo de tema (`components/theme-provider.tsx`).

## 💡 Componentes Principales y Patrones
- Componente contenedor: `components/transit-app.jsx` actúa como container principal — aloja múltiples “pantallas” (home, knowledge, quiz, news, profile, etc.).
- Presentational vs Container: la separación es mínima — la mayoría de piezas UI (botones, cards, íconos SVG) están inline dentro del mismo archivo.
- Patrones observados: composición vía funciones y hooks, callbacks pasados como props, gestión local de UI state (modales, dropdowns). No hay HOCs ni Render Props complejas ni custom hooks reutilizables.

## 🌐 Flujo de Datos y Conexión a la API
- Datos: la aplicación usa datasets estáticos definidos en `transit-app.jsx` (arrays `ALL_*`) y los combina con estados locales.
- Fetch/Mutación: casi no hay llamadas externas; existe una llamada simulada a una API generativa (Google Gemini) en `getAiResponse` usando `fetch` (clave vacía en el repo). No hay Axios ni librerías de data fetching como React Query o SWR.
- Centralización: la lógica de obtención, mutación y persistencia está distribuida dentro de `transit-app.jsx` (no centralizada en servicios o hooks separados).

## 🗺️ Rutas y Navegación
- Next.js App Router está presente (`app/layout.tsx`, `app/page.tsx`), pero la navegación de la app es mayoritariamente cliente-única y manejada por el estado `activeScreen` dentro de `components/transit-app.jsx`.
- Pantallas / rutas internas (nombres de pantalla usados dentro del state):
  - `home` — Inicio
  - `knowledge` — Conocimiento / Aprende a defenderte / Top de infracciones
  - `pico-y-placa` — Simulador Pico y Placa
  - `documents` — Documentos
  - `quiz` — Quiz de Tránsito
  - `news` — Noticias
  - `regulations-main` / `regulation-detail` — Normatividad
  - `glossary` — Glosario
  - `pqr` — PQR (Preguntas/Quejas/Reclamos)
  - `ai-assist` — Asistente IA (chat)
  - `favorites` — Favoritos
  - `my-profile` — Perfil de usuario
  - `notifications` — Notificaciones
  - `global-search` — Modal de búsqueda global

Nota: Si se desea exponer rutas URL navegables (SEO, compartir enlaces), conviene migrar cada pantalla a rutas de Next.js dentro de `app/` y extraer la lógica del componente monolítico en componentes y hooks reutilizables.

---

Archivo analizado: `components/transit-app.jsx`, `app/layout.tsx`, `app/page.tsx`, `components/theme-provider.tsx`, `lib/utils.ts`, `package.json`.
