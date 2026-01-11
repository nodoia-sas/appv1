import { useEffect, useCallback } from "react";
import { useAppStore } from "../store/appStore";
import { useAuth } from "./useAuth";
import { SCREENS, NAVIGATION_ITEMS } from "../utils/constants";
import { useNavigationCompat } from "../../lib/navigation";

/**
 * useNavigation Hook - Manages navigation state and screen transitions
 *
 * MIGRATION NOTE: This hook now uses the new Next.js router-based navigation system
 * while maintaining backward compatibility with existing components.
 *
 * This hook provides a clean interface for components to:
 * - Navigate between screens with authentication checks
 * - Access current navigation state (active screen, history, back capability)
 * - Handle URL parameters and deep linking
 * - Manage protected routes that require authentication
 *
 * Requirements: 3.5, 3.6
 */
export const useNavigation = () => {
  // Use the new navigation system
  const newNavigation = useNavigationCompat();

  // Get legacy store actions for notifications
  const { showNotification } = useAppStore();

  // Get authentication state
  const { isAuthenticated, handleNavAuth } = useAuth();

  /**
   * Navigate to a specific screen with authentication checks
   * @param {string} screen - The screen identifier to navigate to
   * @param {Object} options - Navigation options
   * @param {boolean} options.requireAuth - Whether this navigation requires authentication
   * @param {boolean} options.skipAuthCheck - Skip authentication check (for internal use)
   */
  const navigate = useCallback(
    (screen, options = {}) => {
      // Delegate to the new navigation system
      return newNavigation.navigate(screen, options);
    },
    [newNavigation]
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
   * @param {string} screen - The screen identifier to check
   * @returns {boolean} - Whether the screen requires authentication
   */
  const isProtectedRoute = useCallback(
    (screen) => {
      return newNavigation.isProtectedRoute(screen);
    },
    [newNavigation]
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
   * Migrated from original transit-app.jsx URL parameter handling
   * NOTE: This is now handled automatically by Next.js routing
   */
  const handleDeepLinking = useCallback(() => {
    // Deep linking is now handled automatically by Next.js routing
    // This function is kept for backward compatibility
    console.log("Deep linking is now handled automatically by Next.js routing");
  }, []);

  /**
   * Set URL parameters for deep linking
   * NOTE: This is now handled automatically by Next.js routing
   * @param {string} screen - The screen to set in URL parameters
   * @param {boolean} useHash - Whether to use hash instead of query parameter
   */
  const setUrlParameter = useCallback(
    (screen, useHash = false) => {
      return newNavigation.setUrlParameter(screen, useHash);
    },
    [newNavigation]
  );

  /**
   * Clear URL parameters
   * NOTE: This is now handled automatically by Next.js routing
   */
  const clearUrlParameters = useCallback(() => {
    return newNavigation.clearUrlParameters();
  }, [newNavigation]);

  /**
   * Initialize deep linking on mount
   * NOTE: This is now handled automatically by Next.js routing
   */
  useEffect(() => {
    // No longer needed as Next.js handles routing automatically
  }, []);

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
    // State (mapped from new navigation system)
    activeScreen: newNavigation.activeScreen,
    history: getNavigationHistory(),
    canGoBack: newNavigation.canGoBack,

    // Navigation actions
    navigate,
    goBack,
    goHome,
    handleNavClick,

    // URL parameter handling (legacy compatibility)
    handleDeepLinking,
    setUrlParameter,
    clearUrlParameters,

    // Utility functions
    isProtectedRoute,
    isCurrentScreen,
    getCurrentScreenConfig,

    // Computed values
    isOnHomeScreen: newNavigation.activeScreen === SCREENS.HOME,
    currentScreenConfig: getCurrentScreenConfig(),

    // New navigation system properties (for components that want to use them)
    currentPath: newNavigation.currentPath,
    breadcrumbs: newNavigation.breadcrumbs,
    isNavigating: newNavigation.isNavigating,
  };
};

export default useNavigation;
