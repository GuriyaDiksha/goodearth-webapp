import React, { useState } from "react";
import { PLPResultItemProps } from "./typings";
import styles from "./styles.scss";
import { Currency } from "../../typings/currency";
import cs from "classnames";
import iconStyles from "../../styles/iconFonts.scss";
import bootstyles from "../../styles/bootstrap/bootstrap-grid.scss";
import { PartialChildProductAttributes } from "src/typings/product";

const PlpResultItem: React.FC<PLPResultItemProps> = (
  props: PLPResultItemProps
) => {
  const currencycode: any = {
    INR: 8377,
    USD: 36,
    GBP: 163
  };
  const { product, currency } = props;
  const code = currencycode[currency as Currency];
  const [primaryimage, setPrimaryimage] = useState(true);
  const [hovercomponent, setHovercomponent] = useState(true);

  const onMouseEnter = (): void => {
    setPrimaryimage(false);
  };

  const onMouseLeave = (): void => {
    setPrimaryimage(true);
  };

  const onMouseEnterComponent = (): void => {
    setHovercomponent(false);
  };

  const onMouseLeaveComponent = (): void => {
    setHovercomponent(true);
  };

  const image = primaryimage
    ? product.plpImages
      ? product.plpImages[0]
      : ""
    : product.plpImages
    ? product.plpImages[1]
    : "";
  return (
    <div
      onMouseLeave={onMouseLeaveComponent}
      onMouseEnter={onMouseEnterComponent}
    >
      <div
        className={styles.imageBoxnew}
        id={"" + product.id}
        onMouseLeave={onMouseLeave}
      >
        <a href={product.url} onMouseEnter={onMouseEnter}>
          <img src={image} className={styles.imageResultnew} />
        </a>
        <div className={hovercomponent ? styles.hidden : styles.combodiv}>
          <div className={styles.imageHover}>
            <span>quickview</span>
          </div>
          <div className={styles.imageHover}>
            <i
              className={cs(
                iconStyles.icon,
                iconStyles.iconWishlist,
                styles.wishlist
              )}
            ></i>
          </div>
          <div className={styles.hidden}>
            <i
              className={cs(iconStyles.icon, iconStyles.iconWishlistAdded)}
            ></i>
          </div>
        </div>
      </div>
      <div className={styles.imageContent}>
        <p className={styles.productN}>
          <a href={product.url}> {product.title} </a>
        </p>
        <p className={styles.productN}>
          {String.fromCharCode(code)}{" "}
          {product.priceRecords[currency as Currency]}
        </p>
        <div
          className={
            hovercomponent
              ? styles.hidden
              : cs(styles.productSizeList, bootstyles.row)
          }
        >
          <div className={styles.productSize}> size</div>
          <div className="">
            <ul>
              {(props.product
                .childAttributes as PartialChildProductAttributes[])?.map(
                (data: PartialChildProductAttributes, i: number) => {
                  return <li key={i}>{data.size}</li>;
                }
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlpResultItem;
