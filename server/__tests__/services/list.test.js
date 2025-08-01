import mongoose from "mongoose";

import {
  createList,
  createObjectId,
  createUnauthorizedUser,
  createUser,
  MockManager,
  restoreMockFactories,
  setupMockFactories,
  testFunctionExists,
  TestSetup,
} from "../testUtils.js";

// Setup test environment and mocking
const { originalLogError } = TestSetup.setupTestEnvironment();
const originalModel = mongoose.model;
const modelMocks = setupMockFactories(originalModel);

// Create mock manager for easy test customization
const mockManager = new MockManager(modelMocks);

// Import service after mocking
const listService = await import("../../services/list.js").then(
  (m) => m.default,
);

describe("List Service", () => {
  // Test data
  const mockUser = createUser();
  const mockListData = createList();
  const mockLists = [createList("List A"), createList("List B")];

  beforeEach(() => {
    // Reset to default mocks before each test
    mockManager.resetAll();

    // Set up default mocks that work for most tests
    mockManager.setupTest({
      list: {
        find: () => ({
          sort: () => Promise.resolve(mockLists),
        }),
        findOne: () => Promise.resolve(mockListData),
        create: () => Promise.resolve(mockListData),
        findOneAndUpdate: () => Promise.resolve(mockListData),
        deleteOne: () => Promise.resolve({ deletedCount: 1 }),
      },
    });
  });

  afterAll(() => {
    // Cleanup
    restoreMockFactories(originalModel);
    TestSetup.restoreTestEnvironment({ originalLogError });
  });

  describe("fetchAllLists", () => {
    it("should fetch all lists sorted by name desc", async () => {
      const result = await listService.fetchAllLists();
      expect(result).toEqual(mockLists);
    });

    it("should throw error on database error", async () => {
      modelMocks.list.find = () => ({
        sort: () => Promise.reject(new Error("Database error")),
      });

      await expect(listService.fetchAllLists()).rejects.toThrow(
        "Database error",
      );
    });
  });

  describe("fetchUserLists", () => {
    it("should fetch lists for specific user sorted by name desc", async () => {
      const result = await listService.fetchUserLists(mockUser);
      expect(result).toEqual(mockLists);
    });

    it("should throw error on database error", async () => {
      modelMocks.list.find = () => ({
        sort: () => Promise.reject(new Error("Database error")),
      });

      await expect(listService.fetchUserLists(mockUser)).rejects.toThrow(
        "Database error",
      );
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
      const existingList = createList(listName);

      // Mock existing list found
      modelMocks.list.find = () => Promise.resolve([existingList]);

      await expect(listService.createList(listName, mockUser)).rejects.toThrow(
        "A list with this name already exists.",
      );
    });

    it("should use user._id when both _id and id are present", async () => {
      const listName = "Test List";
      const userWithBothIds = {
        _id: createObjectId("507f1f77bcf86cd799439011"),
        id: "different-id-string",
        email: "test@example.com",
      };

      // Mock no existing lists
      modelMocks.list.find = () => Promise.resolve([]);

      // Capture the arguments passed to List.create
      let createArgs;
      modelMocks.list.create = (args) => {
        createArgs = args;
        return Promise.resolve(mockListData);
      };

      await listService.createList(listName, userWithBothIds);

      // Verify that user._id was used (not user.id)
      expect(createArgs.user).toEqual(userWithBothIds._id);
    });

    it("should use user.id when _id is not present", async () => {
      const listName = "Test List";
      const userWithOnlyId = {
        id: "507f1f77bcf86cd799439011",
        email: "test@example.com",
      };

      // Mock no existing lists
      modelMocks.list.find = () => Promise.resolve([]);

      // Capture the arguments passed to List.create
      let createArgs;
      modelMocks.list.create = (args) => {
        createArgs = args;
        return Promise.resolve(mockListData);
      };

      await listService.createList(listName, userWithOnlyId);

      // Verify that user.id was used and converted to ObjectId
      expect(createArgs.user).toEqual(createObjectId(userWithOnlyId.id));
    });

    it("should handle user._id being null and fallback to user.id", async () => {
      const listName = "Test List";
      const userWithNullId = {
        _id: null,
        id: "507f1f77bcf86cd799439011",
        email: "test@example.com",
      };

      // Mock no existing lists
      modelMocks.list.find = () => Promise.resolve([]);

      // Capture the arguments passed to List.create
      let createArgs;
      modelMocks.list.create = (args) => {
        createArgs = args;
        return Promise.resolve(mockListData);
      };

      await listService.createList(listName, userWithNullId);

      // Verify that user.id was used when _id is null
      expect(createArgs.user).toEqual(createObjectId(userWithNullId.id));
    });
  });

  describe("fetchList", () => {
    it("should fetch list by id", async () => {
      const listId = createObjectId();

      const result = await listService.fetchList(listId);
      expect(result).toEqual(mockListData);
    });

    it("should throw error on database error", async () => {
      modelMocks.list.findOne = () =>
        Promise.reject(new Error("Database error"));

      await expect(listService.fetchList(createObjectId())).rejects.toThrow(
        "Database error",
      );
    });
  });

  describe("deleteList", () => {
    it("should return null when authorized", async () => {
      const listId = createObjectId();
      const mockList = {
        ...createList(),
        user: mockUser._id,
      };

      modelMocks.list.findOne = () => Promise.resolve(mockList);

      const result = await listService.deleteList({ id: listId }, mockUser);
      expect(result).toBeNull();
    });

    it("should throw unauthorized error", async () => {
      const listId = createObjectId();
      const unauthorizedUser = createUnauthorizedUser();
      const mockList = {
        ...createList(),
        user: mockUser._id, // Different user
      };

      modelMocks.list.findOne = () => Promise.resolve(mockList);

      await expect(
        listService.deleteList({ id: listId }, unauthorizedUser),
      ).rejects.toThrow("Unauthorized!");
    });

    it("should throw error when list is not found", async () => {
      const listId = createObjectId();

      // Mock that no list is found
      modelMocks.list.findOne = () => Promise.resolve(null);

      await expect(
        listService.deleteList({ id: listId }, mockUser),
      ).rejects.toThrow("List not found");
    });
  });

  describe("editList", () => {
    it("should handle edit operation", async () => {
      const listId = createObjectId();
      const updates = { id: listId, name: "Updated List" };
      const mockList = {
        ...createList(),
        user: mockUser._id,
      };

      modelMocks.list.findOne = () => Promise.resolve(mockList);

      const result = await listService.editList(updates, mockUser);
      expect(result).toEqual(mockListData);
    });

    it("should throw unauthorized error", async () => {
      const listId = createObjectId();
      const updates = { id: listId, name: "Updated List" };
      const unauthorizedUser = createUnauthorizedUser();
      const mockList = {
        ...createList(),
        user: mockUser._id, // Different user
      };

      modelMocks.list.findOne = () => Promise.resolve(mockList);

      await expect(
        listService.editList(updates, unauthorizedUser),
      ).rejects.toThrow("Unauthorized!");
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
        testFunctionExists(listService, functionName);
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

    it("should throw authorization errors", async () => {
      const listId = createObjectId();
      const unauthorizedUser = createUnauthorizedUser();
      const mockList = {
        ...createList(),
        user: mockUser._id, // Different user
      };

      modelMocks.list.findOne = () => Promise.resolve(mockList);

      await expect(
        listService.deleteList({ id: listId }, unauthorizedUser),
      ).rejects.toThrow("Unauthorized!");
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
        const unauthorizedUserId = createObjectId("507f1f77bcf86cd799439099");
        const mockList = { ...mockListData, user: mockUser._id };
        modelMocks.list.findOne = () => Promise.resolve(mockList);

        await expect(
          listService.getAuthorizedList(mockList._id, unauthorizedUserId),
        ).rejects.toThrow("Unauthorized");
      });

      it("should return null when list is not found", async () => {
        modelMocks.list.findOne = () => Promise.resolve(null);

        const result = await listService.getAuthorizedList(
          createObjectId(),
          mockUser._id,
        );
        expect(result).toBeNull();
      });
    });

    describe("updateMediaProperty", () => {
      const mockMediaId = createObjectId();

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
          createObjectId(),
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
          createObjectId(),
          { isWatched: true },
        );
        expect(result).toBeNull();
      });
    });
  });
});
