import React from "react";
import cs from "classnames";
import styles from "./styles.scss";
import bootstrap from "styles/bootstrap/bootstrap-grid.scss";
import { SubheaderProps } from "./typings";
import { useSelector } from "react-redux";
import { AppState } from "reducers/typings";

const SecondaryHeader: React.FC<SubheaderProps> = ({ children, classname }) => {
  const { showTimer } = useSelector((state: AppState) => state.info);
  return (
    <div
      className={cs(
        styles.secondaryHeaderContainer,
        { [styles.secondaryHeaderContainerTimer]: showTimer },
        bootstrap.row,
        classname
      )}
    >
      {children}
    </div>
  );
};

export default SecondaryHeader;
