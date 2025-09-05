import mongoose from "mongoose";

import { areIdsEqual, convertToObjectId } from "../helpers/index.js";

const List = mongoose.model("list");

// Helper function to check list authorization
export async function getAuthorizedList(listId, userId) {
  const list = await List.findOne({ _id: convertToObjectId(listId) });
  if (!list) return null;
  if (!areIdsEqual(userId, list.user)) {
    throw new Error("Unauthorized");
  }
  return list;
}

// Helper function to update a media item property in a list
export async function updateMediaProperty(listId, itemId, propertyUpdates) {
  try {
    const list = await List.findOne({ _id: convertToObjectId(listId) });
    if (!list) return null;

    const updatedList = { ...list, media: list.media.slice() };
    const index = updatedList.media.findIndex((el) =>
      areIdsEqual(el.item_id, itemId),
    );
    if (index === -1) return null;

    Object.assign(updatedList.media[index], propertyUpdates);
    return List.findOneAndUpdate(
      { _id: convertToObjectId(listId) },
      updatedList,
    );
  } catch (error) {
    console.error("Error updating media property:", error);
    throw error;
  }
}

export async function fetchAllLists() {
  return await List.find({}, { name: 1, user: 1 }).sort({ name: -1 });
}

export async function fetchUserLists(user) {
  return await List.find({ user: convertToObjectId(user.id) }).sort({
    name: "desc",
  });
}

export async function createList(name, user) {
  // Check if a list with this name already exists for the user
  const existingLists = await List.find({
    user: convertToObjectId(user._id || user.id),
    name: name,
  });

  if (existingLists.length > 0) {
    throw new Error("A list with this name already exists.");
  }

  // Create the new list using List.create
  return await List.create({
    name: name,
    user: convertToObjectId(user._id || user.id),
    media: [],
  });
}

export async function fetchList(id) {
  return await List.findOne({ _id: convertToObjectId(id) });
}

export async function deleteList({ id }, user) {
  const list = await getAuthorizedList(id, user._id);
  if (!list) throw new Error("List not found");

  await List.deleteOne({ _id: convertToObjectId(id) });
  return null;
}

export async function editList({ id, name }, user) {
  const list = await getAuthorizedList(id, user._id);
  if (!list) throw new Error("List not found");

  return List.findOneAndUpdate(
    { _id: convertToObjectId(id) },
    { $set: { name } },
  );
}

export default {
  getAuthorizedList,
  updateMediaProperty,
  fetchAllLists,
  fetchUserLists,
  createList,
  fetchList,
  deleteList,
  editList,
};
