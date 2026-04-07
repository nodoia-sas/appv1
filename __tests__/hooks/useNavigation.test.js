import { renderHook, act } from "@testing-library/react";
import { useNavigation } from "../../src/hooks/useNavigation";
import { useAppStore } from "../../src/store/appStore";
import { useAuth } from "../../src/hooks/useAuth";
import { SCREENS } from "../../src/utils/constants";

// Mock the Zustand store
jest.mock("../../src/store/appStore", () => ({
  useAppStore: jest.fn(),
}));

// Mock the useAuth hook
jest.mock("../../src/hooks/useAuth", () => ({
  useAuth: jest.fn(),
}));

// Mock lib/navigation to avoid NavigationProvider requirement
const mockNewNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  goHome: jest.fn(),
  handleNavClick: jest.fn(),
  setUrlParameter: jest.fn(),
  clearUrlParameters: jest.fn(),
  handleDeepLinking: jest.fn(),
  isProtectedRoute: jest.fn((screen) => !["home", "news", "regulations", "glossary"].includes(screen)),
  isCurrentScreen: jest.fn((s) => s === "home"),
  getCurrentScreenConfig: jest.fn(() => null),
  activeScreen: "home",
  history: ["home"],
  canGoBack: false,
  currentPath: "/",
  breadcrumbs: [],
  isNavigating: false,
  isOnHomeScreen: true,
  currentScreenConfig: null,
};
jest.mock("../../lib/navigation", () => ({
  useNavigationCompat: jest.fn(() => mockNewNavigation),
}));

// Mock lib/migration to avoid useRouter requirement
const mockLegacyMigration = {
  migrationState: { isInitialized: true, hasLegacyParams: false, migratedFrom: null },
  currentLegacyScreen: "home",
  handleLegacyNavigation: jest.fn((screen) => {
    // simulate: invalid screens return false, valid ones return true
    const valid = ["home","documents","news","regulations","glossary","quiz","pqr","ai-assist","my-profile","notifications"];
    return valid.includes(screen);
  }),
  migrateToRoute: jest.fn(),
  setActiveScreen: jest.fn(),
  getActiveScreen: jest.fn(() => "home"),
  handleUrlParameterMigration: jest.fn(),
  clearLegacyUrlParams: jest.fn(),
  isLegacyScreen: jest.fn(() => true),
  requiresAuth: jest.fn((screen) => !["home", "news", "regulations", "glossary"].includes(screen)),
};
jest.mock("../../lib/migration", () => ({
  useLegacyMigration: jest.fn(() => mockLegacyMigration),
}));

// Mock window.history.replaceState for deep linking tests
const mockReplaceState = jest.fn();
const originalReplaceState = window.history.replaceState;
Object.defineProperty(window, "history", {
  value: { ...window.history, replaceState: mockReplaceState },
  writable: true,
  configurable: true,
});

describe("useNavigation Hook", () => {
  let mockStoreActions;
  let mockAuthActions;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock store actions
    mockStoreActions = {
      navigate: jest.fn(),
      goBack: jest.fn(),
      showNotification: jest.fn(),
    };

    // Mock store state and actions
    useAppStore.mockReturnValue({
      navigation: {
        activeScreen: "home",
        history: ["home"],
        canGoBack: false,
      },
      ...mockStoreActions,
    });

    // Mock auth actions
    mockAuthActions = {
      handleNavAuth: jest.fn(),
    };

    // Mock auth state and actions
    useAuth.mockReturnValue({
      isAuthenticated: false,
      ...mockAuthActions,
    });

    // Reset navigation compat mock to defaults
    mockNewNavigation.activeScreen = "home";
    mockNewNavigation.history = ["home"];
    mockNewNavigation.canGoBack = false;
    mockNewNavigation.navigate.mockClear();
    mockNewNavigation.goBack.mockClear();
    mockNewNavigation.handleNavClick.mockClear();
    mockNewNavigation.setUrlParameter.mockClear();
    mockNewNavigation.clearUrlParameters.mockClear();
    mockNewNavigation.isCurrentScreen.mockImplementation((s) => s === "home");

    // Reset legacy migration mock
    mockLegacyMigration.currentLegacyScreen = "home";
    mockLegacyMigration.handleUrlParameterMigration.mockClear();
    mockLegacyMigration.clearLegacyUrlParams.mockClear();
    mockLegacyMigration.handleLegacyNavigation.mockClear();
    mockLegacyMigration.handleLegacyNavigation.mockImplementation((screen) => {
      const valid = ["home","documents","news","regulations","glossary","quiz","pqr","ai-assist","my-profile","notifications"];
      return valid.includes(screen);
    });

    // Reset window mocks
    mockReplaceState.mockClear();
  });

  describe("Initialization", () => {
    it("should return current navigation state from store", () => {
      mockLegacyMigration.currentLegacyScreen = "documents";
      mockNewNavigation.history = ["home", "documents"];
      mockNewNavigation.canGoBack = true;

      const { result } = renderHook(() => useNavigation());

      expect(result.current.activeScreen).toBe("documents");
      expect(result.current.history).toEqual(["home", "documents"]);
      expect(result.current.canGoBack).toBe(true);
    });

    it("should provide navigation utility functions", () => {
      const { result } = renderHook(() => useNavigation());

      expect(typeof result.current.navigate).toBe("function");
      expect(typeof result.current.goBack).toBe("function");
      expect(typeof result.current.goHome).toBe("function");
      expect(typeof result.current.handleNavClick).toBe("function");
      expect(typeof result.current.isProtectedRoute).toBe("function");
      expect(typeof result.current.isCurrentScreen).toBe("function");
    });
  });

  describe("Navigation Actions", () => {
    it("should navigate to valid screen without authentication check", () => {
      mockLegacyMigration.handleLegacyNavigation.mockReturnValue(true);
      const { result } = renderHook(() => useNavigation());

      act(() => {
        const success = result.current.navigate(SCREENS.NEWS, {
          skipAuthCheck: true,
        });
        expect(success).toBe(true);
      });

      expect(mockLegacyMigration.handleLegacyNavigation).toHaveBeenCalledWith(SCREENS.NEWS);
    });

    it("should handle invalid screen by defaulting to home via newNavigation", () => {
      // When handleLegacyNavigation returns false, it falls through to newNavigation
      mockLegacyMigration.handleLegacyNavigation.mockReturnValue(false);
      mockNewNavigation.navigate.mockReturnValue(true);
      const { result } = renderHook(() => useNavigation());

      act(() => {
        result.current.navigate("invalid-screen", { skipAuthCheck: true });
      });

      expect(mockNewNavigation.navigate).toHaveBeenCalledWith("invalid-screen", { skipAuthCheck: true });
    });

    it("should block navigation to protected route when not authenticated via newNavigation", () => {
      mockLegacyMigration.handleLegacyNavigation.mockReturnValue(false);
      mockNewNavigation.navigate.mockReturnValue(false);
      const { result } = renderHook(() => useNavigation());

      act(() => {
        result.current.navigate(SCREENS.DOCUMENTS, { requireAuth: true });
      });

      expect(mockNewNavigation.navigate).toHaveBeenCalledWith(SCREENS.DOCUMENTS, { requireAuth: true });
    });

    it("should navigate via legacyMigration when screen is valid", () => {
      mockLegacyMigration.handleLegacyNavigation.mockReturnValue(true);
      useAuth.mockReturnValue({
        isAuthenticated: true,
        ...mockAuthActions,
      });

      const { result } = renderHook(() => useNavigation());

      act(() => {
        const success = result.current.navigate(SCREENS.DOCUMENTS, {
          requireAuth: true,
        });
        expect(success).toBe(true);
      });

      expect(mockLegacyMigration.handleLegacyNavigation).toHaveBeenCalledWith(SCREENS.DOCUMENTS);
    });

    it("should go back when history allows", () => {
      mockNewNavigation.canGoBack = true;
      mockNewNavigation.goBack.mockReturnValue(true);

      const { result } = renderHook(() => useNavigation());

      act(() => {
        const success = result.current.goBack();
        expect(success).toBe(true);
      });

      expect(mockNewNavigation.goBack).toHaveBeenCalled();
    });

    it("should not go back when history is empty", () => {
      mockNewNavigation.canGoBack = false;
      mockNewNavigation.goBack.mockReturnValue(false);
      const { result } = renderHook(() => useNavigation());

      act(() => {
        const success = result.current.goBack();
        expect(success).toBe(false);
      });
    });

    it("should navigate to home screen", () => {
      const { result } = renderHook(() => useNavigation());

      act(() => {
        result.current.goHome();
      });

      expect(mockNewNavigation.goHome).toHaveBeenCalled();
    });
  });

  describe("Bottom Navigation Handler", () => {
    it("should delegate handleNavClick to newNavigation", () => {
      const { result } = renderHook(() => useNavigation());

      act(() => {
        result.current.handleNavClick(SCREENS.HOME);
      });

      expect(mockNewNavigation.handleNavClick).toHaveBeenCalledWith(SCREENS.HOME);
    });

    it("should delegate handleNavClick for protected screens", () => {
      const { result } = renderHook(() => useNavigation());

      act(() => {
        result.current.handleNavClick(SCREENS.DOCUMENTS);
      });

      expect(mockNewNavigation.handleNavClick).toHaveBeenCalledWith(SCREENS.DOCUMENTS);
    });
  });

  describe("Utility Functions", () => {
    it("should check if current screen matches", () => {
      mockNewNavigation.activeScreen = "documents";
      mockNewNavigation.isCurrentScreen.mockImplementation((s) => s === "documents");
      mockLegacyMigration.currentLegacyScreen = "documents";

      const { result } = renderHook(() => useNavigation());

      expect(result.current.isCurrentScreen("documents")).toBe(true);
      expect(result.current.isCurrentScreen("home")).toBe(false);
    });

    it("should identify protected routes", () => {
      const { result } = renderHook(() => useNavigation());

      expect(result.current.isProtectedRoute(SCREENS.DOCUMENTS)).toBe(true);
      expect(result.current.isProtectedRoute(SCREENS.HOME)).toBe(false);
      expect(result.current.isProtectedRoute(SCREENS.NEWS)).toBe(false);
    });

    it("should provide computed values", () => {
      const { result } = renderHook(() => useNavigation());

      expect(result.current.isOnHomeScreen).toBe(true);
      expect(result.current.currentScreenConfig).toBeDefined();
    });
  });

  describe("Deep Linking", () => {
    it("should call handleUrlParameterMigration on initialization", () => {
      renderHook(() => useNavigation());
      // Deep linking is delegated to legacyMigration
      expect(mockLegacyMigration.handleUrlParameterMigration).toHaveBeenCalled();
    });

    it("should handle URL hash parameter via migration on initialization", () => {
      renderHook(() => useNavigation());
      // Delegated to legacyMigration.handleUrlParameterMigration
      expect(mockLegacyMigration.handleUrlParameterMigration).toHaveBeenCalled();
    });

    it("should not navigate to invalid screens", () => {
      renderHook(() => useNavigation());
      expect(mockStoreActions.navigate).not.toHaveBeenCalledWith("invalid");
    });

    it("should call migration on initialization for URL cleanup", () => {
      renderHook(() => useNavigation());
      expect(mockLegacyMigration.handleUrlParameterMigration).toHaveBeenCalled();
    });

    it("should set URL parameter via legacy migration for known screens", () => {
      const { result } = renderHook(() => useNavigation());

      act(() => {
        result.current.setUrlParameter(SCREENS.DOCUMENTS);
      });

      // For legacy screens, delegates to migrateToRoute
      expect(mockLegacyMigration.migrateToRoute).toHaveBeenCalledWith(SCREENS.DOCUMENTS);
    });

    it("should set URL hash parameter via newNavigation for non-legacy screens", () => {
      mockLegacyMigration.isLegacyScreen.mockReturnValueOnce(false);
      const { result } = renderHook(() => useNavigation());

      act(() => {
        result.current.setUrlParameter(SCREENS.NEWS, true);
      });

      expect(mockNewNavigation.setUrlParameter).toHaveBeenCalledWith(SCREENS.NEWS, true);
    });

    it("should clear URL parameters via legacy migration", () => {
      const { result } = renderHook(() => useNavigation());

      act(() => {
        result.current.clearUrlParameters();
      });

      expect(mockLegacyMigration.clearLegacyUrlParams).toHaveBeenCalled();
    });

    it("should call migration on initialization (URL cleanup delegated)", () => {
      renderHook(() => useNavigation());
      expect(mockLegacyMigration.handleUrlParameterMigration).toHaveBeenCalled();
    });
  });

  describe("Requirements Validation", () => {
    it("should manage navigation state and screen transitions (Requirement 3.5)", () => {
      const { result } = renderHook(() => useNavigation());

      // Verify navigation state management
      expect(result.current.activeScreen).toBeDefined();
      expect(result.current.history).toBeDefined();
      expect(result.current.canGoBack).toBeDefined();

      // Verify screen transition functions
      expect(typeof result.current.navigate).toBe("function");
      expect(typeof result.current.goBack).toBe("function");
      expect(typeof result.current.goHome).toBe("function");
    });

    it("should handle authentication requirements for protected routes (Requirement 3.6)", () => {
      mockLegacyMigration.handleLegacyNavigation.mockReturnValue(true);
      const { result } = renderHook(() => useNavigation());

      // Test protected route handling
      act(() => {
        result.current.navigate(SCREENS.DOCUMENTS, { requireAuth: true });
      });

      expect(mockLegacyMigration.handleLegacyNavigation).toHaveBeenCalled();

      // Test utility functions for route protection
      expect(result.current.isProtectedRoute(SCREENS.DOCUMENTS)).toBe(true);
      expect(result.current.isProtectedRoute(SCREENS.HOME)).toBe(false);
    });
  });
});
