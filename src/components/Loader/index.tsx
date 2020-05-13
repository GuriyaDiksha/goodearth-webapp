import React, { memo } from "react";
import cs from "classnames";

import styles from "./styles.scss";

const Loader: React.FC = memo(() => {
  return (
    <div className={cs(styles.cssloadContainer, styles.fullLoadWrap)}>
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
