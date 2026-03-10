import { useState, useCallback } from "react";
import { regulationsService } from "../services/regulationsService";

/**
 * Custom hook for searching regulations
 * @returns {Object} Search state and operations
 */
export const useRegulationSearch = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");

  // Clear error helper
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Handle errors consistently
  const handleError = useCallback((error) => {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    setError(message);
    console.error("Regulation search hook error:", error);
  }, []);

  // Search regulations
  const search = useCallback(
    async (searchQuery, options = {}) => {
      setLoading(true);
      setError(null);
      setQuery(searchQuery);

      try {
        const searchResults = await regulationsService.searchRegulations(
          searchQuery,
          options
        );
        setResults(searchResults);
      } catch (error) {
        handleError(error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  // Clear search results
  const clearSearch = useCallback(() => {
    setResults([]);
    setQuery("");
    setError(null);
  }, []);

  // Search by title
  const searchByTitle = useCallback(
    async (titleQuery) => {
      setLoading(true);
      setError(null);
      setQuery(titleQuery);

      try {
        const allRegulations = await regulationsService.fetchRegulations();
        const filtered = allRegulations.filter((regulation) =>
          regulation.title.toLowerCase().includes(titleQuery.toLowerCase())
        );
        setResults(filtered);
      } catch (error) {
        handleError(error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  // Search by article content
  const searchByArticle = useCallback(
    async (articleQuery) => {
      setLoading(true);
      setError(null);
      setQuery(articleQuery);

      try {
        const allRegulations = await regulationsService.fetchRegulations();
        const filtered = allRegulations.filter((regulation) => {
          if (!regulation.articles || !Array.isArray(regulation.articles)) {
            return false;
          }

          return regulation.articles.some(
            (article) =>
              article.number
                .toLowerCase()
                .includes(articleQuery.toLowerCase()) ||
              article.summary.toLowerCase().includes(articleQuery.toLowerCase())
          );
        });
        setResults(filtered);
      } catch (error) {
        handleError(error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  // Filter results by options
  const filterResults = useCallback(
    (filterOptions) => {
      return results.filter((regulation) => {
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
    [results]
  );

  // Get result count
  const getResultCount = useCallback(() => {
    return results.length;
  }, [results]);

  // Check if has results
  const hasResults = useCallback(() => {
    return results.length > 0;
  }, [results]);

  return {
    // State
    results,
    loading,
    error,
    query,

    // Actions
    search,
    searchByTitle,
    searchByArticle,
    clearSearch,
    clearError,

    // Utilities
    filterResults,
    getResultCount,
    hasResults,
  };
};
