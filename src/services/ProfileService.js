/**
 * ProfileService - Handles user profile management and API synchronization
 *
 * This service encapsulates:
 * - Profile loading and updating logic
 * - API synchronization for profile data
 * - Profile data validation and formatting
 * - Error handling for profile operations
 *
 * Requirements: 6.5, 6.6
 */

class ProfileService {
  constructor() {
    this.profile = {
      name: "Usuario Demo",
      email: "demo@transitia.com",
      phone: "300 123 4567",
      vehicles: [],
    };
    this.isLoading = false;
    this.error = null;
    this.subscribers = new Set();
    this.abortController = null;
  }

  /**
   * Subscribe to profile state changes
   * @param {Function} callback - Function to call when profile state changes
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
          profile: this.profile,
          isLoading: this.isLoading,
          error: this.error,
        });
      } catch (error) {
        console.error("Error in profile subscriber:", error);
      }
    });
  }

  /**
   * Set profile state and notify subscribers
   * @param {Object} profile - Profile data
   * @param {boolean} isLoading - Loading state
   * @param {Error|null} error - Error object if any
   */
  setProfileState(profile, isLoading = false, error = null) {
    if (profile) {
      this.profile = { ...this.profile, ...profile };
    }
    this.isLoading = isLoading;
    this.error = error;
    this._notifySubscribers();
  }

  /**
   * Validate profile data structure
   * @param {Object} profileData - Profile data to validate
   * @returns {Object} Validated and normalized profile data
   */
  validateProfileData(profileData) {
    if (!profileData || typeof profileData !== "object") {
      throw new Error("Profile data must be an object");
    }

    return {
      name: profileData.name || this.profile.name,
      email: profileData.email || this.profile.email,
      phone: profileData.phone || this.profile.phone,
      vehicles: Array.isArray(profileData.vehicles)
        ? profileData.vehicles
        : this.profile.vehicles || [],
    };
  }

  /**
   * Load profile from API
   * @param {Object} user - Auth0 user object
   * @returns {Promise<Object>} Profile data
   */
  async loadProfile(user) {
    if (!user) {
      throw new Error("User is required to load profile");
    }

    // Cancel any existing request
    if (this.abortController) {
      this.abortController.abort();
    }

    this.abortController = new AbortController();
    this.setProfileState(null, true, null);

    try {
      const response = await fetch("/api/profile", {
        signal: this.abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`Failed to load profile: Status ${response.status}`);
      }

      const json = await response.json();
      const profileData = json?.data || json;

      const validatedProfile = this.validateProfileData(profileData);
      this.setProfileState(validatedProfile, false, null);

      return validatedProfile;
    } catch (error) {
      if (error.name === "AbortError") {
        // Request was cancelled, don't update state
        return null;
      }

      this.setProfileState(null, false, error);
      throw error;
    } finally {
      this.abortController = null;
    }
  }

  /**
   * Update profile data via API
   * @param {Object} profileUpdates - Profile data to update
   * @returns {Promise<Object>} Updated profile data
   */
  async updateProfile(profileUpdates) {
    if (!profileUpdates || typeof profileUpdates !== "object") {
      throw new Error("Profile updates must be an object");
    }

    this.setProfileState(null, true, null);

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileUpdates),
      });

      if (!response.ok) {
        throw new Error(`Failed to update profile: Status ${response.status}`);
      }

      const json = await response.json();
      const profileData = json?.data || json;

      const validatedProfile = this.validateProfileData(profileData);
      this.setProfileState(validatedProfile, false, null);

      return validatedProfile;
    } catch (error) {
      this.setProfileState(null, false, error);
      throw error;
    }
  }

  /**
   * Synchronize profile with API (load if not exists, update if changed)
   * @param {Object} user - Auth0 user object
   * @param {Object} localProfile - Local profile data to sync
   * @returns {Promise<Object>} Synchronized profile data
   */
  async syncProfile(user, localProfile = null) {
    if (!user) {
      throw new Error("User is required to sync profile");
    }

    try {
      // First, try to load the current profile from API
      const apiProfile = await this.loadProfile(user);

      // If we have local changes to sync
      if (localProfile && this._hasProfileChanges(apiProfile, localProfile)) {
        return await this.updateProfile(localProfile);
      }

      return apiProfile;
    } catch (error) {
      // If loading fails but we have local profile, use it
      if (localProfile) {
        const validatedProfile = this.validateProfileData(localProfile);
        this.setProfileState(validatedProfile, false, null);
        return validatedProfile;
      }

      throw error;
    }
  }

  /**
   * Check if local profile has changes compared to API profile
   * @param {Object} apiProfile - Profile from API
   * @param {Object} localProfile - Local profile data
   * @returns {boolean} True if there are changes
   * @private
   */
  _hasProfileChanges(apiProfile, localProfile) {
    if (!apiProfile || !localProfile) return false;

    const fields = ["name", "email", "phone"];
    return fields.some((field) => apiProfile[field] !== localProfile[field]);
  }

  /**
   * Get current profile data
   * @returns {Object} Current profile data
   */
  getCurrentProfile() {
    return { ...this.profile };
  }

  /**
   * Check if profile is currently loading
   * @returns {boolean} True if loading
   */
  isProfileLoading() {
    return this.isLoading;
  }

  /**
   * Get current profile error
   * @returns {Error|null} Error object or null if no error
   */
  getProfileError() {
    return this.error;
  }

  /**
   * Clear profile error
   */
  clearError() {
    this.setProfileState(this.profile, this.isLoading, null);
  }

  /**
   * Reset profile to default state
   */
  resetProfile() {
    this.profile = {
      name: "Usuario Demo",
      email: "demo@transitia.com",
      phone: "300 123 4567",
      vehicles: [],
    };
    this.setProfileState(this.profile, false, null);
  }

  /**
   * Cancel any ongoing profile operations
   */
  cancelOperations() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  /**
   * Update profile field locally (without API call)
   * @param {string} field - Field name to update
   * @param {any} value - New value for the field
   */
  updateProfileField(field, value) {
    if (!field || typeof field !== "string") {
      throw new Error("Field name must be a non-empty string");
    }

    const updatedProfile = {
      ...this.profile,
      [field]: value,
    };

    this.setProfileState(updatedProfile, false, null);
  }

  /**
   * Add vehicle to profile
   * @param {Object} vehicle - Vehicle data to add
   */
  addVehicle(vehicle) {
    if (!vehicle || typeof vehicle !== "object") {
      throw new Error("Vehicle must be an object");
    }

    const updatedVehicles = [...(this.profile.vehicles || []), vehicle];
    this.updateProfileField("vehicles", updatedVehicles);
  }

  /**
   * Remove vehicle from profile
   * @param {string} vehicleId - ID of vehicle to remove
   */
  removeVehicle(vehicleId) {
    if (!vehicleId) {
      throw new Error("Vehicle ID is required");
    }

    const updatedVehicles = (this.profile.vehicles || []).filter(
      (vehicle) => vehicle.id !== vehicleId
    );
    this.updateProfileField("vehicles", updatedVehicles);
  }

  /**
   * Update vehicle in profile
   * @param {string} vehicleId - ID of vehicle to update
   * @param {Object} vehicleUpdates - Vehicle data to update
   */
  updateVehicle(vehicleId, vehicleUpdates) {
    if (!vehicleId) {
      throw new Error("Vehicle ID is required");
    }

    if (!vehicleUpdates || typeof vehicleUpdates !== "object") {
      throw new Error("Vehicle updates must be an object");
    }

    const updatedVehicles = (this.profile.vehicles || []).map((vehicle) =>
      vehicle.id === vehicleId ? { ...vehicle, ...vehicleUpdates } : vehicle
    );
    this.updateProfileField("vehicles", updatedVehicles);
  }
}

// Create singleton instance
const profileService = new ProfileService();

export default profileService;
