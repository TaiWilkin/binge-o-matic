import { useMutation } from "@apollo/client";
import React from "react";

import HideChildren from "../components/HideChildren";
import addEpisodesMutation from "../mutations/AddEpisodes";
import listQuery from "../queries/List";

function ToggleEpisodes({
  listId,
  id,
  mediaType,
  showChildren,
  number,
  parentShow,
}) {
  const [addEpisodes] = useMutation(addEpisodesMutation, {
    refetchQueries: [{ query: listQuery, variables: { id: listId } }],
  });

  if (mediaType !== "season") return null;

  if (showChildren) {
    return <HideChildren text="HIDE EPISODES" listId={listId} id={id} />;
  }

  return (
    <button
      type="button"
      onClick={() =>
        addEpisodes({
          variables: {
            id,
            season_number: number,
            list: listId,
            show_id: parentShow,
          },
        })
      }
    >
      ADD EPISODES
    </button>
  );
}

export default ToggleEpisodes;
