import "./list.js";
import "./user.js";
import "./media.js";

import mongoose from "mongoose";

export default {
  User: mongoose.model("user"),
  List: mongoose.model("list"),
  Media: mongoose.model("media"),
};
