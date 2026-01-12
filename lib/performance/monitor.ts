/**
 * Performance Monitoring Utilities
 *
 * Tracks and monitors route prefetching performance,
 * navigation timing, and cache effectiveness.
 *
 * Requirements: 12.1, 12.2, 12.3
 */

"use client";

// Performance metrics interface
export interface PerformanceMetrics {
  /** Route navigation timing */
  navigationTime: number;
  /** Whether route was prefetched */
  wasPrefetched: boolean;
  /** Time from prefetch to navigation */
  prefetchToNavigation?: number;
  /** Route path */
  route: string;
  /** Timestamp */
  timestamp: number;
}

// Performance data storage
class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private prefetchTimes = new Map<string, number>();
  private navigationStartTime: number | null = null;

  /**
   * Record when a route was prefetched
   */
  recordPrefetch(route: string) {
    this.prefetchTimes.set(route, Date.now());
  }

  /**
   * Record navigation start
   */
  recordNavigationStart() {
    this.navigationStartTime = Date.now();
  }

  /**
   * Record navigation completion
   */
  recordNavigationComplete(route: string) {
    if (!this.navigationStartTime) return;

    const navigationTime = Date.now() - this.navigationStartTime;
    const prefetchTime = this.prefetchTimes.get(route);
    const wasPrefetched = prefetchTime !== undefined;
    const prefetchToNavigation = wasPrefetched
      ? this.navigationStartTime - prefetchTime
      : undefined;

    const metric: PerformanceMetrics = {
      navigationTime,
      wasPrefetched,
      prefetchToNavigation,
      route,
      timestamp: Date.now(),
    };

    this.metrics.push(metric);

    // Keep only last 100 metrics to prevent memory issues
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }

    // Clean up old prefetch times
    if (wasPrefetched) {
      this.prefetchTimes.delete(route);
    }

    this.navigationStartTime = null;
  }

  /**
   * Get performance statistics
   */
  getStats() {
    if (this.metrics.length === 0) {
      return {
        totalNavigations: 0,
        averageNavigationTime: 0,
        prefetchHitRate: 0,
        averagePrefetchBenefit: 0,
      };
    }

    const totalNavigations = this.metrics.length;
    const averageNavigationTime =
      this.metrics.reduce((sum, m) => sum + m.navigationTime, 0) /
      totalNavigations;

    const prefetchedNavigations = this.metrics.filter((m) => m.wasPrefetched);
    const prefetchHitRate = prefetchedNavigations.length / totalNavigations;

    const nonPrefetchedNavigations = this.metrics.filter(
      (m) => !m.wasPrefetched
    );
    const avgPrefetchedTime =
      prefetchedNavigations.length > 0
        ? prefetchedNavigations.reduce((sum, m) => sum + m.navigationTime, 0) /
          prefetchedNavigations.length
        : 0;
    const avgNonPrefetchedTime =
      nonPrefetchedNavigations.length > 0
        ? nonPrefetchedNavigations.reduce(
            (sum, m) => sum + m.navigationTime,
            0
          ) / nonPrefetchedNavigations.length
        : 0;

    const averagePrefetchBenefit = avgNonPrefetchedTime - avgPrefetchedTime;

    return {
      totalNavigations,
      averageNavigationTime,
      prefetchHitRate,
      averagePrefetchBenefit,
      avgPrefetchedTime,
      avgNonPrefetchedTime,
      recentMetrics: this.metrics.slice(-10),
    };
  }

  /**
   * Clear all metrics (useful for testing)
   */
  clear() {
    this.metrics = [];
    this.prefetchTimes.clear();
    this.navigationStartTime = null;
  }

  /**
   * Export metrics for analysis
   */
  exportMetrics() {
    return {
      metrics: [...this.metrics],
      prefetchTimes: Object.fromEntries(this.prefetchTimes),
      stats: this.getStats(),
    };
  }
}

// Global performance monitor instance
const performanceMonitor = new PerformanceMonitor();

/**
 * Hook for tracking navigation performance
 */
export function usePerformanceMonitor() {
  return {
    recordPrefetch: (route: string) => performanceMonitor.recordPrefetch(route),
    recordNavigationStart: () => performanceMonitor.recordNavigationStart(),
    recordNavigationComplete: (route: string) =>
      performanceMonitor.recordNavigationComplete(route),
    getStats: () => performanceMonitor.getStats(),
    clear: () => performanceMonitor.clear(),
    exportMetrics: () => performanceMonitor.exportMetrics(),
  };
}

/**
 * Performance monitoring hook for Next.js router events
 */
export function useRouterPerformanceMonitor() {
  const monitor = usePerformanceMonitor();

  // This would be used with Next.js router events
  // Implementation depends on how the router events are handled in the app
  return monitor;
}

export default performanceMonitor;
