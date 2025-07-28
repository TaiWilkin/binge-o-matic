import { useQuery } from "@apollo/client";
import React from "react";
import { Navigate } from "react-router-dom";

import currentUserQuery from "../queries/CurrentUser";
import Errors from "./Errors";

export default (WrappedComponent) => {
  function RequireAuth(props) {
    const { loading, error, data } = useQuery(currentUserQuery);

    if (loading) {
      return <p>Loading...</p>;
    }

    if (error) {
      return <Errors error={error} />;
    }

    if (!data?.user) {
      return <Navigate to="/signin" />;
    }

    return <WrappedComponent user={data.user} {...props} />;
  }

  return RequireAuth;
};
