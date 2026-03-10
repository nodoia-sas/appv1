import axios, { AxiosError } from "axios";

/**
 * Custom error class for API errors
 * Provides structured error information with user-friendly messages in Spanish
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly originalError?: any;

  constructor(statusCode: number, message: string, originalError?: any) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.originalError = originalError;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}

/**
 * Generates user-friendly error messages in Spanish based on error type
 */
function getErrorMessage(error: AxiosError): string {
  // Network errors (no response received)
  if (!error.response) {
    if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
      return "La solicitud tardó demasiado tiempo. Por favor, intenta de nuevo.";
    }
    return "No se pudo conectar con el servidor. Verifica tu conexión a internet.";
  }

  const status = error.response.status;

  // Client errors (4xx)
  if (status >= 400 && status < 500) {
    switch (status) {
      case 400:
        return "Solicitud inválida. Verifica los parámetros de búsqueda.";
      case 401:
        return "No estás autorizado. Por favor, inicia sesión.";
      case 403:
        return "No tienes permisos para acceder a este recurso.";
      case 404:
        return "No se encontró el recurso solicitado.";
      case 429:
        return "Demasiadas solicitudes. Intenta de nuevo en unos momentos.";
      default:
        return "Error en la solicitud. Por favor, verifica los datos ingresados.";
    }
  }

  // Server errors (5xx)
  if (status >= 500) {
    switch (status) {
      case 503:
        return "Servicio temporalmente no disponible. Intenta de nuevo más tarde.";
      default:
        return "Error del servidor. Intenta de nuevo más tarde.";
    }
  }

  return "Ocurrió un error inesperado. Por favor, intenta de nuevo.";
}

/**
 * Axios instance configured for TransitIA API integration
 * Base URL: http://localhost:8011
 * Timeout: 10 seconds
 * Default headers: Content-Type: application/json
 */
const apiClient = axios.create({
  baseURL: "http://localhost:8011",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
});

/**
 * Response interceptor for error handling
 * Converts Axios errors into ApiError instances with user-friendly messages
 * Requirement 9.5: Logs errors to console for debugging
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const statusCode = error.response?.status || 0;
    const message = getErrorMessage(error);

    // Log error details for debugging (Requirement 9.5)
    const errorLog: Record<string, any> = {
      endpoint: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      status: statusCode,
      message: message,
      timestamp: new Date().toISOString(),
    };

    if (error.response?.data) {
      errorLog.responseData = error.response.data;
    }

    console.error("API Error:", errorLog);

    throw new ApiError(statusCode, message, error);
  }
);

export default apiClient;

// ============================================
// API Service Functions
// ============================================

import {
  Page,
  RegulationDto,
  GlossaryDto,
  SearchCriteria,
  LawDto,
} from "../types/transit-models";

/**
 * Busca leyes por texto usando el endpoint de búsqueda avanzada
 * @param query - Texto de búsqueda (opcional)
 * @param page - Número de página (0-indexed)
 * @param size - Tamaño de página (default: 10)
 * @returns Promise con resultados paginados de leyes
 * @throws ApiError si la solicitud falla
 */
export async function searchLaws(
  query?: string,
  page: number = 0,
  size: number = 10
): Promise<Page<LawDto>> {
  try {
    const params: any = {
      page,
      size,
    };

    // Si hay query, agregar criterio de búsqueda
    if (query && query.trim()) {
      params.criteria = `key=title,operation=:,value=${encodeURIComponent(
        query
      )}`;
    }

    const response = await apiClient.get<Page<LawDto>>("/laws", {
      params,
    });

    return response.data;
  } catch (error) {
    // Re-throw ApiError from interceptor
    throw error;
  }
}

/**
 * Obtiene todas las leyes con paginación
 * @param page - Número de página (0-indexed)
 * @param size - Tamaño de página (default: 10)
 * @returns Promise con resultados paginados de leyes
 * @throws ApiError si la solicitud falla
 */
export async function getAllLaws(
  page: number = 0,
  size: number = 10
): Promise<Page<LawDto>> {
  try {
    const response = await apiClient.get<Page<LawDto>>("/laws", {
      params: {
        page,
        size,
      },
    });

    return response.data;
  } catch (error) {
    // Re-throw ApiError from interceptor
    throw error;
  }
}

/**
 * Obtiene una ley específica por su ID
 * @param id - ID único de la ley
 * @returns Promise con los detalles completos de la ley
 * @throws ApiError si la solicitud falla (incluyendo 404 si no se encuentra)
 */
export async function getLawById(id: string): Promise<LawDto> {
  try {
    const response = await apiClient.get<LawDto>(`/laws/${id}`);
    return response.data;
  } catch (error) {
    // Re-throw ApiError from interceptor
    throw error;
  }
}

/**
 * Obtiene todas las regulaciones (artículos) de una ley específica
 * @param lawId - ID de la ley
 * @param page - Número de página (0-indexed)
 * @param size - Tamaño de página (default: 10)
 * @returns Promise con resultados paginados de regulaciones de esa ley
 * @throws ApiError si la solicitud falla
 */
export async function getRegulationsByLawId(
  lawId: string,
  page: number = 0,
  size: number = 10
): Promise<Page<RegulationDto>> {
  try {
    // El backend acepta lawId como parámetro directo, no como criteria
    const response = await apiClient.get<Page<RegulationDto>>("/regulations", {
      params: {
        lawId,
        page,
        size,
      },
    });

    return response.data;
  } catch (error) {
    // Re-throw ApiError from interceptor
    throw error;
  }
}

/**
 * Busca regulaciones por texto
 * @param query - Texto de búsqueda
 * @param page - Número de página (0-indexed)
 * @param size - Tamaño de página (default: 10)
 * @returns Promise con resultados paginados de regulaciones
 * @throws ApiError si la solicitud falla
 */
export async function searchRegulations(
  query: string,
  page: number = 0,
  size: number = 10
): Promise<Page<RegulationDto>> {
  try {
    const response = await apiClient.get<Page<RegulationDto>>(
      "/regulations/search",
      {
        params: {
          query: query,
          page,
          size,
        },
      }
    );

    return response.data;
  } catch (error) {
    // Re-throw ApiError from interceptor
    throw error;
  }
}

/**
 * Obtiene una regulación específica por su ID
 * @param id - ID único de la regulación
 * @returns Promise con los detalles completos de la regulación
 * @throws ApiError si la solicitud falla (incluyendo 404 si no se encuentra)
 */
export async function getRegulationById(id: string): Promise<RegulationDto> {
  try {
    const response = await apiClient.get<RegulationDto>(`/regulations/${id}`);
    return response.data;
  } catch (error) {
    // Re-throw ApiError from interceptor
    // 404 errors are already handled by the interceptor with the message:
    // "No se encontró el recurso solicitado."
    throw error;
  }
}

/**
 * Busca términos en el glosario
 * @param term - Término de búsqueda
 * @param page - Número de página (0-indexed)
 * @param size - Tamaño de página (default: 10)
 * @returns Promise con respuesta paginada de términos del glosario que coinciden
 * @throws ApiError si la solicitud falla
 */
export async function searchGlossaryTerms(
  term: string,
  page: number = 0,
  size: number = 10
): Promise<Page<GlossaryDto>> {
  try {
    const response = await apiClient.get<Page<GlossaryDto>>(
      "/glossaries/search",
      {
        params: {
          searchTerm: term,
          page,
          size,
        },
      }
    );

    // Return the full paginated response
    return response.data;
  } catch (error) {
    // Re-throw ApiError from interceptor
    throw error;
  }
}

/**
 * Obtiene todos los términos del glosario con paginación
 * @param page - Número de página (0-indexed)
 * @param size - Tamaño de página
 * @returns Promise con respuesta paginada de términos del glosario
 * @throws ApiError si la solicitud falla
 */
export async function getAllGlossaries(
  page: number = 0,
  size: number = 10
): Promise<Page<GlossaryDto>> {
  try {
    const response = await apiClient.get<Page<GlossaryDto>>("/glossaries", {
      params: {
        page,
        size,
      },
    });
    // The API returns a paginated response
    return response.data;
  } catch (error) {
    // Re-throw ApiError from interceptor
    throw error;
  }
}

/**
 * Realiza búsqueda avanzada de regulaciones usando criterios múltiples
 * @param criteria - Array de criterios de búsqueda (key, operation, value)
 * @param page - Número de página (0-indexed), opcional
 * @param size - Tamaño de página, opcional
 * @returns Promise con resultados paginados de regulaciones que cumplen todos los criterios
 * @throws ApiError si la solicitud falla
 *
 * @example
 * // Buscar regulaciones activas con título que contenga "velocidad"
 * searchWithCriteria([
 *   { key: "title", operation: ":", value: "velocidad" },
 *   { key: "active", operation: "=", value: true }
 * ])
 */
export async function searchWithCriteria(
  criteria: SearchCriteria[],
  page: number = 0,
  size: number = 10
): Promise<Page<RegulationDto>> {
  try {
    // Serialize criteria as query parameters
    // Format: key=title,operation=:,value=searchTerm
    const criteriaParams = criteria.map(
      (c) => `key=${c.key},operation=${c.operation},value=${c.value}`
    );

    const response = await apiClient.get<Page<RegulationDto>>("/regulations", {
      params: {
        criteria: criteriaParams,
        page,
        size,
      },
    });

    return response.data;
  } catch (error) {
    // Re-throw ApiError from interceptor
    throw error;
  }
}
