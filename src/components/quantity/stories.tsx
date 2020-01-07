import React, { useState } from "react";

import styles from "../../styles/bootstrap/bootstrap-grid.scss";
// import storyStyles from "../../styles/stories.scss";
import Quantity from "./index";

export default { title: "Quantity" };

const QuantityDemo = (): JSX.Element => {
  const [value, setValue] = useState(0);

  const handleChange = (value: any) => {
    setValue(value);
    return;
  };
  return (
    <Quantity
      currentvalue={value}
      minvalue={0}
      maxvalue={3}
      onChange={handleChange}
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
