import { useState, useEffect, useCallback } from "react";
import { documentsService } from "../services/documentsService";

/**
 * Custom hook for managing documents state and operations
 * @returns {Object} Documents state and operations
 */
export const useDocuments = () => {
  const [documents, setDocuments] = useState([]);
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
    console.error("Documents hook error:", error);
  }, []);

  // Fetch all documents
  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const fetchedDocuments = await documentsService.getDocuments();
      setDocuments(fetchedDocuments);
    } catch (error) {
      handleError(error);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // Fetch personal documents only
  const fetchPersonalDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const personalDocs = await documentsService.getPersonalDocuments();
      setDocuments(personalDocs);
    } catch (error) {
      handleError(error);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // Create a new document
  const createDocument = useCallback(
    async (documentData) => {
      setLoading(true);
      setError(null);

      try {
        const newDocument = await documentsService.createDocument(documentData);
        setDocuments((prev) => [...prev, newDocument]);
        return newDocument;
      } catch (error) {
        handleError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  // Update an existing document
  const updateDocument = useCallback(
    async (documentId, updateData) => {
      setLoading(true);
      setError(null);

      try {
        const updatedDocument = await documentsService.updateDocument(
          documentId,
          updateData
        );
        setDocuments((prev) =>
          prev.map((doc) =>
            doc.id === documentId ? { ...doc, ...updatedDocument } : doc
          )
        );
        return updatedDocument;
      } catch (error) {
        handleError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  // Delete a document
  const deleteDocument = useCallback(
    async (documentId) => {
      setLoading(true);
      setError(null);

      try {
        await documentsService.deleteDocument(documentId);
        setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
      } catch (error) {
        handleError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  // Get document expiry status
  const getDocumentExpiryStatus = useCallback((document, warningDays = 30) => {
    return documentsService.getDocumentExpiryStatus(document, warningDays);
  }, []);

  // Get document type info
  const getDocumentTypeInfo = useCallback((typeId) => {
    return documentsService.getDocumentTypeInfo(typeId);
  }, []);

  // Filter documents by type
  const getDocumentsByType = useCallback(
    (typeId) => {
      return documents.filter((doc) => doc.type === typeId);
    },
    [documents]
  );

  // Get expired documents
  const getExpiredDocuments = useCallback(() => {
    return documents.filter((doc) => {
      const status = documentsService.getDocumentExpiryStatus(doc);
      return status.isExpired;
    });
  }, [documents]);

  // Get expiring soon documents
  const getExpiringSoonDocuments = useCallback(
    (warningDays = 30) => {
      return documents.filter((doc) => {
        const status = documentsService.getDocumentExpiryStatus(
          doc,
          warningDays
        );
        return status.isExpiringSoon;
      });
    },
    [documents]
  );

  // Initial load effect
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return {
    // State
    documents,
    loading,
    error,

    // Actions
    fetchDocuments,
    fetchPersonalDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
    clearError,

    // Utilities
    getDocumentExpiryStatus,
    getDocumentTypeInfo,
    getDocumentsByType,
    getExpiredDocuments,
    getExpiringSoonDocuments,
  };
};
