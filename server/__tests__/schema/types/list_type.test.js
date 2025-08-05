import graphql from "graphql";
import mongoose from "mongoose";

import {
  createList,
  createMediaItem,
  createSuccessFetch,
  createTMDBSearchResponse,
  MockManager,
  restoreMockFactories,
  setupMockFactories,
  TestSetup,
} from "../../testUtils.js";

const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql;

// Setup test environment and mocking
const { originalLogError } = TestSetup.setupTestEnvironment();
const originalModel = mongoose.model;
const modelMocks = setupMockFactories(originalModel);

// Create mock manager for easy test customization
const mockManager = new MockManager(modelMocks);

// Import ListType after mocking
const ListType = await import("../../../schema/types/list_type.js").then(
  (m) => m.default,
);

describe("ListType", () => {
  // Test data
  const mockListData = createList();
  const mockMediaItem = createMediaItem();

  beforeEach(() => {
    // Reset to default mocks before each test
    mockManager.resetAll();

    // Set up default mocks that work for most tests
    mockManager.setupTest({
      list: {
        find: () => Promise.resolve([mockListData]),
        findOne: () => Promise.resolve(mockListData),
      },
      media: {
        find: () => Promise.resolve([mockMediaItem]),
        findOne: () => Promise.resolve(mockMediaItem),
      },
    });
  });

  afterAll(() => {
    // Cleanup
    mockManager.resetAll();
    restoreMockFactories(originalModel);
    TestSetup.restoreTestEnvironment({ originalLogError });
  });

  describe("Type Definition", () => {
    it("should be a GraphQLObjectType", () => {
      expect(ListType).toBeInstanceOf(GraphQLObjectType);
    });

    it("should have the correct name", () => {
      expect(ListType.name).toBe("ListType");
    });

    it("should have the correct fields", () => {
      const fields = ListType.getFields();

      expect(fields.id).toBeDefined();
      expect(fields.name).toBeDefined();
      expect(fields.user).toBeDefined();
      expect(fields.media).toBeDefined();
    });
  });

  describe("Field Types", () => {
    let fields;

    beforeEach(() => {
      fields = ListType.getFields();
    });

    it("should have id field of type GraphQLID", () => {
      expect(fields.id.type).toBe(GraphQLID);
    });

    it("should have name field of type GraphQLString", () => {
      expect(fields.name.type).toBe(GraphQLString);
    });

    it("should have user field of type GraphQLID", () => {
      expect(fields.user.type).toBe(GraphQLID);
    });

    it("should have media field of type GraphQLList", () => {
      expect(fields.media.type).toBeInstanceOf(GraphQLList);
      // Note: We can't easily test the MediaType reference without importing it
      // which would cause circular dependency issues in tests
    });
  });

  describe("Field Resolvers", () => {
    let fields;

    beforeEach(() => {
      fields = ListType.getFields();
    });

    it("should not have a resolver for id field", () => {
      expect(fields.id.resolve).toBeUndefined();
    });

    it("should not have a resolver for name field", () => {
      expect(fields.name.resolve).toBeUndefined();
    });

    it("should not have a resolver for user field", () => {
      expect(fields.user.resolve).toBeUndefined();
    });

    it("should have a resolver for media field", () => {
      expect(fields.media.resolve).toBeDefined();
      expect(typeof fields.media.resolve).toBe("function");
    });
  });

  describe("Media Field Resolver", () => {
    let fields;
    let mediaServiceSpy;

    beforeEach(async () => {
      fields = ListType.getFields();

      // Set up fetch mock for any external API calls
      global.fetch = createSuccessFetch(createTMDBSearchResponse());

      // Import and spy on MediaService
      const MediaServiceModule = await import("../../../services/media.js");
      mediaServiceSpy = jest.spyOn(MediaServiceModule.default, "getMediaList");
    });

    afterEach(() => {
      if (mediaServiceSpy) {
        mediaServiceSpy.mockRestore();
      }
    });

    it("should call MediaService.getMediaList with parentValue.media", async () => {
      const mockMediaArray = [
        { item_id: "507f1f77bcf86cd799439013", isWatched: false },
        { item_id: "507f1f77bcf86cd799439014", isWatched: true },
      ];

      const mockTransformedMedia = [
        {
          id: "507f1f77bcf86cd799439013",
          title: "Movie 1",
          media_type: "movie",
          isWatched: false,
        },
        {
          id: "507f1f77bcf86cd799439014",
          title: "Movie 2",
          media_type: "tv",
          isWatched: true,
        },
      ];

      const parentValue = {
        id: "507f1f77bcf86cd799439012",
        name: "My List",
        media: mockMediaArray,
      };

      mediaServiceSpy.mockResolvedValue(mockTransformedMedia);

      const result = await fields.media.resolve(parentValue);

      expect(mediaServiceSpy).toHaveBeenCalledWith(mockMediaArray);
      expect(result).toEqual(mockTransformedMedia);
    });

    it("should handle empty media array", async () => {
      const parentValue = {
        id: "507f1f77bcf86cd799439012",
        name: "Empty List",
        media: [],
      };

      mediaServiceSpy.mockResolvedValue([]);

      const result = await fields.media.resolve(parentValue);

      expect(mediaServiceSpy).toHaveBeenCalledWith([]);
      expect(result).toEqual([]);
    });

    it("should handle undefined media array", async () => {
      const parentValue = {
        id: "507f1f77bcf86cd799439012",
        name: "List without media",
        media: undefined,
      };

      mediaServiceSpy.mockResolvedValue([]);

      const result = await fields.media.resolve(parentValue);

      expect(mediaServiceSpy).toHaveBeenCalledWith(undefined);
      expect(result).toEqual([]);
    });

    it("should propagate errors from MediaService.getMediaList", async () => {
      const mockMediaArray = [
        { item_id: "507f1f77bcf86cd799439013", isWatched: false },
      ];
      const parentValue = {
        id: "507f1f77bcf86cd799439012",
        name: "My List",
        media: mockMediaArray,
      };

      const mockError = new Error("Database error");
      mediaServiceSpy.mockRejectedValue(mockError);

      await expect(fields.media.resolve(parentValue)).rejects.toThrow(
        "Database error",
      );
    });

    it("should pass through the exact media array from parentValue", async () => {
      const specificMediaArray = [
        {
          item_id: "507f1f77bcf86cd799439015",
          isWatched: true,
          customProperty: "test",
        },
      ];

      const parentValue = {
        id: "507f1f77bcf86cd799439012",
        name: "My List",
        media: specificMediaArray,
      };

      const mockResult = [
        {
          id: "507f1f77bcf86cd799439015",
          title: "Specific Movie",
          isWatched: true,
        },
      ];

      mediaServiceSpy.mockResolvedValue(mockResult);

      const result = await fields.media.resolve(parentValue);

      expect(mediaServiceSpy).toHaveBeenCalledWith(specificMediaArray);
      expect(result).toEqual(mockResult);
    });
  });

  describe("Integration", () => {
    it("should export ListType as default", () => {
      expect(ListType).toBeDefined();
      expect(ListType.name).toBe("ListType");
    });

    it("should have proper field configuration for GraphQL schema", () => {
      const fields = ListType.getFields();

      // Verify all required fields exist
      expect(Object.keys(fields)).toContain("id");
      expect(Object.keys(fields)).toContain("name");
      expect(Object.keys(fields)).toContain("user");
      expect(Object.keys(fields)).toContain("media");

      // Verify field count
      expect(Object.keys(fields)).toHaveLength(4);
    });
  });
});
