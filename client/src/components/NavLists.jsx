import React from "react";
import { Link } from "react-router-dom";

function NavLists({ lists, title }) {
  if (!lists?.length) return null;
  const options = lists.map((list) => (
    <Link to={`/lists/${list.id}`} key={list.id} className="dropdown-btn">
      {list.name}
    </Link>
  ));
  return (
    <li className="dropdown">
      <Link to="#" className="dropbtn">
        {title}
      </Link>
      <div className="dropdown-content">{options}</div>
    </li>
  );
}

export default NavLists;
