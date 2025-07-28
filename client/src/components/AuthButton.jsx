import { useMutation } from "@apollo/client";
import React from "react";
import { useNavigate } from "react-router-dom";

import mutation from "../mutations/Logout";

function AuthButton({ client, user, loading }) {
  const navigate = useNavigate();

  const [logout, { loading: mutationLoading }] = useMutation(mutation, {
    onCompleted: () => {
      client.resetStore();
      navigate("/");
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
          <span className="sr-only">Loading</span>
        </button>
      </li>
    );
  }

  return (
    <li className="right">
      <button type="button" onClick={() => navigate("/signin")}>
        Login
      </button>
    </li>
  );
}

export default AuthButton;
