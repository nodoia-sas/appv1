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

// Mock window object for deep linking tests
const mockWindow = {
  location: {
    search: "",
    hash: "",
    href: "http://localhost:3000",
  },
  history: {
    replaceState: jest.fn(),
  },
};

Object.defineProperty(window, "location", {
  value: mockWindow.location,
  writable: true,
});

Object.defineProperty(window, "history", {
  value: mockWindow.history,
  writable: true,
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

    // Reset window mocks
    mockWindow.location.search = "";
    mockWindow.location.hash = "";
    mockWindow.history.replaceState.mockClear();
  });

  describe("Initialization", () => {
    it("should return current navigation state from store", () => {
      const mockNavigation = {
        activeScreen: "documents",
        history: ["home", "documents"],
        canGoBack: true,
      };

      useAppStore.mockReturnValue({
        navigation: mockNavigation,
        ...mockStoreActions,
      });

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
      const { result } = renderHook(() => useNavigation());

      act(() => {
        const success = result.current.navigate(SCREENS.NEWS, {
          skipAuthCheck: true,
        });
        expect(success).toBe(true);
      });

      expect(mockStoreActions.navigate).toHaveBeenCalledWith(SCREENS.NEWS);
    });

    it("should handle invalid screen by defaulting to home", () => {
      const { result } = renderHook(() => useNavigation());

      act(() => {
        result.current.navigate("invalid-screen", { skipAuthCheck: true });
      });

      expect(mockStoreActions.navigate).toHaveBeenCalledWith(SCREENS.HOME);
    });

    it("should block navigation to protected route when not authenticated", () => {
      const { result } = renderHook(() => useNavigation());

      act(() => {
        const success = result.current.navigate(SCREENS.DOCUMENTS, {
          requireAuth: true,
        });
        expect(success).toBe(false);
      });

      expect(mockStoreActions.showNotification).toHaveBeenCalledWith(
        "Debes iniciar sesión para acceder a esta sección",
        "info"
      );
      expect(mockAuthActions.handleNavAuth).toHaveBeenCalledWith(
        SCREENS.DOCUMENTS
      );
      expect(mockStoreActions.navigate).not.toHaveBeenCalled();
    });

    it("should allow navigation to protected route when authenticated", () => {
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

      expect(mockStoreActions.navigate).toHaveBeenCalledWith(SCREENS.DOCUMENTS);
      expect(mockStoreActions.showNotification).not.toHaveBeenCalled();
    });

    it("should go back when history allows", () => {
      useAppStore.mockReturnValue({
        navigation: {
          activeScreen: "documents",
          history: ["home", "documents"],
          canGoBack: true,
        },
        ...mockStoreActions,
      });

      const { result } = renderHook(() => useNavigation());

      act(() => {
        const success = result.current.goBack();
        expect(success).toBe(true);
      });

      expect(mockStoreActions.goBack).toHaveBeenCalled();
    });

    it("should not go back when history is empty", () => {
      const { result } = renderHook(() => useNavigation());

      act(() => {
        const success = result.current.goBack();
        expect(success).toBe(false);
      });

      expect(mockStoreActions.goBack).not.toHaveBeenCalled();
    });

    it("should navigate to home screen", () => {
      const { result } = renderHook(() => useNavigation());

      act(() => {
        result.current.goHome();
      });

      expect(mockStoreActions.navigate).toHaveBeenCalledWith(SCREENS.HOME);
    });
  });

  describe("Bottom Navigation Handler", () => {
    it("should allow navigation to home without authentication", () => {
      const { result } = renderHook(() => useNavigation());

      act(() => {
        result.current.handleNavClick(SCREENS.HOME);
      });

      expect(mockStoreActions.navigate).toHaveBeenCalledWith(SCREENS.HOME);
      expect(mockStoreActions.showNotification).not.toHaveBeenCalled();
    });

    it("should require authentication for non-home screens", () => {
      const { result } = renderHook(() => useNavigation());

      act(() => {
        result.current.handleNavClick(SCREENS.DOCUMENTS);
      });

      expect(mockStoreActions.showNotification).toHaveBeenCalledWith(
        "Debes iniciar sesión para acceder a esta sección",
        "info"
      );
      expect(mockAuthActions.handleNavAuth).toHaveBeenCalledWith(
        SCREENS.DOCUMENTS
      );
    });
  });

  describe("Utility Functions", () => {
    it("should check if current screen matches", () => {
      useAppStore.mockReturnValue({
        navigation: {
          activeScreen: "documents",
          history: ["home", "documents"],
          canGoBack: true,
        },
        ...mockStoreActions,
      });

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
    it("should handle URL query parameter on initialization", () => {
      mockWindow.location.search = "?screen=documents";

      const { result } = renderHook(() => useNavigation());

      // Deep linking should attempt navigation
      expect(mockStoreActions.showNotification).toHaveBeenCalled();
      expect(mockWindow.history.replaceState).toHaveBeenCalled();
    });

    it("should handle URL hash parameter on initialization", () => {
      mockWindow.location.hash = "#news";

      const { result } = renderHook(() => useNavigation());

      // Deep linking should attempt navigation
      expect(mockStoreActions.navigate).toHaveBeenCalledWith(SCREENS.NEWS);
      expect(mockWindow.history.replaceState).toHaveBeenCalled();
    });

    it("should ignore invalid deep link screens", () => {
      mockWindow.location.search = "?screen=invalid";

      const { result } = renderHook(() => useNavigation());

      // Should not attempt navigation for invalid screen
      expect(mockStoreActions.navigate).not.toHaveBeenCalledWith("invalid");
    });

    it("should clean up URL after deep linking", () => {
      mockWindow.location.search = "?screen=news";
      mockWindow.location.href = "http://localhost:3000?screen=news";

      renderHook(() => useNavigation());

      expect(mockWindow.history.replaceState).toHaveBeenCalledWith(
        null,
        "",
        expect.stringContaining("localhost:3000")
      );
    });

    it("should set URL query parameter", () => {
      const { result } = renderHook(() => useNavigation());

      act(() => {
        result.current.setUrlParameter(SCREENS.DOCUMENTS);
      });

      expect(mockWindow.history.replaceState).toHaveBeenCalledWith(
        null,
        "",
        expect.stringContaining("screen=documents")
      );
    });

    it("should set URL hash parameter", () => {
      const { result } = renderHook(() => useNavigation());

      act(() => {
        result.current.setUrlParameter(SCREENS.NEWS, true);
      });

      expect(mockWindow.history.replaceState).toHaveBeenCalledWith(
        null,
        "",
        expect.stringContaining("#news")
      );
    });

    it("should clear URL parameters", () => {
      mockWindow.location.search = "?screen=documents";
      mockWindow.location.hash = "#test";

      const { result } = renderHook(() => useNavigation());

      act(() => {
        result.current.clearUrlParameters();
      });

      expect(mockWindow.history.replaceState).toHaveBeenCalledWith(
        null,
        "",
        expect.not.stringContaining("screen=")
      );
    });

    it("should preserve hash when cleaning query parameters (original behavior)", () => {
      mockWindow.location.search = "?screen=documents";
      mockWindow.location.hash = "#section1";
      mockWindow.location.href =
        "http://localhost:3000?screen=documents#section1";

      renderHook(() => useNavigation());

      // Should preserve hash while removing query parameter
      expect(mockWindow.history.replaceState).toHaveBeenCalledWith(
        null,
        "",
        expect.stringContaining("#section1")
      );
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
      const { result } = renderHook(() => useNavigation());

      // Test protected route handling
      act(() => {
        result.current.navigate(SCREENS.DOCUMENTS, { requireAuth: true });
      });

      expect(mockStoreActions.showNotification).toHaveBeenCalled();
      expect(mockAuthActions.handleNavAuth).toHaveBeenCalled();

      // Test utility functions for route protection
      expect(result.current.isProtectedRoute(SCREENS.DOCUMENTS)).toBe(true);
      expect(result.current.isProtectedRoute(SCREENS.HOME)).toBe(false);
    });
  });
});
