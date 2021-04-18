import React from "react";

const ListHeader = ({ name, push }) => (
  <div className="header">
    <div
      className="header-info"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      <h2>{name}</h2>
      <p>This is a user-managed list and may not be complete.</p>
    </div>
    <button className="edit-btn" onClick={() => push("/newlist")}>
      CREATE LIST
    </button>
  </div>
);

export default ListHeader;
