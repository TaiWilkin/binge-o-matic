import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import listQuery from "../queries/List";
import mediaQuery from "../queries/Media";
import QueryHandler from "./QueryHandler";
import SearchMovie from "./SearchMovie";

function SearchMovies() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  const onSubmit = (e, client) => {
    e.preventDefault();
    setLoading(true);
    client
      .query({
        query: mediaQuery,
        variables: { searchQuery },
      })
      .then((response) => {
        setSearchQuery("");
        setLoading(false);
        setMedia(response.data.media);
      });
  };

  const renderMovies = () => {
    if (loading) {
      return <div className="spinner" />;
    }
    if (media.length === 0) {
      return null;
    }

    const filteredMovies =
      filter === "all"
        ? media
        : media.filter((movie) => movie.media_type === filter);

    return filteredMovies.map((movie) => (
      <SearchMovie key={movie.id} {...movie} />
    ));
  };

  return (
    <QueryHandler query={listQuery} variables={{ id }}>
      {({ data, loading: listLoading, error, client }) => {
        if (listLoading || !data.list) return null;
        if (error) return `Error!: ${error.message}`;

        return (
          <main>
            <div className="subheader">
              <h2>Adding items to {data.list.name}</h2>
              <button
                type="button"
                className="edit-btn"
                onClick={() => navigate(`/lists/${data.list.id}`)}
              >
                RETURN TO LIST
              </button>
              <form className="search" onSubmit={(e) => onSubmit(e, client)}>
                <input
                  type="text"
                  placeholder="Search for shows or movies"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit">Search</button>
              </form>
              <div className="card-actions">
                <button type="button" onClick={() => setFilter("movie")}>
                  MOVIES
                </button>
                <button type="button" onClick={() => setFilter("tv")}>
                  TV
                </button>
                <button type="button" onClick={() => setFilter("all")}>
                  ALL
                </button>
              </div>
            </div>
            <ul className="watchlist searchlist">{renderMovies()}</ul>
          </main>
        );
      }}
    </QueryHandler>
  );
}

export default SearchMovies;
