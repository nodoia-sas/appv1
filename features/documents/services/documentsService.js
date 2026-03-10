/**
 * Documents Service
 * Encapsulates all API calls and business logic for document operations
 */

/**
 * Fetches all documents for the current user
 * @returns {Promise<Array>} Array of document objects
 */
export const getDocuments = async () => {
  try {
    const response = await fetch("/api/hooks/documents/list");

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      throw new Error(
        `Failed to fetch documents (${response.status}): ${errorText}`
      );
    }

    const data = await response.json().catch(() => null);
    const documents = Array.isArray(data) ? data : data?.data || [];

    return documents;
  } catch (error) {
    console.error("getDocuments failed:", error);
    throw new Error(`Error fetching documents: ${error.message}`);
  }
};

/**
 * Fetches personal documents (non-vehicle documents)
 * @returns {Promise<Array>} Array of personal document objects
 */
export const getPersonalDocuments = async () => {
  try {
    const allDocuments = await getDocuments();
    return allDocuments.filter((doc) => !doc.vehicleId);
  } catch (error) {
    console.error("getPersonalDocuments failed:", error);
    throw error;
  }
};

/**
 * Creates a new document
 * @param {Object} documentData - Document data
 * @param {number} documentData.type - Document type ID
 * @param {string} documentData.name - Document name
 * @param {File} documentData.file - Document file
 * @param {string} [documentData.expirationAt] - Expiration date (ISO string)
 * @param {string} [documentData.description] - Additional description
 * @returns {Promise<Object>} Created document object
 */
export const createDocument = async (documentData) => {
  try {
    const { type, name, file, expirationAt, description } = documentData;

    if (!type || !name || !file) {
      throw new Error(
        "Missing required fields: type, name, and file are required"
      );
    }

    const formData = new FormData();
    formData.append("type", type);
    formData.append("name", name);
    formData.append("file", file);

    if (expirationAt) {
      formData.append("expirationAt", expirationAt);
    }

    if (description) {
      formData.append("description", description);
    }

    const response = await fetch("/api/hooks/documents/add", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      throw new Error(
        `Failed to create document (${response.status}): ${errorText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("createDocument failed:", error);
    throw new Error(`Error creating document: ${error.message}`);
  }
};

/**
 * Updates an existing document
 * @param {string} documentId - Document ID
 * @param {Object} updateData - Update data
 * @param {File} [updateData.file] - New document file
 * @param {string} [updateData.expirationAt] - New expiration date (ISO string)
 * @returns {Promise<Object>} Updated document object
 */
export const updateDocument = async (documentId, updateData) => {
  try {
    if (!documentId) {
      throw new Error("Document ID is required");
    }

    const { file, expirationAt } = updateData;

    const formData = new FormData();

    if (file) {
      formData.append("file", file);
    }

    if (expirationAt) {
      formData.append("expirationAt", expirationAt);
    }

    const response = await fetch(`/api/hooks/documents/edit?id=${documentId}`, {
      method: "PATCH",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      throw new Error(
        `Failed to update document (${response.status}): ${errorText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("updateDocument failed:", error);
    throw new Error(`Error updating document: ${error.message}`);
  }
};

/**
 * Deletes a document
 * @param {string} documentId - Document ID
 * @returns {Promise<void>}
 */
export const deleteDocument = async (documentId) => {
  try {
    if (!documentId) {
      throw new Error("Document ID is required");
    }

    const response = await fetch(
      `/api/hooks/documents/delete?id=${documentId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      throw new Error(
        `Failed to delete document (${response.status}): ${errorText}`
      );
    }

    return;
  } catch (error) {
    console.error("deleteDocument failed:", error);
    throw new Error(`Error deleting document: ${error.message}`);
  }
};

/**
 * Validates document data before submission
 * @param {Object} documentData - Document data to validate
 * @returns {Object} Validation result with isValid boolean and errors array
 */
export const validateDocumentData = (documentData) => {
  const errors = [];
  const { type, name, file, expirationAt } = documentData;

  if (!type) {
    errors.push("Document type is required");
  }

  if (!name || name.trim().length === 0) {
    errors.push("Document name is required");
  }

  if (!file) {
    errors.push("Document file is required");
  } else {
    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.type)) {
      errors.push("File must be an image (JPEG, PNG, GIF) or PDF");
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      errors.push("File size must be less than 10MB");
    }
  }

  if (expirationAt) {
    const expiryDate = new Date(expirationAt);
    const now = new Date();

    if (isNaN(expiryDate.getTime())) {
      errors.push("Invalid expiration date");
    } else if (expiryDate < now) {
      errors.push("Expiration date cannot be in the past");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Gets document type information
 * @param {number} typeId - Document type ID
 * @returns {Object} Document type information
 */
export const getDocumentTypeInfo = (typeId) => {
  const documentTypes = {
    1: { name: "SOAT", requiresExpiry: true, category: "vehicle" },
    2: {
      name: "Tarjeta de Propiedad",
      requiresExpiry: false,
      category: "vehicle",
    },
    3: { name: "Técnico Mecánica", requiresExpiry: true, category: "vehicle" },
    4: {
      name: "Cédula de Ciudadanía",
      requiresExpiry: false,
      category: "personal",
    },
    5: { name: "Pasaporte", requiresExpiry: true, category: "personal" },
    6: {
      name: "Licencia de Conducción",
      requiresExpiry: true,
      category: "personal",
    },
  };

  return (
    documentTypes[typeId] || {
      name: "Unknown",
      requiresExpiry: false,
      category: "unknown",
    }
  );
};

/**
 * Checks if a document is expired or expiring soon
 * @param {Object} document - Document object
 * @param {number} [warningDays=30] - Days before expiry to show warning
 * @returns {Object} Expiry status with isExpired, isExpiringSoon, and daysUntilExpiry
 */
export const getDocumentExpiryStatus = (document, warningDays = 30) => {
  if (!document.expirationAt) {
    return { isExpired: false, isExpiringSoon: false, daysUntilExpiry: null };
  }

  const expiryDate = new Date(document.expirationAt);
  const now = new Date();
  const timeDiff = expiryDate.getTime() - now.getTime();
  const daysUntilExpiry = Math.ceil(timeDiff / (1000 * 3600 * 24));

  return {
    isExpired: daysUntilExpiry < 0,
    isExpiringSoon: daysUntilExpiry >= 0 && daysUntilExpiry <= warningDays,
    daysUntilExpiry,
  };
};

// Default export with all service functions
export const documentsService = {
  getDocuments,
  getPersonalDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
  validateDocumentData,
  getDocumentTypeInfo,
  getDocumentExpiryStatus,
};
