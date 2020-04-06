import React, { memo } from "react";

import "./styles.css";

const Loader: React.FC = memo(() => {
  return (
    <div className="cssload-container full-load-wrap">
      <span className="cssload-loading">
        <i></i>
        <i></i>
        <i></i>
        <i></i>
      </span>
    </div>
  );
});

export default Loader;
