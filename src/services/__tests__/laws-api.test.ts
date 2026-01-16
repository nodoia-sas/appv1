/**
 * Tests para las funciones de API de Laws
 *
 * Estos tests son para verificar manualmente que la API funciona.
 * Para ejecutar: npm test src/services/__tests__/laws-api.test.ts
 */

import {
  getAllLaws,
  searchLaws,
  getLawById,
  getRegulationsByLawId,
} from "../api";

describe("Laws API Integration", () => {
  // Skip these tests by default since they require the backend to be running
  // To run them, start the backend and change describe.skip to describe

  describe.skip("getAllLaws", () => {
    it("should fetch all laws from the API", async () => {
      const result = await getAllLaws(0, 10);

      expect(result).toBeDefined();
      expect(result.content).toBeInstanceOf(Array);
      expect(result.totalElements).toBeGreaterThanOrEqual(0);

      console.log("Total laws:", result.totalElements);
      console.log("First law:", result.content[0]);
    });
  });

  describe.skip("searchLaws", () => {
    it("should search laws by query", async () => {
      const result = await searchLaws("tránsito", 0);

      expect(result).toBeDefined();
      expect(result.content).toBeInstanceOf(Array);

      console.log("Search results:", result.content.length);
      console.log("First result:", result.content[0]);
    });

    it("should return all laws when query is empty", async () => {
      const result = await searchLaws("", 0);

      expect(result).toBeDefined();
      expect(result.content).toBeInstanceOf(Array);

      console.log("All laws (no query):", result.content.length);
    });
  });

  describe.skip("getLawById", () => {
    it("should fetch a specific law by ID", async () => {
      // First get all laws to get a valid ID
      const allLaws = await getAllLaws(0, 1);

      if (allLaws.content.length > 0) {
        const lawId = allLaws.content[0].id;
        const law = await getLawById(lawId);

        expect(law).toBeDefined();
        expect(law.id).toBe(lawId);

        console.log("Law details:", law);
      }
    });

    it("should throw error for non-existent law", async () => {
      await expect(getLawById("non-existent-id")).rejects.toThrow();
    });
  });

  describe.skip("getRegulationsByLawId", () => {
    it("should fetch regulations for a specific law", async () => {
      // First get all laws to get a valid ID
      const allLaws = await getAllLaws(0, 1);

      if (allLaws.content.length > 0) {
        const lawId = allLaws.content[0].id;
        const regulations = await getRegulationsByLawId(lawId, 0);

        expect(regulations).toBeDefined();
        expect(regulations.content).toBeInstanceOf(Array);

        console.log("Regulations for law:", regulations.content.length);
        console.log("First regulation:", regulations.content[0]);
      }
    });
  });
});
