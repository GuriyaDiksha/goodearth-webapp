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
  code
}) => {
  return (
    <p className={styles.productN}>
      {isSale && discount ? (
        <span className={cs(styles.discountprice)}>
          {String.fromCharCode(...code)} {discountPrice}
        </span>
      ) : (
        ""
      )}
      {isSale && discount ? (
        <span className={styles.strikeprice}>
          {" "}
          {String.fromCharCode(...code)} {price}{" "}
        </span>
      ) : (
        <span className={badgeType == "B_flat" ? globalStyles.gold : ""}>
          {String.fromCharCode(...code)} {price}
        </span>
      )}
    </p>
  );
};

export default SelectedPrice;
