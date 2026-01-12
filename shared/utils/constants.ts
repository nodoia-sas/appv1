// Shared constants
export const API_ENDPOINTS = {
  DOCUMENTS: "/api/documents",
  VEHICLES: "/api/vehicles",
  REGULATIONS: "/api/regulations",
  NEWS: "/api/news",
  QUIZ: "/api/quiz",
  PQR: "/api/pqr",
} as const;

export const STORAGE_KEYS = {
  USER_PREFERENCES: "user_preferences",
  THEME: "theme",
  LANGUAGE: "language",
} as const;

export const ROUTES = {
  HOME: "/",
  DOCUMENTS: "/documents",
  VEHICLES: "/vehicles",
  REGULATIONS: "/regulations",
  NEWS: "/news",
  QUIZ: "/quiz",
  PQR: "/pqr",
  PROFILE: "/profile",
} as const;
