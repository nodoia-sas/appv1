/**
 * Asset Optimization Utilities
 *
 * Provides utilities for optimizing CSS, JavaScript, and other
 * static assets per route for better performance.
 *
 * Requirements: 12.4, 12.5, 12.6
 */

"use client";

// Asset types
export type AssetType = "css" | "js" | "font" | "image" | "other";

// Asset loading priority
export type AssetPriority = "critical" | "high" | "normal" | "low";

// Asset configuration
export interface AssetConfig {
  type: AssetType;
  priority: AssetPriority;
  preload?: boolean;
  defer?: boolean;
  async?: boolean;
  crossOrigin?: "anonymous" | "use-credentials";
}

// Route-specific asset mapping
interface RouteAssets {
  [route: string]: {
    critical: string[];
    deferred: string[];
    preload: string[];
  };
}

/**
 * Asset manager for route-specific optimizations
 */
class AssetManager {
  private routeAssets: RouteAssets = {};
  private loadedAssets = new Set<string>();
  private preloadedAssets = new Set<string>();

  /**
   * Register assets for a specific route
   */
  registerRouteAssets(
    route: string,
    assets: {
      critical?: string[];
      deferred?: string[];
      preload?: string[];
    }
  ) {
    this.routeAssets[route] = {
      critical: assets.critical || [],
      deferred: assets.deferred || [],
      preload: assets.preload || [],
    };
  }

  /**
   * Get assets for a specific route
   */
  getRouteAssets(route: string) {
    return (
      this.routeAssets[route] || {
        critical: [],
        deferred: [],
        preload: [],
      }
    );
  }

  /**
   * Preload assets for a route
   */
  async preloadRouteAssets(route: string): Promise<void> {
    const assets = this.getRouteAssets(route);
    const toPreload = [...assets.critical, ...assets.preload].filter(
      (asset) => !this.preloadedAssets.has(asset)
    );

    const promises = toPreload.map((asset) => this.preloadAsset(asset));

    try {
      await Promise.all(promises);
      toPreload.forEach((asset) => this.preloadedAssets.add(asset));
    } catch (error) {
      console.warn("Failed to preload some assets for route:", route, error);
    }
  }

  /**
   * Load deferred assets for a route
   */
  async loadDeferredAssets(route: string): Promise<void> {
    const assets = this.getRouteAssets(route);
    const toLoad = assets.deferred.filter(
      (asset) => !this.loadedAssets.has(asset)
    );

    const promises = toLoad.map((asset) => this.loadAsset(asset));

    try {
      await Promise.all(promises);
      toLoad.forEach((asset) => this.loadedAssets.add(asset));
    } catch (error) {
      console.warn(
        "Failed to load some deferred assets for route:",
        route,
        error
      );
    }
  }

  /**
   * Preload a single asset
   */
  private preloadAsset(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.href = url;

      // Determine asset type and set appropriate attributes
      const assetType = this.getAssetType(url);
      switch (assetType) {
        case "css":
          link.as = "style";
          break;
        case "js":
          link.as = "script";
          break;
        case "font":
          link.as = "font";
          link.crossOrigin = "anonymous";
          break;
        case "image":
          link.as = "image";
          break;
        default:
          link.as = "fetch";
          link.crossOrigin = "anonymous";
      }

      link.onload = () => resolve();
      link.onerror = () => reject(new Error(`Failed to preload: ${url}`));

      document.head.appendChild(link);
    });
  }

  /**
   * Load a single asset
   */
  private loadAsset(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const assetType = this.getAssetType(url);

      if (assetType === "css") {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = url;
        link.onload = () => resolve();
        link.onerror = () => reject(new Error(`Failed to load CSS: ${url}`));
        document.head.appendChild(link);
      } else if (assetType === "js") {
        const script = document.createElement("script");
        script.src = url;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load JS: ${url}`));
        document.head.appendChild(script);
      } else {
        // For other assets, just fetch them to cache
        fetch(url)
          .then(() => resolve())
          .catch(reject);
      }
    });
  }

  /**
   * Determine asset type from URL
   */
  private getAssetType(url: string): AssetType {
    const extension = url.split(".").pop()?.toLowerCase();

    switch (extension) {
      case "css":
        return "css";
      case "js":
      case "mjs":
        return "js";
      case "woff":
      case "woff2":
      case "ttf":
      case "otf":
        return "font";
      case "jpg":
      case "jpeg":
      case "png":
      case "webp":
      case "avif":
      case "svg":
        return "image";
      default:
        return "other";
    }
  }

  /**
   * Get loading statistics
   */
  getStats() {
    return {
      totalRoutes: Object.keys(this.routeAssets).length,
      loadedAssets: this.loadedAssets.size,
      preloadedAssets: this.preloadedAssets.size,
      routeAssets: { ...this.routeAssets },
    };
  }

  /**
   * Clear loaded asset tracking
   */
  clear() {
    this.loadedAssets.clear();
    this.preloadedAssets.clear();
  }
}

// Global asset manager instance
export const assetManager = new AssetManager();

/**
 * Hook for route-specific asset management
 */
export function useRouteAssets(route: string) {
  return {
    preload: () => assetManager.preloadRouteAssets(route),
    loadDeferred: () => assetManager.loadDeferredAssets(route),
    register: (
      assets: Parameters<typeof assetManager.registerRouteAssets>[1]
    ) => assetManager.registerRouteAssets(route, assets),
    getAssets: () => assetManager.getRouteAssets(route),
  };
}

/**
 * Critical CSS inlining utility
 */
export function inlineCriticalCSS(css: string): void {
  const style = document.createElement("style");
  style.textContent = css;
  style.setAttribute("data-critical", "true");
  document.head.appendChild(style);
}

/**
 * Remove non-critical CSS after page load
 */
export function removeNonCriticalCSS(): void {
  const stylesheets = document.querySelectorAll(
    'link[rel="stylesheet"]:not([data-critical])'
  );
  stylesheets.forEach((link) => {
    if (link.parentNode) {
      link.parentNode.removeChild(link);
    }
  });
}

/**
 * Lazy load CSS for non-critical styles
 */
export function loadCSS(href: string, media: string = "all"): Promise<void> {
  return new Promise((resolve, reject) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.media = "print"; // Load as print first to avoid render blocking

    link.onload = () => {
      link.media = media; // Switch to target media after load
      resolve();
    };

    link.onerror = () => reject(new Error(`Failed to load CSS: ${href}`));

    document.head.appendChild(link);
  });
}

/**
 * Preload fonts for better performance
 */
export function preloadFont(href: string, type: string = "font/woff2"): void {
  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "font";
  link.type = type;
  link.href = href;
  link.crossOrigin = "anonymous";
  document.head.appendChild(link);
}

/**
 * Register common route assets
 */
export function registerCommonRouteAssets() {
  // Home page assets
  assetManager.registerRouteAssets("/", {
    critical: ["/css/home.css", "/js/home-critical.js"],
    preload: ["/fonts/inter-var.woff2"],
    deferred: ["/js/home-deferred.js", "/css/home-non-critical.css"],
  });

  // Profile page assets
  assetManager.registerRouteAssets("/profile", {
    critical: ["/css/profile.css"],
    preload: ["/js/profile.js"],
  });

  // Documents page assets
  assetManager.registerRouteAssets("/documents", {
    critical: ["/css/documents.css"],
    preload: ["/js/documents.js"],
  });

  // Add more route-specific assets as needed
}

/**
 * Initialize asset optimization
 */
export function initializeAssetOptimization() {
  // Register common assets
  registerCommonRouteAssets();

  // Preload critical fonts
  preloadFont("/fonts/inter-var.woff2");

  // Set up performance observer for asset loading
  if (typeof window !== "undefined" && "PerformanceObserver" in window) {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === "resource") {
          // Log slow loading assets
          if (entry.duration > 1000) {
            console.warn(
              "Slow loading asset:",
              entry.name,
              `${entry.duration}ms`
            );
          }
        }
      });
    });

    observer.observe({ entryTypes: ["resource"] });
  }
}
