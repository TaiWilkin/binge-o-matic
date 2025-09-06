import "./index.css";

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import React from "react";
import { BrowserRouter } from "react-router-dom";

import Root from "./components/Root";

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        list: {
          keyArgs: ["id"],
          read(existing, { args, toReference }) {
            return (
              existing ||
              toReference({
                __typename: "ListType",
                id: args?.id,
              })
            );
          },
        },
      },
    },
    ListType: {
      keyFields: ["id"],
      fields: {
        media: {
          keyArgs: false,
          merge(existing = [], incoming = []) {
            const merged = [...existing];
            incoming.forEach((item) => {
              if (!merged.some((ref) => ref.__ref === item.__ref)) {
                merged.push(item);
              }
            });
            return merged;
          },
        },
      },
    },
  },
});

const client = new ApolloClient({
  uri: "/graphql",
  credentials: "include",
  cache,
});

function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Root />
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
