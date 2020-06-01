import React from "react";
import styles from "../../styles/bootstrap/bootstrap-grid.scss";
import Loader from "./index";

export default { title: "Loader" };

export const LoaderDemo = () => {
  return (
    <div className={styles.row}>
      <Loader />
    </div>
  );
};
