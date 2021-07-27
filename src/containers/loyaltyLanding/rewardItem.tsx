import React from "react";
import styles from "./styles.scss";
type Props = {
  image: any;
  heading: string;
  subHeading: string;
  isActive: boolean;
};
const RewardItem: React.FC<Props> = ({
  image,
  heading,
  subHeading,
  isActive
}) => (
  <li className={isActive ? "" : styles.disabled} key={heading}>
    <div className={styles.tabs}>
      <div>
        <p className={styles.icon}>
          <img src={image} />
        </p>
      </div>
      <div className={styles.tabsTxt}>
        <p>
          <span className={isActive ? styles.heading2 : ""}>{heading}</span>{" "}
          <br />
          {subHeading}
        </p>
      </div>
    </div>
  </li>
);

export default RewardItem;
