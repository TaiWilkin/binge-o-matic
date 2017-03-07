import React, { Component } from 'react';
import { connect } from 'react-redux';
import UserList from './user-list';
import SearchList from './search-list';
import Search from './search';
import ListSelect from './list-select';
import NewList from './new-list';
import Directions from './Directions';
import * as actions from '../actions';

class Bingeomatic extends Component {
  render() {
    let lists = 'lists';
    let searchBar = '';
    let selectors = 'hidden';
    let guide = <div />;
    if (this.props.list === 1) {
      lists = 'lists hidden';
      searchBar = 'hidden';
      selectors = '';
      guide = <Directions />
    }
    return (
      <div className="bingomatic">
        <div className="searches">
          <h1>Binge-<img className="eye" src="../assets/bright-eye.png" alt="o" />-matic</h1>
          <div className={searchBar}>
              <Search />
          </div>
          <div className={selectors}>
            <ListSelect />
            <NewList />
          </div>
          {guide}
        </div>
        <div className={lists}>
          <SearchList />
          <UserList />
        </div>
        <div className="footer">
          <div className="tmdbLogo"><img src="https://www.themoviedb.org/assets/23e473036b28a59bd5dcfde9c671b1c5/images/v4/logos/312x276-primary-green.png" alt="poster" />This product uses the TMDb API but is not endorsed or certified by TMDb.</div>
          <p>Searchbars inspired by Zohar Yzgeav on CodePen.</p>
          <div>Icons made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="http://www.flaticon.com" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank" rel="noopener noreferrer">CC 3.0 BY</a></div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ list }) => {
  return { list };
};

export default connect(mapStateToProps)(Bingeomatic);
