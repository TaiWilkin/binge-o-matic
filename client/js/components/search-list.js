import React, { Component } from 'react';
import { connect } from 'react-redux';
import SearchMovie from './search-movie';
import Steps from './Steps';

class SearchList extends Component {
  render() {
    let content;
    if (this.props.searchMovies.length === 0) {
      content = <Steps />;
    } else {
      const movies = this.props.searchMovies.map(movie => (
        <SearchMovie
          key={movie.id}
          {...movie}
          isOnUserList={this.props.userMovies.findIndex(userMovie =>
            userMovie.id === movie.id) >= 0
          }
        />
      ));
      content = (
            <div>
              <h2>Search Results</h2>
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
  userMovies: state.userMovies
});

export default connect(mapStateToProps)(SearchList);
