/**
 * Route Cache Management
 *
 * Implements intelligent caching strategies for visited pages,
 * API responses, and static assets to improve performance.
 *
 * Requirements: 12.4, 12.5, 12.6
 */

"use client";

// Cache entry interface
interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  expiresAt: number;
  accessCount: number;
  lastAccessed: number;
}

// Cache configuration
interface CacheConfig {
  /** Maximum number of entries to store */
  maxEntries?: number;
  /** Default TTL in milliseconds */
  defaultTTL?: number;
  /** Whether to use LRU eviction */
  useLRU?: boolean;
}

// Default cache configuration
const DEFAULT_CACHE_CONFIG: Required<CacheConfig> = {
  maxEntries: 50,
  defaultTTL: 5 * 60 * 1000, // 5 minutes
  useLRU: true,
};

/**
 * Generic cache implementation with TTL and LRU eviction
 */
class Cache<T = any> {
  private entries = new Map<string, CacheEntry<T>>();
  private config: Required<CacheConfig>;

  constructor(config: CacheConfig = {}) {
    this.config = { ...DEFAULT_CACHE_CONFIG, ...config };
  }

  /**
   * Set a cache entry
   */
  set(key: string, data: T, ttl?: number): void {
    const now = Date.now();
    const expiresAt = now + (ttl || this.config.defaultTTL);

    // Remove expired entries before adding new one
    this.cleanup();

    // If at max capacity, remove LRU entry
    if (this.entries.size >= this.config.maxEntries) {
      this.evictLRU();
    }

    this.entries.set(key, {
      data,
      timestamp: now,
      expiresAt,
      accessCount: 0,
      lastAccessed: now,
    });
  }

  /**
   * Get a cache entry
   */
  get(key: string): T | null {
    const entry = this.entries.get(key);

    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.entries.delete(key);
      return null;
    }

    // Update access statistics
    entry.accessCount++;
    entry.lastAccessed = Date.now();

    return entry.data;
  }

  /**
   * Check if key exists and is not expired
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Delete a cache entry
   */
  delete(key: string): boolean {
    return this.entries.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.entries.clear();
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const now = Date.now();
    const entries = Array.from(this.entries.values());
    const validEntries = entries.filter((entry) => now <= entry.expiresAt);

    return {
      totalEntries: this.entries.size,
      validEntries: validEntries.length,
      expiredEntries: entries.length - validEntries.length,
      totalAccessCount: entries.reduce(
        (sum, entry) => sum + entry.accessCount,
        0
      ),
      averageAge:
        validEntries.length > 0
          ? validEntries.reduce(
              (sum, entry) => sum + (now - entry.timestamp),
              0
            ) / validEntries.length
          : 0,
      memoryUsage: this.estimateMemoryUsage(),
    };
  }

  /**
   * Remove expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.entries) {
      if (now > entry.expiresAt) {
        this.entries.delete(key);
      }
    }
  }

  /**
   * Evict least recently used entry
   */
  private evictLRU(): void {
    if (this.entries.size === 0) return;

    let lruKey: string | null = null;
    let lruTime = Date.now();

    for (const [key, entry] of this.entries) {
      if (entry.lastAccessed < lruTime) {
        lruTime = entry.lastAccessed;
        lruKey = key;
      }
    }

    if (lruKey) {
      this.entries.delete(lruKey);
    }
  }

  /**
   * Estimate memory usage (rough approximation)
   */
  private estimateMemoryUsage(): number {
    let size = 0;
    for (const [key, entry] of this.entries) {
      size += key.length * 2; // UTF-16 characters
      size += JSON.stringify(entry.data).length * 2; // Rough data size
      size += 64; // Overhead for entry metadata
    }
    return size;
  }
}

// Specialized caches for different types of data
export const routeCache = new Cache<any>({
  maxEntries: 30,
  defaultTTL: 10 * 60 * 1000, // 10 minutes for route data
});

export const apiCache = new Cache<any>({
  maxEntries: 100,
  defaultTTL: 5 * 60 * 1000, // 5 minutes for API responses
});

export const staticCache = new Cache<any>({
  maxEntries: 200,
  defaultTTL: 30 * 60 * 1000, // 30 minutes for static content
});

/**
 * Hook for route-specific caching
 */
export function useRouteCache() {
  return {
    get: (route: string) => routeCache.get(route),
    set: (route: string, data: any, ttl?: number) =>
      routeCache.set(route, data, ttl),
    has: (route: string) => routeCache.has(route),
    delete: (route: string) => routeCache.delete(route),
    clear: () => routeCache.clear(),
    getStats: () => routeCache.getStats(),
  };
}

/**
 * Hook for API response caching
 */
export function useApiCache() {
  return {
    get: (endpoint: string) => apiCache.get(endpoint),
    set: (endpoint: string, data: any, ttl?: number) =>
      apiCache.set(endpoint, data, ttl),
    has: (endpoint: string) => apiCache.has(endpoint),
    delete: (endpoint: string) => apiCache.delete(endpoint),
    clear: () => apiCache.clear(),
    getStats: () => apiCache.getStats(),
  };
}

/**
 * Cache-aware fetch wrapper
 */
export async function cachedFetch(
  url: string,
  options: RequestInit = {},
  ttl?: number
): Promise<any> {
  const cacheKey = `${url}:${JSON.stringify(options)}`;

  // Check cache first
  const cached = apiCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Cache successful responses
    apiCache.set(cacheKey, data, ttl);

    return data;
  } catch (error) {
    console.error("Cached fetch error:", error);
    throw error;
  }
}

/**
 * Preload and cache critical routes
 */
export function preloadCriticalRoutes(routes: string[]) {
  routes.forEach((route) => {
    // Mark route as preloaded in cache
    routeCache.set(`preload:${route}`, true, 60 * 60 * 1000); // 1 hour
  });
}

/**
 * Clear all caches (useful for logout or cache invalidation)
 */
export function clearAllCaches() {
  routeCache.clear();
  apiCache.clear();
  staticCache.clear();
}

/**
 * Get comprehensive cache statistics
 */
export function getAllCacheStats() {
  return {
    route: routeCache.getStats(),
    api: apiCache.getStats(),
    static: staticCache.getStats(),
    total: {
      entries:
        routeCache.getStats().totalEntries +
        apiCache.getStats().totalEntries +
        staticCache.getStats().totalEntries,
      memoryUsage:
        routeCache.getStats().memoryUsage +
        apiCache.getStats().memoryUsage +
        staticCache.getStats().memoryUsage,
    },
  };
}
