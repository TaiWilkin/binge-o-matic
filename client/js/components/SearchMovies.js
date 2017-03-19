import React from 'react';
import { connect } from 'react-redux';
import SearchMovie from './SearchMovie';

import * as actions from '../actions';

export class SearchMovies extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: ''
    }
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit() {
    const { query } = this.state;
    this.props.dispatch(actions.searchMovies(query));
    this.setState({ query: '' });
  }

  selectMovies() {
    this.props.dispatch(actions.filterSearch('movie'));
  }

  selectTV() {
    this.props.dispatch(actions.filterSearch('tv'));
  }

  selectAll() {
    this.props.dispatch(actions.filterSearch('all'));
  }

  renderMovies() {
    if (this.props.loading) {
      return <div className="spinner" />;
    }
    if (this.props.searchMovies.length === 0) {
      return null;
    }
    let movies;
    if (this.props.filter === 'all') {
      movies = this.props.searchMovies.map(movie => (
        <SearchMovie
          key={movie.id}
          {...movie}
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
          />
        );
      }
    );
  }
  return movies;
}

  render() {
    return (
      <main>
        <div className="subheader">
          <h2>Adding items to {this.props.listName}</h2>
          <button className="edit-btn" onClick={() => this.props.dispatch(actions.setPage('home'))}>
            RETURN TO LIST
          </button>
          <form className="search" onSubmit={e => { e.preventDefault(); this.onSubmit(); }}>
            <input
              type="text"
              placeholder="Search for shows or movies"
              value={this.state.query}
              onChange={(e) => { this.setState({ query: e.target.value }); }}
            />
            <button type="submit">Search</button>
          </form>
          <div className="card-actions">
            <button onClick={this.selectMovies.bind(this)}>MOVIES</button>
            <button onClick={this.selectTV.bind(this)}>TV</button>
            <button onClick={this.selectAll.bind(this)}>ALL</button>
          </div>
          </div>
          <ul className="watchlist searchlist">
            {this.renderMovies()}
          </ul>
      </main>
    );
  }
}

const mapStateToProps = ({ loggedIn, searchMovies, filter, listName, loading }) => ({
  loggedIn,
  searchMovies,
  filter,
  listName,
  loading
});

export default connect(mapStateToProps)(SearchMovies);
