import { useEffect, useCallback } from "react";
import { useAppStore } from "../store/appStore";
import { useAuth } from "./useAuth";
import { SCREENS, NAVIGATION_ITEMS } from "../utils/constants";
import { useNavigationCompat } from "../../lib/navigation";
import { useLegacyMigration } from "../../lib/migration";

/**
 * useNavigation Hook - Manages navigation state and screen transitions
 *
 * MIGRATION NOTE: This hook now uses the new Next.js router-based navigation system
 * while maintaining backward compatibility with existing components through the legacy
 * migration system.
 *
 * This hook provides a clean interface for components to:
 * - Navigate between screens with authentication checks
 * - Access current navigation state (active screen, history, back capability)
 * - Handle URL parameters and deep linking
 * - Manage protected routes that require authentication
 * - Migrate legacy state-based navigation to route-based navigation
 *
 * Requirements: 3.5, 3.6, 10.5, 10.6
 */
export const useNavigation = () => {
  // Use the new navigation system
  const newNavigation = useNavigationCompat();

  // Use the legacy migration system
  const legacyMigration = useLegacyMigration();

  // Get legacy store actions for notifications
  const { showNotification } = useAppStore();

  // Get authentication state
  const { isAuthenticated, handleNavAuth } = useAuth();

  /**
   * Navigate to a specific screen with authentication checks
   * Enhanced with legacy migration support
   * @param {string} screen - The screen identifier to navigate to
   * @param {Object} options - Navigation options
   * @param {boolean} options.requireAuth - Whether this navigation requires authentication
   * @param {boolean} options.skipAuthCheck - Skip authentication check (for internal use)
   */
  const navigate = useCallback(
    (screen, options = {}) => {
      // Use legacy migration for backward compatibility
      const success = legacyMigration.handleLegacyNavigation(screen);

      if (!success) {
        // Fallback to new navigation system
        return newNavigation.navigate(screen, options);
      }

      return success;
    },
    [newNavigation, legacyMigration]
  );

  /**
   * Navigate back to the previous screen
   */
  const goBack = useCallback(() => {
    return newNavigation.goBack();
  }, [newNavigation]);

  /**
   * Navigate to home screen
   */
  const goHome = useCallback(() => {
    newNavigation.goHome();
  }, [newNavigation]);

  /**
   * Check if a screen requires authentication
   * Enhanced with legacy migration support
   * @param {string} screen - The screen identifier to check
   * @returns {boolean} - Whether the screen requires authentication
   */
  const isProtectedRoute = useCallback(
    (screen) => {
      // Use legacy migration system for accurate auth checking
      return legacyMigration.requiresAuth(screen);
    },
    [legacyMigration]
  );

  /**
   * Get the current screen's navigation item configuration
   * @returns {Object|null} - The navigation item configuration or null
   */
  const getCurrentScreenConfig = useCallback(() => {
    return newNavigation.getCurrentScreenConfig();
  }, [newNavigation]);

  /**
   * Handle URL parameters and deep linking on app initialization
   * Enhanced with legacy migration support
   * NOTE: This now handles migration from legacy URL parameters
   */
  const handleDeepLinking = useCallback(() => {
    // Use legacy migration system to handle URL parameter migration
    legacyMigration.handleUrlParameterMigration();
  }, [legacyMigration]);

  /**
   * Set URL parameters for deep linking
   * Enhanced with legacy migration support
   * @param {string} screen - The screen to set in URL parameters
   * @param {boolean} useHash - Whether to use hash instead of query parameter
   */
  const setUrlParameter = useCallback(
    (screen, useHash = false) => {
      // Use legacy migration system for URL parameter handling
      if (legacyMigration.isLegacyScreen(screen)) {
        // For legacy screens, migrate to proper route
        legacyMigration.migrateToRoute(screen);
      } else {
        // Fallback to new navigation system
        return newNavigation.setUrlParameter(screen, useHash);
      }
    },
    [newNavigation, legacyMigration]
  );

  /**
   * Clear URL parameters
   * Enhanced with legacy migration support
   */
  const clearUrlParameters = useCallback(() => {
    // Use legacy migration system to clear legacy URL parameters
    legacyMigration.clearLegacyUrlParams();
  }, [legacyMigration]);

  /**
   * Initialize deep linking and legacy migration on mount
   */
  useEffect(() => {
    // Handle legacy URL parameter migration on initialization
    handleDeepLinking();
  }, [handleDeepLinking]);

  /**
   * Navigation handler specifically for bottom navigation items
   * This includes the authentication logic that was in the original handleNavClick
   * @param {string} screen - The screen to navigate to
   */
  const handleNavClick = useCallback(
    (screen) => {
      return newNavigation.handleNavClick(screen);
    },
    [newNavigation]
  );

  /**
   * Get navigation history as screen names
   * @returns {string[]} - Array of screen identifiers in history
   */
  const getNavigationHistory = useCallback(() => {
    return newNavigation.history;
  }, [newNavigation.history]);

  /**
   * Check if currently on a specific screen
   * @param {string} screen - The screen identifier to check
   * @returns {boolean} - Whether currently on the specified screen
   */
  const isCurrentScreen = useCallback(
    (screen) => {
      return newNavigation.isCurrentScreen(screen);
    },
    [newNavigation]
  );

  return {
    // State (mapped from new navigation system with legacy compatibility)
    activeScreen: legacyMigration.currentLegacyScreen,
    history: getNavigationHistory(),
    canGoBack: newNavigation.canGoBack,

    // Navigation actions
    navigate,
    goBack,
    goHome,
    handleNavClick,

    // URL parameter handling (enhanced with legacy migration)
    handleDeepLinking,
    setUrlParameter,
    clearUrlParameters,

    // Utility functions
    isProtectedRoute,
    isCurrentScreen,
    getCurrentScreenConfig,

    // Computed values (using legacy migration for compatibility)
    isOnHomeScreen: legacyMigration.currentLegacyScreen === SCREENS.HOME,
    currentScreenConfig: getCurrentScreenConfig(),

    // New navigation system properties (for components that want to use them)
    currentPath: newNavigation.currentPath,
    breadcrumbs: newNavigation.breadcrumbs,
    isNavigating: newNavigation.isNavigating,

    // Legacy migration utilities (for advanced use cases)
    legacyMigration: {
      migrationState: legacyMigration.migrationState,
      setActiveScreen: legacyMigration.setActiveScreen,
      getActiveScreen: legacyMigration.getActiveScreen,
    },
  };
};

export default useNavigation;
