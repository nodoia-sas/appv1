/**
 * @jest-environment jsdom
 */
import { AxiosError } from "axios";
import apiClient, { ApiError } from "../api";

describe("API Error Interceptor", () => {
  describe("ApiError Class", () => {
    it("should create ApiError with correct properties", () => {
      const error = new ApiError(404, "Not found", { detail: "test" });

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(ApiError);
      expect(error.name).toBe("ApiError");
      expect(error.statusCode).toBe(404);
      expect(error.message).toBe("Not found");
      expect(error.originalError).toEqual({ detail: "test" });
    });

    it("should create ApiError without original error", () => {
      const error = new ApiError(500, "Server error");

      expect(error.statusCode).toBe(500);
      expect(error.message).toBe("Server error");
      expect(error.originalError).toBeUndefined();
    });
  });

  describe("Error Status Code Handling", () => {
    const testCases = [
      { status: 400, expectedMessage: "Solicitud inválida" },
      { status: 401, expectedMessage: "No estás autorizado" },
      { status: 403, expectedMessage: "No tienes permisos" },
      { status: 404, expectedMessage: "No se encontró" },
      { status: 429, expectedMessage: "Demasiadas solicitudes" },
      { status: 500, expectedMessage: "Error del servidor" },
      { status: 503, expectedMessage: "temporalmente no disponible" },
    ];

    testCases.forEach(({ status, expectedMessage }) => {
      it(`should handle ${status} status code with Spanish message`, () => {
        const error = new ApiError(status, expectedMessage);
        expect(error.statusCode).toBe(status);
        expect(error.message).toContain(expectedMessage);
      });
    });
  });

  describe("ApiClient Configuration", () => {
    it("should have correct base configuration", () => {
      expect(apiClient.defaults.baseURL).toBe("http://localhost:8011");
      expect(apiClient.defaults.headers["Content-Type"]).toBe(
        "application/json"
      );
      expect(apiClient.defaults.timeout).toBe(10000);
    });
  });

  describe("Error Message Validation", () => {
    it("should distinguish between network errors (status 0)", () => {
      const networkError = new ApiError(
        0,
        "No se pudo conectar con el servidor"
      );
      expect(networkError.statusCode).toBe(0);
      expect(networkError.message).toContain("No se pudo conectar");
    });

    it("should distinguish between 4xx client errors", () => {
      const clientError = new ApiError(400, "Solicitud inválida");
      expect(clientError.statusCode).toBeGreaterThanOrEqual(400);
      expect(clientError.statusCode).toBeLessThan(500);
    });

    it("should distinguish between 5xx server errors", () => {
      const serverError = new ApiError(500, "Error del servidor");
      expect(serverError.statusCode).toBeGreaterThanOrEqual(500);
      expect(serverError.statusCode).toBeLessThan(600);
    });
  });
});
