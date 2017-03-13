import React, { Component } from 'react';
import { connect } from 'react-redux';
import UserList from './user-list';
import SearchList from './search-list';
import Search from './search';
import NewList from './new-list';
import Directions from './Directions';
import Nav from './Nav';
import SampleList from './SampleList';
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
        <header>
          <h1>Binge-<img className="eye" src="../assets/bright-eye.png" alt="o" />-matic</h1>
        </header>
        <Nav />
        <SampleList />
        <footer>
           <img src="https://www.themoviedb.org/assets/23e473036b28a59bd5dcfde9c671b1c5/images/v4/logos/312x276-primary-green.png" alt="poster" />This product uses the TMDb API but is not endorsed or certified by TMDb.
        </footer>
      </div>
    );
  }
}

const mapStateToProps = ({ list }) => {
  return { list };
};

export default connect(mapStateToProps)(Bingeomatic);
