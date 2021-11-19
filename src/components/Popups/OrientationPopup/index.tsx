import React from "react";
import styles from "./styles.scss";
import ipad from "images/ipad.png";

const OrientationPopup: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <img className={styles.image} src={ipad} />
        <p>
          For optimized viewing experience,{" "}
          <b>please rotate to portrait view</b>
        </p>
      </div>
    </div>
  );
};

export default OrientationPopup;
