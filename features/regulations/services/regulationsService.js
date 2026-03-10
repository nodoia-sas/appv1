/**
 * Regulations Service
 * Handles business logic and data operations for regulations feature
 */

import { getAllLaws, searchLaws } from "@/src/services/api";
import { ApiError } from "@/src/services/api";

// Storage keys
const STORAGE_KEYS = {
  SELECTED_REGULATION: "transit-selected-regulation",
  RECENT_REGULATIONS: "transit-recent-regulations",
  FAVORITES: "transit-favorite-regulations",
};

/**
 * Regulations Service
 * Provides methods for fetching, searching, and managing regulations (laws)
 */
export const regulationsService = {
  /**
   * Fetch laws from the TransitIA API with pagination
   * @param {number} page - Page number (0-indexed)
   * @param {number} size - Page size (default: 10)
   * @returns {Promise<Object>} Object with laws array and pagination info
   */
  async fetchRegulations(page = 0, size = 10) {
    try {
      // Fetch laws from the API with pagination
      const response = await getAllLaws(page, size);

      // Transform LawDto to match the expected format
      const laws = response.content.map((law) => ({
        id: law.id,
        title: law.title,
        summary: law.description,
        iaExplanation: law.iaExplanation,
        codeId: law.codeId,
        updatedAt: law.updatedAt,
        // Note: articles will need to be fetched separately if needed
        articles: [],
      }));

      // Return laws with pagination info
      return {
        laws,
        pagination: {
          currentPage: response.number,
          totalPages: response.totalPages,
          totalElements: response.totalElements,
          pageSize: response.size,
          isFirst: response.first,
          isLast: response.last,
        },
      };
    } catch (error) {
      console.error("Error fetching laws from API:", error);

      // If API fails, throw error
      if (error instanceof ApiError) {
        throw new Error(`Error al cargar las leyes: ${error.message}`);
      }
      throw new Error(
        "Error al cargar las leyes. Por favor, intenta de nuevo."
      );
    }
  },

  /**
   * Fetch a single law by ID
   * @param {string} regulationId - The law ID
   * @returns {Promise<Object|null>} Law object or null if not found
   */
  async fetchRegulationById(regulationId) {
    const regulations = await this.fetchRegulations();
    return regulations.find((reg) => reg.id === regulationId) || null;
  },

  /**
   * Search laws by query using the TransitIA API
   * @param {string} query - Search query
   * @param {number} page - Page number (0-indexed)
   * @param {number} size - Page size (default: 10)
   * @returns {Promise<Object>} Object with laws array and pagination info
   */
  async searchRegulations(query, page = 0, size = 10) {
    try {
      if (!query || query.trim() === "") {
        // If no query, return all laws
        return await this.fetchRegulations(page, size);
      }

      // Use the API search endpoint
      const response = await searchLaws(query, page, size);

      // Transform results to match expected format
      const laws = response.content.map((law) => ({
        id: law.id,
        title: law.title,
        summary: law.description,
        iaExplanation: law.iaExplanation,
        codeId: law.codeId,
        updatedAt: law.updatedAt,
        articles: [],
      }));

      // Return laws with pagination info
      return {
        laws,
        pagination: {
          currentPage: response.number,
          totalPages: response.totalPages,
          totalElements: response.totalElements,
          pageSize: response.size,
          isFirst: response.first,
          isLast: response.last,
        },
      };
    } catch (error) {
      console.error("Error searching laws:", error);

      if (error instanceof ApiError) {
        throw new Error(`Error al buscar leyes: ${error.message}`);
      }
      throw new Error("Error al buscar leyes. Por favor, intenta de nuevo.");
    }
  },

  /**
   * Filter regulations by options
   * @param {Object} filterOptions - Filter criteria
   * @returns {Promise<Array>} Filtered regulations
   */
  async filterRegulations(filterOptions = {}) {
    const regulations = await this.fetchRegulations();

    return regulations.filter((regulation) => {
      // Filter by hasArticles
      if (filterOptions.hasArticles !== undefined) {
        const hasArticles =
          regulation.articles &&
          Array.isArray(regulation.articles) &&
          regulation.articles.length > 0;
        if (filterOptions.hasArticles !== hasArticles) {
          return false;
        }
      }

      // Filter by category (if implemented in the future)
      if (filterOptions.category && regulation.category) {
        if (regulation.category !== filterOptions.category) {
          return false;
        }
      }

      // Filter by tags (if implemented in the future)
      if (
        filterOptions.tags &&
        filterOptions.tags.length > 0 &&
        regulation.tags
      ) {
        const hasMatchingTag = filterOptions.tags.some((tag) =>
          regulation.tags.includes(tag)
        );
        if (!hasMatchingTag) {
          return false;
        }
      }

      return true;
    });
  },

  /**
   * Save selected regulation to local storage
   * @param {Object} regulation - Regulation to save
   */
  saveSelectedRegulation(regulation) {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem(
          STORAGE_KEYS.SELECTED_REGULATION,
          JSON.stringify(regulation)
        );
      }
    } catch (e) {
      console.error("Failed to save selected regulation:", e);
    }
  },

  /**
   * Get selected regulation from local storage
   * @returns {Object|null} Selected regulation or null
   */
  getSelectedRegulation() {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const raw = localStorage.getItem(STORAGE_KEYS.SELECTED_REGULATION);
        return raw ? JSON.parse(raw) : null;
      }
    } catch (e) {
      console.error("Failed to get selected regulation:", e);
    }
    return null;
  },

  /**
   * Clear selected regulation from local storage
   */
  clearSelectedRegulation() {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.removeItem(STORAGE_KEYS.SELECTED_REGULATION);
      }
    } catch (e) {
      console.error("Failed to clear selected regulation:", e);
    }
  },

  /**
   * Add regulation to recent list
   * @param {Object} regulation - Regulation to add
   * @param {number} maxRecent - Maximum number of recent items to keep
   */
  addToRecent(regulation, maxRecent = 5) {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const recent = this.getRecentRegulations();

        // Remove if already exists
        const filtered = recent.filter((r) => r.id !== regulation.id);

        // Add to beginning
        filtered.unshift(regulation);

        // Keep only maxRecent items
        const trimmed = filtered.slice(0, maxRecent);

        localStorage.setItem(
          STORAGE_KEYS.RECENT_REGULATIONS,
          JSON.stringify(trimmed)
        );
      }
    } catch (e) {
      console.error("Failed to add to recent regulations:", e);
    }
  },

  /**
   * Get recent regulations from local storage
   * @returns {Array} Array of recent regulations
   */
  getRecentRegulations() {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const raw = localStorage.getItem(STORAGE_KEYS.RECENT_REGULATIONS);
        return raw ? JSON.parse(raw) : [];
      }
    } catch (e) {
      console.error("Failed to get recent regulations:", e);
    }
    return [];
  },

  /**
   * Clear recent regulations
   */
  clearRecentRegulations() {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.removeItem(STORAGE_KEYS.RECENT_REGULATIONS);
      }
    } catch (e) {
      console.error("Failed to clear recent regulations:", e);
    }
  },

  /**
   * Get regulation by ID from cache or fetch
   * @param {string} regulationId - The regulation ID
   * @returns {Promise<Object|null>} Regulation object or null
   */
  async getRegulationById(regulationId) {
    return this.fetchRegulationById(regulationId);
  },

  /**
   * Check if regulation has articles
   * @param {Object} regulation - Regulation to check
   * @returns {boolean} True if regulation has articles
   */
  hasArticles(regulation) {
    return (
      regulation &&
      regulation.articles &&
      Array.isArray(regulation.articles) &&
      regulation.articles.length > 0
    );
  },

  /**
   * Get article count for a regulation
   * @param {Object} regulation - Regulation to check
   * @returns {number} Number of articles
   */
  getArticleCount(regulation) {
    if (!this.hasArticles(regulation)) {
      return 0;
    }
    return regulation.articles.length;
  },

  // Export storage keys for use in hooks
  STORAGE_KEYS,
};

export default regulationsService;
