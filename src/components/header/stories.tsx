import React from "react";
import styles from "../../styles/bootstrap/bootstrap-grid.scss";
import Header from "./index";

export default { title: "Header" };

export const header = () => {
  return (
    <div className={styles.row}>
      <div className={styles.colMd12}>
        <label>Header</label>
        <br />
        <Header />
      </div>
    </div>
  );
};
