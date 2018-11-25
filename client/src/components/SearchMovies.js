import React from 'react';
import { withRouter } from 'react-router-dom';
import QueryHandler from './QueryHandler';
import listQuery from '../queries/List';
import mediaQuery from '../queries/Media';
import SearchMovie from './SearchMovie';

export class SearchMovies extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: '',
      filter: 'all',
      media: [],
      loading: false,
    }
    this.onSubmit = this.onSubmit.bind(this);
    this.select = this.select.bind(this);
  }

  onSubmit(e, client) {
    e.preventDefault();
    this.setState({ loading: true });
    client.query({
      query: mediaQuery,
      variables: { searchQuery: this.state.searchQuery }
    }).then(response => {
      this.setState({ searchQuery: '', loading: false, media: response.data.media });
    });
  }

  select(filter) {
    this.setState({ filter });
  }

  renderMovies() {
    if (this.state.loading) {
      return <div className="spinner" />;
    }
    if (this.state.media.length === 0) {
      return null;
    }
    let movies;
    if (this.state.filter === 'all') {
      movies = this.state.media.map(movie => (
        <SearchMovie
          key={movie.id}
          {...movie}
        />
      ));
    } else {
      movies = this.state.media.map(movie => {
        if (movie.media_type !== this.props.filter) {
          return null;
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
      <QueryHandler query={listQuery} variables={{ id: this.props.match.params.id }}>
        {({ data, loading, error, client }) => {
            if (loading || !data.list) return null;
            if (error) return `Error!: ${error}`;
            return (
              <main>
                <div className="subheader">
                  <h2>Adding items to {data.list.name}</h2>
                  <button className="edit-btn" onClick={() => this.props.history.push(`/lists/${data.list.id}`)}>
                    RETURN TO LIST
                  </button>
                  <form className="search">
                    <input
                      type="text"
                      placeholder="Search for shows or movies"
                      value={this.state.searchQuery}
                      onChange={(e) => { this.setState({ searchQuery: e.target.value }); }}
                    />
                    <button onClick={e => this.onSubmit(e, client)}>Search</button>
                  </form>
                  <div className="card-actions">
                    <button onClick={() => this.select('movie')}>MOVIES</button>
                    <button onClick={() => this.select('tv')}>TV</button>
                    <button onClick={() => this.select('all')}>ALL</button>
                  </div>
                  </div>
                  <ul className="watchlist searchlist">
                    {this.renderMovies()}
                  </ul>
              </main>
            );
          }}
        </QueryHandler>
    );
  }
}

export default withRouter(SearchMovies);
