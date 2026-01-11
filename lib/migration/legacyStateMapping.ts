/**
 * Legacy State Migration System
 *
 * This module provides mapping functions to migrate from the legacy state-based navigation
 * system to the new Next.js App Router system. It handles the conversion between
 * activeScreen states and URL routes while preserving functionality.
 *
 * Requirements: 10.2, 10.3, 10.4
 */

import { SCREENS } from "../../src/utils/constants";

/**
 * Complete mapping from legacy activeScreen values to Next.js routes
 * This includes all screens from the original transit-app.jsx
 */
export const LEGACY_SCREEN_TO_ROUTE_MAP: Record<string, string> = {
  // Core navigation screens
  [SCREENS.HOME]: "/",
  [SCREENS.MY_PROFILE]: "/profile",
  [SCREENS.DOCUMENTS]: "/documents",
  [SCREENS.NEWS]: "/news",
  [SCREENS.REGULATIONS]: "/regulations",
  [SCREENS.REGULATION_DETAIL]: "/regulations", // Will be handled with dynamic routing
  [SCREENS.GLOSSARY]: "/glossary",
  [SCREENS.QUIZ]: "/quiz",
  [SCREENS.PQR]: "/pqr",
  [SCREENS.AI_ASSIST]: "/ai-assist",

  // Additional screens from legacy system
  [SCREENS.NOTIFICATIONS]: "/notifications",
  [SCREENS.HELP_CONTACT]: "/help-contact",
  [SCREENS.TERMS]: "/terms",
  [SCREENS.PICO_Y_PLACA]: "/pico-y-placa",
  [SCREENS.UNDER_CONSTRUCTION]: "/under-construction",

  // Legacy screen names that might exist in old state
  home: "/",
  "my-profile": "/profile",
  documents: "/documents",
  news: "/news",
  "regulations-main": "/regulations",
  "regulation-detail": "/regulations",
  glossary: "/glossary",
  quiz: "/quiz",
  pqr: "/pqr",
  "ai-assist": "/ai-assist",
  notifications: "/notifications",
  "help-contact": "/help-contact",
  terms: "/terms",
  "pico-y-placa": "/pico-y-placa",
  "under-construction": "/under-construction",

  // Additional legacy variations
  profile: "/profile",
  regulations: "/regulations",
  favorites: "/", // Favorites was mapped to home in legacy system
};

/**
 * Reverse mapping from routes to legacy screen identifiers
 * Used for maintaining compatibility with components that expect screen names
 */
export const ROUTE_TO_LEGACY_SCREEN_MAP: Record<string, string> = {
  "/": SCREENS.HOME,
  "/profile": SCREENS.MY_PROFILE,
  "/documents": SCREENS.DOCUMENTS,
  "/news": SCREENS.NEWS,
  "/regulations": SCREENS.REGULATIONS,
  "/glossary": SCREENS.GLOSSARY,
  "/quiz": SCREENS.QUIZ,
  "/pqr": SCREENS.PQR,
  "/ai-assist": SCREENS.AI_ASSIST,
  "/vehicles": SCREENS.DOCUMENTS, // Vehicles is part of documents section
  "/notifications": SCREENS.NOTIFICATIONS,
  "/help-contact": SCREENS.HELP_CONTACT,
  "/terms": SCREENS.TERMS,
  "/pico-y-placa": SCREENS.PICO_Y_PLACA,
  "/under-construction": SCREENS.UNDER_CONSTRUCTION,
};

/**
 * Dynamic route patterns and their corresponding legacy screens
 * Used for handling parameterized routes
 */
export const DYNAMIC_ROUTE_PATTERNS: Record<string, string> = {
  "/regulations/[id]": SCREENS.REGULATION_DETAIL,
  "/news/[id]": SCREENS.NEWS,
  "/documents/[id]": SCREENS.DOCUMENTS,
};

/**
 * Protected routes that require authentication
 * Migrated from NAVIGATION_ITEMS configuration
 */
export const PROTECTED_ROUTES = new Set([
  "/profile",
  "/documents",
  "/documents/[id]",
  "/vehicles",
  "/pqr",
  "/notifications",
]);

/**
 * Maps a legacy activeScreen value to the corresponding Next.js route
 *
 * @param activeScreen - The legacy screen identifier
 * @param params - Optional parameters for dynamic routes
 * @returns The corresponding route path
 */
export function mapLegacyScreenToRoute(
  activeScreen: string,
  params?: Record<string, string>
): string {
  // Direct mapping
  const route = LEGACY_SCREEN_TO_ROUTE_MAP[activeScreen];

  if (!route) {
    console.warn(`Unknown legacy screen: ${activeScreen}, defaulting to home`);
    return "/";
  }

  // Handle dynamic routes with parameters
  if (params && Object.keys(params).length > 0) {
    let finalRoute = route;

    // Replace route parameters with actual values
    Object.entries(params).forEach(([key, value]) => {
      finalRoute = finalRoute.replace(`[${key}]`, value);
    });

    return finalRoute;
  }

  return route;
}

/**
 * Maps a Next.js route to the corresponding legacy screen identifier
 *
 * @param route - The current route path
 * @returns The corresponding legacy screen identifier
 */
export function mapRouteToLegacyScreen(route: string): string {
  // Direct mapping
  if (ROUTE_TO_LEGACY_SCREEN_MAP[route]) {
    return ROUTE_TO_LEGACY_SCREEN_MAP[route];
  }

  // Handle dynamic routes by checking patterns
  for (const [pattern, screen] of Object.entries(DYNAMIC_ROUTE_PATTERNS)) {
    if (matchesRoutePattern(route, pattern)) {
      return screen;
    }
  }

  // Handle base paths for dynamic routes
  const segments = route.split("/").filter(Boolean);
  if (segments.length >= 2) {
    const basePath = `/${segments[0]}`;
    if (ROUTE_TO_LEGACY_SCREEN_MAP[basePath]) {
      return ROUTE_TO_LEGACY_SCREEN_MAP[basePath];
    }
  }

  // Default to home
  return SCREENS.HOME;
}

/**
 * Checks if a route matches a dynamic route pattern
 *
 * @param route - The actual route path
 * @param pattern - The route pattern with [param] syntax
 * @returns Whether the route matches the pattern
 */
function matchesRoutePattern(route: string, pattern: string): boolean {
  const routeSegments = route.split("/").filter(Boolean);
  const patternSegments = pattern.split("/").filter(Boolean);

  if (routeSegments.length !== patternSegments.length) {
    return false;
  }

  return patternSegments.every((segment, index) => {
    // Dynamic segments match any value
    if (segment.startsWith("[") && segment.endsWith("]")) {
      return true;
    }

    // Static segments must match exactly
    return segment === routeSegments[index];
  });
}

/**
 * Checks if a route requires authentication
 *
 * @param route - The route path to check
 * @returns Whether the route requires authentication
 */
export function isProtectedRoute(route: string): boolean {
  // Check direct matches
  if (PROTECTED_ROUTES.has(route)) {
    return true;
  }

  // Check dynamic route patterns
  for (const protectedRoute of PROTECTED_ROUTES) {
    if (
      protectedRoute.includes("[") &&
      matchesRoutePattern(route, protectedRoute)
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Extracts parameters from a dynamic route
 *
 * @param route - The actual route path
 * @param pattern - The route pattern with [param] syntax
 * @returns Object containing the extracted parameters
 */
export function extractRouteParams(
  route: string,
  pattern: string
): Record<string, string> {
  const routeSegments = route.split("/").filter(Boolean);
  const patternSegments = pattern.split("/").filter(Boolean);
  const params: Record<string, string> = {};

  if (routeSegments.length !== patternSegments.length) {
    return params;
  }

  patternSegments.forEach((segment, index) => {
    if (segment.startsWith("[") && segment.endsWith("]")) {
      const paramName = segment.slice(1, -1);
      params[paramName] = routeSegments[index];
    }
  });

  return params;
}

/**
 * Migrates legacy URL parameters to new route format
 * Handles the ?screen=... and #screen patterns from the original system
 *
 * @param searchParams - URL search parameters
 * @param hash - URL hash value
 * @returns The corresponding route path
 */
export function migrateLegacyUrlParams(
  searchParams: URLSearchParams,
  hash: string
): string {
  // Check for ?screen=... parameter
  const screenParam = searchParams.get("screen");
  if (screenParam) {
    return mapLegacyScreenToRoute(screenParam);
  }

  // Check for #screen hash
  const hashScreen = hash.replace(/^#/, "");
  if (hashScreen && hashScreen !== "") {
    return mapLegacyScreenToRoute(hashScreen);
  }

  // Default to home
  return "/";
}

/**
 * Validates that a legacy screen identifier is valid
 *
 * @param screen - The screen identifier to validate
 * @returns Whether the screen identifier is valid
 */
export function isValidLegacyScreen(screen: string): boolean {
  return Object.prototype.hasOwnProperty.call(
    LEGACY_SCREEN_TO_ROUTE_MAP,
    screen
  );
}

/**
 * Gets all available legacy screen identifiers
 *
 * @returns Array of all valid legacy screen identifiers
 */
export function getAllLegacyScreens(): string[] {
  return Object.keys(LEGACY_SCREEN_TO_ROUTE_MAP);
}

/**
 * Gets all available routes
 *
 * @returns Array of all valid route paths
 */
export function getAllRoutes(): string[] {
  return Object.keys(ROUTE_TO_LEGACY_SCREEN_MAP);
}
