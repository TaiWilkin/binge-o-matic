import React, { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import listQuery from "../queries/List";
import ListHeader from "./ListHeader";
import QueryHandler from "./QueryHandler";
import UserListHeader from "./UserListHeader";
import UserMovie from "./UserMovie";

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
  const navigate = useNavigate(); // get navigation function
  const [hideWatched, setHideWatched] = useState(true);

  const renderMovies = (media, isOwner) => {
    const filteredMedia = hideWatched
      ? media.filter((movie) => !movie.isWatched)
      : media;
    const hideChildrenOf = calculateHiddenChildren(media, hideWatched);
    return filteredMedia.map((movie) => (
      <UserMovie
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
        push={navigate}
        onToggleWatched={() => setHideWatched((prev) => !prev)}
        hideWatched={hideWatched}
        id={id}
        name={list.name}
      />
    ) : (
      <ListHeader name={list.name} push={navigate} />
    );
  };

  return (
    <QueryHandler query={listQuery} variables={{ id }}>
      {({ data }) => {
        if (!data.list) {
          return <p style={{ color: "red" }}> Error: List not found!</p>;
        }
        const isOwner =
          data.user && data.list.user.toString() === data.user.id.toString();
        if (!data.list.media || !data.list.media.length) {
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
              {renderMovies(data.list.media, isOwner)}
            </ul>
          </main>
        );
      }}
    </QueryHandler>
  );
}

export default UserList;
