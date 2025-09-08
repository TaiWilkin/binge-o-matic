import path from "path";

export default (filepath) => `mock-${path.basename(filepath)}`;
