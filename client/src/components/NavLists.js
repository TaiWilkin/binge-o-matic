import React from "react";
import { withRouter } from "react-router-dom";

const NavLists = ({ lists, history, title }) => {
  if (!lists.length) return null;
  const options = lists.map(list => (
    <button
      onClick={() => history.push(`/lists/${list.id}`)}
      key={list.id}
      className="dropdown-btn"
    >
      {list.name}
    </button>
  ));
  return (
    <li className="dropdown">
      <button className="dropbtn">{title}</button>
      <div className="dropdown-content">{options}</div>
    </li>
  );
};

export default withRouter(NavLists);
