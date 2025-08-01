import React from "react";
import { useNavigate } from "react-router-dom";

import query from "../queries/Nav";
import AuthButton from "./AuthButton";
import NavLists from "./NavLists";
import QueryHandler from "./QueryHandler";

function Nav() {
  const navigate = useNavigate();
  return (
    <QueryHandler query={query} pollInterval={500} useCustomLoader>
      {({ data, client, loading }) => (
        <nav>
          <ul className="nav">
            <li>
              <button type="button" onClick={() => navigate("/about")}>
                About
              </button>
            </li>
            {data?.lists && (
              <NavLists lists={data.lists} title="User-Managed Lists" />
            )}
            {!!data?.user && (
              <NavLists lists={data.user.lists} title="My Lists" />
            )}
            {!!data?.user && (
              <li>
                <button type="button" onClick={() => navigate("/newlist")}>
                  New List
                </button>
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
