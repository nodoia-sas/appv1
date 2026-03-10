/**
 * PWA Navigation Handler Component
 *
 * Handles PWA-specific navigation concerns including standalone mode,
 * deep linking, and navigation state preservation.
 *
 * Requirements: 13.4, 13.5, 13.6
 */

"use client";

import React, { useEffect } from "react";
import {
  useStandaloneMode,
  useDeepLinkHandler,
  usePWAInstall,
} from "./useStandaloneMode";
import { useOfflineNavigation } from "./useOfflineNavigation";

interface PWANavigationHandlerProps {
  children: React.ReactNode;
  /** Whether to show PWA install prompt */
  showInstallPrompt?: boolean;
  /** Custom install prompt component */
  installPromptComponent?: React.ComponentType<{
    canInstall: boolean;
    onInstall: () => Promise<boolean>;
    onDismiss: () => void;
  }>;
}

/**
 * PWA Navigation Handler Component
 */
export function PWANavigationHandler({
  children,
  showInstallPrompt = true,
  installPromptComponent: InstallPromptComponent,
}: PWANavigationHandlerProps) {
  const { isStandalone, displayMode, navigationState, deepLinkSupport } =
    useStandaloneMode();

  const { isOffline } = useOfflineNavigation();
  const { handleDeepLink } = useDeepLinkHandler();
  const { canInstall, promptInstall } = usePWAInstall();

  // Handle PWA-specific initialization
  useEffect(() => {
    if (isStandalone) {
      console.log("PWA running in standalone mode");

      // Add PWA-specific CSS class to body
      document.body.classList.add("pwa-standalone");

      // Handle any pending deep links
      if (deepLinkSupport.pendingDeepLinks.length > 0) {
        const latestDeepLink =
          deepLinkSupport.pendingDeepLinks[
            deepLinkSupport.pendingDeepLinks.length - 1
          ];
        handleDeepLink(latestDeepLink);
      }
    } else {
      document.body.classList.remove("pwa-standalone");
    }

    // Add display mode class
    document.body.classList.remove(
      "display-browser",
      "display-standalone",
      "display-minimal-ui",
      "display-fullscreen"
    );
    document.body.classList.add(`display-${displayMode}`);

    return () => {
      document.body.classList.remove(
        "pwa-standalone",
        `display-${displayMode}`
      );
    };
  }, [
    isStandalone,
    displayMode,
    deepLinkSupport.pendingDeepLinks,
    handleDeepLink,
  ]);

  // Handle viewport meta tag for standalone mode
  useEffect(() => {
    if (typeof window === "undefined") return;

    let viewportMeta = document.querySelector(
      'meta[name="viewport"]'
    ) as HTMLMetaElement;

    if (!viewportMeta) {
      viewportMeta = document.createElement("meta");
      viewportMeta.name = "viewport";
      document.head.appendChild(viewportMeta);
    }

    if (isStandalone) {
      // Optimize viewport for standalone mode
      viewportMeta.content =
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover";
    } else {
      // Standard viewport for browser mode
      viewportMeta.content = "width=device-width, initial-scale=1.0";
    }
  }, [isStandalone]);

  // Handle status bar styling for standalone mode
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (isStandalone) {
      // Add status bar meta tags for iOS
      let statusBarMeta = document.querySelector(
        'meta[name="apple-mobile-web-app-status-bar-style"]'
      ) as HTMLMetaElement;

      if (!statusBarMeta) {
        statusBarMeta = document.createElement("meta");
        statusBarMeta.name = "apple-mobile-web-app-status-bar-style";
        document.head.appendChild(statusBarMeta);
      }

      statusBarMeta.content = "default";

      // Add theme color meta tag
      let themeColorMeta = document.querySelector(
        'meta[name="theme-color"]'
      ) as HTMLMetaElement;

      if (!themeColorMeta) {
        themeColorMeta = document.createElement("meta");
        themeColorMeta.name = "theme-color";
        document.head.appendChild(themeColorMeta);
      }

      themeColorMeta.content = "#0ea5e9"; // Match theme color from manifest
    }
  }, [isStandalone]);

  return (
    <>
      {children}

      {/* PWA Install Prompt */}
      {showInstallPrompt && canInstall && (
        <PWAInstallPrompt
          onInstall={promptInstall}
          component={InstallPromptComponent}
        />
      )}

      {/* PWA Status Indicator (for development) */}
      {process.env.NODE_ENV === "development" && (
        <PWAStatusIndicator
          isStandalone={isStandalone}
          displayMode={displayMode}
          isOffline={isOffline}
          navigationState={navigationState}
        />
      )}
    </>
  );
}

/**
 * PWA Install Prompt Component
 */
interface PWAInstallPromptProps {
  onInstall: () => Promise<boolean>;
  component?: React.ComponentType<{
    canInstall: boolean;
    onInstall: () => Promise<boolean>;
    onDismiss: () => void;
  }>;
}

function PWAInstallPrompt({
  onInstall,
  component: CustomComponent,
}: PWAInstallPromptProps) {
  const [dismissed, setDismissed] = React.useState(false);

  const handleDismiss = () => {
    setDismissed(true);
    // Remember dismissal for this session
    sessionStorage.setItem("pwa-install-dismissed", "true");
  };

  // Check if already dismissed this session
  React.useEffect(() => {
    const wasDismissed = sessionStorage.getItem("pwa-install-dismissed");
    if (wasDismissed) {
      setDismissed(true);
    }
  }, []);

  if (dismissed) return null;

  if (CustomComponent) {
    return (
      <CustomComponent
        canInstall={true}
        onInstall={onInstall}
        onDismiss={handleDismiss}
      />
    );
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50 md:left-auto md:right-4 md:max-w-sm">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-sm">Instalar Transit IA</h3>
          <p className="text-xs opacity-90 mt-1">
            Instala la app para una mejor experiencia
          </p>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={handleDismiss}
            className="text-white/70 hover:text-white text-xs px-2 py-1"
          >
            Ahora no
          </button>
          <button
            onClick={onInstall}
            className="bg-white text-blue-600 text-xs px-3 py-1 rounded font-medium hover:bg-gray-100"
          >
            Instalar
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * PWA Status Indicator (for development)
 */
interface PWAStatusIndicatorProps {
  isStandalone: boolean;
  displayMode: string;
  isOffline: boolean;
  navigationState: any;
}

function PWAStatusIndicator({
  isStandalone,
  displayMode,
  isOffline,
  navigationState,
}: PWAStatusIndicatorProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <div className="fixed top-4 right-4 z-50 bg-black/80 text-white text-xs rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-3 py-2 hover:bg-white/10 w-full text-left"
      >
        PWA Status {isExpanded ? "▼" : "▶"}
      </button>

      {isExpanded && (
        <div className="px-3 py-2 border-t border-white/20 space-y-1">
          <div>Mode: {isStandalone ? "Standalone" : "Browser"}</div>
          <div>Display: {displayMode}</div>
          <div>Offline: {isOffline ? "Yes" : "No"}</div>
          <div>History: {navigationState.history.length}</div>
          <div>Can Go Back: {navigationState.canGoBack ? "Yes" : "No"}</div>
        </div>
      )}
    </div>
  );
}

export default PWANavigationHandler;
