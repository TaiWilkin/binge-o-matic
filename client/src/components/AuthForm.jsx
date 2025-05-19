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
    this.props.onSubmit({ variables: this.state });
  }

  onChange(type, e) {
    const text = e.target.value;
    this.setState({ [type]: text, error: "" });
  }

  renderButton() {
    if (this.state.loading) {
      return <div className="spinner" />;
    }
    return (
      <button className="standalone-btn" type="submit" onClick={this.onSubmit}>
        {this.props.title}
      </button>
    );
  }

  render() {
    const { error, title } = this.props;

    return (
      <main>
        <div className="subheader">
          <h2>{title}</h2>
          <button
            className="edit-btn"
            onClick={() => this.props.history.push("/")}
          >
            Cancel
          </button>
          <h3 className="error">{this.state.error}</h3>
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
                value={this.state.email}
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
                value={this.state.password}
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
