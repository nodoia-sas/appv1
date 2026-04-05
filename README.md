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
   cd appv1
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto. Puedes usar `.env.example` como referencia:

```bash
cp .env.example .env.local
```

### Configuración de Ambientes

El proyecto soporta múltiples ambientes con endpoints específicos:

| Ambiente           | Variable                                | Endpoint                                             |
| ------------------ | --------------------------------------- | ---------------------------------------------------- |
| **Local**          | `NEXT_PUBLIC_APP_ENV=local`             | `http://localhost:8010/transitia/api/v1`             |
| **Development** ⭐ | `NEXT_PUBLIC_APP_ENV=dev` (por defecto) | `https://api-dev.transitia.com/transitia/api/v1`     |
| **Staging**        | `NEXT_PUBLIC_APP_ENV=staging`           | `https://api-staging.transitia.com/transitia/api/v1` |
| **Production**     | `NEXT_PUBLIC_APP_ENV=production`        | `https://api.transitia.com/transitia/api/v1`         |

### Configuración Mínima (.env.local)

```env
# Ambiente (opcional - por defecto: dev)
NEXT_PUBLIC_APP_ENV=dev

# Auth0 (requerido)
AUTH0_DOMAIN=tu-dominio.auth0.com
AUTH0_CLIENT_ID=tu-client-id
AUTH0_CLIENT_SECRET=tu-client-secret
AUTH0_SECRET=tu-secret-muy-seguro-de-32-caracteres-minimo
AUTH0_BASE_URL=http://localhost:3000

# URL pública de la app (usada en metadata/SEO)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# URL base del backend (solo host:puerto)
API_BASE_URL=http://localhost:8010

# Glosario
NEXT_PUBLIC_GLOSSARY_API_URL=http://localhost:8011/glossaries

# Asistente IA - Google Gemini
NEXT_PUBLIC_GEMINI_API_KEY=
NEXT_PUBLIC_GEMINI_MODEL=gemini-2.5-flash-preview-05-20
```

### Referencia Completa de Variables de Entorno

#### Auth0

| Variable | Descripción | Requerida |
|---|---|---|
| `AUTH0_DOMAIN` | Dominio de tu tenant en Auth0 | Sí |
| `AUTH0_CLIENT_ID` | Client ID de la aplicación | Sí |
| `AUTH0_CLIENT_SECRET` | Client Secret de la aplicación | Sí |
| `AUTH0_SECRET` | Secret para firmar cookies (mín. 32 chars) | Sí |
| `AUTH0_BASE_URL` | URL base de la app (para callbacks) | Sí |
| `AUTH0_AUDIENCE` | Audience del API en Auth0 | No |

#### API Backend

| Variable | Descripción | Por defecto |
|---|---|---|
| `API_BASE_URL` | URL base del backend (host:puerto) — usada en `/api/profile` | `http://localhost:8010` |
| `API_URL` | Override completo de la URL con path (máxima prioridad) | — |
| `API_BASE_PATH` | Path base del API | `/transitia/api/v1` |
| `API_BASE_URL_LOCAL` | URL base para el ambiente `local` | `http://localhost:8010` |
| `API_BASE_URL_DEV` | URL base para el ambiente `dev` | `https://api-dev.transitia.com` |
| `API_BASE_URL_STAGING` | URL base para el ambiente `staging` | `https://api-staging.transitia.com` |
| `API_BASE_URL_PRODUCTION` | URL base para el ambiente `production` | `https://api.transitia.com` |

#### Aplicación y SEO

| Variable | Descripción | Por defecto |
|---|---|---|
| `NEXT_PUBLIC_APP_ENV` | Ambiente activo (`local`, `dev`, `staging`, `production`) | `dev` |
| `NEXT_PUBLIC_APP_URL` | URL pública de la app (usada en metadata y Open Graph) | `https://transitia.app` |
| `NEXT_PUBLIC_SITE_NAME` | Nombre del sitio para SEO | `TransitIA` |
| `NEXT_PUBLIC_TWITTER_HANDLE` | Handle de Twitter/X para metadata | `@TransitIA` |

#### Servicios Externos

| Variable | Descripción | Por defecto |
|---|---|---|
| `NEXT_PUBLIC_GLOSSARY_API_URL` | URL del servicio de glosario | `http://localhost:8011/glossaries` |
| `NEXT_PUBLIC_PYPHOY_URL` | URL del servicio Pico y Placa | `https://www.pyphoy.com/bogota` |
| `NEXT_PUBLIC_SIMIT_URL` | URL del SIMIT para consulta de multas | `https://www.fcm.org.co/simit/#/estado-cuenta` |

#### Asistente IA (Google Gemini)

| Variable | Descripción | Por defecto |
|---|---|---|
| `NEXT_PUBLIC_GEMINI_API_KEY` | API key de Google Gemini | *(vacío)* |
| `NEXT_PUBLIC_GEMINI_MODEL` | Modelo de Gemini a usar | `gemini-2.5-flash-preview-05-20` |

> **Advertencia de seguridad:** Al usar el prefijo `NEXT_PUBLIC_`, la API key queda expuesta en el bundle del cliente. Para producción se recomienda implementar un API route proxy que mantenga la key en el servidor.

#### Información de Contacto

| Variable | Descripción | Por defecto |
|---|---|---|
| `NEXT_PUBLIC_CONTACT_PHONE` | Número de teléfono/WhatsApp (sin `+`) | `573165678851` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Email de contacto | `nodo.ia.sas@gmail.com` |
| `NEXT_PUBLIC_COMPANY_WEBSITE` | Sitio web de la empresa | `https://nodoia.co/` |

#### Depuración y Monitoreo

| Variable | Descripción | Por defecto |
|---|---|---|
| `NEXT_PUBLIC_DEBUG` | Habilita logs de depuración | `false` |
| `NEXT_PUBLIC_LOG_LEVEL` | Nivel de log (`info`, `warn`, `error`) | `info` |
| `NEXT_PUBLIC_ANALYTICS_ENABLED` | Habilita analytics | `false` |
| `NEXT_PUBLIC_SENTRY_ENABLED` | Habilita Sentry | `false` |

### Verificar Configuración

Puedes verificar la configuración actual visitando:

- **Diagnóstico**: `http://localhost:3000/api/config/environment`
- **Con validación**: `http://localhost:3000/api/config/environment?validate=true`

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

El proyecto utiliza una **arquitectura basada en features** para mejorar la mantenibilidad y escalabilidad:

### Estructura Principal

```
/app                    # Rutas y layouts del App Router (Next.js 15)
/pages                  # Rutas API y páginas legacy
/features               # ⭐ Módulos organizados por dominio de negocio
  /documents            # Feature de gestión de documentos
  /vehicles             # Feature de gestión de vehículos
  /regulations          # Feature de regulaciones y normativas
  /news                 # Feature de noticias
  /quiz                 # Feature de quiz educativo
  /pqr                  # Feature de PQR
/shared                 # ⭐ Código compartido entre features
  /components           # Componentes UI reutilizables
  /hooks                # Hooks personalizados compartidos
  /utils                # Utilidades comunes
  /types                # Tipos TypeScript compartidos
/components             # Componentes legacy (en proceso de migración)
/lib                    # Utilidades y servicios legacy
/public                 # Archivos estáticos (imágenes, iconos)
/styles                 # Estilos globales
```

### Estructura de Features

Cada feature sigue una estructura estándar para mantener consistencia:

```
/features/{feature-name}
  /components           # Componentes específicos de la feature
  /hooks                # Hooks personalizados de la feature
  /services             # Lógica de negocio y llamadas API
  /types                # Tipos TypeScript de la feature
  index.ts              # Barrel export (API pública)
```

### Principios de Arquitectura

1. **Encapsulación por Dominio**: Cada feature agrupa toda su funcionalidad relacionada
2. **Separación Clara**: Código específico de features vs código compartido
3. **API Pública Controlada**: Cada feature expone solo lo necesario mediante barrel exports
4. **Independencia de Features**: Las features no dependen directamente entre sí
5. **Código Compartido**: Utilidades y componentes comunes viven en `/shared`

### Ejemplo de Uso

```typescript
// ✅ Importar desde la API pública de una feature
import { Documents, useDocuments } from "@/features/documents";

// ✅ Importar componentes compartidos
import { Button } from "@/shared/components";

// ❌ NO importar directamente desde implementaciones internas
// import { DocumentCard } from '@/features/documents/components/DocumentCard'
```

## 🏗️ Guía para Agregar Nuevas Features

### Paso 1: Crear la Estructura

Crea la estructura estándar para tu nueva feature:

```bash
mkdir -p features/mi-feature/{components,hooks,services,types}
touch features/mi-feature/index.ts
```

### Paso 2: Implementar los Componentes

Crea los componentes específicos de tu feature en `/features/mi-feature/components`:

```typescript
// features/mi-feature/components/MiComponente.tsx
import { useMiFeature } from "../hooks/useMiFeature";

export function MiComponente() {
  const { data, loading } = useMiFeature();
  // Implementación del componente
}
```

### Paso 3: Crear el Service Layer

Encapsula la lógica de negocio y llamadas API en `/features/mi-feature/services`:

```typescript
// features/mi-feature/services/miFeatureService.ts
import { apiClient } from "@/shared/utils/apiClient";

export const miFeatureService = {
  async getData() {
    return apiClient.get("/mi-feature/data");
  },
};
```

### Paso 4: Implementar Hooks Personalizados

Crea hooks que encapsulen el estado y la lógica en `/features/mi-feature/hooks`:

```typescript
// features/mi-feature/hooks/useMiFeature.ts
import { useState, useEffect } from "react";
import { miFeatureService } from "../services/miFeatureService";

export function useMiFeature() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Lógica del hook

  return { data, loading };
}
```

### Paso 5: Definir Tipos TypeScript

Define los tipos específicos en `/features/mi-feature/types`:

```typescript
// features/mi-feature/types/index.ts
export interface MiFeatureData {
  id: string;
  name: string;
}
```

### Paso 6: Crear el Barrel Export

Expón la API pública de tu feature en `/features/mi-feature/index.ts`:

```typescript
// features/mi-feature/index.ts
export { MiComponente } from "./components/MiComponente";
export { useMiFeature } from "./hooks/useMiFeature";
export type { MiFeatureData } from "./types";
```

### Paso 7: Usar la Feature

Importa y usa tu feature desde otros lugares:

```typescript
// app/mi-pagina/page.tsx
import { MiComponente } from "@/features/mi-feature";

export default function MiPagina() {
  return <MiComponente />;
}
```

### Mejores Prácticas

1. **Mantén la Encapsulación**: No expongas detalles internos de implementación
2. **Usa Shared para Código Común**: Si algo se usa en múltiples features, muévelo a `/shared`
3. **Evita Dependencias entre Features**: Las features no deben importarse directamente entre sí
4. **Sigue la Estructura Estándar**: Mantén consistencia con las features existentes
5. **Documenta la API Pública**: Comenta qué expone cada feature en su `index.ts`

## 🗺️ Rutas y Funcionalidades del Sistema

### **🏠 Navegación Principal**

La aplicación utiliza un sistema de navegación interna basado en estado (`activeScreen`) manejado por el componente principal `transit-app.jsx`.

| Pantalla           | Componente          | Descripción                                    | Estado          |
| ------------------ | ------------------- | ---------------------------------------------- | --------------- |
| **Inicio**         | `transit-app.jsx`   | Dashboard principal con acceso rápido          | `home`          |
| **Perfil**         | `my-profile.jsx`    | Gestión de perfil de usuario                   | `my-profile`    |
| **Documentos**     | `documents.jsx`     | Gestión de documentos personales y vehiculares | `documents`     |
| **Favoritos**      | `transit-app.jsx`   | Contenido marcado como favorito                | `favorites`     |
| **Notificaciones** | `notifications.jsx` | Centro de notificaciones                       | `notifications` |

### **📚 Módulo de Conocimiento**

Sistema educativo y de consulta sobre normativas de tránsito.

#### **Regulaciones y Normativas**

| Componente          | Archivo                    | Funcionalidad                                |
| ------------------- | -------------------------- | -------------------------------------------- |
| **Lista Principal** | `regulations-main.jsx`     | Vista principal de regulaciones              |
| **Detalle**         | `regulation-detail.jsx`    | Vista detallada de una regulación específica |
| **Datos**           | `regulations.jsx`          | Componente de presentación de regulaciones   |
| **Utilidades**      | `lib/regulations-utils.js` | Lógica de negocio y manejo de datos          |

**Estados de navegación:**

- `regulations-main` - Lista de regulaciones
- `regulation-detail` - Detalle de regulación específica

#### **Glosario de Términos**

| Componente          | Archivo                                 | Funcionalidad                           |
| ------------------- | --------------------------------------- | --------------------------------------- |
| **Vista Principal** | `glossary-main.jsx`                     | Interfaz principal del glosario         |
| **Presentación**    | `glossary.jsx`                          | Componente de visualización de términos |
| **Utilidades**      | `lib/glossary-utils.js`                 | Gestión de términos y búsqueda          |
| **API Backend**     | `pages/api/hooks/glossaries/listAll.js` | Endpoint para obtener términos          |

**Estado de navegación:** `glossary`

#### **Noticias de Tránsito**

| Componente          | Archivo             | Funcionalidad                   |
| ------------------- | ------------------- | ------------------------------- |
| **Vista Principal** | `news.jsx`          | Lista y detalle de noticias     |
| **Utilidades**      | `lib/news-utils.js` | Gestión de noticias y favoritos |

**Estado de navegación:** `news`

### **🎓 Módulo Educativo**

#### **Quiz de Tránsito**

| Componente           | Archivo             | Funcionalidad                     |
| -------------------- | ------------------- | --------------------------------- |
| **Quiz Interactivo** | `quiz.jsx`          | Sistema de preguntas y respuestas |
| **Utilidades**       | `lib/quiz-utils.js` | Lógica del quiz y puntuación      |

**Estado de navegación:** `quiz`

#### **Simulador Pico y Placa**

| Componente     | Archivo             | Funcionalidad                            |
| -------------- | ------------------- | ---------------------------------------- |
| **Simulador**  | `pico-y-placa.jsx`  | Calculadora de restricciones vehiculares |
| **Utilidades** | `lib/pico-utils.js` | Lógica de cálculo de restricciones       |

**Estado de navegación:** `pico-y-placa`

### **📄 Gestión de Documentos**

#### **Documentos Personales y Vehiculares**

| Componente           | Archivo                         | Funcionalidad                        |
| -------------------- | ------------------------------- | ------------------------------------ |
| **Vista Principal**  | `documents.jsx`                 | Gestión completa de documentos       |
| **Manager Avanzado** | `components/documents-manager/` | Funcionalidades avanzadas de gestión |
| **Utilidades**       | `lib/documents-utils.js`        | Lógica de negocio de documentos      |

**APIs Backend:**

- `pages/api/hooks/documents/list.js` - Listar documentos
- `pages/api/hooks/documents/add.js` - Agregar documento
- `pages/api/hooks/documents/edit.js` - Editar documento
- `pages/api/hooks/documents/delete.js` - Eliminar documento

**Estado de navegación:** `documents`

### **🚗 Gestión de Vehículos**

#### **Administración de Vehículos**

| Componente  | Archivo          | Funcionalidad                           |
| ----------- | ---------------- | --------------------------------------- |
| **Gestión** | `my-profile.jsx` | Administración de vehículos del usuario |

**APIs Backend:**

- `pages/api/hooks/vehicles/list.js` - Listar vehículos
- `pages/api/hooks/vehicles/add.js` - Agregar vehículo
- `pages/api/hooks/vehicles/delete.js` - Eliminar vehículo

### **🤖 Asistente IA**

#### **Chat Inteligente**

| Componente     | Archivo           | Funcionalidad                   |
| -------------- | ----------------- | ------------------------------- |
| **Chat IA**    | `ai-assist.jsx`   | Asistente conversacional        |
| **Utilidades** | `lib/ai-utils.js` | Integración con servicios de IA |

**Estado de navegación:** `ai-assist`

### **📞 Soporte y Servicios**

#### **PQR (Peticiones, Quejas y Reclamos)**

| Componente          | Archivo            | Funcionalidad                       |
| ------------------- | ------------------ | ----------------------------------- |
| **Vista Principal** | `pqr-main.jsx`     | Interfaz principal de PQR           |
| **Formularios**     | `pqr.jsx`          | Componentes de formularios PQR      |
| **Utilidades**      | `lib/pqr-utils.js` | Gestión de PQR y persistencia local |

**Estado de navegación:** `pqr`

#### **Ayuda y Contacto**

| Componente   | Archivo            | Funcionalidad                   |
| ------------ | ------------------ | ------------------------------- |
| **Soporte**  | `help-contact.jsx` | Información de contacto y ayuda |
| **Términos** | `terms.jsx`        | Términos y condiciones          |

**Estados de navegación:**

- `help-contact` - Ayuda y contacto
- `terms` - Términos y privacidad

### **🔧 Utilidades del Sistema**

#### **Gestión de Favoritos**

| Archivo                  | Funcionalidad                     |
| ------------------------ | --------------------------------- |
| `lib/favorites-utils.js` | Sistema de favoritos cross-módulo |

#### **Configuración de Ambiente**

| Archivo                           | Funcionalidad                           |
| --------------------------------- | --------------------------------------- |
| `lib/api-config.js`               | Configuración de endpoints por ambiente |
| `pages/api/config/environment.js` | Diagnóstico de configuración            |
| `components/environment-info.jsx` | Interfaz de diagnóstico                 |

### **🔐 Autenticación y Seguridad**

#### **Auth0 Integration**

| Archivo                        | Funcionalidad                 |
| ------------------------------ | ----------------------------- |
| `lib/auth0.js`                 | Configuración de Auth0        |
| `middleware.js`                | Middleware de autenticación   |
| `pages/api/auth/[...auth0].js` | Rutas de autenticación        |
| `pages/api/profile.js`         | Perfil de usuario autenticado |

### **🎨 Componentes de UI**

#### **Sistema de Iconos**

| Archivo                            | Funcionalidad                         |
| ---------------------------------- | ------------------------------------- |
| `components/icons.jsx`             | Biblioteca centralizada de iconos SVG |
| `components/icons-placeholder.jsx` | Iconos placeholder                    |

#### **Componentes Globales**

| Archivo                         | Funcionalidad                     |
| ------------------------------- | --------------------------------- |
| `components/theme-provider.tsx` | Proveedor de temas (claro/oscuro) |
| `components/toast.jsx`          | Sistema de notificaciones toast   |
| `components/register-sw.tsx`    | Registro de Service Worker        |

### **📱 Funcionalidades PWA**

#### **Service Worker**

| Archivo                | Funcionalidad              |
| ---------------------- | -------------------------- |
| `public/sw.js`         | Service Worker principal   |
| `public/workbox-*.js`  | Workbox para cache offline |
| `public/manifest.json` | Manifiesto de la PWA       |

### **🔄 Estados de Navegación Completos**

```javascript
// Estados disponibles en activeScreen
const screens = {
  home: "Pantalla principal",
  knowledge: "Módulo de conocimiento",
  "pico-y-placa": "Simulador pico y placa",
  documents: "Gestión de documentos",
  quiz: "Quiz de tránsito",
  news: "Noticias",
  "regulations-main": "Lista de regulaciones",
  "regulation-detail": "Detalle de regulación",
  glossary: "Glosario de términos",
  pqr: "PQR - Peticiones, quejas y reclamos",
  "ai-assist": "Asistente IA",
  favorites: "Contenido favorito",
  "my-profile": "Perfil de usuario",
  notifications: "Centro de notificaciones",
  "global-search": "Búsqueda global",
  "help-contact": "Ayuda y contacto",
  terms: "Términos y privacidad",
};
```

### **🗄️ Persistencia de Datos**

#### **LocalStorage**

- **Favoritos**: `transit-favorites`
- **PQR**: `transit-pqrs`
- **Progreso Quiz**: Manejado internamente por componente
- **Configuración Usuario**: Sincronizado con backend

#### **Backend APIs**

- **Perfil**: `/api/profile`
- **Documentos**: `/api/hooks/documents/*`
- **Vehículos**: `/api/hooks/vehicles/*`
- **Glosario**: `/api/hooks/glossaries/*`
- **Configuración**: `/api/config/environment`

---

_Desarrollado con ❤️ por el equipo de Transitia._
