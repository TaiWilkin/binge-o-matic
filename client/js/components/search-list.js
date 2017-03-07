import React, { Component } from 'react';
import { connect } from 'react-redux';
import SearchMovie from './search-movie';
import Steps from './Steps';
import * as actions from '../actions';

class SearchList extends Component {
  selectMovies() {
    this.props.dispatch(actions.filterSearch('movie'));
  }

  selectTV() {
    this.props.dispatch(actions.filterSearch('tv'));
  }

  selectAll() {
    this.props.dispatch(actions.filterSearch('all'));
  }

  render() {
    let content;
    if (this.props.searchMovies.length === 0) {
      content = <Steps />;
    } else {
      let movies;
      if (this.props.filter === 'all') {
        movies = this.props.searchMovies.map(movie => (
          <SearchMovie
            key={movie.id}
            {...movie}
            isOnUserList={this.props.userMovies.findIndex(userMovie =>
              userMovie.id === movie.id) >= 0
            }
          />
        ));
      } else {
        movies = this.props.searchMovies.map(movie => {
          if (movie.media_type !== this.props.filter) {
            return <div />;
          }
          return (
            <SearchMovie
              key={movie.id}
              {...movie}
              isOnUserList={this.props.userMovies.findIndex(userMovie =>
                userMovie.id === movie.id) >= 0
              }
            />
          );
        }
      );
    }

      content = (
            <div>
              <h2>Search Results</h2>
              <div className="filter">
                <button onClick={this.selectMovies.bind(this)}>Show Movies</button>
                <button onClick={this.selectTV.bind(this)}>Show TV</button>
                <button onClick={this.selectAll.bind(this)}>Show All</button>
              </div>
              <ul>
                {movies}
              </ul>
            </div>
              );
    }

    return (
      <div className="searchList">
        {content}
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  searchMovies: state.searchMovies,
  userMovies: state.userMovies,
  filter: state.filter,
});

export default connect(mapStateToProps)(SearchList);
