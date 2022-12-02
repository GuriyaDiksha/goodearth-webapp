import React from "react";
import { ProductCounterProps } from "./typings";
import cs from "classnames";
import styles from "./styles.scss";
import arrow from "../../images/arrow-counter-02.svg";
import { useSelector } from "react-redux";
import { AppState } from "reducers/typings";

const ProductCounter: React.FC<ProductCounterProps> = ({
  current,
  total,
  id
}) => {
  const {
    header: { timerData },
    info: { showTimer }
  } = useSelector((state: AppState) => state);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };
  return (
    <div
      className={cs(styles.scrollDownUp, {
        [styles.topPosition]: showTimer && timerData
      })}
    >
      <div className={cs(styles.counter)}>
        <div
          className={cs(styles.counterNumber, {
            [styles.plpProductCounter]: id == "plp-product-counter"
          })}
        >
          <div className={cs(styles.current)}>{current}</div>
          <div>/</div>
          <div className={cs(styles.total)}>{total}</div>
        </div>
        <div className={cs(styles.arrowContainer)} onClick={scrollToTop}>
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
