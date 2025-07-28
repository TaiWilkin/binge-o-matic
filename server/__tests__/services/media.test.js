import mongoose from "mongoose";
import {
  TestData,
  MockFactories,
  ModelMocking,
  TestSetup,
  TestPatterns,
} from "../testUtils.js";

const { ObjectId } = mongoose.Types;

// Setup test environment and mocking
const { originalLogError } = TestSetup.setupTestEnvironment();
const originalModel = mongoose.model;
const modelMocks = ModelMocking.setupModelMocking(originalModel);

// Import service after mocking
const mediaService = await import("../../services/media.js").then(
  (m) => m.default,
);

describe("Media Service", () => {
  // Test data
  const mockUser = TestData.createUser();
  const mockListData = TestData.createList();
  const mockMediaItem = TestData.createMediaItem();
  const mockMediaData = [mockMediaItem];
  const mockUpdatedList = { ...mockListData, media: [...mockListData.media] };

  beforeEach(() => {
    // Reset model mocks with test data
    modelMocks.list.findOne = () => Promise.resolve(mockListData);
    modelMocks.list.findOneAndUpdate = () => Promise.resolve(mockUpdatedList);
    modelMocks.media.find = () => Promise.resolve(mockMediaData);
    modelMocks.media.findOne = () => Promise.resolve(mockMediaItem);
    modelMocks.media.findOneAndUpdate = () => Promise.resolve(mockMediaItem);
  });

  afterAll(() => {
    // Cleanup
    ModelMocking.restoreModelMocking(originalModel);
    TestSetup.restoreTestEnvironment({ originalLogError });
  });

  describe("searchMedia", () => {
    beforeEach(() => {
      global.fetch = MockFactories.createSuccessFetch(
        TestData.createTMDBSearchResponse(),
      );
    });

    it("should search for media and transform results", async () => {
      const result = await mediaService.searchMedia("test query");

      expect(result).toHaveLength(2); // Third item filtered out
      expect(result[0]).toEqual({
        id: 12345,
        title: "Test Movie",
        release_date: new Date("2023-01-01"),
        poster_path: "/test.jpg",
        media_type: "movie",
      });
      expect(result[1]).toEqual({
        id: 67890,
        title: "Test TV Show", // Transformed from 'name'
        name: "Test TV Show",
        release_date: new Date("2023-02-01"), // Transformed from 'first_air_date'
        first_air_date: "2023-02-01",
        poster_path: "/test-tv.jpg",
        media_type: "tv",
      });
    });

    it("should throw error on API failure", async () => {
      global.fetch = MockFactories.createFailureFetch("Not Found");

      await expect(mediaService.searchMedia("bad query")).rejects.toThrow(
        "Not Found",
      );
    });

    it("should throw error on network failure", async () => {
      global.fetch = MockFactories.createNetworkErrorFetch();

      await expect(mediaService.searchMedia("network fail")).rejects.toThrow(
        "Network error",
      );
    });
  });

  describe("addToList", () => {
    it("should add media to user's list", async () => {
      const media = {
        id: "12345",
        title: "Test Movie",
        release_date: new Date("2023-01-01"),
        poster_path: "/test.jpg",
        media_type: "movie",
        list: "507f1f77bcf86cd799439012",
      };

      const result = await mediaService.addToList(media, mockUser);
      TestPatterns.testSuccess(result);
    });

    it("should return null for unauthorized user", async () => {
      const unauthorizedUser = TestData.createUnauthorizedUser();
      modelMocks.list.findOne = () => Promise.resolve(mockListData);

      const media = {
        id: "12345",
        list: "507f1f77bcf86cd799439012",
      };

      const result = await mediaService.addToList(media, unauthorizedUser);
      expect(result).toBeNull(); // addToList catches errors and returns null
    });

    it("should return null on database error", async () => {
      modelMocks.list.findOne = () =>
        Promise.reject(new Error("Database error"));

      const media = {
        id: "12345",
        list: "507f1f77bcf86cd799439012",
      };

      await TestPatterns.testDatabaseError(
        mediaService.addToList,
        media,
        mockUser,
      );
    });
  });

  describe("getMediaList", () => {
    it("should transform media IDs to media objects", async () => {
      const mediaIds = TestData.createMediaIds();

      const result = await mediaService.getMediaList(mediaIds);
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        isWatched: false,
        title: "Test Movie",
        media_id: "12345",
        media_type: "movie",
        show_children: false,
      });
    });

    it("should sort media by release date and type", async () => {
      const mockMultipleMedia = [
        TestData.createMediaItem("12345", "507f1f77bcf86cd799439013"),
        {
          ...TestData.createMediaItem("67890", "507f1f77bcf86cd799439014"),
          title: "TV Show 2022",
          release_date: new Date("2022-01-01"),
          media_type: "tv",
        },
      ];

      modelMocks.media.find = () => Promise.resolve(mockMultipleMedia);

      const mediaIds = [
        {
          item_id: "507f1f77bcf86cd799439013",
          isWatched: false,
          show_children: false,
        },
        {
          item_id: "507f1f77bcf86cd799439014",
          isWatched: false,
          show_children: false,
        },
      ];

      const result = await mediaService.getMediaList(mediaIds);
      expect(result).toHaveLength(2);
      expect(result[0].title).toBe("TV Show 2022"); // Earlier date, comes first
      expect(result[1].title).toBe("Test Movie");
    });
  });

  describe("removeFromList", () => {
    let originalGetMediaList;

    beforeEach(() => {
      // Mock getMediaList function
      originalGetMediaList = mediaService.getMediaList;
      mediaService.getMediaList = () =>
        Promise.resolve([
          {
            id: TestData.createObjectId("507f1f77bcf86cd799439013"),
            media_id: "12345",
            title: "Parent Show",
            media_type: "tv",
          },
          {
            id: TestData.createObjectId("507f1f77bcf86cd799439014"),
            media_id: "67890",
            title: "Child Season",
            media_type: "season",
            parent_show: TestData.createObjectId("507f1f77bcf86cd799439013"),
          },
        ]);
    });

    afterEach(() => {
      // Restore original getMediaList
      mediaService.getMediaList = originalGetMediaList;
    });

    it("should remove media and child items from list", async () => {
      const result = await mediaService.removeFromList(
        { id: "12345", list: "507f1f77bcf86cd799439012" },
        mockUser,
      );
      TestPatterns.testSuccess(result);
    });

    it("should throw error for unauthorized user", async () => {
      const unauthorizedUser = TestData.createUnauthorizedUser();

      await TestPatterns.testAuthorizationError(
        mediaService.removeFromList,
        { id: "12345", list: "507f1f77bcf86cd799439012" },
        unauthorizedUser,
      );
    });
  });

  describe("toggleWatched", () => {
    it("should update watched status", async () => {
      const result = await mediaService.toggleWatched({
        id: "507f1f77bcf86cd799439013",
        isWatched: true,
        list: "507f1f77bcf86cd799439012",
      });
      TestPatterns.testSuccess(result);
    });

    it("should return null on error", async () => {
      modelMocks.list.findOne = () =>
        Promise.reject(new Error("Database error"));

      await TestPatterns.testDatabaseError(mediaService.toggleWatched, {
        id: "507f1f77bcf86cd799439013",
        isWatched: true,
        list: "507f1f77bcf86cd799439012",
      });
    });
  });

  describe("hideChildren", () => {
    it("should hide child items", async () => {
      const result = await mediaService.hideChildren({
        id: "507f1f77bcf86cd799439013",
        list: "507f1f77bcf86cd799439012",
      });
      TestPatterns.testSuccess(result);
    });

    it("should return null on error", async () => {
      modelMocks.list.findOne = () =>
        Promise.reject(new Error("Database error"));

      await TestPatterns.testDatabaseError(mediaService.hideChildren, {
        id: "507f1f77bcf86cd799439013",
        list: "507f1f77bcf86cd799439012",
      });
    });
  });

  describe("addSeasons", () => {
    beforeEach(() => {
      global.fetch = MockFactories.createSuccessFetch(
        TestData.createTMDBSeasonsResponse(),
      );
    });

    it("should fetch and add seasons to list", async () => {
      const result = await mediaService.addSeasons({
        id: "507f1f77bcf86cd799439013",
        media_id: "12345",
        list: "507f1f77bcf86cd799439012",
      });
      TestPatterns.testSuccess(result);
    });

    it("should return null on API error", async () => {
      global.fetch = MockFactories.createFailureFetch();

      await TestPatterns.testDatabaseError(mediaService.addSeasons, {
        id: "507f1f77bcf86cd799439013",
        media_id: "12345",
        list: "507f1f77bcf86cd799439012",
      });
    });
  });

  describe("addEpisodes", () => {
    beforeEach(() => {
      global.fetch = MockFactories.createSuccessFetch(
        TestData.createTMDBEpisodesResponse(),
      );
    });

    it("should fetch and add episodes to list", async () => {
      const result = await mediaService.addEpisodes({
        id: "507f1f77bcf86cd799439013",
        season_number: 1,
        show_id: "507f1f77bcf86cd799439014",
        list: "507f1f77bcf86cd799439012",
      });
      TestPatterns.testSuccess(result);
    });

    it("should return null on API error", async () => {
      global.fetch = MockFactories.createFailureFetch();

      await TestPatterns.testDatabaseError(mediaService.addEpisodes, {
        id: "507f1f77bcf86cd799439013",
        season_number: 1,
        show_id: "507f1f77bcf86cd799439014",
        list: "507f1f77bcf86cd799439012",
      });
    });
  });

  describe("Service Functions", () => {
    it("should export all required functions", () => {
      const expectedFunctions = [
        "searchMedia",
        "addToList",
        "getMediaList",
        "removeFromList",
        "toggleWatched",
        "addSeasons",
        "addEpisodes",
        "hideChildren",
      ];

      expectedFunctions.forEach((functionName) => {
        TestPatterns.testFunctionExists(mediaService, functionName);
      });
    });
  });

  describe("Error Handling", () => {
    it("should handle network failures gracefully", async () => {
      global.fetch = MockFactories.createNetworkErrorFetch();

      await expect(mediaService.searchMedia("test")).rejects.toThrow(
        "Network error",
      );
    });

    it("should handle invalid ObjectId gracefully", async () => {
      modelMocks.list.findOne = () =>
        Promise.reject(new Error("Invalid ObjectId"));

      await TestPatterns.testDatabaseError(mediaService.toggleWatched, {
        id: "507f1f77bcf86cd799439013", // Valid ObjectId format
        isWatched: true,
        list: "507f1f77bcf86cd799439012", // Valid ObjectId format
      });
    });

    it("should return null for unauthorized user", async () => {
      const unauthorizedUser = TestData.createUnauthorizedUser();

      const result = await mediaService.addToList(
        { id: "12345", list: "507f1f77bcf86cd799439012" },
        unauthorizedUser,
      );
      expect(result).toBeNull(); // addToList catches errors and returns null
    });
  });
});
