import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Initial state
const initialState = {
  // Auth state
  user: null,
  isAuthenticated: false,
  isLoading: false,

  // Navigation state
  navigation: {
    activeScreen: "home",
    history: ["home"],
    canGoBack: false,
  },

  // Notification state
  notification: {
    message: "",
    type: "info",
    visible: false,
    duration: 3000,
  },

  // UI state
  showLoginDropdown: false,
  showEnvironmentInfo: false,
};

// Create the store with persistence for critical state
export const useAppStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      // Auth actions
      setUser: (user) =>
        set((state) => ({
          user,
          isAuthenticated: !!user,
          isLoading: false,
        })),

      setLoading: (isLoading) => set({ isLoading }),

      logout: () =>
        set((state) => ({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          showLoginDropdown: false,
        })),

      // Navigation actions
      navigate: (screen) =>
        set((state) => {
          // Ensure history is always an array (handle persistence edge cases)
          const currentHistory = Array.isArray(state.navigation.history)
            ? state.navigation.history
            : [state.navigation.activeScreen];
          const newHistory = [...currentHistory, screen];
          return {
            navigation: {
              activeScreen: screen,
              history: newHistory,
              canGoBack: newHistory.length > 1,
            },
          };
        }),

      goBack: () =>
        set((state) => {
          // Ensure history is always an array (handle persistence edge cases)
          const currentHistory = Array.isArray(state.navigation.history)
            ? state.navigation.history
            : [state.navigation.activeScreen];
          const newHistory = currentHistory.slice(0, -1);
          const previousScreen = newHistory[newHistory.length - 1] || "home";
          return {
            navigation: {
              activeScreen: previousScreen,
              history: newHistory,
              canGoBack: newHistory.length > 1,
            },
          };
        }),

      // Notification actions
      showNotification: (message, type = "info", duration = 3000) =>
        set({
          notification: {
            message,
            type,
            visible: true,
            duration,
          },
        }),

      hideNotification: () =>
        set((state) => ({
          notification: {
            ...state.notification,
            visible: false,
          },
        })),

      // UI actions
      toggleLoginDropdown: () =>
        set((state) => ({
          showLoginDropdown: !state.showLoginDropdown,
        })),

      setShowLoginDropdown: (show) => set({ showLoginDropdown: show }),

      toggleEnvironmentInfo: () =>
        set((state) => ({
          showEnvironmentInfo: !state.showEnvironmentInfo,
        })),

      setShowEnvironmentInfo: (show) => set({ showEnvironmentInfo: show }),

      // Reset store to initial state
      reset: () => set(initialState),
    }),
    {
      name: "transitia-app-store",
      storage: createJSONStorage(() => {
        // Gracefully handle localStorage unavailability
        try {
          // Test if localStorage is available and working
          const testKey = "__transitia_storage_test__";
          localStorage.setItem(testKey, "test");
          localStorage.removeItem(testKey);
          return localStorage;
        } catch (error) {
          console.warn(
            "localStorage not available, using memory storage:",
            error.message
          );
          // Return a memory-based storage fallback
          const memoryStorage = new Map();
          return {
            getItem: (key) => {
              const value = memoryStorage.get(key);
              return value !== undefined ? value : null;
            },
            setItem: (key, value) => {
              memoryStorage.set(key, value);
            },
            removeItem: (key) => {
              memoryStorage.delete(key);
            },
          };
        }
      }),
      // Only persist critical state (user and navigation)
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        navigation: {
          activeScreen: state.navigation.activeScreen,
          // Include a minimal history to avoid undefined issues
          history: [state.navigation.activeScreen],
          canGoBack: false, // Reset canGoBack on reload for better UX
        },
      }),
    }
  )
);

// Selectors for better performance
export const selectUser = (state) => state.user;
export const selectIsAuthenticated = (state) => state.isAuthenticated;
export const selectIsLoading = (state) => state.isLoading;
export const selectActiveScreen = (state) => state.navigation.activeScreen;
export const selectCanGoBack = (state) => state.navigation.canGoBack;
export const selectNotification = (state) => state.notification;
export const selectShowLoginDropdown = (state) => state.showLoginDropdown;
export const selectShowEnvironmentInfo = (state) => state.showEnvironmentInfo;
