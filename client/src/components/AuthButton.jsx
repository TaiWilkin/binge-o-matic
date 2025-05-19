import React from "react";
import { Mutation } from "react-apollo";
import { withRouter } from "react-router-dom";

import mutation from "../mutations/Logout";

class AuthButton extends React.Component {
  render() {
    const { client, user, loading } = this.props;
    if (user) {
      return (
        <Mutation
          mutation={mutation}
          onCompleted={() => {
            client.resetStore();
            this.props.history.push("/");
          }}
        >
          {(logout) => (
            <li className="right">
              <button onClick={logout}>Logout</button>
            </li>
          )}
        </Mutation>
      );
    }
    if (loading) {
      return (
        <li className="right">
          <button>
            <div className="spinner" />
          </button>
        </li>
      );
    }
    return (
      <li className="right">
        <button onClick={() => this.props.history.push("/signin")}>
          Login
        </button>
      </li>
    );
  }
}

export default withRouter(AuthButton);
