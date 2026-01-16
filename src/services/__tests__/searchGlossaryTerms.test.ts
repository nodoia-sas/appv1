/**
 * @jest-environment jsdom
 */
import MockAdapter from "axios-mock-adapter";
import apiClient, { searchGlossaryTerms } from "../api";
import { Page, GlossaryDto } from "../../types/transit-models";

describe("searchGlossaryTerms", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.restore();
  });

  it("should call /glossaries/search with correct term parameter", async () => {
    const mockResponse: Page<GlossaryDto>[] = [
      {
        content: [
          {
            id: "1",
            wordName: "Conductor",
            wordValue: "Persona que maneja un vehículo",
            iaExplication: "Es quien está al volante del carro",
          },
        ],
        pageable: {
          pageNumber: 0,
          pageSize: 10,
          sort: { empty: true, sorted: false, unsorted: true },
          offset: 0,
          paged: true,
          unpaged: false,
        },
        totalPages: 1,
        totalElements: 1,
        last: true,
        size: 10,
        number: 0,
        sort: { empty: true, sorted: false, unsorted: true },
        numberOfElements: 1,
        first: true,
        empty: false,
      },
    ];

    mock.onGet("/glossaries/search").reply(200, mockResponse);

    const result = await searchGlossaryTerms("conductor");

    expect(result).toHaveLength(1);
    expect(result[0].wordName).toBe("Conductor");
    expect(mock.history.get.length).toBe(1);
    expect(mock.history.get[0].params).toEqual({ term: "conductor" });
  });

  it("should flatten multiple pages into a single array", async () => {
    const mockResponse: Page<GlossaryDto>[] = [
      {
        content: [
          {
            id: "1",
            wordName: "Conductor",
            wordValue: "Persona que maneja un vehículo",
          },
          {
            id: "2",
            wordName: "Conducir",
            wordValue: "Acción de manejar un vehículo",
          },
        ],
        pageable: {
          pageNumber: 0,
          pageSize: 10,
          sort: { empty: true, sorted: false, unsorted: true },
          offset: 0,
          paged: true,
          unpaged: false,
        },
        totalPages: 1,
        totalElements: 2,
        last: true,
        size: 10,
        number: 0,
        sort: { empty: true, sorted: false, unsorted: true },
        numberOfElements: 2,
        first: true,
        empty: false,
      },
    ];

    mock.onGet("/glossaries/search").reply(200, mockResponse);

    const result = await searchGlossaryTerms("conduc");

    expect(result).toHaveLength(2);
    expect(result[0].wordName).toBe("Conductor");
    expect(result[1].wordName).toBe("Conducir");
  });

  it("should return empty array when no results found", async () => {
    const mockResponse: Page<GlossaryDto>[] = [
      {
        content: [],
        pageable: {
          pageNumber: 0,
          pageSize: 10,
          sort: { empty: true, sorted: false, unsorted: true },
          offset: 0,
          paged: true,
          unpaged: false,
        },
        totalPages: 0,
        totalElements: 0,
        last: true,
        size: 10,
        number: 0,
        sort: { empty: true, sorted: false, unsorted: true },
        numberOfElements: 0,
        first: true,
        empty: true,
      },
    ];

    mock.onGet("/glossaries/search").reply(200, mockResponse);

    const result = await searchGlossaryTerms("nonexistent");

    expect(result).toEqual([]);
  });

  it("should return empty array when response is empty array", async () => {
    mock.onGet("/glossaries/search").reply(200, []);

    const result = await searchGlossaryTerms("test");

    expect(result).toEqual([]);
  });

  it("should throw ApiError when request fails", async () => {
    mock.onGet("/glossaries/search").reply(500);

    await expect(searchGlossaryTerms("test")).rejects.toThrow();
  });

  it("should throw ApiError with 404 when not found", async () => {
    mock.onGet("/glossaries/search").reply(404);

    await expect(searchGlossaryTerms("nonexistent")).rejects.toThrow();
  });
});
