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
# Auth0 (requerido)
AUTH0_DOMAIN=tu-dominio.auth0.com
AUTH0_CLIENT_ID=tu-client-id
AUTH0_CLIENT_SECRET=tu-client-secret
AUTH0_SECRET=tu-secret-muy-seguro-de-32-caracteres-minimo
AUTH0_BASE_URL=http://localhost:3000

# Ambiente (opcional - por defecto: dev)
NEXT_PUBLIC_APP_ENV=dev

# Override manual de API (opcional)
# API_URL=http://localhost:8010/transitia/api/v1
```

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

- `/app`: Rutas y layouts del App Router.
- `/pages`: Rutas API y páginas legacy.
- `/components`: Componentes reutilizables de la UI.
- `/public`: Archivos estáticos (imágenes, iconos).
- `/styles`: Estilos globales.

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
