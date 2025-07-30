import mongoose from "mongoose";

const { ObjectId } = mongoose.Types;

// Common test data factories
export const TestData = {
  // ObjectId factories
  createObjectId: (id = "507f1f77bcf86cd799439011") => new ObjectId(id),

  // User factories
  createUser: (id = "507f1f77bcf86cd799439011") => ({
    id,
    _id: new ObjectId(id),
    email: "test@example.com",
  }),

  createUnauthorizedUser: () => ({
    _id: new ObjectId("999999999999999999999999"),
    email: "unauthorized@example.com",
  }),

  // List factories
  createList: (
    name = "Test List",
    userId = "507f1f77bcf86cd799439011",
    listId = "507f1f77bcf86cd799439012",
  ) => ({
    _id: new ObjectId(listId),
    name,
    user: new ObjectId(userId),
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
  }),

  // Media factories
  createMediaItem: (
    mediaId = "12345",
    itemId = "507f1f77bcf86cd799439013",
  ) => ({
    _id: new ObjectId(itemId),
    media_id: mediaId,
    title: "Test Movie",
    release_date: new Date("2023-01-01"),
    poster_path: "/test.jpg",
    media_type: "movie",
  }),

  createMediaIds: () => [
    {
      item_id: "507f1f77bcf86cd799439013",
      isWatched: false,
      show_children: false,
    },
  ],

  // TMDB API response factories
  createTMDBSearchResponse: () => ({
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
        name: "Test TV Show",
        first_air_date: "2023-02-01",
        poster_path: "/test-tv.jpg",
        media_type: "tv",
      },
      {
        id: 11111,
        title: "Invalid Movie",
        poster_path: "/invalid.jpg",
        media_type: "movie",
        // No release_date or first_air_date - should be filtered out
      },
    ],
  }),

  createTMDBSeasonsResponse: () => ({
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

  createTMDBEpisodesResponse: () => ({
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
};

// Mock factories
export const MockFactories = {
  // Request object factory for auth tests
  createMockReq: (user = null, logInError = null, logoutError = null) => ({
    user,
    logIn: (user, callback) => callback(logInError),
    logout: (callback) => callback(logoutError),
  }),

  // Context object factory for auth tests
  createMockContext: (
    authenticateResult = { user: null },
    loginError = null,
  ) => ({
    buildContext: {
      authenticate: () => Promise.resolve(authenticateResult),
      login: loginError
        ? () => Promise.reject(loginError)
        : () => Promise.resolve(),
    },
  }),

  // Fetch mock factory for API tests
  createSuccessFetch: (responseData) => () =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(responseData),
    }),

  createFailureFetch:
    (statusText = "Not Found") =>
    () =>
      Promise.resolve({
        ok: false,
        statusText,
      }),

  createNetworkErrorFetch:
    (errorMessage = "Network error") =>
    () =>
      Promise.reject(new Error(errorMessage)),
};

// Mongoose model mocking utilities
export const ModelMocking = {
  // Create mongoose model mocks with default implementations
  createListModel: () => ({
    find: () => Promise.resolve([]),
    findOne: () => Promise.resolve(null),
    create: () => Promise.resolve({}),
    deleteOne: () => Promise.resolve({}),
    findOneAndUpdate: () => Promise.resolve({}),
  }),

  createMediaModel: () => ({
    find: () => Promise.resolve([]),
    findOne: () => Promise.resolve(null),
    findOneAndUpdate: () => Promise.resolve({}),
  }),

  createUserModel: () => ({
    findOne: () => Promise.resolve(null),
    create: () => Promise.resolve({}),
  }),

  // Setup mongoose model mocking
  setupModelMocking: (originalModel) => {
    const mocks = {
      list: ModelMocking.createListModel(),
      media: ModelMocking.createMediaModel(),
      user: ModelMocking.createUserModel(),
    };

    mongoose.model = (modelName) => {
      if (mocks[modelName]) return mocks[modelName];
      return originalModel(modelName);
    };

    return mocks;
  },

  // Restore original mongoose.model
  restoreModelMocking: (originalModel) => {
    mongoose.model = originalModel;
  },
};

// Test setup utilities
export const TestSetup = {
  // Setup environment and mocks
  setupTestEnvironment: () => {
    // Mock environment variables
    process.env.API_KEY = "test_api_key";

    // Mock global fetch
    global.fetch = () => Promise.resolve();

    // Mock console.error
    const originalLogError = console.error;
    console.error = () => {};

    return { originalLogError };
  },

  // Restore environment
  restoreTestEnvironment: ({ originalLogError }) => {
    console.error = originalLogError;
  },

  // Store and restore original methods for a model
  createMethodRestorer: (model, methods) => {
    const originalMethods = {};
    methods.forEach((method) => {
      originalMethods[method] = model[method];
    });

    return {
      restore: () => {
        Object.keys(originalMethods).forEach((method) => {
          if (originalMethods[method]) {
            model[method] = originalMethods[method];
          }
        });
      },
    };
  },
};

// Common test patterns
export const TestPatterns = {
  // Test that a function exists and is callable
  testFunctionExists: (service, functionName) => {
    expect(typeof service[functionName]).toBe("function");
  },

  // Test database error handling
  testDatabaseError: async (serviceFunction, ...args) => {
    const result = await serviceFunction(...args);
    expect(result).toBeNull();
  },

  // Test authorization error
  testAuthorizationError: async (serviceFunction, ...args) => {
    await expect(serviceFunction(...args)).rejects.toThrow("Unauthorized");
  },

  // Test that result is defined (success case)
  testSuccess: (result) => {
    expect(result).toBeDefined();
  },
};
