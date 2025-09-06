import { useMutation } from "@apollo/client";
import React from "react";

import addSeasonsMutation from "../mutations/AddSeasons";
import listQuery from "../queries/List";
import HideChildren from "./HideChildren";

function ToggleSeasons({ listId, id, mediaType, mediaId, showChildren }) {
  const [addSeasons] = useMutation(addSeasonsMutation, {
    refetchQueries: [{ query: listQuery, variables: { id: listId } }],
  });

  if (mediaType !== "tv") return null;

  if (showChildren) {
    return <HideChildren text="HIDE SEASONS" listId={listId} id={id} />;
  }

  return (
    <button
      type="button"
      onClick={() =>
        addSeasons({ variables: { id, media_id: mediaId, list: listId } })
      }
    >
      ADD SEASONS
    </button>
  );
}

export default ToggleSeasons;
