import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';

import CheeseList from './components/cheese-list';
import cheeseReducer from './reducers/cheese.js';


console.log(`Client running in ${process.env.NODE_ENV} mode`);

const store = createStore(cheeseReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(), applyMiddleware(thunk));

ReactDOM.render(
  <Provider store={store}>
    <CheeseList />
  </Provider>,
  document.getElementById('app')
);


export default store;
