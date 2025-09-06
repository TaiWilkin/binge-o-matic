import "../css/Media.css";

import React from "react";
import { useParams } from "react-router-dom";

import CardActions from "./CardActions";
import DeleteMedia from "./DeleteMedia";
import MediaImage from "./MediaImage";
import ToggleChildren from "./ToggleChildren";
import ToggleWatched from "./ToggleWatched";

function UserMedia(props) {
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

  if (
    hideChildrenOf.includes(parent_show) ||
    hideChildrenOf.includes(parent_season)
  ) {
    return null;
  }

  if (media_type === "season" && (number == null || number === 0)) {
    return null;
  }

  const img = <MediaImage mediaType={media_type} posterPath={poster_path} />;

  let details = "";
  if (media_type === "season" && number) {
    details = `Season ${number}`;
  } else if (media_type === "episode") {
    details = `Episode ${number}: ${episode}`;
  }

  const classes = isWatched
    ? `media ${media_type} watched`
    : `media ${media_type}`;

  return (
    <li id={id} className={classes}>
      <div className="circle" />
      {img}
      <h2>{title}</h2>
      <p>{details}</p>
      <p>{release_date}</p>
      <CardActions>
        <DeleteMedia isOwner={isOwner} mediaId={media_id} listId={listId} />
        <ToggleChildren
          mediaType={media_type}
          showChildren={show_children}
          listId={listId}
          id={id}
          mediaId={media_id}
          number={number}
          parentShow={parent_show}
        />
        <ToggleWatched
          isOwner={isOwner}
          isWatched={isWatched}
          id={id}
          listId={listId}
        />
      </CardActions>
    </li>
  );
}

export default UserMedia;
