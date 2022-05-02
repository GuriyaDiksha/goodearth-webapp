import React from "react";
import { ProductCounterProps } from "./typings";
import cs from "classnames";
import styles from "./styles.scss";
import arrow from "../../images/arrow-counter-02.svg";

const ProductCounter: React.FC<ProductCounterProps> = ({ current, total }) => {
  return (
    <div className={cs(styles.scrollDownUp)}>
      <div className={cs(styles.counter)}>
        <div className={cs(styles.counterNumber)}>
          <div>{current}</div>/<div>{total}</div>
        </div>
        <div className={cs(styles.arrowContainer)}>
          <img
            alt="arrow-up"
            src={arrow}
            style={{
              width: "8px"
            }}
          ></img>
        </div>
      </div>
    </div>
  );
};
export default ProductCounter;
