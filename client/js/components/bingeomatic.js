import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
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
        <div className="lists">
          <SearchList />
          <UserList />
        </div>
        <div className="tmdbLogo"><img src="https://www.themoviedb.org/assets/23e473036b28a59bd5dcfde9c671b1c5/images/v4/logos/312x276-primary-green.png" />This product uses the TMDb API but is not endorsed or certified by TMDb.</div>
      </div>
    )
  }
}

export default connect()(Bingeomatic);
