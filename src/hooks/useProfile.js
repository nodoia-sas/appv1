import { useEffect, useState } from "react";
import { useAppStore } from "../store/appStore";
import profileService from "../services/ProfileService";

/**
 * useProfile Hook - Integrates ProfileService with Zustand store
 *
 * This hook provides a clean interface for components to:
 * - Access profile state and data
 * - Load and update profile data
 * - Handle profile API interactions
 * - Manage profile loading states and errors
 *
 * Requirements: 3.7, 3.8
 */
export const useProfile = () => {
  // Get user and notification actions from Zustand store
  const { user, showNotification } = useAppStore();

  // Local state for ProfileService integration
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Subscribe to ProfileService state changes
  useEffect(() => {
    const unsubscribe = profileService.subscribe((profileState) => {
      // Sync ProfileService state with local state
      setProfile(profileState.profile);
      setIsLoading(profileState.isLoading);
      setError(profileState.error);
    });

    // Initialize with current ProfileService state
    const currentProfile = profileService.getCurrentProfile();
    const currentLoading = profileService.isProfileLoading();
    const currentError = profileService.getProfileError();

    setProfile(currentProfile);
    setIsLoading(currentLoading);
    setError(currentError);

    return unsubscribe;
  }, []);

  // Profile loading action
  const loadProfile = async () => {
    if (!user) {
      const error = new Error("User must be authenticated to load profile");
      setError(error);
      showNotification("Debes iniciar sesión para cargar el perfil", "warning");
      return null;
    }

    try {
      const profileData = await profileService.loadProfile(user);
      if (profileData) {
        showNotification("Perfil cargado exitosamente", "success");
      }
      return profileData;
    } catch (error) {
      setError(error);
      showNotification("Error al cargar el perfil", "error");
      throw error;
    }
  };

  // Profile update action
  const updateProfile = async (profileUpdates) => {
    if (!profileUpdates) {
      const error = new Error("Profile updates are required");
      setError(error);
      showNotification("Los datos del perfil son requeridos", "warning");
      return null;
    }

    try {
      const updatedProfile = await profileService.updateProfile(profileUpdates);
      showNotification("Perfil actualizado exitosamente", "success");
      return updatedProfile;
    } catch (error) {
      setError(error);
      showNotification("Error al actualizar el perfil", "error");
      throw error;
    }
  };

  // Profile synchronization action
  const syncProfile = async (localProfile = null) => {
    if (!user) {
      const error = new Error("User must be authenticated to sync profile");
      setError(error);
      showNotification(
        "Debes iniciar sesión para sincronizar el perfil",
        "warning"
      );
      return null;
    }

    try {
      const syncedProfile = await profileService.syncProfile(
        user,
        localProfile
      );
      if (syncedProfile) {
        showNotification("Perfil sincronizado exitosamente", "success");
      }
      return syncedProfile;
    } catch (error) {
      setError(error);
      showNotification("Error al sincronizar el perfil", "error");
      throw error;
    }
  };

  // Update profile field locally
  const updateProfileField = (field, value) => {
    try {
      profileService.updateProfileField(field, value);
    } catch (error) {
      setError(error);
      showNotification("Error al actualizar el campo del perfil", "error");
    }
  };

  // Vehicle management actions
  const addVehicle = (vehicle) => {
    try {
      profileService.addVehicle(vehicle);
      showNotification("Vehículo agregado exitosamente", "success");
    } catch (error) {
      setError(error);
      showNotification("Error al agregar el vehículo", "error");
    }
  };

  const removeVehicle = (vehicleId) => {
    try {
      profileService.removeVehicle(vehicleId);
      showNotification("Vehículo eliminado exitosamente", "success");
    } catch (error) {
      setError(error);
      showNotification("Error al eliminar el vehículo", "error");
    }
  };

  const updateVehicle = (vehicleId, vehicleUpdates) => {
    try {
      profileService.updateVehicle(vehicleId, vehicleUpdates);
      showNotification("Vehículo actualizado exitosamente", "success");
    } catch (error) {
      setError(error);
      showNotification("Error al actualizar el vehículo", "error");
    }
  };

  // Error management
  const clearError = () => {
    profileService.clearError();
    setError(null);
  };

  // Reset profile
  const resetProfile = () => {
    profileService.resetProfile();
    showNotification("Perfil restablecido", "info");
  };

  // Cancel operations
  const cancelOperations = () => {
    profileService.cancelOperations();
  };

  // Auto-load profile when user changes
  useEffect(() => {
    if (user && !profile) {
      loadProfile().catch(() => {
        // Error already handled in loadProfile
      });
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelOperations();
    };
  }, []);

  return {
    // State
    profile,
    isLoading,
    error,
    hasProfile: !!profile,

    // Actions
    loadProfile,
    updateProfile,
    syncProfile,
    updateProfileField,

    // Vehicle management
    addVehicle,
    removeVehicle,
    updateVehicle,

    // Utility actions
    clearError,
    resetProfile,
    cancelOperations,
  };
};

export default useProfile;
