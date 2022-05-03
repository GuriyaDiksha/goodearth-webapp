import React from "react";
import { ProductCounterProps } from "./typings";
import cs from "classnames";
import styles from "./styles.scss";

const Counter: React.FC<ProductCounterProps> = ({ current, total }) => {
  return (
    <div className={cs(styles.counterstyle)}>
      <div className={cs(styles.counter)}>
        <div className={cs(styles.counterNumber)}>
          <div>{current}</div>/<div>{total}</div>
        </div>
      </div>
    </div>
  );
};
export default Counter;
