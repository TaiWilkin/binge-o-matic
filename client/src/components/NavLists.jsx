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
      <button className="btn-nav">{title}</button>
      <div className="dropdown-content">
        {loading && <span className="btn-nav">Loading...</span>}
        {error && (
          <span className="btn-nav" style={{ color: "red" }}>
            Error loading lists
          </span>
        )}
        {data?.lists
          ?.filter((list) => {
            if (excludeUser) return list.user !== userId;
            return list.user === userId;
          })
          .map((list) => (
            <Link to={`/lists/${list.id}`} key={list.id} className="btn-nav">
              {list.name}
            </Link>
          ))}
      </div>
    </li>
  );
}

export default NavLists;
