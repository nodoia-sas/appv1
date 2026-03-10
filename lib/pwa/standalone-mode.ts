/**
 * PWA Standalone Mode Manager
 *
 * Manages PWA standalone mode functionality including navigation state,
 * deep linking support, and history preservation.
 *
 * Requirements: 13.4, 13.5, 13.6
 */

"use client";

// Standalone mode state interface
interface StandaloneState {
  isStandalone: boolean;
  displayMode: "browser" | "standalone" | "minimal-ui" | "fullscreen";
  navigationState: {
    currentUrl: string;
    history: string[];
    canGoBack: boolean;
    canGoForward: boolean;
  };
  deepLinkSupport: {
    enabled: boolean;
    lastDeepLink: string | null;
    pendingDeepLinks: string[];
  };
}

// Storage key for standalone state
const STANDALONE_STATE_KEY = "pwa_standalone_state";

/**
 * PWA Standalone Mode Manager Class
 */
class StandaloneModeManager {
  private state: StandaloneState;
  private listeners: Set<(state: StandaloneState) => void> = new Set();

  constructor() {
    this.state = this.initializeState();
    this.setupEventListeners();
    this.handleInitialDeepLink();
  }

  /**
   * Initialize standalone state
   */
  private initializeState(): StandaloneState {
    const defaultState: StandaloneState = {
      isStandalone: this.detectStandaloneMode(),
      displayMode: this.getDisplayMode(),
      navigationState: {
        currentUrl: typeof window !== "undefined" ? window.location.href : "/",
        history: [],
        canGoBack: false,
        canGoForward: false,
      },
      deepLinkSupport: {
        enabled: true,
        lastDeepLink: null,
        pendingDeepLinks: [],
      },
    };

    // Load saved state if available
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STANDALONE_STATE_KEY);
        if (saved) {
          const parsedState = JSON.parse(saved);
          return {
            ...defaultState,
            ...parsedState,
            // Always update runtime-detected values
            isStandalone: defaultState.isStandalone,
            displayMode: defaultState.displayMode,
          };
        }
      } catch (error) {
        console.warn("Failed to load standalone state:", error);
      }
    }

    return defaultState;
  }

  /**
   * Detect if app is running in standalone mode
   */
  private detectStandaloneMode(): boolean {
    if (typeof window === "undefined") return false;

    // Check various indicators of standalone mode
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes("android-app://");

    return isStandalone;
  }

  /**
   * Get current display mode
   */
  private getDisplayMode(): StandaloneState["displayMode"] {
    if (typeof window === "undefined") return "browser";

    if (window.matchMedia("(display-mode: standalone)").matches) {
      return "standalone";
    } else if (window.matchMedia("(display-mode: minimal-ui)").matches) {
      return "minimal-ui";
    } else if (window.matchMedia("(display-mode: fullscreen)").matches) {
      return "fullscreen";
    }

    return "browser";
  }

  /**
   * Setup event listeners for standalone mode
   */
  private setupEventListeners(): void {
    if (typeof window === "undefined") return;

    // Listen for display mode changes
    const mediaQueries = [
      "(display-mode: standalone)",
      "(display-mode: minimal-ui)",
      "(display-mode: fullscreen)",
    ];

    mediaQueries.forEach((query) => {
      const mediaQuery = window.matchMedia(query);
      mediaQuery.addEventListener("change", () => {
        this.state.displayMode = this.getDisplayMode();
        this.state.isStandalone = this.detectStandaloneMode();
        this.saveState();
        this.notifyListeners();
      });
    });

    // Listen for popstate events (browser back/forward)
    window.addEventListener("popstate", (event) => {
      this.handlePopState(event);
    });

    // Listen for beforeunload to save state
    window.addEventListener("beforeunload", () => {
      this.saveState();
    });

    // Listen for visibility change to handle app focus
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        this.handleAppFocus();
      }
    });
  }

  /**
   * Handle initial deep link when app starts
   */
  private handleInitialDeepLink(): void {
    if (typeof window === "undefined") return;

    const currentUrl = window.location.href;
    const currentPath =
      window.location.pathname + window.location.search + window.location.hash;

    // If we're in standalone mode and have a specific path, treat it as a deep link
    if (this.state.isStandalone && currentPath !== "/") {
      this.handleDeepLink(currentPath);
    }

    // Update current URL
    this.state.navigationState.currentUrl = currentUrl;
    this.saveState();
  }

  /**
   * Handle deep link navigation
   */
  handleDeepLink(url: string): void {
    this.state.deepLinkSupport.lastDeepLink = url;

    // If app is ready, navigate immediately
    if (this.state.isStandalone) {
      console.log(`Deep link navigation in standalone mode: ${url}`);

      // Update navigation state
      this.updateNavigationState(url);
    } else {
      // Queue for later processing
      this.state.deepLinkSupport.pendingDeepLinks.push(url);
    }

    this.saveState();
    this.notifyListeners();
  }

  /**
   * Update navigation state
   */
  private updateNavigationState(url: string): void {
    const currentUrl = this.state.navigationState.currentUrl;

    // Add current URL to history if it's different
    if (currentUrl && currentUrl !== url) {
      this.state.navigationState.history.push(currentUrl);

      // Keep history reasonable size
      if (this.state.navigationState.history.length > 50) {
        this.state.navigationState.history =
          this.state.navigationState.history.slice(-50);
      }
    }

    // Update current URL
    this.state.navigationState.currentUrl = url;
    this.state.navigationState.canGoBack =
      this.state.navigationState.history.length > 0;
    this.state.navigationState.canGoForward = false; // Reset forward navigation
  }

  /**
   * Handle browser popstate events
   */
  private handlePopState(event: PopStateEvent): void {
    const currentUrl = window.location.href;

    // Update navigation state
    this.updateNavigationState(currentUrl);

    this.saveState();
    this.notifyListeners();
  }

  /**
   * Handle app focus (when user returns to app)
   */
  private handleAppFocus(): void {
    // Process any pending deep links
    if (this.state.deepLinkSupport.pendingDeepLinks.length > 0) {
      const pendingLinks = [...this.state.deepLinkSupport.pendingDeepLinks];
      this.state.deepLinkSupport.pendingDeepLinks = [];

      // Process the most recent deep link
      const latestLink = pendingLinks[pendingLinks.length - 1];
      this.handleDeepLink(latestLink);
    }
  }

  /**
   * Navigate programmatically in standalone mode
   */
  navigate(url: string, replace = false): void {
    if (typeof window === "undefined") return;

    try {
      if (replace) {
        window.history.replaceState(null, "", url);
      } else {
        window.history.pushState(null, "", url);
        this.updateNavigationState(url);
      }

      this.saveState();
      this.notifyListeners();
    } catch (error) {
      console.error("Standalone navigation error:", error);
    }
  }

  /**
   * Go back in standalone mode
   */
  goBack(): boolean {
    if (!this.state.navigationState.canGoBack) {
      return false;
    }

    try {
      window.history.back();
      return true;
    } catch (error) {
      console.error("Standalone go back error:", error);
      return false;
    }
  }

  /**
   * Go forward in standalone mode
   */
  goForward(): boolean {
    if (!this.state.navigationState.canGoForward) {
      return false;
    }

    try {
      window.history.forward();
      return true;
    } catch (error) {
      console.error("Standalone go forward error:", error);
      return false;
    }
  }

  /**
   * Save state to localStorage
   */
  private saveState(): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(STANDALONE_STATE_KEY, JSON.stringify(this.state));
    } catch (error) {
      console.warn("Failed to save standalone state:", error);
    }
  }

  /**
   * Get current standalone state
   */
  getState(): StandaloneState {
    return { ...this.state };
  }

  /**
   * Subscribe to state changes
   */
  subscribe(listener: (state: StandaloneState) => void): () => void {
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
        console.error("Error in standalone mode listener:", error);
      }
    });
  }

  /**
   * Clear standalone state (useful for testing)
   */
  clearState(): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.removeItem(STANDALONE_STATE_KEY);
      this.state = this.initializeState();
      this.notifyListeners();
    } catch (error) {
      console.warn("Failed to clear standalone state:", error);
    }
  }

  /**
   * Get standalone mode statistics
   */
  getStats() {
    return {
      isStandalone: this.state.isStandalone,
      displayMode: this.state.displayMode,
      historyLength: this.state.navigationState.history.length,
      canGoBack: this.state.navigationState.canGoBack,
      canGoForward: this.state.navigationState.canGoForward,
      deepLinkSupport: this.state.deepLinkSupport.enabled,
      pendingDeepLinks: this.state.deepLinkSupport.pendingDeepLinks.length,
      lastDeepLink: this.state.deepLinkSupport.lastDeepLink,
    };
  }
}

// Global standalone mode manager instance
const standaloneModeManager = new StandaloneModeManager();

export default standaloneModeManager;
export type { StandaloneState };
