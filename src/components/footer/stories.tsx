import React from "react";
import styles from "../../styles/bootstrap/bootstrap-grid.scss";
import Footer from "./index";

require("../../fonts/goodearth.ttf");

export default { title: "Footer" };

export const footer = () => {
  // const data: FooterDataProps = mydata;
  return (
    <div className={styles.row}>
      <div className={styles.colMd12}>
        <label>Footer</label>
        <br />
        <Footer />
      </div>
    </div>
  );
};
