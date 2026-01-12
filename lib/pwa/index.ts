/**
 * PWA Module Index
 *
 * Exports all PWA-related functionality including offline navigation,
 * standalone mode support, and PWA components.
 */

// Offline Navigation
export { default as offlineNavigationManager } from "./offline-navigation";
export type {
  OfflineNavigationState,
  PendingNavigation,
} from "./offline-navigation";

// Offline Navigation Hooks
export {
  useOfflineNavigation,
  useOfflineStatus,
  useOfflineRouteCache,
} from "./useOfflineNavigation";

// Standalone Mode
export { default as standaloneModeManager } from "./standalone-mode";
export type { StandaloneState } from "./standalone-mode";

// Standalone Mode Hooks
export {
  useStandaloneMode,
  useDisplayMode,
  usePWAInstall,
  useDeepLinkHandler,
} from "./useStandaloneMode";

// PWA Components
export {
  OfflineIndicator,
  OfflineStatusBadge,
  OfflineRouteCacheStatus,
} from "./OfflineIndicator";

export {
  PWANavigationHandler,
  default as PWANavigationHandlerDefault,
} from "./PWANavigationHandler";

// Utility functions
export const PWAUtils = {
  /**
   * Check if app is running as PWA
   */
  isPWA: (): boolean => {
    if (typeof window === "undefined") return false;

    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes("android-app://")
    );
  },

  /**
   * Check if PWA installation is supported
   */
  canInstallPWA: (): boolean => {
    if (typeof window === "undefined") return false;

    return "serviceWorker" in navigator && "BeforeInstallPromptEvent" in window;
  },

  /**
   * Get PWA display mode
   */
  getDisplayMode: ():
    | "browser"
    | "standalone"
    | "minimal-ui"
    | "fullscreen" => {
    if (typeof window === "undefined") return "browser";

    if (window.matchMedia("(display-mode: standalone)").matches) {
      return "standalone";
    } else if (window.matchMedia("(display-mode: minimal-ui)").matches) {
      return "minimal-ui";
    } else if (window.matchMedia("(display-mode: fullscreen)").matches) {
      return "fullscreen";
    }

    return "browser";
  },

  /**
   * Check if device is mobile
   */
  isMobile: (): boolean => {
    if (typeof window === "undefined") return false;

    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  },

  /**
   * Get PWA capabilities
   */
  getPWACapabilities: () => {
    if (typeof window === "undefined") {
      return {
        serviceWorker: false,
        pushNotifications: false,
        backgroundSync: false,
        webShare: false,
        fullscreen: false,
      };
    }

    return {
      serviceWorker: "serviceWorker" in navigator,
      pushNotifications: "PushManager" in window,
      backgroundSync:
        "serviceWorker" in navigator &&
        "sync" in window.ServiceWorkerRegistration.prototype,
      webShare: "share" in navigator,
      fullscreen: "requestFullscreen" in document.documentElement,
    };
  },
};
