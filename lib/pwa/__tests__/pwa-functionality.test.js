/**
 * PWA Functionality Tests
 *
 * Tests for PWA offline navigation and standalone mode functionality.
 */

import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// Mock navigator
const navigatorMock = {
  onLine: true,
  serviceWorker: {
    register: jest.fn(),
  },
};

// Mock window
const windowMock = {
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  location: {
    href: "https://example.com/",
    pathname: "/",
  },
  history: {
    pushState: jest.fn(),
    replaceState: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  },
  matchMedia: jest.fn(() => ({
    matches: false,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  })),
};

// Mock document
const documentMock = {
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  hidden: false,
  body: {
    classList: {
      add: jest.fn(),
      remove: jest.fn(),
    },
  },
  head: {
    appendChild: jest.fn(),
  },
  createElement: jest.fn(() => ({
    name: "",
    content: "",
  })),
  querySelector: jest.fn(),
};

describe("PWA Functionality", () => {
  beforeEach(() => {
    // Setup global mocks
    global.localStorage = localStorageMock;
    global.navigator = navigatorMock;
    global.window = windowMock;
    global.document = documentMock;

    // Reset all mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Clean up
    delete global.localStorage;
    delete global.navigator;
    delete global.window;
    delete global.document;
  });

  describe("Offline Navigation Manager", () => {
    it("should initialize with default state", () => {
      // Import after mocks are set up
      const offlineNavigationManager = require("../offline-navigation").default;

      const state = offlineNavigationManager.getState();

      expect(state.currentRoute).toBe("/");
      expect(state.navigationHistory).toEqual(["/"]);
      expect(state.pendingNavigations).toEqual([]);
      expect(state.isOffline).toBe(false);
    });

    it("should handle navigation when online", () => {
      const offlineNavigationManager = require("../offline-navigation").default;

      offlineNavigationManager.navigate("/test-route");

      const state = offlineNavigationManager.getState();
      expect(state.currentRoute).toBe("/test-route");
      expect(state.navigationHistory).toContain("/test-route");
    });

    it("should queue navigation when offline", () => {
      // Set offline
      global.navigator.onLine = false;

      const offlineNavigationManager = require("../offline-navigation").default;

      offlineNavigationManager.navigate("/offline-route");

      const state = offlineNavigationManager.getState();
      expect(state.currentRoute).toBe("/offline-route");
      expect(state.pendingNavigations.length).toBeGreaterThan(0);
    });

    it("should handle route caching", () => {
      const offlineNavigationManager = require("../offline-navigation").default;

      offlineNavigationManager.cacheRoute("/cached-route", { data: "test" });

      expect(offlineNavigationManager.isRouteCached("/cached-route")).toBe(
        true
      );
      expect(
        offlineNavigationManager.getCachedRouteData("/cached-route")
      ).toEqual({ data: "test" });
    });
  });

  describe("Standalone Mode Manager", () => {
    it("should detect standalone mode", () => {
      // Mock standalone mode
      global.window.matchMedia = jest.fn((query) => ({
        matches: query === "(display-mode: standalone)",
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }));

      const standaloneModeManager = require("../standalone-mode").default;

      const state = standaloneModeManager.getState();
      expect(state.isStandalone).toBe(true);
      expect(state.displayMode).toBe("standalone");
    });

    it("should handle deep links", () => {
      const standaloneModeManager = require("../standalone-mode").default;

      standaloneModeManager.handleDeepLink("/deep-link-test");

      const state = standaloneModeManager.getState();
      expect(state.deepLinkSupport.lastDeepLink).toBe("/deep-link-test");
    });

    it("should manage navigation history", () => {
      const standaloneModeManager = require("../standalone-mode").default;

      standaloneModeManager.navigate("/page1");
      standaloneModeManager.navigate("/page2");

      const state = standaloneModeManager.getState();
      expect(state.navigationState.history.length).toBeGreaterThan(0);
      expect(state.navigationState.canGoBack).toBe(true);
    });
  });

  describe("PWA Utils", () => {
    it("should detect PWA mode correctly", () => {
      const { PWAUtils } = require("../index");

      // Test browser mode
      expect(PWAUtils.isPWA()).toBe(false);

      // Test standalone mode
      global.window.matchMedia = jest.fn(() => ({ matches: true }));
      expect(PWAUtils.isPWA()).toBe(true);
    });

    it("should get display mode correctly", () => {
      const { PWAUtils } = require("../index");

      global.window.matchMedia = jest.fn((query) => ({
        matches: query === "(display-mode: standalone)",
      }));

      expect(PWAUtils.getDisplayMode()).toBe("standalone");
    });

    it("should detect mobile devices", () => {
      const { PWAUtils } = require("../index");

      // Mock mobile user agent
      global.navigator.userAgent =
        "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)";

      expect(PWAUtils.isMobile()).toBe(true);
    });

    it("should get PWA capabilities", () => {
      const { PWAUtils } = require("../index");

      const capabilities = PWAUtils.getPWACapabilities();

      expect(capabilities).toHaveProperty("serviceWorker");
      expect(capabilities).toHaveProperty("pushNotifications");
      expect(capabilities).toHaveProperty("backgroundSync");
      expect(capabilities).toHaveProperty("webShare");
      expect(capabilities).toHaveProperty("fullscreen");
    });
  });

  describe("Integration Tests", () => {
    it("should handle offline to online transition", () => {
      // Start offline
      global.navigator.onLine = false;

      const offlineNavigationManager = require("../offline-navigation").default;

      // Navigate while offline
      offlineNavigationManager.navigate("/offline-page");

      let state = offlineNavigationManager.getState();
      expect(state.pendingNavigations.length).toBeGreaterThan(0);

      // Go back online
      global.navigator.onLine = true;

      // Simulate online event
      const onlineHandler = global.window.addEventListener.mock.calls.find(
        (call) => call[0] === "online"
      )?.[1];

      if (onlineHandler) {
        onlineHandler();
      }

      // Check that pending navigations are processed
      state = offlineNavigationManager.getState();
      expect(state.isOffline).toBe(false);
    });

    it("should preserve navigation state in standalone mode", () => {
      // Mock standalone mode
      global.window.matchMedia = jest.fn((query) => ({
        matches: query === "(display-mode: standalone)",
        addEventListener: jest.fn(),
      }));

      const standaloneModeManager = require("../standalone-mode").default;

      // Navigate in standalone mode
      standaloneModeManager.navigate("/standalone-page");

      const state = standaloneModeManager.getState();
      expect(state.isStandalone).toBe(true);
      expect(state.navigationState.currentUrl).toBe("/standalone-page");
    });
  });
});
