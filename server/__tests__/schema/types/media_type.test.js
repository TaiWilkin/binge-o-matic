import "../../../models/media.js";

import { jest } from "@jest/globals";
import graphql from "graphql";
import GraphQLDate from "graphql-date";

import MediaType from "../../../schema/types/media_type.js";

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLBoolean,
} = graphql;

describe("MediaType", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Type Definition", () => {
    it("should be a GraphQLObjectType", () => {
      expect(MediaType).toBeInstanceOf(GraphQLObjectType);
    });

    it("should have the correct name", () => {
      expect(MediaType.name).toBe("MediaType");
    });

    it("should have all required fields", () => {
      const fields = MediaType.getFields();

      expect(fields.id).toBeDefined();
      expect(fields.title).toBeDefined();
      expect(fields.release_date).toBeDefined();
      expect(fields.media_type).toBeDefined();
      expect(fields.poster_path).toBeDefined();
      expect(fields.media_id).toBeDefined();
      expect(fields.number).toBeDefined();
      expect(fields.isWatched).toBeDefined();
      expect(fields.show_children).toBeDefined();
      expect(fields.parent_show).toBeDefined();
      expect(fields.parent_season).toBeDefined();
      expect(fields.episode).toBeDefined();
    });
  });

  describe("Field Types", () => {
    let fields;

    beforeEach(() => {
      fields = MediaType.getFields();
    });

    it("should have correct field types", () => {
      expect(fields.id.type).toBe(GraphQLID);
      expect(fields.title.type).toBe(GraphQLString);
      expect(fields.release_date.type).toBe(GraphQLDate);
      expect(fields.media_type.type).toBe(GraphQLString);
      expect(fields.poster_path.type).toBe(GraphQLString);
      expect(fields.media_id.type).toBe(GraphQLString);
      expect(fields.number.type).toBe(GraphQLInt);
      expect(fields.isWatched.type).toBe(GraphQLBoolean);
      expect(fields.show_children.type).toBe(GraphQLBoolean);
      expect(fields.parent_show.type).toBe(GraphQLID);
      expect(fields.parent_season.type).toBe(GraphQLID);
      expect(fields.episode.type).toBe(GraphQLString);
    });
  });

  describe("Field Resolvers", () => {
    let fields;

    beforeEach(() => {
      fields = MediaType.getFields();
    });

    it("should not have resolvers for most fields", () => {
      expect(fields.id.resolve).toBeUndefined();
      expect(fields.title.resolve).toBeUndefined();
      expect(fields.release_date.resolve).toBeUndefined();
      expect(fields.media_type.resolve).toBeUndefined();
      expect(fields.poster_path.resolve).toBeUndefined();
      expect(fields.media_id.resolve).toBeUndefined();
      expect(fields.number.resolve).toBeUndefined();
      expect(fields.isWatched.resolve).toBeUndefined();
      expect(fields.show_children.resolve).toBeUndefined();
      expect(fields.episode.resolve).toBeUndefined();
    });

    it("should have resolvers for parent fields", () => {
      expect(fields.parent_show.resolve).toBeDefined();
      expect(fields.parent_season.resolve).toBeDefined();
      expect(typeof fields.parent_show.resolve).toBe("function");
      expect(typeof fields.parent_season.resolve).toBe("function");
    });

    describe("parent_show resolver", () => {
      it("should return parent_show value when it exists", () => {
        const mockParentValue = {
          id: "media123",
          title: "Episode 1",
          parent_show: "show456",
        };

        const result = fields.parent_show.resolve(mockParentValue);

        expect(result).toBe("show456");
      });

      it("should return null when parent_show is undefined", () => {
        const mockParentValue = {
          id: "media123",
          title: "Movie",
          parent_show: undefined,
        };

        const result = fields.parent_show.resolve(mockParentValue);

        expect(result).toBe(null);
      });

      it("should return null when parent_show is null", () => {
        const mockParentValue = {
          id: "media123",
          title: "Movie",
          parent_show: null,
        };

        const result = fields.parent_show.resolve(mockParentValue);

        expect(result).toBe(null);
      });
    });

    describe("parent_season resolver", () => {
      it("should return parent_season value when it exists", () => {
        const mockParentValue = {
          id: "media123",
          title: "Episode 1",
          parent_season: "season789",
        };

        const result = fields.parent_season.resolve(mockParentValue);

        expect(result).toBe("season789");
      });

      it("should return null when parent_season is undefined", () => {
        const mockParentValue = {
          id: "media123",
          title: "Season 1",
          parent_season: undefined,
        };

        const result = fields.parent_season.resolve(mockParentValue);

        expect(result).toBe(null);
      });

      it("should return null when parent_season is null", () => {
        const mockParentValue = {
          id: "media123",
          title: "Season 1",
          parent_season: null,
        };

        const result = fields.parent_season.resolve(mockParentValue);

        expect(result).toBe(null);
      });
    });
  });

  describe("Integration", () => {
    it("should export MediaType as default", () => {
      expect(MediaType).toBeDefined();
      expect(MediaType.name).toBe("MediaType");
    });

    it("should have proper field configuration for GraphQL schema", () => {
      const fields = MediaType.getFields();

      // Verify all required fields exist
      const expectedFields = [
        "id",
        "title",
        "release_date",
        "media_type",
        "poster_path",
        "media_id",
        "number",
        "isWatched",
        "show_children",
        "parent_show",
        "parent_season",
        "episode",
      ];

      expectedFields.forEach((fieldName) => {
        expect(Object.keys(fields)).toContain(fieldName);
      });

      // Verify field count
      expect(Object.keys(fields)).toHaveLength(12);
    });
  });

  describe("Media Type Scenarios", () => {
    let fields;

    beforeEach(() => {
      fields = MediaType.getFields();
    });

    it("should handle movie data correctly", () => {
      const movieData = {
        id: "movie123",
        title: "The Matrix",
        release_date: new Date("1999-03-31"),
        media_type: "movie",
        poster_path: "/path/to/poster.jpg",
        media_id: "603",
        number: 1,
        isWatched: false,
        show_children: false,
        parent_show: null,
        parent_season: null,
        episode: null,
      };

      expect(fields.parent_show.resolve(movieData)).toBe(null);
      expect(fields.parent_season.resolve(movieData)).toBe(null);
    });

    it("should handle tv show data correctly", () => {
      const tvData = {
        id: "tv123",
        title: "Breaking Bad",
        release_date: new Date("2008-01-20"),
        media_type: "tv",
        poster_path: "/path/to/poster.jpg",
        media_id: "1396",
        number: 1,
        isWatched: false,
        show_children: true,
        parent_show: null,
        parent_season: null,
        episode: null,
      };

      expect(fields.parent_show.resolve(tvData)).toBe(null);
      expect(fields.parent_season.resolve(tvData)).toBe(null);
    });

    it("should handle episode data correctly", () => {
      const episodeData = {
        id: "episode123",
        title: "Pilot",
        release_date: new Date("2008-01-20"),
        media_type: "episode",
        poster_path: "/path/to/still.jpg",
        media_id: "349232",
        number: 1,
        isWatched: true,
        show_children: false,
        parent_show: "1396",
        parent_season: "30272",
        episode: "S01E01",
      };

      expect(fields.parent_show.resolve(episodeData)).toBe("1396");
      expect(fields.parent_season.resolve(episodeData)).toBe("30272");
    });

    it("should handle season data correctly", () => {
      const seasonData = {
        id: "season123",
        title: "Season 1",
        release_date: new Date("2008-01-20"),
        media_type: "season",
        poster_path: "/path/to/season.jpg",
        media_id: "30272",
        number: 1,
        isWatched: false,
        show_children: true,
        parent_show: "1396",
        parent_season: null,
        episode: null,
      };

      expect(fields.parent_show.resolve(seasonData)).toBe("1396");
      expect(fields.parent_season.resolve(seasonData)).toBe(null);
    });
  });
});
