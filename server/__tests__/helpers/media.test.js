import mongoose from "mongoose";

import {
  compareMedia,
  filterOutDuplicateItems,
  getChildMediaIds,
} from "../../helpers/media.js";

const { ObjectId } = mongoose.Types;

describe("Media Helpers", () => {
  describe("compareMedia", () => {
    it("should sort media by release date ascending", () => {
      const media1 = {
        release_date: new Date("2023-01-01"),
        media_type: "movie",
        title: "A",
      };
      const media2 = {
        release_date: new Date("2023-01-02"),
        media_type: "movie",
        title: "B",
      };

      expect(compareMedia(media1, media2)).toBe(-1);
      expect(compareMedia(media2, media1)).toBe(1);
    });

    it("should sort by media type when release dates are equal", () => {
      const date = new Date("2023-01-01");
      const movie = { release_date: date, media_type: "movie", title: "A" };
      const tv = { release_date: date, media_type: "tv", title: "A" };
      const season = { release_date: date, media_type: "season", title: "A" };
      const episode = { release_date: date, media_type: "episode", title: "A" };

      expect(compareMedia(movie, tv)).toBe(-1);
      expect(compareMedia(tv, season)).toBe(-1);
      expect(compareMedia(season, episode)).toBe(-1);
    });

    it("should return 1 when first media type is higher than second (line 21)", () => {
      const date = new Date("2023-01-01");
      const tv = { release_date: date, media_type: "tv", title: "A" };
      const movie = { release_date: date, media_type: "movie", title: "A" };
      const episode = { release_date: date, media_type: "episode", title: "A" };
      const season = { release_date: date, media_type: "season", title: "A" };

      // Test cases where first media type value is higher than second
      expect(compareMedia(tv, movie)).toBe(1); // tv (1) > movie (0)
      expect(compareMedia(season, tv)).toBe(1); // season (2) > tv (1)
      expect(compareMedia(episode, season)).toBe(1); // episode (3) > season (2)
      expect(compareMedia(episode, movie)).toBe(1); // episode (3) > movie (0)
    });

    it("should sort by title when release date and type are equal", () => {
      const date = new Date("2023-01-01");
      const mediaA = {
        release_date: date,
        media_type: "movie",
        title: "A Movie",
      };
      const mediaB = {
        release_date: date,
        media_type: "movie",
        title: "B Movie",
      };

      expect(compareMedia(mediaA, mediaB)).toBe(-1);
      expect(compareMedia(mediaB, mediaA)).toBe(1);
    });
  });

  describe("filterOutDuplicateItems", () => {
    it("should filter out items that already exist in the list", () => {
      const existingId = new ObjectId();
      const newId = new ObjectId();

      const listMedia = [{ item_id: existingId }];
      const items = [{ _id: existingId }, { _id: newId }];

      const result = filterOutDuplicateItems(listMedia, items);
      expect(result).toHaveLength(1);
      expect(result[0]._id).toEqual(newId);
    });

    it("should return empty array when all items already exist", () => {
      const id1 = new ObjectId();
      const id2 = new ObjectId();

      const listMedia = [{ item_id: id1 }, { item_id: id2 }];
      const items = [{ _id: id1 }, { _id: id2 }];

      const result = filterOutDuplicateItems(listMedia, items);
      expect(result).toHaveLength(0);
    });

    it("should return all items when none exist in the list", () => {
      const listMedia = [];
      const items = [{ _id: new ObjectId() }, { _id: new ObjectId() }];

      const result = filterOutDuplicateItems(listMedia, items);
      expect(result).toHaveLength(2);
    });
  });

  describe("getChildMediaIds", () => {
    it("should find children by parent_show relationship", () => {
      const parentId = new ObjectId();
      const childId = new ObjectId();
      const otherChildId = new ObjectId();

      const medias = [
        { id: childId, parent_show: parentId, parent_season: null },
        { id: otherChildId, parent_show: new ObjectId(), parent_season: null },
        { id: new ObjectId(), parent_show: null, parent_season: null },
      ];

      const result = getChildMediaIds(medias, parentId);
      expect(result).toHaveLength(1);
      expect(result[0]).toBe(childId.toString());
    });

    it("should find children by parent_season relationship", () => {
      const parentSeasonId = new ObjectId();
      const childId = new ObjectId();

      const medias = [
        { id: childId, parent_show: null, parent_season: parentSeasonId },
        {
          id: new ObjectId(),
          parent_show: null,
          parent_season: new ObjectId(),
        },
      ];

      const result = getChildMediaIds(medias, parentSeasonId);
      expect(result).toHaveLength(1);
      expect(result[0]).toBe(childId.toString());
    });

    it("should handle null/undefined parent relationships", () => {
      const itemId = new ObjectId();
      const medias = [
        { id: new ObjectId(), parent_show: null, parent_season: null },
        {
          id: new ObjectId(),
          parent_show: undefined,
          parent_season: undefined,
        },
      ];

      const result = getChildMediaIds(medias, itemId);
      expect(result).toHaveLength(0);
    });

    it("should handle mixed parent relationships", () => {
      const targetParentId = new ObjectId();
      const childId1 = new ObjectId();
      const childId2 = new ObjectId();

      const medias = [
        { id: childId1, parent_show: targetParentId, parent_season: null },
        { id: childId2, parent_show: null, parent_season: targetParentId },
        {
          id: new ObjectId(),
          parent_show: new ObjectId(),
          parent_season: new ObjectId(),
        },
      ];

      const result = getChildMediaIds(medias, targetParentId);
      expect(result).toHaveLength(2);
      expect(result).toContain(childId1.toString());
      expect(result).toContain(childId2.toString());
    });

    it("should handle empty medias array", () => {
      const result = getChildMediaIds([], new ObjectId());
      expect(result).toHaveLength(0);
    });
  });
});
