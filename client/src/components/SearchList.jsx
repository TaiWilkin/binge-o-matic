import "../css/WatchList.css";

import React, { useState } from "react";
import { useParams } from "react-router-dom";

import listQuery from "../queries/List";
import mediaQuery from "../queries/Media";
import CardActions from "./CardActions";
import ContentWrapper from "./ContentWrapper";
import Loading from "./Loading";
import QueryHandler from "./QueryHandler";
import requireAuth from "./requireAuth";
import SearchMedia from "./SearchMedia";

function SearchList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);

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
      return <Loading />;
    }
    if (media === null) {
      return <p>No items found.</p>;
    }
    if (media.length === 0) {
      return null;
    }

    const filteredMovies =
      filter === "all"
        ? media
        : media.filter((movie) => movie.media_type === filter);

    return filteredMovies.map((movie) => (
      <SearchMedia key={movie.id} {...movie} />
    ));
  };

  return (
    <QueryHandler query={listQuery} variables={{ id }}>
      {({ data, loading: listLoading, error, client }) => {
        if (listLoading || !data.list) return null;
        if (error) return `Error!: ${error.message}`;

        return (
          <ContentWrapper
            title={`Adding items to ${data.list.name}`}
            link={`/lists/${data.list.id}`}
            linkText="RETURN TO LIST"
          >
            <form className="search" onSubmit={(e) => onSubmit(e, client)}>
              <input
                type="text"
                placeholder="Search for shows or movies"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="btn-primary">
                Search
              </button>
            </form>
            <CardActions>
              <button type="button" onClick={() => setFilter("movie")}>
                MOVIES
              </button>
              <button type="button" onClick={() => setFilter("tv")}>
                TV
              </button>
              <button type="button" onClick={() => setFilter("all")}>
                ALL
              </button>
            </CardActions>
            <ul className="watchlist searchlist">{renderMovies()}</ul>
          </ContentWrapper>
        );
      }}
    </QueryHandler>
  );
}

export default requireAuth(SearchList);
