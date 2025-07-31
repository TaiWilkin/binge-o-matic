/**
 * Simple mock manager for customizing database mocks per test
 * Now using Jest's global mocking functions
 */

class MockManager {
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
        findOne: this.modelMocks.list.findOne,
        findOneAndUpdate: this.modelMocks.list.findOneAndUpdate,
      };
      this.originalMocks.media = {
        find: this.modelMocks.media.find,
        findOne: this.modelMocks.media.findOne,
        findOneAndUpdate: this.modelMocks.media.findOneAndUpdate,
      };
    }

    // Apply list mocks
    if (config.list) {
      if (config.list.findOne) {
        this.modelMocks.list.findOne = config.list.findOne;
        this.activeMocks.add("list.findOne");
      }
      if (config.list.findOneAndUpdate) {
        this.modelMocks.list.findOneAndUpdate = config.list.findOneAndUpdate;
        this.activeMocks.add("list.findOneAndUpdate");
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
      this.modelMocks.list.findOne = this.originalMocks.list.findOne;
      this.modelMocks.list.findOneAndUpdate =
        this.originalMocks.list.findOneAndUpdate;
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
   * Clear all Jest mock calls and instances for model mocks
   */
  clearMockCalls() {
    // Clear list model mock calls
    if (this.modelMocks.list) {
      if (jest.isMockFunction(this.modelMocks.list.findOne)) {
        this.modelMocks.list.findOne.mockClear();
      }
      if (jest.isMockFunction(this.modelMocks.list.findOneAndUpdate)) {
        this.modelMocks.list.findOneAndUpdate.mockClear();
      }
    }

    // Clear media model mock calls
    if (this.modelMocks.media) {
      if (jest.isMockFunction(this.modelMocks.media.find)) {
        this.modelMocks.media.find.mockClear();
      }
      if (jest.isMockFunction(this.modelMocks.media.findOne)) {
        this.modelMocks.media.findOne.mockClear();
      }
      if (jest.isMockFunction(this.modelMocks.media.findOneAndUpdate)) {
        this.modelMocks.media.findOneAndUpdate.mockClear();
      }
    }
  }

  /**
   * Reset all Jest mocks to their original implementation
   */
  resetMockImplementations() {
    // Reset list model mock implementations
    if (this.modelMocks.list) {
      if (jest.isMockFunction(this.modelMocks.list.findOne)) {
        this.modelMocks.list.findOne.mockReset();
      }
      if (jest.isMockFunction(this.modelMocks.list.findOneAndUpdate)) {
        this.modelMocks.list.findOneAndUpdate.mockReset();
      }
    }

    // Reset media model mock implementations
    if (this.modelMocks.media) {
      if (jest.isMockFunction(this.modelMocks.media.find)) {
        this.modelMocks.media.find.mockReset();
      }
      if (jest.isMockFunction(this.modelMocks.media.findOne)) {
        this.modelMocks.media.findOne.mockReset();
      }
      if (jest.isMockFunction(this.modelMocks.media.findOneAndUpdate)) {
        this.modelMocks.media.findOneAndUpdate.mockReset();
      }
    }
  }

  /**
   * Create test data with parent-child relationships for media
   * @param {Object} config - Configuration for test data
   * @param {string} config.parentId - Parent media ID
   * @param {Array} config.children - Array of child media objects
   * @param {Object} config.listData - List data to use
   */
  createParentChildTestData({ parentId, children = [], listData }) {
    const mediaData = [
      {
        _id: parentId,
        id: parentId,
        media_id: "12345",
        title: "Parent TV Show",
        media_type: "tv",
      },
      ...children.map((child) => ({
        _id: child.id,
        id: child.id,
        media_id: child.media_id || `child-${child.id}`,
        title: child.title || `Child ${child.id}`,
        media_type: child.media_type || "season",
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
        find: jest.fn(() => Promise.resolve(mediaData)),
      },
    };
  }
}

export default MockManager;
