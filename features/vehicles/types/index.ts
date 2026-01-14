/**
 * TypeScript type definitions for the Vehicles feature
 */

// Vehicle category interface
export interface VehicleCategory {
  id: string;
  name: string;
}

// Base vehicle interface
export interface BaseVehicle {
  id?: string;
  vehicleId?: string;
  _id?: string;
  name?: string;
  displayName?: string;
  identification?: string;
  license?: string;
  model?: number;
  brand?: string;
  line?: string;
  vehicleCategory?: VehicleCategory;
  vehicleCategoryId?: string;
  vehicleCategoryName?: string;
  documents?: VehicleDocument[];
  createdAt?: string;
  updatedAt?: string;
}

// Vehicle data interface (for API responses)
export interface VehicleData extends BaseVehicle {
  // Additional fields that might come from API
  [key: string]: any;
}

// Vehicle creation request
export interface CreateVehicleRequest {
  vehicleCategoryId: string;
  name: string;
  identification: string;
  model?: number;
  brand?: string;
  line?: string;
}

// Vehicle update request
export interface UpdateVehicleRequest {
  name?: string;
  identification?: string;
  model?: number;
  brand?: string;
  line?: string;
}

// Vehicle validation result
export interface VehicleValidationResult {
  isValid: boolean;
  errors: string[];
}

// Vehicle category information
export interface VehicleCategoryInfo {
  name: string;
  icon: string;
  documentTypes: number[];
}

// Vehicle document interface
export interface VehicleDocument {
  id: string;
  name: string;
  type: number;
  vehicleId: string;
  createdAt: string;
  updatedAt: string;
  path?: string;
  url?: string;
  expirationAt?: string;
  description?: string;
}

// Vehicle document status
export interface VehicleDocumentStatus {
  status: "missing" | "expired" | "expiring" | "valid";
  message: string;
}

// Vehicle document expiry info
export interface VehicleDocumentExpiryInfo {
  isExpired: boolean;
  isExpiringSoon: boolean;
  daysUntilExpiry: number | null;
}

// Vehicle filter options
export interface VehicleFilterOptions {
  categoryId?: string;
  hasExpiredDocuments?: boolean;
  hasExpiringSoonDocuments?: boolean;
  warningDays?: number;
  brand?: string;
  model?: number;
  identification?: string;
}

// Vehicle search options
export interface VehicleSearchOptions {
  query?: string;
  category?: string;
  sortBy?: "name" | "brand" | "model" | "createdAt";
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

// Hook state interfaces
export interface VehiclesHookState {
  vehicles: VehicleData[];
  loading: boolean;
  error: string | null;
}

export interface VehicleRegistrationHookState {
  registering: boolean;
  registrationError: string | null;
  validationErrors: Record<string, string>;
  hasValidationErrors: boolean;
}

export interface VehicleDocumentsHookState {
  documents: VehicleDocument[];
  documentStatus: Record<string, VehicleDocumentStatus>;
  loading: boolean;
  error: string | null;
}

// Form data interfaces
export interface VehicleFormData {
  vehicleCategoryId: string;
  name: string;
  identification: string;
  model: string;
  brand: string;
  line: string;
}

export interface VehicleDocumentFormData {
  type: number;
  name: string;
  file: File | null;
  expirationAt: string;
  description?: string;
}

// Component prop interfaces
export interface VehicleCardProps {
  vehicle: VehicleData;
  onUpdate?: () => void;
  onDelete?: (id: string) => void;
  showMessage?: (message: MessageObject) => void;
}

export interface VehicleFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  showMessage?: (message: MessageObject) => void;
  initialData?: Partial<VehicleFormData>;
}

export interface VehiclesListProps {
  showMessage?: (message: MessageObject) => void;
  filterOptions?: VehicleFilterOptions;
  searchOptions?: VehicleSearchOptions;
}

export interface VehicleDocumentCardProps {
  label: string;
  document?: VehicleDocument;
  vehicleId: string;
  documentType: number;
  onUpload?: () => void;
  showMessage?: (message: MessageObject) => void;
  hideExpiry?: boolean;
}

// Message object for notifications
export interface MessageObject {
  type: "success" | "error" | "info" | "warning";
  text: string;
}

// API response interfaces
export interface VehicleApiResponse<T> {
  data?: T;
  success?: boolean;
  message?: string;
  error?: string;
}

export interface VehicleListResponse extends VehicleApiResponse<VehicleData[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Constants
export const VEHICLE_CATEGORIES = {
  CAR: "8cea5918-63d0-4037-a14f-09d066b5a336",
  MOTORCYCLE: "9cbb096b-a2ef-40b2-bed4-9e5c398c1ef5",
} as const;

export const VEHICLE_DOCUMENT_TYPES = {
  SOAT: 1,
  PROPERTY_CARD: 2,
  TECHNICAL_INSPECTION: 3,
} as const;

export const VEHICLE_DOCUMENT_STATUS = {
  MISSING: "missing",
  EXPIRED: "expired",
  EXPIRING: "expiring",
  VALID: "valid",
} as const;

// Type guards
export const isValidVehicleCategory = (categoryId: string): boolean => {
  return Object.values(VEHICLE_CATEGORIES).includes(categoryId as any);
};

export const isValidVehicleDocumentType = (type: number): boolean => {
  return Object.values(VEHICLE_DOCUMENT_TYPES).includes(type as any);
};

export const hasVehicleId = (vehicle: any): vehicle is VehicleData => {
  return vehicle && (vehicle.id || vehicle.vehicleId || vehicle._id);
};

export const isVehicleDocument = (doc: any): doc is VehicleDocument => {
  return doc && typeof doc.vehicleId === "string";
};

// Utility functions
export const getVehicleId = (vehicle: VehicleData): string | null => {
  return vehicle.id || vehicle.vehicleId || vehicle._id || null;
};

export const getVehicleDisplayName = (vehicle: VehicleData): string => {
  if (vehicle.name) {
    return vehicle.name;
  }

  const parts = [vehicle.brand, vehicle.line, vehicle.model].filter(Boolean);
  return parts.length > 0 ? parts.join(" ") : "Vehículo sin nombre";
};

export const getVehicleIdentificationDisplay = (
  vehicle: VehicleData
): string => {
  const identification = vehicle.identification || vehicle.license || "";
  return identification ? `••••${identification}` : "Sin placa";
};

export const getVehicleCategoryIcon = (categoryId: string): string => {
  switch (categoryId) {
    case VEHICLE_CATEGORIES.CAR:
      return "🚗";
    case VEHICLE_CATEGORIES.MOTORCYCLE:
      return "🏍️";
    default:
      return "🚗";
  }
};

export const getVehicleCategoryName = (categoryId: string): string => {
  switch (categoryId) {
    case VEHICLE_CATEGORIES.CAR:
      return "Carro / Camioneta";
    case VEHICLE_CATEGORIES.MOTORCYCLE:
      return "Motocicleta";
    default:
      return "Unknown";
  }
};

export const getVehicleDocumentTypeName = (documentType: number): string => {
  switch (documentType) {
    case VEHICLE_DOCUMENT_TYPES.SOAT:
      return "SOAT";
    case VEHICLE_DOCUMENT_TYPES.PROPERTY_CARD:
      return "Tarjeta de Propiedad";
    case VEHICLE_DOCUMENT_TYPES.TECHNICAL_INSPECTION:
      return "Técnico Mecánica";
    default:
      return "Unknown Document";
  }
};

// Utility types
export type VehicleCategoryKey = keyof typeof VEHICLE_CATEGORIES;
export type VehicleDocumentTypeKey = keyof typeof VEHICLE_DOCUMENT_TYPES;
export type VehicleDocumentStatusKey = keyof typeof VEHICLE_DOCUMENT_STATUS;
