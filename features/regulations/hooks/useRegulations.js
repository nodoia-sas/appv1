import { useState, useEffect, useCallback } from "react";
import { regulationsService } from "../services/regulationsService";

/**
 * Custom hook for managing regulations state and operations
 * @returns {Object} Regulations state and operations
 */
export const useRegulations = () => {
  const [regulations, setRegulations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: 10,
    isFirst: true,
    isLast: false,
  });

  // Clear error helper
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Handle errors consistently
  const handleError = useCallback((error) => {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    setError(message);
    console.error("Regulations hook error:", error);
  }, []);

  // Fetch regulations with pagination
  const fetchRegulations = useCallback(
    async (page = 0, size = 10) => {
      setLoading(true);
      setError(null);

      try {
        const result = await regulationsService.fetchRegulations(page, size);
        setRegulations(result.laws);
        setPagination(result.pagination);
      } catch (error) {
        handleError(error);
        setRegulations([]);
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  // Get regulation by ID
  const getRegulationById = useCallback(
    (regulationId) => {
      return regulations.find((reg) => reg.id === regulationId);
    },
    [regulations]
  );

  // Filter regulations by options
  const filterRegulations = useCallback(
    (filterOptions) => {
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

        // Filter by category (if implemented)
        if (filterOptions.category && regulation.category) {
          if (regulation.category !== filterOptions.category) {
            return false;
          }
        }

        // Filter by tags (if implemented)
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
    [regulations]
  );

  // Get regulations with articles
  const getRegulationsWithArticles = useCallback(() => {
    return regulations.filter((regulation) =>
      regulationsService.hasArticles(regulation)
    );
  }, [regulations]);

  // Get regulations without articles
  const getRegulationsWithoutArticles = useCallback(() => {
    return regulations.filter(
      (regulation) => !regulationsService.hasArticles(regulation)
    );
  }, [regulations]);

  // Get article count for a regulation
  const getArticleCount = useCallback((regulation) => {
    return regulationsService.getArticleCount(regulation);
  }, []);

  // Check if regulation has articles
  const hasArticles = useCallback((regulation) => {
    return regulationsService.hasArticles(regulation);
  }, []);

  // Initial load effect
  useEffect(() => {
    fetchRegulations(0, 10); // Load first page with 10 items
  }, [fetchRegulations]);

  return {
    // State
    regulations,
    loading,
    error,
    pagination,

    // Actions
    fetchRegulations,
    clearError,

    // Utilities
    getRegulationById,
    filterRegulations,
    getRegulationsWithArticles,
    getRegulationsWithoutArticles,
    getArticleCount,
    hasArticles,
  };
};
