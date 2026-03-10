import { renderHook, act, waitFor } from "@testing-library/react";
import { useProfile } from "../../src/hooks/useProfile";
import { useAppStore } from "../../src/store/appStore";
import profileService from "../../src/services/ProfileService";

// Mock the ProfileService
jest.mock("../../src/services/ProfileService", () => ({
  subscribe: jest.fn(),
  getCurrentProfile: jest.fn(),
  isProfileLoading: jest.fn(),
  getProfileError: jest.fn(),
  loadProfile: jest.fn(),
  updateProfile: jest.fn(),
  syncProfile: jest.fn(),
  updateProfileField: jest.fn(),
  addVehicle: jest.fn(),
  removeVehicle: jest.fn(),
  updateVehicle: jest.fn(),
  clearError: jest.fn(),
  resetProfile: jest.fn(),
  cancelOperations: jest.fn(),
}));

// Mock the Zustand store
jest.mock("../../src/store/appStore", () => ({
  useAppStore: jest.fn(),
}));

describe("useProfile Hook", () => {
  let mockStoreActions;
  let mockUnsubscribe;
  let mockUser;
  let mockProfile;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock user and profile data
    mockUser = { sub: "user123", name: "Test User", email: "test@example.com" };
    mockProfile = {
      name: "Test User",
      email: "test@example.com",
      phone: "123-456-7890",
      vehicles: [],
    };

    // Mock store actions
    mockStoreActions = {
      showNotification: jest.fn(),
    };

    // Mock store state and actions
    useAppStore.mockReturnValue({
      user: mockUser,
      ...mockStoreActions,
    });

    // Mock ProfileService subscription
    mockUnsubscribe = jest.fn();
    profileService.subscribe.mockReturnValue(mockUnsubscribe);

    // Mock ProfileService initial state
    profileService.getCurrentProfile.mockReturnValue(mockProfile);
    profileService.isProfileLoading.mockReturnValue(false);
    profileService.getProfileError.mockReturnValue(null);
  });

  describe("Initialization", () => {
    it("should subscribe to ProfileService on mount", () => {
      renderHook(() => useProfile());

      expect(profileService.subscribe).toHaveBeenCalledWith(
        expect.any(Function)
      );
    });

    it("should unsubscribe from ProfileService on unmount", () => {
      const { unmount } = renderHook(() => useProfile());

      unmount();

      expect(mockUnsubscribe).toHaveBeenCalled();
    });

    it("should initialize with current ProfileService state", () => {
      const { result } = renderHook(() => useProfile());

      expect(result.current.profile).toBe(mockProfile);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it("should cancel operations on unmount", () => {
      const { unmount } = renderHook(() => useProfile());

      unmount();

      expect(profileService.cancelOperations).toHaveBeenCalled();
    });
  });

  describe("State Management", () => {
    it("should update state when ProfileService state changes", async () => {
      let profileCallback;
      profileService.subscribe.mockImplementation((callback) => {
        profileCallback = callback;
        return mockUnsubscribe;
      });

      const { result } = renderHook(() => useProfile());

      const newProfileState = {
        profile: { ...mockProfile, name: "Updated User" },
        isLoading: true,
        error: new Error("Test error"),
      };

      act(() => {
        profileCallback(newProfileState);
      });

      expect(result.current.profile).toBe(newProfileState.profile);
      expect(result.current.isLoading).toBe(true);
      expect(result.current.error).toBe(newProfileState.error);
    });

    it("should return hasProfile computed value", () => {
      const { result } = renderHook(() => useProfile());

      expect(result.current.hasProfile).toBe(true);
    });

    it("should return false for hasProfile when profile is null", () => {
      profileService.getCurrentProfile.mockReturnValue(null);

      const { result } = renderHook(() => useProfile());

      expect(result.current.hasProfile).toBe(false);
    });
  });

  describe("Profile Loading", () => {
    it("should load profile successfully", async () => {
      const updatedProfile = { ...mockProfile, name: "Loaded User" };
      profileService.loadProfile.mockResolvedValue(updatedProfile);

      const { result } = renderHook(() => useProfile());

      let loadedProfile;
      await act(async () => {
        loadedProfile = await result.current.loadProfile();
      });

      expect(profileService.loadProfile).toHaveBeenCalledWith(mockUser);
      expect(loadedProfile).toBe(updatedProfile);
      expect(mockStoreActions.showNotification).toHaveBeenCalledWith(
        "Perfil cargado exitosamente",
        "success"
      );
    });

    it("should handle load profile without user", async () => {
      useAppStore.mockReturnValue({
        user: null,
        ...mockStoreActions,
      });

      const { result } = renderHook(() => useProfile());

      let loadedProfile;
      await act(async () => {
        loadedProfile = await result.current.loadProfile();
      });

      expect(loadedProfile).toBe(null);
      expect(mockStoreActions.showNotification).toHaveBeenCalledWith(
        "Debes iniciar sesión para cargar el perfil",
        "warning"
      );
    });

    it("should handle load profile errors", async () => {
      const loadError = new Error("Load failed");
      profileService.loadProfile.mockRejectedValue(loadError);

      const { result } = renderHook(() => useProfile());

      await act(async () => {
        try {
          await result.current.loadProfile();
        } catch (error) {
          expect(error).toBe(loadError);
        }
      });

      expect(mockStoreActions.showNotification).toHaveBeenCalledWith(
        "Error al cargar el perfil",
        "error"
      );
    });

    it("should auto-load profile when user is available and profile is null", async () => {
      profileService.getCurrentProfile.mockReturnValue(null);
      profileService.loadProfile.mockResolvedValue(mockProfile);

      renderHook(() => useProfile());

      await waitFor(() => {
        expect(profileService.loadProfile).toHaveBeenCalledWith(mockUser);
      });
    });
  });

  describe("Profile Updates", () => {
    it("should update profile successfully", async () => {
      const profileUpdates = { name: "Updated Name" };
      const updatedProfile = { ...mockProfile, ...profileUpdates };
      profileService.updateProfile.mockResolvedValue(updatedProfile);

      const { result } = renderHook(() => useProfile());

      let resultProfile;
      await act(async () => {
        resultProfile = await result.current.updateProfile(profileUpdates);
      });

      expect(profileService.updateProfile).toHaveBeenCalledWith(profileUpdates);
      expect(resultProfile).toBe(updatedProfile);
      expect(mockStoreActions.showNotification).toHaveBeenCalledWith(
        "Perfil actualizado exitosamente",
        "success"
      );
    });

    it("should handle update profile without data", async () => {
      const { result } = renderHook(() => useProfile());

      let resultProfile;
      await act(async () => {
        resultProfile = await result.current.updateProfile(null);
      });

      expect(resultProfile).toBe(null);
      expect(mockStoreActions.showNotification).toHaveBeenCalledWith(
        "Los datos del perfil son requeridos",
        "warning"
      );
    });

    it("should handle update profile errors", async () => {
      const updateError = new Error("Update failed");
      profileService.updateProfile.mockRejectedValue(updateError);

      const { result } = renderHook(() => useProfile());

      await act(async () => {
        try {
          await result.current.updateProfile({ name: "Test" });
        } catch (error) {
          expect(error).toBe(updateError);
        }
      });

      expect(mockStoreActions.showNotification).toHaveBeenCalledWith(
        "Error al actualizar el perfil",
        "error"
      );
    });
  });

  describe("Profile Synchronization", () => {
    it("should sync profile successfully", async () => {
      const localProfile = { name: "Local User" };
      const syncedProfile = { ...mockProfile, name: "Synced User" };
      profileService.syncProfile.mockResolvedValue(syncedProfile);

      const { result } = renderHook(() => useProfile());

      let resultProfile;
      await act(async () => {
        resultProfile = await result.current.syncProfile(localProfile);
      });

      expect(profileService.syncProfile).toHaveBeenCalledWith(
        mockUser,
        localProfile
      );
      expect(resultProfile).toBe(syncedProfile);
      expect(mockStoreActions.showNotification).toHaveBeenCalledWith(
        "Perfil sincronizado exitosamente",
        "success"
      );
    });

    it("should handle sync profile without user", async () => {
      useAppStore.mockReturnValue({
        user: null,
        ...mockStoreActions,
      });

      const { result } = renderHook(() => useProfile());

      let resultProfile;
      await act(async () => {
        resultProfile = await result.current.syncProfile();
      });

      expect(resultProfile).toBe(null);
      expect(mockStoreActions.showNotification).toHaveBeenCalledWith(
        "Debes iniciar sesión para sincronizar el perfil",
        "warning"
      );
    });

    it("should handle sync profile errors", async () => {
      const syncError = new Error("Sync failed");
      profileService.syncProfile.mockRejectedValue(syncError);

      const { result } = renderHook(() => useProfile());

      await act(async () => {
        try {
          await result.current.syncProfile();
        } catch (error) {
          expect(error).toBe(syncError);
        }
      });

      expect(mockStoreActions.showNotification).toHaveBeenCalledWith(
        "Error al sincronizar el perfil",
        "error"
      );
    });
  });

  describe("Profile Field Updates", () => {
    it("should update profile field successfully", () => {
      const { result } = renderHook(() => useProfile());

      act(() => {
        result.current.updateProfileField("name", "New Name");
      });

      expect(profileService.updateProfileField).toHaveBeenCalledWith(
        "name",
        "New Name"
      );
    });

    it("should handle update profile field errors", () => {
      const fieldError = new Error("Field update failed");
      profileService.updateProfileField.mockImplementation(() => {
        throw fieldError;
      });

      const { result } = renderHook(() => useProfile());

      act(() => {
        result.current.updateProfileField("name", "New Name");
      });

      expect(mockStoreActions.showNotification).toHaveBeenCalledWith(
        "Error al actualizar el campo del perfil",
        "error"
      );
    });
  });

  describe("Vehicle Management", () => {
    it("should add vehicle successfully", () => {
      const vehicle = { id: "v1", plate: "ABC123", type: "car" };

      const { result } = renderHook(() => useProfile());

      act(() => {
        result.current.addVehicle(vehicle);
      });

      expect(profileService.addVehicle).toHaveBeenCalledWith(vehicle);
      expect(mockStoreActions.showNotification).toHaveBeenCalledWith(
        "Vehículo agregado exitosamente",
        "success"
      );
    });

    it("should handle add vehicle errors", () => {
      const vehicleError = new Error("Add vehicle failed");
      profileService.addVehicle.mockImplementation(() => {
        throw vehicleError;
      });

      const { result } = renderHook(() => useProfile());

      act(() => {
        result.current.addVehicle({ id: "v1" });
      });

      expect(mockStoreActions.showNotification).toHaveBeenCalledWith(
        "Error al agregar el vehículo",
        "error"
      );
    });

    it("should remove vehicle successfully", () => {
      const vehicleId = "v1";

      const { result } = renderHook(() => useProfile());

      act(() => {
        result.current.removeVehicle(vehicleId);
      });

      expect(profileService.removeVehicle).toHaveBeenCalledWith(vehicleId);
      expect(mockStoreActions.showNotification).toHaveBeenCalledWith(
        "Vehículo eliminado exitosamente",
        "success"
      );
    });

    it("should handle remove vehicle errors", () => {
      const vehicleError = new Error("Remove vehicle failed");
      profileService.removeVehicle.mockImplementation(() => {
        throw vehicleError;
      });

      const { result } = renderHook(() => useProfile());

      act(() => {
        result.current.removeVehicle("v1");
      });

      expect(mockStoreActions.showNotification).toHaveBeenCalledWith(
        "Error al eliminar el vehículo",
        "error"
      );
    });

    it("should update vehicle successfully", () => {
      const vehicleId = "v1";
      const vehicleUpdates = { plate: "XYZ789" };

      const { result } = renderHook(() => useProfile());

      act(() => {
        result.current.updateVehicle(vehicleId, vehicleUpdates);
      });

      expect(profileService.updateVehicle).toHaveBeenCalledWith(
        vehicleId,
        vehicleUpdates
      );
      expect(mockStoreActions.showNotification).toHaveBeenCalledWith(
        "Vehículo actualizado exitosamente",
        "success"
      );
    });

    it("should handle update vehicle errors", () => {
      const vehicleError = new Error("Update vehicle failed");
      profileService.updateVehicle.mockImplementation(() => {
        throw vehicleError;
      });

      const { result } = renderHook(() => useProfile());

      act(() => {
        result.current.updateVehicle("v1", { plate: "XYZ789" });
      });

      expect(mockStoreActions.showNotification).toHaveBeenCalledWith(
        "Error al actualizar el vehículo",
        "error"
      );
    });
  });

  describe("Utility Actions", () => {
    it("should clear error successfully", () => {
      const { result } = renderHook(() => useProfile());

      act(() => {
        result.current.clearError();
      });

      expect(profileService.clearError).toHaveBeenCalled();
    });

    it("should reset profile successfully", () => {
      const { result } = renderHook(() => useProfile());

      act(() => {
        result.current.resetProfile();
      });

      expect(profileService.resetProfile).toHaveBeenCalled();
      expect(mockStoreActions.showNotification).toHaveBeenCalledWith(
        "Perfil restablecido",
        "info"
      );
    });

    it("should cancel operations successfully", () => {
      const { result } = renderHook(() => useProfile());

      act(() => {
        result.current.cancelOperations();
      });

      expect(profileService.cancelOperations).toHaveBeenCalled();
    });
  });

  describe("Integration Requirements", () => {
    it("should integrate with ProfileService for data management (Requirement 3.7)", () => {
      const { result } = renderHook(() => useProfile());

      // Verify integration with ProfileService
      expect(profileService.subscribe).toHaveBeenCalled();
      expect(profileService.getCurrentProfile).toHaveBeenCalled();
      expect(profileService.isProfileLoading).toHaveBeenCalled();
      expect(profileService.getProfileError).toHaveBeenCalled();

      // Verify hook provides expected interface for data management
      expect(result.current).toHaveProperty("profile");
      expect(result.current).toHaveProperty("isLoading");
      expect(result.current).toHaveProperty("error");
      expect(result.current).toHaveProperty("hasProfile");
      expect(result.current).toHaveProperty("loadProfile");
      expect(result.current).toHaveProperty("updateProfile");
      expect(result.current).toHaveProperty("syncProfile");
      expect(result.current).toHaveProperty("updateProfileField");
    });

    it("should handle profile loading and API interactions (Requirement 3.8)", () => {
      const { result } = renderHook(() => useProfile());

      // Verify profile loading capabilities
      expect(typeof result.current.loadProfile).toBe("function");
      expect(typeof result.current.updateProfile).toBe("function");
      expect(typeof result.current.syncProfile).toBe("function");

      // Verify API interaction handling
      expect(typeof result.current.addVehicle).toBe("function");
      expect(typeof result.current.removeVehicle).toBe("function");
      expect(typeof result.current.updateVehicle).toBe("function");

      // Verify utility functions for API interactions
      expect(typeof result.current.clearError).toBe("function");
      expect(typeof result.current.resetProfile).toBe("function");
      expect(typeof result.current.cancelOperations).toBe("function");
    });
  });
});
