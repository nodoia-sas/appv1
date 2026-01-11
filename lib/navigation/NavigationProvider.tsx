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

// Breadcrumb configuration
const BREADCRUMB_CONFIG: Record<string, BreadcrumbItem[]> = {
  "/": [{ label: "Inicio", path: "/" }],
  "/profile": [
    { label: "Inicio", path: "/" },
    { label: "Perfil", path: "/profile" },
  ],
  "/documents": [
    { label: "Inicio", path: "/" },
    { label: "Documentos", path: "/documents" },
  ],
  "/documents/[id]": [
    { label: "Inicio", path: "/" },
    { label: "Documentos", path: "/documents" },
    { label: "Detalle", path: "/documents/[id]" },
  ],
  "/news": [
    { label: "Inicio", path: "/" },
    { label: "Noticias", path: "/news" },
  ],
  "/news/[id]": [
    { label: "Inicio", path: "/" },
    { label: "Noticias", path: "/news" },
    { label: "Detalle", path: "/news/[id]" },
  ],
  "/regulations": [
    { label: "Inicio", path: "/" },
    { label: "Regulaciones", path: "/regulations" },
  ],
  "/regulations/[id]": [
    { label: "Inicio", path: "/" },
    { label: "Regulaciones", path: "/regulations" },
    { label: "Detalle", path: "/regulations/[id]" },
  ],
  "/glossary": [
    { label: "Inicio", path: "/" },
    { label: "Glosario", path: "/glossary" },
  ],
  "/quiz": [
    { label: "Inicio", path: "/" },
    { label: "Quiz", path: "/quiz" },
  ],
  "/pqr": [
    { label: "Inicio", path: "/" },
    { label: "PQR", path: "/pqr" },
  ],
  "/ai-assist": [
    { label: "Inicio", path: "/" },
    { label: "Asistente IA", path: "/ai-assist" },
  ],
  "/vehicles": [
    { label: "Inicio", path: "/" },
    { label: "Vehículos", path: "/vehicles" },
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

  // Navigation state
  const [isNavigating, setIsNavigating] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  // Initialize history with current path
  useEffect(() => {
    if (pathname && history.length === 0) {
      setHistory([pathname]);
    }
  }, [pathname, history.length]);

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

        // Navigate using Next.js router
        router.push(targetPath);
      } catch (error) {
        console.error("Navigation error:", error);
      } finally {
        // Reset navigating state after a short delay
        setTimeout(() => setIsNavigating(false), 100);
      }
    },
    [router]
  );

  // Go back function
  const goBack = useCallback(() => {
    if (history.length > 1) {
      setIsNavigating(true);

      try {
        // Remove current path from history
        const newHistory = history.slice(0, -1);
        setHistory(newHistory);

        // Navigate to previous path
        const previousPath = newHistory[newHistory.length - 1];
        router.push(previousPath);
      } catch (error) {
        console.error("Go back error:", error);
        // Fallback to browser back
        router.back();
      } finally {
        setTimeout(() => setIsNavigating(false), 100);
      }
    } else {
      // Use browser back as fallback
      router.back();
    }
  }, [history, router]);

  // Context value
  const contextValue: NavigationContextType = {
    currentPath: pathname,
    navigate,
    goBack,
    breadcrumbs: generateBreadcrumbs(pathname),
    isNavigating,
    activeScreen: getCurrentScreen(pathname),
    canGoBack: history.length > 1,
    history: [...history],
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
