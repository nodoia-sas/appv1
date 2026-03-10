/**
 * TransitIA - Modelos de Datos TypeScript
 * Basados en la definición OpenAPI del backend
 */

// ============================================
// Tipos Base y Utilidades
// ============================================

/**
 * Tipo genérico para respuestas paginadas
 */
export interface Page<T> {
  content: T[];
  pageable: Pageable;
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: Sort;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

/**
 * Criterios de búsqueda avanzada
 */
export interface SearchCriteria {
  key: string; // Ej: "title"
  operation: string; // Ej: ":" (contiene), "=" (igual)
  value: string | number | boolean;
}

// ============================================
// Modelos de Dominio
// ============================================

/**
 * Regulación (Artículo de Ley)
 * Representa un artículo específico de una ley de tránsito
 */
export interface RegulationDto {
  id: string;
  lawId: string; // Relación con la ley padre
  title: string;
  codeId: string; // Ej: "ART-123"
  articleNumber: string;
  content: string; // El texto legal oficial
  iaExplanation?: string; // La explicación simplificada
  examples?: string;
  publicationDate?: string;
  lastUpdatedAt?: string;
  section?: string;
  createdAt?: string;
  updatedAt?: string;
  active: boolean;
}

/**
 * Ley
 * Representa una ley completa de tránsito
 */
export interface LawDto {
  id: string;
  title: string;
  codeId: string;
  description: string;
  iaExplanation?: string; // Campo clave de tu valor agregado
  updatedAt: string;
}

/**
 * Término del Glosario
 * Define términos legales con explicaciones simplificadas
 */
export interface GlossaryDto {
  id: string;
  wordName: string;
  wordValue: string; // Definición oficial
  iaExplication?: string; // Definición IA
  publicationDate?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  deleted?: boolean;
}

// ============================================
// Tipos para Requests
// ============================================

export interface SearchRegulationsParams {
  query?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export interface AdvancedSearchParams {
  criteria: SearchCriteria[];
  page?: number;
  size?: number;
  sort?: string;
}

export interface SearchGlossaryParams {
  term?: string;
  category?: string;
  page?: number;
  size?: number;
}

// ============================================
// Tipos para UI
// ============================================

/**
 * Estado de carga para componentes
 */
export type LoadingState = "idle" | "loading" | "success" | "error";

/**
 * Resultado de búsqueda combinado
 */
export interface SearchResult {
  regulations: RegulationDto[];
  glossaryTerms: GlossaryDto[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Opciones de filtrado para regulaciones
 */
export interface RegulationFilters {
  lawId?: string;
  section?: string;
  active?: boolean;
}
