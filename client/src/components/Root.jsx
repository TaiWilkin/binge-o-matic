import React from "react";
import { Route, Routes } from "react-router-dom";

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
      <Routes>
        <Route exact path="/" element={<About />} />
        <Route exact path="/signin" element={<SigninForm />} />
        <Route exact path="/signup" element={<SignupForm />} />
        <Route exact path="/about" element={<About />} />
        <Route exact path="/newlist" element={requireAuth(<NewList />)} />
        <Route exact path="/lists/:id/edit" element={requireAuth(<Edit />)} />
        <Route
          exact
          path="/lists/:id/search"
          element={requireAuth(<SearchMovies />)}
        />
        <Route exact path="/lists/:id" element={<UserList />} />
        <Route render={() => <p>Page not found</p>} />
      </Routes>
    </AppWrapper>
  );
}

export default Root;
