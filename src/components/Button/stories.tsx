import React from "react";
import styles from "../../styles/bootstrap/bootstrap-grid.scss";
// import storyStyles from "../../styles/stories.scss";
import Button from "./index";

export default { title: "Button" };

export const Buttons = () => {
  // let value = ()
  return (
    <div className={styles.row}>
      <div className={styles.colMd3}>
        <label>Button</label>
        <br />
        <Button label="Add To Bag" disable={false} />
      </div>
    </div>
  );
};
