import { useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import deleteListMutation from "../mutations/DeleteList";
import editListMutation from "../mutations/EditList";
import listQuery from "../queries/List";

function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [text, setText] = useState("");

  const { loading, error, data, client } = useQuery(listQuery, {
    variables: { id },
  });

  const [editList] = useMutation(editListMutation, {
    refetchQueries: [{ query: listQuery, variables: { id } }],
    onCompleted: () => navigate(`/lists/${id}`),
  });

  const [deleteList] = useMutation(deleteListMutation, {
    onCompleted: () => {
      client.resetStore();
      navigate("/");
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error.message}</p>;

  if (!data.list) {
    return <p style={{ color: "red" }}>Error: List not found!</p>;
  }

  const isOwner =
    data.user && data.list.user.toString() === data.user.id.toString();

  if (!isOwner) {
    return <p style={{ color: "red" }}>Error: Unauthorized</p>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    editList({ variables: { id, name: text } });
  };

  const handleDelete = () => {
    deleteList({ variables: { id } });
  };

  return (
    <main>
      <div className="subheader">
        <h2>Editing {data.list.name}</h2>
        <button
          type="button"
          className="right"
          onClick={() => navigate(`/lists/${id}`)}
        >
          RETURN TO LIST
        </button>

        <h3 className="simple-header">Change Title</h3>
        <form className="search" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter new title"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button type="submit">SUBMIT</button>
        </form>

        <h3 className="simple-header">Delete List</h3>
        <button type="button" className="standalone-btn" onClick={handleDelete}>
          DELETE
        </button>
      </div>
    </main>
  );
}

export default Edit;
