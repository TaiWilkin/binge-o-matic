import React from "react";

function MediaImage({ mediaType, posterPath }) {
  const width = mediaType === "episode" ? "185" : "92";
  const className =
    mediaType === "episode" ? "media-img episode-img" : "media-img";

  if (posterPath) {
    return (
      <img
        src={`https://image.tmdb.org/t/p/w${width}${posterPath}`}
        alt="poster"
        className={className}
      />
    );
  }

  return <div className={`no-image ${className}`} />;
}

export default MediaImage;
