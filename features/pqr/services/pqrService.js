/**
 * PQR Service
 * Handles PQR (Preguntas, Quejas y Reclamos) data management
 */

const PQR_STORAGE_KEY = "transit-pqrs";

/**
 * Fetch all PQRs from localStorage
 * @returns {Array} List of PQRs
 */
export function fetchPqrs() {
  try {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem(PQR_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    }
    return [];
  } catch (e) {
    console.error("Failed to fetch PQRs:", e);
    return [];
  }
}

/**
 * Add a new PQR
 * @param {Object} pqr - PQR data to add
 * @returns {Array|null} Updated list of PQRs or null on error
 */
export function addPqr(pqr) {
  try {
    if (typeof window !== "undefined") {
      const current = fetchPqrs();
      const newPqr = {
        ...pqr,
        id: Date.now(),
        timestamp: new Date().toISOString(),
      };
      const updated = [...current, newPqr];
      localStorage.setItem(PQR_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    }
    return null;
  } catch (e) {
    console.error("Failed to add PQR:", e);
    return null;
  }
}

/**
 * Clear all PQRs from localStorage
 * @returns {Array|null} Empty array on success or null on error
 */
export function clearPqrs() {
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem(PQR_STORAGE_KEY);
      return [];
    }
    return null;
  } catch (e) {
    console.error("Failed to clear PQRs:", e);
    return null;
  }
}

export const pqrService = {
  fetchPqrs,
  addPqr,
  clearPqrs,
};
