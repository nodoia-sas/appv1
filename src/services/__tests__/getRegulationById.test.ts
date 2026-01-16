/**
 * @jest-environment jsdom
 */
import MockAdapter from "axios-mock-adapter";
import apiClient, { getRegulationById, ApiError } from "../api";
import { RegulationDto } from "../../types/transit-models";

describe("getRegulationById", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.restore();
  });

  it("should fetch regulation by ID successfully", async () => {
    const mockRegulation: RegulationDto = {
      id: "reg-123",
      lawId: "law-456",
      title: "Límites de Velocidad",
      codeId: "ART-001",
      articleNumber: "1",
      content: "El límite de velocidad en zonas urbanas es de 60 km/h.",
      iaExplanation: "En la ciudad, no puedes ir más rápido de 60 km/h.",
      examples:
        "Si vas a 80 km/h en zona urbana, estás infringiendo esta norma.",
      active: true,
    };

    mock.onGet("/regulations/reg-123").reply(200, mockRegulation);

    const result = await getRegulationById("reg-123");

    expect(result).toEqual(mockRegulation);
    expect(mock.history.get.length).toBe(1);
    expect(mock.history.get[0].url).toBe("/regulations/reg-123");
  });

  it("should throw ApiError with 404 when regulation not found", async () => {
    mock.onGet("/regulations/nonexistent-id").reply(404);

    await expect(getRegulationById("nonexistent-id")).rejects.toThrow(ApiError);
    await expect(getRegulationById("nonexistent-id")).rejects.toMatchObject({
      statusCode: 404,
      message: "No se encontró el recurso solicitado.",
    });
  });

  it("should throw ApiError when server error occurs", async () => {
    mock.onGet("/regulations/reg-123").reply(500);

    await expect(getRegulationById("reg-123")).rejects.toThrow(ApiError);
  });

  it("should throw ApiError when network error occurs", async () => {
    mock.onGet("/regulations/reg-123").networkError();

    await expect(getRegulationById("reg-123")).rejects.toThrow(ApiError);
  });

  it("should return complete regulation with all fields", async () => {
    const completeRegulation: RegulationDto = {
      id: "reg-999",
      lawId: "law-888",
      title: "Uso del Cinturón de Seguridad",
      codeId: "ART-050",
      articleNumber: "50",
      content: "Es obligatorio el uso del cinturón de seguridad.",
      iaExplanation: "Siempre debes usar el cinturón cuando conduces o viajas.",
      examples: "Tanto el conductor como los pasajeros deben usar cinturón.",
      publicationDate: "2020-01-01",
      lastUpdatedAt: "2023-06-15T10:30:00Z",
      section: "Seguridad Vial",
      createdAt: "2020-01-01T00:00:00Z",
      updatedAt: "2023-06-15T10:30:00Z",
      active: true,
    };

    mock.onGet("/regulations/reg-999").reply(200, completeRegulation);

    const result = await getRegulationById("reg-999");

    expect(result).toEqual(completeRegulation);
    expect(result.id).toBe("reg-999");
    expect(result.lawId).toBe("law-888");
    expect(result.content).toBeDefined();
    expect(result.iaExplanation).toBeDefined();
  });
});
