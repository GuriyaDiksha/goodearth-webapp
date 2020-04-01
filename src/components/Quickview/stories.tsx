import React from "react";
import styles from "../../styles/bootstrap/bootstrap-grid.scss";
import Quantity from "./index";

export default { title: "Quantity" };

const QuantityDemo = (): JSX.Element => {
  return <Quantity />;
};

export const quantity = () => {
  return (
    <div className={styles.row}>
      <div className={styles.colMd3}>
        <label>Quantity</label>
        <br />
        <QuantityDemo />
      </div>
    </div>
  );
};
