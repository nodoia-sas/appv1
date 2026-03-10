"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { SCREENS } from "../../src/utils/constants";
import { usePerformanceMonitor } from "../performance/monitor";
import { useOfflineNavigation } from "../pwa/useOfflineNavigation";

// Navigation context type definitions
interface BreadcrumbItem {
  label: string;
  path: string;
  icon?: string;
}

interface NavigationContextType {
  currentPath: string;
  navigate: (path: string) => void;
  goBack: () => void;
  breadcrumbs: BreadcrumbItem[];
  isNavigating: boolean;
  activeScreen: string;
  canGoBack: boolean;
  history: string[];
  // Offline navigation support
  isOffline: boolean;
  pendingNavigations: number;
  isCurrentRouteAvailableOffline: boolean;
  cacheCurrentRoute: (data?: any) => void;
}

// Legacy screen to route mapping for migration compatibility
const SCREEN_TO_ROUTE_MAP: Record<string, string> = {
  [SCREENS.HOME]: "/",
  [SCREENS.MY_PROFILE]: "/profile",
  [SCREENS.DOCUMENTS]: "/documents",
  [SCREENS.NEWS]: "/news",
  [SCREENS.REGULATIONS]: "/regulations",
  [SCREENS.REGULATION_DETAIL]: "/regulations",
  [SCREENS.GLOSSARY]: "/glossary",
  [SCREENS.QUIZ]: "/quiz",
  [SCREENS.PQR]: "/pqr",
  [SCREENS.AI_ASSIST]: "/ai-assist",
  [SCREENS.NOTIFICATIONS]: "/notifications",
  [SCREENS.HELP_CONTACT]: "/help-contact",
  [SCREENS.TERMS]: "/terms",
  [SCREENS.PICO_Y_PLACA]: "/pico-y-placa",
  [SCREENS.UNDER_CONSTRUCTION]: "/under-construction",

  // Additional legacy screen names for compatibility
  home: "/",
  "my-profile": "/profile",
  documents: "/documents",
  news: "/news",
  "regulations-main": "/regulations",
  "regulation-detail": "/regulations",
  glossary: "/glossary",
  quiz: "/quiz",
  pqr: "/pqr",
  "ai-assist": "/ai-assist",
  notifications: "/notifications",
  "help-contact": "/help-contact",
  terms: "/terms",
  "pico-y-placa": "/pico-y-placa",
  "under-construction": "/under-construction",
  profile: "/profile",
  regulations: "/regulations",
  favorites: "/", // Favorites was mapped to home in legacy system
};

// Route to screen mapping for reverse compatibility
const ROUTE_TO_SCREEN_MAP: Record<string, string> = Object.entries(
  SCREEN_TO_ROUTE_MAP
).reduce((acc, [screen, route]) => {
  acc[route] = screen;
  return acc;
}, {} as Record<string, string>);

// Breadcrumb configuration with icons and descriptive names
const BREADCRUMB_CONFIG: Record<string, BreadcrumbItem[]> = {
  "/": [{ label: "Inicio", path: "/", icon: "home" }],
  "/profile": [
    { label: "Inicio", path: "/", icon: "home" },
    { label: "Mi Perfil", path: "/profile", icon: "user" },
  ],
  "/documents": [
    { label: "Inicio", path: "/", icon: "home" },
    { label: "Mis Documentos", path: "/documents", icon: "file-text" },
  ],
  "/documents/[id]": [
    { label: "Inicio", path: "/", icon: "home" },
    { label: "Mis Documentos", path: "/documents", icon: "file-text" },
    { label: "Detalle del Documento", path: "/documents/[id]", icon: "file" },
  ],
  "/vehicles": [
    { label: "Inicio", path: "/", icon: "home" },
    { label: "Mis Vehículos", path: "/vehicles", icon: "car" },
  ],
  "/news": [
    { label: "Inicio", path: "/", icon: "home" },
    { label: "Noticias de Tránsito", path: "/news", icon: "newspaper" },
  ],
  "/news/[id]": [
    { label: "Inicio", path: "/", icon: "home" },
    { label: "Noticias de Tránsito", path: "/news", icon: "newspaper" },
    { label: "Detalle de Noticia", path: "/news/[id]", icon: "article" },
  ],
  "/regulations": [
    { label: "Inicio", path: "/", icon: "home" },
    { label: "Normas de Tránsito", path: "/regulations", icon: "book-open" },
  ],
  "/regulations/[id]": [
    { label: "Inicio", path: "/", icon: "home" },
    { label: "Normas de Tránsito", path: "/regulations", icon: "book-open" },
    { label: "Detalle de Norma", path: "/regulations/[id]", icon: "scroll" },
  ],
  "/glossary": [
    { label: "Inicio", path: "/", icon: "home" },
    { label: "Glosario de Términos", path: "/glossary", icon: "book" },
  ],
  "/quiz": [
    { label: "Inicio", path: "/", icon: "home" },
    { label: "Examen de Conocimiento", path: "/quiz", icon: "help-circle" },
  ],
  "/pqr": [
    { label: "Inicio", path: "/", icon: "home" },
    {
      label: "Peticiones, Quejas y Reclamos",
      path: "/pqr",
      icon: "message-square",
    },
  ],
  "/ai-assist": [
    { label: "Inicio", path: "/", icon: "home" },
    { label: "Asistente Inteligente", path: "/ai-assist", icon: "bot" },
  ],
  "/under-construction": [
    { label: "Inicio", path: "/", icon: "home" },
    {
      label: "En Construcción",
      path: "/under-construction",
      icon: "construction",
    },
  ],
};

// Create the navigation context
const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined
);

interface NavigationProviderProps {
  children: React.ReactNode;
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const performanceMonitor = usePerformanceMonitor();

  // Offline navigation integration
  const offlineNav = useOfflineNavigation();

  // Navigation state
  const [isNavigating, setIsNavigating] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  // Initialize history with current path
  useEffect(() => {
    if (pathname && history.length === 0) {
      setHistory([pathname]);
    }
  }, [pathname, history.length]);

  // Monitor route changes for performance tracking
  useEffect(() => {
    if (pathname) {
      performanceMonitor.recordNavigationComplete(pathname);
    }
  }, [pathname, performanceMonitor]);

  // Generate breadcrumbs based on current path
  const generateBreadcrumbs = useCallback((path: string): BreadcrumbItem[] => {
    // Handle dynamic routes by finding the closest match
    const exactMatch = BREADCRUMB_CONFIG[path];
    if (exactMatch) {
      return exactMatch;
    }

    // Handle dynamic routes like /news/123 -> /news/[id]
    const segments = path.split("/").filter(Boolean);
    if (segments.length >= 2) {
      const basePath = `/${segments[0]}`;
      const dynamicPath = `${basePath}/[id]`;

      if (BREADCRUMB_CONFIG[dynamicPath]) {
        return BREADCRUMB_CONFIG[dynamicPath].map((crumb) => ({
          ...crumb,
          path: crumb.path === dynamicPath ? path : crumb.path,
        }));
      }
    }

    // Fallback to home breadcrumb
    return [{ label: "Inicio", path: "/" }];
  }, []);

  // Convert current path to legacy screen for compatibility
  const getCurrentScreen = useCallback((path: string): string => {
    // Direct mapping
    if (ROUTE_TO_SCREEN_MAP[path]) {
      return ROUTE_TO_SCREEN_MAP[path];
    }

    // Handle dynamic routes
    const segments = path.split("/").filter(Boolean);
    if (segments.length >= 1) {
      const basePath = `/${segments[0]}`;
      if (ROUTE_TO_SCREEN_MAP[basePath]) {
        return ROUTE_TO_SCREEN_MAP[basePath];
      }
    }

    // Default to home
    return SCREENS.HOME;
  }, []);

  // Navigation function that works with both routes and legacy screens
  const navigate = useCallback(
    (pathOrScreen: string) => {
      setIsNavigating(true);
      performanceMonitor.recordNavigationStart();

      try {
        let targetPath: string;

        // Check if it's a legacy screen identifier
        if (SCREEN_TO_ROUTE_MAP[pathOrScreen]) {
          targetPath = SCREEN_TO_ROUTE_MAP[pathOrScreen];
        } else if (pathOrScreen.startsWith("/")) {
          // It's already a route path
          targetPath = pathOrScreen;
        } else {
          // Unknown identifier, default to home
          console.warn(
            `Unknown navigation target: ${pathOrScreen}, defaulting to home`
          );
          targetPath = "/";
        }

        // Update history
        setHistory((prev) => {
          const newHistory = [...prev, targetPath];
          // Keep history reasonable size (last 10 entries)
          return newHistory.slice(-10);
        });

        // Use offline navigation which handles both online and offline cases
        offlineNav.navigate(targetPath);
      } catch (error) {
        console.error("Navigation error:", error);
      } finally {
        // Reset navigating state after a short delay
        setTimeout(() => setIsNavigating(false), 100);
      }
    },
    [offlineNav, performanceMonitor]
  );

  // Go back function
  const goBack = useCallback(() => {
    setIsNavigating(true);
    performanceMonitor.recordNavigationStart();

    try {
      // Use offline navigation go back which handles both online and offline
      offlineNav.goBack();

      // Update local history
      if (history.length > 1) {
        const newHistory = history.slice(0, -1);
        setHistory(newHistory);
      }
    } catch (error) {
      console.error("Go back error:", error);
      // Fallback to browser back
      router.back();
    } finally {
      setTimeout(() => setIsNavigating(false), 100);
    }
  }, [offlineNav, history, router, performanceMonitor]);

  // Context value
  const contextValue: NavigationContextType = {
    currentPath: pathname,
    navigate,
    goBack,
    breadcrumbs: generateBreadcrumbs(pathname),
    isNavigating,
    activeScreen: getCurrentScreen(pathname),
    canGoBack: history.length > 1 || offlineNav.canGoBack,
    history: [...history],
    // Offline navigation support
    isOffline: offlineNav.isOffline,
    pendingNavigations: offlineNav.pendingNavigations.length,
    isCurrentRouteAvailableOffline: offlineNav.isCurrentRouteAvailableOffline(),
    cacheCurrentRoute: offlineNav.cacheCurrentRoute,
  };

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  );
}

// Custom hook to use navigation context
export function useNavigation(): NavigationContextType {
  const context = useContext(NavigationContext);

  if (context === undefined) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }

  return context;
}

// Export types for external use
export type { NavigationContextType, BreadcrumbItem };
