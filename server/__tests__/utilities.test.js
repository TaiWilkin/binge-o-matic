import { jest } from "@jest/globals";

import { isProduction, logError, logInfo } from "../utilities.js";

describe("Utilities", () => {
  let originalEnv;
  let consoleSpy;
  let consoleErrorSpy;

  beforeEach(() => {
    // Save original environment
    originalEnv = { ...process.env };

    // Spy on console methods
    consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;

    // Restore console methods
    consoleSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe("isProduction", () => {
    it("should return true when NODE_ENV is production", () => {
      process.env.NODE_ENV = "production";
      expect(isProduction()).toBe(true);
    });

    it("should return false when NODE_ENV is development", () => {
      process.env.NODE_ENV = "development";
      expect(isProduction()).toBe(false);
    });

    it("should return false when NODE_ENV is test", () => {
      process.env.NODE_ENV = "test";
      expect(isProduction()).toBe(false);
    });

    it("should return false when NODE_ENV is undefined", () => {
      delete process.env.NODE_ENV;
      expect(isProduction()).toBe(false);
    });

    it("should return false when NODE_ENV is empty string", () => {
      process.env.NODE_ENV = "";
      expect(isProduction()).toBe(false);
    });

    it("should return false for any other NODE_ENV value", () => {
      process.env.NODE_ENV = "staging";
      expect(isProduction()).toBe(false);
    });
  });

  describe("logError", () => {
    it("should call console.error in non-production environment", () => {
      process.env.NODE_ENV = "development";
      const testMessage = "Test error message";

      logError(testMessage);

      expect(consoleErrorSpy).toHaveBeenCalledWith(testMessage);
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    });

    it("should call console.error in test environment", () => {
      process.env.NODE_ENV = "test";
      const testMessage = "Test error in test env";

      logError(testMessage);

      expect(consoleErrorSpy).toHaveBeenCalledWith(testMessage);
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    });

    it("should not call console.error in production environment", () => {
      process.env.NODE_ENV = "production";
      const testMessage = "Production error message";

      logError(testMessage);

      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("should handle undefined message", () => {
      process.env.NODE_ENV = "development";

      logError(undefined);

      expect(consoleErrorSpy).toHaveBeenCalledWith(undefined);
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    });

    it("should handle empty string message", () => {
      process.env.NODE_ENV = "development";

      logError("");

      expect(consoleErrorSpy).toHaveBeenCalledWith("");
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    });

    it("should handle object message", () => {
      process.env.NODE_ENV = "development";
      const errorObject = { error: "Something went wrong", code: 500 };

      logError(errorObject);

      expect(consoleErrorSpy).toHaveBeenCalledWith(errorObject);
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("logInfo", () => {
    it("should call console.log in non-production environment", () => {
      process.env.NODE_ENV = "development";
      const testMessage = "Test info message";

      logInfo(testMessage);

      expect(consoleSpy).toHaveBeenCalledWith(testMessage);
      expect(consoleSpy).toHaveBeenCalledTimes(1);
    });

    it("should call console.log in test environment", () => {
      process.env.NODE_ENV = "test";
      const testMessage = "Test info in test env";

      logInfo(testMessage);

      expect(consoleSpy).toHaveBeenCalledWith(testMessage);
      expect(consoleSpy).toHaveBeenCalledTimes(1);
    });

    it("should not call console.log in production environment", () => {
      process.env.NODE_ENV = "production";
      const testMessage = "Production info message";

      logInfo(testMessage);

      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it("should handle undefined message", () => {
      process.env.NODE_ENV = "development";

      logInfo(undefined);

      expect(consoleSpy).toHaveBeenCalledWith(undefined);
      expect(consoleSpy).toHaveBeenCalledTimes(1);
    });

    it("should handle empty string message", () => {
      process.env.NODE_ENV = "development";

      logInfo("");

      expect(consoleSpy).toHaveBeenCalledWith("");
      expect(consoleSpy).toHaveBeenCalledTimes(1);
    });

    it("should handle object message", () => {
      process.env.NODE_ENV = "development";
      const infoObject = { status: "success", data: { id: 1 } };

      logInfo(infoObject);

      expect(consoleSpy).toHaveBeenCalledWith(infoObject);
      expect(consoleSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("Integration tests", () => {
    it("should work correctly when switching environments", () => {
      const testMessage = "Test message";

      // Start in development
      process.env.NODE_ENV = "development";
      logInfo(testMessage);
      logError(testMessage);
      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);

      // Reset spies
      consoleSpy.mockClear();
      consoleErrorSpy.mockClear();

      // Switch to production
      process.env.NODE_ENV = "production";
      logInfo(testMessage);
      logError(testMessage);
      expect(consoleSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("should use isProduction function consistently", () => {
      // Test that both logging functions use the same production check
      process.env.NODE_ENV = "production";

      expect(isProduction()).toBe(true);

      logInfo("test");
      logError("test");

      expect(consoleSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });
});
