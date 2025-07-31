import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;

import { areIdsEqual, convertToObjectId } from "../../helpers/database.js";

describe("Database Helpers", () => {
  describe("convertToObjectId", () => {
    it("should convert string to ObjectId", () => {
      const id = "507f1f77bcf86cd799439011";
      const result = convertToObjectId(id);
      expect(result).toBeInstanceOf(ObjectId);
      expect(result.toString()).toBe(id);
    });

    it("should return the same ObjectId if already an ObjectId", () => {
      const id = new ObjectId();
      const result = convertToObjectId(id);
      expect(result).toBe(id);
    });

    it("should return null for null input", () => {
      const result = convertToObjectId(null);
      expect(result).toBeNull();
    });

    it("should return null for undefined input", () => {
      const result = convertToObjectId(undefined);
      expect(result).toBeNull();
    });

    it("should handle valid 24-character hex string", () => {
      const id = "507f1f77bcf86cd799439012";
      const result = convertToObjectId(id);
      expect(result).toBeInstanceOf(ObjectId);
    });

    it("should throw error for invalid hex string", () => {
      expect(() => {
        convertToObjectId("invalid-id");
      }).toThrow();
    });
  });

  describe("areIdsEqual", () => {
    it("should return true for identical ObjectIds", () => {
      const id = new ObjectId();
      expect(areIdsEqual(id, id)).toBe(true);
    });

    it("should return true for ObjectIds with same string representation", () => {
      const idString = "507f1f77bcf86cd799439011";
      const id1 = new ObjectId(idString);
      const id2 = new ObjectId(idString);
      expect(areIdsEqual(id1, id2)).toBe(true);
    });

    it("should return true when comparing ObjectId with string", () => {
      const idString = "507f1f77bcf86cd799439011";
      const objectId = new ObjectId(idString);
      expect(areIdsEqual(objectId, idString)).toBe(true);
      expect(areIdsEqual(idString, objectId)).toBe(true);
    });

    it("should return false for different ObjectIds", () => {
      const id1 = new ObjectId();
      const id2 = new ObjectId();
      expect(areIdsEqual(id1, id2)).toBe(false);
    });

    it("should return false when one ID is null", () => {
      const id = new ObjectId();
      expect(areIdsEqual(id, null)).toBe(false);
      expect(areIdsEqual(null, id)).toBe(false);
    });

    it("should return false when one ID is undefined", () => {
      const id = new ObjectId();
      expect(areIdsEqual(id, undefined)).toBe(false);
      expect(areIdsEqual(undefined, id)).toBe(false);
    });

    it("should return false when both IDs are null", () => {
      expect(areIdsEqual(null, null)).toBe(false);
    });

    it("should return false when both IDs are undefined", () => {
      expect(areIdsEqual(undefined, undefined)).toBe(false);
    });

    it("should return true for identical string IDs", () => {
      const idString = "507f1f77bcf86cd799439011";
      expect(areIdsEqual(idString, idString)).toBe(true);
    });
  });
});
