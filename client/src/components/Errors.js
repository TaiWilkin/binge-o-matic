import React from "react";

function Errors({ error, classes }) {
  if (error && error.graphQLErrors) {
    return (
      <div className="errors">
        {error.graphQLErrors
          .map(error => error.message)
          .map(error => (
            <p variant="body2" key={error} className="error-small">
              {error}
            </p>
          ))}
      </div>
    );
  } else {
    return null;
  }
}

export default Errors;
