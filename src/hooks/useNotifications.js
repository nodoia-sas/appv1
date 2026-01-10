/**
 * useNotifications Hook - Custom hook for notification management
 *
 * This hook integrates with NotificationService and Zustand store to provide
 * notification functionality with auto-hide behavior.
 *
 * Requirements: 3.3, 3.4
 */

import { useCallback, useEffect, useRef } from "react";
import { useAppStore, selectNotification } from "../store/appStore";
import notificationService from "../services/NotificationService";

/**
 * Custom hook for managing notifications
 * @returns {Object} Notification state and actions
 */
export const useNotifications = () => {
  const notification = useAppStore(selectNotification);
  const showNotification = useAppStore((state) => state.showNotification);
  const hideNotification = useAppStore((state) => state.hideNotification);

  // Ref to store the current timeout ID for auto-hide
  const timeoutRef = useRef(null);

  /**
   * Shows a notification with auto-hide functionality
   * @param {string} message - The notification message
   * @param {string} type - The notification type (success, error, warning, info)
   * @param {number} duration - Duration in milliseconds (optional, defaults to 3000)
   */
  const showNotificationWithAutoHide = useCallback(
    (message, type = "info", duration = 3000) => {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      // Create notification using the service for validation and formatting
      const formattedNotification = notificationService.createNotification(
        message,
        type,
        duration
      );

      // Show the notification in the store
      showNotification(
        formattedNotification.message,
        formattedNotification.type,
        formattedNotification.duration
      );

      // Set up auto-hide timer
      timeoutRef.current = setTimeout(() => {
        hideNotification();
        timeoutRef.current = null;
      }, formattedNotification.duration);
    },
    [showNotification, hideNotification]
  );

  /**
   * Manually hides the current notification
   */
  const hideNotificationManually = useCallback(() => {
    // Clear the auto-hide timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    hideNotification();
  }, [hideNotification]);

  /**
   * Shows a success notification
   * @param {string} message - The notification message
   * @param {number} duration - Duration in milliseconds (optional)
   */
  const showSuccess = useCallback(
    (message, duration) => {
      showNotificationWithAutoHide(message, "success", duration);
    },
    [showNotificationWithAutoHide]
  );

  /**
   * Shows an error notification
   * @param {string} message - The notification message
   * @param {number} duration - Duration in milliseconds (optional)
   */
  const showError = useCallback(
    (message, duration) => {
      showNotificationWithAutoHide(message, "error", duration);
    },
    [showNotificationWithAutoHide]
  );

  /**
   * Shows a warning notification
   * @param {string} message - The notification message
   * @param {number} duration - Duration in milliseconds (optional)
   */
  const showWarning = useCallback(
    (message, duration) => {
      showNotificationWithAutoHide(message, "warning", duration);
    },
    [showNotificationWithAutoHide]
  );

  /**
   * Shows an info notification
   * @param {string} message - The notification message
   * @param {number} duration - Duration in milliseconds (optional)
   */
  const showInfo = useCallback(
    (message, duration) => {
      showNotificationWithAutoHide(message, "info", duration);
    },
    [showNotificationWithAutoHide]
  );

  /**
   * Gets notification styling information from the service
   * @returns {Object} Styling information for the current notification
   */
  const getNotificationStyling = useCallback(() => {
    if (!notification.visible) {
      return null;
    }

    return {
      icon: notificationService.getIconForType(notification.type),
      backgroundClass: notificationService.getBackgroundClassForType(
        notification.type
      ),
      formattedMessage: notificationService.formatMessage(
        notification.message,
        notification.type
      ),
    };
  }, [notification]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Auto-hide functionality when notification becomes visible
  useEffect(() => {
    if (notification.visible && notification.duration > 0) {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set up new auto-hide timer
      timeoutRef.current = setTimeout(() => {
        hideNotification();
        timeoutRef.current = null;
      }, notification.duration);
    }

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [notification.visible, notification.duration, hideNotification]);

  return {
    // Current notification state
    notification,

    // Core actions
    showNotification: showNotificationWithAutoHide,
    hideNotification: hideNotificationManually,

    // Convenience methods for different types
    showSuccess,
    showError,
    showWarning,
    showInfo,

    // Utility methods
    getNotificationStyling,

    // Service integration
    isValidNotification: notificationService.isValidNotification,
  };
};

export default useNotifications;
