import React from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase';

import * as actions from '../actions';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: '',
      loading: false
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    const { email, password } = this.state;
    this.setState({ error: '', loading: true });

    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(this.onLoginSuccess.bind(this))
    .catch((err) => {
      console.log(err);
      firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(this.onLoginSuccess.bind(this))
      .catch((err) => {
        console.log(err);
        this.setState({ error: err.message, email: '', password: '', loading: false });
      });
    });
  }

  onLoginSuccess() {
    this.setState({ error: '', loading: false, email: '', password: '' });
  }

  onChange(type, e) {
    const text = e.target.value;
    this.setState({ [type]: text, error: '' });
  }

  renderButton() {
    if (this.state.loading) {
      return <div className="spinner" />;
    }
    return <button className="standalone-btn" type="submit">Login/Signup</button>;
  }

  render() {
    return (
      <main>
        <div>
          <h2>Login</h2>
          <button className="right">Cancel</button>
        </div>
        <h3 className="error">{this.state.error}</h3>
        <form className="login" onSubmit={(e) => this.handleSubmit(e)}>
          <label>Email
            <input
              type="text"
              placeholder="John_Doe@example.com"
              value={this.state.email}
              required
              onChange={(e) => this.onChange('email', e)}
            />
          </label>
          <label>Password
            <input
              type="password"
              placeholder="password123"
              value={this.state.password}
              onChange={(e) => this.onChange('password', e)}
              required
            />
          </label>
          {this.renderButton()}
        </form>
      </main>
    );
  }
}

export default connect()(Login);
