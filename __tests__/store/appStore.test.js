import { renderHook, act } from "@testing-library/react";
import { useAppStore } from "../../src/store/appStore";
import fc from "fast-check";

describe("AppStore", () => {
  beforeEach(() => {
    // Reset store before each test
    useAppStore.getState().reset();
    // Clear localStorage
    localStorage.clear();
    // Use fake timers for testing async persistence
    jest.useFakeTimers();
  });

  afterEach(() => {
    // Restore real timers
    jest.useRealTimers();
  });

  describe("Initial State", () => {
    it("should have correct initial state", () => {
      const { result } = renderHook(() => useAppStore());

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.navigation.activeScreen).toBe("home");
      expect(result.current.navigation.history).toEqual(["home"]);
      expect(result.current.navigation.canGoBack).toBe(false);
      expect(result.current.notification.visible).toBe(false);
      expect(result.current.showLoginDropdown).toBe(false);
      expect(result.current.showEnvironmentInfo).toBe(false);
    });
  });

  describe("Auth Actions", () => {
    it("should set user and update authentication state", () => {
      const { result } = renderHook(() => useAppStore());
      const mockUser = {
        id: "1",
        name: "Test User",
        email: "test@example.com",
      };

      act(() => {
        result.current.setUser(mockUser);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });

    it("should logout and clear user state", () => {
      const { result } = renderHook(() => useAppStore());
      const mockUser = {
        id: "1",
        name: "Test User",
        email: "test@example.com",
      };

      // First set a user
      act(() => {
        result.current.setUser(mockUser);
        result.current.setShowLoginDropdown(true);
      });

      // Then logout
      act(() => {
        result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.showLoginDropdown).toBe(false);
    });
  });

  describe("Navigation Actions", () => {
    it("should navigate to new screen and update history", () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.navigate("documents");
      });

      expect(result.current.navigation.activeScreen).toBe("documents");
      expect(result.current.navigation.history).toEqual(["home", "documents"]);
      expect(result.current.navigation.canGoBack).toBe(true);
    });

    it("should go back to previous screen", () => {
      const { result } = renderHook(() => useAppStore());

      // Navigate to documents first
      act(() => {
        result.current.navigate("documents");
      });

      // Then go back
      act(() => {
        result.current.goBack();
      });

      expect(result.current.navigation.activeScreen).toBe("home");
      expect(result.current.navigation.history).toEqual(["home"]);
      expect(result.current.navigation.canGoBack).toBe(false);
    });
  });

  describe("Notification Actions", () => {
    it("should show notification with correct properties", () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.showNotification("Test message", "success", 5000);
      });

      expect(result.current.notification.message).toBe("Test message");
      expect(result.current.notification.type).toBe("success");
      expect(result.current.notification.visible).toBe(true);
      expect(result.current.notification.duration).toBe(5000);
    });

    it("should hide notification", () => {
      const { result } = renderHook(() => useAppStore());

      // First show a notification
      act(() => {
        result.current.showNotification("Test message");
      });

      // Then hide it
      act(() => {
        result.current.hideNotification();
      });

      expect(result.current.notification.visible).toBe(false);
      expect(result.current.notification.message).toBe("Test message"); // Message should remain
    });
  });

  describe("UI Actions", () => {
    it("should toggle login dropdown", () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.toggleLoginDropdown();
      });

      expect(result.current.showLoginDropdown).toBe(true);

      act(() => {
        result.current.toggleLoginDropdown();
      });

      expect(result.current.showLoginDropdown).toBe(false);
    });

    it("should toggle environment info", () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.toggleEnvironmentInfo();
      });

      expect(result.current.showEnvironmentInfo).toBe(true);

      act(() => {
        result.current.toggleEnvironmentInfo();
      });

      expect(result.current.showEnvironmentInfo).toBe(false);
    });
  });

  describe("Storage Fallback", () => {
    it("should handle localStorage unavailability gracefully", () => {
      // Mock localStorage to throw an error
      const originalLocalStorage = global.localStorage;
      const mockConsoleWarn = jest
        .spyOn(console, "warn")
        .mockImplementation(() => {});

      // Simulate localStorage being unavailable
      Object.defineProperty(global, "localStorage", {
        value: {
          setItem: jest.fn(() => {
            throw new Error("localStorage is not available");
          }),
          getItem: jest.fn(() => {
            throw new Error("localStorage is not available");
          }),
          removeItem: jest.fn(() => {
            throw new Error("localStorage is not available");
          }),
        },
        writable: true,
      });

      // Create a new store instance (this will trigger the storage initialization)
      const { result } = renderHook(() => useAppStore());

      // The store should still work with memory storage fallback
      const mockUser = {
        id: "1",
        name: "Test User",
        email: "test@example.com",
      };

      act(() => {
        result.current.setUser(mockUser);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
      expect(mockConsoleWarn).toHaveBeenCalledWith(
        expect.stringContaining(
          "localStorage not available, using memory storage:"
        ),
        expect.any(String)
      );

      // Restore original localStorage and console
      global.localStorage = originalLocalStorage;
      mockConsoleWarn.mockRestore();
    });
  });

  describe("Property-Based Tests", () => {
    // Feature: phase-1-monolith-separation, Property 2: State Management Reactivity
    test("state updates should notify all subscribed components", () => {
      fc.assert(
        fc.property(
          fc.record({
            // User state updates
            user: fc.option(
              fc.record({
                id: fc.string({ minLength: 1 }),
                name: fc.string({ minLength: 1 }),
                email: fc.emailAddress(),
              }),
              { nil: null }
            ),
            // Navigation state updates
            screen: fc.constantFrom(
              "home",
              "documents",
              "news",
              "regulations",
              "glossary",
              "quiz",
              "pqr",
              "ai-assist",
              "my-profile"
            ),
            // Notification state updates
            notification: fc.record({
              message: fc.string({ minLength: 1 }),
              type: fc.constantFrom("success", "error", "warning", "info"),
              duration: fc.integer({ min: 1000, max: 10000 }),
            }),
            // UI state updates
            showLoginDropdown: fc.boolean(),
            showEnvironmentInfo: fc.boolean(),
          }),
          (stateUpdates) => {
            // Create multiple hook instances to simulate multiple subscribed components
            const { result: component1 } = renderHook(() => useAppStore());
            const { result: component2 } = renderHook(() => useAppStore());
            const { result: component3 } = renderHook(() => useAppStore());

            // Apply state updates
            act(() => {
              if (stateUpdates.user !== undefined) {
                component1.current.setUser(stateUpdates.user);
              }
              if (stateUpdates.screen) {
                component1.current.navigate(stateUpdates.screen);
              }
              if (stateUpdates.notification) {
                component1.current.showNotification(
                  stateUpdates.notification.message,
                  stateUpdates.notification.type,
                  stateUpdates.notification.duration
                );
              }
              if (stateUpdates.showLoginDropdown !== undefined) {
                component1.current.setShowLoginDropdown(
                  stateUpdates.showLoginDropdown
                );
              }
              if (stateUpdates.showEnvironmentInfo !== undefined) {
                component1.current.setShowEnvironmentInfo(
                  stateUpdates.showEnvironmentInfo
                );
              }
            });

            // Verify all components received the same state updates
            if (stateUpdates.user !== undefined) {
              expect(component1.current.user).toEqual(stateUpdates.user);
              expect(component2.current.user).toEqual(stateUpdates.user);
              expect(component3.current.user).toEqual(stateUpdates.user);
              expect(component1.current.isAuthenticated).toBe(
                !!stateUpdates.user
              );
              expect(component2.current.isAuthenticated).toBe(
                !!stateUpdates.user
              );
              expect(component3.current.isAuthenticated).toBe(
                !!stateUpdates.user
              );
            }

            if (stateUpdates.screen) {
              expect(component1.current.navigation.activeScreen).toBe(
                stateUpdates.screen
              );
              expect(component2.current.navigation.activeScreen).toBe(
                stateUpdates.screen
              );
              expect(component3.current.navigation.activeScreen).toBe(
                stateUpdates.screen
              );
            }

            if (stateUpdates.notification) {
              expect(component1.current.notification.message).toBe(
                stateUpdates.notification.message
              );
              expect(component2.current.notification.message).toBe(
                stateUpdates.notification.message
              );
              expect(component3.current.notification.message).toBe(
                stateUpdates.notification.message
              );
              expect(component1.current.notification.type).toBe(
                stateUpdates.notification.type
              );
              expect(component2.current.notification.type).toBe(
                stateUpdates.notification.type
              );
              expect(component3.current.notification.type).toBe(
                stateUpdates.notification.type
              );
              expect(component1.current.notification.visible).toBe(true);
              expect(component2.current.notification.visible).toBe(true);
              expect(component3.current.notification.visible).toBe(true);
            }

            if (stateUpdates.showLoginDropdown !== undefined) {
              expect(component1.current.showLoginDropdown).toBe(
                stateUpdates.showLoginDropdown
              );
              expect(component2.current.showLoginDropdown).toBe(
                stateUpdates.showLoginDropdown
              );
              expect(component3.current.showLoginDropdown).toBe(
                stateUpdates.showLoginDropdown
              );
            }

            if (stateUpdates.showEnvironmentInfo !== undefined) {
              expect(component1.current.showEnvironmentInfo).toBe(
                stateUpdates.showEnvironmentInfo
              );
              expect(component2.current.showEnvironmentInfo).toBe(
                stateUpdates.showEnvironmentInfo
              );
              expect(component3.current.showEnvironmentInfo).toBe(
                stateUpdates.showEnvironmentInfo
              );
            }
          }
        ),
        { numRuns: 20 }
      );
    });

    // Feature: phase-1-monolith-separation, Property 3: State Persistence Round Trip
    test("critical state should persist and restore correctly", () => {
      fc.assert(
        fc.property(
          fc.record({
            user: fc.option(
              fc.record({
                id: fc.string({ minLength: 1 }),
                name: fc.string({ minLength: 1 }),
                email: fc.emailAddress(),
                phone: fc.option(fc.string({ minLength: 10, maxLength: 15 }), {
                  nil: undefined,
                }),
              }),
              { nil: null }
            ),
            activeScreen: fc.constantFrom(
              "home",
              "documents",
              "news",
              "regulations",
              "glossary",
              "quiz",
              "pqr",
              "ai-assist",
              "my-profile"
            ),
          }),
          (criticalState) => {
            // Clear any existing persisted state
            localStorage.removeItem("transitia-app-store");

            // Create initial store instance and set critical state
            const { result: initialStore } = renderHook(() => useAppStore());

            act(() => {
              initialStore.current.reset();
              if (criticalState.user !== undefined) {
                initialStore.current.setUser(criticalState.user);
              }
              if (criticalState.activeScreen) {
                initialStore.current.navigate(criticalState.activeScreen);
              }
            });

            // Get the current state after updates
            const stateAfterUpdates = {
              user: initialStore.current.user,
              isAuthenticated: initialStore.current.isAuthenticated,
              activeScreen: initialStore.current.navigation.activeScreen,
            };

            // Simulate app restart by creating a new store instance
            // The persist middleware should restore the state from localStorage
            const { result: restoredStore } = renderHook(() => useAppStore());

            // Wait for persistence to complete (Zustand persist is async)
            act(() => {
              // Force a small delay to allow persistence to complete
              jest.advanceTimersByTime(100);
            });

            // Verify that critical state was persisted and restored correctly
            expect(restoredStore.current.user).toEqual(stateAfterUpdates.user);
            expect(restoredStore.current.isAuthenticated).toBe(
              stateAfterUpdates.isAuthenticated
            );
            expect(restoredStore.current.navigation.activeScreen).toBe(
              stateAfterUpdates.activeScreen
            );

            // Verify that non-critical state was NOT persisted (should be initial values)
            expect(restoredStore.current.notification.visible).toBe(false);
            expect(restoredStore.current.showLoginDropdown).toBe(false);
            expect(restoredStore.current.showEnvironmentInfo).toBe(false);

            // Navigation history should be reset to initial state (not persisted)
            expect(restoredStore.current.navigation.history).toEqual([
              stateAfterUpdates.activeScreen,
            ]);
            expect(restoredStore.current.navigation.canGoBack).toBe(false);
          }
        ),
        { numRuns: 20 }
      );
    });
  });
});
