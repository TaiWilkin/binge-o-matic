import "./index.css";

import React from "react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { BrowserRouter } from "react-router-dom";

import Root from "./components/Root";

const client = new ApolloClient({
  uri: "/graphql",
  credentials: "include",
  cache: new InMemoryCache(), // Apollo Client v3 requires an explicit cache
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
