import { mediaTypes } from "../../helpers/index.js";
import { TestSetup } from "../testUtils.js";

describe("Media Model", () => {
  let testMedia;
  let testParentSeasonId;
  let testParentShowId;
  let Media;
  let mongoose;

  // Initialize database once for the entire suite
  beforeAll(async () => {
    await TestSetup.initializeTestOnce();

    // Use dynamic imports to load models after setup
    const mongooseModule = await import("mongoose");
    mongoose = mongooseModule.default;
    Media = mongoose.model("media");
  });

  beforeEach(async () => {
    // Only clear database and reset mocks, don't reinitialize
    await TestSetup.clearDatabase();

    // Create test ObjectIds
    testParentSeasonId = new mongoose.Types.ObjectId();
    testParentShowId = new mongoose.Types.ObjectId();

    // Create a new media instance for each test
    testMedia = new Media({
      name: "Test Movie",
      title: "Test Movie Title",
      release_date: new Date("2023-01-01"),
      media_type: mediaTypes.movie,
      poster_path: "/test-poster.jpg",
      media_id: "12345",
      number: 1,
      parent_season: testParentSeasonId,
      parent_show: testParentShowId,
      episode: "S01E01",
    });
  });

  afterEach(async () => {
    await TestSetup.cleanupTest();
  });

  afterAll(async () => {
    await TestSetup.teardownTest();
  });

  describe("Schema Definition", () => {
    it("should have all required fields", () => {
      const mediaFields = Media.schema.paths;

      expect(mediaFields.name).toBeDefined();
      expect(mediaFields.title).toBeDefined();
      expect(mediaFields.release_date).toBeDefined();
      expect(mediaFields.media_type).toBeDefined();
      expect(mediaFields.poster_path).toBeDefined();
      expect(mediaFields.media_id).toBeDefined();
      expect(mediaFields.number).toBeDefined();
      expect(mediaFields.parent_season).toBeDefined();
      expect(mediaFields.parent_show).toBeDefined();
      expect(mediaFields.episode).toBeDefined();
    });

    it("should have correct field types", () => {
      const mediaFields = Media.schema.paths;

      expect(mediaFields.name.instance).toBe("String");
      expect(mediaFields.title.instance).toBe("String");
      expect(mediaFields.release_date.instance).toBe("Date");
      expect(mediaFields.media_type.instance).toBe("Number");
      expect(mediaFields.poster_path.instance).toBe("String");
      expect(mediaFields.media_id.instance).toBe("String");
      expect(mediaFields.number.instance).toBe("Number");
      expect(mediaFields.parent_season.instance).toBe("ObjectId");
      expect(mediaFields.parent_show.instance).toBe("ObjectId");
      expect(mediaFields.episode.instance).toBe("String");
    });

    it("should have correct default values", () => {
      const mediaFields = Media.schema.paths;

      expect(mediaFields.number.defaultValue).toBe(1);
      expect(mediaFields.parent_season.defaultValue).toBe(null);
      expect(mediaFields.parent_show.defaultValue).toBe(null);
    });

    it("should have correct references", () => {
      const mediaFields = Media.schema.paths;

      expect(mediaFields.parent_season.options.ref).toBe("media");
      expect(mediaFields.parent_show.options.ref).toBe("media");
    });
  });

  describe("Media Creation", () => {
    it("should create media with complete data", () => {
      const mediaData = {
        name: "Breaking Bad",
        title: "Breaking Bad - Season 1",
        release_date: new Date("2008-01-20"),
        media_type: mediaTypes.tv,
        poster_path: "/breaking-bad-poster.jpg",
        media_id: "1396",
        number: 1,
        parent_season: testParentSeasonId,
        parent_show: testParentShowId,
        episode: "S01E01",
      };

      const media = new Media(mediaData);

      expect(media.name).toBe(mediaData.name);
      expect(media.title).toBe(mediaData.title);
      expect(media.release_date).toEqual(mediaData.release_date);
      expect(media.media_type).toBe(mediaData.media_type);
      expect(media.poster_path).toBe(mediaData.poster_path);
      expect(media.media_id).toBe(mediaData.media_id);
      expect(media.number).toBe(mediaData.number);
      expect(media.parent_season).toEqual(testParentSeasonId);
      expect(media.parent_show).toEqual(testParentShowId);
      expect(media.episode).toBe(mediaData.episode);
    });

    it("should create media with minimal data", () => {
      const media = new Media({
        name: "Simple Movie",
        media_id: "999",
      });

      expect(media.name).toBe("Simple Movie");
      expect(media.media_id).toBe("999");
      expect(media.number).toBe(1); // Default value
      expect(media.parent_season).toBe(null); // Default value
      expect(media.parent_show).toBe(null); // Default value
    });

    it("should create empty media", () => {
      const media = new Media();

      expect(media.name).toBeUndefined();
      expect(media.title).toBeUndefined();
      expect(media.release_date).toBeUndefined();
      expect(media.media_type).toBeUndefined();
      expect(media.poster_path).toBeUndefined();
      expect(media.media_id).toBeUndefined();
      expect(media.number).toBe(1); // Default value
      expect(media.parent_season).toBe(null); // Default value
      expect(media.parent_show).toBe(null); // Default value
      expect(media.episode).toBeUndefined();
    });
  });

  describe("Default Values", () => {
    it("should set default number to 1", () => {
      const media = new Media({ name: "Test" });
      expect(media.number).toBe(1);
    });

    it("should allow custom number value", () => {
      const media = new Media({ name: "Test", number: 5 });
      expect(media.number).toBe(5);
    });

    it("should set default parent_season to null", () => {
      const media = new Media({ name: "Test" });
      expect(media.parent_season).toBe(null);
    });

    it("should set default parent_show to null", () => {
      const media = new Media({ name: "Test" });
      expect(media.parent_show).toBe(null);
    });

    it("should allow setting parent references", () => {
      const seasonId = new mongoose.Types.ObjectId();
      const showId = new mongoose.Types.ObjectId();

      const media = new Media({
        name: "Test Episode",
        parent_season: seasonId,
        parent_show: showId,
      });

      expect(media.parent_season).toEqual(seasonId);
      expect(media.parent_show).toEqual(showId);
    });
  });

  describe("Model Validation", () => {
    it("should validate media with valid data", () => {
      const validationError = testMedia.validateSync();
      expect(validationError).toBeUndefined();
    });

    it("should allow media without optional fields", () => {
      const media = new Media({
        name: "Basic Media",
        media_id: "123",
      });

      const validationError = media.validateSync();
      expect(validationError).toBeUndefined();
    });

    it("should validate ObjectId for parent_season", () => {
      const media = new Media({
        name: "Test",
        parent_season: "invalid-object-id",
      });

      const validationError = media.validateSync();
      expect(validationError).toBeDefined();
      expect(validationError.errors.parent_season).toBeDefined();
    });

    it("should validate ObjectId for parent_show", () => {
      const media = new Media({
        name: "Test",
        parent_show: "invalid-object-id",
      });

      const validationError = media.validateSync();
      expect(validationError).toBeDefined();
      expect(validationError.errors.parent_show).toBeDefined();
    });

    it("should validate number field type", () => {
      const media = new Media({
        name: "Test",
        number: "not-a-number",
      });

      const validationError = media.validateSync();
      expect(validationError).toBeDefined();
      expect(validationError.errors.number).toBeDefined();
    });

    it("should validate date field type", () => {
      const media = new Media({
        name: "Test",
        release_date: "not-a-date",
      });

      const validationError = media.validateSync();
      expect(validationError).toBeDefined();
      expect(validationError.errors.release_date).toBeDefined();
    });
  });

  describe("Type Casting", () => {
    it("should cast string to number for number field", () => {
      const media = new Media({
        name: "Test",
        number: "5", // String instead of number
      });

      expect(typeof media.number).toBe("number");
      expect(media.number).toBe(5);
    });

    it("should cast string to Date for release_date field", () => {
      const testDate = "2023-06-15T12:00:00.000Z";
      const media = new Media({
        name: "Test",
        release_date: testDate, // String instead of Date
      });

      expect(media.release_date instanceof Date).toBe(true);
      expect(media.release_date.getFullYear()).toBe(2023);
      expect(media.release_date.getMonth()).toBe(5); // June is month 5 (0-indexed)
    });

    it("should handle invalid date string", () => {
      const media = new Media({
        name: "Test",
        release_date: "invalid-date",
      });

      const validationError = media.validateSync();
      expect(validationError).toBeDefined();
      expect(validationError.errors.release_date).toBeDefined();
    });
  });

  describe("Self-Referencing Relationships", () => {
    it("should allow media to reference itself as parent_season", () => {
      const seasonId = new mongoose.Types.ObjectId();
      const episode = new Media({
        name: "Episode 1",
        media_type: mediaTypes.episode,
        parent_season: seasonId,
      });

      expect(episode.parent_season).toEqual(seasonId);
    });

    it("should allow media to reference itself as parent_show", () => {
      const showId = new mongoose.Types.ObjectId();
      const season = new Media({
        name: "Season 1",
        media_type: mediaTypes.season,
        parent_show: showId,
      });

      expect(season.parent_show).toEqual(showId);
    });

    it("should allow hierarchical media structure", () => {
      const showId = new mongoose.Types.ObjectId();
      const seasonId = new mongoose.Types.ObjectId();

      const episode = new Media({
        name: "Episode Title",
        media_type: mediaTypes.episode,
        parent_season: seasonId,
        parent_show: showId,
        number: 1,
        episode: "S01E01",
      });

      expect(episode.parent_season).toEqual(seasonId);
      expect(episode.parent_show).toEqual(showId);
      expect(episode.number).toBe(1);
      expect(episode.episode).toBe("S01E01");
    });
  });

  describe("Media Types", () => {
    it("should handle movie media type", () => {
      const movie = new Media({
        name: "Test Movie",
        media_type: mediaTypes.movie,
        media_id: "123",
      });

      expect(movie.media_type).toBe(mediaTypes.movie);
    });

    it("should handle tv media type", () => {
      const tv = new Media({
        name: "Test TV Show",
        media_type: mediaTypes.tv,
        media_id: "456",
      });

      expect(tv.media_type).toBe(mediaTypes.tv);
    });

    it("should handle episode media type", () => {
      const episode = new Media({
        name: "Test Episode",
        media_type: mediaTypes.episode,
        media_id: "789",
      });

      expect(episode.media_type).toBe(mediaTypes.episode);
    });

    it("should handle season media type", () => {
      const season = new Media({
        name: "Test Season",
        media_type: mediaTypes.season,
        media_id: "999",
      });

      expect(season.media_type).toBe(mediaTypes.season);
    });
  });

  describe("Model Registration", () => {
    it("should register the media model with mongoose", () => {
      expect(mongoose.model("media")).toBeDefined();
      expect(mongoose.model("media")).toBe(Media);
    });

    it("should have the correct model name", () => {
      expect(Media.modelName).toBe("media");
    });
  });

  describe("Poster Path Handling", () => {
    it("should handle full poster path", () => {
      const media = new Media({
        name: "Test",
        poster_path: "/full/path/to/poster.jpg",
      });

      expect(media.poster_path).toBe("/full/path/to/poster.jpg");
    });

    it("should handle null poster path", () => {
      const media = new Media({
        name: "Test",
        poster_path: null,
      });

      expect(media.poster_path).toBe(null);
    });

    it("should handle undefined poster path", () => {
      const media = new Media({
        name: "Test",
      });

      expect(media.poster_path).toBeUndefined();
    });
  });
});
