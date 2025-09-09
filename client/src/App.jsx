import "./index.css";

import { ApolloClient, ApolloProvider, createHttpLink } from "@apollo/client";
import React from "react";
import { BrowserRouter } from "react-router-dom";

import cache from "./cache";
import Root from "./components/Root";

const httpLink = createHttpLink({
  uri: "/graphql",
  credentials: "include",
});

const client = new ApolloClient({
  link: httpLink,
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
