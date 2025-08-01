import graphql from "graphql";
import mongoose from "mongoose";

import {
  createFailureFetch,
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

// Import RootQueryType after mocking
const RootQueryType = await import(
  "../../../schema/types/root_query_type.js"
).then((m) => m.default);

describe("RootQueryType", () => {
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
      expect(RootQueryType).toBeInstanceOf(GraphQLObjectType);
    });

    it("should have the correct name", () => {
      expect(RootQueryType.name).toBe("RootQueryType");
    });

    it("should have all required fields", () => {
      const fields = RootQueryType.getFields();

      expect(fields.user).toBeDefined();
      expect(fields.lists).toBeDefined();
      expect(fields.list).toBeDefined();
      expect(fields.media).toBeDefined();
    });
  });

  describe("Field Types", () => {
    let fields;

    beforeEach(() => {
      fields = RootQueryType.getFields();
    });

    it("should have correct field types", () => {
      // Note: We can't easily test the specific type references without importing them
      // which would cause circular dependency issues in tests
      expect(fields.user.type).toBeDefined();
      expect(fields.lists.type).toBeInstanceOf(GraphQLList);
      expect(fields.list.type).toBeDefined();
      expect(fields.media.type).toBeInstanceOf(GraphQLList);
    });
  });

  describe("Field Arguments", () => {
    let fields;

    beforeEach(() => {
      fields = RootQueryType.getFields();
    });

    it("should have no arguments for user field", () => {
      expect(Array.isArray(fields.user.args)).toBe(true);
      expect(fields.user.args.length).toBe(0);
    });

    it("should have no arguments for lists field", () => {
      expect(Array.isArray(fields.lists.args)).toBe(true);
      expect(fields.lists.args.length).toBe(0);
    });

    it("should have id argument for list field", () => {
      expect(Array.isArray(fields.list.args)).toBe(true);
      expect(fields.list.args.length).toBe(1);
      expect(fields.list.args[0].name).toBe("id");
      expect(fields.list.args[0].type).toBe(GraphQLID);
    });

    it("should have searchQuery argument for media field", () => {
      expect(Array.isArray(fields.media.args)).toBe(true);
      expect(fields.media.args.length).toBe(1);
      expect(fields.media.args[0].name).toBe("searchQuery");
      expect(fields.media.args[0].type).toBe(GraphQLString);
    });
  });

  describe("Field Resolvers", () => {
    let fields;
    let listServiceSpy;
    let fetchListSpy;

    beforeEach(async () => {
      fields = RootQueryType.getFields();

      // Import and spy on ListService
      const ListServiceModule = await import("../../../services/list.js");
      listServiceSpy = jest.spyOn(ListServiceModule.default, "fetchAllLists");
      fetchListSpy = jest.spyOn(ListServiceModule.default, "fetchList");
    });

    afterEach(() => {
      if (listServiceSpy) {
        listServiceSpy.mockRestore();
      }
      if (fetchListSpy) {
        fetchListSpy.mockRestore();
      }
    });

    it("should have resolvers for all fields", () => {
      expect(fields.user.resolve).toBeDefined();
      expect(fields.lists.resolve).toBeDefined();
      expect(fields.list.resolve).toBeDefined();
      expect(fields.media.resolve).toBeDefined();

      expect(typeof fields.user.resolve).toBe("function");
      expect(typeof fields.lists.resolve).toBe("function");
      expect(typeof fields.list.resolve).toBe("function");
      expect(typeof fields.media.resolve).toBe("function");
    });

    describe("user resolver", () => {
      it("should return context.user", () => {
        const mockUser = { id: "user123", email: "test@example.com" };
        const mockContext = { user: mockUser };

        const result = fields.user.resolve(null, null, mockContext);

        expect(result).toBe(mockUser);
      });

      it("should handle undefined context.user", () => {
        const mockContext = { user: undefined };

        const result = fields.user.resolve(null, null, mockContext);

        expect(result).toBeUndefined();
      });
    });

    describe("lists resolver", () => {
      beforeEach(() => {
        // Set up specific mocks for lists resolver tests
        global.fetch = createSuccessFetch(createTMDBSearchResponse());
      });

      it("should call ListService.fetchAllLists with no arguments", async () => {
        const mockLists = [
          {
            id: "507f1f77bcf86cd799439012",
            name: "Movies",
            user: "507f1f77bcf86cd799439011",
          },
          {
            id: "507f1f77bcf86cd799439013",
            name: "TV Shows",
            user: "507f1f77bcf86cd799439014",
          },
        ];

        listServiceSpy.mockResolvedValue(mockLists);

        const result = await fields.lists.resolve();

        expect(listServiceSpy).toHaveBeenCalledWith();
        expect(listServiceSpy).toHaveBeenCalledTimes(1);
        expect(result).toEqual(mockLists);
      });

      it("should handle empty lists response", async () => {
        listServiceSpy.mockResolvedValue([]);

        const result = await fields.lists.resolve();

        expect(result).toEqual([]);
      });

      it("should propagate errors from ListService.fetchAllLists", async () => {
        listServiceSpy.mockRejectedValue(
          new Error("Database connection failed"),
        );

        await expect(fields.lists.resolve()).rejects.toThrow(
          "Database connection failed",
        );
      });

      it("should ignore parentValue, args, and context parameters", async () => {
        const parentValue = { someProperty: "should be ignored" };
        const args = { filter: "some filter" };
        const context = { user: { id: "507f1f77bcf86cd799439011" } };

        listServiceSpy.mockResolvedValue([]);

        const result = await fields.lists.resolve(parentValue, args, context);
        expect(listServiceSpy).toHaveBeenCalledWith();
        expect(result).toEqual([]);
      });
    });

    describe("list resolver", () => {
      it("should call ListService.fetchList with args.id", async () => {
        const mockList = {
          id: "507f1f77bcf86cd799439012",
          name: "My List",
          user: "507f1f77bcf86cd799439011",
        };
        const args = { id: "507f1f77bcf86cd799439012" };

        fetchListSpy.mockResolvedValue(mockList);

        const result = await fields.list.resolve(null, args);

        expect(fetchListSpy).toHaveBeenCalledWith("507f1f77bcf86cd799439012");
        expect(result).toEqual(mockList);
      });

      it("should handle undefined args.id", async () => {
        const args = { id: undefined };

        fetchListSpy.mockResolvedValue(null);

        const result = await fields.list.resolve(null, args);

        expect(fetchListSpy).toHaveBeenCalledWith(undefined);
        expect(result).toBeNull();
      });

      it("should handle null args.id", async () => {
        const args = { id: null };

        fetchListSpy.mockResolvedValue(null);

        const result = await fields.list.resolve(null, args);

        expect(fetchListSpy).toHaveBeenCalledWith(null);
        expect(result).toBeNull();
      });

      it("should propagate errors from ListService.fetchList", async () => {
        const args = { id: "507f1f77bcf86cd799439012" };
        const mockError = new Error("List not found");

        fetchListSpy.mockRejectedValue(mockError);

        await expect(fields.list.resolve(null, args)).rejects.toThrow(
          "List not found",
        );
      });

      it("should ignore parentValue and context parameters", async () => {
        const parentValue = { someProperty: "should be ignored" };
        const args = { id: "507f1f77bcf86cd799439012" };
        const context = { user: { id: "507f1f77bcf86cd799439011" } };

        fetchListSpy.mockResolvedValue(null);

        const result = await fields.list.resolve(parentValue, args, context);
        expect(fetchListSpy).toHaveBeenCalledWith("507f1f77bcf86cd799439012");
        expect(result).toBeNull();
      });

      it("should handle args with extra properties", async () => {
        const args = {
          id: "507f1f77bcf86cd799439012",
          extraProperty: "should be ignored",
          anotherProp: 42,
        };

        const mockList = { id: "507f1f77bcf86cd799439012", name: "Test List" };

        fetchListSpy.mockResolvedValue(mockList);

        const result = await fields.list.resolve(null, args);
        expect(fetchListSpy).toHaveBeenCalledWith("507f1f77bcf86cd799439012");
        expect(result).toEqual(mockList);
      });
    });

    describe("media resolver", () => {
      beforeEach(() => {
        // Set up global fetch mock for media search
        global.fetch = createSuccessFetch(createTMDBSearchResponse());
      });

      it("should call MediaService.searchMedia with destructured searchQuery", async () => {
        const args = { searchQuery: "matrix" };

        const result = await fields.media.resolve(null, args);

        expect(result).toHaveLength(2); // Should return transformed TMDB response
        expect(result[0]).toHaveProperty("title");
        expect(result[0]).toHaveProperty("media_type");
      });

      it("should handle undefined searchQuery", async () => {
        const args = { searchQuery: undefined };

        const result = await fields.media.resolve(null, args);

        expect(result).toHaveLength(2); // Default TMDB response
      });

      it("should handle null searchQuery", async () => {
        const args = { searchQuery: null };

        const result = await fields.media.resolve(null, args);

        expect(result).toHaveLength(2); // Default TMDB response
      });

      it("should handle empty string searchQuery", async () => {
        const args = { searchQuery: "" };

        const result = await fields.media.resolve(null, args);

        expect(result).toHaveLength(2); // Default TMDB response
      });

      it("should propagate errors from MediaService.searchMedia", async () => {
        const args = { searchQuery: "test" };

        global.fetch = createFailureFetch("API request failed");

        await expect(fields.media.resolve(null, args)).rejects.toThrow(
          "API request failed",
        );
      });

      it("should ignore parentValue and context parameters", async () => {
        const parentValue = { someProperty: "should be ignored" };
        const args = { searchQuery: "avengers" };
        const context = { user: { id: "user123" } };

        const result = await fields.media.resolve(parentValue, args, context);

        expect(result).toHaveLength(2); // Should return results regardless of other params
      });

      it("should handle args with extra properties using destructuring", async () => {
        const args = {
          searchQuery: "batman",
          extraProperty: "should be ignored",
          anotherProp: 42,
        };

        const result = await fields.media.resolve(null, args);

        expect(result).toHaveLength(2); // Should extract searchQuery and ignore other props
      });

      it("should handle complex searchQuery strings", async () => {
        const complexQuery = "The Dark Knight Rises 2012";
        const args = { searchQuery: complexQuery };

        const result = await fields.media.resolve(null, args);

        expect(result).toHaveLength(2); // Should handle complex queries
      });
    });
  });

  describe("Integration", () => {
    it("should export RootQueryType as default", () => {
      expect(RootQueryType).toBeDefined();
      expect(RootQueryType.name).toBe("RootQueryType");
    });

    it("should have proper field configuration for GraphQL schema", () => {
      const fields = RootQueryType.getFields();

      // Verify all required fields exist
      expect(Object.keys(fields)).toContain("user");
      expect(Object.keys(fields)).toContain("lists");
      expect(Object.keys(fields)).toContain("list");
      expect(Object.keys(fields)).toContain("media");

      // Verify field count
      expect(Object.keys(fields)).toHaveLength(4);
    });
  });
});
