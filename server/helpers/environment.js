export const isProduction = () => process.env.NODE_ENV === "production";

export const logError = (message) => {
  if (!isProduction()) {
    console.error(message); // eslint-disable-line no-console
  }
};

export const logInfo = (message) => {
  if (!isProduction()) {
    console.log(message); // eslint-disable-line no-console
  }
};
