import React, { Component } from 'react';
import { Query } from 'react-apollo';
import Errors from './Errors';
import Loading from './Loading';

class QueryHandler extends Component {
  render() {
    return (
      <Query {...this.props}>
        {(queryResults) => {
          const { error, loading } = queryResults;
          if (loading) { return <Loading />; }
          if (error) {
            console.error(error)
            return <Errors error={error} />;
          }
          return this.props.children(queryResults);
        }}
      </Query>
    );
  }
}

export default QueryHandler;
