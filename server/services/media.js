import mongoose from "mongoose";

import {
  areIdsEqual,
  compareMedia,
  convertToObjectId,
  filterOutDuplicateItems,
  getChildMediaIds,
  MediaTypeEnum,
  mediaTypes,
} from "../helpers/index.js";
import listService from "./list.js";
import { fetchSeasonFromTMDB, fetchShowFromTMDB, searchTMDB } from "./tmdb.js";

const List = mongoose.model("list");
const Media = mongoose.model("media");

async function searchMedia(searchQuery) {
  const res = await searchTMDB(searchQuery);
  return res.results
    .map((media) => {
      const updatedMedia = { ...media };
      if (!media.release_date && !media.first_air_date) return null;
      if (media.media_type === "tv") {
        updatedMedia.release_date = new Date(media.first_air_date);
        updatedMedia.title = media.name;
      } else {
        updatedMedia.release_date = new Date(media.release_date);
      }
      // Keep media_type as string for API response
      // Conversion to number happens in addToList when saving to database
      return updatedMedia;
    })
    .filter((media) => !!media)
    .sort(compareMedia);
}

async function addToList(media, user) {
  const list = await listService.getAuthorizedList(media.list, user._id);
  if (!list) return null;

  const m = await Media.findOneAndUpdate(
    { media_id: media.id },
    {
      $set: {
        media_id: media.id, // id of media on TMDB
        title: media.title,
        release_date: media.release_date,
        poster_path: media.poster_path,
        media_type: mediaTypes[media.media_type], // Convert string to number for database
      },
    },
    { new: true, upsert: true },
  );
  // filter the existing item out of the list (by MLab id)
  // and add the item into the list, referenced by MLab id
  const mediaList = list.media
    .filter((el) => !areIdsEqual(el.item_id, m._id))
    .concat([{ item_id: m._id, isWatched: false }]);
  return List.findOneAndUpdate(
    { _id: convertToObjectId(media.list) },
    { $set: { media: mediaList } },
    { new: true },
  );
}

async function getMediaList(mediaIds) {
  const idToItem = new Map();
  const objectIds = [];
  mediaIds.forEach((el) => {
    idToItem.set(el.item_id.toString(), el);
    objectIds.push(convertToObjectId(el.item_id));
  });

  const ms = await Media.find({
    _id: { $in: objectIds },
  })
    .select(
      "title media_id release_date poster_path media_type number parent_show parent_season episode",
    )
    .sort({ release_date: 1, media_type: 1, title: 1 });

  return ms.map((m) => {
    const mediaItem = idToItem.get(m._id.toString());
    return {
      isWatched: mediaItem.isWatched,
      title: m.title,
      media_id: m.media_id,
      release_date: m.release_date,
      poster_path: m.poster_path,
      media_type: MediaTypeEnum[m.media_type], // Convert number back to string for API
      number: m.number,
      parent_show: m.parent_show,
      parent_season: m.parent_season,
      episode: m.episode,
      id: m._id,
      show_children: mediaItem.show_children,
    };
  });
}

async function removeFromList({ id, list }, user) {
  // id passed in is the media id from TMDB
  const listData = await listService.getAuthorizedList(list, user._id);
  if (!listData) return null;

  const ms = await getMediaList(listData.media);
  const item = ms.find((m) => areIdsEqual(m.media_id, id));
  const removedItems = getChildMediaIds(ms, item.id).concat([
    item.id.toString(),
  ]);
  return List.findOneAndUpdate(
    { _id: convertToObjectId(list) },
    {
      $set: {
        media: listData.media.filter(
          (el) => !removedItems.includes(el.item_id.toString()),
        ),
      },
    },
    { new: true },
  );
}

async function toggleWatched({ id, isWatched, list }) {
  return listService.updateMediaProperty(list, id, { isWatched });
}

async function hideChildren({ id, list }) {
  return listService.updateMediaProperty(list, id, { show_children: false });
}

async function addSeasons({ id, media_id, list }) {
  const data = await fetchShowFromTMDB(media_id);
  const seasons = data.seasons.map((season) => ({
    title: data.name,
    media_id: season.id,
    release_date: season.air_date,
    poster_path: season.poster_path,
    media_type: mediaTypes.season, // Convert to number for database
    parent_show: id,
    number: season.season_number,
  }));
  const items = await Promise.all(
    seasons.map((season) =>
      Media.findOneAndUpdate(
        { media_id: season.media_id },
        { $set: season },
        { new: true, upsert: true },
      ),
    ),
  );
  const l = await List.findOne({ _id: convertToObjectId(list) });

  // filter items already in the list and add the new items
  const newItems = filterOutDuplicateItems(l.media, items).map((item) => ({
    item_id: item._id,
    isWatched: false,
    show_children: false,
  }));
  const mediaList = l.media.concat(newItems);

  const showIndex = mediaList.findIndex((el) => areIdsEqual(el.item_id, id));
  mediaList[showIndex].show_children = true;

  return List.findOneAndUpdate(
    { _id: convertToObjectId(list) },
    { $set: { media: mediaList } },
    { new: true },
  );
}

async function addEpisodes({ id, season_number, show_id, list }) {
  const show = await Media.findOne({
    _id: convertToObjectId(show_id),
  });
  const data = await fetchSeasonFromTMDB(show.media_id, season_number);
  const episodes = data.episodes.map((episode) => ({
    media_id: episode.id,
    title: `${show.title}: ${data.name}`,
    episode: episode.name,
    release_date: episode.air_date,
    poster_path: episode.still_path,
    media_type: mediaTypes.episode, // Convert to number for database
    parent_season: convertToObjectId(id),
    parent_show: show._id,
    number: episode.episode_number,
  }));
  const items = await Promise.all(
    episodes.map((episode) =>
      Media.findOneAndUpdate(
        { media_id: episode.media_id },
        { $set: episode },
        { new: true, upsert: true },
      ),
    ),
  );
  const l = await List.findOne({ _id: convertToObjectId(list) });
  // filter items already in the list and add the new items
  const newItems = filterOutDuplicateItems(l.media, items).map((item) => ({
    item_id: item._id,
    isWatched: false,
  }));
  const mediaList = l.media.concat(newItems);

  const seasonIndex = mediaList.findIndex((el) => areIdsEqual(el.item_id, id));
  mediaList[seasonIndex].show_children = true;

  return List.findOneAndUpdate(
    { _id: convertToObjectId(list) },
    { $set: { media: mediaList } },
    { new: true },
  );
}

export default {
  searchMedia,
  addToList,
  getMediaList,
  removeFromList,
  toggleWatched,
  addSeasons,
  addEpisodes,
  hideChildren,
};
