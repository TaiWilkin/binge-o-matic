import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import mutation from "../mutations/CreateList";
import query from "../queries/Nav";
import Errors from "./Errors";

function NewList() {
  const [name, setName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const [createList, { error }] = useMutation(mutation, {
    refetchQueries: [{ query }],
    onCompleted: (data) => {
      if (data && data.createList) {
        navigate(`/lists/${data.createList.id}`);
      }
    },
  });

  const onChange = (e) => {
    setName(e.target.value);
    setErrorMsg("");
  };

  const addList = (e) => {
    e.preventDefault();
    if (name.includes("/")) {
      setErrorMsg("Invalid character: /");
      setName("");
      return;
    }
    createList({ variables: { name } });
  };

  return (
    <main>
      <div className="subheader">
        <h2>New List</h2>
        <button
          type="button"
          className="edit-btn"
          onClick={() => navigate("/")}
        >
          CANCEL
        </button>
        <h3>Choose Title</h3>
        <h3 className="error">{errorMsg}</h3>
        <form className="search" onSubmit={addList}>
          <input
            type="text"
            placeholder="Star Trek"
            value={name}
            required
            onChange={onChange}
          />
          <Errors error={error} />
          <button type="submit">CREATE</button>
        </form>
      </div>
    </main>
  );
}

export default NewList;
