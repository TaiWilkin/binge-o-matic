import { jest } from "@jest/globals";

// Import service after mocking
const { fetchFromTMDB } = await import("../../services/tmdb.js");

describe("TMDB Service", () => {
  describe("fetchFromTMDB", () => {
    let originalFetch;

    beforeEach(() => {
      originalFetch = global.fetch;
    });

    afterEach(() => {
      global.fetch = originalFetch;
    });

    it("should fetch data from TMDB API successfully", async () => {
      const mockData = { results: [] };
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockData),
        }),
      );

      const result = await fetchFromTMDB("test-url");
      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledWith("test-url");
    });

    it("should throw error when API request fails", async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          statusText: "Not Found",
        }),
      );

      await expect(fetchFromTMDB("test-url")).rejects.toThrow("Not Found");
    });

    it("should handle network errors", async () => {
      global.fetch = jest.fn(() => Promise.reject(new Error("Network error")));

      await expect(fetchFromTMDB("test-url")).rejects.toThrow("Network error");
    });
  });
});
