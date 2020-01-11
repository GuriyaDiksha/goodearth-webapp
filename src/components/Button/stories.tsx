import React from "react";
import styles from "../../styles/bootstrap/bootstrap-grid.scss";
import Button from "./index";

export default { title: "Button" };

export const Buttons = () => {
  const myClick = (event: React.MouseEvent) => {
    alert("Add to Bag");
  };
  return (
    <div className={styles.row}>
      <div className={styles.colMd3}>
        <label>Button</label>
        <br />
        <Button label="Add To Bag" disable={false} onClick={myClick} />
      </div>
    </div>
  );
};
