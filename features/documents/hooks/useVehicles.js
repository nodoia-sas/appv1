import { useState, useEffect, useCallback } from "react";
import { vehiclesService } from "../services/vehiclesService";

/**
 * Custom hook for managing vehicles state and operations
 * @returns {Object} Vehicles state and operations
 */
export const useVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Clear error helper
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Handle errors consistently
  const handleError = useCallback((error) => {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    setError(message);
    console.error("Vehicles hook error:", error);
  }, []);

  // Fetch all vehicles
  const fetchVehicles = useCallback(
    async (options = {}) => {
      setLoading(true);
      setError(null);

      try {
        const fetchedVehicles = await vehiclesService.getVehicles(options);
        setVehicles(fetchedVehicles);
      } catch (error) {
        handleError(error);
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  // Create a new vehicle
  const createVehicle = useCallback(
    async (vehicleData) => {
      setLoading(true);
      setError(null);

      try {
        // Validate vehicle data first
        const validation = vehiclesService.validateVehicleData(vehicleData);
        if (!validation.isValid) {
          throw new Error(validation.errors.join(", "));
        }

        const newVehicle = await vehiclesService.createVehicle(vehicleData);
        setVehicles((prev) => [...prev, newVehicle]);
        return newVehicle;
      } catch (error) {
        handleError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  // Delete a vehicle
  const deleteVehicle = useCallback(
    async (vehicleId) => {
      setLoading(true);
      setError(null);

      try {
        await vehiclesService.deleteVehicle(vehicleId);
        setVehicles((prev) =>
          prev.filter((vehicle) => {
            const id = vehicle.id || vehicle.vehicleId || vehicle._id;
            return id !== vehicleId;
          })
        );
      } catch (error) {
        handleError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  // Get vehicle by ID
  const getVehicleById = useCallback(
    (vehicleId) => {
      return vehicles.find((vehicle) => {
        const id = vehicle.id || vehicle.vehicleId || vehicle._id;
        return id === vehicleId;
      });
    },
    [vehicles]
  );

  // Get vehicle display name
  const getVehicleDisplayName = useCallback((vehicle) => {
    return vehiclesService.getVehicleDisplayName(vehicle);
  }, []);

  // Get vehicle identification display
  const getVehicleIdentificationDisplay = useCallback((vehicle) => {
    return vehiclesService.getVehicleIdentificationDisplay(vehicle);
  }, []);

  // Get vehicle category info
  const getVehicleCategoryInfo = useCallback((categoryId) => {
    return vehiclesService.getVehicleCategoryInfo(categoryId);
  }, []);

  // Find vehicle document by type
  const findVehicleDocumentByType = useCallback((vehicle, documentTypeId) => {
    return vehiclesService.findVehicleDocumentByType(vehicle, documentTypeId);
  }, []);

  // Get vehicles by category
  const getVehiclesByCategory = useCallback(
    (categoryId) => {
      return vehicles.filter((vehicle) => {
        const vehicleCategoryId =
          vehicle.vehicleCategory?.id || vehicle.vehicleCategoryId;
        return vehicleCategoryId === categoryId;
      });
    },
    [vehicles]
  );

  // Get cars (non-motorcycle vehicles)
  const getCars = useCallback(() => {
    return getVehiclesByCategory(vehiclesService.VEHICLE_CATEGORIES.CAR);
  }, [getVehiclesByCategory]);

  // Get motorcycles
  const getMotorcycles = useCallback(() => {
    return getVehiclesByCategory(vehiclesService.VEHICLE_CATEGORIES.MOTORCYCLE);
  }, [getVehiclesByCategory]);

  // Get vehicles with expired documents
  const getVehiclesWithExpiredDocuments = useCallback(() => {
    return vehicles.filter((vehicle) => {
      if (!vehicle.documents || !Array.isArray(vehicle.documents)) {
        return false;
      }

      return vehicle.documents.some((doc) => {
        if (!doc.expirationAt) return false;
        const expiryDate = new Date(doc.expirationAt);
        const now = new Date();
        return expiryDate < now;
      });
    });
  }, [vehicles]);

  // Get vehicles with documents expiring soon
  const getVehiclesWithExpiringSoonDocuments = useCallback(
    (warningDays = 30) => {
      return vehicles.filter((vehicle) => {
        if (!vehicle.documents || !Array.isArray(vehicle.documents)) {
          return false;
        }

        return vehicle.documents.some((doc) => {
          if (!doc.expirationAt) return false;
          const expiryDate = new Date(doc.expirationAt);
          const now = new Date();
          const timeDiff = expiryDate.getTime() - now.getTime();
          const daysUntilExpiry = Math.ceil(timeDiff / (1000 * 3600 * 24));
          return daysUntilExpiry >= 0 && daysUntilExpiry <= warningDays;
        });
      });
    },
    [vehicles]
  );

  // Validate vehicle data
  const validateVehicleData = useCallback((vehicleData) => {
    return vehiclesService.validateVehicleData(vehicleData);
  }, []);

  // Initial load effect
  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  return {
    // State
    vehicles,
    loading,
    error,

    // Actions
    fetchVehicles,
    createVehicle,
    deleteVehicle,
    clearError,

    // Utilities
    getVehicleById,
    getVehicleDisplayName,
    getVehicleIdentificationDisplay,
    getVehicleCategoryInfo,
    findVehicleDocumentByType,
    getVehiclesByCategory,
    getCars,
    getMotorcycles,
    getVehiclesWithExpiredDocuments,
    getVehiclesWithExpiringSoonDocuments,
    validateVehicleData,

    // Constants
    VEHICLE_CATEGORIES: vehiclesService.VEHICLE_CATEGORIES,
    VEHICLE_DOCUMENT_TYPES: vehiclesService.VEHICLE_DOCUMENT_TYPES,
  };
};
