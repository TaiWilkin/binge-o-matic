import mongoose from "mongoose";

import {
  ModelMocking,
  TestData,
  TestPatterns,
  TestSetup,
} from "../testUtils.js";

// Setup test environment and mocking
const { originalLogError } = TestSetup.setupTestEnvironment();
const originalModel = mongoose.model;
const modelMocks = ModelMocking.setupModelMocking(originalModel);

// Import service after mocking
const listService = await import("../../services/list.js").then(
  (m) => m.default,
);

describe("List Service", () => {
  // Test data
  const mockUser = TestData.createUser();
  const mockListData = TestData.createList();
  const mockLists = [
    TestData.createList("List A"),
    TestData.createList("List B"),
  ];

  beforeEach(() => {
    // Reset model mocks with test data
    modelMocks.list.find = () => ({
      sort: () => ({
        catch: () => Promise.resolve(mockLists),
      }),
    });
    modelMocks.list.findOne = () => Promise.resolve(mockListData);
    modelMocks.list.create = () => Promise.resolve(mockListData);
    modelMocks.list.findOneAndUpdate = () => Promise.resolve(mockListData);
    modelMocks.list.deleteOne = () => Promise.resolve({ deletedCount: 1 });
  });

  afterAll(() => {
    // Cleanup
    ModelMocking.restoreModelMocking(originalModel);
    TestSetup.restoreTestEnvironment({ originalLogError });
  });

  describe("fetchAllLists", () => {
    it("should fetch all lists sorted by name desc", async () => {
      const result = await listService.fetchAllLists();
      expect(result).toEqual(mockLists);
    });

    it("should return null on error", async () => {
      modelMocks.list.find = () => ({
        sort: () => ({
          catch: (callback) => callback(new Error("Database error")),
        }),
      });

      const result = await listService.fetchAllLists();
      expect(result).toBeNull();
    });
  });

  describe("fetchUserLists", () => {
    it("should fetch lists for specific user sorted by name desc", async () => {
      const result = await listService.fetchUserLists(mockUser);
      expect(result).toEqual(mockLists);
    });

    it("should return null on error", async () => {
      modelMocks.list.find = () => ({
        sort: () => ({
          catch: (callback) => callback(new Error("Database error")),
        }),
      });

      const result = await listService.fetchUserLists(mockUser);
      expect(result).toBeNull();
    });
  });

  describe("createList", () => {
    it("should create a new list when name is unique", async () => {
      const listName = "New List";

      // Mock no existing lists
      modelMocks.list.find = () => Promise.resolve([]);

      const result = await listService.createList(listName, mockUser);
      expect(result).toEqual(mockListData);
    });

    it("should throw error when list name already exists", async () => {
      const listName = "Existing List";
      const existingList = TestData.createList(listName);

      // Mock existing list found
      modelMocks.list.find = () => Promise.resolve([existingList]);

      await expect(listService.createList(listName, mockUser)).rejects.toThrow(
        "A list with this name already exists.",
      );
    });
  });

  describe("fetchList", () => {
    it("should fetch list by id", async () => {
      const listId = TestData.createObjectId();

      const result = await listService.fetchList(listId);
      expect(result).toEqual(mockListData);
    });

    it("should return null on error", async () => {
      modelMocks.list.findOne = () => ({
        catch: (callback) => callback(new Error("Database error")),
      });

      const result = await listService.fetchList(TestData.createObjectId());
      expect(result).toBeNull();
    });
  });

  describe("deleteList", () => {
    it("should return null when authorized", async () => {
      const listId = TestData.createObjectId();
      const mockList = {
        ...TestData.createList(),
        user: mockUser._id,
      };

      modelMocks.list.findOne = () => Promise.resolve(mockList);

      const result = await listService.deleteList({ id: listId }, mockUser);
      expect(result).toBeNull();
    });

    it("should return null on authorization error", async () => {
      const listId = TestData.createObjectId();
      const unauthorizedUser = TestData.createUnauthorizedUser();
      const mockList = {
        ...TestData.createList(),
        user: mockUser._id, // Different user
      };

      modelMocks.list.findOne = () => Promise.resolve(mockList);

      const result = await listService.deleteList(
        { id: listId },
        unauthorizedUser,
      );
      expect(result).toBeNull(); // Service catches error and returns null
    });
  });

  describe("editList", () => {
    it("should handle edit operation", async () => {
      const listId = TestData.createObjectId();
      const updates = { id: listId, name: "Updated List" };
      const mockList = {
        ...TestData.createList(),
        user: mockUser._id,
      };

      modelMocks.list.findOne = () => Promise.resolve(mockList);

      const result = await listService.editList(updates, mockUser);
      expect(result).toEqual(mockListData);
    });

    it("should return null on authorization error", async () => {
      const listId = TestData.createObjectId();
      const updates = { id: listId, name: "Updated List" };
      const unauthorizedUser = TestData.createUnauthorizedUser();
      const mockList = {
        ...TestData.createList(),
        user: mockUser._id, // Different user
      };

      modelMocks.list.findOne = () => Promise.resolve(mockList);

      const result = await listService.editList(updates, unauthorizedUser);
      expect(result).toBeNull(); // Service catches error and returns null
    });
  });

  describe("Service Functions", () => {
    it("should export all required functions", () => {
      const expectedFunctions = [
        "fetchAllLists",
        "fetchUserLists",
        "createList",
        "fetchList",
        "deleteList",
        "editList",
      ];

      expectedFunctions.forEach((functionName) => {
        TestPatterns.testFunctionExists(listService, functionName);
      });
    });
  });

  describe("Error Handling", () => {
    it("should handle invalid ObjectId gracefully", async () => {
      const invalidId = "invalid-id";

      // The ObjectId constructor throws a synchronous error for invalid IDs
      try {
        await listService.fetchList(invalidId);
        // Should not reach here
        expect(true).toBe(false);
      } catch (error) {
        expect(error.name).toBe("BSONError");
        expect(error.message).toContain(
          "input must be a 24 character hex string",
        );
      }
    });

    it("should handle user authorization checks", async () => {
      const unauthorizedUser = TestData.createUnauthorizedUser();
      const listId = TestData.createObjectId();

      // The service will catch the authorization error and return null
      const result = await listService.deleteList(
        { id: listId },
        unauthorizedUser,
      );
      expect(result).toBeNull();
    });
  });
});
