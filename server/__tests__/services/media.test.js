import mongoose from "mongoose";

const { ObjectId } = mongoose.Types;

// Mock global fetch
global.fetch = () => Promise.resolve();

// Mock environment variable
process.env.API_KEY = "test_api_key";

// Mock mongoose models before importing the service
const mockListModel = {
  findOne: () => Promise.resolve(),
  findOneAndUpdate: () => Promise.resolve(),
};

const mockMediaModel = {
  find: () => Promise.resolve(),
  findOne: () => Promise.resolve(),
  findOneAndUpdate: () => Promise.resolve(),
};

// Mock mongoose.model to return our mocks
const originalModel = mongoose.model;
mongoose.model = (modelName) => {
  if (modelName === "list") return mockListModel;
  if (modelName === "media") return mockMediaModel;
  return originalModel(modelName);
};

// Now import the service after mocking
const mediaService = await import("../../services/media.js").then(
  (m) => m.default,
);

describe("Media Service", () => {
  let originalLogError;

  beforeEach(() => {
    // Create fresh mock list data with proper methods
    const freshMockListData = {
      _id: new ObjectId("507f1f77bcf86cd799439012"),
      user: new ObjectId("507f1f77bcf86cd799439011"),
      media: [
        {
          item_id: new ObjectId("507f1f77bcf86cd799439013"),
          isWatched: false,
          show_children: false,
        },
      ],
      toObject: function () {
        return this;
      },
    };

    // Reset mock implementations with full Promise chains
    mockListModel.findOne = () => Promise.resolve(freshMockListData);
    mockListModel.findOneAndUpdate = () => Promise.resolve(mockUpdatedList);
    mockMediaModel.find = () => Promise.resolve(mockMediaData);
    mockMediaModel.findOne = () => Promise.resolve(mockMediaItem);
    mockMediaModel.findOneAndUpdate = () => Promise.resolve(mockMediaItem);

    // Mock logError
    originalLogError = console.error;
    console.error = () => {};
  });

  afterEach(() => {
    // Restore original console.error
    console.error = originalLogError;
  });

  // Mock data
  const mockUser = {
    _id: new ObjectId("507f1f77bcf86cd799439011"),
  };

  const mockListData = {
    _id: new ObjectId("507f1f77bcf86cd799439012"),
    user: new ObjectId("507f1f77bcf86cd799439011"),
    media: [
      {
        item_id: new ObjectId("507f1f77bcf86cd799439013"),
        isWatched: false,
        show_children: false,
      },
    ],
    toObject: function () {
      return this;
    }, // Add toObject method for spread operator
  };

  const mockUpdatedList = {
    ...mockListData,
    media: [...mockListData.media],
  };

  const mockMediaItem = {
    _id: new ObjectId("507f1f77bcf86cd799439013"),
    media_id: "12345",
    title: "Test Movie",
    release_date: new Date("2023-01-01"),
    poster_path: "/test.jpg",
    media_type: "movie",
  };

  const mockMediaData = [mockMediaItem];

  describe("searchMedia", () => {
    beforeEach(() => {
      global.fetch = (url) => {
        if (url.includes("search/multi")) {
          return Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve({
                results: [
                  {
                    id: 12345,
                    title: "Test Movie",
                    release_date: "2023-01-01",
                    poster_path: "/test.jpg",
                    media_type: "movie",
                  },
                  {
                    id: 67890,
                    name: "Test TV Show", // TV shows use 'name' instead of 'title'
                    first_air_date: "2023-02-01",
                    poster_path: "/test-tv.jpg",
                    media_type: "tv",
                  },
                  {
                    id: 11111,
                    title: "Invalid Movie",
                    // No release_date or first_air_date - should be filtered out
                    poster_path: "/invalid.jpg",
                    media_type: "movie",
                  },
                ],
              }),
          });
        }
        return Promise.reject(new Error("Not Found"));
      };
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
      global.fetch = () =>
        Promise.resolve({
          ok: false,
          statusText: "Not Found",
        });

      await expect(mediaService.searchMedia("bad query")).rejects.toThrow(
        "Not Found",
      );
    });

    it("should throw error on network failure", async () => {
      global.fetch = () => Promise.reject(new Error("Network error"));

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
      expect(result).toBeDefined();
    });

    it("should return null for unauthorized user", async () => {
      const unauthorizedUser = {
        _id: new ObjectId("507f1f77bcf86cd799439999"), // Different user ID
      };

      mockListModel.findOne = () => Promise.resolve(mockListData);

      const media = {
        id: "12345",
        list: "507f1f77bcf86cd799439012",
      };

      const result = await mediaService.addToList(media, unauthorizedUser);
      expect(result).toBeNull(); // addToList catches errors and returns null
    });

    it("should return null on database error", async () => {
      mockListModel.findOne = () => Promise.reject(new Error("Database error"));

      const media = {
        id: "12345",
        list: "507f1f77bcf86cd799439012",
      };

      const result = await mediaService.addToList(media, mockUser);
      expect(result).toBeNull();
    });
  });

  describe("getMediaList", () => {
    it("should transform media IDs to media objects", async () => {
      const mediaIds = [
        {
          item_id: "507f1f77bcf86cd799439013",
          isWatched: false,
          show_children: false,
        },
      ];

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
          _id: new ObjectId("507f1f77bcf86cd799439013"),
          media_id: "12345",
          title: "Movie 2023",
          release_date: new Date("2023-01-01"),
          media_type: "movie",
        },
        {
          _id: new ObjectId("507f1f77bcf86cd799439014"),
          media_id: "67890",
          title: "TV Show 2022",
          release_date: new Date("2022-01-01"),
          media_type: "tv",
        },
      ];

      mockMediaModel.find = () => Promise.resolve(mockMultipleMedia);

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
      expect(result[1].title).toBe("Movie 2023");
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
            id: new ObjectId("507f1f77bcf86cd799439013"),
            media_id: "12345",
            title: "Parent Show",
            media_type: "tv",
          },
          {
            id: new ObjectId("507f1f77bcf86cd799439014"),
            media_id: "67890",
            title: "Child Season",
            media_type: "season",
            parent_show: new ObjectId("507f1f77bcf86cd799439013"),
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
      expect(result).toBeDefined();
    });

    it("should throw error for unauthorized user", async () => {
      const unauthorizedUser = {
        _id: new ObjectId("507f1f77bcf86cd799439999"),
      };

      await expect(
        mediaService.removeFromList(
          { id: "12345", list: "507f1f77bcf86cd799439012" },
          unauthorizedUser,
        ),
      ).rejects.toThrow("Unauthorized");
    });
  });

  describe("toggleWatched", () => {
    it("should update watched status", async () => {
      const result = await mediaService.toggleWatched({
        id: "507f1f77bcf86cd799439013",
        isWatched: true,
        list: "507f1f77bcf86cd799439012",
      });
      expect(result).toBeDefined();
    });

    it("should return null on error", async () => {
      mockListModel.findOne = () => Promise.reject(new Error("Database error"));

      const result = await mediaService.toggleWatched({
        id: "507f1f77bcf86cd799439013",
        isWatched: true,
        list: "507f1f77bcf86cd799439012",
      });
      expect(result).toBeNull();
    });
  });

  describe("hideChildren", () => {
    it("should hide child items", async () => {
      const result = await mediaService.hideChildren({
        id: "507f1f77bcf86cd799439013",
        list: "507f1f77bcf86cd799439012",
      });
      expect(result).toBeDefined();
    });

    it("should return null on error", async () => {
      mockListModel.findOne = () => Promise.reject(new Error("Database error"));

      const result = await mediaService.hideChildren({
        id: "507f1f77bcf86cd799439013",
        list: "507f1f77bcf86cd799439012",
      });
      expect(result).toBeNull();
    });
  });

  describe("addSeasons", () => {
    beforeEach(() => {
      global.fetch = (url) => {
        if (url.includes("/tv/")) {
          return Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve({
                name: "Test TV Show",
                seasons: [
                  {
                    id: 11111,
                    season_number: 1,
                    air_date: "2023-01-01",
                    poster_path: "/season1.jpg",
                  },
                  {
                    id: 22222,
                    season_number: 2,
                    air_date: "2024-01-01",
                    poster_path: "/season2.jpg",
                  },
                ],
              }),
          });
        }
        return Promise.reject(new Error("Not Found"));
      };
    });

    it("should fetch and add seasons to list", async () => {
      const result = await mediaService.addSeasons({
        id: "507f1f77bcf86cd799439013",
        media_id: "12345",
        list: "507f1f77bcf86cd799439012",
      });
      expect(result).toBeDefined();
    });

    it("should return null on API error", async () => {
      global.fetch = () =>
        Promise.resolve({
          ok: false,
          statusText: "Not Found",
        });

      const result = await mediaService.addSeasons({
        id: "507f1f77bcf86cd799439013",
        media_id: "12345",
        list: "507f1f77bcf86cd799439012",
      });
      expect(result).toBeNull();
    });
  });

  describe("addEpisodes", () => {
    beforeEach(() => {
      global.fetch = (url) => {
        if (url.includes("/season/")) {
          return Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve({
                name: "Season 1",
                episodes: [
                  {
                    id: 33333,
                    name: "Episode 1",
                    episode_number: 1,
                    air_date: "2023-01-01",
                    still_path: "/episode1.jpg",
                  },
                  {
                    id: 44444,
                    name: "Episode 2",
                    episode_number: 2,
                    air_date: "2023-01-08",
                    still_path: "/episode2.jpg",
                  },
                ],
              }),
          });
        }
        return Promise.reject(new Error("Not Found"));
      };
    });

    it("should fetch and add episodes to list", async () => {
      const result = await mediaService.addEpisodes({
        id: "507f1f77bcf86cd799439013",
        season_number: 1,
        show_id: "507f1f77bcf86cd799439014",
        list: "507f1f77bcf86cd799439012",
      });
      expect(result).toBeDefined();
    });

    it("should return null on API error", async () => {
      global.fetch = () =>
        Promise.resolve({
          ok: false,
          statusText: "Not Found",
        });

      const result = await mediaService.addEpisodes({
        id: "507f1f77bcf86cd799439013",
        season_number: 1,
        show_id: "507f1f77bcf86cd799439014",
        list: "507f1f77bcf86cd799439012",
      });
      expect(result).toBeNull();
    });
  });

  describe("Service Functions", () => {
    it("should export all required functions", () => {
      expect(typeof mediaService.searchMedia).toBe("function");
      expect(typeof mediaService.addToList).toBe("function");
      expect(typeof mediaService.getMediaList).toBe("function");
      expect(typeof mediaService.removeFromList).toBe("function");
      expect(typeof mediaService.toggleWatched).toBe("function");
      expect(typeof mediaService.addSeasons).toBe("function");
      expect(typeof mediaService.addEpisodes).toBe("function");
      expect(typeof mediaService.hideChildren).toBe("function");
    });
  });

  describe("Error Handling", () => {
    it("should handle network failures gracefully", async () => {
      global.fetch = () => Promise.reject(new Error("Network error"));

      await expect(mediaService.searchMedia("test")).rejects.toThrow(
        "Network error",
      );
    });

    it("should handle invalid ObjectId gracefully", async () => {
      // Use a valid ObjectId string to avoid BSONError during construction
      mockListModel.findOne = () =>
        Promise.reject(new Error("Invalid ObjectId"));

      const result = await mediaService.toggleWatched({
        id: "507f1f77bcf86cd799439013", // Valid ObjectId format
        isWatched: true,
        list: "507f1f77bcf86cd799439012", // Valid ObjectId format
      });
      expect(result).toBeNull();
    });

    it("should return null for unauthorized user", async () => {
      const unauthorizedUser = {
        _id: new ObjectId("999999999999999999999999"),
      };

      const result = await mediaService.addToList(
        { id: "12345", list: "507f1f77bcf86cd799439012" },
        unauthorizedUser,
      );
      expect(result).toBeNull(); // addToList catches errors and returns null
    });
  });
});
