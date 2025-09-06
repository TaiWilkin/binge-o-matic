import "./index.css";

import { ApolloClient, ApolloProvider } from "@apollo/client";
import React from "react";
import { BrowserRouter } from "react-router-dom";

import cache from "./cache";
import Root from "./components/Root";

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
