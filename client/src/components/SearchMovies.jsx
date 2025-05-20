import React from "react";
import { withRouter } from "react-router-dom";

import listQuery from "../queries/List";
import mediaQuery from "../queries/Media";
import QueryHandler from "./QueryHandler";
import SearchMovie from "./SearchMovie";

class SearchMovies extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: "",
      filter: "all",
      media: [],
      loading: false,
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.select = this.select.bind(this);
  }

  onSubmit(e, client) {
    e.preventDefault();
    const { searchQuery } = this.state;

    this.setState({ loading: true });
    return client
      .query({
        query: mediaQuery,
        variables: { searchQuery },
      })
      .then((response) => {
        this.setState({
          searchQuery: "",
          loading: false,
          media: response.data.media,
        });
      });
  }

  select(filter) {
    this.setState({ filter });
  }

  renderMovies() {
    const { loading, media, filter } = this.state;
    if (loading) {
      return <div className="spinner" />;
    }
    if (media.length === 0) {
      return null;
    }
    let movies;
    if (filter === "all") {
      movies = media.map((movie) => <SearchMovie key={movie.id} {...movie} />);
    } else {
      movies = media.map((movie) => {
        if (movie.media_type !== filter) {
          return null;
        }
        return <SearchMovie key={movie.id} {...movie} />;
      });
    }
    return movies;
  }

  render() {
    const { match, history } = this.props;
    const { searchQuery } = this.state;
    return (
      <QueryHandler query={listQuery} variables={{ id: match.params.id }}>
        {({ data, loading, error, client }) => {
          if (loading || !data.list) return null;
          if (error) return `Error!: ${error}`;
          return (
            <main>
              <div className="subheader">
                <h2>
                  Adding items to
                  {data.list.name}
                </h2>
                <button
                  type="button"
                  className="edit-btn"
                  onClick={() => history.push(`/lists/${data.list.id}`)}
                >
                  RETURN TO LIST
                </button>
                <form className="search">
                  <input
                    type="text"
                    placeholder="Search for shows or movies"
                    value={searchQuery}
                    onChange={(e) => {
                      this.setState({ searchQuery: e.target.value });
                    }}
                  />
                  <button
                    type="button"
                    onClick={(e) => this.onSubmit(e, client)}
                  >
                    Search
                  </button>
                </form>
                <div className="card-actions">
                  <button type="button" onClick={() => this.select("movie")}>
                    MOVIES
                  </button>
                  <button type="button" onClick={() => this.select("tv")}>
                    TV
                  </button>
                  <button type="button" onClick={() => this.select("all")}>
                    ALL
                  </button>
                </div>
              </div>
              <ul className="watchlist searchlist">{this.renderMovies()}</ul>
            </main>
          );
        }}
      </QueryHandler>
    );
  }
}

export default withRouter(SearchMovies);
