import { jest } from "@jest/globals";
import mongoose from "mongoose";

import {
  areIdsEqual,
  convertToObjectId,
  isProduction,
  logError,
  logInfo,
} from "../helpers/index.js";

const { ObjectId } = mongoose.Types;

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

  describe("convertToObjectId", () => {
    it("should convert string to ObjectId", () => {
      const hexString = "507f1f77bcf86cd799439011";
      const result = convertToObjectId(hexString);

      expect(result).toBeInstanceOf(ObjectId);
      expect(result.toString()).toBe(hexString);
    });

    it("should return the same ObjectId if already an ObjectId", () => {
      const objectId = new ObjectId();
      const result = convertToObjectId(objectId);

      expect(result).toBe(objectId);
      expect(result).toBeInstanceOf(ObjectId);
    });

    it("should return null for null input", () => {
      const result = convertToObjectId(null);
      expect(result).toBeNull();
    });

    it("should return null for undefined input", () => {
      const result = convertToObjectId(undefined);
      expect(result).toBeNull();
    });

    it("should handle valid 24-character hex string", () => {
      const hexString = "60d21b4667d0d8992e610c85";
      const result = convertToObjectId(hexString);

      expect(result).toBeInstanceOf(ObjectId);
      expect(result.toString()).toBe(hexString);
    });

    it("should throw error for invalid hex string", () => {
      const invalidHex = "invalid-hex-string";

      expect(() => {
        convertToObjectId(invalidHex);
      }).toThrow();
    });
  });

  describe("areIdsEqual", () => {
    it("should return true for identical ObjectIds", () => {
      const id1 = new ObjectId();
      const id2 = id1;

      expect(areIdsEqual(id1, id2)).toBe(true);
    });

    it("should return true for ObjectIds with same string representation", () => {
      const hexString = "507f1f77bcf86cd799439011";
      const id1 = new ObjectId(hexString);
      const id2 = new ObjectId(hexString);

      expect(areIdsEqual(id1, id2)).toBe(true);
    });

    it("should return true when comparing ObjectId with string", () => {
      const hexString = "507f1f77bcf86cd799439011";
      const objectId = new ObjectId(hexString);

      expect(areIdsEqual(objectId, hexString)).toBe(true);
      expect(areIdsEqual(hexString, objectId)).toBe(true);
    });

    it("should return false for different ObjectIds", () => {
      const id1 = new ObjectId();
      const id2 = new ObjectId();

      expect(areIdsEqual(id1, id2)).toBe(false);
    });

    it("should return false when one ID is null", () => {
      const id = new ObjectId();

      expect(areIdsEqual(id, null)).toBe(false);
      expect(areIdsEqual(null, id)).toBe(false);
    });

    it("should return false when one ID is undefined", () => {
      const id = new ObjectId();

      expect(areIdsEqual(id, undefined)).toBe(false);
      expect(areIdsEqual(undefined, id)).toBe(false);
    });

    it("should return false when both IDs are null", () => {
      expect(areIdsEqual(null, null)).toBe(false);
    });

    it("should return false when both IDs are undefined", () => {
      expect(areIdsEqual(undefined, undefined)).toBe(false);
    });

    it("should handle mixed null and undefined", () => {
      expect(areIdsEqual(null, undefined)).toBe(false);
      expect(areIdsEqual(undefined, null)).toBe(false);
    });

    it("should return true for identical string IDs", () => {
      const hexString = "507f1f77bcf86cd799439011";

      expect(areIdsEqual(hexString, hexString)).toBe(true);
    });
  });
});
