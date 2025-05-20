import React from "react";
import { Mutation } from "react-apollo";
import { withRouter } from "react-router-dom";

import mutation from "../mutations/Login";
import query from "../queries/CurrentUser";
import AuthForm from "./AuthForm";

function SigninForm({ history }) {
  return (
    <Mutation
      mutation={mutation}
      refetchQueries={[{ query }]}
      onCompleted={() => history.push("/")}
    >
      {(login, { error }) => (
        <div>
          <AuthForm title="Sign in" onSubmit={login} error={error} />
        </div>
      )}
    </Mutation>
  );
}

export default withRouter(SigninForm);
