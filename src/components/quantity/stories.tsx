import React, { useState } from "react";

import styles from "../../styles/bootstrap/bootstrap-grid.scss";
// import storyStyles from "../../styles/stories.scss";
import Quantity from "./index";

export default { title: "Quantity" };

const [value, setValue] = useState(0);
function handleChange() {
  setValue(value + 1);
}

export const quantity = () => {
  return (
    <div className={styles.row}>
      <div className={styles.colMd3}>
        <label>Quantity</label>
        <br />
        <Quantity
          currentvalue={value}
          minvalue={0}
          maxvalue={3}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};
