import { renderHook, act, waitFor } from "@testing-library/react";
import { useAuth } from "../../src/hooks/useAuth";
import { useAppStore } from "../../src/store/appStore";
import authService from "../../src/services/AuthService";

// Mock the AuthService
jest.mock("../../src/services/AuthService", () => ({
  subscribe: jest.fn(),
  getCurrentUser: jest.fn(),
  isAuthLoading: jest.fn(),
  getAuthError: jest.fn(),
  getUserId: jest.fn(),
  login: jest.fn(),
  logout: jest.fn(),
  clearAuth: jest.fn(),
  validateToken: jest.fn(),
  requireAuth: jest.fn(),
  handleNavAuth: jest.fn(),
  initializeAuth: jest.fn(),
}));

// Mock the Zustand store
jest.mock("../../src/store/appStore", () => ({
  useAppStore: jest.fn(),
}));

describe("useAuth Hook", () => {
  let mockStoreActions;
  let mockUnsubscribe;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock store actions
    mockStoreActions = {
      setUser: jest.fn(),
      setLoading: jest.fn(),
      logout: jest.fn(),
      showNotification: jest.fn(),
    };

    // Mock store state and actions
    useAppStore.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      ...mockStoreActions,
    });

    // Mock AuthService subscription
    mockUnsubscribe = jest.fn();
    authService.subscribe.mockReturnValue(mockUnsubscribe);

    // Mock AuthService initial state
    authService.getCurrentUser.mockReturnValue(null);
    authService.isAuthLoading.mockReturnValue(false);
    authService.getAuthError.mockReturnValue(null);
    authService.getUserId.mockReturnValue(null);
  });

  describe("Initialization", () => {
    it("should subscribe to AuthService on mount", () => {
      renderHook(() => useAuth());

      expect(authService.subscribe).toHaveBeenCalledWith(expect.any(Function));
    });

    it("should unsubscribe from AuthService on unmount", () => {
      const { unmount } = renderHook(() => useAuth());

      unmount();

      expect(mockUnsubscribe).toHaveBeenCalled();
    });

    it("should sync initial AuthService state with store", () => {
      const mockUser = { sub: "user123", name: "Test User" };
      authService.getCurrentUser.mockReturnValue(mockUser);
      authService.isAuthLoading.mockReturnValue(true);

      renderHook(() => useAuth());

      expect(mockStoreActions.setUser).toHaveBeenCalledWith(mockUser);
      expect(mockStoreActions.setLoading).toHaveBeenCalledWith(true);
    });
  });

  describe("State Management", () => {
    it("should return current auth state from store", () => {
      const mockUser = { sub: "user123", name: "Test User" };
      useAppStore.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        ...mockStoreActions,
      });

      const { result } = renderHook(() => useAuth());

      expect(result.current.user).toBe(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });

    it("should update store when AuthService state changes", async () => {
      let authCallback;
      authService.subscribe.mockImplementation((callback) => {
        authCallback = callback;
        return mockUnsubscribe;
      });

      renderHook(() => useAuth());

      const newAuthState = {
        user: { sub: "user456", name: "New User" },
        isLoading: false,
        error: null,
      };

      act(() => {
        authCallback(newAuthState);
      });

      expect(mockStoreActions.setUser).toHaveBeenCalledWith(newAuthState.user);
      expect(mockStoreActions.setLoading).toHaveBeenCalledWith(false);
    });
  });

  describe("Authentication Actions", () => {
    it("should call AuthService login method", () => {
      const { result } = renderHook(() => useAuth());

      act(() => {
        result.current.login();
      });

      expect(authService.login).toHaveBeenCalled();
    });

    it("should handle login errors gracefully", () => {
      const loginError = new Error("Login failed");
      authService.login.mockImplementation(() => {
        throw loginError;
      });

      const { result } = renderHook(() => useAuth());

      act(() => {
        result.current.login();
      });

      expect(mockStoreActions.showNotification).toHaveBeenCalledWith(
        "Error al iniciar sesión",
        "error"
      );
    });

    it("should perform complete logout sequence", () => {
      const { result } = renderHook(() => useAuth());

      act(() => {
        result.current.logout();
      });

      expect(mockStoreActions.logout).toHaveBeenCalled();
      expect(authService.clearAuth).toHaveBeenCalled();
      expect(authService.logout).toHaveBeenCalled();
    });

    it("should handle logout errors gracefully", () => {
      const logoutError = new Error("Logout failed");
      authService.logout.mockImplementation(() => {
        throw logoutError;
      });

      const { result } = renderHook(() => useAuth());

      act(() => {
        result.current.logout();
      });

      expect(mockStoreActions.showNotification).toHaveBeenCalledWith(
        "Error al cerrar sesión",
        "error"
      );
    });
  });

  describe("Token Validation", () => {
    it("should validate token successfully", async () => {
      authService.validateToken.mockResolvedValue(true);

      const { result } = renderHook(() => useAuth());

      let isValid;
      await act(async () => {
        isValid = await result.current.validateToken();
      });

      expect(authService.validateToken).toHaveBeenCalled();
      expect(isValid).toBe(true);
    });

    it("should handle token validation failure", async () => {
      authService.validateToken.mockResolvedValue(false);
      authService.getAuthError.mockReturnValue(new Error("Token expired"));

      const { result } = renderHook(() => useAuth());

      let isValid;
      await act(async () => {
        isValid = await result.current.validateToken();
      });

      expect(isValid).toBe(false);
      expect(mockStoreActions.showNotification).toHaveBeenCalledWith(
        "Sesión expirada, por favor inicia sesión nuevamente",
        "warning"
      );
    });

    it("should handle token validation errors", async () => {
      const validationError = new Error("Network error");
      authService.validateToken.mockRejectedValue(validationError);

      const { result } = renderHook(() => useAuth());

      let isValid;
      await act(async () => {
        isValid = await result.current.validateToken();
      });

      expect(isValid).toBe(false);
      expect(mockStoreActions.showNotification).toHaveBeenCalledWith(
        "Error al validar la sesión",
        "error"
      );
    });
  });

  describe("Authentication Requirements", () => {
    it("should delegate requireAuth to AuthService", () => {
      const mockCallback = jest.fn();
      authService.requireAuth.mockReturnValue(true);

      const { result } = renderHook(() => useAuth());

      const isAuthenticated = result.current.requireAuth(mockCallback);

      expect(authService.requireAuth).toHaveBeenCalledWith(mockCallback);
      expect(isAuthenticated).toBe(true);
    });

    it("should delegate handleNavAuth to AuthService", () => {
      authService.handleNavAuth.mockReturnValue(true);

      const { result } = renderHook(() => useAuth());

      const canNavigate = result.current.handleNavAuth("documents");

      expect(authService.handleNavAuth).toHaveBeenCalledWith(
        "documents",
        mockStoreActions.showNotification
      );
      expect(canNavigate).toBe(true);
    });

    it("should delegate initializeAuth to AuthService", () => {
      const mockAuth0User = { sub: "auth0|123", name: "Auth0 User" };
      const { result } = renderHook(() => useAuth());

      result.current.initializeAuth(mockAuth0User, false, null);

      expect(authService.initializeAuth).toHaveBeenCalledWith(
        mockAuth0User,
        false,
        null
      );
    });
  });

  describe("Computed Values", () => {
    it("should return userId from AuthService", () => {
      const mockUserId = "user123";
      authService.getUserId.mockReturnValue(mockUserId);

      const { result } = renderHook(() => useAuth());

      expect(result.current.userId).toBe(mockUserId);
    });

    it("should return error state", () => {
      const mockError = new Error("Auth error");
      let authCallback;
      authService.subscribe.mockImplementation((callback) => {
        authCallback = callback;
        return mockUnsubscribe;
      });

      const { result } = renderHook(() => useAuth());

      act(() => {
        authCallback({
          user: null,
          isLoading: false,
          error: mockError,
        });
      });

      expect(result.current.error).toBe(mockError);
    });
  });

  describe("Integration Requirements", () => {
    it("should integrate with AuthService and Zustand store (Requirement 3.1)", () => {
      const { result } = renderHook(() => useAuth());

      // Verify integration with AuthService
      expect(authService.subscribe).toHaveBeenCalled();
      expect(authService.getCurrentUser).toHaveBeenCalled();
      expect(authService.isAuthLoading).toHaveBeenCalled();

      // Verify integration with Zustand store
      expect(useAppStore).toHaveBeenCalled();

      // Verify hook provides expected interface
      expect(result.current).toHaveProperty("user");
      expect(result.current).toHaveProperty("isAuthenticated");
      expect(result.current).toHaveProperty("isLoading");
      expect(result.current).toHaveProperty("login");
      expect(result.current).toHaveProperty("logout");
      expect(result.current).toHaveProperty("validateToken");
    });

    it("should handle authentication state and actions (Requirement 3.2)", () => {
      const { result } = renderHook(() => useAuth());

      // Verify authentication state handling
      expect(typeof result.current.user).toBeDefined();
      expect(typeof result.current.isAuthenticated).toBe("boolean");
      expect(typeof result.current.isLoading).toBe("boolean");

      // Verify authentication actions
      expect(typeof result.current.login).toBe("function");
      expect(typeof result.current.logout).toBe("function");
      expect(typeof result.current.validateToken).toBe("function");
      expect(typeof result.current.requireAuth).toBe("function");
      expect(typeof result.current.handleNavAuth).toBe("function");
      expect(typeof result.current.initializeAuth).toBe("function");
    });
  });
});
