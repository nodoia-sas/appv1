import { useEffect, useCallback } from "react";
import { useAppStore } from "../store/appStore";
import { useAuth } from "./useAuth";
import { SCREENS, NAVIGATION_ITEMS } from "../utils/constants";

/**
 * useNavigation Hook - Manages navigation state and screen transitions
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
  // Get navigation state and actions from Zustand store
  const {
    navigation,
    navigate: storeNavigate,
    goBack: storeGoBack,
    showNotification,
  } = useAppStore();

  // Get authentication state
  const { isAuthenticated, handleNavAuth } = useAuth();

  // Extract navigation state for easier access
  const { activeScreen, history, canGoBack } = navigation;

  /**
   * Navigate to a specific screen with authentication checks
   * @param {string} screen - The screen identifier to navigate to
   * @param {Object} options - Navigation options
   * @param {boolean} options.requireAuth - Whether this navigation requires authentication
   * @param {boolean} options.skipAuthCheck - Skip authentication check (for internal use)
   */
  const navigate = useCallback(
    (screen, options = {}) => {
      const { requireAuth = null, skipAuthCheck = false } = options;

      // Validate screen exists
      if (!Object.values(SCREENS).includes(screen)) {
        console.warn(`Invalid screen: ${screen}. Defaulting to home.`);
        screen = SCREENS.HOME;
      }

      // Check if screen requires authentication
      const navigationItem = NAVIGATION_ITEMS.find(
        (item) => item.id === screen
      );
      const screenRequiresAuth =
        requireAuth !== null
          ? requireAuth
          : navigationItem?.requiresAuth || false;

      // Handle authentication requirements for protected routes
      if (!skipAuthCheck && screenRequiresAuth && !isAuthenticated) {
        showNotification(
          "Debes iniciar sesión para acceder a esta sección",
          "info"
        );

        // Use Auth service to handle navigation authentication
        handleNavAuth(screen);
        return false; // Navigation was blocked
      }

      // Perform navigation
      storeNavigate(screen);
      return true; // Navigation was successful
    },
    [isAuthenticated, storeNavigate, showNotification, handleNavAuth]
  );

  /**
   * Navigate back to the previous screen
   */
  const goBack = useCallback(() => {
    if (canGoBack) {
      storeGoBack();
      return true;
    }
    return false;
  }, [canGoBack, storeGoBack]);

  /**
   * Navigate to home screen
   */
  const goHome = useCallback(() => {
    navigate(SCREENS.HOME, { skipAuthCheck: true });
  }, [navigate]);

  /**
   * Check if a screen requires authentication
   * @param {string} screen - The screen identifier to check
   * @returns {boolean} - Whether the screen requires authentication
   */
  const isProtectedRoute = useCallback((screen) => {
    const navigationItem = NAVIGATION_ITEMS.find((item) => item.id === screen);
    return navigationItem?.requiresAuth || false;
  }, []);

  /**
   * Get the current screen's navigation item configuration
   * @returns {Object|null} - The navigation item configuration or null
   */
  const getCurrentScreenConfig = useCallback(() => {
    return NAVIGATION_ITEMS.find((item) => item.id === activeScreen) || null;
  }, [activeScreen]);

  /**
   * Handle URL parameters and deep linking on app initialization
   */
  const handleDeepLinking = useCallback(() => {
    try {
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const qScreen = params.get("screen");
        const hashScreen = window.location.hash
          ? window.location.hash.replace(/^#/, "")
          : null;
        const targetScreen = qScreen || hashScreen;

        if (targetScreen && Object.values(SCREENS).includes(targetScreen)) {
          // Navigate to the target screen (with auth checks)
          navigate(targetScreen);

          // Clean up URL parameters
          const url = new URL(window.location.href);
          url.searchParams.delete("screen");
          window.history.replaceState(
            null,
            "",
            url.pathname + (window.location.hash || "")
          );
        }
      }
    } catch (error) {
      console.warn("Error handling deep linking:", error);
    }
  }, [navigate]);

  /**
   * Initialize deep linking on mount
   */
  useEffect(() => {
    handleDeepLinking();
  }, [handleDeepLinking]);

  /**
   * Navigation handler specifically for bottom navigation items
   * This includes the authentication logic that was in the original handleNavClick
   * @param {string} screen - The screen to navigate to
   */
  const handleNavClick = useCallback(
    (screen) => {
      // Home screen doesn't require authentication
      if (screen === SCREENS.HOME) {
        navigate(screen, { skipAuthCheck: true });
        return;
      }

      // All other screens require authentication check
      navigate(screen, { requireAuth: true });
    },
    [navigate]
  );

  /**
   * Get navigation history as screen names
   * @returns {string[]} - Array of screen identifiers in history
   */
  const getNavigationHistory = useCallback(() => {
    // Ensure history is always an array, even if undefined from persistence
    return Array.isArray(history) ? [...history] : [activeScreen];
  }, [history, activeScreen]);

  /**
   * Check if currently on a specific screen
   * @param {string} screen - The screen identifier to check
   * @returns {boolean} - Whether currently on the specified screen
   */
  const isCurrentScreen = useCallback(
    (screen) => {
      return activeScreen === screen;
    },
    [activeScreen]
  );

  return {
    // State
    activeScreen,
    history: getNavigationHistory(),
    canGoBack,

    // Navigation actions
    navigate,
    goBack,
    goHome,
    handleNavClick,

    // Utility functions
    isProtectedRoute,
    isCurrentScreen,
    getCurrentScreenConfig,
    handleDeepLinking,

    // Computed values
    isOnHomeScreen: activeScreen === SCREENS.HOME,
    currentScreenConfig: getCurrentScreenConfig(),
  };
};

export default useNavigation;
