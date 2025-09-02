import { timedResolver } from "../../helpers/timedResolver.js";

// Mock the helper functions
jest.mock("../../helpers/index.js", () => ({
  isProduction: jest.fn(),
  isTest: jest.fn(),
}));

import { isProduction, isTest } from "../../helpers/index.js";

describe("timedResolver", () => {
  let consoleSpy;
  let mockResolver;
  let mockInfo;

  beforeEach(() => {
    // Spy on console.log to track if it's called
    consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    // Mock resolver function
    mockResolver = jest.fn().mockResolvedValue("test result");

    // Mock GraphQL info object
    mockInfo = {
      parentType: { name: "Query" },
      fieldName: "testField",
    };

    // Reset all mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe("basic functionality", () => {
    it("should wrap resolver and return result", async () => {
      isProduction.mockReturnValue(true);
      isTest.mockReturnValue(false);

      const wrappedResolver = timedResolver(mockResolver);
      const result = await wrappedResolver(null, {}, {}, mockInfo);

      expect(result).toBe("test result");
      expect(mockResolver).toHaveBeenCalledWith(null, {}, {}, mockInfo);
    });

    it("should calculate and track timing", async () => {
      isProduction.mockReturnValue(true);
      isTest.mockReturnValue(false);

      // Mock Date.now to control timing
      const mockStart = 1000;
      const mockEnd = 1150;
      jest
        .spyOn(Date, "now")
        .mockReturnValueOnce(mockStart)
        .mockReturnValueOnce(mockEnd);

      const wrappedResolver = timedResolver(mockResolver);
      await wrappedResolver(null, {}, {}, mockInfo);

      // Verify Date.now was called twice (start and end)
      expect(Date.now).toHaveBeenCalledTimes(2);
    });

    it("should handle resolver errors", async () => {
      isProduction.mockReturnValue(true);
      isTest.mockReturnValue(false);

      const error = new Error("Resolver error");
      mockResolver.mockRejectedValue(error);

      const wrappedResolver = timedResolver(mockResolver);

      await expect(wrappedResolver(null, {}, {}, mockInfo)).rejects.toThrow(
        "Resolver error",
      );
    });
  });

  describe("logging behavior", () => {
    it("should NOT log in production environment", async () => {
      isProduction.mockReturnValue(true);
      isTest.mockReturnValue(false);

      const wrappedResolver = timedResolver(mockResolver);
      await wrappedResolver(null, {}, {}, mockInfo);

      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it("should NOT log in test environment", async () => {
      isProduction.mockReturnValue(false);
      isTest.mockReturnValue(true);

      const wrappedResolver = timedResolver(mockResolver);
      await wrappedResolver(null, {}, {}, mockInfo);

      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it("should NOT log in production AND test environment", async () => {
      isProduction.mockReturnValue(true);
      isTest.mockReturnValue(true);

      const wrappedResolver = timedResolver(mockResolver);
      await wrappedResolver(null, {}, {}, mockInfo);

      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it("should log timing in development environment (line 9)", async () => {
      // This test specifically covers line 9: the console.log statement
      isProduction.mockReturnValue(false);
      isTest.mockReturnValue(false);

      // Mock Date.now to control timing
      const mockStart = 1000;
      const mockEnd = 1150;
      jest
        .spyOn(Date, "now")
        .mockReturnValueOnce(mockStart)
        .mockReturnValueOnce(mockEnd);

      const wrappedResolver = timedResolver(mockResolver);
      await wrappedResolver(null, {}, {}, mockInfo);

      // Verify console.log was called (this tests line 9)
      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalledWith(
        "[Resolver Timing] Query.testField: 150ms",
      );
    });

    it("should log with correct format and timing calculation", async () => {
      isProduction.mockReturnValue(false);
      isTest.mockReturnValue(false);

      // Mock different timing
      const mockStart = 2000;
      const mockEnd = 2275;
      jest
        .spyOn(Date, "now")
        .mockReturnValueOnce(mockStart)
        .mockReturnValueOnce(mockEnd);

      // Different info object
      const customInfo = {
        parentType: { name: "Mutation" },
        fieldName: "updateUser",
      };

      const wrappedResolver = timedResolver(mockResolver);
      await wrappedResolver(null, {}, {}, customInfo);

      expect(consoleSpy).toHaveBeenCalledWith(
        "[Resolver Timing] Mutation.updateUser: 275ms",
      );
    });

    it("should log even with zero duration", async () => {
      isProduction.mockReturnValue(false);
      isTest.mockReturnValue(false);

      // Mock same start and end time
      const mockTime = 5000;
      jest.spyOn(Date, "now").mockReturnValue(mockTime);

      const wrappedResolver = timedResolver(mockResolver);
      await wrappedResolver(null, {}, {}, mockInfo);

      expect(consoleSpy).toHaveBeenCalledWith(
        "[Resolver Timing] Query.testField: 0ms",
      );
    });
  });

  describe("edge cases", () => {
    it("should handle resolver with undefined result", async () => {
      isProduction.mockReturnValue(false);
      isTest.mockReturnValue(false);

      mockResolver.mockResolvedValue(undefined);

      const wrappedResolver = timedResolver(mockResolver);
      const result = await wrappedResolver(null, {}, {}, mockInfo);

      expect(result).toBeUndefined();
      expect(consoleSpy).toHaveBeenCalled();
    });

    it("should handle resolver with null result", async () => {
      isProduction.mockReturnValue(false);
      isTest.mockReturnValue(false);

      mockResolver.mockResolvedValue(null);

      const wrappedResolver = timedResolver(mockResolver);
      const result = await wrappedResolver(null, {}, {}, mockInfo);

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
    });

    it("should pass through all resolver arguments correctly", async () => {
      isProduction.mockReturnValue(true);
      isTest.mockReturnValue(false);

      const parent = { id: 1 };
      const args = { filter: "test" };
      const context = { user: { id: 123 } };

      const wrappedResolver = timedResolver(mockResolver);
      await wrappedResolver(parent, args, context, mockInfo);

      expect(mockResolver).toHaveBeenCalledWith(
        parent,
        args,
        context,
        mockInfo,
      );
    });
  });
});
