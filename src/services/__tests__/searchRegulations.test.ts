/**
 * @jest-environment jsdom
 */
import MockAdapter from "axios-mock-adapter";
import apiClient, { searchRegulations } from "../api";
import { Page, RegulationDto } from "../../types/transit-models";

describe("searchRegulations", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.restore();
  });

  it("should call /regulations/search with correct query parameters", async () => {
    const mockResponse: Page<RegulationDto> = {
      content: [
        {
          id: "1",
          lawId: "law-1",
          title: "Test Regulation",
          codeId: "ART-001",
          articleNumber: "1",
          content: "Test content",
          active: true,
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

    mock.onGet("/regulations/search").reply(200, mockResponse);

    const result = await searchRegulations("velocidad", 0);

    expect(result).toEqual(mockResponse);
    expect(mock.history.get.length).toBe(1);
    expect(mock.history.get[0].params).toEqual({ q: "velocidad", page: 0 });
  });

  it("should use default page number 0 when not provided", async () => {
    const mockResponse: Page<RegulationDto> = {
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

    mock.onGet("/regulations/search").reply(200, mockResponse);

    await searchRegulations("test");

    expect(mock.history.get[0].params).toEqual({ q: "test", page: 0 });
  });

  it("should handle different page numbers", async () => {
    const mockResponse: Page<RegulationDto> = {
      content: [],
      pageable: {
        pageNumber: 2,
        pageSize: 10,
        sort: { empty: true, sorted: false, unsorted: true },
        offset: 20,
        paged: true,
        unpaged: false,
      },
      totalPages: 5,
      totalElements: 50,
      last: false,
      size: 10,
      number: 2,
      sort: { empty: true, sorted: false, unsorted: true },
      numberOfElements: 10,
      first: false,
      empty: false,
    };

    mock.onGet("/regulations/search").reply(200, mockResponse);

    const result = await searchRegulations("multa", 2);

    expect(result.number).toBe(2);
    expect(mock.history.get[0].params).toEqual({ q: "multa", page: 2 });
  });

  it("should throw ApiError when request fails", async () => {
    mock.onGet("/regulations/search").reply(500);

    await expect(searchRegulations("test", 0)).rejects.toThrow();
  });

  it("should throw ApiError with 404 when not found", async () => {
    mock.onGet("/regulations/search").reply(404);

    await expect(searchRegulations("nonexistent", 0)).rejects.toThrow();
  });
});
