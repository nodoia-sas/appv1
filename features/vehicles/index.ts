/**
 * Vehicles Feature - Barrel Export
 *
 * This file exposes the public API for the vehicles feature.
 * It provides a clean interface for importing vehicles-related functionality
 * while hiding internal implementation details.
 */

// Components - UI components for vehicles management
export { Vehicles } from "./components/Vehicles";
export { VehicleCard } from "./components/VehicleCard";
export { VehicleForm } from "./components/VehicleForm";

// Hooks - Custom React hooks for vehicles state management and operations
export { useVehicles } from "./hooks/useVehicles";
export { useVehicleRegistration } from "./hooks/useVehicleRegistration";
export { useVehicleDocuments } from "./hooks/useVehicleDocuments";

// Services - Business logic and API communication
export { vehiclesService } from "./services/vehiclesService";

// Types - TypeScript type definitions and interfaces
export type {
  VehicleData,
  BaseVehicle,
  CreateVehicleRequest,
  UpdateVehicleRequest,
  VehicleValidationResult,
  VehicleCategory,
  VehicleCategoryInfo,
  VehicleDocument,
  VehicleDocumentStatus,
  VehicleDocumentExpiryInfo,
  VehicleFilterOptions,
  VehicleSearchOptions,

  // Hook state types
  VehiclesHookState,
  VehicleRegistrationHookState,
  VehicleDocumentsHookState,

  // Form types
  VehicleFormData,
  VehicleDocumentFormData,

  // Component prop types
  VehicleCardProps,
  VehicleFormProps,
  VehiclesListProps,
  VehicleDocumentCardProps,

  // API types
  VehicleApiResponse,
  VehicleListResponse,
  MessageObject,
} from "./types";

// Constants and utilities
export {
  VEHICLE_CATEGORIES,
  VEHICLE_DOCUMENT_TYPES,
  VEHICLE_DOCUMENT_STATUS,
  isValidVehicleCategory,
  isValidVehicleDocumentType,
  hasVehicleId,
  isVehicleDocument,
  getVehicleId,
  getVehicleDisplayName,
  getVehicleIdentificationDisplay,
  getVehicleCategoryIcon,
  getVehicleCategoryName,
  getVehicleDocumentTypeName,
} from "./types";

// Feature metadata
export const VEHICLES_FEATURE_NAME = "vehicles";
export const VEHICLES_FEATURE_VERSION = "1.0.0";

// Feature configuration
export const vehiclesFeatureConfig = {
  name: VEHICLES_FEATURE_NAME,
  version: VEHICLES_FEATURE_VERSION,
  description: "Vehicle management and documentation feature",
  dependencies: ["shared"],
};
