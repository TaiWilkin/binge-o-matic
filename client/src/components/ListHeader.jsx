import React from "react";
import { Link } from "react-router-dom";

function ListHeader({ name }) {
  return (
    <div className="header">
      <div
        className="header-info"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>{name}</h2>
        <p>This is a user-managed list and may not be complete.</p>
      </div>
      <Link to="/newlist" className="edit-link">
        CREATE LIST
      </Link>
    </div>
  );
}

export default ListHeader;
