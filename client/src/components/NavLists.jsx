import React from "react";
import { useNavigate } from "react-router-dom";

function NavLists({ lists, title }) {
  const navigate = useNavigate();
  if (!lists?.length) return null;
  const options = lists.map((list) => (
    <button
      type="button"
      onClick={() => navigate(`/lists/${list.id}`)}
      key={list.id}
      className="dropdown-btn"
    >
      {list.name}
    </button>
  ));
  return (
    <li className="dropdown">
      <button type="button" className="dropbtn">
        {title}
      </button>
      <div className="dropdown-content">{options}</div>
    </li>
  );
}

export default NavLists;
