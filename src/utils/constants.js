// Screen identifiers
export const SCREENS = {
  HOME: "home",
  MY_PROFILE: "my-profile",
  DOCUMENTS: "documents",
  NEWS: "news",
  REGULATIONS: "regulations",
  GLOSSARY: "glossary",
  QUIZ: "quiz",
  PQR: "pqr",
  AI_ASSIST: "ai-assist",
  HELP_CONTACT: "help-contact",
  TERMS: "terms",
  PICO_Y_PLACA: "pico-y-placa",
  UNDER_CONSTRUCTION: "under-construction",
};

// Notification types
export const NOTIFICATION_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
};

// Navigation items configuration
export const NAVIGATION_ITEMS = [
  {
    id: SCREENS.HOME,
    label: "Inicio",
    icon: "Home",
    requiresAuth: false,
  },
  {
    id: SCREENS.MY_PROFILE,
    label: "Perfil",
    icon: "User",
    requiresAuth: true,
  },
  {
    id: SCREENS.DOCUMENTS,
    label: "Documentos",
    icon: "FileText",
    requiresAuth: true,
  },
  {
    id: SCREENS.NEWS,
    label: "Noticias",
    icon: "Newspaper",
    requiresAuth: false,
  },
  {
    id: SCREENS.REGULATIONS,
    label: "Regulaciones",
    icon: "Book",
    requiresAuth: false,
  },
  {
    id: SCREENS.GLOSSARY,
    label: "Glosario",
    icon: "BookOpen",
    requiresAuth: false,
  },
  {
    id: SCREENS.QUIZ,
    label: "Quiz",
    icon: "ListChecks",
    requiresAuth: false,
  },
  {
    id: SCREENS.PQR,
    label: "PQR",
    icon: "MessageSquareText",
    requiresAuth: true,
  },
  {
    id: SCREENS.AI_ASSIST,
    label: "IA Asistente",
    icon: "Bot",
    requiresAuth: false,
  },
  {
    id: SCREENS.HELP_CONTACT,
    label: "Ayuda/Contacto",
    icon: "Info",
    requiresAuth: false,
  },
  {
    id: SCREENS.TERMS,
    label: "Términos",
    icon: "FileWarning",
    requiresAuth: false,
  },
  {
    id: SCREENS.PICO_Y_PLACA,
    label: "Pico y Placa",
    icon: "CalendarCheck",
    requiresAuth: false,
  },
];

// Default notification duration
export const DEFAULT_NOTIFICATION_DURATION = 3000;

// Local storage keys
export const STORAGE_KEYS = {
  APP_STORE: "transitia-app-store",
  USER_PREFERENCES: "transitia-user-preferences",
};

// API endpoints (to be used by services)
export const API_ENDPOINTS = {
  PROFILE: "/api/profile",
  DOCUMENTS: "/api/hooks/documents",
  VEHICLES: "/api/hooks/vehicles",
  GLOSSARIES: "/api/hooks/glossaries",
  AUTH: "/api/auth",
  CONFIG: "/api/config",
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Error de conexión. Por favor, intenta de nuevo.",
  AUTH_ERROR: "Error de autenticación. Por favor, inicia sesión nuevamente.",
  GENERIC_ERROR: "Ha ocurrido un error. Por favor, intenta de nuevo.",
  VALIDATION_ERROR: "Los datos ingresados no son válidos.",
};

// Success messages
export const SUCCESS_MESSAGES = {
  PROFILE_UPDATED: "Perfil actualizado correctamente.",
  DOCUMENT_SAVED: "Documento guardado correctamente.",
  VEHICLE_SAVED: "Vehículo guardado correctamente.",
  OPERATION_SUCCESS: "Operación completada exitosamente.",
};
