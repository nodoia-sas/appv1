import NotificationService from "../../src/services/NotificationService";
import fc from "fast-check";

describe("NotificationService", () => {
  let notificationService;

  beforeEach(() => {
    // Use the singleton instance
    notificationService = NotificationService;

    // Clear any existing timers
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe("Initial State", () => {
    it("should have correct default configuration", () => {
      expect(notificationService.defaultDuration).toBe(3000);
      expect(notificationService.validTypes).toEqual([
        "success",
        "error",
        "warning",
        "info",
      ]);
    });
  });

  describe("Notification Creation", () => {
    it("should create a basic notification with default values", () => {
      const notification =
        notificationService.createNotification("Test message");

      expect(notification.message).toBe("Test message");
      expect(notification.type).toBe("success");
      expect(notification.visible).toBe(true);
      expect(notification.duration).toBe(3000);
      expect(notification.timestamp).toBeGreaterThan(0);
      expect(notification.id).toMatch(/^notification_\d+_[a-z0-9]+$/);
    });

    it("should create notification with custom type and duration", () => {
      const notification = notificationService.createNotification(
        "Error message",
        "error",
        5000
      );

      expect(notification.message).toBe("Error message");
      expect(notification.type).toBe("error");
      expect(notification.duration).toBe(5000);
    });

    it("should throw error for invalid message", () => {
      expect(() => notificationService.createNotification("")).toThrow(
        "Notification message must be a non-empty string"
      );
      expect(() => notificationService.createNotification(null)).toThrow(
        "Notification message must be a non-empty string"
      );
      expect(() => notificationService.createNotification(123)).toThrow(
        "Notification message must be a non-empty string"
      );
    });

    it("should trim whitespace from messages", () => {
      const notification =
        notificationService.createNotification("  Test message  ");
      expect(notification.message).toBe("Test message");
    });
  });

  describe("Type Validation", () => {
    it("should validate and normalize valid types", () => {
      expect(notificationService.validateAndNormalizeType("SUCCESS")).toBe(
        "success"
      );
      expect(notificationService.validateAndNormalizeType("Error")).toBe(
        "error"
      );
      expect(notificationService.validateAndNormalizeType("  warning  ")).toBe(
        "warning"
      );
      expect(notificationService.validateAndNormalizeType("info")).toBe("info");
    });

    it("should fallback to info for invalid types", () => {
      expect(notificationService.validateAndNormalizeType("invalid")).toBe(
        "info"
      );
      expect(notificationService.validateAndNormalizeType("")).toBe("info");
      expect(notificationService.validateAndNormalizeType(null)).toBe("info");
      expect(notificationService.validateAndNormalizeType(123)).toBe("info");
    });
  });

  describe("Duration Validation", () => {
    it("should validate valid durations", () => {
      expect(notificationService.validateDuration(1000)).toBe(1000);
      expect(notificationService.validateDuration(5000)).toBe(5000);
    });

    it("should enforce minimum duration", () => {
      expect(notificationService.validateDuration(100)).toBe(500);
      expect(notificationService.validateDuration(0)).toBe(500);
    });

    it("should enforce maximum duration", () => {
      expect(notificationService.validateDuration(50000)).toBe(30000);
    });

    it("should fallback to default for invalid durations", () => {
      expect(notificationService.validateDuration(-1)).toBe(3000);
      expect(notificationService.validateDuration("invalid")).toBe(3000);
      expect(notificationService.validateDuration(null)).toBe(3000);
    });
  });

  describe("Message Formatting", () => {
    it("should format messages correctly", () => {
      expect(
        notificationService.formatMessage("  Test message  ", "info")
      ).toBe("Test message");
      expect(notificationService.formatMessage("Error occurred", "error")).toBe(
        "Error occurred."
      );
      expect(
        notificationService.formatMessage("Error occurred!", "error")
      ).toBe("Error occurred!");
      expect(notificationService.formatMessage("", "info")).toBe("");
    });
  });

  describe("Auto-Hide Functionality", () => {
    it("should create notification with auto-hide", () => {
      const hideCallback = jest.fn();
      const notification = notificationService.createNotificationWithAutoHide(
        "Test message",
        "success",
        hideCallback,
        1000
      );

      expect(notification.message).toBe("Test message");
      expect(notification.timeoutId).toBeDefined();
      expect(hideCallback).not.toHaveBeenCalled();

      // Fast-forward time
      jest.advanceTimersByTime(1000);
      expect(hideCallback).toHaveBeenCalled();
    });

    it("should throw error for invalid hideCallback", () => {
      expect(() =>
        notificationService.createNotificationWithAutoHide(
          "Test message",
          "success",
          "not a function"
        )
      ).toThrow("hideCallback must be a function");
    });

    it("should cancel auto-hide", () => {
      const hideCallback = jest.fn();
      const notification = notificationService.createNotificationWithAutoHide(
        "Test message",
        "success",
        hideCallback,
        1000
      );

      notificationService.cancelAutoHide(notification.timeoutId);

      // Fast-forward time
      jest.advanceTimersByTime(1000);
      expect(hideCallback).not.toHaveBeenCalled();
    });
  });

  describe("UI Helper Methods", () => {
    it("should return correct icons for types", () => {
      expect(notificationService.getIconForType("success")).toBe(
        "CalendarCheckIcon"
      );
      expect(notificationService.getIconForType("error")).toBe("XIcon");
      expect(notificationService.getIconForType("warning")).toBe(
        "FileWarningIcon"
      );
      expect(notificationService.getIconForType("info")).toBe("InfoIcon");
      expect(notificationService.getIconForType("invalid")).toBe("InfoIcon");
    });

    it("should return correct background classes for types", () => {
      expect(notificationService.getBackgroundClassForType("success")).toBe(
        "bg-green-600"
      );
      expect(notificationService.getBackgroundClassForType("error")).toBe(
        "bg-red-600"
      );
      expect(notificationService.getBackgroundClassForType("warning")).toBe(
        "bg-yellow-400 text-black"
      );
      expect(notificationService.getBackgroundClassForType("info")).toBe(
        "bg-blue-600"
      );
      expect(notificationService.getBackgroundClassForType("invalid")).toBe(
        "bg-blue-600"
      );
    });
  });

  describe("Notification Validation", () => {
    it("should validate correct notification objects", () => {
      const validNotification = {
        message: "Test message",
        type: "success",
        visible: true,
        duration: 3000,
      };

      expect(notificationService.isValidNotification(validNotification)).toBe(
        true
      );
    });

    it("should reject invalid notification objects", () => {
      expect(notificationService.isValidNotification(null)).toBe(false);
      expect(notificationService.isValidNotification({})).toBe(false);
      expect(
        notificationService.isValidNotification({
          message: 123,
          type: "success",
          visible: true,
          duration: 3000,
        })
      ).toBe(false);
      expect(
        notificationService.isValidNotification({
          message: "Test",
          type: "invalid",
          visible: true,
          duration: 3000,
        })
      ).toBe(false);
    });
  });

  describe("Property-Based Tests", () => {
    // Feature: phase-1-monolith-separation, Property 13: Notification Formatting
    test("notifications created through NotificationService should be properly formatted with message, type, and duration", () => {
      fc.assert(
        fc.property(
          fc.record({
            message: fc.string({ minLength: 1 }),
            type: fc.constantFrom("success", "error", "warning", "info"),
            duration: fc.integer({ min: 500, max: 30000 }),
          }),
          (testData) => {
            const notification = notificationService.createNotification(
              testData.message,
              testData.type,
              testData.duration
            );

            // Verify all required fields are present and properly formatted
            expect(notification).toHaveProperty("message");
            expect(notification).toHaveProperty("type");
            expect(notification).toHaveProperty("visible");
            expect(notification).toHaveProperty("duration");
            expect(notification).toHaveProperty("timestamp");
            expect(notification).toHaveProperty("id");

            // Verify proper formatting
            expect(typeof notification.message).toBe("string");
            expect(notification.message.trim()).toBe(notification.message); // No leading/trailing whitespace
            expect(notification.message.length).toBeGreaterThan(0);

            expect(notificationService.validTypes).toContain(notification.type);
            expect(typeof notification.visible).toBe("boolean");
            expect(notification.visible).toBe(true);

            expect(typeof notification.duration).toBe("number");
            expect(notification.duration).toBeGreaterThanOrEqual(500);
            expect(notification.duration).toBeLessThanOrEqual(30000);

            expect(typeof notification.timestamp).toBe("number");
            expect(notification.timestamp).toBeGreaterThan(0);

            expect(typeof notification.id).toBe("string");
            expect(notification.id).toMatch(/^notification_\d+_[a-z0-9]+$/);

            // Verify the notification passes validation
            expect(notificationService.isValidNotification(notification)).toBe(
              true
            );
          }
        ),
        { numRuns: 100 }
      );
    });

    test("auto-hide functionality should work correctly for all valid inputs", () => {
      fc.assert(
        fc.property(
          fc.record({
            message: fc.string({ minLength: 1 }),
            type: fc.constantFrom("success", "error", "warning", "info"),
            duration: fc.integer({ min: 500, max: 5000 }), // Shorter durations for testing
          }),
          (testData) => {
            const hideCallback = jest.fn();

            const notification =
              notificationService.createNotificationWithAutoHide(
                testData.message,
                testData.type,
                hideCallback,
                testData.duration
              );

            // Verify notification is properly created
            expect(notification.message).toBe(testData.message.trim());
            expect(notification.type).toBe(testData.type);
            expect(notification.duration).toBe(testData.duration);
            expect(notification.timeoutId).toBeDefined();

            // Verify callback hasn't been called yet
            expect(hideCallback).not.toHaveBeenCalled();

            // Fast-forward time to just before the timeout
            jest.advanceTimersByTime(testData.duration - 1);
            expect(hideCallback).not.toHaveBeenCalled();

            // Fast-forward to trigger the timeout
            jest.advanceTimersByTime(1);
            expect(hideCallback).toHaveBeenCalledTimes(1);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
