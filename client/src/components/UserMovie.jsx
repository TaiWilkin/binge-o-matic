import { useMutation } from "@apollo/client";
import React from "react";
import { useParams } from "react-router-dom";

import addEpisodesMutation from "../mutations/AddEpisodes";
import addSeasonsMutation from "../mutations/AddSeasons";
import hideChildrenMutation from "../mutations/HideChildren";
import deleteListItemMutation from "../mutations/RemoveFromList";
import toggleWatchedMutation from "../mutations/ToggleWatched";
import listQuery from "../queries/List";

function UserMovie(props) {
  const { id: listId } = useParams(); // get list id from route params
  const {
    isOwner,
    isWatched,
    id,
    media_type,
    media_id,
    show_children,
    number,
    parent_show,
    parent_season,
    title,
    poster_path,
    episode,
    release_date,
    hideChildrenOf,
  } = props;

  // Define hooks for each mutation with refetchQueries as needed
  const [toggleWatched] = useMutation(toggleWatchedMutation, {
    refetchQueries: [{ query: listQuery, variables: { id: listId } }],
  });

  const [deleteListItem] = useMutation(deleteListItemMutation, {
    refetchQueries: [{ query: listQuery, variables: { id: listId } }],
  });

  const [addSeasons] = useMutation(addSeasonsMutation, {
    refetchQueries: [{ query: listQuery, variables: { id: listId } }],
  });

  const [addEpisodes] = useMutation(addEpisodesMutation, {
    refetchQueries: [{ query: listQuery, variables: { id: listId } }],
  });

  const [hideChildren] = useMutation(hideChildrenMutation, {
    refetchQueries: [{ query: listQuery, variables: { id: listId } }],
  });

  if (
    hideChildrenOf.includes(parent_show) ||
    hideChildrenOf.includes(parent_season)
  ) {
    return null;
  }

  if (media_type === "season" && (!number || number === 0)) {
    return null;
  }

  const renderWatched = () => {
    if (!isOwner) return null;
    return (
      <button
        type="button"
        className="drop"
        onClick={() =>
          toggleWatched({
            variables: { id, isWatched: !isWatched, list: listId },
          })
        }
      >
        {isWatched ? "MARK AS UNWATCHED" : "MARK AS WATCHED"}
      </button>
    );
  };

  const renderDeleteButton = () => {
    if (!isOwner) return null;
    return (
      <button
        type="button"
        className="drop"
        onClick={() =>
          deleteListItem({ variables: { id: media_id, list: listId } })
        }
      >
        DELETE
      </button>
    );
  };

  const renderAddSeasons = () => {
    if (show_children) {
      return renderHideChildren("HIDE SEASONS");
    }
    return (
      <button
        type="button"
        className="drop"
        onClick={() =>
          addSeasons({ variables: { id, media_id, list: listId } })
        }
      >
        ADD SEASONS
      </button>
    );
  };

  const renderAddEpisodes = () => {
    if (show_children) {
      return renderHideChildren("HIDE EPISODES");
    }
    return (
      <button
        type="button"
        className="drop"
        onClick={() =>
          addEpisodes({
            variables: {
              id,
              season_number: number,
              list: listId,
              show_id: parent_show,
            },
          })
        }
      >
        ADD EPISODES
      </button>
    );
  };

  const renderHideChildren = (text) => (
    <button
      type="button"
      className="drop"
      onClick={() => hideChildren({ variables: { id, list: listId } })}
    >
      {text}
    </button>
  );

  const renderButtons = () => {
    const watchedBtn = renderWatched();
    const deleteBtn = renderDeleteButton();

    switch (media_type) {
      case "movie":
        return (
          <div className="card-actions">
            <button type="button" className="options">
              OPTIONS
            </button>
            {deleteBtn}
            {watchedBtn}
          </div>
        );
      case "tv":
        return (
          <div className="card-actions">
            <button type="button" className="options">
              OPTIONS
            </button>
            {deleteBtn}
            {renderAddSeasons()}
            {watchedBtn}
          </div>
        );
      case "season":
        return (
          <div className="card-actions">
            <button type="button" className="options">
              OPTIONS
            </button>
            {deleteBtn}
            {renderAddEpisodes()}
            {watchedBtn}
          </div>
        );
      case "episode":
        return (
          <div className="card-actions">
            <button type="button" className="options">
              OPTIONS
            </button>
            {deleteBtn}
            {watchedBtn}
          </div>
        );
      default:
        return (
          <div className="card-actions">
            <button type="button" className="options">
              OPTIONS
            </button>
            {deleteBtn}
            {watchedBtn}
          </div>
        );
    }
  };

  const img = poster_path ? (
    <img
      src={`https://image.tmdb.org/t/p/${media_type === "episode" ? "w185" : "w92"}${poster_path}`}
      alt="poster"
    />
  ) : (
    <div className="no-image" />
  );

  let details = "";
  if (media_type === "season" && number) {
    details = `Season ${number}`;
  } else if (media_type === "episode") {
    details = `Episode ${number}: ${episode}`;
  }

  const classes = isWatched ? `${media_type} watched` : media_type;

  return (
    <li id={id} className={classes}>
      <div className="circle" />
      {img}
      <h2>{title}</h2>
      <p>{details}</p>
      <p>{release_date}</p>
      {renderButtons()}
    </li>
  );
}

export default UserMovie;
