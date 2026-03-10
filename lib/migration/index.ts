/**
 * Legacy Migration System Exports
 *
 * This module provides all the necessary tools for migrating from the legacy
 * state-based navigation system to the new Next.js App Router system.
 */

// Core mapping functions
export {
  mapLegacyScreenToRoute,
  mapRouteToLegacyScreen,
  migrateLegacyUrlParams,
  isProtectedRoute,
  extractRouteParams,
  isValidLegacyScreen,
  getAllLegacyScreens,
  getAllRoutes,
  LEGACY_SCREEN_TO_ROUTE_MAP,
  ROUTE_TO_LEGACY_SCREEN_MAP,
  DYNAMIC_ROUTE_PATTERNS,
  PROTECTED_ROUTES,
} from "./legacyStateMapping";

// Migration hook and utilities
export { useLegacyMigration, withLegacyMigration } from "./useLegacyMigration";

// Re-export types (will be available when useLegacyMigration is imported)
