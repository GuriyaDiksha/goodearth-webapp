import React from "react";
import { Props } from "./typings";
import globalStyles from "styles/global.scss";
import styles from "./styles.scss";
import { Currency } from "typings/currency";
import { displayPriceWithCommas } from "utils/utility";

const Price: React.FC<Props> = ({ product, isSale, code, currency }) => {
  return (
    <p className={styles.productN}>
      {isSale && product.discount ? (
        <span className={styles.discountprice}>
          {displayPriceWithCommas(
            product.discountedPriceRecords[currency as Currency],
            currency
          )}
        </span>
      ) : (
        ""
      )}
      {isSale && product.discount ? (
        <span className={styles.strikeprice}>
          {" "}
          {displayPriceWithCommas(
            product.priceRecords[currency as Currency],
            currency
          )}{" "}
        </span>
      ) : (
        <span
          className={product.badgeType == "B_flat" ? globalStyles.cerise : ""}
        >
          {displayPriceWithCommas(
            product.priceRecords[currency as Currency],
            currency
          )}
        </span>
      )}
    </p>
  );
};

export default Price;
