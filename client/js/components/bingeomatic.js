import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/cheese';
import UserList from './user-list';
import SearchList from './search-list';
import Search from './search';

class Bingeomatic extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="bingomatic">
        <h1>Binge-o-matic</h1>
        <Search />
        <SearchList />
        <UserList />
      </div>
    )
  }
}

export default connect()(Bingeomatic);
