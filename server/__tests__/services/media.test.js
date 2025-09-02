import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;

import {
  createFailureFetch,
  createList,
  createMediaIds,
  createMediaItem,
  createNetworkErrorFetch,
  createObjectId,
  createSuccessFetch,
  createTMDBEpisodesResponse,
  createTMDBSearchResponse,
  createTMDBSeasonsResponse,
  createUnauthorizedUser,
  createUser,
  MockManager,
  restoreMockFactories,
  setupMockFactories,
  testAuthorizationError,
  testDatabaseError,
  testFunctionExists,
  TestSetup,
  testSuccess,
} from "../testUtils.js";

// Setup test environment and mocking
const { originalLogError } = TestSetup.setupTestEnvironment();
const originalModel = mongoose.model;
const modelMocks = setupMockFactories(originalModel);

// Create mock manager for easy test customization
const mockManager = new MockManager(modelMocks);

let mediaService;
let listService;
let tmdb;
let fetchFromTMDB;
let getAuthorizedList;
let updateMediaProperty;

beforeAll(async () => {
  mediaService = (await import("../../services/media.js")).default;
  listService = (await import("../../services/list.js")).default;
  tmdb = await import("../../services/tmdb.js");

  fetchFromTMDB = tmdb.fetchFromTMDB;
  getAuthorizedList = listService.getAuthorizedList;
  updateMediaProperty = listService.updateMediaProperty;
});

describe("Media Service", () => {
  // Test data
  const mockUser = createUser();
  const mockListData = createList();
  const mockMediaItem = createMediaItem();

  beforeEach(() => {
    // Reset to default mocks before each test
    mockManager.resetAll();

    // Set up default mocks that work for most tests
    mockManager.setupTest({
      list: {
        findOne: () => Promise.resolve(mockListData),
        findOneAndUpdate: () =>
          Promise.resolve({ ...mockListData, media: [...mockListData.media] }),
      },
      media: {
        find: () => ({
          select: () => ({
            sort: () => Promise.resolve([mockMediaItem]),
          }),
        }),
        findOne: () => Promise.resolve(mockMediaItem),
        findOneAndUpdate: () => Promise.resolve(mockMediaItem),
      },
    });
  });

  afterAll(() => {
    // Cleanup
    mockManager.resetAll();
    restoreMockFactories(originalModel);
    TestSetup.restoreTestEnvironment({ originalLogError });
  });

  describe("searchMedia", () => {
    beforeEach(() => {
      global.fetch = createSuccessFetch(createTMDBSearchResponse());
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
      global.fetch = createFailureFetch("Not Found");

      await expect(mediaService.searchMedia("bad query")).rejects.toThrow(
        "Not Found",
      );
    });

    it("should throw error on network failure", async () => {
      global.fetch = createNetworkErrorFetch();

      await expect(mediaService.searchMedia("network fail")).rejects.toThrow(
        "Network error",
      );
    });

    it("should sort search results by release date and media type", async () => {
      // Create test data with different dates and types to verify sorting
      const searchResponse = {
        results: [
          {
            id: 3,
            title: "Latest Movie",
            release_date: "2023-12-01", // Latest
            poster_path: "/latest.jpg",
            media_type: "movie",
          },
          {
            id: 1,
            name: "Old TV Show",
            first_air_date: "2020-01-01", // Oldest
            poster_path: "/old-tv.jpg",
            media_type: "tv",
          },
          {
            id: 2,
            title: "Mid Movie",
            release_date: "2021-06-01", // Middle
            poster_path: "/mid.jpg",
            media_type: "movie",
          },
        ],
      };

      global.fetch = createSuccessFetch(searchResponse);
      const result = await mediaService.searchMedia("test query");

      // Should be sorted by release_date ascending, then by media type
      expect(result).toHaveLength(3);
      expect(result[0].title).toBe("Old TV Show");
      expect(result[0].release_date).toEqual(new Date("2020-01-01"));
      expect(result[1].title).toBe("Mid Movie");
      expect(result[1].release_date).toEqual(new Date("2021-06-01"));
      expect(result[2].title).toBe("Latest Movie");
      expect(result[2].release_date).toEqual(new Date("2023-12-01"));
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
      testSuccess(result);
    });

    it("should throw error for unauthorized user", async () => {
      // Create different user ID to simulate unauthorized access
      const unauthorizedUser = {
        _id: "507f1f77bcf86cd799439013", // Different from list.user
      };

      const media = {
        id: "12345",
        list: "507f1f77bcf86cd799439012",
      };

      await expect(
        mediaService.addToList(media, unauthorizedUser),
      ).rejects.toThrow("Unauthorized");
    });

    it("should return null when list is not found", async () => {
      // Mock getAuthorizedList to return null (list not found)
      const originalGetAuthorizedList = listService.getAuthorizedList;
      listService.getAuthorizedList = jest.fn().mockResolvedValue(null);

      const media = {
        id: "12345",
        title: "Test Movie",
        release_date: new Date("2023-01-01"),
        poster_path: "/test.jpg",
        media_type: "movie",
        list: "507f1f77bcf86cd799439012",
      };

      const result = await mediaService.addToList(media, mockUser);
      expect(result).toBeNull();
      expect(listService.getAuthorizedList).toHaveBeenCalledWith(
        media.list,
        mockUser._id,
      );

      // Restore original function
      listService.getAuthorizedList = originalGetAuthorizedList;
    });

    it("should throw error on database error", async () => {
      modelMocks.list.findOne = () =>
        Promise.reject(new Error("Database error"));

      const media = {
        id: "12345",
        list: "507f1f77bcf86cd799439012",
      };

      await expect(mediaService.addToList(media, mockUser)).rejects.toThrow(
        "Database error",
      );
    });
  });

  describe("getMediaList", () => {
    it("should transform media IDs to media objects", async () => {
      const mediaIds = createMediaIds();

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
        {
          ...createMediaItem("67890", "507f1f77bcf86cd799439014"),
          title: "TV Show 2022",
          release_date: new Date("2022-01-01"),
          media_type: 1, // 1 = tv in numeric enum
        },
        createMediaItem("12345", "507f1f77bcf86cd799439013"), // Later date, comes second
      ];

      modelMocks.media.find = () => ({
        select: () => ({
          sort: () => Promise.resolve(mockMultipleMedia),
        }),
      });

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

    it("should sort media by title when release date and type are the same", async () => {
      // Test line 99: return a.title.localeCompare(b.title);
      const sameDate = new Date("2023-01-01");
      const mockMultipleMedia = [
        {
          ...createMediaItem("67890", "507f1f77bcf86cd799439014"),
          title: "Apple Movie", // Should come first alphabetically
          release_date: sameDate,
          media_type: 0, // 0 = movie in numeric enum
        },
        {
          ...createMediaItem("54321", "507f1f77bcf86cd799439015"),
          title: "Beta Movie", // Should come in middle alphabetically
          release_date: sameDate,
          media_type: 0, // 0 = movie in numeric enum
        },
        {
          ...createMediaItem("12345", "507f1f77bcf86cd799439013"),
          title: "Zebra Movie", // Should come last alphabetically
          release_date: sameDate,
          media_type: 0, // 0 = movie in numeric enum
        },
      ];

      modelMocks.media.find = () => ({
        select: () => ({
          sort: () => Promise.resolve(mockMultipleMedia),
        }),
      });

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
        {
          item_id: "507f1f77bcf86cd799439015",
          isWatched: false,
          show_children: false,
        },
      ];

      const result = await mediaService.getMediaList(mediaIds);
      expect(result).toHaveLength(3);
      // Should be sorted alphabetically by title since date and type are the same
      expect(result[0].title).toBe("Apple Movie");
      expect(result[1].title).toBe("Beta Movie");
      expect(result[2].title).toBe("Zebra Movie");
    });

    it("should sort media by type when release dates are the same (movie < tv < season < episode)", async () => {
      // Test lines 98-100: if (mediaTypes[a.media_type] < mediaTypes[b.media_type]) return -1;
      const sameDate = new Date("2023-01-01");
      const mockMultipleMedia = [
        {
          ...createMediaItem("67890", "507f1f77bcf86cd799439014"),
          title: "Test Movie", // movie = 0 (lowest priority number, should come first)
          release_date: sameDate,
          media_type: 0, // 0 = movie in numeric enum
        },
        {
          ...createMediaItem("98765", "507f1f77bcf86cd799439016"),
          title: "Test TV Show", // tv = 1
          release_date: sameDate,
          media_type: 1, // 1 = tv in numeric enum
        },
        {
          ...createMediaItem("54321", "507f1f77bcf86cd799439015"),
          title: "Test Season", // season = 2
          release_date: sameDate,
          media_type: 2, // 2 = season in numeric enum
        },
        {
          ...createMediaItem("12345", "507f1f77bcf86cd799439013"),
          title: "Test Episode", // episode = 3 (highest priority number)
          release_date: sameDate,
          media_type: 3, // 3 = episode in numeric enum
        },
      ];

      modelMocks.media.find = () => ({
        select: () => ({
          sort: () => Promise.resolve(mockMultipleMedia),
        }),
      });

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
        {
          item_id: "507f1f77bcf86cd799439015",
          isWatched: false,
          show_children: false,
        },
        {
          item_id: "507f1f77bcf86cd799439016",
          isWatched: false,
          show_children: false,
        },
      ];

      const result = await mediaService.getMediaList(mediaIds);
      expect(result).toHaveLength(4);
      // Should be sorted by media type priority: movie(0) < tv(1) < season(2) < episode(3)
      expect(result[0].title).toBe("Test Movie");
      expect(result[0].media_type).toBe("movie");
      expect(result[1].title).toBe("Test TV Show");
      expect(result[1].media_type).toBe("tv");
      expect(result[2].title).toBe("Test Season");
      expect(result[2].media_type).toBe("season");
      expect(result[3].title).toBe("Test Episode");
      expect(result[3].media_type).toBe("episode");
    });
  });

  describe("removeFromList", () => {
    let originalGetMediaList;

    beforeEach(() => {
      // Mock getMediaList function
      originalGetMediaList = mediaService.getMediaList;
      // Only set up mock for tests that don't override it
      if (!global.skipRemoveFromListMock) {
        mediaService.getMediaList = () =>
          Promise.resolve([
            {
              id: createObjectId("507f1f77bcf86cd799439013"),
              media_id: "12345",
              title: "Parent Show",
              media_type: "tv",
            },
            {
              id: createObjectId("507f1f77bcf86cd799439014"),
              media_id: "67890",
              title: "Child Season",
              media_type: "season",
              parent_show: createObjectId("507f1f77bcf86cd799439013"),
            },
          ]);
      }
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
      testSuccess(result);
    });

    it("should throw error for unauthorized user", async () => {
      const unauthorizedUser = createUnauthorizedUser();

      await testAuthorizationError(
        mediaService.removeFromList,
        { id: "12345", list: "507f1f77bcf86cd799439012" },
        unauthorizedUser,
      );
    });

    it("should handle case when list is not found", async () => {
      // Mock List.findOne to return null
      modelMocks.list.findOne = () => Promise.resolve(null);

      const result = await mediaService.removeFromList(
        { id: "12345", list: "507f1f77bcf86cd799439012" },
        mockUser,
      );

      expect(result).toBeNull(); // Should gracefully return null when list is not found
    });

    it("should map child media IDs when removing parent items", async () => {
      const result = await mediaService.removeFromList(
        { id: "12345", list: "507f1f77bcf86cd799439012" },
        mockUser,
      );

      testSuccess(result);
    });
  });

  describe("getChildMedia function (via removeFromList)", () => {
    it("should filter and map child media with parent_show relationships", async () => {
      const parentId = createObjectId("507f1f77bcf86cd799439013");
      const childId1 = createObjectId("507f1f77bcf86cd799439014");
      const childId2 = createObjectId("507f1f77bcf86cd799439015");

      // Use MockManager to easily set up parent-child test data
      const testMocks = mockManager.createParentChildMockFactories({
        parentId,
        children: [
          {
            id: childId1,
            media_id: "67890",
            title: "Season 1",
            media_type: "season",
            parent_show: parentId,
          },
          {
            id: childId2,
            media_id: "67891",
            title: "Season 2",
            media_type: "season",
            parent_show: parentId,
          },
          {
            id: createObjectId("507f1f77bcf86cd799439016"),
            media_id: "67892",
            title: "Season from different show",
            media_type: "season",
            parent_show: createObjectId("507f1f77bcf86cd799439099"), // Different parent
          },
        ],
        listData: mockListData,
      });

      // Apply the test-specific mocks
      mockManager.setupTest(testMocks);

      const result = await mediaService.removeFromList(
        { id: "12345", list: "507f1f77bcf86cd799439012" },
        mockUser,
      );

      testSuccess(result);
    });

    it("should filter and map child media with parent_season relationships", async () => {
      const parentSeasonId = createObjectId("507f1f77bcf86cd799439013");
      const childEpisodeId1 = createObjectId("507f1f77bcf86cd799439014");
      const childEpisodeId2 = createObjectId("507f1f77bcf86cd799439015");

      mediaService.getMediaList = () =>
        Promise.resolve([
          {
            id: parentSeasonId,
            media_id: "12345",
            title: "Season 1",
            media_type: "season",
            parent_show: createObjectId("507f1f77bcf86cd799439010"),
          },
          {
            id: childEpisodeId1,
            media_id: "67890",
            title: "Episode 1",
            media_type: "episode",
            parent_season: parentSeasonId, // This should match the parent season
            parent_show: createObjectId("507f1f77bcf86cd799439010"),
          },
          {
            id: childEpisodeId2,
            media_id: "67891",
            title: "Episode 2",
            media_type: "episode",
            parent_season: parentSeasonId, // This should match the parent season
            parent_show: createObjectId("507f1f77bcf86cd799439010"),
          },
          {
            id: createObjectId("507f1f77bcf86cd799439016"),
            media_id: "67892",
            title: "Episode from different season",
            media_type: "episode",
            parent_season: createObjectId("507f1f77bcf86cd799439099"),
            parent_show: createObjectId("507f1f77bcf86cd799439010"),
          },
        ]);

      const result = await mediaService.removeFromList(
        { id: "12345", list: "507f1f77bcf86cd799439012" },
        mockUser,
      );

      testSuccess(result);
    });

    it("should handle case with no matching children (empty filter result)", async () => {
      const parentId = createObjectId("507f1f77bcf86cd799439013");

      mediaService.getMediaList = () =>
        Promise.resolve([
          {
            id: parentId,
            media_id: "12345",
            title: "Parent Item with No Children",
            media_type: "movie",
          },
          {
            id: createObjectId("507f1f77bcf86cd799439014"),
            media_id: "67890",
            title: "Unrelated Item",
            media_type: "movie",
            // No parent relationships - should be filtered out
          },
        ]);

      const result = await mediaService.removeFromList(
        { id: "12345", list: "507f1f77bcf86cd799439012" },
        mockUser,
      );

      testSuccess(result);
    });

    it("should handle mixed parent relationships (both parent_show and parent_season)", async () => {
      const parentShowId = createObjectId("507f1f77bcf86cd799439013");
      const seasonId = createObjectId("507f1f77bcf86cd799439014");
      const episodeId = createObjectId("507f1f77bcf86cd799439015");

      mediaService.getMediaList = () =>
        Promise.resolve([
          {
            id: parentShowId,
            media_id: "12345",
            title: "Parent TV Show",
            media_type: "tv",
          },
          {
            id: seasonId,
            media_id: "67890",
            title: "Season 1",
            media_type: "season",
            parent_show: parentShowId, // This should match
          },
          {
            id: episodeId,
            media_id: "67891",
            title: "Episode 1",
            media_type: "episode",
            parent_season: seasonId,
            parent_show: parentShowId, // Both parent relationships present
          },
          {
            id: createObjectId("507f1f77bcf86cd799439016"),
            media_id: "67892",
            title: "Different Show Season",
            media_type: "season",
            parent_show: createObjectId("507f1f77bcf86cd799439099"),
          },
        ]);

      const result = await mediaService.removeFromList(
        { id: "12345", list: "507f1f77bcf86cd799439012" },
        mockUser,
      );

      testSuccess(result);
    });
  });

  describe("toggleWatched", () => {
    it("should update watched status", async () => {
      const result = await mediaService.toggleWatched({
        id: "507f1f77bcf86cd799439013",
        isWatched: true,
        list: "507f1f77bcf86cd799439012",
      });
      testSuccess(result);
    });

    it("should return null when list is not found", async () => {
      modelMocks.list.findOne = () => Promise.resolve(null);

      const result = await mediaService.toggleWatched({
        id: "507f1f77bcf86cd799439013",
        isWatched: true,
        list: "507f1f77bcf86cd799439012",
      });

      expect(result).toBeNull();
    });

    it("should return null on error", async () => {
      modelMocks.list.findOne = () =>
        Promise.reject(new Error("Database error"));

      await testDatabaseError(mediaService.toggleWatched, {
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
      testSuccess(result);
    });

    it("should return null when list is not found", async () => {
      modelMocks.list.findOne = () => Promise.resolve(null);

      const result = await mediaService.hideChildren({
        id: "507f1f77bcf86cd799439013",
        list: "507f1f77bcf86cd799439012",
      });
      expect(result).toBeNull();
    });

    it("should find and update media item by matching item_id", async () => {
      const testListData = {
        ...mockListData,
        media: [
          {
            item_id: new ObjectId("507f1f77bcf86cd799439013"),
            isWatched: false,
            show_children: true,
          },
          {
            item_id: new ObjectId("507f1f77bcf86cd799439014"),
            isWatched: false,
            show_children: true,
          },
        ],
      };

      modelMocks.list.findOne = () => Promise.resolve(testListData);

      const result = await mediaService.hideChildren({
        id: "507f1f77bcf86cd799439013",
        list: "507f1f77bcf86cd799439012",
      });

      testSuccess(result);
    });

    it("should return null on error", async () => {
      modelMocks.list.findOne = () =>
        Promise.reject(new Error("Database error"));

      await testDatabaseError(mediaService.hideChildren, {
        id: "507f1f77bcf86cd799439013",
        list: "507f1f77bcf86cd799439012",
      });
    });
  });

  describe("addSeasons", () => {
    beforeEach(() => {
      global.fetch = createSuccessFetch(createTMDBSeasonsResponse());
    });

    it("should fetch and add seasons to list", async () => {
      const result = await mediaService.addSeasons({
        id: "507f1f77bcf86cd799439013",
        media_id: "12345",
        list: "507f1f77bcf86cd799439012",
      });
      testSuccess(result);
    });

    it("should throw error on API error", async () => {
      global.fetch = createFailureFetch();

      await expect(
        mediaService.addSeasons({
          id: "507f1f77bcf86cd799439013",
          media_id: "12345",
          list: "507f1f77bcf86cd799439012",
        }),
      ).rejects.toThrow();
    });
  });

  describe("addEpisodes", () => {
    beforeEach(() => {
      global.fetch = createSuccessFetch(createTMDBEpisodesResponse());
    });

    it("should fetch and add episodes to list", async () => {
      const result = await mediaService.addEpisodes({
        id: "507f1f77bcf86cd799439013",
        season_number: 1,
        show_id: "507f1f77bcf86cd799439014",
        list: "507f1f77bcf86cd799439012",
      });
      testSuccess(result);
    });

    it("should throw error on API error", async () => {
      global.fetch = createFailureFetch();

      await expect(
        mediaService.addEpisodes({
          id: "507f1f77bcf86cd799439013",
          season_number: 1,
          show_id: "507f1f77bcf86cd799439014",
          list: "507f1f77bcf86cd799439012",
        }),
      ).rejects.toThrow();
    });
  });

  describe("Helper Functions", () => {
    describe("fetchFromTMDB", () => {
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
    });

    describe("getAuthorizedList", () => {
      it("should return list when user is authorized", async () => {
        const mockList = { ...mockListData, user: mockUser._id };
        modelMocks.list.findOne = () => Promise.resolve(mockList);

        const result = await getAuthorizedList(mockList._id, mockUser._id);
        expect(result).toEqual(mockList);
      });

      it("should throw error when user is not authorized", async () => {
        const mockList = { ...mockListData, user: new ObjectId() };
        modelMocks.list.findOne = () => Promise.resolve(mockList);

        await expect(
          getAuthorizedList(mockList._id, mockUser._id),
        ).rejects.toThrow("Unauthorized");
      });

      it("should return null when list is not found", async () => {
        modelMocks.list.findOne = () => Promise.resolve(null);

        const result = await getAuthorizedList(new ObjectId(), mockUser._id);
        expect(result).toBeNull();
      });
    });

    describe("updateMediaProperty", () => {
      it("should update media property successfully", async () => {
        const mockList = {
          ...mockListData,
          media: [{ item_id: mockMediaItem._id, isWatched: false }],
        };
        modelMocks.list.findOne = () => Promise.resolve(mockList);
        modelMocks.list.findOneAndUpdate = jest.fn(() =>
          Promise.resolve(mockList),
        );

        const result = await updateMediaProperty(
          mockList._id,
          mockMediaItem._id,
          { isWatched: true },
        );

        expect(result).toEqual(mockList);
        expect(modelMocks.list.findOneAndUpdate).toHaveBeenCalled();
      });

      it("should return null when list is not found", async () => {
        modelMocks.list.findOne = () => Promise.resolve(null);

        const result = await updateMediaProperty(
          new ObjectId(),
          mockMediaItem._id,
          { isWatched: true },
        );
        expect(result).toBeNull();
      });

      it("should return null when media item is not found in list", async () => {
        const mockList = { ...mockListData, media: [] };
        modelMocks.list.findOne = () => Promise.resolve(mockList);

        const result = await updateMediaProperty(mockList._id, new ObjectId(), {
          isWatched: true,
        });
        expect(result).toBeNull();
      });

      it("should handle errors gracefully", async () => {
        modelMocks.list.findOne = () => Promise.reject(new Error("DB error"));

        await expect(
          updateMediaProperty(mockListData._id, mockMediaItem._id, {
            isWatched: true,
          }),
        ).rejects.toThrow("DB error");
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
        testFunctionExists(mediaService, functionName);
      });
    });
  });

  describe("Error Handling", () => {
    it("should handle network failures gracefully", async () => {
      global.fetch = createNetworkErrorFetch();

      await expect(mediaService.searchMedia("test")).rejects.toThrow(
        "Network error",
      );
    });

    it("should handle invalid ObjectId gracefully", async () => {
      modelMocks.list.findOne = () =>
        Promise.reject(new Error("Invalid ObjectId"));

      await testDatabaseError(mediaService.toggleWatched, {
        id: "507f1f77bcf86cd799439013", // Valid ObjectId format
        isWatched: true,
        list: "507f1f77bcf86cd799439012", // Valid ObjectId format
      });
    });

    it("should throw error for unauthorized user", async () => {
      const unauthorizedUser = createUnauthorizedUser();

      await expect(
        mediaService.addToList(
          { id: "12345", list: "507f1f77bcf86cd799439012" },
          unauthorizedUser,
        ),
      ).rejects.toThrow("Unauthorized");
    });
  });
});
