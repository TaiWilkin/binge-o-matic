import { useLazyQuery } from "@apollo/client";
import React from "react";
import { Link } from "react-router-dom";

import query from "../queries/Lists";

function NavLists({ title, userId, excludeUser }) {
  const [loadLists, { called, loading, data, error }] = useLazyQuery(query);
  return (
    <li
      className="dropdown"
      onMouseEnter={() => {
        if (!called) loadLists(); // only fetch the first time
      }}
    >
      <button className="dropbtn">{title}</button>
      <div className="dropdown-content">
        {loading && <span className="dropdown-btn dropbtn">Loading...</span>}
        {error && (
          <span className="dropdown-btn dropbtn" style={{ color: "red" }}>
            Error loading lists
          </span>
        )}
        {data?.lists
          ?.filter((list) => {
            if (excludeUser) return list.user !== userId;
            return list.user === userId;
          })
          .map((list) => (
            <Link
              to={`/lists/${list.id}`}
              key={list.id}
              className="dropdown-btn"
            >
              {list.name}
            </Link>
          ))}
      </div>
    </li>
  );
}

export default NavLists;
