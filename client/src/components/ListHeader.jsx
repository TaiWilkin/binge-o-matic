import React from "react";
import { Link } from "react-router-dom";

function ListHeader({ name }) {
  return (
    <div className="header">
      <div className="subheader">
        <h2>{name}</h2>
        <Link to="/newlist" className="list-header-link">
          CREATE LIST
        </Link>
      </div>
      <div className="header-subtitle">
        <p>This is a user-managed list and may not be complete.</p>
      </div>
    </div>
  );
}

export default ListHeader;
