import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import Errors from "./Errors";

class AuthForm extends Component {
  constructor(props) {
    super(props);

    this.state = { email: "", password: "" };
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    const { onSubmit } = this.props;
    onSubmit({ variables: this.state });
  }

  onChange(type, e) {
    const text = e.target.value;
    this.setState({ [type]: text, error: "" });
  }

  renderButton() {
    const { loading } = this.state;
    const { title } = this.props;
    if (loading) {
      return <div className="spinner" />;
    }
    return (
      <button className="standalone-btn" type="submit" onClick={this.onSubmit}>
        {title}
      </button>
    );
  }

  render() {
    const { error, title, history } = this.props;
    const { error: stateError, email, password } = this.state;
    return (
      <main>
        <div className="subheader">
          <h2>{title}</h2>
          <button
            type="button"
            className="edit-btn"
            onClick={() => history.push("/")}
          >
            Cancel
          </button>
          <h3 className="error">{stateError}</h3>
          <Link to={title === "Sign in" ? "signup" : "signin"}>
            {title === "Sign in" ? "Sign up" : "Sign in"}
          </Link>
          <form className="login">
            <label htmlFor="email">
              Email
              <input
                id="email"
                type="text"
                placeholder="John_Doe@example.com"
                value={email}
                required
                onChange={(e) => this.onChange("email", e)}
              />
            </label>
            <label htmlFor="password">
              Password
              <input
                id="password"
                type="password"
                placeholder="password123"
                value={password}
                onChange={(e) => this.onChange("password", e)}
                required
              />
            </label>
            <Errors error={error} />
            {this.renderButton()}
          </form>
        </div>
      </main>
    );
  }
}

export default withRouter(AuthForm);
