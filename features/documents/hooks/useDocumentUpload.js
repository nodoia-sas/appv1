import { useState, useCallback } from "react";
import { documentsService } from "../services/documentsService";

/**
 * Custom hook for managing document upload operations
 * @returns {Object} Upload state and operations
 */
export const useDocumentUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  // Clear error helper
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Handle errors consistently
  const handleError = useCallback((error) => {
    const message = error instanceof Error ? error.message : "Upload failed";
    setError(message);
    console.error("Document upload error:", error);
  }, []);

  // Reset upload state
  const resetUploadState = useCallback(() => {
    setUploading(false);
    setUploadProgress(0);
    setError(null);
  }, []);

  // Upload a new document
  const uploadDocument = useCallback(
    async (documentData, onProgress = null) => {
      setUploading(true);
      setUploadProgress(0);
      setError(null);

      try {
        // Validate document data first
        const validation = documentsService.validateDocumentData(documentData);
        if (!validation.isValid) {
          throw new Error(validation.errors.join(", "));
        }

        // Simulate progress updates if callback provided
        if (onProgress) {
          setUploadProgress(25);
          onProgress(25);
        }

        const result = await documentsService.createDocument(documentData);

        if (onProgress) {
          setUploadProgress(100);
          onProgress(100);
        }

        return result;
      } catch (error) {
        handleError(error);
        throw error;
      } finally {
        setUploading(false);
      }
    },
    [handleError]
  );

  // Update document with new file
  const updateDocumentFile = useCallback(
    async (documentId, updateData, onProgress = null) => {
      setUploading(true);
      setUploadProgress(0);
      setError(null);

      try {
        if (!documentId) {
          throw new Error("Document ID is required for update");
        }

        // Validate file if provided
        if (updateData.file) {
          const validation = documentsService.validateDocumentData({
            type: 1, // dummy type for validation
            name: "dummy", // dummy name for validation
            file: updateData.file,
          });

          if (!validation.isValid) {
            const fileErrors = validation.errors.filter(
              (error) => error.includes("File") || error.includes("file")
            );
            if (fileErrors.length > 0) {
              throw new Error(fileErrors.join(", "));
            }
          }
        }

        // Simulate progress updates if callback provided
        if (onProgress) {
          setUploadProgress(25);
          onProgress(25);
        }

        const result = await documentsService.updateDocument(
          documentId,
          updateData
        );

        if (onProgress) {
          setUploadProgress(100);
          onProgress(100);
        }

        return result;
      } catch (error) {
        handleError(error);
        throw error;
      } finally {
        setUploading(false);
      }
    },
    [handleError]
  );

  // Batch upload multiple documents
  const uploadMultipleDocuments = useCallback(
    async (documentsData, onProgress = null) => {
      setUploading(true);
      setUploadProgress(0);
      setError(null);

      try {
        const results = [];
        const total = documentsData.length;

        for (let i = 0; i < documentsData.length; i++) {
          const documentData = documentsData[i];

          // Validate each document
          const validation =
            documentsService.validateDocumentData(documentData);
          if (!validation.isValid) {
            throw new Error(
              `Document ${i + 1}: ${validation.errors.join(", ")}`
            );
          }

          const result = await documentsService.createDocument(documentData);
          results.push(result);

          // Update progress
          const progress = Math.round(((i + 1) / total) * 100);
          setUploadProgress(progress);
          if (onProgress) {
            onProgress(progress, i + 1, total);
          }
        }

        return results;
      } catch (error) {
        handleError(error);
        throw error;
      } finally {
        setUploading(false);
      }
    },
    [handleError]
  );

  // Check if file is valid for upload
  const validateFile = useCallback((file) => {
    if (!file) {
      return { isValid: false, error: "No file selected" };
    }

    const validation = documentsService.validateDocumentData({
      type: 1, // dummy type
      name: "dummy", // dummy name
      file,
    });

    const fileErrors = validation.errors.filter(
      (error) => error.includes("File") || error.includes("file")
    );

    return {
      isValid: fileErrors.length === 0,
      error: fileErrors.length > 0 ? fileErrors.join(", ") : null,
    };
  }, []);

  // Get file size in human readable format
  const getFileSizeDisplay = useCallback((file) => {
    if (!file || !file.size) return "";

    const bytes = file.size;
    const sizes = ["Bytes", "KB", "MB", "GB"];

    if (bytes === 0) return "0 Bytes";

    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  }, []);

  return {
    // State
    uploading,
    uploadProgress,
    error,

    // Actions
    uploadDocument,
    updateDocumentFile,
    uploadMultipleDocuments,
    resetUploadState,
    clearError,

    // Utilities
    validateFile,
    getFileSizeDisplay,
  };
};
