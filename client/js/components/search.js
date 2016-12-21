import React from 'react';
import {connect} from 'react-redux';

import * as actions from '../actions';

export class Search extends React.Component {
  constructor(props) {
    super(props);
    this.searchMovies = this.searchMovies.bind(this);
  }

  searchMovies(e) {
    e.preventDefault();
    const movieName = this.movieNameInput.value;
    this.props.dispatch(actions.searchMovies(movieName));
    setTimeout(() => this.movieNameInput.value = "", 750);
    console.log("now searching for", movieName);
  }

  render() {
    return (
      <form className="search" onSubmit={this.searchMovies}>
        <label>
        Search for Movies/Shows:
        <input className="searchbar" type="text" ref={ref => this.movieNameInput = ref} />
        </label>
        <button className="submit" type="button" onClick={this.searchMovies}>
          Search
        </button>
      </form>
    );
  }
}


export default connect()(Search);
