/**
 * Performance Optimization Library
 *
 * Exports all performance-related utilities for route prefetching,
 * code splitting, caching, and asset optimization.
 *
 * Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6
 */

// Prefetching utilities
export {
  usePrefetch,
  useHoverPrefetch,
  useViewportPrefetch,
  clearPrefetchCache,
  getPrefetchStats,
  type PrefetchConfig,
} from "./prefetch";

// Optimized Link components
export {
  OptimizedLink,
  HighPriorityLink,
  NavLink,
  type OptimizedLinkProps,
} from "./OptimizedLink";

// Performance monitoring
export {
  usePerformanceMonitor,
  useRouterPerformanceMonitor,
  type PerformanceMetrics,
} from "./monitor";

// Cache management
export {
  useRouteCache,
  useApiCache,
  cachedFetch,
  preloadCriticalRoutes,
  clearAllCaches,
  getAllCacheStats,
  routeCache,
  apiCache,
  staticCache,
} from "./cache";

// Image optimization
export {
  useLazyImage,
  generateSrcSet,
  generateSizes,
  preloadImage,
  preloadImages,
  useImagePreloader,
  optimizeImageUrl,
  getOptimalImageSize,
  imageCache,
  type ImageOptimizationConfig,
} from "./images";

// Asset optimization
export {
  assetManager,
  useRouteAssets,
  inlineCriticalCSS,
  removeNonCriticalCSS,
  loadCSS,
  preloadFont,
  registerCommonRouteAssets,
  initializeAssetOptimization,
  type AssetType,
  type AssetPriority,
  type AssetConfig,
} from "./assets";

// Re-export default monitor instance
export { default as performanceMonitor } from "./monitor";
