import React, { Component } from 'react';
import AuthForm from './AuthForm';
import { withRouter } from 'react-router-dom';
import { Mutation } from "react-apollo";
import mutation from '../mutations/Login';
import query from '../queries/CurrentUser';

class LoginForm extends Component {
  render() {
    return (
      <Mutation
        mutation={mutation}
        refetchQueries={[{ query }]}
        onCompleted={() => this.props.history.push('/')}
      >
        {(login, { loading, error }) => (
          <div>
            <AuthForm
              title="Sign in"
              onSubmit={login}
              error={error}
            />
          </div>
        )}
      </Mutation>
    )
  }
}

export default withRouter(LoginForm);
