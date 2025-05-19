import React, { Component } from "react";
import { Mutation } from "react-apollo";
import { withRouter } from "react-router-dom";

import mutation from "../mutations/Login";
import query from "../queries/CurrentUser";
import AuthForm from "./AuthForm";

class LoginForm extends Component {
  render() {
    return (
      <Mutation
        mutation={mutation}
        refetchQueries={[{ query }]}
        onCompleted={() => this.props.history.push("/")}
      >
        {(login, { error }) => (
          <div>
            <AuthForm title="Sign in" onSubmit={login} error={error} />
          </div>
        )}
      </Mutation>
    );
  }
}

export default withRouter(LoginForm);
