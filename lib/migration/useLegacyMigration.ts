/**
 * Legacy Migration Hook
 *
 * This hook provides compatibility functions for migrating from the legacy state-based
 * navigation system to the new Next.js App Router system. It handles URL parameter
 * migration, state synchronization, and provides a bridge for existing components.
 *
 * Requirements: 10.2, 10.3, 10.4
 */

"use client";

import { useEffect, useCallback, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  mapLegacyScreenToRoute,
  mapRouteToLegacyScreen,
  migrateLegacyUrlParams,
  isValidLegacyScreen,
  isProtectedRoute,
} from "./legacyStateMapping";

interface LegacyMigrationState {
  isInitialized: boolean;
  hasLegacyParams: boolean;
  migratedFrom: string | null;
}

/**
 * Hook for managing legacy navigation system migration
 */
export function useLegacyMigration() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Migration state
  const [migrationState, setMigrationState] = useState<LegacyMigrationState>({
    isInitialized: false,
    hasLegacyParams: false,
    migratedFrom: null,
  });

  /**
   * Get the current legacy screen based on the current route
   */
  const getCurrentLegacyScreen = useCallback((): string => {
    return mapRouteToLegacyScreen(pathname);
  }, [pathname]);

  /**
   * Migrate from legacy screen to new route
   */
  const migrateToRoute = useCallback(
    (screen: string, params?: Record<string, string>) => {
      if (!isValidLegacyScreen(screen)) {
        console.warn(`Invalid legacy screen: ${screen}`);
        return;
      }

      const route = mapLegacyScreenToRoute(screen, params);

      // Update migration state
      setMigrationState((prev) => ({
        ...prev,
        migratedFrom: screen,
      }));

      // Navigate to the new route
      router.push(route);
    },
    [router]
  );

  /**
   * Handle legacy navigation calls (compatibility function)
   */
  const handleLegacyNavigation = useCallback(
    (screen: string): boolean => {
      try {
        migrateToRoute(screen);
        return true;
      } catch (error) {
        console.error("Legacy navigation error:", error);
        return false;
      }
    },
    [migrateToRoute]
  );

  /**
   * Set active screen (legacy compatibility)
   */
  const setActiveScreen = useCallback(
    (screen: string) => {
      handleLegacyNavigation(screen);
    },
    [handleLegacyNavigation]
  );

  /**
   * Get active screen (legacy compatibility)
   */
  const getActiveScreen = useCallback((): string => {
    return getCurrentLegacyScreen();
  }, [getCurrentLegacyScreen]);

  /**
   * Handle URL parameter migration from legacy system
   * Migrates ?screen=... and #screen patterns to proper routes
   */
  const handleUrlParameterMigration = useCallback(() => {
    if (typeof window === "undefined") return;

    try {
      const currentUrl = new URL(window.location.href);
      const searchParams = new URLSearchParams(currentUrl.search);
      const hash = currentUrl.hash;

      // Check if there are legacy URL parameters
      const screenParam = searchParams.get("screen");
      const hashScreen = hash.replace(/^#/, "");

      if (screenParam || (hashScreen && hashScreen !== "")) {
        const targetRoute = migrateLegacyUrlParams(searchParams, hash);

        // Update migration state
        setMigrationState((prev) => ({
          ...prev,
          hasLegacyParams: true,
          migratedFrom: screenParam || hashScreen || null,
        }));

        // Clean up URL and navigate to proper route
        const cleanUrl = new URL(window.location.href);
        cleanUrl.searchParams.delete("screen");
        cleanUrl.hash = "";

        // Replace current URL state to clean it up
        window.history.replaceState(null, "", cleanUrl.pathname);

        // Navigate to the migrated route
        if (targetRoute !== pathname) {
          router.push(targetRoute);
        }
      }
    } catch (error) {
      console.error("URL parameter migration error:", error);
    }
  }, [router, pathname]);

  /**
   * Clear legacy URL parameters
   */
  const clearLegacyUrlParams = useCallback(() => {
    if (typeof window === "undefined") return;

    try {
      const url = new URL(window.location.href);
      url.searchParams.delete("screen");
      url.hash = "";
      window.history.replaceState(null, "", url.pathname);
    } catch (error) {
      console.error("Error clearing legacy URL params:", error);
    }
  }, []);

  /**
   * Check if a screen identifier is a valid legacy screen
   */
  const isLegacyScreen = useCallback((screen: string): boolean => {
    return isValidLegacyScreen(screen);
  }, []);

  /**
   * Check if a screen requires authentication
   */
  const requiresAuth = useCallback((screen: string): boolean => {
    const route = mapLegacyScreenToRoute(screen);
    return isProtectedRoute(route);
  }, []);

  /**
   * Initialize migration system on mount
   */
  useEffect(() => {
    if (!migrationState.isInitialized) {
      // Handle URL parameter migration on initialization
      handleUrlParameterMigration();

      // Mark as initialized
      setMigrationState((prev) => ({
        ...prev,
        isInitialized: true,
      }));
    }
  }, [migrationState.isInitialized, handleUrlParameterMigration]);

  /**
   * Handle browser navigation events for legacy compatibility
   */
  useEffect(() => {
    const handlePopState = () => {
      // Update migration state when user navigates via browser controls
      setMigrationState((prev) => ({
        ...prev,
        migratedFrom: null, // Reset migration source on browser navigation
      }));
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  /**
   * Monitor route changes for migration tracking
   */
  useEffect(() => {
    // Log migration events for debugging
    if (migrationState.migratedFrom) {
      console.log(
        `Legacy migration: ${migrationState.migratedFrom} -> ${pathname}`
      );
    }
  }, [pathname, migrationState.migratedFrom]);

  return {
    // State information
    migrationState,
    currentLegacyScreen: getCurrentLegacyScreen(),

    // Migration functions
    migrateToRoute,
    handleLegacyNavigation,

    // Compatibility functions
    setActiveScreen,
    getActiveScreen,

    // URL parameter handling
    handleUrlParameterMigration,
    clearLegacyUrlParams,

    // Utility functions
    isLegacyScreen,
    requiresAuth,
  };
}

export default useLegacyMigration;
