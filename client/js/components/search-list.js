import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import SearchMovie from './search-movie';

class SearchList extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log('did mount');
    this.props.dispatch(actions.searchMovies());
  }

  render() {
    const movies = this.props.searchMovies.map((movie, index) => (
      <SearchMovie key={index} id={movie.id} img={movie.poster_path} title={movie.title} date={movie.release_date} />
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
  searchMovies: state.searchMovies
});

export default connect(mapStateToProps)(SearchList);
