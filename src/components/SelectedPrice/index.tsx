import React from "react";
import { Props } from "./typings";
import globalStyles from "styles/global.scss";
import styles from "./styles.scss";
import cs from "classnames";

const SelectedPrice: React.FC<Props> = ({
  price,
  discountPrice,
  badgeType,
  discount,
  isSale,
  code,
  className
}) => {
  return (
    <p className={cs(styles.productN)}>
      {isSale && discount ? (
        <span className={cs(styles.discountprice, className)}>
          {String.fromCharCode(...code)} {discountPrice}
        </span>
      ) : (
        ""
      )}
      {isSale && discount ? (
        <span className={cs(styles.strikeprice, className)}>
          {" "}
          {String.fromCharCode(...code)} {price}{" "}
        </span>
      ) : (
        <span
          className={cs(
            badgeType == "B_flat" ? globalStyles.gold : "",
            className
          )}
        >
          {String.fromCharCode(...code)} {price}
        </span>
      )}
    </p>
  );
};

export default SelectedPrice;
