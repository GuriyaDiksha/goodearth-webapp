import React, { memo } from "react";
import cs from "classnames";

import styles from "./styles.scss";

const Loader: React.FC = memo(() => {
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  return (
    <div
      className={cs(styles.cssloadContainer, styles.fullLoadWrap)}
      onClickCapture={handleClick}
    >
      <span className={styles.cssloadLoading}>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
      </span>
    </div>
  );
});

export default Loader;
