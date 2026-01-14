/**
 * Regulations Service
 * Handles business logic and data operations for regulations feature
 */

// Default regulations data
const DEFAULT_REGULATIONS = [
  {
    id: "ley769",
    title: "Ley 769 de 2002 - Código Nacional de Tránsito",
    summary:
      "Establece las normas de comportamiento para conductores, pasajeros, peatones y ciclistas en las vías públicas y privadas abiertas al público.",
    articles: [
      {
        number: "21",
        summary:
          "Obligatoriedad de la licencia de conducción y su presentación.",
      },
      {
        number: "25",
        summary:
          "Uso obligatorio del cinturón de seguridad para todos los ocupantes del vehículo.",
      },
      {
        number: "55",
        summary:
          "Comportamiento de conductores y pasajeros en la vía, incluyendo prohibiciones.",
      },
      {
        number: "131",
        summary:
          "Clasificación de las infracciones de tránsito y sus respectivas sanciones.",
      },
    ],
  },
  {
    id: "res3027",
    title: "Resolución 3027 de 2010 - Manual de Señalización Vial",
    summary:
      "Define las características y el uso de la señalización vial en Colombia para garantizar la seguridad y fluidez del tránsito.",
    articles: [
      {
        number: "5",
        summary:
          "Clasificación general de las señales de tránsito (reglamentarias, preventivas, informativas, transitorias).",
      },
      {
        number: "10",
        summary:
          "Características de las señales reglamentarias (forma, color, significado).",
      },
      {
        number: "15",
        summary:
          "Características de las señales preventivas (forma, color, significado).",
      },
    ],
  },
  {
    id: "decreto1079",
    title:
      "Decreto 1079 de 2015 - Decreto Único Reglamentario del Sector Transporte",
    summary:
      "Compila y racionaliza las normas de carácter reglamentario que rigen el sector transporte en Colombia.",
    articles: [
      {
        number: "2.3.1.5.1",
        summary:
          "Regulación sobre la presentación de documentos de tránsito en formato digital.",
      },
      {
        number: "2.3.1.5.2",
        summary:
          "Disposiciones sobre la revisión técnico-mecánica y de emisiones contaminantes.",
      },
    ],
  },
];

// Storage keys
const STORAGE_KEYS = {
  SELECTED_REGULATION: "transit-selected-regulation",
  RECENT_REGULATIONS: "transit-recent-regulations",
  FAVORITES: "transit-favorite-regulations",
};

/**
 * Regulations Service
 * Provides methods for fetching, searching, and managing regulations
 */
export const regulationsService = {
  /**
   * Fetch all regulations
   * @returns {Promise<Array>} Array of regulation objects
   */
  async fetchRegulations() {
    // Stub for future API calls
    // In production, this would call an actual API endpoint
    return Promise.resolve(DEFAULT_REGULATIONS);
  },

  /**
   * Fetch a single regulation by ID
   * @param {string} regulationId - The regulation ID
   * @returns {Promise<Object|null>} Regulation object or null if not found
   */
  async fetchRegulationById(regulationId) {
    const regulations = await this.fetchRegulations();
    return regulations.find((reg) => reg.id === regulationId) || null;
  },

  /**
   * Search regulations by query
   * @param {string} query - Search query
   * @param {Object} options - Search options
   * @returns {Promise<Array>} Filtered regulations
   */
  async searchRegulations(query, options = {}) {
    const regulations = await this.fetchRegulations();

    if (!query || query.trim() === "") {
      return regulations;
    }

    const lowerQuery = query.toLowerCase();

    return regulations.filter((regulation) => {
      const titleMatch = regulation.title.toLowerCase().includes(lowerQuery);
      const summaryMatch = regulation.summary
        .toLowerCase()
        .includes(lowerQuery);
      const articlesMatch =
        regulation.articles &&
        regulation.articles.some(
          (article) =>
            article.number.toLowerCase().includes(lowerQuery) ||
            article.summary.toLowerCase().includes(lowerQuery)
        );

      return titleMatch || summaryMatch || articlesMatch;
    });
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
