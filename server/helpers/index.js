// Database helpers
export { areIdsEqual, convertToObjectId } from "./database.js";

// Media helpers
export {
  compareMedia,
  filterOutDuplicateItems,
  getChildMediaIds,
  MediaTypeEnum,
  mediaTypes,
} from "./media.js";

export const isProduction = () => process.env.NODE_ENV === "production";
export const isTest = () => process.env.NODE_ENV === "test";
