import "../css/WatchList.css";

import { useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Navigate, useParams } from "react-router-dom";

import listQuery from "../queries/List";
import Errors from "./Errors";
import ListHeader from "./ListHeader";
import UserListHeader from "./UserListHeader";
import UserMedia from "./UserMedia";

const calculateHiddenChildren = (media, hideWatched) => {
  let parentsWithHiddenChildren = media.filter((movie) => !movie.show_children);
  if (hideWatched) {
    parentsWithHiddenChildren = parentsWithHiddenChildren.filter(
      (movie) => movie.isWatched,
    );
  }
  return parentsWithHiddenChildren.map((movie) => movie.id);
};

function UserList() {
  const { id } = useParams(); // get list ID from URL
  const [hideWatched, setHideWatched] = useState(true);

  const { loading, error, data } = useQuery(listQuery, {
    variables: { id },
    fetchPolicy: "cache-and-network",
    returnPartialData: true,
  });

  if (error) {
    return <Errors error={error} />;
  }

  const renderMovies = (media, isOwner) => {
    const filteredList = hideWatched
      ? media.filter((movie) => !movie.isWatched)
      : media;
    const hideChildrenOf = calculateHiddenChildren(media, hideWatched);
    return filteredList.map((movie) => (
      <UserMedia
        key={movie.id}
        isOwner={isOwner}
        {...movie}
        hideChildrenOf={hideChildrenOf}
      />
    ));
  };

  const renderHeader = (list, isOwner) => {
    return isOwner ? (
      <UserListHeader
        onToggleWatched={() => setHideWatched((prev) => !prev)}
        hideWatched={hideWatched}
        id={id}
        name={list.name}
      />
    ) : (
      <ListHeader name={list.name} />
    );
  };

  if (!data.list) {
    return <p style={{ color: "red" }}> Error: List not found!</p>;
  }

  const isOwner =
    data.user && data.list.user.toString() === data.user.id.toString();
  if ((!data.list.media || !data.list.media.length) && !loading) {
    if (!isOwner) {
      return (
        <main>
          {renderHeader(data.list, isOwner)}
          <p>No content in list</p>
        </main>
      );
    }
    return <Navigate to={`/lists/${data.list.id}/search`} />;
  }
  return (
    <main>
      {renderHeader(data.list, isOwner)}
      <ul className="watchlist">
        {renderMovies(data.list.media || [], isOwner)}
      </ul>
    </main>
  );
}

export default UserList;
