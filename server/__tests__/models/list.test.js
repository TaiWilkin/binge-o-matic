import { TestSetup } from "../testUtils.js";

describe("List Model", () => {
  let testList;
  let testUserId;
  let testMediaId;
  let List;
  let mongoose;

  // Initialize database once for the entire suite
  beforeAll(async () => {
    await TestSetup.initializeTestOnce();

    // Use dynamic imports to load models after setup
    const mongooseModule = await import("mongoose");
    mongoose = mongooseModule.default;
    List = mongoose.model("list");
  });

  beforeEach(async () => {
    // Only clear database and reset mocks, don't reinitialize
    await TestSetup.clearDatabase();

    // Create test ObjectIds
    testUserId = new mongoose.Types.ObjectId();
    testMediaId = new mongoose.Types.ObjectId();

    // Create a new list instance for each test
    testList = new List({
      name: "Test List",
      user: testUserId,
      media: [
        {
          item_id: testMediaId,
          isWatched: false,
          show_children: false,
        },
      ],
    });
  });

  afterEach(async () => {
    await TestSetup.cleanupTest();
  });

  describe("Schema Definition", () => {
    it("should have required fields", () => {
      const listFields = List.schema.paths;

      expect(listFields.name).toBeDefined();
      expect(listFields.user).toBeDefined();
      expect(listFields.media).toBeDefined();

      expect(listFields.name.instance).toBe("String");
      expect(listFields.user.instance).toBe("ObjectId");
      expect(listFields.media.instance).toBe("Array");
    });

    it("should have user field referencing user model", () => {
      const userField = List.schema.paths.user;
      expect(userField.options.ref).toBe("user");
      expect(userField.instance).toBe("ObjectId");
    });

    it("should have media array with ItemSchema", () => {
      const mediaField = List.schema.paths.media;
      expect(mediaField.instance).toBe("Array");

      // Check ItemSchema structure
      const itemSchema = mediaField.schema;
      expect(itemSchema.paths.isWatched).toBeDefined();
      expect(itemSchema.paths.item_id).toBeDefined();
      expect(itemSchema.paths.show_children).toBeDefined();
    });
  });

  describe("ItemSchema Definition", () => {
    it("should have correct ItemSchema fields", () => {
      const itemSchema = List.schema.paths.media.schema;

      expect(itemSchema.paths.isWatched.instance).toBe("Boolean");
      expect(itemSchema.paths.isWatched.defaultValue).toBe(false);

      expect(itemSchema.paths.item_id.instance).toBe("ObjectId");
      expect(itemSchema.paths.item_id.options.ref).toBe("media");

      expect(itemSchema.paths.show_children.instance).toBe("Boolean");
      expect(itemSchema.paths.show_children.defaultValue).toBe(false);
    });

    it("should set default values for ItemSchema fields", () => {
      const list = new List({
        name: "Test List",
        user: testUserId,
        media: [{ item_id: testMediaId }], // Only provide item_id
      });

      expect(list.media[0].isWatched).toBe(false);
      expect(list.media[0].show_children).toBe(false);
      expect(list.media[0].item_id).toEqual(testMediaId);
    });
  });

  describe("List Creation", () => {
    it("should create list with valid data", () => {
      const listData = {
        name: "My Watchlist",
        user: testUserId,
        media: [
          {
            item_id: testMediaId,
            isWatched: true,
            show_children: true,
          },
        ],
      };

      const list = new List(listData);

      expect(list.name).toBe(listData.name);
      expect(list.user).toEqual(testUserId);
      expect(list.media).toHaveLength(1);
      expect(list.media[0].item_id).toEqual(testMediaId);
      expect(list.media[0].isWatched).toBe(true);
      expect(list.media[0].show_children).toBe(true);
    });

    it("should create empty list", () => {
      const list = new List();

      expect(list.name).toBeUndefined();
      expect(list.user).toBeUndefined();
      expect(list.media).toEqual([]);
    });

    it("should create list with empty media array", () => {
      const list = new List({
        name: "Empty List",
        user: testUserId,
        media: [],
      });

      expect(list.name).toBe("Empty List");
      expect(list.user).toEqual(testUserId);
      expect(list.media).toEqual([]);
    });

    it("should create list with multiple media items", () => {
      const mediaId1 = new mongoose.Types.ObjectId();
      const mediaId2 = new mongoose.Types.ObjectId();

      const list = new List({
        name: "Multi Media List",
        user: testUserId,
        media: [
          { item_id: mediaId1, isWatched: false },
          { item_id: mediaId2, isWatched: true },
        ],
      });

      expect(list.media).toHaveLength(2);
      expect(list.media[0].item_id).toEqual(mediaId1);
      expect(list.media[0].isWatched).toBe(false);
      expect(list.media[1].item_id).toEqual(mediaId2);
      expect(list.media[1].isWatched).toBe(true);
    });
  });

  describe("Model Validation", () => {
    it("should validate list with valid data", () => {
      const validationError = testList.validateSync();
      expect(validationError).toBeUndefined();
    });

    it("should allow list without name", () => {
      const list = new List({
        user: testUserId,
        media: [],
      });

      const validationError = list.validateSync();
      expect(validationError).toBeUndefined();
    });

    it("should allow list without user", () => {
      const list = new List({
        name: "Test List",
        media: [],
      });

      const validationError = list.validateSync();
      expect(validationError).toBeUndefined();
    });

    it("should validate ObjectId for user field", () => {
      const list = new List({
        name: "Test List",
        user: "invalid-object-id",
        media: [],
      });

      const validationError = list.validateSync();
      expect(validationError).toBeDefined();
      expect(validationError.errors.user).toBeDefined();
    });

    it("should validate ObjectId for media item_id field", () => {
      const list = new List({
        name: "Test List",
        user: testUserId,
        media: [
          {
            item_id: "invalid-object-id",
            isWatched: false,
          },
        ],
      });

      const validationError = list.validateSync();
      expect(validationError).toBeDefined();
      expect(validationError.errors["media.0.item_id"]).toBeDefined();
    });
  });

  describe("Media Array Operations", () => {
    it("should allow adding media items", () => {
      const newMediaId = new mongoose.Types.ObjectId();

      testList.media.push({
        item_id: newMediaId,
        isWatched: true,
        show_children: false,
      });

      expect(testList.media).toHaveLength(2);
      expect(testList.media[1].item_id).toEqual(newMediaId);
      expect(testList.media[1].isWatched).toBe(true);
    });

    it("should allow removing media items", () => {
      const initialLength = testList.media.length;
      testList.media.pop();

      expect(testList.media).toHaveLength(initialLength - 1);
    });

    it("should allow updating media item properties", () => {
      testList.media[0].isWatched = true;
      testList.media[0].show_children = true;

      expect(testList.media[0].isWatched).toBe(true);
      expect(testList.media[0].show_children).toBe(true);
    });
  });

  describe("Model Registration", () => {
    it("should register the list model with mongoose", () => {
      expect(mongoose.model("list")).toBeDefined();
      expect(mongoose.model("list")).toBe(List);
    });

    it("should have the correct model name", () => {
      expect(List.modelName).toBe("list");
    });
  });

  describe("References", () => {
    it("should reference user model correctly", () => {
      const userRef = List.schema.paths.user.options.ref;
      expect(userRef).toBe("user");
    });

    it("should reference media model in ItemSchema correctly", () => {
      const mediaRef = List.schema.paths.media.schema.paths.item_id.options.ref;
      expect(mediaRef).toBe("media");
    });
  });

  describe("Type Casting", () => {
    it("should cast string to boolean for isWatched", () => {
      const list = new List({
        name: "Test List",
        user: testUserId,
        media: [
          {
            item_id: testMediaId,
            isWatched: "true", // String instead of boolean
          },
        ],
      });

      expect(typeof list.media[0].isWatched).toBe("boolean");
      expect(list.media[0].isWatched).toBe(true);
    });

    it("should cast string to boolean for show_children", () => {
      const list = new List({
        name: "Test List",
        user: testUserId,
        media: [
          {
            item_id: testMediaId,
            show_children: "false", // String instead of boolean
          },
        ],
      });

      expect(typeof list.media[0].show_children).toBe("boolean");
      expect(list.media[0].show_children).toBe(false);
    });
  });
});
