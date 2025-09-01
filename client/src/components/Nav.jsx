import React from "react";
import { Link } from "react-router-dom";

import query from "../queries/Nav";
import AuthButton from "./AuthButton";
import NavLists from "./NavLists";
import QueryHandler from "./QueryHandler";

function Nav() {
  return (
    <>
      <nav>
        <ul className="nav">
          <li>
            <Link to="/about">About</Link>
          </li>
          <QueryHandler query={query} pollInterval={500} useCustomLoader>
            {({ data, client, loading }) =>
              data?.user ? (
                <>
                  <NavLists userId={data?.user?.id} title="Lists" excludeUser />
                  <NavLists userId={data?.user?.id} title="My Lists" />
                  <li>
                    <Link to="/newlist" className="right">
                      New List
                    </Link>
                  </li>
                  <AuthButton
                    user={data.user}
                    client={client}
                    loading={loading}
                  />
                </>
              ) : (
                <>
                  <NavLists title="Lists" excludeUser />
                  <AuthButton client={client} loading={loading} />
                </>
              )
            }
          </QueryHandler>
        </ul>
      </nav>
    </>
  );
}

export default Nav;
