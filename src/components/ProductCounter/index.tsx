import React from "react";
import { ProductCounterProps } from "./typings";
import cs from "classnames";
import styles from "./styles.scss";

const ProductCounter: React.FC<ProductCounterProps> = ({ current, total }) => {
  return (
    <div className={cs(styles.scrollDownUp)}>
      <div className={cs(styles.counter)}>
        <div className={cs(styles.counterNumber)}>
          <div>{current}</div>/<div>{total}</div>
        </div>
        <i></i>
      </div>
    </div>
  );
};
export default ProductCounter;
