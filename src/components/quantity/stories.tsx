import React, { useState } from "react";
import styles from "../../styles/bootstrap/bootstrap-grid.scss";
import Quantity from "./index";

export default { title: "Quantity" };

const QuantityDemo = (): JSX.Element => {
  const [value, setValue] = useState(0);

  const handleChange = (value: number) => {
    setValue(value);
    return;
  };
  return (
    <Quantity
      currentValue={value}
      minValue={0}
      maxValue={3}
      onChange={handleChange}
      errorMsg="Available qty in stock is"
    />
  );
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
