import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import SearchMovie from './search-movie';

class SearchList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const movies = this.props.searchMovies.map(movie => (
      <SearchMovie
        key={movie.id}
        {...movie}
        isOnUserList={this.props.userMovies.findIndex(userMovie =>
          userMovie.id === movie.id) >= 0
        }
      />
    ));

    return (
      <div className="searchList">
        <h2>Search Results</h2>
        <ul>
          {movies}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  searchMovies: state.searchMovies,
  userMovies: state.userMovies
});

export default connect(mapStateToProps)(SearchList);
