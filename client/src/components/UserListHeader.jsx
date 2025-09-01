import React from "react";
import { Link } from "react-router-dom";

function UserListHeader({ onToggleWatched, hideWatched, id, name }) {
  return (
    <div className="header">
      <h2>{name}</h2>
      <div>
        <button type="button" onClick={onToggleWatched}>
          {hideWatched ? "SHOW WATCHED" : "HIDE WATCHED"}
        </button>
        <Link to={`/lists/${id}/edit`} className="list-header-link">
          EDIT LIST
        </Link>
        <Link to={`/lists/${id}/search`} className="list-header-link">
          ADD ITEMS
        </Link>
      </div>
    </div>
  );
}

export default UserListHeader;
