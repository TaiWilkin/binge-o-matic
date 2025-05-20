import React from "react";
import { Mutation } from "react-apollo";
import { withRouter } from "react-router-dom";

import mutation from "../mutations/Signup";
import query from "../queries/CurrentUser";
import AuthForm from "./AuthForm";

function LoginForm({ history }) {
  return (
    <Mutation
      mutation={mutation}
      refetchQueries={[{ query }]}
      onCompleted={() => history.push("/")}
    >
      {(login, { error }) => (
        <div>
          <AuthForm onSubmit={login} title="Sign up" error={error} />
        </div>
      )}
    </Mutation>
  );
}

export default withRouter(LoginForm);
