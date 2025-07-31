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
        expect(error.message).toContain("hex string must be 24 characters");
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

  describe("Helper Functions", () => {
    describe("getAuthorizedList", () => {
      it("should return list when user is authorized", async () => {
        const mockList = { ...mockListData, user: mockUser._id };
        modelMocks.list.findOne = () => Promise.resolve(mockList);

        const result = await listService.getAuthorizedList(
          mockList._id,
          mockUser._id,
        );
        expect(result).toEqual(mockList);
      });

      it("should throw error when user is not authorized", async () => {
        const unauthorizedUserId = TestData.createObjectId(
          "507f1f77bcf86cd799439099",
        );
        const mockList = { ...mockListData, user: mockUser._id };
        modelMocks.list.findOne = () => Promise.resolve(mockList);

        await expect(
          listService.getAuthorizedList(mockList._id, unauthorizedUserId),
        ).rejects.toThrow("Unauthorized");
      });

      it("should return null when list is not found", async () => {
        modelMocks.list.findOne = () => Promise.resolve(null);

        const result = await listService.getAuthorizedList(
          TestData.createObjectId(),
          mockUser._id,
        );
        expect(result).toBeNull();
      });
    });

    describe("updateMediaProperty", () => {
      const mockMediaId = TestData.createObjectId();

      it("should update media property successfully", async () => {
        const mockList = {
          ...mockListData,
          media: [{ item_id: mockMediaId, isWatched: false }],
        };
        modelMocks.list.findOne = () => Promise.resolve(mockList);
        modelMocks.list.findOneAndUpdate = jest.fn(() =>
          Promise.resolve(mockList),
        );

        const result = await listService.updateMediaProperty(
          mockList._id,
          mockMediaId,
          { isWatched: true },
        );

        expect(result).toEqual(mockList);
        expect(modelMocks.list.findOneAndUpdate).toHaveBeenCalled();
      });

      it("should return null when list is not found", async () => {
        modelMocks.list.findOne = () => Promise.resolve(null);

        const result = await listService.updateMediaProperty(
          TestData.createObjectId(),
          mockMediaId,
          { isWatched: true },
        );
        expect(result).toBeNull();
      });

      it("should return null when media item is not found in list", async () => {
        const mockList = { ...mockListData, media: [] };
        modelMocks.list.findOne = () => Promise.resolve(mockList);

        const result = await listService.updateMediaProperty(
          mockList._id,
          TestData.createObjectId(),
          { isWatched: true },
        );
        expect(result).toBeNull();
      });

      it("should handle errors gracefully", async () => {
        modelMocks.list.findOne = () => Promise.reject(new Error("DB error"));

        const result = await listService.updateMediaProperty(
          mockListData._id,
          mockMediaId,
          { isWatched: true },
        );
        expect(result).toBeNull();
      });
    });
  });
});
