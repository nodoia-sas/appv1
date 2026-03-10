/**
 * Route Parameter Validation Utilities
 *
 * Provides validation functions for dynamic route parameters
 * to ensure proper handling of invalid IDs and edge cases.
 *
 * Requirements: 6.5, 6.6
 */

/**
 * Validates if a parameter is a valid ID format
 */
export function isValidId(id: string | string[] | undefined): id is string {
  if (!id || Array.isArray(id)) {
    return false;
  }

  // Check if it's a non-empty string
  if (typeof id !== "string" || id.trim().length === 0) {
    return false;
  }

  // Check for common invalid patterns
  const invalidPatterns = [
    /^\.+$/, // Only dots
    /^-+$/, // Only dashes
    /^\s+$/, // Only whitespace
    /[<>:"\\|?*]/, // Invalid filename characters
  ];

  return !invalidPatterns.some((pattern) => pattern.test(id));
}

/**
 * Validates if a numeric ID is valid
 */
export function isValidNumericId(
  id: string | string[] | undefined
): id is string {
  if (!isValidId(id)) {
    return false;
  }

  const numericId = parseInt(id, 10);
  return !isNaN(numericId) && numericId > 0;
}

/**
 * Validates if a string ID matches expected format
 */
export function isValidStringId(
  id: string | string[] | undefined,
  pattern?: RegExp
): id is string {
  if (!isValidId(id)) {
    return false;
  }

  if (pattern) {
    return pattern.test(id);
  }

  // Default pattern: alphanumeric with optional dashes/underscores
  const defaultPattern = /^[a-zA-Z0-9_-]+$/;
  return defaultPattern.test(id);
}

/**
 * Sanitizes an ID parameter by removing potentially harmful characters
 */
export function sanitizeId(id: string): string {
  return id
    .trim()
    .replace(/[<>:"\\|?*]/g, "") // Remove invalid filename characters
    .replace(/\s+/g, "-") // Replace spaces with dashes
    .toLowerCase();
}

/**
 * Creates a validation result object
 */
export interface ValidationResult {
  isValid: boolean;
  sanitizedId?: string;
  error?: string;
}

/**
 * Comprehensive ID validation with sanitization
 */
export function validateAndSanitizeId(
  id: string | string[] | undefined,
  options: {
    type?: "numeric" | "string" | "any";
    pattern?: RegExp;
    maxLength?: number;
  } = {}
): ValidationResult {
  const { type = "any", pattern, maxLength = 100 } = options;

  if (!id || Array.isArray(id)) {
    return {
      isValid: false,
      error: "ID parameter is missing or invalid format",
    };
  }

  if (typeof id !== "string") {
    return {
      isValid: false,
      error: "ID must be a string",
    };
  }

  if (id.length > maxLength) {
    return {
      isValid: false,
      error: `ID exceeds maximum length of ${maxLength} characters`,
    };
  }

  const sanitizedId = sanitizeId(id);

  if (sanitizedId.length === 0) {
    return {
      isValid: false,
      error: "ID cannot be empty after sanitization",
    };
  }

  // Type-specific validation
  switch (type) {
    case "numeric":
      if (!isValidNumericId(sanitizedId)) {
        return {
          isValid: false,
          error: "ID must be a valid positive number",
        };
      }
      break;

    case "string":
      if (!isValidStringId(sanitizedId, pattern)) {
        return {
          isValid: false,
          error: pattern
            ? "ID does not match required pattern"
            : "ID contains invalid characters",
        };
      }
      break;

    case "any":
      if (!isValidId(sanitizedId)) {
        return {
          isValid: false,
          error: "ID format is invalid",
        };
      }
      break;
  }

  return {
    isValid: true,
    sanitizedId,
  };
}
