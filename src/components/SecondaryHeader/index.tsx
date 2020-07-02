import React from "react";
import cs from "classnames";
import styles from "./styles.scss";
import bootstrap from "styles/bootstrap/bootstrap-grid.scss";
import { SubheaderProps } from "./typings";

const SecondaryHeader: React.FC<SubheaderProps> = ({ children, classname }) => {
  return (
    <div
      className={cs(styles.secondaryHeaderContainer, bootstrap.row, classname)}
    >
      {children}
    </div>
  );
};

export default SecondaryHeader;
