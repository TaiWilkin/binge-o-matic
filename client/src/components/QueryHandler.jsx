import React from "react";
import { useQuery } from "@apollo/client";

import Errors from "./Errors";
import Loading from "./Loading";

function QueryHandler({ useCustomLoader, children, ...queryProps }) {
  const { loading, error, data, client, refetch, ...rest } = useQuery(
    queryProps.query,
    {
      variables: queryProps.variables,
      fetchPolicy: queryProps.fetchPolicy,
    },
  );

  if (loading && !useCustomLoader) {
    return <Loading />;
  }

  if (error) {
    return <Errors error={error} />;
  }

  return children({ loading, error, data, client, refetch, ...rest });
}

export default QueryHandler;
