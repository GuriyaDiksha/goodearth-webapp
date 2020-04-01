import React, { useState } from "react";
import { PLPResultItemProps } from "./typings";
import styles from "./styles.scss";
import { Currency, currencyCode } from "../../typings/currency";
import cs from "classnames";
import iconStyles from "../../styles/iconFonts.scss";
import bootstyles from "../../styles/bootstrap/bootstrap-grid.scss";
import { PartialChildProductAttributes } from "src/typings/product";
import { renderModal } from "utils/modal";
import Quickview from "components/Quickview";

const PlpResultItem: React.FC<PLPResultItemProps> = (
  props: PLPResultItemProps
) => {
  const { product, currency } = props;
  const code = currencyCode[currency as Currency];
  const [primaryimage, setPrimaryimage] = useState(true);

  const onMouseEnter = (): void => {
    setPrimaryimage(false);
  };

  const onMouseLeave = (): void => {
    setPrimaryimage(true);
  };

  const onClickQuickview = (): void => {
    console.log("hello");
    renderModal(<Quickview />, {
      fullscreen: false
    });
  };

  const image = primaryimage
    ? product.plpImages
      ? product.plpImages[0]
      : ""
    : product.plpImages
    ? product.plpImages[1]
    : "";
  return (
    <div className={styles.plpMain}>
      <div
        className={styles.imageBoxnew}
        id={"" + product.id}
        onMouseLeave={onMouseLeave}
      >
        <a href={product.url} onMouseEnter={onMouseEnter}>
          <img src={image} className={styles.imageResultnew} />
        </a>
        <div className={styles.combodiv}>
          <div className={styles.imageHover}>
            <span onClick={onClickQuickview}>quickview</span>
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
        <div className={cs(styles.productSizeList, bootstyles.row)}>
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
