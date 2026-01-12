/**
 * Standalone Mode Hook
 *
 * React hook for managing PWA standalone mode functionality,
 * including navigation state and deep linking support.
 *
 * Requirements: 13.4, 13.5, 13.6
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import standaloneModeManager, { StandaloneState } from "./standalone-mode";

/**
 * Hook for PWA standalone mode functionality
 */
export function useStandaloneMode() {
  const router = useRouter();
  const pathname = usePathname();
  const [standaloneState, setStandaloneState] = useState<StandaloneState>(
    standaloneModeManager.getState()
  );

  // Subscribe to standalone state changes
  useEffect(() => {
    const unsubscribe = standaloneModeManager.subscribe(setStandaloneState);
    return unsubscribe;
  }, []);

  // Handle route changes in standalone mode
  useEffect(() => {
    if (standaloneState.isStandalone && pathname) {
      const fullUrl = window.location.href;
      if (fullUrl !== standaloneState.navigationState.currentUrl) {
        standaloneModeManager.navigate(fullUrl);
      }
    }
  }, [
    pathname,
    standaloneState.isStandalone,
    standaloneState.navigationState.currentUrl,
  ]);

  /**
   * Navigate with standalone mode support
   */
  const navigate = useCallback(
    (url: string, replace = false) => {
      if (standaloneState.isStandalone) {
        // In standalone mode, use our custom navigation
        standaloneModeManager.navigate(url, replace);

        // Also update Next.js router
        if (replace) {
          router.replace(url);
        } else {
          router.push(url);
        }
      } else {
        // In browser mode, use standard Next.js navigation
        if (replace) {
          router.replace(url);
        } else {
          router.push(url);
        }
      }
    },
    [router, standaloneState.isStandalone]
  );

  /**
   * Go back with standalone mode support
   */
  const goBack = useCallback(() => {
    if (standaloneState.isStandalone) {
      const success = standaloneModeManager.goBack();
      if (!success) {
        // Fallback to Next.js router
        router.back();
      }
    } else {
      router.back();
    }
  }, [router, standaloneState.isStandalone]);

  /**
   * Go forward with standalone mode support
   */
  const goForward = useCallback(() => {
    if (standaloneState.isStandalone) {
      const success = standaloneModeManager.goForward();
      if (!success) {
        // No fallback for forward navigation
        console.warn("Forward navigation not available");
      }
    } else {
      // Browser mode doesn't typically support programmatic forward
      console.warn("Forward navigation not supported in browser mode");
    }
  }, [standaloneState.isStandalone]);

  /**
   * Handle deep link
   */
  const handleDeepLink = useCallback(
    (url: string) => {
      standaloneModeManager.handleDeepLink(url);

      // Navigate to the deep link
      navigate(url);
    },
    [navigate]
  );

  /**
   * Clear standalone state
   */
  const clearStandaloneState = useCallback(() => {
    standaloneModeManager.clearState();
  }, []);

  return {
    // State
    isStandalone: standaloneState.isStandalone,
    displayMode: standaloneState.displayMode,
    navigationState: standaloneState.navigationState,
    deepLinkSupport: standaloneState.deepLinkSupport,

    // Actions
    navigate,
    goBack,
    goForward,
    handleDeepLink,
    clearStandaloneState,

    // Utilities
    getStats: standaloneModeManager.getStats.bind(standaloneModeManager),
  };
}

/**
 * Hook for detecting PWA display mode
 */
export function useDisplayMode() {
  const [displayMode, setDisplayMode] =
    useState<StandaloneState["displayMode"]>("browser");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateDisplayMode = () => {
      if (window.matchMedia("(display-mode: standalone)").matches) {
        setDisplayMode("standalone");
      } else if (window.matchMedia("(display-mode: minimal-ui)").matches) {
        setDisplayMode("minimal-ui");
      } else if (window.matchMedia("(display-mode: fullscreen)").matches) {
        setDisplayMode("fullscreen");
      } else {
        setDisplayMode("browser");
      }
    };

    // Initial check
    updateDisplayMode();

    // Listen for changes
    const mediaQueries = [
      "(display-mode: standalone)",
      "(display-mode: minimal-ui)",
      "(display-mode: fullscreen)",
    ];

    const listeners = mediaQueries.map((query) => {
      const mediaQuery = window.matchMedia(query);
      mediaQuery.addEventListener("change", updateDisplayMode);
      return { mediaQuery, updateDisplayMode };
    });

    return () => {
      listeners.forEach(({ mediaQuery, updateDisplayMode }) => {
        mediaQuery.removeEventListener("change", updateDisplayMode);
      });
    };
  }, []);

  return displayMode;
}

/**
 * Hook for PWA installation detection and prompting
 */
export function usePWAInstall() {
  const [canInstall, setCanInstall] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleBeforeInstallPrompt = (event: any) => {
      // Prevent the mini-infobar from appearing on mobile
      event.preventDefault();

      // Save the event so it can be triggered later
      setInstallPrompt(event);
      setCanInstall(true);
    };

    const handleAppInstalled = () => {
      console.log("PWA was installed");
      setCanInstall(false);
      setInstallPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  /**
   * Trigger PWA installation prompt
   */
  const promptInstall = useCallback(async () => {
    if (!installPrompt) {
      return false;
    }

    try {
      // Show the install prompt
      installPrompt.prompt();

      // Wait for the user to respond to the prompt
      const { outcome } = await installPrompt.userChoice;

      console.log(`User response to install prompt: ${outcome}`);

      // Clear the prompt
      setInstallPrompt(null);
      setCanInstall(false);

      return outcome === "accepted";
    } catch (error) {
      console.error("Error prompting PWA install:", error);
      return false;
    }
  }, [installPrompt]);

  return {
    canInstall,
    promptInstall,
  };
}

/**
 * Hook for deep link handling
 */
export function useDeepLinkHandler() {
  const { handleDeepLink } = useStandaloneMode();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Handle initial deep link
    const currentPath =
      window.location.pathname + window.location.search + window.location.hash;
    if (currentPath !== "/") {
      handleDeepLink(currentPath);
    }

    // Listen for URL changes (for SPAs)
    const handlePopState = () => {
      const newPath =
        window.location.pathname +
        window.location.search +
        window.location.hash;
      handleDeepLink(newPath);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [handleDeepLink]);

  return { handleDeepLink };
}
