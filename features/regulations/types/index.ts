/**
 * Regulations Feature - Type Definitions
 *
 * This file contains all TypeScript type definitions and interfaces
 * for the regulations feature.
 */

// ============================================================================
// Core Regulation Types
// ============================================================================

/**
 * Article within a regulation
 */
export interface RegulationArticle {
  number: string;
  summary: string;
}

/**
 * Core regulation entity
 */
export interface RegulationData {
  id: string;
  title: string;
  summary: string;
  articles?: RegulationArticle[];
}

/**
 * Regulation with additional metadata
 */
export interface RegulationDetail extends RegulationData {
  fullText?: string;
  effectiveDate?: Date;
  lastModified?: Date;
  category?: string;
  tags?: string[];
}

// ============================================================================
// Search and Filter Types
// ============================================================================

/**
 * Search options for regulations
 */
export interface RegulationSearchOptions {
  query?: string;
  category?: string;
  tags?: string[];
  limit?: number;
  offset?: number;
}

/**
 * Filter options for regulations
 */
export interface RegulationFilterOptions {
  category?: string;
  tags?: string[];
  hasArticles?: boolean;
}

/**
 * Search result with metadata
 */
export interface RegulationSearchResult {
  regulations: RegulationData[];
  total: number;
  hasMore: boolean;
}

// ============================================================================
// Hook State Types
// ============================================================================

/**
 * State returned by useRegulations hook
 */
export interface RegulationsHookState {
  regulations: RegulationData[];
  loading: boolean;
  error: string | null;
  fetchRegulations: () => Promise<void>;
  clearError: () => void;
  getRegulationById: (id: string) => RegulationData | undefined;
  filterRegulations: (options: RegulationFilterOptions) => RegulationData[];
}

/**
 * State returned by useRegulationDetail hook
 */
export interface RegulationDetailHookState {
  regulation: RegulationData | null;
  loading: boolean;
  error: string | null;
  fetchRegulation: (id: string) => Promise<void>;
  clearError: () => void;
  saveSelection: (regulation: RegulationData) => void;
  clearSelection: () => void;
}

/**
 * State returned by useRegulationSearch hook
 */
export interface RegulationSearchHookState {
  results: RegulationData[];
  loading: boolean;
  error: string | null;
  query: string;
  search: (
    searchQuery: string,
    options?: RegulationSearchOptions
  ) => Promise<void>;
  clearSearch: () => void;
  clearError: () => void;
}

// ============================================================================
// Component Prop Types
// ============================================================================

/**
 * Props for RegulationCard component
 */
export interface RegulationCardProps {
  regulation: RegulationData;
  onSelect?: (regulation: RegulationData) => void;
  showArticles?: boolean;
}

/**
 * Props for RegulationsList component
 */
export interface RegulationsListProps {
  regulations: RegulationData[];
  onSelectRegulation?: (regulation: RegulationData) => void;
  loading?: boolean;
  error?: string | null;
}

/**
 * Props for RegulationDetail component
 */
export interface RegulationDetailProps {
  regulation: RegulationData | null;
  onBack?: () => void;
  loading?: boolean;
  error?: string | null;
}

// ============================================================================
// API Response Types
// ============================================================================

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

/**
 * Paginated API response
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

/**
 * Regulation API response
 */
export type RegulationApiResponse = ApiResponse<RegulationData>;

/**
 * Regulations list API response
 */
export type RegulationsListResponse = ApiResponse<RegulationData[]>;

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Message object for user feedback
 */
export interface MessageObject {
  type: "success" | "error" | "warning" | "info";
  text: string;
}

/**
 * Storage keys for regulations feature
 */
export const REGULATION_STORAGE_KEYS = {
  SELECTED_REGULATION: "transit-selected-regulation",
  RECENT_REGULATIONS: "transit-recent-regulations",
  FAVORITES: "transit-favorite-regulations",
} as const;

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Check if an object is a valid RegulationData
 */
export function isRegulationData(obj: any): obj is RegulationData {
  return (
    obj &&
    typeof obj === "object" &&
    typeof obj.id === "string" &&
    typeof obj.title === "string" &&
    typeof obj.summary === "string"
  );
}

/**
 * Check if an object is a valid RegulationArticle
 */
export function isRegulationArticle(obj: any): obj is RegulationArticle {
  return (
    obj &&
    typeof obj === "object" &&
    typeof obj.number === "string" &&
    typeof obj.summary === "string"
  );
}

/**
 * Check if a regulation has articles
 */
export function hasArticles(regulation: RegulationData): boolean {
  return (
    regulation.articles !== undefined &&
    Array.isArray(regulation.articles) &&
    regulation.articles.length > 0
  );
}
