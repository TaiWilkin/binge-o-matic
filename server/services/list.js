import mongoose from "mongoose";

import { areIdsEqual, convertToObjectId, logError } from "../helpers/index.js";

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

    const updatedList = { ...list };
    const index = list.media.findIndex((el) => areIdsEqual(el.item_id, itemId));
    if (index === -1) return null;

    Object.assign(updatedList.media[index], propertyUpdates);
    return List.findOneAndUpdate(
      { _id: convertToObjectId(listId) },
      updatedList,
    );
  } catch (e) {
    logError(e);
    return null;
  }
}

function fetchAllLists() {
  return List.find()
    .sort({ name: "desc" })
    .catch((e) => {
      logError(e);
      return null;
    });
}

function fetchUserLists(user) {
  return List.find({ user: convertToObjectId(user.id) })
    .sort({ name: "desc" })
    .catch((e) => {
      logError(e);
      return null;
    });
}

function createList(name, user) {
  return List.find({ name }).then((res) => {
    if (res.length) {
      throw new Error("A list with this name already exists.");
    }
    return List.create({ user: convertToObjectId(user.id), name });
  });
}

function fetchList(id) {
  return List.findOne({ _id: convertToObjectId(id) }).catch((e) => {
    logError(e);
    return null;
  });
}

function deleteList({ id }, user) {
  return List.findOne({ _id: convertToObjectId(id) })
    .then((list) => {
      if (!areIdsEqual(list.user, user._id)) {
        throw new Error("Unauthorized!");
      }
      return List.deleteOne({ _id: convertToObjectId(id) });
    })
    .then(() => null)
    .catch((e) => {
      logError(e);
      return null;
    });
}

function editList({ id, name }, user) {
  return List.findOne({ _id: convertToObjectId(id) })
    .then((list) => {
      if (!areIdsEqual(list.user, user._id)) {
        throw new Error("Unauthorized!");
      }
      return List.findOneAndUpdate(
        { _id: convertToObjectId(id) },
        { $set: { name } },
      );
    })
    .catch((e) => {
      logError(e);
      return null;
    });
}

export default {
  fetchAllLists,
  fetchUserLists,
  createList,
  fetchList,
  deleteList,
  editList,
  getAuthorizedList,
  updateMediaProperty,
};
