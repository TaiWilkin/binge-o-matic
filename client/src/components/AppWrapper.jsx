import "../css/AppWrapper.css";

import React from "react";

import BrightEye from "../assets/bright-eye.png";
import TMDB from "../assets/tmdb.svg";
import Nav from "./Nav";

export default function AppWrapper({ children }) {
  return (
    <div>
      <div className="wrapper">
        <header>
          <h1>
            Binge-
            <img className="eye" src={BrightEye} alt="o" />
            -matic
          </h1>
        </header>
        <Nav />
        {children}
      </div>
      <div className="push" />
      <footer className="footer">
        <img src={TMDB} alt="tmdb" />
        This product uses the TMDB API but is not endorsed or certified by TMDB.
        <p>
          Icon made by <a href="http://www.freepik.com/">Freepik</a> from{" "}
          <a href="http://www.flaticon.com/">www.flaticon.com</a> is licensed by{" "}
          <a href="http://creativecommons.org/licenses/by/3.0/">CC 3.0 BY</a>
        </p>
      </footer>
    </div>
  );
}
