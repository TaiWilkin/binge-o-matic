import mongoose from "mongoose";

const { ObjectId } = mongoose.Types;

export const convertToObjectId = (id) => {
  if (!id) return null;
  if (typeof id === "string") {
    return ObjectId.createFromHexString(id);
  }
  return id; // Already an ObjectId
};

export const areIdsEqual = (id1, id2) => {
  if (!id1 || !id2) return false;
  return id1.toString() === id2.toString();
};
