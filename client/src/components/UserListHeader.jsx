import React from "react";

function UserListHeader({ push, onToggleWatched, hideWatched, id, name }) {
  return (
    <div className="header">
      <h2>{name}</h2>
      <button type="button" className="edit-btn" onClick={onToggleWatched}>
        {hideWatched ? "SHOW WATCHED" : "HIDE WATCHED"}
      </button>
      <button
        type="button"
        className="edit-btn"
        onClick={() => push(`/lists/${id}/edit`)}
      >
        EDIT LIST
      </button>
      <button
        type="button"
        className="edit-btn"
        onClick={() => push(`/lists/${id}/search`)}
      >
        ADD ITEMS
      </button>
    </div>
  );
}

export default UserListHeader;
