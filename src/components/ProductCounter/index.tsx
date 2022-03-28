import React from "react";
import { ProductCounterProps } from "./typings";
import cs from "classnames";
import styles from "./styles.scss";
import fontStyles from "../../styles/iconFonts.scss";

const ProductCounter: React.FC<ProductCounterProps> = ({ current, total }) => {
  return (
    <div className={cs(styles.scrollDownUp)}>
      <div className={cs(styles.counter)}>
        <div className={cs(styles.counterNumber)}>
          <div>{current}</div>/<div>{total}</div>
        </div>
        <i
          className={cs(fontStyles.icon, fontStyles.iconArrowUp, styles.icon)}
        ></i>
      </div>
    </div>
  );
};
export default ProductCounter;
