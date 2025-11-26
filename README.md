# Transitia - Transit IA

Plataforma integral para la gestión de tránsito, documentos y vehículos, potenciada por Inteligencia Artificial.

Este proyecto es una aplicación web moderna construida con **Next.js 15**, diseñada para ofrecer una experiencia de usuario fluida y eficiente en la administración de trámites de tránsito.

## 🚀 Características Principales

- **Gestión de Documentos Personales**: Visualización, carga y descarga de documentos personales en una interfaz organizada por pestañas.
- **Gestión de Vehículos**: Administración completa de vehículos (carros y motocicletas).
- **Documentación Vehicular**:
  - Carga y gestión de SOAT, Revisión Técnico Mecánica y Tarjeta de Propiedad.
  - Detección inteligente de documentos faltantes.
  - Soporte para fechas de vencimiento y alertas.
- **Interfaz Moderna**: UI responsiva y elegante construida con TailwindCSS y Radix UI.
- **Integración Backend**: Conexión con API REST para persistencia y gestión de datos.
- **Soporte PWA**: Optimizado para funcionar como una Progressive Web App.

## 🛠️ Stack Tecnológico

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router & Pages Router)
- **Lenguaje**: JavaScript / React 19
- **Estilos**: [TailwindCSS 4](https://tailwindcss.com/)
- **Componentes UI**: [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/) (Iconos)
- **Formularios**: React Hook Form + Zod
- **Gráficos**: Recharts
- **Autenticación**: Auth0 (Configurado)

## 📦 Requisitos Previos

- **Node.js**: Versión 18 o superior.
- **npm**: Gestor de paquetes (incluido con Node.js).

## 🔧 Instalación

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/nodoia-sas/appv1.git
   cd Transitia-Duvan
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

## ⚙️ Configuración

Crea un archivo `.env.local` en la raíz del proyecto para las variables de entorno necesarias. Ejemplo:

```env
# Ejemplo de variables (ajustar según necesidad)
NEXT_PUBLIC_API_URL=http://localhost:8010/transitia/api/v1
AUTH0_SECRET=...
AUTH0_BASE_URL=...
```

## ▶️ Ejecución

### Modo Desarrollo
Para iniciar el servidor de desarrollo con recarga en caliente:

```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:3000`.

### Modo Producción
Para construir y ejecutar la versión optimizada:

```bash
npm run build
npm start
```

## 📱 PWA (Progressive Web App)

El proyecto incluye configuración básica para PWA.
- Los iconos de la aplicación se encuentran en `public/`.
- `next-pwa` se encarga de generar el Service Worker durante el build.

## 📂 Estructura del Proyecto

- `/app`: Rutas y layouts del App Router.
- `/pages`: Rutas API y páginas legacy.
- `/components`: Componentes reutilizables de la UI.
- `/public`: Archivos estáticos (imágenes, iconos).
- `/styles`: Estilos globales.

---
*Desarrollado con ❤️ por el equipo de Transitia.*
