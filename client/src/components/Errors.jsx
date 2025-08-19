import React from "react";

function Errors({ error }) {
  if (error && error.graphQLErrors) {
    return (
      <div className="errors">
        {error.graphQLErrors.map(({ message }, i) => (
          <p key={`${message}-${i}`} className="error-small">
            {message}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export default Errors;
