import React, { Component } from "react";
import { Query } from "react-apollo";
import { withRouter, Redirect } from "react-router-dom";
import currentUserQuery from "../queries/CurrentUser";
import Errors from "./Errors";

export default WrappedComponent => {
  class RequireAuth extends Component {
    render() {
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
            return <WrappedComponent user={data.user} {...this.props} />;
          }}
        </Query>
      );
    }
  }

  return withRouter(RequireAuth);
};
