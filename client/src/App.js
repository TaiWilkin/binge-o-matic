import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom'
import Root from './components/Root';
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import './index.css';

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
