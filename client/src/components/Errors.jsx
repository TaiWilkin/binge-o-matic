import React from "react";

function Errors({ error }) {
  if (error && error.graphQLErrors) {
    return (
      <div className="errors">
        {error.graphQLErrors
          .map((error) => error.message)
          .map((error) => (
            <p key={error} className="error-small">
              {error}
            </p>
          ))}
      </div>
    );
  }
  return null;
}

export default Errors;
