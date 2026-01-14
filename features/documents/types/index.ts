/**
 * TypeScript type definitions for the Documents feature
 */

// Base document interface
export interface BaseDocument {
  id: string;
  name: string;
  type: number;
  createdAt: string;
  updatedAt: string;
  path?: string;
  url?: string;
  expirationAt?: string;
  description?: string;
}

// Personal document interface
export interface PersonalDocument extends BaseDocument {
  vehicleId?: never; // Ensures personal documents don't have vehicleId
}

// Vehicle document interface
export interface VehicleDocument extends BaseDocument {
  vehicleId: string;
}

// Union type for all documents
export type DocumentData = PersonalDocument | VehicleDocument;

// Document type enumeration
export enum DocumentType {
  SOAT = 1,
  PROPERTY_CARD = 2,
  TECHNICAL_INSPECTION = 3,
  NATIONAL_ID = 4,
  PASSPORT = 5,
  DRIVERS_LICENSE = 6,
}

// Document type information
export interface DocumentTypeInfo {
  name: string;
  requiresExpiry: boolean;
  category: "personal" | "vehicle" | "unknown";
}

// Document creation request
export interface CreateDocumentRequest {
  type: number;
  name: string;
  file: File;
  expirationAt?: string;
  description?: string;
  vehicleId?: string;
}

// Document update request
export interface UpdateDocumentRequest {
  file?: File;
  expirationAt?: string;
  name?: string;
  description?: string;
}

// Document validation result
export interface DocumentValidationResult {
  isValid: boolean;
  errors: string[];
}

// Document expiry status
export interface DocumentExpiryStatus {
  isExpired: boolean;
  isExpiringSoon: boolean;
  daysUntilExpiry: number | null;
}

// Document upload progress
export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

// Upload options
export interface UploadOptions {
  onProgress?: (progress: UploadProgress) => void;
  onSuccess?: (result: any) => void;
  onError?: (error: Error) => void;
}

// Batch upload result
export interface BatchUploadResult {
  successful: DocumentData[];
  failed: Array<{
    data: CreateDocumentRequest;
    error: string;
  }>;
}

// Document filter options
export interface DocumentFilterOptions {
  type?: number;
  category?: "personal" | "vehicle";
  expired?: boolean;
  expiringSoon?: boolean;
  warningDays?: number;
  vehicleId?: string;
}

// API response wrapper
export interface ApiResponse<T> {
  data?: T;
  success?: boolean;
  message?: string;
  error?: string;
}

// Paginated response
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Hook state interfaces
export interface DocumentsHookState {
  documents: DocumentData[];
  loading: boolean;
  error: string | null;
}

export interface UploadHookState {
  uploading: boolean;
  uploadProgress: number;
  error: string | null;
}

export interface ValidationHookState {
  validationErrors: Record<string, string>;
  isValidating: boolean;
  hasValidationErrors: boolean;
}

// Form data interfaces
export interface DocumentFormData {
  type: number;
  name: string;
  file: File | null;
  expirationAt: string;
  description?: string;
}

// Component prop interfaces
export interface DocumentCardProps {
  label: string;
  doc?: DocumentData;
  vehicleId?: string;
  onUpload?: () => void;
  showMessage?: (message: MessageObject) => void;
  hideExpiry?: boolean;
}

export interface DocumentFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  showMessage?: (message: MessageObject) => void;
  initialData?: Partial<DocumentFormData>;
}

// Message object for notifications
export interface MessageObject {
  type: "success" | "error" | "info" | "warning";
  text: string;
}

// Enums and constants
export const DOCUMENT_TYPES = {
  SOAT: 1,
  PROPERTY_CARD: 2,
  TECHNICAL_INSPECTION: 3,
  NATIONAL_ID: 4,
  PASSPORT: 5,
  DRIVERS_LICENSE: 6,
} as const;

export const DOCUMENT_CATEGORIES = {
  PERSONAL: "personal",
  VEHICLE: "vehicle",
} as const;

// Type guards
export const isPersonalDocument = (
  doc: DocumentData
): doc is PersonalDocument => {
  return !("vehicleId" in doc) || doc.vehicleId === undefined;
};

export const isVehicleDocument = (
  doc: DocumentData
): doc is VehicleDocument => {
  return "vehicleId" in doc && doc.vehicleId !== undefined;
};

export const isValidDocumentType = (type: number): type is DocumentType => {
  return Object.values(DOCUMENT_TYPES).includes(type as DocumentType);
};

// Utility types
export type DocumentTypeKey = keyof typeof DOCUMENT_TYPES;
export type DocumentCategoryKey = keyof typeof DOCUMENT_CATEGORIES;
