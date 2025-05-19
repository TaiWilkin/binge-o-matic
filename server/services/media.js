import mongoose from "mongoose";

import { logError } from "../utilities.js";

const { ObjectId } = mongoose.Types;
const List = mongoose.model("list");
const Media = mongoose.model("media");

function searchMedia(searchQuery) {
  const searchUrl = `https://api.themoviedb.org/3/search/multi?api_key=${process.env.API_KEY}&language=en-US&query=${searchQuery}&page=1&include_adult=false`;
  return fetch(searchUrl)
    .then((res) => {
      if (!res.ok) {
        const error = new Error(res.statusText);
        error.response = res;
        throw error;
      }
      return res.json();
    })
    .then((res) =>
      res.results
        .map((media) => {
          const updatedMedia = { ...media };
          if (!media.release_date && !media.first_air_date) return null;
          if (media.media_type === "tv") {
            updatedMedia.release_date = new Date(media.first_air_date);
            updatedMedia.title = media.name;
          } else {
            updatedMedia.release_date = new Date(media.release_date);
          }
          return updatedMedia;
        })
        .filter((media) => !!media),
    )
    .catch((err) => {
      throw new Error(err);
    });
}

function addToList(media, user) {
  let list = {};
  return List.findOne({ _id: new ObjectId(media.list) })
    .then((l) => {
      if (user._id.toString() !== l.user.toString()) {
        throw new Error("Unauthorized");
      }
      list = l;
      return Media.findOneAndUpdate(
        { media_id: media.id },
        {
          $set: {
            media_id: media.id, // id of media on TMDB
            title: media.title,
            release_date: media.release_date,
            poster_path: media.poster_path,
            media_type: media.media_type,
          },
        },
        { new: true, upsert: true },
      );
    })
    .then((m) => {
      // filter the existing item out of the list (by MLab id)
      // and add the item into the list, referenced by MLab id
      const mediaList = list.media
        .filter((el) => el.item_id.toString() !== m._id.toString())
        .concat([{ item_id: new ObjectId(m._id), isWatched: false }]);
      return List.findOneAndUpdate(
        { _id: new ObjectId(media.list) },
        { $set: { media: mediaList } },
        { new: true },
      );
    })
    .catch((e) => {
      logError(e);
      return null;
    });
}

const mediaTypes = {
  movie: 0,
  tv: 1,
  season: 2,
  episode: 3,
};

function getMediaList(mediaIds) {
  return Media.find({
    _id: { $in: mediaIds.map((el) => new ObjectId(el.item_id)) },
  }) // find all media whose _id equals the item_id (MLab id) of the item
    .then((ms) =>
      ms
        .map((m) => ({
          isWatched: mediaIds.find(
            (el) => el.item_id.toString() === m._id.toString(),
          ).isWatched,
          title: m.title,
          media_id: m.media_id,
          release_date: m.release_date,
          poster_path: m.poster_path,
          media_type: m.media_type,
          number: m.number,
          parent_show: m.parent_show,
          parent_season: m.parent_season,
          episode: m.episode,
          id: m._id,
          show_children: mediaIds.find(
            (el) => el.item_id.toString() === m._id.toString(),
          ).show_children,
        }))
        .sort((a, b) => {
          if (a.release_date < b.release_date) {
            return -1;
          }
          if (a.release_date > b.release_date) {
            return 1;
          }
          if (mediaTypes[a.media_type] < mediaTypes[b.media_type]) {
            return -1;
          }
          if (mediaTypes[a.media_type] > mediaTypes[b.media_type]) {
            return 1;
          }
          return a.title - b.title;
        }),
    );
}

function removeFromList({ id, list }, user) {
  // id passed in is the media id from TMDB
  let listData = {};
  return List.findOne({ _id: new ObjectId(list) })
    .then((l) => {
      if (user._id.toString() !== l.user.toString()) {
        throw new Error("Unauthorized");
      }
      listData = l;
      return getMediaList(listData.media);
    })
    .then((ms) => {
      const item = ms.find((el) => el.media_id.toString() === id.toString());
      const childItems = ms
        .filter(
          (m) =>
            (m.parent_show &&
              m.parent_show.toString() === item.id.toString()) ||
            (m.parent_season &&
              m.parent_season.toString() === item.id.toString()),
        )
        .map((el) => el.id.toString())
        .concat([item.id.toString()]);
      return List.findOneAndUpdate(
        { _id: new ObjectId(list) },
        {
          $set: {
            media: listData.media.filter(
              (el) => !childItems.includes(el.item_id.toString()),
            ),
          },
        },
        { new: true },
      );
    });
}

function toggleWatched({ id, isWatched, list }) {
  return List.findOne({ _id: new ObjectId(list) })
    .then((l) => {
      const updatedL = { ...l };
      const index = l.media.findIndex(
        (el) => el.item_id.toString() === id.toString(),
      );
      updatedL.media[index].isWatched = isWatched;
      return List.findOneAndUpdate({ _id: new ObjectId(list) }, updatedL);
    })
    .catch((e) => {
      logError(e);
      return null;
    });
}

function hideChildren({ id, list }) {
  return List.findOne({ _id: new ObjectId(list) })
    .then((l) => {
      const updatedL = { ...l };
      const index = l.media.findIndex(
        (el) => el.item_id.toString() === id.toString(),
      );
      updatedL.media[index].show_children = false;
      return List.findOneAndUpdate({ _id: new ObjectId(list) }, updatedL);
    })
    .catch((e) => {
      logError(e);
      return null;
    });
}

function addSeasons({ id, media_id, list }) {
  const searchUrl = `https://api.themoviedb.org/3/tv/${media_id}?api_key=${process.env.API_KEY}&language=en-US`;
  let items = [];
  return fetch(searchUrl)
    .then((response) => {
      if (!response.ok) {
        const error = new Error(response.statusText);
        error.response = response;
        throw error;
      }
      return response.json();
    })
    .then((data) => {
      const seasons = data.seasons.map((season) => ({
        title: data.name,
        media_id: season.id,
        release_date: season.air_date,
        poster_path: season.poster_path,
        media_type: "season",
        parent_show: id,
        number: season.season_number,
      }));
      return Promise.all(
        seasons.map((season) =>
          Media.findOneAndUpdate(
            { media_id: season.media_id },
            { $set: season },
            { new: true, upsert: true },
          ),
        ),
      );
    })
    .then((ms) => {
      items = ms;
      return List.findOne({ _id: new ObjectId(list) });
    })
    .then((l) => {
      // filter items already in the list (by MLab id)
      // and add the new items into the list, referenced by MLab id
      const stringIds = l.media.map((item) => item.item_id.toString());
      const newItems = items
        .filter((item) => !stringIds.includes(item._id.toString()))
        .map((item) => ({
          item_id: new ObjectId(item._id),
          isWatched: false,
          show_children: false,
        }));
      const mediaList = l.media.concat(newItems);

      const showIndex = mediaList.findIndex(
        (el) => el.item_id.toString() === id.toString(),
      );
      mediaList[showIndex].show_children = true;

      return List.findOneAndUpdate(
        { _id: new ObjectId(list) },
        { $set: { media: mediaList } },
        { new: true },
      );
    })
    .catch((e) => {
      logError(e);
      return null;
    });
}

function addEpisodes({ id, season_number, show_id, list }) {
  let items = [];
  let show = {};
  return Media.findOne({ _id: new ObjectId(show_id) })
    .then((s) => {
      show = s;
      const searchUrl = `https://api.themoviedb.org/3/tv/${show.media_id}/season/${season_number}?api_key=${process.env.API_KEY}&language=en-US`;
      return fetch(searchUrl);
    })
    .then((response) => {
      if (!response.ok) {
        const error = new Error(response.statusText);
        error.response = response;
        throw error;
      }
      return response.json();
    })
    .then((data) => {
      const episodes = data.episodes.map((episode) => ({
        media_id: episode.id,
        title: `${show.title}: ${data.name}`,
        episode: episode.name,
        release_date: episode.air_date,
        poster_path: episode.still_path,
        media_type: "episode",
        parent_season: new ObjectId(id),
        parent_show: new ObjectId(show._id),
        number: episode.episode_number,
      }));
      return Promise.all(
        episodes.map((episode) =>
          Media.findOneAndUpdate(
            { media_id: episode.media_id },
            { $set: episode },
            { new: true, upsert: true },
          ),
        ),
      );
    })
    .then((ms) => {
      items = ms;
      return List.findOne({ _id: new ObjectId(list) });
    })
    .then((l) => {
      // filter items already in the list (by MLab id)
      // and add the new items into the list, referenced by MLab id
      const stringIds = l.media.map((item) => item.item_id.toString());
      const newItems = items
        .filter((item) => !stringIds.includes(item._id.toString()))
        .map((item) => ({ item_id: new ObjectId(item._id), isWatched: false }));
      const mediaList = l.media.concat(newItems);

      const seasonIndex = mediaList.findIndex(
        (el) => el.item_id.toString() === id.toString(),
      );
      mediaList[seasonIndex].show_children = true;

      return List.findOneAndUpdate(
        { _id: new ObjectId(list) },
        { $set: { media: mediaList } },
        { new: true },
      );
    })
    .catch((e) => {
      logError(e);
      return null;
    });
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
