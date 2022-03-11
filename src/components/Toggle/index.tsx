import React from "react";
import styles from "./styles.scss";
import cs from "classnames";
import bootstrapStyles from "../../styles/bootstrap/bootstrap-grid.scss";

type Props = {
  values: string[];
  activeIndex: number;
  handleClick: (index: number) => void;
};
const Toggle: React.FC<Props> = ({ values, activeIndex = 0, handleClick }) => {
  return (
    <div className={styles.toggle}>
      <ul className={cs(styles.container, bootstrapStyles.row)}>
        {values.map((value, index) => {
          return (
            <li
              key={index}
              className={cs(
                { [styles.active]: index == activeIndex },
                bootstrapStyles.col
              )}
              onClick={() => handleClick(index)}
            >
              {value}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Toggle;
