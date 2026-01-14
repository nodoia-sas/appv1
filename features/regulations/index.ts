/**
 * Regulations Feature - Barrel Export
 *
 * This file exposes the public API for the regulations feature.
 * It provides a clean interface for importing regulations-related functionality
 * while hiding internal implementation details.
 */

// Components - UI components for regulations display
export { default as Regulations } from "./components/Regulations";
export { default as RegulationsMain } from "./components/RegulationsMain";
export { default as RegulationDetail } from "./components/RegulationDetail";

// Hooks - Custom React hooks for regulations state management and operations
export { useRegulations } from "./hooks/useRegulations";
export { useRegulationDetail } from "./hooks/useRegulationDetail";
export { useRegulationSearch } from "./hooks/useRegulationSearch";

// Services - Business logic and API communication
export { regulationsService } from "./services/regulationsService";

// Types - TypeScript type definitions and interfaces
export type {
  // Core types
  RegulationData,
  RegulationDetail,
  RegulationArticle,

  // Search and filter types
  RegulationSearchOptions,
  RegulationFilterOptions,
  RegulationSearchResult,

  // Hook state types
  RegulationsHookState,
  RegulationDetailHookState,
  RegulationSearchHookState,

  // Component prop types
  RegulationCardProps,
  RegulationsListProps,
  RegulationDetailProps,

  // API types
  ApiResponse,
  PaginatedResponse,
  RegulationApiResponse,
  RegulationsListResponse,

  // Utility types
  MessageObject,
} from "./types";

// Type guards and utilities
export {
  isRegulationData,
  isRegulationArticle,
  hasArticles,
  REGULATION_STORAGE_KEYS,
} from "./types";

// Feature metadata
export const REGULATIONS_FEATURE_NAME = "regulations";
export const REGULATIONS_FEATURE_VERSION = "1.0.0";

// Feature configuration
export const regulationsFeatureConfig = {
  name: REGULATIONS_FEATURE_NAME,
  version: REGULATIONS_FEATURE_VERSION,
  description: "Traffic regulations and legal information feature",
  dependencies: ["shared"],
};
