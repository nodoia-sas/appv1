import { useState, useCallback, useEffect } from "react";
import { regulationsService } from "../services/regulationsService";

/**
 * Custom hook for managing regulation detail state and operations
 * @param {string} initialRegulationId - Optional initial regulation ID to load
 * @returns {Object} Regulation detail state and operations
 */
export const useRegulationDetail = (initialRegulationId = null) => {
  const [regulation, setRegulation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Clear error helper
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Handle errors consistently
  const handleError = useCallback((error) => {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    setError(message);
    console.error("Regulation detail hook error:", error);
  }, []);

  // Fetch regulation by ID
  const fetchRegulation = useCallback(
    async (regulationId) => {
      if (!regulationId) {
        setRegulation(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const fetchedRegulation = await regulationsService.fetchRegulationById(
          regulationId
        );

        if (fetchedRegulation) {
          setRegulation(fetchedRegulation);
          // Add to recent regulations
          regulationsService.addToRecent(fetchedRegulation);
        } else {
          setRegulation(null);
          setError(`Regulation with ID "${regulationId}" not found`);
        }
      } catch (error) {
        handleError(error);
        setRegulation(null);
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  // Save regulation selection to storage
  const saveSelection = useCallback((regulation) => {
    try {
      regulationsService.saveSelectedRegulation(regulation);
      setRegulation(regulation);
    } catch (error) {
      console.error("Failed to save regulation selection:", error);
    }
  }, []);

  // Clear regulation selection
  const clearSelection = useCallback(() => {
    try {
      regulationsService.clearSelectedRegulation();
      setRegulation(null);
    } catch (error) {
      console.error("Failed to clear regulation selection:", error);
    }
  }, []);

  // Load saved regulation from storage
  const loadSavedRegulation = useCallback(() => {
    try {
      const savedRegulation = regulationsService.getSelectedRegulation();
      if (savedRegulation) {
        setRegulation(savedRegulation);
      }
    } catch (error) {
      console.error("Failed to load saved regulation:", error);
    }
  }, []);

  // Get recent regulations
  const getRecentRegulations = useCallback(() => {
    return regulationsService.getRecentRegulations();
  }, []);

  // Check if regulation has articles
  const hasArticles = useCallback(() => {
    return regulationsService.hasArticles(regulation);
  }, [regulation]);

  // Get article count
  const getArticleCount = useCallback(() => {
    return regulationsService.getArticleCount(regulation);
  }, [regulation]);

  // Initial load effect
  useEffect(() => {
    if (initialRegulationId) {
      fetchRegulation(initialRegulationId);
    } else {
      // Try to load saved regulation
      loadSavedRegulation();
    }
  }, [initialRegulationId, fetchRegulation, loadSavedRegulation]);

  return {
    // State
    regulation,
    loading,
    error,

    // Actions
    fetchRegulation,
    saveSelection,
    clearSelection,
    clearError,

    // Utilities
    loadSavedRegulation,
    getRecentRegulations,
    hasArticles,
    getArticleCount,
  };
};
