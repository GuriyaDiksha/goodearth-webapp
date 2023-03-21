import React from "react";
import { Props } from "./typings";
import globalStyles from "styles/global.scss";
import styles from "./styles.scss";
import cs from "classnames";
import { displayPriceWithCommas } from "utils/utility";

const SelectedPrice: React.FC<Props> = ({
  price,
  discountPrice,
  badgeType,
  discount,
  isSale,
  code,
  className,
  currency
}) => {
  return (
    <p className={cs(styles.productN)}>
      {isSale && discount ? (
        <span className={cs(styles.discountprice, className)}>
          {String.fromCharCode(...code)}{" "}
          {displayPriceWithCommas(discountPrice, currency)}
        </span>
      ) : (
        ""
      )}
      &nbsp; &nbsp;
      {isSale && discount ? (
        <span className={cs(styles.strikeprice, className)}>
          {" "}
          {String.fromCharCode(...code)}{" "}
          {displayPriceWithCommas(price, currency)}{" "}
        </span>
      ) : (
        <span
          className={cs(
            badgeType == "B_flat" ? globalStyles.gold : "",
            className
          )}
        >
          {String.fromCharCode(...code)}{" "}
          {displayPriceWithCommas(price, currency)}
        </span>
      )}
    </p>
  );
};

export default SelectedPrice;
