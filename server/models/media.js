const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MediaSchema = new Schema({
  name: String,
  title: String,
  release_date: Date,
  media_type: String,
  poster_path: String,
  media_id: String,
  number: { type: Number, default: 1 },
  parent_season: { type: Schema.Types.ObjectId, ref: 'media' , default: null },
  parent_show: { type: Schema.Types.ObjectId, ref: 'media', default: null },
  episode: { type: String },
});

mongoose.model('media', MediaSchema);
