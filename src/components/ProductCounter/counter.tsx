import React from "react";
import { ProductCounterProps } from "./typings";
import cs from "classnames";
import styles from "./styles.scss";

const Counter: React.FC<ProductCounterProps> = ({
  current,
  total,
  isclass
}) => {
  const newclass = isclass ? isclass : styles.counterstyle;
  return (
    <div className={cs(newclass)}>
      <div className={cs(styles.counter)}>
        <div className={cs(styles.counterNumber)}>
          <div>{current}</div>/<div>{total}</div>
        </div>
      </div>
    </div>
  );
};
export default Counter;
