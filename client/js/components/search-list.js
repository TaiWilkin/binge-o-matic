import React, { Component } from 'react';
import { connect } from 'react-redux';
import SearchMovie from './search-movie';

class SearchList extends Component {
  render() {
    let content;
    if (this.props.searchMovies.length === 0) {
      content = (
        <div>
        <h2>How to use the Binge-o-Matic:</h2>
        <p>This website will allow you to create a list for multiple movies and shows.</p>
        <p>If you have fallen behind in a <a href="http://i.annihil.us/u/prod/marvel/i/mg/5/40/4fbaad4f8d5ea.jpg">complex cinematic universe</a>,
            the Binge-o-Matic will help you catch up while still watching in release-date order,
            including in cases where two or more shows in the 'verse' were running concurrently.</p>
        <ol className="directions">
          <li>1. Select or create a list in which to store your list of movies.</li>
          <li>2. Search for the movie or television show you want to add.</li>
          <li>3. Add the movie or show to your list.
            They will be automatically sorted by release date!
          </li>
          <li>4. If you want to see the order for individual seasons or even episodes,
              click "add seasons" or "add episodes".
          </li>
        </ol>
        </div>
        );
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
