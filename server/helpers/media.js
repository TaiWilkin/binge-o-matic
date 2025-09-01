import { areIdsEqual } from "./database.js";

const mediaTypes = {
  movie: 0,
  tv: 1,
  season: 2,
  episode: 3,
};

export const compareMedia = (a, b) => {
  if (a.release_date < b.release_date) return -1;
  if (a.release_date > b.release_date) return 1;
  if (mediaTypes[a.media_type] < mediaTypes[b.media_type]) return -1;
  if (mediaTypes[a.media_type] > mediaTypes[b.media_type]) return 1;
  return a.title.localeCompare(b.title);
};

export const filterOutDuplicateItems = (listMedia, items) => {
  // filter items already in the list (by MLab id)
  const stringIds = listMedia.map((media) => media.item_id.toString());
  return items.filter((media) => !stringIds.includes(media._id.toString()));
};

export const getChildMediaIds = (medias, itemId) =>
  medias.reduce((acc, m) => {
    if (
      (m.parent_show && areIdsEqual(m.parent_show, itemId)) ||
      (m.parent_season && areIdsEqual(m.parent_season, itemId))
    ) {
      acc.push(m.id.toString());
    }
    return acc;
  }, []);
