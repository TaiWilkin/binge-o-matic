import React from "react";
import { Route, Switch } from "react-router-dom";

import About from "./About";
import AppWrapper from "./AppWrapper";
import Edit from "./Edit";
import NewList from "./NewList";
import requireAuth from "./requireAuth";
import SearchMovies from "./SearchMovies";
import SigninForm from "./SigninForm";
import SignupForm from "./SignupForm";
import UserList from "./UserList";

function Root() {
  return (
    <AppWrapper>
      <Switch>
        <Route exact path="/" component={About} />
        <Route exact path="/signin" component={SigninForm} />
        <Route exact path="/signup" component={SignupForm} />
        <Route exact path="/about" component={About} />
        <Route exact path="/newlist" component={requireAuth(NewList)} />
        <Route exact path="/lists/:id/edit" component={requireAuth(Edit)} />
        <Route exact path="/lists/:id" component={UserList} />
        <Route
          exact
          path="/lists/:id/search"
          component={requireAuth(SearchMovies)}
        />
      </Switch>
    </AppWrapper>
  );
}

export default Root;
