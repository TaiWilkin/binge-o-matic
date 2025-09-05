import { useMutation } from "@apollo/client";
import React from "react";

import hideChildrenMutation from "../mutations/HideChildren";
import listQuery from "../queries/List";

function HideChildren({ listId, id, text }) {
  const [hideChildren] = useMutation(hideChildrenMutation, {
    refetchQueries: [{ query: listQuery, variables: { id: listId } }],
  });

  return (
    <button
      type="button"
      onClick={() => hideChildren({ variables: { id, list: listId } })}
    >
      {text}
    </button>
  );
}

export default HideChildren;
