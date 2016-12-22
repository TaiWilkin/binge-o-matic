import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import UserList from './user-list';
import SearchList from './search-list';
import Search from './search';
import ListSelect from './list-select';
import NewList from './new-list';

class Bingeomatic extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="bingomatic">
        <h1>Binge-o-matic</h1>
        <Search />
        <ListSelect />
        <NewList />
        <div className="lists">
          <SearchList />
          <UserList />
        </div>
        <div className="footer">
          <div className="tmdbLogo"><img src="https://www.themoviedb.org/assets/23e473036b28a59bd5dcfde9c671b1c5/images/v4/logos/312x276-primary-green.png" />This product uses the TMDb API but is not endorsed or certified by TMDb.</div>
          <p>Searchbars inspired by Zohar Yzgeav on CodePen.</p>
        </div>
      </div>
    )
  }
}

export default connect()(Bingeomatic);
