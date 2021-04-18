import React from "react";

const UserListHeader = ({ push, onToggleWatched, hideWatched, id, name }) => (
  <div className="header">
    <h2>{name}</h2>
    <button className="edit-btn" onClick={onToggleWatched}>
      {hideWatched ? "SHOW WATCHED" : "HIDE WATCHED"}
    </button>
    <button className="edit-btn" onClick={() => push(`/lists/${id}/edit`)}>
      EDIT LIST
    </button>
    <button className="edit-btn" onClick={() => push(`/lists/${id}/search`)}>
      ADD ITEMS
    </button>
  </div>
);

export default UserListHeader;
