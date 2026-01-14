import { useState, useCallback, useMemo } from "react";
import { vehiclesService } from "../services/vehiclesService";

/**
 * Custom hook for managing vehicle documents
 * @param {Object} vehicle - Vehicle object
 * @returns {Object} Vehicle documents state and operations
 */
export const useVehicleDocuments = (vehicle) => {
  const [documentStatus, setDocumentStatus] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Handle error
  const handleError = useCallback((error) => {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    setError(message);
    console.error("Vehicle documents error:", error);
  }, []);

  // Get vehicle documents
  const documents = useMemo(() => {
    return vehicle?.documents || [];
  }, [vehicle]);

  // Get document by type
  const getDocumentByType = useCallback(
    (documentTypeId) => {
      return vehiclesService.findVehicleDocumentByType(vehicle, documentTypeId);
    },
    [vehicle]
  );

  // Get SOAT document
  const getSOATDocument = useCallback(() => {
    return getDocumentByType(vehiclesService.VEHICLE_DOCUMENT_TYPES.SOAT);
  }, [getDocumentByType]);

  // Get Property Card document
  const getPropertyCardDocument = useCallback(() => {
    return getDocumentByType(
      vehiclesService.VEHICLE_DOCUMENT_TYPES.PROPERTY_CARD
    );
  }, [getDocumentByType]);

  // Get Technical Inspection document
  const getTechnicalInspectionDocument = useCallback(() => {
    return getDocumentByType(
      vehiclesService.VEHICLE_DOCUMENT_TYPES.TECHNICAL_INSPECTION
    );
  }, [getDocumentByType]);

  // Check if document is expired
  const isDocumentExpired = useCallback((document) => {
    if (!document || !document.expirationAt) {
      return false;
    }

    const expiryDate = new Date(document.expirationAt);
    const now = new Date();
    return expiryDate < now;
  }, []);

  // Check if document is expiring soon
  const isDocumentExpiringSoon = useCallback((document, warningDays = 30) => {
    if (!document || !document.expirationAt) {
      return false;
    }

    const expiryDate = new Date(document.expirationAt);
    const now = new Date();
    const timeDiff = expiryDate.getTime() - now.getTime();
    const daysUntilExpiry = Math.ceil(timeDiff / (1000 * 3600 * 24));

    return daysUntilExpiry >= 0 && daysUntilExpiry <= warningDays;
  }, []);

  // Get days until document expiry
  const getDaysUntilExpiry = useCallback((document) => {
    if (!document || !document.expirationAt) {
      return null;
    }

    const expiryDate = new Date(document.expirationAt);
    const now = new Date();
    const timeDiff = expiryDate.getTime() - now.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }, []);

  // Get document status (expired, expiring soon, valid)
  const getDocumentStatus = useCallback(
    (document, warningDays = 30) => {
      if (!document) {
        return { status: "missing", message: "Document not uploaded" };
      }

      if (!document.expirationAt) {
        return { status: "valid", message: "Document uploaded" };
      }

      const isExpired = isDocumentExpired(document);
      const isExpiringSoon = isDocumentExpiringSoon(document, warningDays);
      const daysUntilExpiry = getDaysUntilExpiry(document);

      if (isExpired) {
        return {
          status: "expired",
          message: `Expired ${Math.abs(daysUntilExpiry)} days ago`,
        };
      }

      if (isExpiringSoon) {
        return {
          status: "expiring",
          message: `Expires in ${daysUntilExpiry} days`,
        };
      }

      return {
        status: "valid",
        message: `Valid for ${daysUntilExpiry} days`,
      };
    },
    [isDocumentExpired, isDocumentExpiringSoon, getDaysUntilExpiry]
  );

  // Get all document statuses
  const getAllDocumentStatuses = useCallback(
    (warningDays = 30) => {
      const soat = getSOATDocument();
      const propertyCard = getPropertyCardDocument();
      const technicalInspection = getTechnicalInspectionDocument();

      return {
        soat: getDocumentStatus(soat, warningDays),
        propertyCard: getDocumentStatus(propertyCard, warningDays),
        technicalInspection: getDocumentStatus(
          technicalInspection,
          warningDays
        ),
      };
    },
    [
      getSOATDocument,
      getPropertyCardDocument,
      getTechnicalInspectionDocument,
      getDocumentStatus,
    ]
  );

  // Check if vehicle has any expired documents
  const hasExpiredDocuments = useMemo(() => {
    return documents.some((doc) => isDocumentExpired(doc));
  }, [documents, isDocumentExpired]);

  // Check if vehicle has any expiring soon documents
  const hasExpiringSoonDocuments = useCallback(
    (warningDays = 30) => {
      return documents.some((doc) => isDocumentExpiringSoon(doc, warningDays));
    },
    [documents, isDocumentExpiringSoon]
  );

  // Get expired documents
  const getExpiredDocuments = useMemo(() => {
    return documents.filter((doc) => isDocumentExpired(doc));
  }, [documents, isDocumentExpired]);

  // Get expiring soon documents
  const getExpiringSoonDocuments = useCallback(
    (warningDays = 30) => {
      return documents.filter((doc) =>
        isDocumentExpiringSoon(doc, warningDays)
      );
    },
    [documents, isDocumentExpiringSoon]
  );

  // Get required document types for vehicle category
  const getRequiredDocumentTypes = useCallback(() => {
    if (!vehicle?.vehicleCategory?.id && !vehicle?.vehicleCategoryId) {
      return [];
    }

    const categoryId = vehicle.vehicleCategory?.id || vehicle.vehicleCategoryId;
    const categoryInfo = vehiclesService.getVehicleCategoryInfo(categoryId);
    return categoryInfo.documentTypes || [];
  }, [vehicle]);

  // Check if all required documents are uploaded
  const hasAllRequiredDocuments = useMemo(() => {
    const requiredTypes = getRequiredDocumentTypes();
    return requiredTypes.every((typeId) => {
      return documents.some((doc) => doc.type === typeId);
    });
  }, [documents, getRequiredDocumentTypes]);

  // Get missing required documents
  const getMissingRequiredDocuments = useMemo(() => {
    const requiredTypes = getRequiredDocumentTypes();
    return requiredTypes.filter((typeId) => {
      return !documents.some((doc) => doc.type === typeId);
    });
  }, [documents, getRequiredDocumentTypes]);

  // Get document type name
  const getDocumentTypeName = useCallback((documentTypeId) => {
    const typeNames = {
      [vehiclesService.VEHICLE_DOCUMENT_TYPES.SOAT]: "SOAT",
      [vehiclesService.VEHICLE_DOCUMENT_TYPES.PROPERTY_CARD]:
        "Tarjeta de Propiedad",
      [vehiclesService.VEHICLE_DOCUMENT_TYPES.TECHNICAL_INSPECTION]:
        "Técnico Mecánica",
    };

    return typeNames[documentTypeId] || "Unknown Document";
  }, []);

  return {
    // State
    documents,
    documentStatus,
    loading,
    error,

    // Document getters
    getDocumentByType,
    getSOATDocument,
    getPropertyCardDocument,
    getTechnicalInspectionDocument,

    // Status checkers
    isDocumentExpired,
    isDocumentExpiringSoon,
    getDaysUntilExpiry,
    getDocumentStatus,
    getAllDocumentStatuses,

    // Vehicle-level status
    hasExpiredDocuments,
    hasExpiringSoonDocuments,
    getExpiredDocuments,
    getExpiringSoonDocuments,

    // Required documents
    getRequiredDocumentTypes,
    hasAllRequiredDocuments,
    getMissingRequiredDocuments,

    // Utilities
    getDocumentTypeName,
    clearError,

    // Constants
    VEHICLE_DOCUMENT_TYPES: vehiclesService.VEHICLE_DOCUMENT_TYPES,
  };
};
