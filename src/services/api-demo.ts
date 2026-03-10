/**
 * Demo file showing how the API error interceptor works
 * This file demonstrates the error handling capabilities
 */

import apiClient, { ApiError } from "./api";

/**
 * Example function demonstrating error handling
 */
export async function demoErrorHandling() {
  try {
    // This will fail and trigger the error interceptor
    const response = await apiClient.get("/regulations/123");
    console.log("Success:", response.data);
  } catch (error) {
    if (error instanceof ApiError) {
      console.log("Status Code:", error.statusCode);
      console.log("User-friendly message:", error.message);
      console.log("Original error:", error.originalError);

      // You can handle different error types
      if (error.statusCode === 404) {
        console.log("Resource not found - show 404 page");
      } else if (error.statusCode >= 500) {
        console.log("Server error - show retry button");
      } else if (error.statusCode === 0) {
        console.log("Network error - check connection");
      }
    }
  }
}

/**
 * Example of handling different error scenarios
 */
export const errorExamples = {
  // Network error (no response)
  networkError: {
    statusCode: 0,
    message:
      "No se pudo conectar con el servidor. Verifica tu conexión a internet.",
  },

  // Timeout error
  timeoutError: {
    statusCode: 0,
    message:
      "La solicitud tardó demasiado tiempo. Por favor, intenta de nuevo.",
  },

  // 400 Bad Request
  badRequest: {
    statusCode: 400,
    message: "Solicitud inválida. Verifica los parámetros de búsqueda.",
  },

  // 404 Not Found
  notFound: {
    statusCode: 404,
    message: "No se encontró el recurso solicitado.",
  },

  // 429 Too Many Requests
  tooManyRequests: {
    statusCode: 429,
    message: "Demasiadas solicitudes. Intenta de nuevo en unos momentos.",
  },

  // 500 Internal Server Error
  serverError: {
    statusCode: 500,
    message: "Error del servidor. Intenta de nuevo más tarde.",
  },

  // 503 Service Unavailable
  serviceUnavailable: {
    statusCode: 503,
    message:
      "Servicio temporalmente no disponible. Intenta de nuevo más tarde.",
  },
};
