/**
 * Performance Utilities Tests
 *
 * Basic tests to verify performance optimization functionality
 */

// Mock Next.js router for testing
const mockRouter = {
  push: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
};

// Mock useRouter hook
jest.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
  usePathname: () => "/",
}));

// Mock DOM APIs for testing
Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  })),
});

describe("Performance Utilities", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Cache Management", () => {
    test("should cache and retrieve data", async () => {
      const { routeCache } = await import("../cache");

      // Set cache entry
      routeCache.set("test-route", { data: "test" });

      // Retrieve cache entry
      const cached = routeCache.get("test-route");

      expect(cached).toEqual({ data: "test" });
    });

    test("should handle cache expiration", async () => {
      const { routeCache } = await import("../cache");

      // Set cache entry with short TTL
      routeCache.set("test-route", { data: "test" }, 1);

      // Wait for expiration
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Should return null for expired entry
      const cached = routeCache.get("test-route");
      expect(cached).toBeNull();
    });
  });

  describe("Prefetch Utilities", () => {
    test("should track prefetched routes", async () => {
      const { getPrefetchStats, clearPrefetchCache } = await import(
        "../prefetch"
      );

      // Clear any existing cache
      clearPrefetchCache();

      // Get initial stats
      const initialStats = getPrefetchStats();
      expect(initialStats.prefetchedCount).toBe(0);
    });
  });

  describe("Asset Management", () => {
    test("should register route assets", async () => {
      const { assetManager } = await import("../assets");

      // Register assets for a route
      assetManager.registerRouteAssets("/test", {
        critical: ["test.css"],
        preload: ["test.js"],
      });

      // Get registered assets
      const assets = assetManager.getRouteAssets("/test");
      expect(assets.critical).toContain("test.css");
      expect(assets.preload).toContain("test.js");
    });
  });

  describe("Image Optimization", () => {
    test("should generate responsive srcSet", async () => {
      const { generateSrcSet } = await import("../images");

      const srcSet = generateSrcSet("/test.jpg", [640, 1024]);

      expect(srcSet).toContain("640w");
      expect(srcSet).toContain("1024w");
    });

    test("should optimize image URLs", async () => {
      const { optimizeImageUrl } = await import("../images");

      const optimized = optimizeImageUrl("/test.jpg", 800, 600, 80);

      expect(optimized).toContain("w=800");
      expect(optimized).toContain("h=600");
      expect(optimized).toContain("q=80");
    });
  });
});
