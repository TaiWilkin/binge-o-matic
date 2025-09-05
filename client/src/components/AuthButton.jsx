import { useMutation } from "@apollo/client";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

import mutation from "../mutations/Logout";
import Loading from "./Loading";

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
        <button type="button" className="btn-nav" onClick={() => logout()}>
          {mutationLoading ? <Loading /> : "Logout"}
        </button>
      </li>
    );
  }

  if (loading) {
    return (
      <li className="right">
        <button type="button" className="btn-nav" disabled>
          <Loading />
          <span className="sr-only">Loading</span>
        </button>
      </li>
    );
  }

  return (
    <li className="right">
      <Link to="/signin" className="btn-nav">
        Login
      </Link>
    </li>
  );
}

export default AuthButton;
