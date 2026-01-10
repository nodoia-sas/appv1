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
          const newHistory = [...state.navigation.history, screen];
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
          const newHistory = state.navigation.history.slice(0, -1);
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
          return localStorage;
        } catch (error) {
          console.warn("localStorage not available, using memory storage");
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
      }),
      // Only persist critical state
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        navigation: {
          activeScreen: state.navigation.activeScreen,
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
