/**
 * Offline Navigation Hook
 *
 * React hook for managing offline navigation functionality,
 * providing seamless navigation experience when offline.
 *
 * Requirements: 13.1, 13.2, 13.3
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import offlineNavigationManager, {
  OfflineNavigationState,
} from "./offline-navigation";

/**
 * Hook for offline navigation functionality
 */
export function useOfflineNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [offlineState, setOfflineState] = useState<OfflineNavigationState>(
    offlineNavigationManager.getState()
  );

  // Subscribe to offline navigation state changes
  useEffect(() => {
    const unsubscribe = offlineNavigationManager.subscribe(setOfflineState);
    return unsubscribe;
  }, []);

  // Sync current route with offline manager
  useEffect(() => {
    if (pathname && pathname !== offlineState.currentRoute) {
      offlineNavigationManager.navigate(pathname, "push");
    }
  }, [pathname, offlineState.currentRoute]);

  /**
   * Navigate to a route with offline support
   */
  const navigate = useCallback(
    (route: string, replace = false) => {
      const method = replace ? "replace" : "push";

      // Update offline navigation state
      offlineNavigationManager.navigate(route, method);

      // If online, use Next.js router
      if (!offlineState.isOffline) {
        if (replace) {
          router.replace(route);
        } else {
          router.push(route);
        }
      } else {
        // If offline, just update the offline state
        // The actual navigation will happen when back online
        console.log(`Offline navigation queued: ${route}`);
      }
    },
    [router, offlineState.isOffline]
  );

  /**
   * Go back with offline support
   */
  const goBack = useCallback(() => {
    const previousRoute = offlineNavigationManager.goBack();

    if (previousRoute) {
      if (!offlineState.isOffline) {
        router.push(previousRoute);
      } else {
        console.log(`Offline back navigation queued: ${previousRoute}`);
      }
    } else {
      // Fallback to browser back
      if (!offlineState.isOffline) {
        router.back();
      }
    }
  }, [router, offlineState.isOffline]);

  /**
   * Check if current route is available offline
   */
  const isCurrentRouteAvailableOffline = useCallback(() => {
    return offlineNavigationManager.isRouteCached(offlineState.currentRoute);
  }, [offlineState.currentRoute]);

  /**
   * Cache current route for offline access
   */
  const cacheCurrentRoute = useCallback(
    (data?: any) => {
      offlineNavigationManager.cacheRoute(offlineState.currentRoute, data);
    },
    [offlineState.currentRoute]
  );

  /**
   * Get cached data for current route
   */
  const getCachedRouteData = useCallback(() => {
    return offlineNavigationManager.getCachedRouteData(
      offlineState.currentRoute
    );
  }, [offlineState.currentRoute]);

  /**
   * Clear all offline navigation data
   */
  const clearOfflineData = useCallback(() => {
    offlineNavigationManager.clearOfflineData();
  }, []);

  return {
    // State
    isOffline: offlineState.isOffline,
    currentRoute: offlineState.currentRoute,
    navigationHistory: offlineState.navigationHistory,
    pendingNavigations: offlineState.pendingNavigations,
    canGoBack: offlineState.navigationHistory.length > 1,

    // Actions
    navigate,
    goBack,
    cacheCurrentRoute,
    clearOfflineData,

    // Utilities
    isCurrentRouteAvailableOffline,
    getCachedRouteData,
    isRouteCached: offlineNavigationManager.isRouteCached.bind(
      offlineNavigationManager
    ),
    getStats: offlineNavigationManager.getStats.bind(offlineNavigationManager),
  };
}

/**
 * Hook for offline status detection
 */
export function useOfflineStatus() {
  const [isOffline, setIsOffline] = useState(
    typeof window !== "undefined" ? !navigator.onLine : false
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOffline;
}

/**
 * Hook for managing offline route caching
 */
export function useOfflineRouteCache() {
  const [cachedRoutes, setCachedRoutes] = useState<string[]>([]);

  // Load cached routes on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const cached = localStorage.getItem("pwa_cached_routes");
      if (cached) {
        setCachedRoutes(JSON.parse(cached));
      }
    } catch (error) {
      console.warn("Failed to load cached routes:", error);
    }
  }, []);

  /**
   * Cache a route for offline access
   */
  const cacheRoute = useCallback((route: string, data?: any) => {
    offlineNavigationManager.cacheRoute(route, data);

    // Update local state
    setCachedRoutes((prev) => {
      if (!prev.includes(route)) {
        return [...prev, route];
      }
      return prev;
    });
  }, []);

  /**
   * Check if route is cached
   */
  const isRouteCached = useCallback(
    (route: string) => {
      return cachedRoutes.includes(route);
    },
    [cachedRoutes]
  );

  /**
   * Get cached route data
   */
  const getCachedData = useCallback((route: string) => {
    return offlineNavigationManager.getCachedRouteData(route);
  }, []);

  /**
   * Preload critical routes for offline access
   */
  const preloadCriticalRoutes = useCallback(
    async (routes: string[]) => {
      for (const route of routes) {
        try {
          // Cache the route
          cacheRoute(route);

          // If online, try to fetch and cache data
          if (navigator.onLine) {
            // This would typically fetch route-specific data
            // For now, just mark as cached
            console.log(`Preloaded route for offline: ${route}`);
          }
        } catch (error) {
          console.warn(`Failed to preload route ${route}:`, error);
        }
      }
    },
    [cacheRoute]
  );

  return {
    cachedRoutes,
    cacheRoute,
    isRouteCached,
    getCachedData,
    preloadCriticalRoutes,
  };
}
