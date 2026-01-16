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
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const statusCode = error.response?.status || 0;
    const message = getErrorMessage(error);

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
} from "../types/transit-models";

/**
 * Busca regulaciones por texto
 * @param query - Texto de búsqueda
 * @param page - Número de página (0-indexed)
 * @returns Promise con resultados paginados de regulaciones
 * @throws ApiError si la solicitud falla
 */
export async function searchRegulations(
  query: string,
  page: number = 0
): Promise<Page<RegulationDto>> {
  try {
    const response = await apiClient.get<Page<RegulationDto>>(
      "/regulations/search",
      {
        params: {
          q: query,
          page: page,
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
 * @returns Promise con array de términos del glosario que coinciden
 * @throws ApiError si la solicitud falla
 */
export async function searchGlossaryTerms(
  term: string
): Promise<GlossaryDto[]> {
  try {
    const response = await apiClient.get<Page<GlossaryDto>[]>(
      "/glossaries/search",
      {
        params: {
          term: term,
        },
      }
    );

    // According to the design document, the API returns an array of Page objects
    // We need to extract the content from all pages and flatten it
    if (Array.isArray(response.data)) {
      const allTerms: GlossaryDto[] = [];
      for (const page of response.data) {
        if (page.content && Array.isArray(page.content)) {
          allTerms.push(...page.content);
        }
      }
      return allTerms;
    }

    // If response is empty or not an array, return empty array
    return [];
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
  size?: number
): Promise<Page<RegulationDto>> {
  try {
    // Serialize criteria as JSON body for POST request
    const requestBody = {
      criteria: criteria,
      page: page,
      ...(size !== undefined && { size: size }),
    };

    const response = await apiClient.post<Page<RegulationDto>>(
      "/regulations/advanced-search",
      requestBody
    );

    return response.data;
  } catch (error) {
    // Re-throw ApiError from interceptor
    throw error;
  }
}
