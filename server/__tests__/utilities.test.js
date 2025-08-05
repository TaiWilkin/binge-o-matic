import mongoose from "mongoose";

import { areIdsEqual, convertToObjectId } from "../helpers/index.js";

const { ObjectId } = mongoose.Types;

describe("Utilities", () => {
  describe("convertToObjectId", () => {
    it("should convert string to ObjectId", () => {
      const hexString = "507f1f77bcf86cd799439011";
      const result = convertToObjectId(hexString);

      expect(result).toBeInstanceOf(ObjectId);
      expect(result.toString()).toBe(hexString);
    });

    it("should return the same ObjectId if already an ObjectId", () => {
      const objectId = new ObjectId();
      const result = convertToObjectId(objectId);

      expect(result).toBe(objectId);
      expect(result).toBeInstanceOf(ObjectId);
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
      const hexString = "60d21b4667d0d8992e610c85";
      const result = convertToObjectId(hexString);

      expect(result).toBeInstanceOf(ObjectId);
      expect(result.toString()).toBe(hexString);
    });

    it("should throw error for invalid hex string", () => {
      const invalidHex = "invalid-hex-string";

      expect(() => {
        convertToObjectId(invalidHex);
      }).toThrow();
    });
  });

  describe("areIdsEqual", () => {
    it("should return true for identical ObjectIds", () => {
      const id1 = new ObjectId();
      const id2 = id1;

      expect(areIdsEqual(id1, id2)).toBe(true);
    });

    it("should return true for ObjectIds with same string representation", () => {
      const hexString = "507f1f77bcf86cd799439011";
      const id1 = new ObjectId(hexString);
      const id2 = new ObjectId(hexString);

      expect(areIdsEqual(id1, id2)).toBe(true);
    });

    it("should return true when comparing ObjectId with string", () => {
      const hexString = "507f1f77bcf86cd799439011";
      const objectId = new ObjectId(hexString);

      expect(areIdsEqual(objectId, hexString)).toBe(true);
      expect(areIdsEqual(hexString, objectId)).toBe(true);
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

    it("should handle mixed null and undefined", () => {
      expect(areIdsEqual(null, undefined)).toBe(false);
      expect(areIdsEqual(undefined, null)).toBe(false);
    });

    it("should return true for identical string IDs", () => {
      const hexString = "507f1f77bcf86cd799439011";

      expect(areIdsEqual(hexString, hexString)).toBe(true);
    });
  });
});
