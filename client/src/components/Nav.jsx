import React from "react";
import { Link } from "react-router-dom";

import query from "../queries/Nav";
import AuthButton from "./AuthButton";
import NavLists from "./NavLists";
import QueryHandler from "./QueryHandler";

function Nav() {
  return (
    <QueryHandler query={query} pollInterval={500} useCustomLoader>
      {({ data, client, loading }) => (
        <nav>
          <ul className="nav">
            <li>
              <Link to="/about">About</Link>
            </li>
            {data?.lists && (
              <NavLists lists={data.lists} title="User-Managed Lists" />
            )}
            {!!data?.user && (
              <NavLists lists={data.user.lists} title="My Lists" />
            )}
            {!!data?.user && (
              <li>
                <Link to="/newlist" className="right">
                  New List
                </Link>
              </li>
            )}
            <AuthButton user={data?.user} client={client} loading={loading} />
          </ul>
        </nav>
      )}
    </QueryHandler>
  );
}

export default Nav;
