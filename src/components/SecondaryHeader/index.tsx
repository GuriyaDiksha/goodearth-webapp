import React from "react";
import cs from "classnames";
import styles from "./styles.scss";
import bootstrap from "styles/bootstrap/bootstrap-grid.scss";

const SecondaryHeader: React.FC = ({ children }) => {
  return (
    <div className={cs(styles.secondaryHeaderContainer, bootstrap.row)}>
      {children}
    </div>
  );
};

export default SecondaryHeader;
