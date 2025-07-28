import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Errors from "./Errors";

function AuthForm({ error, title, onSubmit }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [stateError, setStateError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setStateError("");

    onSubmit({ variables: { email, password } })
      .catch((err) => {
        setStateError(err.message || "Submission failed");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <main>
      <div className="subheader">
        <h2>{title}</h2>
        <button
          type="button"
          className="edit-btn"
          onClick={() => navigate("/")}
        >
          Cancel
        </button>
        <h3 className="error">{stateError}</h3>
        <Link to={title === "Sign in" ? "signup" : "signin"}>
          {title === "Sign in" ? "Sign up" : "Sign in"}
        </Link>
        <form className="login" onSubmit={handleSubmit}>
          <label htmlFor="email">
            Email
            <input
              id="email"
              type="text"
              placeholder="John_Doe@example.com"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label htmlFor="password">
            Password
            <input
              id="password"
              type="password"
              placeholder="password123"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <Errors error={error} />
          <button className="standalone-btn" type="submit" disabled={loading}>
            {loading ? <div className="spinner" /> : title}
          </button>
        </form>
      </div>
    </main>
  );
}

export default AuthForm;
