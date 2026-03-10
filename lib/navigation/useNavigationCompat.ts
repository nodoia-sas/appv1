"use client";

import { useCallback } from "react";
import { useNavigation } from "./NavigationProvider";
import { useAuth } from "../../src/hooks/useAuth";
import { useAppStore } from "../../src/store/appStore";
import { SCREENS, NAVIGATION_ITEMS } from "../../src/utils/constants";

/**
 * Compatibility hook that provides the same interface as the legacy useNavigation hook
 * while using the new Next.js router-based navigation system.
 *
 * This hook bridges the gap between the old state-based navigation and the new route-based navigation,
 * allowing existing components to work without modification during the migration period.
 */
export function useNavigationCompat() {
  const navigation = useNavigation();
  const { isAuthenticated } = useAuth();
  const { showNotification } = useAppStore();

  /**
   * Navigate to a specific screen with authentication checks (legacy compatibility)
   * @param screen - The screen identifier to navigate to
   * @param options - Navigation options
   */
  const navigate = useCallback(
    (
      screen: string,
      options: { requireAuth?: boolean; skipAuthCheck?: boolean } = {}
    ) => {
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

        // Redirect to login with return URL
        if (typeof window !== "undefined") {
          const returnUrl = encodeURIComponent(
            window.location.pathname + window.location.search
          );
          window.location.href = `/api/auth/login?returnTo=${returnUrl}`;
        }
        return false; // Navigation was blocked
      }

      // Perform navigation using new system
      navigation.navigate(screen);
      return true; // Navigation was successful
    },
    [navigation, isAuthenticated, showNotification]
  );

  /**
   * Navigate back to the previous screen
   */
  const goBack = useCallback(() => {
    if (navigation.canGoBack) {
      navigation.goBack();
      return true;
    }
    return false;
  }, [navigation]);

  /**
   * Navigate to home screen
   */
  const goHome = useCallback(() => {
    navigation.navigate(SCREENS.HOME);
  }, [navigation]);

  /**
   * Check if a screen requires authentication
   */
  const isProtectedRoute = useCallback((screen: string) => {
    const navigationItem = NAVIGATION_ITEMS.find((item) => item.id === screen);
    return navigationItem?.requiresAuth || false;
  }, []);

  /**
   * Get the current screen's navigation item configuration
   */
  const getCurrentScreenConfig = useCallback(() => {
    return (
      NAVIGATION_ITEMS.find((item) => item.id === navigation.activeScreen) ||
      null
    );
  }, [navigation.activeScreen]);

  /**
   * Navigation handler specifically for bottom navigation items
   */
  const handleNavClick = useCallback(
    (screen: string) => {
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
   * Check if currently on a specific screen
   */
  const isCurrentScreen = useCallback(
    (screen: string) => {
      return navigation.activeScreen === screen;
    },
    [navigation.activeScreen]
  );

  /**
   * Set URL parameters for deep linking (legacy compatibility)
   */
  const setUrlParameter = useCallback((screen: string, useHash = false) => {
    try {
      if (
        typeof window !== "undefined" &&
        Object.values(SCREENS).includes(screen)
      ) {
        const url = new URL(window.location.href);

        if (useHash) {
          url.hash = screen;
          url.searchParams.delete("screen");
        } else {
          url.searchParams.set("screen", screen);
          url.hash = "";
        }

        window.history.replaceState(null, "", url.toString());
      }
    } catch (error) {
      console.warn("Error setting URL parameter:", error);
    }
  }, []);

  /**
   * Clear URL parameters (legacy compatibility)
   */
  const clearUrlParameters = useCallback(() => {
    try {
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.delete("screen");
        url.hash = "";
        window.history.replaceState(null, "", url.pathname);
      }
    } catch (error) {
      console.warn("Error clearing URL parameters:", error);
    }
  }, []);

  /**
   * Handle deep linking (legacy compatibility - now handled by Next.js routing)
   */
  const handleDeepLinking = useCallback(() => {
    // This is now handled automatically by Next.js routing
    // Keeping for compatibility but it's essentially a no-op
    console.log("Deep linking is now handled automatically by Next.js routing");
  }, []);

  // Return the same interface as the legacy hook for compatibility
  return {
    // State (mapped from new navigation system)
    activeScreen: navigation.activeScreen,
    history: navigation.history,
    canGoBack: navigation.canGoBack,

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
    isOnHomeScreen: navigation.activeScreen === SCREENS.HOME,
    currentScreenConfig: getCurrentScreenConfig(),

    // New navigation system properties (for components that want to use them)
    currentPath: navigation.currentPath,
    breadcrumbs: navigation.breadcrumbs,
    isNavigating: navigation.isNavigating,
  };
}

export default useNavigationCompat;
