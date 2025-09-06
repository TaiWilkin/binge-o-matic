import "../css/Media.css";

import { useMutation, useQuery } from "@apollo/client";
import React from "react";
import { useParams } from "react-router-dom";

import addToListMutation from "../mutations/AddToList";
import removeFromListMutation from "../mutations/RemoveFromList";
import listQuery from "../queries/List";
import CardActions from "./CardActions";

function SearchMedia(props) {
  const { id, title, release_date, poster_path, media_type } = props;
  const params = useParams();
  // Query to fetch the list
  const { data, loading, error } = useQuery(listQuery, {
    variables: { id: params.id },
  });

  // Mutations to add or remove from list
  const [addToList] = useMutation(addToListMutation, {
    refetchQueries: [{ query: listQuery, variables: { id: params.id } }],
  });

  const [removeFromList] = useMutation(removeFromListMutation, {
    refetchQueries: [{ query: listQuery, variables: { id: params.id } }],
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading list.</p>;

  // Check if movie is already on the list
  const onList = data?.list?.media?.some((movie) => movie.media_id === id);

  const renderButtons = () => {
    if (!onList) {
      return (
        <CardActions>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              addToList({
                variables: {
                  id,
                  title,
                  release_date,
                  poster_path,
                  media_type,
                  list: params.id,
                },
              });
            }}
          >
            Add to List
          </button>
        </CardActions>
      );
    }

    return (
      <CardActions>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            removeFromList({
              variables: { id, list: params.id },
            });
          }}
        >
          Remove from List
        </button>
      </CardActions>
    );
  };

  const renderImage = () => {
    if (!poster_path) {
      return <div className="no-image" />;
    }
    return (
      <img src={`https://image.tmdb.org/t/p/w92${poster_path}`} alt="poster" />
    );
  };

  return (
    <li id={id} className={onList ? "onList media" : "media"}>
      {renderImage()}
      <h2>{title}</h2>
      <p>{release_date}</p>
      {renderButtons()}
    </li>
  );
}

export default SearchMedia;
