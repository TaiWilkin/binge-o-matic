/* istanbul ignore file */
import { jest } from "@jest/globals";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

const { ObjectId } = mongoose.Types;

/**
 * Simple mock manager for customizing database mocks per test
 * Now using Jest's global mocking functions
 */
export class MockManager {
  constructor(modelMocks) {
    this.modelMocks = modelMocks;
    this.originalMocks = {};
    this.activeMocks = new Set();
  }

  /**
   * Create a simple mock setup for a test
   * @param {Object} config - Mock configuration
   * @param {Object} config.list - List model mocks
   * @param {Object} config.media - Media model mocks
   * @param {Function} config.list.findOne - Mock for List.findOne
   * @param {Function} config.list.findOneAndUpdate - Mock for List.findOneAndUpdate
   * @param {Function} config.media.find - Mock for Media.find
   * @param {Function} config.media.findOne - Mock for Media.findOne
   * @param {Function} config.media.findOneAndUpdate - Mock for Media.findOneAndUpdate
   */
  setupTest(config = {}) {
    // Store original mocks if not already stored
    if (!this.originalMocks.list) {
      this.originalMocks.list = {
        find: this.modelMocks.list.find,
        findOne: this.modelMocks.list.findOne,
        findOneAndUpdate: this.modelMocks.list.findOneAndUpdate,
        create: this.modelMocks.list.create,
        deleteOne: this.modelMocks.list.deleteOne,
      };
      this.originalMocks.media = {
        find: this.modelMocks.media.find,
        findOne: this.modelMocks.media.findOne,
        findOneAndUpdate: this.modelMocks.media.findOneAndUpdate,
      };
    }

    // Apply list mocks
    if (config.list) {
      if (config.list.find) {
        this.modelMocks.list.find = config.list.find;
        this.activeMocks.add("list.find");
      }
      if (config.list.findOne) {
        this.modelMocks.list.findOne = config.list.findOne;
        this.activeMocks.add("list.findOne");
      }
      if (config.list.findOneAndUpdate) {
        this.modelMocks.list.findOneAndUpdate = config.list.findOneAndUpdate;
        this.activeMocks.add("list.findOneAndUpdate");
      }
      if (config.list.create) {
        this.modelMocks.list.create = config.list.create;
        this.activeMocks.add("list.create");
      }
      if (config.list.deleteOne) {
        this.modelMocks.list.deleteOne = config.list.deleteOne;
        this.activeMocks.add("list.deleteOne");
      }
    }

    // Apply media mocks
    if (config.media) {
      if (config.media.find) {
        this.modelMocks.media.find = config.media.find;
        this.activeMocks.add("media.find");
      }
      if (config.media.findOne) {
        this.modelMocks.media.findOne = config.media.findOne;
        this.activeMocks.add("media.findOne");
      }
      if (config.media.findOneAndUpdate) {
        this.modelMocks.media.findOneAndUpdate = config.media.findOneAndUpdate;
        this.activeMocks.add("media.findOneAndUpdate");
      }
    }
  }

  /**
   * Reset all mocks to their original state
   */
  resetAll() {
    if (this.originalMocks.list) {
      this.modelMocks.list.find = this.originalMocks.list.find;
      this.modelMocks.list.findOne = this.originalMocks.list.findOne;
      this.modelMocks.list.findOneAndUpdate =
        this.originalMocks.list.findOneAndUpdate;
      this.modelMocks.list.create = this.originalMocks.list.create;
      this.modelMocks.list.deleteOne = this.originalMocks.list.deleteOne;
    }
    if (this.originalMocks.media) {
      this.modelMocks.media.find = this.originalMocks.media.find;
      this.modelMocks.media.findOne = this.originalMocks.media.findOne;
      this.modelMocks.media.findOneAndUpdate =
        this.originalMocks.media.findOneAndUpdate;
    }
    this.activeMocks.clear();
  }

  /**
   * Create test data with parent-child relationships for media
   * @param {Object} config - Configuration for test data
   * @param {string} config.parentId - Parent media ID
   * @param {Array} config.children - Array of child media objects
   * @param {Object} config.listData - List data to use
   */
  createParentChildMockFactories({ parentId, children = [], listData }) {
    const mediaData = [
      {
        _id: parentId,
        id: parentId,
        media_id: "12345",
        title: "Parent TV Show",
        media_type: 1, // 1 = tv in numeric enum
      },
      ...children.map((child) => ({
        _id: child.id,
        id: child.id,
        media_id: child.media_id || `child-${child.id}`,
        title: child.title || `Child ${child.id}`,
        media_type:
          child.media_type === "season"
            ? 2
            : child.media_type === "episode"
              ? 3
              : child.media_type === "tv"
                ? 1
                : 0, // Convert to numeric
        parent_show: child.parent_show || parentId,
        parent_season: child.parent_season,
      })),
    ];

    const mediaIds = [
      { item_id: parentId, isWatched: false, show_children: false },
      ...children.map((child) => ({
        item_id: child.id,
        isWatched: child.isWatched || false,
        show_children: child.show_children || false,
      })),
    ];

    return {
      list: {
        findOne: jest.fn(() =>
          Promise.resolve({
            ...listData,
            media: mediaIds,
          }),
        ),
      },
      media: {
        find: jest.fn(() => ({
          select: jest.fn(() => ({
            sort: jest.fn(() => Promise.resolve(mediaData)),
          })),
        })),
      },
    };
  }
}

// Test database setup and teardown utilities
export class TestSetup {
  static mongoServer = null;
  static isInitialized = false;

  static async initializeTest() {
    if (!this.isInitialized) {
      try {
        // Start MongoDB Memory Server
        this.mongoServer = await MongoMemoryServer.create();
        const uri = this.mongoServer.getUri();

        // Connect to the in-memory database
        await mongoose.connect(uri);

        // Import models to register them with mongoose
        await import("../models/index.js");

        this.isInitialized = true;
      } catch (error) {
        console.error("Failed to initialize test setup:", error);
        throw error;
      }
    }

    // Clear all collections - but only do this efficiently
    await this.clearDatabase();
  }

  static async clearDatabase() {
    // Only clear if we have a connection and collections exist
    if (mongoose.connection.readyState === 1) {
      const collections = mongoose.connection.collections;
      const clearPromises = Object.values(collections).map((collection) =>
        collection.deleteMany({}),
      );
      await Promise.all(clearPromises);
    }
  }

  static async initializeTestOnce() {
    // Initialize once per test suite, not per test
    if (!this.isInitialized) {
      await this.initializeTest();
    }
  }

  static async cleanupTest() {
    // Clear all mocks
    jest.clearAllMocks();
    jest.restoreAllMocks();
  }

  // Additional test setup utilities
  static setupTestEnvironment() {
    // Mock environment variables
    process.env.API_KEY = "test_api_key";

    // Mock global fetch with Jest
    global.fetch = jest.fn(() => Promise.resolve());

    // Mock console.error with Jest
    const originalLogError = console.error;
    console.error = jest.fn();

    return { originalLogError };
  }

  static restoreTestEnvironment({ originalLogError }) {
    console.error = originalLogError;
    // Clear all Jest mocks
    jest.clearAllMocks();
  }

  static async teardownTest() {
    // Disconnect mongoose if connected
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    // Stop the in-memory Mongo server if running
    if (this.mongoServer) {
      await this.mongoServer.stop();
      this.mongoServer = null;
      this.isInitialized = false;
    }

    // Clear mocks just in case
    jest.clearAllMocks();
    jest.restoreAllMocks();
  }
}

// Mock factories - ObjectId factories
export function createObjectId(id = "507f1f77bcf86cd799439011") {
  return new ObjectId(id);
}

// User factories
export function createUser(id = "507f1f77bcf86cd799439011") {
  return {
    id,
    _id: createObjectId(id),
    email: "test@example.com",
    __typename: "UserType",
  };
}

export function createUnauthorizedUser() {
  return {
    _id: createObjectId("999999999999999999999999"),
    email: "unauthorized@example.com",
  };
}

// List factories
export function createList(
  name = "Test List",
  userId = "507f1f77bcf86cd799439011",
  listId = "507f1f77bcf86cd799439012",
) {
  return {
    _id: createObjectId(listId),
    name,
    user: createObjectId(userId),
    media: [
      {
        item_id: createObjectId("507f1f77bcf86cd799439013"),
        isWatched: false,
        show_children: false,
      },
    ],
    toObject: function () {
      return this;
    },
  };
}

// Media factories
export function createMediaItem(
  mediaId = "12345",
  itemId = "507f1f77bcf86cd799439013",
) {
  return {
    _id: createObjectId(itemId),
    media_id: mediaId,
    title: "Test Movie",
    __typename: "MediaType",
    release_date: new Date("2023-01-01"),
    poster_path: "/test.jpg",
    media_type: 0, // Use numeric value for database (0 = movie)
  };
}

export function createMediaIds() {
  return [
    {
      item_id: "507f1f77bcf86cd799439013",
      isWatched: false,
      show_children: false,
    },
  ];
}

// TMDB API response factories
export function createTMDBSearchResponse() {
  return {
    results: [
      {
        id: 12345,
        title: "Test Movie",
        __typename: "MediaType",
        release_date: "2023-01-01",
        poster_path: "/test.jpg",
        media_type: "movie",
      },
      {
        id: 67890,
        name: "Test TV Show",
        __typename: "MediaType",
        first_air_date: "2023-02-01",
        poster_path: "/test-tv.jpg",
        media_type: "tv",
      },
      {
        id: 11111,
        title: "Invalid Movie",
        __typename: "MediaType",
        poster_path: "/invalid.jpg",
        media_type: "movie",
        // No release_date or first_air_date - should be filtered out
      },
    ],
  };
}

export function createTMDBSeasonsResponse() {
  return {
    name: "Test TV Show",
    seasons: [
      {
        id: 11111,
        season_number: 1,
        __typename: "MediaType",
        air_date: "2023-01-01",
        poster_path: "/season1.jpg",
      },
      {
        id: 22222,
        season_number: 2,
        __typename: "MediaType",
        air_date: "2024-01-01",
        poster_path: "/season2.jpg",
      },
    ],
  };
}

export function createTMDBEpisodesResponse() {
  return {
    name: "Season 1",
    episodes: [
      {
        id: 33333,
        name: "Episode 1",
        __typename: "MediaType",
        episode_number: 1,
        air_date: "2023-01-01",
        still_path: "/episode1.jpg",
      },
      {
        id: 44444,
        name: "Episode 2",
        __typename: "MediaType",
        episode_number: 2,
        air_date: "2023-01-08",
        still_path: "/episode2.jpg",
      },
    ],
  };
}

// Request object factory for auth tests
export function createMockReq(
  user = null,
  logInError = null,
  logoutError = null,
) {
  return {
    user,
    logIn: (user, callback) => callback(logInError),
    logout: (callback) => callback(logoutError),
  };
}

// Context object factory for auth tests
export function createMockContext(
  authenticateResult = { user: null },
  loginError = null,
) {
  return {
    buildContext: {
      authenticate: () => Promise.resolve(authenticateResult),
      login: loginError
        ? () => Promise.reject(loginError)
        : () => Promise.resolve(),
    },
  };
}

// Fetch mock factory for API tests
export function createSuccessFetch(responseData) {
  return () =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(responseData),
    });
}

export function createFailureFetch(statusText = "Not Found") {
  return () =>
    Promise.resolve({
      ok: false,
      statusText,
    });
}

export function createNetworkErrorFetch(errorMessage = "Network error") {
  return () => Promise.reject(new Error(errorMessage));
}

// Create mongoose model mocks with Jest functions
export function createListModel() {
  return {
    find: jest.fn(() => Promise.resolve([])),
    findOne: jest.fn(() => Promise.resolve(null)),
    create: jest.fn(() => Promise.resolve({})),
    deleteOne: jest.fn(() => Promise.resolve({})),
    findOneAndUpdate: jest.fn(() => Promise.resolve({})),
  };
}

export function createMediaModel() {
  const defaultMediaItem = {
    _id: createObjectId("507f1f77bcf86cd799439013"),
    media_id: "12345",
    title: "Test Movie",
    __typename: "MediaType",
    release_date: new Date("2023-01-01"),
    poster_path: "/test.jpg",
    media_type: 0, // Use numeric value for database
    number: 1,
    parent_show: null,
    parent_season: null,
    episode: null,
  };

  return {
    find: jest.fn(() => ({
      select: jest.fn(() => ({
        sort: jest.fn(() => Promise.resolve([defaultMediaItem])),
      })),
    })),
    findOne: jest.fn(() => Promise.resolve(defaultMediaItem)),
    findOneAndUpdate: jest.fn(() => Promise.resolve(defaultMediaItem)),
  };
}

export function createUserModel() {
  return {
    findOne: jest.fn(() => Promise.resolve(null)),
    create: jest.fn(() => Promise.resolve({})),
  };
}

// Setup mongoose model mocking
export function setupMockFactories(originalModel) {
  const mocks = {
    list: createListModel(),
    media: createMediaModel(),
    user: createUserModel(),
  };

  mongoose.model = (modelName) => {
    if (mocks[modelName]) return mocks[modelName];
    return originalModel(modelName);
  };

  return mocks;
}

// Restore original mongoose.model
export function restoreMockFactories(originalModel) {
  mongoose.model = originalModel;
}

// Common test patterns - enhanced with Jest
// Test that a function exists and is callable
export function testFunctionExists(service, functionName) {
  expect(typeof service[functionName]).toBe("function");
}

// Test database error handling
export async function testDatabaseError(serviceFunction, ...args) {
  await expect(serviceFunction(...args)).rejects.toThrow();
}

// Test authorization error
export async function testAuthorizationError(serviceFunction, ...args) {
  await expect(serviceFunction(...args)).rejects.toThrow("Unauthorized");
}

// Test that result is defined (success case)
export function testSuccess(result) {
  expect(result).toBeDefined();
}
