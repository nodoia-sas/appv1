/**
 * Vehicles Service
 * Encapsulates all API calls and business logic for vehicle operations
 */

/**
 * Fetches all vehicles for the current user
 * @param {Object} [options] - Query options
 * @param {string} [options.query] - Additional query parameters
 * @returns {Promise<Array>} Array of vehicle objects
 */
export const getVehicles = async (options = {}) => {
  try {
    const { query = "" } = options;
    const url = `/api/hooks/vehicles/list${query ? `?${query}` : ""}`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      throw new Error(
        `Failed to fetch vehicles (${response.status}): ${errorText}`
      );
    }

    const data = await response.json().catch(() => null);
    const vehicles = data?.data ?? data ?? [];

    return Array.isArray(vehicles) ? vehicles : [];
  } catch (error) {
    console.error("getVehicles failed:", error);
    throw new Error(`Error fetching vehicles: ${error.message}`);
  }
};

/**
 * Creates a new vehicle
 * @param {Object} vehicleData - Vehicle data
 * @param {string} vehicleData.vehicleCategoryId - Vehicle category ID
 * @param {string} vehicleData.name - Vehicle name
 * @param {string} vehicleData.identification - Vehicle identification (last 2 digits of plate)
 * @param {number} vehicleData.model - Vehicle model year
 * @param {string} vehicleData.brand - Vehicle brand
 * @param {string} vehicleData.line - Vehicle line
 * @returns {Promise<Object>} Created vehicle object
 */
export const createVehicle = async (vehicleData) => {
  try {
    const { vehicleCategoryId, name, identification, model, brand, line } =
      vehicleData;

    if (!vehicleCategoryId) {
      throw new Error("Vehicle category ID is required");
    }

    const payload = {
      vehicleCategoryId,
      name: name || "Sin nombre",
      identification: identification || "",
      model: model ? Number(model) : 0,
      brand: brand || "",
      line: line || "",
    };

    const response = await fetch("/api/hooks/vehicles/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      throw new Error(
        `Failed to create vehicle (${response.status}): ${errorText}`
      );
    }

    const data = await response.json().catch(() => null);
    return data;
  } catch (error) {
    console.error("createVehicle failed:", error);
    throw new Error(`Error creating vehicle: ${error.message}`);
  }
};

/**
 * Deletes a vehicle
 * @param {string} vehicleId - Vehicle ID
 * @returns {Promise<void>}
 */
export const deleteVehicle = async (vehicleId) => {
  try {
    if (!vehicleId) {
      throw new Error("Vehicle ID is required");
    }

    const response = await fetch(
      `/api/hooks/vehicles/delete?id=${encodeURIComponent(vehicleId)}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      throw new Error(
        `Failed to delete vehicle (${response.status}): ${errorText}`
      );
    }

    return;
  } catch (error) {
    console.error("deleteVehicle failed:", error);
    throw new Error(`Error deleting vehicle: ${error.message}`);
  }
};

/**
 * Validates vehicle data before submission
 * @param {Object} vehicleData - Vehicle data to validate
 * @returns {Object} Validation result with isValid boolean and errors array
 */
export const validateVehicleData = (vehicleData) => {
  const errors = [];
  const { vehicleCategoryId, identification, model } = vehicleData;

  if (!vehicleCategoryId) {
    errors.push("Vehicle category is required");
  }

  if (identification && !/^[0-9]{2}$/.test(identification)) {
    errors.push("Vehicle identification must be exactly 2 digits");
  }

  if (
    model &&
    (isNaN(model) || model < 1900 || model > new Date().getFullYear() + 1)
  ) {
    errors.push("Vehicle model year must be a valid year");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Gets vehicle category information
 * @param {string} categoryId - Vehicle category ID
 * @returns {Object} Vehicle category information
 */
export const getVehicleCategoryInfo = (categoryId) => {
  const categories = {
    "8cea5918-63d0-4037-a14f-09d066b5a336": {
      name: "Carro / Camioneta",
      icon: "🚗",
      documentTypes: [1, 2, 3], // SOAT, Tarjeta de Propiedad, Técnico Mecánica
    },
    "9cbb096b-a2ef-40b2-bed4-9e5c398c1ef5": {
      name: "Motocicleta",
      icon: "🏍️",
      documentTypes: [1, 2, 3], // SOAT, Tarjeta de Propiedad, Técnico Mecánica
    },
  };

  return (
    categories[categoryId] || {
      name: "Unknown",
      icon: "🚗",
      documentTypes: [],
    }
  );
};

/**
 * Gets vehicle display name
 * @param {Object} vehicle - Vehicle object
 * @returns {string} Formatted vehicle display name
 */
export const getVehicleDisplayName = (vehicle) => {
  if (vehicle.name) {
    return vehicle.name;
  }

  const parts = [vehicle.brand, vehicle.line, vehicle.model].filter(Boolean);
  return parts.length > 0 ? parts.join(" ") : "Vehículo sin nombre";
};

/**
 * Gets vehicle identification display
 * @param {Object} vehicle - Vehicle object
 * @returns {string} Formatted vehicle identification
 */
export const getVehicleIdentificationDisplay = (vehicle) => {
  const identification = vehicle.identification || vehicle.license || "";
  return identification ? `••••${identification}` : "Sin placa";
};

/**
 * Finds a document by type in vehicle documents
 * @param {Object} vehicle - Vehicle object
 * @param {number} documentTypeId - Document type ID
 * @returns {Object|null} Document object or null if not found
 */
export const findVehicleDocumentByType = (vehicle, documentTypeId) => {
  if (!vehicle.documents || !Array.isArray(vehicle.documents)) {
    return null;
  }

  return vehicle.documents.find((doc) => doc.type == documentTypeId) || null;
};

// Vehicle category constants
export const VEHICLE_CATEGORIES = {
  CAR: "8cea5918-63d0-4037-a14f-09d066b5a336",
  MOTORCYCLE: "9cbb096b-a2ef-40b2-bed4-9e5c398c1ef5",
};

// Document type constants for vehicles
export const VEHICLE_DOCUMENT_TYPES = {
  SOAT: 1,
  PROPERTY_CARD: 2,
  TECHNICAL_INSPECTION: 3,
};

// Default export with all service functions
export const vehiclesService = {
  getVehicles,
  createVehicle,
  deleteVehicle,
  validateVehicleData,
  getVehicleCategoryInfo,
  getVehicleDisplayName,
  getVehicleIdentificationDisplay,
  findVehicleDocumentByType,
  VEHICLE_CATEGORIES,
  VEHICLE_DOCUMENT_TYPES,
};
