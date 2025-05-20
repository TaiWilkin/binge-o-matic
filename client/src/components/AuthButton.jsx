import React from "react";
import { Mutation } from "react-apollo";
import { withRouter } from "react-router-dom";

import mutation from "../mutations/Logout";

function AuthButton({ client, user, loading, history }) {
  if (user) {
    return (
      <Mutation
        mutation={mutation}
        onCompleted={() => {
          client.resetStore();
          history.push("/");
        }}
      >
        {(logout) => (
          <li className="right">
            <button type="button" onClick={logout}>
              Logout
            </button>
          </li>
        )}
      </Mutation>
    );
  }
  if (loading) {
    return (
      <li className="right">
        <button type="button">
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

export default withRouter(AuthButton);
