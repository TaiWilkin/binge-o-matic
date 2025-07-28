import React from "react";
import { useMutation } from "@apollo/client";
import { useHistory } from "react-router-dom";

import mutation from "../mutations/Logout";

function AuthButton({ client, user, loading }) {
  const history = useHistory();

  // Set up the mutation hook
  const [logout, { loading: mutationLoading }] = useMutation(mutation, {
    onCompleted: () => {
      client.resetStore();
      history.push("/");
    },
  });

  if (user) {
    return (
      <li className="right">
        <button type="button" onClick={() => logout()}>
          {mutationLoading ? <div className="spinner" /> : "Logout"}
        </button>
      </li>
    );
  }

  if (loading) {
    return (
      <li className="right">
        <button type="button" disabled>
          <div className="spinner" />
        </button>
      </li>
    );
  }

  return (
    <li className="right">
      <button type="button" onClick={() => history.push("/signin")}>
        Login
      </button>
    </li>
  );
}

export default AuthButton;
