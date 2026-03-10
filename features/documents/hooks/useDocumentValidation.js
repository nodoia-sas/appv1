import { useState, useCallback, useMemo } from "react";
import { documentsService } from "../services/documentsService";

/**
 * Custom hook for document validation operations
 * @returns {Object} Validation state and operations
 */
export const useDocumentValidation = () => {
  const [validationErrors, setValidationErrors] = useState({});
  const [isValidating, setIsValidating] = useState(false);

  // Clear validation errors
  const clearValidationErrors = useCallback((field = null) => {
    if (field) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    } else {
      setValidationErrors({});
    }
  }, []);

  // Set validation error for a specific field
  const setValidationError = useCallback((field, error) => {
    setValidationErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  }, []);

  // Validate document data
  const validateDocument = useCallback((documentData) => {
    setIsValidating(true);

    try {
      const validation = documentsService.validateDocumentData(documentData);

      // Clear previous errors
      setValidationErrors({});

      // Set field-specific errors
      if (!validation.isValid) {
        const fieldErrors = {};

        validation.errors.forEach((error) => {
          if (error.includes("type")) {
            fieldErrors.type = error;
          } else if (error.includes("name")) {
            fieldErrors.name = error;
          } else if (error.includes("file") || error.includes("File")) {
            fieldErrors.file = error;
          } else if (error.includes("expiration") || error.includes("date")) {
            fieldErrors.expirationAt = error;
          } else {
            fieldErrors.general = error;
          }
        });

        setValidationErrors(fieldErrors);
      }

      return validation;
    } finally {
      setIsValidating(false);
    }
  }, []);

  // Validate individual field
  const validateField = useCallback(
    (field, value, documentData = {}) => {
      const testData = { ...documentData, [field]: value };
      const validation = documentsService.validateDocumentData(testData);

      // Find errors related to this field
      const fieldErrors = validation.errors.filter((error) => {
        switch (field) {
          case "type":
            return error.includes("type");
          case "name":
            return error.includes("name");
          case "file":
            return error.includes("file") || error.includes("File");
          case "expirationAt":
            return error.includes("expiration") || error.includes("date");
          default:
            return false;
        }
      });

      if (fieldErrors.length > 0) {
        setValidationError(field, fieldErrors[0]);
        return false;
      } else {
        clearValidationErrors(field);
        return true;
      }
    },
    [setValidationError, clearValidationErrors]
  );

  // Real-time validation for form fields
  const validateDocumentType = useCallback(
    (type) => {
      return validateField("type", type);
    },
    [validateField]
  );

  const validateDocumentName = useCallback(
    (name) => {
      return validateField("name", name);
    },
    [validateField]
  );

  const validateDocumentFile = useCallback(
    (file) => {
      return validateField("file", file);
    },
    [validateField]
  );

  const validateExpirationDate = useCallback(
    (expirationAt) => {
      return validateField("expirationAt", expirationAt);
    },
    [validateField]
  );

  // Check if document type requires expiration date
  const requiresExpirationDate = useCallback((typeId) => {
    const typeInfo = documentsService.getDocumentTypeInfo(typeId);
    return typeInfo.requiresExpiry;
  }, []);

  // Get validation rules for document type
  const getValidationRules = useCallback((typeId) => {
    const typeInfo = documentsService.getDocumentTypeInfo(typeId);

    return {
      nameRequired: true,
      fileRequired: true,
      expirationRequired: typeInfo.requiresExpiry,
      allowedFileTypes: [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "application/pdf",
      ],
      maxFileSize: 10 * 1024 * 1024, // 10MB
      category: typeInfo.category,
    };
  }, []);

  // Check if form has any validation errors
  const hasValidationErrors = useMemo(() => {
    return Object.keys(validationErrors).length > 0;
  }, [validationErrors]);

  // Get all validation error messages
  const getAllErrorMessages = useMemo(() => {
    return Object.values(validationErrors).filter(Boolean);
  }, [validationErrors]);

  // Validate expiration date specifically
  const validateExpirationDateValue = useCallback((dateString) => {
    if (!dateString) return { isValid: true, error: null };

    const date = new Date(dateString);
    const now = new Date();

    if (isNaN(date.getTime())) {
      return { isValid: false, error: "Invalid date format" };
    }

    if (date < now) {
      return { isValid: false, error: "Expiration date cannot be in the past" };
    }

    // Check if date is too far in the future (e.g., more than 50 years)
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 50);

    if (date > maxDate) {
      return {
        isValid: false,
        error: "Expiration date is too far in the future",
      };
    }

    return { isValid: true, error: null };
  }, []);

  // Format validation error for display
  const formatValidationError = useCallback((error) => {
    if (!error) return "";

    // Make error messages more user-friendly
    return error
      .replace(/Document type/g, "Tipo de documento")
      .replace(/Document name/g, "Nombre del documento")
      .replace(/Document file/g, "Archivo del documento")
      .replace(/File must be/g, "El archivo debe ser")
      .replace(/File size must be/g, "El tamaño del archivo debe ser")
      .replace(/Expiration date/g, "Fecha de vencimiento")
      .replace(/is required/g, "es requerido")
      .replace(/cannot be in the past/g, "no puede estar en el pasado");
  }, []);

  return {
    // State
    validationErrors,
    isValidating,
    hasValidationErrors,

    // Actions
    validateDocument,
    validateField,
    validateDocumentType,
    validateDocumentName,
    validateDocumentFile,
    validateExpirationDate,
    clearValidationErrors,
    setValidationError,

    // Utilities
    requiresExpirationDate,
    getValidationRules,
    getAllErrorMessages,
    validateExpirationDateValue,
    formatValidationError,
  };
};
