import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import AppWrapper from "./AppWrapper";

// Lazy load pages
const About = lazy(() => import("./About"));
const SigninForm = lazy(() => import("./SigninForm"));
const SignupForm = lazy(() => import("./SignupForm"));
const NewList = lazy(() => import("./NewList"));
const Edit = lazy(() => import("./Edit"));
const SearchMovies = lazy(() => import("./SearchMovies"));
const UserList = lazy(() => import("./UserList"));

function Root() {
  return (
    <AppWrapper>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<About />} />
          <Route path="/signin" element={<SigninForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/about" element={<About />} />
          <Route path="/newlist" element={<NewList />} />
          <Route path="/lists/:id/edit" element={<Edit />} />
          <Route path="/lists/:id/search" element={<SearchMovies />} />
          <Route path="/lists/:id" element={<UserList />} />
          <Route path="*" element={<p>Page not found</p>} />
        </Routes>
      </Suspense>
    </AppWrapper>
  );
}

export default Root;
