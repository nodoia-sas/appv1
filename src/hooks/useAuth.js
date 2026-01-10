import { useEffect, useState } from "react";
import { useAppStore } from "../store/appStore";
import authService from "../services/AuthService";

/**
 * useAuth Hook - Integrates AuthService with Zustand store
 *
 * This hook provides a clean interface for components to:
 * - Access authentication state
 * - Perform authentication actions (login, logout)
 * - Handle authentication requirements for protected routes
 *
 * Requirements: 3.1, 3.2
 */
export const useAuth = () => {
  // Get auth state and actions from Zustand store
  const {
    user,
    isAuthenticated,
    isLoading,
    setUser,
    setLoading,
    logout: storeLogout,
    showNotification,
  } = useAppStore();

  // Local state for AuthService integration
  const [authError, setAuthError] = useState(null);

  // Subscribe to AuthService state changes
  useEffect(() => {
    const unsubscribe = authService.subscribe((authState) => {
      // Sync AuthService state with Zustand store
      setUser(authState.user);
      setLoading(authState.isLoading);
      setAuthError(authState.error);
    });

    // Initialize with current AuthService state
    const currentUser = authService.getCurrentUser();
    const currentLoading = authService.isAuthLoading();
    const currentError = authService.getAuthError();

    if (currentUser !== user || currentLoading !== isLoading) {
      setUser(currentUser);
      setLoading(currentLoading);
      setAuthError(currentError);
    }

    return unsubscribe;
  }, [setUser, setLoading, user, isLoading]);

  // Authentication actions
  const login = () => {
    try {
      authService.login();
    } catch (error) {
      setAuthError(error);
      showNotification("Error al iniciar sesión", "error");
    }
  };

  const logout = () => {
    try {
      // Clear Zustand store first
      storeLogout();
      // Then clear AuthService
      authService.clearAuth();
      // Finally redirect to Auth0 logout
      authService.logout();
    } catch (error) {
      setAuthError(error);
      showNotification("Error al cerrar sesión", "error");
    }
  };

  const validateToken = async () => {
    try {
      const isValid = await authService.validateToken();
      if (!isValid && authError) {
        showNotification(
          "Sesión expirada, por favor inicia sesión nuevamente",
          "warning"
        );
      }
      return isValid;
    } catch (error) {
      setAuthError(error);
      showNotification("Error al validar la sesión", "error");
      return false;
    }
  };

  const requireAuth = (onUnauthenticated) => {
    return authService.requireAuth(onUnauthenticated);
  };

  const handleNavAuth = (screen) => {
    return authService.handleNavAuth(screen, showNotification);
  };

  const initializeAuth = (auth0User, auth0Loading, auth0Error) => {
    authService.initializeAuth(auth0User, auth0Loading, auth0Error);
  };

  // Computed values
  const userId = authService.getUserId();

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error: authError,
    userId,

    // Actions
    login,
    logout,
    validateToken,
    requireAuth,
    handleNavAuth,
    initializeAuth,
  };
};

export default useAuth;
