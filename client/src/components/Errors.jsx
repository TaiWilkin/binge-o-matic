import React from "react";

function Errors({ error }) {
  if (error && error.graphQLErrors) {
    return (
      <div className="errors">
        {error.graphQLErrors
          .map((e) => e.message)
          .map((e) => (
            <p key={e} className="error-small">
              {e}
            </p>
          ))}
      </div>
    );
  }
  return null;
}

export default Errors;
