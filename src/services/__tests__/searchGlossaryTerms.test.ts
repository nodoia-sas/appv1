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
    const mockResponse: Page<GlossaryDto> = {
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
    };

    mock.onGet("/glossaries/search").reply(200, mockResponse);

    const result = await searchGlossaryTerms("conductor");

    expect(result.content).toHaveLength(1);
    expect(result.content[0].wordName).toBe("Conductor");
    expect(result.totalElements).toBe(1);
    expect(result.totalPages).toBe(1);
    expect(mock.history.get.length).toBe(1);
    expect(mock.history.get[0].params).toEqual({
      searchTerm: "conductor",
      page: 0,
      size: 10,
    });
  });

  it("should return paginated response with multiple items", async () => {
    const mockResponse: Page<GlossaryDto> = {
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
    };

    mock.onGet("/glossaries/search").reply(200, mockResponse);

    const result = await searchGlossaryTerms("conduc");

    expect(result.content).toHaveLength(2);
    expect(result.content[0].wordName).toBe("Conductor");
    expect(result.content[1].wordName).toBe("Conducir");
    expect(result.totalElements).toBe(2);
  });

  it("should return empty content when no results found", async () => {
    const mockResponse: Page<GlossaryDto> = {
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
    };

    mock.onGet("/glossaries/search").reply(200, mockResponse);

    const result = await searchGlossaryTerms("nonexistent");

    expect(result.content).toEqual([]);
    expect(result.totalElements).toBe(0);
  });

  it("should throw ApiError when request fails", async () => {
    mock.onGet("/glossaries/search").reply(500);

    await expect(searchGlossaryTerms("test")).rejects.toThrow();
  });

  it("should throw ApiError with 404 when not found", async () => {
    mock.onGet("/glossaries/search").reply(404);

    await expect(searchGlossaryTerms("nonexistent")).rejects.toThrow();
  });

  it("should support pagination parameters", async () => {
    const mockResponse: Page<GlossaryDto> = {
      content: [
        {
          id: "11",
          wordName: "Término 11",
          wordValue: "Descripción del término 11",
        },
      ],
      pageable: {
        pageNumber: 1,
        pageSize: 10,
        sort: { empty: true, sorted: false, unsorted: true },
        offset: 10,
        paged: true,
        unpaged: false,
      },
      totalPages: 3,
      totalElements: 25,
      last: false,
      size: 10,
      number: 1,
      sort: { empty: true, sorted: false, unsorted: true },
      numberOfElements: 10,
      first: false,
      empty: false,
    };

    mock.onGet("/glossaries/search").reply(200, mockResponse);

    const result = await searchGlossaryTerms("término", 1, 10);

    expect(result.content).toHaveLength(1);
    expect(result.number).toBe(1); // Current page
    expect(result.totalPages).toBe(3);
    expect(result.totalElements).toBe(25);
    expect(mock.history.get[0].params).toEqual({
      searchTerm: "término",
      page: 1,
      size: 10,
    });
  });
});
