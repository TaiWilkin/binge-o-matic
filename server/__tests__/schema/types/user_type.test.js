import mongoose from "mongoose";

import {
  createList,
  createUser,
  MockManager,
  restoreMockFactories,
  setupMockFactories,
  TestSetup,
} from "../../testUtils.js";

import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
} from "graphql";

// Setup test environment and mocking
const { originalLogError } = TestSetup.setupTestEnvironment();
const originalModel = mongoose.model;
const modelMocks = setupMockFactories(originalModel);

// Create mock manager for easy test customization
const mockManager = new MockManager(modelMocks);

// Import UserType after mocking
let UserType;
beforeAll(async () => {
  UserType = await import("../../../schema/types/user_type.js").then(
    (m) => m.default,
  );
});

describe("UserType", () => {
  // Test data
  const mockUser = createUser();
  const mockListData = createList();

  beforeEach(() => {
    // Reset to default mocks before each test
    mockManager.resetAll();

    // Set up default mocks that work for most tests
    mockManager.setupTest({
      list: {
        find: () => Promise.resolve([mockListData]),
        findOne: () => Promise.resolve(mockListData),
      },
      user: {
        findOne: () => Promise.resolve(mockUser),
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
      expect(UserType).toBeInstanceOf(GraphQLObjectType);
    });

    it("should have the correct name", () => {
      expect(UserType.name).toBe("UserType");
    });

    it("should have the correct fields", () => {
      const fields = UserType.getFields();

      expect(fields.id).toBeDefined();
      expect(fields.email).toBeDefined();
      expect(fields.lists).toBeDefined();
    });
  });

  describe("Field Types", () => {
    let fields;

    beforeEach(() => {
      fields = UserType.getFields();
    });

    it("should have id field of type GraphQLID", () => {
      expect(fields.id.type).toBe(GraphQLID);
    });

    it("should have email field of type GraphQLString", () => {
      expect(fields.email.type).toBe(GraphQLString);
    });

    it("should have lists field of type GraphQLList", () => {
      expect(fields.lists.type).toBeInstanceOf(GraphQLList);
      // Note: We can't easily test the ListType reference without importing it
      // which would cause circular dependency issues in tests
    });
  });

  describe("Field Resolvers", () => {
    let fields;

    beforeEach(() => {
      fields = UserType.getFields();
    });

    it("should not have a resolver for id field", () => {
      expect(fields.id.resolve).toBeUndefined();
    });

    it("should not have a resolver for email field", () => {
      expect(fields.email.resolve).toBeUndefined();
    });

    it("should have a resolver for lists field", () => {
      expect(fields.lists.resolve).toBeDefined();
      expect(typeof fields.lists.resolve).toBe("function");
    });
  });

  describe("Lists Field Resolver", () => {
    let fields;
    let listServiceSpy;

    beforeEach(async () => {
      fields = UserType.getFields();

      // Import and spy on ListService
      const ListServiceModule = await import("../../../services/list.js");
      listServiceSpy = jest.spyOn(ListServiceModule.default, "fetchUserLists");
    });

    afterEach(() => {
      if (listServiceSpy) {
        listServiceSpy.mockRestore();
      }
    });

    it("should call ListService.fetchUserLists with req.user", async () => {
      const mockUser = {
        id: "user123",
        email: "test@example.com",
      };

      const mockLists = [
        { id: "list1", name: "Movies", user: "user123" },
        { id: "list2", name: "TV Shows", user: "user123" },
      ];

      const mockRequest = {
        user: mockUser,
      };

      listServiceSpy.mockResolvedValue(mockLists);

      const result = await fields.lists.resolve({}, {}, mockRequest);

      expect(listServiceSpy).toHaveBeenCalledWith(mockUser);
      expect(listServiceSpy).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockLists);
    });

    it("should handle undefined req.user", async () => {
      const mockRequest = {
        user: undefined,
      };

      listServiceSpy.mockResolvedValue([]);

      const result = await fields.lists.resolve({}, {}, mockRequest);

      expect(listServiceSpy).toHaveBeenCalledWith(undefined);
      expect(result).toEqual([]);
    });

    it("should handle null req.user", async () => {
      const mockRequest = {
        user: null,
      };

      listServiceSpy.mockResolvedValue([]);

      const result = await fields.lists.resolve({}, {}, mockRequest);

      expect(listServiceSpy).toHaveBeenCalledWith(null);
      expect(result).toEqual([]);
    });

    it("should propagate errors from ListService.fetchUserLists", async () => {
      const mockUser = {
        id: "user123",
        email: "test@example.com",
      };

      const mockRequest = {
        user: mockUser,
      };

      const mockError = new Error("List service error");
      listServiceSpy.mockRejectedValue(mockError);

      await expect(fields.lists.resolve({}, {}, mockRequest)).rejects.toThrow(
        "List service error",
      );
      expect(listServiceSpy).toHaveBeenCalledWith(mockUser);
    });

    it("should pass through the exact user object from req.user", async () => {
      const complexUser = {
        id: "user456",
        email: "complex@example.com",
        customProperty: "test",
        nestedObject: {
          preferences: ["action", "comedy"],
          settings: { theme: "dark" },
        },
      };

      const mockRequest = {
        user: complexUser,
        session: { id: "session123" },
        headers: { authorization: "Bearer token" },
      };

      listServiceSpy.mockResolvedValue([]);

      await fields.lists.resolve({}, {}, mockRequest);

      // Verify that the exact same user object reference is passed
      expect(listServiceSpy).toHaveBeenCalledWith(complexUser);
      expect(listServiceSpy.mock.calls[0][0]).toBe(complexUser);
    });

    it("should ignore parentValue and args parameters", async () => {
      const mockUser = {
        id: "user789",
        email: "ignore@example.com",
      };

      const parentValue = {
        someProperty: "should be ignored",
        id: "parent123",
      };

      const args = {
        filter: "some filter",
        sort: "name",
      };

      const mockRequest = {
        user: mockUser,
      };

      listServiceSpy.mockResolvedValue([]);

      await fields.lists.resolve(parentValue, args, mockRequest);

      // Should only be called with req.user, ignoring parentValue and args
      expect(listServiceSpy).toHaveBeenCalledWith(mockUser);
      expect(listServiceSpy).toHaveBeenCalledTimes(1);
    });

    it("should handle missing req object", () => {
      // Test edge case where req might be undefined/null
      // This would cause an error as expected since req.user would throw
      expect(() => fields.lists.resolve({}, {}, undefined)).toThrow(TypeError);
    });

    it("should handle req object without user property", async () => {
      const mockRequest = {}; // req object exists but no user property

      listServiceSpy.mockResolvedValue([]);

      const result = await fields.lists.resolve({}, {}, mockRequest);

      expect(listServiceSpy).toHaveBeenCalledWith(undefined);
      expect(result).toEqual([]);
    });
  });

  describe("Integration", () => {
    it("should export UserType as default", () => {
      expect(UserType).toBeDefined();
      expect(UserType.name).toBe("UserType");
    });

    it("should have proper field configuration for GraphQL schema", () => {
      const fields = UserType.getFields();

      // Verify all required fields exist
      expect(Object.keys(fields)).toContain("id");
      expect(Object.keys(fields)).toContain("email");
      expect(Object.keys(fields)).toContain("lists");

      // Verify field count
      expect(Object.keys(fields)).toHaveLength(3);
    });
  });
});
