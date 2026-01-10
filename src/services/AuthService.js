/**
 * AuthService - Handles all authentication logic and Auth0 integration
 *
 * This service encapsulates:
 * - Auth0 token validation
 * - User management and state
 * - Authentication flow handling
 * - Profile synchronization with backend API
 */

class AuthService {
  constructor() {
    this.user = null;
    this.isAuthenticated = false;
    this.isLoading = false;
    this.error = null;
    this.subscribers = new Set();
  }

  /**
   * Subscribe to authentication state changes
   * @param {Function} callback - Function to call when auth state changes
   * @returns {Function} Unsubscribe function
   */
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  /**
   * Notify all subscribers of state changes
   * @private
   */
  _notifySubscribers() {
    this.subscribers.forEach((callback) => {
      try {
        callback({
          user: this.user,
          isAuthenticated: this.isAuthenticated,
          isLoading: this.isLoading,
          error: this.error,
        });
      } catch (error) {
        console.error("Error in auth subscriber:", error);
      }
    });
  }

  /**
   * Set authentication state
   * @param {Object} user - User object from Auth0
   * @param {boolean} isLoading - Loading state
   * @param {Error|null} error - Error object if any
   */
  setAuthState(user, isLoading = false, error = null) {
    this.user = user;
    this.isAuthenticated = Boolean(user);
    this.isLoading = isLoading;
    this.error = error;
    this._notifySubscribers();
  }

  /**
   * Validate current Auth0 token
   * @returns {Promise<boolean>} True if token is valid
   */
  async validateToken() {
    try {
      this.setAuthState(this.user, true);

      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const userData = await response.json();
        this.setAuthState(userData);
        return true;
      } else {
        this.setAuthState(null, false, new Error("Token validation failed"));
        return false;
      }
    } catch (error) {
      this.setAuthState(null, false, error);
      return false;
    }
  }

  /**
   * Initialize authentication state from Auth0
   * @param {Object} auth0User - User object from useUser hook
   * @param {boolean} isLoading - Loading state from useUser hook
   * @param {Error|null} error - Error from useUser hook
   */
  initializeAuth(auth0User, isLoading, error) {
    this.setAuthState(auth0User, isLoading, error);
  }

  /**
   * Handle login redirect
   * Redirects to Auth0 login page
   */
  login() {
    try {
      if (typeof window !== "undefined") {
        window.location.href = "/api/auth/login";
      }
    } catch (error) {
      console.error("Error redirecting to login:", error);
      this.setAuthState(this.user, false, error);
    }
  }

  /**
   * Handle logout
   * Redirects to Auth0 logout endpoint
   */
  logout() {
    try {
      if (typeof window !== "undefined") {
        window.location.href = "/api/auth/logout";
      }
    } catch (error) {
      console.error("Error redirecting to logout:", error);
      this.setAuthState(this.user, false, error);
    }
  }

  /**
   * Get user ID from Auth0 user object
   * @returns {string|null} User ID or null if not authenticated
   */
  getUserId() {
    return this.user?.sub || null;
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} True if user is authenticated
   */
  isUserAuthenticated() {
    return this.isAuthenticated;
  }

  /**
   * Get current user object
   * @returns {Object|null} User object or null if not authenticated
   */
  getCurrentUser() {
    return this.user;
  }

  /**
   * Check if authentication is in loading state
   * @returns {boolean} True if loading
   */
  isAuthLoading() {
    return this.isLoading;
  }

  /**
   * Get current authentication error
   * @returns {Error|null} Error object or null if no error
   */
  getAuthError() {
    return this.error;
  }

  /**
   * Require authentication for protected routes
   * @param {Function} onUnauthenticated - Callback for unauthenticated users
   * @returns {boolean} True if authenticated, false otherwise
   */
  requireAuth(onUnauthenticated) {
    if (!this.isAuthenticated) {
      if (onUnauthenticated) {
        onUnauthenticated();
      } else {
        this.login();
      }
      return false;
    }
    return true;
  }

  /**
   * Handle authentication requirement for navigation
   * @param {string} screen - Target screen
   * @param {Function} showNotification - Notification function
   * @returns {boolean} True if navigation should proceed
   */
  handleNavAuth(screen, showNotification) {
    if (screen !== "home" && !this.isAuthenticated) {
      if (showNotification) {
        showNotification(
          "Debes iniciar sesión para acceder a esta sección",
          "info"
        );
      }
      this.login();
      return false;
    }
    return true;
  }

  /**
   * Clear authentication state (for testing or manual reset)
   */
  clearAuth() {
    this.setAuthState(null, false, null);
  }
}

// Create singleton instance
const authService = new AuthService();

export default authService;
