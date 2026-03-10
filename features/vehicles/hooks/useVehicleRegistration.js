import { useState, useCallback } from "react";
import { vehiclesService } from "../services/vehiclesService";

/**
 * Custom hook for vehicle registration operations
 * @returns {Object} Vehicle registration state and operations
 */
export const useVehicleRegistration = () => {
  const [registering, setRegistering] = useState(false);
  const [registrationError, setRegistrationError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Clear errors
  const clearErrors = useCallback(() => {
    setRegistrationError(null);
    setValidationErrors({});
  }, []);

  // Handle registration error
  const handleRegistrationError = useCallback((error) => {
    const message =
      error instanceof Error ? error.message : "Registration failed";
    setRegistrationError(message);
    console.error("Vehicle registration error:", error);
  }, []);

  // Validate vehicle form data
  const validateVehicleForm = useCallback((formData) => {
    const errors = {};
    const { vehicleCategoryId, name, identification, model, brand, line } =
      formData;

    // Required field validations
    if (!vehicleCategoryId) {
      errors.vehicleCategoryId = "Vehicle category is required";
    }

    if (!name || name.trim().length === 0) {
      errors.name = "Vehicle name is required";
    }

    // Identification validation (last 2 digits of plate)
    if (identification && !/^[0-9]{2}$/.test(identification)) {
      errors.identification = "Must be exactly 2 digits";
    }

    // Model year validation
    if (model) {
      const modelYear = parseInt(model, 10);
      const currentYear = new Date().getFullYear();
      if (isNaN(modelYear) || modelYear < 1900 || modelYear > currentYear + 1) {
        errors.model = `Model year must be between 1900 and ${currentYear + 1}`;
      }
    }

    // Brand validation
    if (brand && brand.trim().length > 50) {
      errors.brand = "Brand name is too long (max 50 characters)";
    }

    // Line validation
    if (line && line.trim().length > 50) {
      errors.line = "Line name is too long (max 50 characters)";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, []);

  // Register a new vehicle
  const registerVehicle = useCallback(
    async (vehicleData) => {
      setRegistering(true);
      setRegistrationError(null);
      setValidationErrors({});

      try {
        // Client-side validation
        const isFormValid = validateVehicleForm(vehicleData);
        if (!isFormValid) {
          throw new Error("Please fix the validation errors");
        }

        // Server-side validation
        const validation = vehiclesService.validateVehicleData(vehicleData);
        if (!validation.isValid) {
          throw new Error(validation.errors.join(", "));
        }

        // Create the vehicle
        const newVehicle = await vehiclesService.createVehicle(vehicleData);

        // Clear any previous errors on success
        clearErrors();

        return newVehicle;
      } catch (error) {
        handleRegistrationError(error);
        throw error;
      } finally {
        setRegistering(false);
      }
    },
    [validateVehicleForm, clearErrors, handleRegistrationError]
  );

  // Get vehicle category options
  const getVehicleCategoryOptions = useCallback(() => {
    return [
      {
        id: vehiclesService.VEHICLE_CATEGORIES.CAR,
        name: "Carro / Camioneta",
        icon: "🚗",
      },
      {
        id: vehiclesService.VEHICLE_CATEGORIES.MOTORCYCLE,
        name: "Motocicleta",
        icon: "🏍️",
      },
    ];
  }, []);

  // Get default form data
  const getDefaultFormData = useCallback(() => {
    return {
      vehicleCategoryId: vehiclesService.VEHICLE_CATEGORIES.CAR,
      name: "",
      identification: "",
      model: "",
      brand: "",
      line: "",
    };
  }, []);

  // Check if form has validation errors
  const hasValidationErrors = Object.keys(validationErrors).length > 0;

  return {
    // State
    registering,
    registrationError,
    validationErrors,
    hasValidationErrors,

    // Actions
    registerVehicle,
    validateVehicleForm,
    clearErrors,

    // Utilities
    getVehicleCategoryOptions,
    getDefaultFormData,

    // Constants
    VEHICLE_CATEGORIES: vehiclesService.VEHICLE_CATEGORIES,
  };
};
