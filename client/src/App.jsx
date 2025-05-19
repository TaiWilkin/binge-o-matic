import "./index.css";

import ApolloClient from "apollo-boost";
import React, { Component } from "react";
import { ApolloProvider } from "react-apollo";
import { BrowserRouter } from "react-router-dom";

import Root from "./components/Root";

const client = new ApolloClient({});

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <BrowserRouter>
          <Root />
        </BrowserRouter>
      </ApolloProvider>
    );
  }
}

export default App;
