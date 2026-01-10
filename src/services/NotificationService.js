/**
 * NotificationService - Handles notification logic and message formatting
 *
 * This service encapsulates all notification-related business logic,
 * including message formatting, type validation, and display management.
 *
 * Requirements: 6.3, 6.4
 */

class NotificationService {
  constructor() {
    this.defaultDuration = 3000; // 3 seconds
    this.validTypes = ["success", "error", "warning", "info"];
  }

  /**
   * Creates a formatted notification object
   * @param {string} message - The notification message
   * @param {string} type - The notification type (success, error, warning, info)
   * @param {number} duration - Duration in milliseconds (optional, defaults to 3000)
   * @returns {Object} Formatted notification object
   */
  createNotification(
    message,
    type = "success",
    duration = this.defaultDuration
  ) {
    // Validate message
    if (!message || typeof message !== "string") {
      throw new Error("Notification message must be a non-empty string");
    }

    // Validate and normalize type
    const normalizedType = this.validateAndNormalizeType(type);

    // Validate duration
    const validatedDuration = this.validateDuration(duration);

    return {
      message: message.trim(),
      type: normalizedType,
      visible: true,
      duration: validatedDuration,
      timestamp: Date.now(),
      id: this.generateNotificationId(),
    };
  }

  /**
   * Validates and normalizes notification type
   * @param {string} type - The notification type
   * @returns {string} Normalized type
   */
  validateAndNormalizeType(type) {
    if (!type || typeof type !== "string") {
      return "info"; // default fallback
    }

    const normalizedType = type.toLowerCase().trim();

    if (!this.validTypes.includes(normalizedType)) {
      return "info"; // fallback for invalid types
    }

    return normalizedType;
  }

  /**
   * Validates notification duration
   * @param {number} duration - Duration in milliseconds
   * @returns {number} Validated duration
   */
  validateDuration(duration) {
    if (typeof duration !== "number" || duration < 0) {
      return this.defaultDuration;
    }

    // Ensure reasonable bounds (minimum 500ms, maximum 30 seconds)
    if (duration < 500) {
      return 500;
    }

    if (duration > 30000) {
      return 30000;
    }

    return duration;
  }

  /**
   * Generates a unique notification ID
   * @returns {string} Unique notification ID
   */
  generateNotificationId() {
    return `notification_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
  }

  /**
   * Formats notification message for display
   * @param {string} message - Raw message
   * @param {string} type - Notification type
   * @returns {string} Formatted message
   */
  formatMessage(message, type) {
    if (!message) return "";

    // Trim whitespace
    let formattedMessage = message.trim();

    // Ensure message ends with appropriate punctuation for certain types
    if (type === "error" && !formattedMessage.match(/[.!?]$/)) {
      formattedMessage += ".";
    }

    return formattedMessage;
  }

  /**
   * Creates a notification with auto-hide functionality
   * @param {string} message - The notification message
   * @param {string} type - The notification type
   * @param {Function} hideCallback - Callback to hide the notification
   * @param {number} duration - Duration before auto-hide (optional)
   * @returns {Object} Notification object with timeout ID
   */
  createNotificationWithAutoHide(
    message,
    type = "success",
    hideCallback,
    duration = this.defaultDuration
  ) {
    const notification = this.createNotification(message, type, duration);

    if (typeof hideCallback !== "function") {
      throw new Error("hideCallback must be a function");
    }

    // Set up auto-hide timer
    const timeoutId = setTimeout(() => {
      hideCallback();
    }, notification.duration);

    return {
      ...notification,
      timeoutId,
    };
  }

  /**
   * Cancels auto-hide for a notification
   * @param {number} timeoutId - The timeout ID to cancel
   */
  cancelAutoHide(timeoutId) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Gets the appropriate icon class for a notification type
   * @param {string} type - The notification type
   * @returns {string} Icon class name
   */
  getIconForType(type) {
    const iconMap = {
      success: "CalendarCheckIcon",
      error: "XIcon",
      warning: "FileWarningIcon",
      info: "InfoIcon",
    };

    return iconMap[type] || iconMap.info;
  }

  /**
   * Gets the appropriate background class for a notification type
   * @param {string} type - The notification type
   * @returns {string} Background CSS class
   */
  getBackgroundClassForType(type) {
    const classMap = {
      success: "bg-green-600",
      error: "bg-red-600",
      warning: "bg-yellow-400 text-black",
      info: "bg-blue-600",
    };

    return classMap[type] || classMap.info;
  }

  /**
   * Validates if a notification object is properly formatted
   * @param {Object} notification - The notification object to validate
   * @returns {boolean} True if valid, false otherwise
   */
  isValidNotification(notification) {
    if (!notification || typeof notification !== "object") {
      return false;
    }

    const requiredFields = ["message", "type", "visible", "duration"];

    return (
      requiredFields.every(
        (field) =>
          notification.hasOwnProperty(field) &&
          notification[field] !== undefined &&
          notification[field] !== null
      ) &&
      typeof notification.message === "string" &&
      this.validTypes.includes(notification.type) &&
      typeof notification.visible === "boolean" &&
      typeof notification.duration === "number"
    );
  }
}

// Export singleton instance
const notificationService = new NotificationService();
export default notificationService;
