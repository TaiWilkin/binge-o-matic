import React, { Component } from "react";
import { Mutation } from "react-apollo";
import { withRouter } from "react-router-dom";

import mutation from "../mutations/Signup";
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
        {(login, { loading, error }) => (
          <div>
            <AuthForm onSubmit={login} title="Sign up" error={error} />
          </div>
        )}
      </Mutation>
    );
  }
}

export default withRouter(LoginForm);
