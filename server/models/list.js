import mongoose from "mongoose";

const { Schema } = mongoose;

const ItemSchema = new Schema({
  isWatched: { type: Boolean, default: false },
  item_id: { type: Schema.Types.ObjectId, ref: "media" }, // this is the MLab id of the media, NOT the TMDB id for the media
  show_children: { type: Boolean, default: false },
});

const ListSchema = new Schema({
  name: String,
  user: { type: Schema.Types.ObjectId, ref: "user" },
  media: [ItemSchema],
});

mongoose.model("list", ListSchema);
