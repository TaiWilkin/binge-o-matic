import { isProduction, logError, logInfo } from "../../helpers/environment.js";

describe("Environment Helpers", () => {
  describe("isProduction", () => {
    let originalEnv;

    beforeEach(() => {
      originalEnv = process.env.NODE_ENV;
    });

    afterEach(() => {
      process.env.NODE_ENV = originalEnv;
    });

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
  });

  describe("logError", () => {
    let consoleSpy;
    let originalEnv;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, "error").mockImplementation();
      originalEnv = process.env.NODE_ENV;
    });

    afterEach(() => {
      consoleSpy.mockRestore();
      process.env.NODE_ENV = originalEnv;
    });

    it("should call console.error in non-production environment", () => {
      process.env.NODE_ENV = "development";
      logError("test error");
      expect(consoleSpy).toHaveBeenCalledWith("test error");
    });

    it("should not call console.error in production environment", () => {
      process.env.NODE_ENV = "production";
      logError("test error");
      expect(consoleSpy).not.toHaveBeenCalled();
    });
  });

  describe("logInfo", () => {
    let consoleSpy;
    let originalEnv;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, "log").mockImplementation();
      originalEnv = process.env.NODE_ENV;
    });

    afterEach(() => {
      consoleSpy.mockRestore();
      process.env.NODE_ENV = originalEnv;
    });

    it("should call console.log in non-production environment", () => {
      process.env.NODE_ENV = "development";
      logInfo("test info");
      expect(consoleSpy).toHaveBeenCalledWith("test info");
    });

    it("should not call console.log in production environment", () => {
      process.env.NODE_ENV = "production";
      logInfo("test info");
      expect(consoleSpy).not.toHaveBeenCalled();
    });
  });
});
