import { useMutation } from "@apollo/client";
import React from "react";

import toggleWatchedMutation from "../mutations/ToggleWatched";
import listQuery from "../queries/List";

function ToggleWatched({ isOwner, isWatched, id, listId }) {
  const [toggleWatched] = useMutation(toggleWatchedMutation, {
    refetchQueries: [{ query: listQuery, variables: { id: listId } }],
  });

  if (!isOwner) return null;
  return (
    <button
      type="button"
      onClick={() =>
        toggleWatched({
          variables: { id, isWatched: !isWatched, list: listId },
        })
      }
    >
      {isWatched ? "MARK AS UNWATCHED" : "MARK AS WATCHED"}
    </button>
  );
}

export default ToggleWatched;
