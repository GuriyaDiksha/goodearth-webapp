import React from "react";
import { Props } from "./typings";
import globalStyles from "styles/global.scss";
import styles from "./styles.scss";
import { Currency } from "typings/currency";

const Price: React.FC<Props> = ({ product, isSale, code, currency }) => {
  return (
    <p className={styles.productN}>
      {isSale && product.discount ? (
        <span className={styles.discountprice}>
          {String.fromCharCode(...code)}{" "}
          {product.discountedPriceRecords[currency as Currency]}
        </span>
      ) : (
        ""
      )}
      {isSale && product.discount ? (
        <span className={styles.strikeprice}>
          {" "}
          {String.fromCharCode(...code)}{" "}
          {product.priceRecords[currency as Currency]}{" "}
        </span>
      ) : (
        <span
          className={product.badgeType == "B_flat" ? globalStyles.cerise : ""}
        >
          {String.fromCharCode(...code)}{" "}
          {product.priceRecords[currency as Currency]}
        </span>
      )}
    </p>
  );
};

export default Price;
