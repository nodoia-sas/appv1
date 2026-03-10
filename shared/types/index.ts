// Shared types barrel export
// Export common TypeScript types and interfaces here

// Re-export all types from sub-modules
export * from "./api";
export * from "./ui";

// Common API response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// Common entity types
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User extends BaseEntity {
  email: string;
  name: string;
  avatar?: string;
}

// Common UI types
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface NavigationItem {
  label: string;
  path: string;
  icon?: string;
  children?: NavigationItem[];
}

export interface BreadcrumbItem {
  label: string;
  path: string;
  icon?: string;
}

// Loading and error states
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface LoadingState {
  loading: boolean;
  error: string | null;
}

// Form types
export interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "password" | "select" | "textarea" | "file";
  required?: boolean;
  placeholder?: string;
  options?: SelectOption[];
}

export interface ValidationError {
  field: string;
  message: string;
}

// File upload types
export interface FileUpload {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "completed" | "error";
  error?: string;
}

// Search and filter types
export interface SearchParams {
  query?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filters?: Record<string, any>;
}

export interface FilterOption {
  key: string;
  label: string;
  type: "text" | "select" | "date" | "boolean";
  options?: SelectOption[];
}
