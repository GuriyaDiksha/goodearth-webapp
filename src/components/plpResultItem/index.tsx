import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PLPResultItemProps } from "./typings.d";
import styles from "./styles.scss";
import { Currency, currencyCode } from "../../typings/currency";
import cs from "classnames";
import bootstyles from "../../styles/bootstrap/bootstrap-grid.scss";
import { PartialChildProductAttributes } from "src/typings/product";
import noPlpImage from "images/noimageplp.png";
import WishlistButton from "components/WishlistButton";
import globalStyles from "styles/global.scss";
import LazyImage from "components/LazyImage";

const PlpResultItem: React.FC<PLPResultItemProps> = (
  props: PLPResultItemProps
) => {
  const { product, currency, onClickQuickView, mobile, isVisible } = props;
  const code = currencyCode[currency as Currency];
  const [primaryimage, setPrimaryimage] = useState(true);

  const onMouseEnter = (): void => {
    setPrimaryimage(false);
  };

  const onMouseLeave = (): void => {
    setPrimaryimage(true);
  };

  const onClickQuickview = (): void => {
    onClickQuickView ? onClickQuickView(product.id) : "";
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
        {mobile && (
          <div
            className={cs(
              globalStyles.textCenter,
              globalStyles.mobileWishlist,
              {
                [styles.wishlistBtnContainer]: mobile
              }
            )}
          >
            <WishlistButton
              id={product.id}
              showText={false}
              key={product.id}
              mobile={mobile}
            />
          </div>
        )}
        <Link to={product.url} onMouseEnter={onMouseEnter}>
          <LazyImage
            aspectRatio="62:93"
            src={image}
            className={styles.imageResultnew}
            isVisible={isVisible}
            onError={(e: any) => {
              e.target.onerror = null;
              e.target.src = noPlpImage;
            }}
          />
        </Link>
        {!mobile && (
          <div className={styles.combodiv}>
            <div className={styles.imageHover}>
              <p onClick={onClickQuickview}>quickview</p>
            </div>
            <div className={styles.imageHover}>
              <div
                className={cs(globalStyles.textCenter, {
                  [styles.wishlistBtnContainer]: mobile
                })}
              >
                <WishlistButton
                  id={product.id}
                  showText={false}
                  key={product.id}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className={styles.imageContent}>
        <p className={styles.collectionName}>{product.collections}</p>
        <p className={styles.productN}>
          <Link to={product.url}> {product.title} </Link>
        </p>
        <p className={styles.productN}>
          <span>
            {String.fromCharCode(code)}{" "}
            {product.priceRecords[currency as Currency]}
          </span>
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
