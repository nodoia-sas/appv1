import AuthService from "../../src/services/AuthService";
import fc from "fast-check";

// Mock fetch globally
global.fetch = jest.fn();

describe("AuthService", () => {
  let authService;

  beforeEach(() => {
    // Create a fresh instance for each test
    authService = new AuthService();

    // Clear all mocks
    jest.clearAllMocks();
    global.fetch.mockClear();

    // Mock window.location
    delete window.location;
    window.location = {
      href: "",
    };
  });

  afterEach(() => {
    // Clean up subscribers
    authService.subscribers.clear();
  });

  describe("Initial State", () => {
    it("should have correct initial state", () => {
      expect(authService.user).toBeNull();
      expect(authService.isAuthenticated).toBe(false);
      expect(authService.isLoading).toBe(false);
      expect(authService.error).toBeNull();
      expect(authService.subscribers.size).toBe(0);
    });
  });

  describe("Subscription Management", () => {
    it("should add and remove subscribers", () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      const unsubscribe1 = authService.subscribe(callback1);
      const unsubscribe2 = authService.subscribe(callback2);

      expect(authService.subscribers.size).toBe(2);

      unsubscribe1();
      expect(authService.subscribers.size).toBe(1);

      unsubscribe2();
      expect(authService.subscribers.size).toBe(0);
    });

    it("should notify subscribers on state changes", () => {
      const callback = jest.fn();
      authService.subscribe(callback);

      const mockUser = {
        sub: "auth0|123",
        name: "Test User",
        email: "test@example.com",
      };

      authService.setAuthState(mockUser);

      expect(callback).toHaveBeenCalledWith({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    });

    it("should handle subscriber errors gracefully", () => {
      const errorCallback = jest.fn(() => {
        throw new Error("Subscriber error");
      });
      const normalCallback = jest.fn();

      // Mock console.error to avoid noise in test output
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      authService.subscribe(errorCallback);
      authService.subscribe(normalCallback);

      const mockUser = { sub: "auth0|123", name: "Test User" };
      authService.setAuthState(mockUser);

      expect(errorCallback).toHaveBeenCalled();
      expect(normalCallback).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error in auth subscriber:",
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe("Authentication State Management", () => {
    it("should set authentication state correctly", () => {
      const mockUser = {
        sub: "auth0|123",
        name: "Test User",
        email: "test@example.com",
      };
      const mockError = new Error("Test error");

      authService.setAuthState(mockUser, true, mockError);

      expect(authService.user).toEqual(mockUser);
      expect(authService.isAuthenticated).toBe(true);
      expect(authService.isLoading).toBe(true);
      expect(authService.error).toEqual(mockError);
    });

    it("should set isAuthenticated to false when user is null", () => {
      authService.setAuthState(null);

      expect(authService.user).toBeNull();
      expect(authService.isAuthenticated).toBe(false);
    });

    it("should initialize auth from Auth0 user data", () => {
      const mockUser = { sub: "auth0|123", name: "Test User" };
      const mockError = new Error("Auth0 error");

      authService.initializeAuth(mockUser, true, mockError);

      expect(authService.user).toEqual(mockUser);
      expect(authService.isLoading).toBe(true);
      expect(authService.error).toEqual(mockError);
    });
  });

  describe("Token Validation", () => {
    it("should validate token successfully", async () => {
      const mockUser = { sub: "auth0|123", name: "Test User" };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      });

      const result = await authService.validateToken();

      expect(result).toBe(true);
      expect(authService.user).toEqual(mockUser);
      expect(authService.isAuthenticated).toBe(true);
      expect(authService.isLoading).toBe(false);
      expect(global.fetch).toHaveBeenCalledWith("/api/auth/me");
    });

    it("should handle token validation failure", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
      });

      const result = await authService.validateToken();

      expect(result).toBe(false);
      expect(authService.user).toBeNull();
      expect(authService.isAuthenticated).toBe(false);
      expect(authService.error).toBeInstanceOf(Error);
      expect(authService.error.message).toBe("Token validation failed");
    });

    it("should handle network errors during token validation", async () => {
      const networkError = new Error("Network error");
      global.fetch.mockRejectedValueOnce(networkError);

      const result = await authService.validateToken();

      expect(result).toBe(false);
      expect(authService.user).toBeNull();
      expect(authService.isAuthenticated).toBe(false);
      expect(authService.error).toEqual(networkError);
    });
  });

  describe("Authentication Actions", () => {
    it("should redirect to login", () => {
      authService.login();
      expect(window.location.href).toBe("/api/auth/login");
    });

    it("should handle login redirect error", () => {
      // Mock window as undefined to simulate error
      const originalWindow = global.window;
      global.window = undefined;

      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      authService.login();

      expect(authService.error).toBeInstanceOf(Error);
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error redirecting to login:",
        expect.any(Error)
      );

      global.window = originalWindow;
      consoleSpy.mockRestore();
    });

    it("should redirect to logout", () => {
      authService.logout();
      expect(window.location.href).toBe("/api/auth/logout");
    });

    it("should handle logout redirect error", () => {
      // Mock window as undefined to simulate error
      const originalWindow = global.window;
      global.window = undefined;

      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      authService.logout();

      expect(authService.error).toBeInstanceOf(Error);
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error redirecting to logout:",
        expect.any(Error)
      );

      global.window = originalWindow;
      consoleSpy.mockRestore();
    });
  });

  describe("User Information Methods", () => {
    it("should return user ID when authenticated", () => {
      const mockUser = { sub: "auth0|123", name: "Test User" };
      authService.setAuthState(mockUser);

      expect(authService.getUserId()).toBe("auth0|123");
    });

    it("should return null when not authenticated", () => {
      expect(authService.getUserId()).toBeNull();
    });

    it("should return current user", () => {
      const mockUser = { sub: "auth0|123", name: "Test User" };
      authService.setAuthState(mockUser);

      expect(authService.getCurrentUser()).toEqual(mockUser);
    });

    it("should return authentication status", () => {
      expect(authService.isUserAuthenticated()).toBe(false);

      const mockUser = { sub: "auth0|123", name: "Test User" };
      authService.setAuthState(mockUser);

      expect(authService.isUserAuthenticated()).toBe(true);
    });

    it("should return loading status", () => {
      expect(authService.isAuthLoading()).toBe(false);

      authService.setAuthState(null, true);

      expect(authService.isAuthLoading()).toBe(true);
    });

    it("should return current error", () => {
      expect(authService.getAuthError()).toBeNull();

      const mockError = new Error("Test error");
      authService.setAuthState(null, false, mockError);

      expect(authService.getAuthError()).toEqual(mockError);
    });
  });

  describe("Authentication Requirements", () => {
    it("should allow access when authenticated", () => {
      const mockUser = { sub: "auth0|123", name: "Test User" };
      authService.setAuthState(mockUser);

      const onUnauthenticated = jest.fn();
      const result = authService.requireAuth(onUnauthenticated);

      expect(result).toBe(true);
      expect(onUnauthenticated).not.toHaveBeenCalled();
    });

    it("should call callback when not authenticated", () => {
      const onUnauthenticated = jest.fn();
      const result = authService.requireAuth(onUnauthenticated);

      expect(result).toBe(false);
      expect(onUnauthenticated).toHaveBeenCalled();
    });

    it("should redirect to login when no callback provided", () => {
      const result = authService.requireAuth();

      expect(result).toBe(false);
      expect(window.location.href).toBe("/api/auth/login");
    });

    it("should handle navigation auth for home screen", () => {
      const showNotification = jest.fn();
      const result = authService.handleNavAuth("home", showNotification);

      expect(result).toBe(true);
      expect(showNotification).not.toHaveBeenCalled();
    });

    it("should handle navigation auth for protected screens when authenticated", () => {
      const mockUser = { sub: "auth0|123", name: "Test User" };
      authService.setAuthState(mockUser);

      const showNotification = jest.fn();
      const result = authService.handleNavAuth("documents", showNotification);

      expect(result).toBe(true);
      expect(showNotification).not.toHaveBeenCalled();
    });

    it("should handle navigation auth for protected screens when not authenticated", () => {
      const showNotification = jest.fn();
      const result = authService.handleNavAuth("documents", showNotification);

      expect(result).toBe(false);
      expect(showNotification).toHaveBeenCalledWith(
        "Debes iniciar sesión para acceder a esta sección",
        "info"
      );
      expect(window.location.href).toBe("/api/auth/login");
    });
  });

  describe("Clear Authentication", () => {
    it("should clear authentication state", () => {
      const mockUser = { sub: "auth0|123", name: "Test User" };
      const mockError = new Error("Test error");
      authService.setAuthState(mockUser, true, mockError);

      authService.clearAuth();

      expect(authService.user).toBeNull();
      expect(authService.isAuthenticated).toBe(false);
      expect(authService.isLoading).toBe(false);
      expect(authService.error).toBeNull();
    });
  });

  describe("Property-Based Tests", () => {
    // Feature: phase-1-monolith-separation, Property 4: Authentication Hook Integration
    test("authentication state changes should properly integrate with Auth0 and update global state", () => {
      fc.assert(
        fc.property(
          fc.record({
            user: fc.option(
              fc.record({
                sub: fc.string({ minLength: 1 }),
                name: fc.string({ minLength: 1 }),
                email: fc.emailAddress(),
                picture: fc.option(fc.webUrl(), { nil: undefined }),
              }),
              { nil: null }
            ),
            isLoading: fc.boolean(),
            error: fc.option(
              fc.string({ minLength: 1 }).map((msg) => new Error(msg)),
              { nil: null }
            ),
          }),
          (authState) => {
            const callback = jest.fn();
            authService.subscribe(callback);

            // Simulate Auth0 state change
            authService.initializeAuth(
              authState.user,
              authState.isLoading,
              authState.error
            );

            // Verify state is properly updated
            expect(authService.user).toEqual(authState.user);
            expect(authService.isAuthenticated).toBe(!!authState.user);
            expect(authService.isLoading).toBe(authState.isLoading);
            expect(authService.error).toEqual(authState.error);

            // Verify subscribers are notified
            expect(callback).toHaveBeenCalledWith({
              user: authState.user,
              isAuthenticated: !!authState.user,
              isLoading: authState.isLoading,
              error: authState.error,
            });

            // Verify user ID extraction works correctly
            if (authState.user) {
              expect(authService.getUserId()).toBe(authState.user.sub);
            } else {
              expect(authService.getUserId()).toBeNull();
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    test("navigation authentication should work correctly for all screen types", () => {
      fc.assert(
        fc.property(
          fc.record({
            screen: fc.constantFrom(
              "home",
              "documents",
              "news",
              "regulations",
              "glossary",
              "quiz",
              "pqr",
              "ai-assist",
              "my-profile",
              "notifications"
            ),
            isAuthenticated: fc.boolean(),
            user: fc.option(
              fc.record({
                sub: fc.string({ minLength: 1 }),
                name: fc.string({ minLength: 1 }),
                email: fc.emailAddress(),
              }),
              { nil: null }
            ),
          }),
          (testCase) => {
            // Set up authentication state
            if (testCase.isAuthenticated && testCase.user) {
              authService.setAuthState(testCase.user);
            } else {
              authService.setAuthState(null);
            }

            const showNotification = jest.fn();

            // Reset window.location.href for each test
            window.location.href = "";

            const result = authService.handleNavAuth(
              testCase.screen,
              showNotification
            );

            if (testCase.screen === "home") {
              // Home screen should always be accessible
              expect(result).toBe(true);
              expect(showNotification).not.toHaveBeenCalled();
              expect(window.location.href).toBe("");
            } else if (testCase.isAuthenticated && testCase.user) {
              // Protected screens should be accessible when authenticated
              expect(result).toBe(true);
              expect(showNotification).not.toHaveBeenCalled();
              expect(window.location.href).toBe("");
            } else {
              // Protected screens should redirect when not authenticated
              expect(result).toBe(false);
              expect(showNotification).toHaveBeenCalledWith(
                "Debes iniciar sesión para acceder a esta sección",
                "info"
              );
              expect(window.location.href).toBe("/api/auth/login");
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
