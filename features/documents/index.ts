/**
 * Documents Feature Barrel Export
 * This file exposes the public API of the documents feature
 */

// Components - Main UI components for the documents feature
export { default as Documents } from "./components/Documents";
export { DocumentCard } from "./components/DocumentCard";
export { PersonalDocuments } from "./components/PersonalDocuments";
export { PersonalDocumentForm } from "./components/PersonalDocumentForm";

// Hooks - Custom React hooks for state management and operations
export { useDocuments } from "./hooks/useDocuments";
export { useDocumentUpload } from "./hooks/useDocumentUpload";
export { useDocumentValidation } from "./hooks/useDocumentValidation";

// Services - Business logic and API communication
export { documentsService } from "./services/documentsService";

// Types - TypeScript type definitions and interfaces
export type {
  // Document types
  DocumentData,
  PersonalDocument,
  VehicleDocument,
  CreateDocumentRequest,
  UpdateDocumentRequest,
  DocumentValidationResult,
  DocumentExpiryStatus,
  DocumentTypeInfo,
  DocumentFilterOptions,

  // Form types
  DocumentFormData,

  // Component prop types
  DocumentCardProps,
  DocumentFormProps,

  // Hook state types
  DocumentsHookState,
  UploadHookState,
  ValidationHookState,

  // Utility types
  MessageObject,
  ApiResponse,
  PaginatedResponse,
  UploadProgress,
  UploadOptions,
  BatchUploadResult,
} from "./types";

// Enums and constants
export {
  DocumentType,
  DOCUMENT_TYPES,
  DOCUMENT_CATEGORIES,
  isPersonalDocument,
  isVehicleDocument,
  isValidDocumentType,
} from "./types";

// Feature metadata
export const DOCUMENTS_FEATURE_VERSION = "1.0.0";
export const DOCUMENTS_FEATURE_NAME = "documents";

// Feature configuration
export const DOCUMENTS_FEATURE_CONFIG = {
  name: DOCUMENTS_FEATURE_NAME,
  version: DOCUMENTS_FEATURE_VERSION,
  description: "Personal document management feature",
  components: [
    "Documents",
    "DocumentCard",
    "PersonalDocuments",
    "PersonalDocumentForm",
  ],
  hooks: ["useDocuments", "useDocumentUpload", "useDocumentValidation"],
  services: ["documentsService"],
} as const;
