import React from "react";
import { useQuery } from "@apollo/client";
import { Redirect, withRouter } from "react-router-dom";

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
      return <Redirect to="/signin" />;
    }

    return <WrappedComponent user={data.user} {...props} />;
  }

  return withRouter(RequireAuth);
};
