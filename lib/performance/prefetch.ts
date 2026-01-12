/**
 * Route Prefetching Utilities
 *
 * Implements intelligent prefetching strategies for Next.js App Router
 * to improve navigation performance and user experience.
 *
 * Requirements: 12.1, 12.2, 12.3
 */

"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

// Configuration for prefetching behavior
export interface PrefetchConfig {
  /** Enable prefetching on hover */
  onHover?: boolean;
  /** Enable prefetching on viewport intersection */
  onViewport?: boolean;
  /** Delay before prefetching on hover (ms) */
  hoverDelay?: number;
  /** Intersection threshold for viewport prefetching */
  intersectionThreshold?: number;
  /** Priority for prefetching (high/low) */
  priority?: "high" | "low";
}

// Default prefetch configuration
const DEFAULT_PREFETCH_CONFIG: Required<PrefetchConfig> = {
  onHover: true,
  onViewport: true,
  hoverDelay: 100,
  intersectionThreshold: 0.1,
  priority: "low",
};

// Track prefetched routes to avoid duplicate requests
const prefetchedRoutes = new Set<string>();

/**
 * Hook for intelligent route prefetching
 */
export function usePrefetch(config: PrefetchConfig = {}) {
  const router = useRouter();
  const finalConfig = { ...DEFAULT_PREFETCH_CONFIG, ...config };

  const prefetchRoute = useCallback(
    (href: string, priority: "high" | "low" = finalConfig.priority) => {
      // Skip if already prefetched
      if (prefetchedRoutes.has(href)) {
        return;
      }

      try {
        // Mark as prefetched to avoid duplicates
        prefetchedRoutes.add(href);

        // Use Next.js router prefetch with priority
        router.prefetch(href, { kind: priority === "high" ? "auto" : "hover" });
      } catch (error) {
        console.warn("Prefetch failed for route:", href, error);
        // Remove from prefetched set on failure
        prefetchedRoutes.delete(href);
      }
    },
    [router, finalConfig.priority]
  );

  return { prefetchRoute };
}

/**
 * Hook for hover-based prefetching
 */
export function useHoverPrefetch(href: string, config: PrefetchConfig = {}) {
  const { prefetchRoute } = usePrefetch(config);
  const finalConfig = { ...DEFAULT_PREFETCH_CONFIG, ...config };
  const hoverTimeoutRef = useRef<NodeJS.Timeout>();

  const handleMouseEnter = useCallback(() => {
    if (!finalConfig.onHover) return;

    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    // Set timeout for delayed prefetch
    hoverTimeoutRef.current = setTimeout(() => {
      prefetchRoute(href, finalConfig.priority);
    }, finalConfig.hoverDelay);
  }, [href, prefetchRoute, finalConfig]);

  const handleMouseLeave = useCallback(() => {
    // Clear timeout if user leaves before delay
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = undefined;
    }
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
  };
}

/**
 * Hook for viewport-based prefetching using Intersection Observer
 */
export function useViewportPrefetch(href: string, config: PrefetchConfig = {}) {
  const { prefetchRoute } = usePrefetch(config);
  const finalConfig = { ...DEFAULT_PREFETCH_CONFIG, ...config };
  const elementRef = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver>();

  useEffect(() => {
    if (!finalConfig.onViewport || !elementRef.current) return;

    // Create intersection observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            prefetchRoute(href, finalConfig.priority);
            // Stop observing after prefetch
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      {
        threshold: finalConfig.intersectionThreshold,
        rootMargin: "50px", // Start prefetching 50px before element is visible
      }
    );

    // Start observing
    observerRef.current.observe(elementRef.current);

    // Cleanup
    return () => {
      observerRef.current?.disconnect();
    };
  }, [href, prefetchRoute, finalConfig]);

  return { ref: elementRef };
}

/**
 * Utility to clear prefetch cache (useful for testing or memory management)
 */
export function clearPrefetchCache() {
  prefetchedRoutes.clear();
}

/**
 * Get prefetch statistics (useful for debugging)
 */
export function getPrefetchStats() {
  return {
    prefetchedCount: prefetchedRoutes.size,
    prefetchedRoutes: Array.from(prefetchedRoutes),
  };
}
