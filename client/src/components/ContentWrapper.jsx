import "../css/ContentWrapper.css";

import React from "react";
import { Link } from "react-router-dom";

function ContentWrapper({ title, link, linkText, children }) {
  return (
    <main>
      <div className="subcontent">
        <div className="subheader">
          <h2>{title}</h2>
          <Link to={link}>{linkText}</Link>
        </div>
        {children}
      </div>
    </main>
  );
}

export default ContentWrapper;
