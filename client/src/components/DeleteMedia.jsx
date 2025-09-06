import { useMutation } from "@apollo/client";
import React from "react";

import deleteListItemMutation from "../mutations/RemoveFromList";
import listQuery from "../queries/List";

function DeleteMedia({ isOwner, mediaId, listId }) {
  const [deleteListItem] = useMutation(deleteListItemMutation, {
    refetchQueries: [{ query: listQuery, variables: { id: listId } }],
  });

  if (!isOwner) return null;
  return (
    <button
      type="button"
      onClick={() =>
        deleteListItem({ variables: { id: mediaId, list: listId } })
      }
    >
      DELETE
    </button>
  );
}

export default DeleteMedia;
