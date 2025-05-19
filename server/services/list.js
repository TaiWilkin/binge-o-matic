import mongoose from "mongoose";

var ObjectId = mongoose.Types.ObjectId;
const List = mongoose.model("list");

function fetchAllLists() {
  return List.find()
    .sort({ name: "desc" })
    .catch((e) => {
      console.log(e);
      return null;
    });
}

function fetchUserLists(user) {
  return List.find({ user: new ObjectId(user.id) })
    .sort({ name: "desc" })
    .catch((e) => {
      console.log(e);
      return null;
    });
}

function createList(name, user) {
  return List.find({ name: name }).then((res) => {
    if (res.length) {
      throw new Error("A list with this name already exists.");
    }
    return List.create({ user: new ObjectId(user.id), name: name });
  });
}

function fetchList(id) {
  return List.findOne({ _id: new ObjectId(id) }).catch((e) => {
    console.log(e);
    return null;
  });
}

function deleteList({ id }, user) {
  return List.findOne({ _id: new ObjectId(id) })
    .then((list) => {
      if (list.user.toString() !== user._id.toString()) {
        throw new Error("Unauthorized!");
        console.log(user, list.user);
      }
      return List.deleteOne({ _id: new ObjectId(id) });
    })
    .then((l) => {
      return null;
    })
    .catch((e) => {
      console.error(e);
      return null;
    });
}

function editList({ id, name }, user) {
  return List.findOne({ _id: new ObjectId(id) })
    .then((list) => {
      if (list.user.toString() !== user._id.toString()) {
        throw new Error("Unauthorized!");
        console.log(user, list.user);
      }
      return List.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { name: name } }
      );
    })
    .catch((e) => {
      console.error(e);
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
};
