/**
 * Offline Navigation Manager
 *
 * Manages navigation functionality when the app is offline,
 * including caching navigation state and synchronizing when online.
 *
 * Requirements: 13.1, 13.2, 13.3
 */

"use client";

// Offline navigation state interface
interface OfflineNavigationState {
  currentRoute: string;
  navigationHistory: string[];
  pendingNavigations: PendingNavigation[];
  lastSyncTimestamp: number;
  isOffline: boolean;
}

// Pending navigation interface for offline queue
interface PendingNavigation {
  id: string;
  route: string;
  timestamp: number;
  method: "push" | "replace";
  data?: any;
}

// Storage keys for offline data
const STORAGE_KEYS = {
  NAVIGATION_STATE: "pwa_navigation_state",
  CACHED_ROUTES: "pwa_cached_routes",
  OFFLINE_QUEUE: "pwa_offline_queue",
} as const;

/**
 * Offline Navigation Manager Class
 */
class OfflineNavigationManager {
  private state: OfflineNavigationState;
  private listeners: Set<(state: OfflineNavigationState) => void> = new Set();
  private syncInProgress = false;

  constructor() {
    this.state = this.loadState();
    this.setupOnlineListener();
    this.setupVisibilityListener();
  }

  /**
   * Initialize offline navigation state
   */
  private loadState(): OfflineNavigationState {
    if (typeof window === "undefined") {
      return this.getDefaultState();
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.NAVIGATION_STATE);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...this.getDefaultState(),
          ...parsed,
          isOffline: !navigator.onLine,
        };
      }
    } catch (error) {
      console.warn("Failed to load offline navigation state:", error);
    }

    return this.getDefaultState();
  }

  /**
   * Get default navigation state
   */
  private getDefaultState(): OfflineNavigationState {
    return {
      currentRoute: "/",
      navigationHistory: ["/"],
      pendingNavigations: [],
      lastSyncTimestamp: Date.now(),
      isOffline: typeof window !== "undefined" ? !navigator.onLine : false,
    };
  }

  /**
   * Save state to localStorage
   */
  private saveState(): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(
        STORAGE_KEYS.NAVIGATION_STATE,
        JSON.stringify(this.state)
      );
    } catch (error) {
      console.warn("Failed to save offline navigation state:", error);
    }
  }

  /**
   * Setup online/offline event listeners
   */
  private setupOnlineListener(): void {
    if (typeof window === "undefined") return;

    const handleOnline = () => {
      this.state.isOffline = false;
      this.notifyListeners();
      this.syncPendingNavigations();
    };

    const handleOffline = () => {
      this.state.isOffline = true;
      this.notifyListeners();
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
  }

  /**
   * Setup visibility change listener for sync on app focus
   */
  private setupVisibilityListener(): void {
    if (typeof window === "undefined") return;

    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && navigator.onLine && !this.state.isOffline) {
        this.syncPendingNavigations();
      }
    });
  }

  /**
   * Navigate to a route (works offline)
   */
  navigate(
    route: string,
    method: "push" | "replace" = "push",
    data?: any
  ): void {
    // Update current route and history
    this.state.currentRoute = route;

    if (method === "push") {
      this.state.navigationHistory.push(route);
      // Keep history reasonable size
      if (this.state.navigationHistory.length > 50) {
        this.state.navigationHistory = this.state.navigationHistory.slice(-50);
      }
    } else {
      // Replace current route in history
      if (this.state.navigationHistory.length > 0) {
        this.state.navigationHistory[this.state.navigationHistory.length - 1] =
          route;
      } else {
        this.state.navigationHistory.push(route);
      }
    }

    // If offline, queue the navigation for later sync
    if (this.state.isOffline) {
      const pendingNav: PendingNavigation = {
        id: `nav_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        route,
        timestamp: Date.now(),
        method,
        data,
      };

      this.state.pendingNavigations.push(pendingNav);
    }

    this.saveState();
    this.notifyListeners();
  }

  /**
   * Go back in navigation history
   */
  goBack(): string | null {
    if (this.state.navigationHistory.length <= 1) {
      return null;
    }

    // Remove current route
    this.state.navigationHistory.pop();

    // Get previous route
    const previousRoute =
      this.state.navigationHistory[this.state.navigationHistory.length - 1];
    this.state.currentRoute = previousRoute;

    this.saveState();
    this.notifyListeners();

    return previousRoute;
  }

  /**
   * Check if a route is cached for offline access
   */
  isRouteCached(route: string): boolean {
    if (typeof window === "undefined") return false;

    try {
      const cached = localStorage.getItem(STORAGE_KEYS.CACHED_ROUTES);
      if (cached) {
        const cachedRoutes = JSON.parse(cached);
        return cachedRoutes.includes(route);
      }
    } catch (error) {
      console.warn("Failed to check cached routes:", error);
    }

    return false;
  }

  /**
   * Cache a route for offline access
   */
  cacheRoute(route: string, data?: any): void {
    if (typeof window === "undefined") return;

    try {
      // Get existing cached routes
      const cached = localStorage.getItem(STORAGE_KEYS.CACHED_ROUTES);
      const cachedRoutes = cached ? JSON.parse(cached) : [];

      // Add route if not already cached
      if (!cachedRoutes.includes(route)) {
        cachedRoutes.push(route);
        localStorage.setItem(
          STORAGE_KEYS.CACHED_ROUTES,
          JSON.stringify(cachedRoutes)
        );
      }

      // Cache route data if provided
      if (data) {
        localStorage.setItem(`route_data_${route}`, JSON.stringify(data));
      }
    } catch (error) {
      console.warn("Failed to cache route:", error);
    }
  }

  /**
   * Get cached route data
   */
  getCachedRouteData(route: string): any | null {
    if (typeof window === "undefined") return null;

    try {
      const data = localStorage.getItem(`route_data_${route}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.warn("Failed to get cached route data:", error);
      return null;
    }
  }

  /**
   * Sync pending navigations when back online
   */
  private async syncPendingNavigations(): Promise<void> {
    if (this.syncInProgress || this.state.pendingNavigations.length === 0) {
      return;
    }

    this.syncInProgress = true;

    try {
      // Process pending navigations
      const pendingNavs = [...this.state.pendingNavigations];
      this.state.pendingNavigations = [];

      // Update sync timestamp
      this.state.lastSyncTimestamp = Date.now();

      this.saveState();
      this.notifyListeners();

      // Notify about successful sync
      console.log(`Synced ${pendingNavs.length} pending navigations`);
    } catch (error) {
      console.error("Failed to sync pending navigations:", error);
      // Restore pending navigations on error
      this.state.pendingNavigations.push(...this.state.pendingNavigations);
    } finally {
      this.syncInProgress = false;
    }
  }

  /**
   * Get current navigation state
   */
  getState(): OfflineNavigationState {
    return { ...this.state };
  }

  /**
   * Subscribe to state changes
   */
  subscribe(listener: (state: OfflineNavigationState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Notify all listeners of state changes
   */
  private notifyListeners(): void {
    this.listeners.forEach((listener) => {
      try {
        listener(this.state);
      } catch (error) {
        console.error("Error in offline navigation listener:", error);
      }
    });
  }

  /**
   * Clear all offline data (useful for logout)
   */
  clearOfflineData(): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.removeItem(STORAGE_KEYS.NAVIGATION_STATE);
      localStorage.removeItem(STORAGE_KEYS.CACHED_ROUTES);
      localStorage.removeItem(STORAGE_KEYS.OFFLINE_QUEUE);

      // Clear cached route data
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith("route_data_")) {
          localStorage.removeItem(key);
        }
      });

      this.state = this.getDefaultState();
      this.notifyListeners();
    } catch (error) {
      console.warn("Failed to clear offline data:", error);
    }
  }

  /**
   * Get offline navigation statistics
   */
  getStats() {
    return {
      isOffline: this.state.isOffline,
      currentRoute: this.state.currentRoute,
      historyLength: this.state.navigationHistory.length,
      pendingNavigations: this.state.pendingNavigations.length,
      lastSyncTimestamp: this.state.lastSyncTimestamp,
      timeSinceLastSync: Date.now() - this.state.lastSyncTimestamp,
      cachedRoutesCount: this.getCachedRoutesCount(),
    };
  }

  /**
   * Get count of cached routes
   */
  private getCachedRoutesCount(): number {
    if (typeof window === "undefined") return 0;

    try {
      const cached = localStorage.getItem(STORAGE_KEYS.CACHED_ROUTES);
      return cached ? JSON.parse(cached).length : 0;
    } catch (error) {
      return 0;
    }
  }
}

// Global offline navigation manager instance
const offlineNavigationManager = new OfflineNavigationManager();

export default offlineNavigationManager;
export type { OfflineNavigationState, PendingNavigation };
