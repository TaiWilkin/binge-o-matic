import React, { Component } from "react";
import { Query } from "react-apollo";

import Errors from "./Errors";
import Loading from "./Loading";

class QueryHandler extends Component {
  render() {
    const { useCustomLoader, children } = this.props;
    return (
      <Query {...this.props}>
        {(queryResults) => {
          const { error, loading } = queryResults;
          if (loading && !useCustomLoader) {
            return <Loading />;
          }
          if (error) {
            return <Errors error={error} />;
          }
          return children(queryResults);
        }}
      </Query>
    );
  }
}

export default QueryHandler;
