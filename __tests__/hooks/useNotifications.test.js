/**
 * Tests for useNotifications hook
 *
 * Requirements: 3.3, 3.4
 */

import { renderHook, act } from "@testing-library/react";
import { useNotifications } from "../../src/hooks/useNotifications";
import { useAppStore } from "../../src/store/appStore";

// Mock the store
jest.mock("../../src/store/appStore");

describe("useNotifications", () => {
  let mockShowNotification;
  let mockHideNotification;
  let mockNotification;

  beforeEach(() => {
    // Reset mocks
    mockShowNotification = jest.fn();
    mockHideNotification = jest.fn();
    mockNotification = {
      message: "",
      type: "info",
      visible: false,
      duration: 3000,
    };

    // Mock the store selectors and actions
    useAppStore.mockImplementation((selector) => {
      if (
        selector.name === "selectNotification" ||
        typeof selector === "function"
      ) {
        // Handle selector function
        const mockState = {
          notification: mockNotification,
          showNotification: mockShowNotification,
          hideNotification: mockHideNotification,
        };
        return selector(mockState);
      }
      // Handle direct property access
      return mockShowNotification; // fallback
    });

    // Clear all timers
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  describe("Basic functionality", () => {
    it("should provide notification state and actions", () => {
      const { result } = renderHook(() => useNotifications());

      expect(result.current).toHaveProperty("notification");
      expect(result.current).toHaveProperty("showNotification");
      expect(result.current).toHaveProperty("hideNotification");
      expect(result.current).toHaveProperty("showSuccess");
      expect(result.current).toHaveProperty("showError");
      expect(result.current).toHaveProperty("showWarning");
      expect(result.current).toHaveProperty("showInfo");
    });

    it("should show notification with correct parameters", () => {
      const { result } = renderHook(() => useNotifications());

      act(() => {
        result.current.showNotification("Test message", "success", 5000);
      });

      expect(mockShowNotification).toHaveBeenCalledWith(
        "Test message",
        "success",
        5000
      );
    });

    it("should use default parameters when not provided", () => {
      const { result } = renderHook(() => useNotifications());

      act(() => {
        result.current.showNotification("Test message");
      });

      expect(mockShowNotification).toHaveBeenCalledWith(
        "Test message",
        "info",
        3000
      );
    });
  });

  describe("Convenience methods", () => {
    it("should show success notification", () => {
      const { result } = renderHook(() => useNotifications());

      act(() => {
        result.current.showSuccess("Success message");
      });

      expect(mockShowNotification).toHaveBeenCalledWith(
        "Success message",
        "success",
        3000
      );
    });

    it("should show error notification", () => {
      const { result } = renderHook(() => useNotifications());

      act(() => {
        result.current.showError("Error message");
      });

      expect(mockShowNotification).toHaveBeenCalledWith(
        "Error message",
        "error",
        3000
      );
    });

    it("should show warning notification", () => {
      const { result } = renderHook(() => useNotifications());

      act(() => {
        result.current.showWarning("Warning message");
      });

      expect(mockShowNotification).toHaveBeenCalledWith(
        "Warning message",
        "warning",
        3000
      );
    });

    it("should show info notification", () => {
      const { result } = renderHook(() => useNotifications());

      act(() => {
        result.current.showInfo("Info message");
      });

      expect(mockShowNotification).toHaveBeenCalledWith(
        "Info message",
        "info",
        3000
      );
    });
  });

  describe("Auto-hide functionality", () => {
    it("should auto-hide notification after specified duration", () => {
      // Mock a visible notification
      mockNotification = {
        message: "Test message",
        type: "info",
        visible: true,
        duration: 3000,
      };

      const { result } = renderHook(() => useNotifications());

      // Fast-forward time by 3000ms
      act(() => {
        jest.advanceTimersByTime(3000);
      });

      expect(mockHideNotification).toHaveBeenCalled();
    });

    it("should clear timeout when manually hiding notification", () => {
      const { result } = renderHook(() => useNotifications());

      act(() => {
        result.current.showNotification("Test message", "info", 5000);
      });

      act(() => {
        result.current.hideNotification();
      });

      expect(mockHideNotification).toHaveBeenCalled();

      // Advance time to ensure auto-hide doesn't trigger
      act(() => {
        jest.advanceTimersByTime(5000);
      });

      // hideNotification should only be called once (manually)
      expect(mockHideNotification).toHaveBeenCalledTimes(1);
    });

    it("should clear previous timeout when showing new notification", () => {
      const { result } = renderHook(() => useNotifications());

      // Show first notification
      act(() => {
        result.current.showNotification("First message", "info", 5000);
      });

      // Show second notification before first expires
      act(() => {
        result.current.showNotification("Second message", "success", 3000);
      });

      // Advance time by 3000ms (second notification duration)
      act(() => {
        jest.advanceTimersByTime(3000);
      });

      expect(mockHideNotification).toHaveBeenCalledTimes(1);

      // Advance time by additional 2000ms (would be first notification time)
      act(() => {
        jest.advanceTimersByTime(2000);
      });

      // Should still only be called once
      expect(mockHideNotification).toHaveBeenCalledTimes(1);
    });
  });

  describe("Integration with NotificationService", () => {
    it("should provide styling information", () => {
      mockNotification = {
        message: "Test message",
        type: "success",
        visible: true,
        duration: 3000,
      };

      const { result } = renderHook(() => useNotifications());
      const styling = result.current.getNotificationStyling();

      expect(styling).toHaveProperty("icon");
      expect(styling).toHaveProperty("backgroundClass");
      expect(styling).toHaveProperty("formattedMessage");
    });

    it("should return null styling when notification is not visible", () => {
      mockNotification = {
        message: "",
        type: "info",
        visible: false,
        duration: 3000,
      };

      const { result } = renderHook(() => useNotifications());
      const styling = result.current.getNotificationStyling();

      expect(styling).toBeNull();
    });

    it("should provide validation method", () => {
      const { result } = renderHook(() => useNotifications());

      expect(result.current).toHaveProperty("isValidNotification");
      expect(typeof result.current.isValidNotification).toBe("function");
    });
  });
});
