import React from "react";
import { ProductCounterProps } from "./typings";
import cs from "classnames";
import styles from "./styles.scss";
import arrow from "../../images/arrow-counter-02.svg";
import { useSelector } from "react-redux";
import { AppState } from "reducers/typings";
import CookieService from "services/cookie";
import { GA_CALLS } from "constants/cookieConsent";

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

    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({
        event: "product_counter"
      });
    }
  };
  return (
    <>
      {total !== null && total > 0 ? (
        <div
          className={cs(styles.scrollDownUp, {
            [styles.topPosition]: showTimer && timerData,
            [styles.leftPosition]: id !== "collection-product-counter"
          })}
          onClick={scrollToTop}
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
      ) : (
        <></>
      )}
    </>
  );
};
export default ProductCounter;
