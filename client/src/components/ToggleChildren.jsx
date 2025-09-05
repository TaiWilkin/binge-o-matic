import React from "react";

import ToggleEpisodes from "./ToggleEpisodes";
import ToggleSeasons from "./ToggleSeasons";

function ToggleChildren({
  listId,
  id,
  mediaType,
  mediaId,
  showChildren,
  number,
  parentShow,
}) {
  if (mediaType === "tv") {
    return (
      <ToggleSeasons
        listId={listId}
        id={id}
        mediaType={mediaType}
        mediaId={mediaId}
        showChildren={showChildren}
      />
    );
  }

  if (mediaType === "season") {
    return (
      <ToggleEpisodes
        listId={listId}
        id={id}
        mediaType={mediaType}
        showChildren={showChildren}
        number={number}
        parentShow={parentShow}
      />
    );
  }

  return null;
}

export default ToggleChildren;
