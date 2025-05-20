import React from "react";
import { Query } from "react-apollo";
import { Redirect, withRouter } from "react-router-dom";

import currentUserQuery from "../queries/CurrentUser";
import Errors from "./Errors";

export default (WrappedComponent) => {
  function RequireAuth(props) {
    return (
      <Query query={currentUserQuery}>
        {({ loading, error, data }) => {
          if (loading) {
            return <p>Loading...</p>;
          }
          if (error) {
            return <Errors error={error} />;
          }
          if (!data.user) {
            return <Redirect to="/signin" />;
          }
          return <WrappedComponent user={data.user} {...props} />;
        }}
      </Query>
    );
  }

  return withRouter(RequireAuth);
};
