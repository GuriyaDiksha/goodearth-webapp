import React, { memo, useState, useCallback } from "react";
import cs from "classnames";
import { Props } from "./typings";

import { currencyCodes } from "constants/currency";

import bootstrap from "styles/bootstrap/bootstrap-grid.scss";
import styles from "./styles.scss";
import globalStyles from "styles/global.scss";

import { ChildProductAttributes } from "typings/product";
import SizeSelector from "components/SizeSelector";
import Quantity from "components/quantity";

const saleStatus = true;

const ProductDetails: React.FC<Props> = ({
  data: {
    id,
    title,
    collection,
    collectionUrl,
    images = [],
    discount,
    discountedPriceRecords,
    priceRecords,
    childAttributes,
    sizeChartHTML,
    categories
  },
  currency
}) => {
  const [productTitle, subtitle] = title.split("(");

  const [img] = images;

  const [
    selectedSize,
    setSelectedSize
  ] = useState<ChildProductAttributes | null>(null);

  const price =
    selectedSize && selectedSize.priceRecords
      ? selectedSize.priceRecords[currency]
      : priceRecords[currency];

  const [sizeError, setSizeError] = useState("");

  const onSizeSelect = useCallback(
    selected => {
      setSelectedSize(selected);
      setSizeError("");
    },
    [id, childAttributes, selectedSize]
  );

  const minQuantity = 1;
  const maxQuantity = selectedSize ? selectedSize.stock : 1;

  const [quantity, setQuantity] = useState<number>(1);

  const onQuantityChange = useCallback(
    value => {
      if (selectedSize) {
        setQuantity(value);
        setSizeError("");
      } else {
        setSizeError("Please select size");
      }
    },
    [selectedSize]
  );

  return (
    <div className={bootstrap.row}>
      <div
        className={cs(bootstrap.col10, bootstrap.offset1, bootstrap.colMd11)}
      >
        <div className={cs(bootstrap.row)}>
          {img ? (
            img.badgeImagePDP ? (
              <div className={bootstrap.col12}>
                <img src={img.badgeImagePDP} width="100" />
              </div>
            ) : (
              ""
            )
          ) : (
            ""
          )}
          <div className={cs(bootstrap.col12, styles.collectionHeader)}>
            {collection && <a href={collectionUrl}> {collection} </a>}
          </div>
          <div className={cs(bootstrap.col12, bootstrap.colMd8, styles.title)}>
            {productTitle}
            {subtitle && <p>({subtitle.split(")")[0]})</p>}
          </div>
          <div
            className={cs(
              bootstrap.col12,
              bootstrap.colMd4,
              styles.priceContainer,
              globalStyles.textCenter
            )}
          >
            {saleStatus && discount && discountedPriceRecords ? (
              <span className={styles.discountedPrice}>
                {String.fromCharCode(currencyCodes[currency])}
                &nbsp;
                {discountedPriceRecords[currency]}
                <br />
              </span>
            ) : (
              ""
            )}
            {saleStatus && discount ? (
              <span className={styles.oldPrice}>
                {String.fromCharCode(currencyCodes[currency])}
                &nbsp;
                {price}
              </span>
            ) : (
              <span>
                {" "}
                {String.fromCharCode(currencyCodes[currency])}
                &nbsp;
                {price}
              </span>
            )}
          </div>
        </div>
        <div className={bootstrap.row}>
          <div className={bootstrap.colSm8}>
            <div className={bootstrap.row}>
              <div
                className={cs(
                  bootstrap.col12,
                  bootstrap.colSm3,
                  styles.label,
                  styles.size
                )}
              >
                Size
              </div>
              <div className={cs(bootstrap.col12, bootstrap.colSm9)}>
                <SizeSelector
                  sizes={childAttributes}
                  onChange={onSizeSelect}
                  selected={selectedSize ? selectedSize.id : undefined}
                />
                {sizeError && (
                  <span className={styles.sizeErrorMessage}>{sizeError}</span>
                )}
              </div>
            </div>
          </div>
          {sizeChartHTML && (
            <div
              className={cs(
                bootstrap.colSm4,
                styles.label,
                globalStyles.textCenter
              )}
            >
              <span className={styles.sizeGuide}> Size Guide </span>
            </div>
          )}
          {categories && categories.indexOf("Living > Wallcoverings") !== -1 && (
            <div
              className={cs(
                bootstrap.colSm4,
                styles.label,
                globalStyles.textCenter
              )}
            >
              <span className={styles.sizeGuide}> Wallpaper Calculator </span>
            </div>
          )}
        </div>
        <div className={bootstrap.row}>
          <div className={bootstrap.colSm8}>
            <div className={bootstrap.row}>
              <div
                className={cs(
                  bootstrap.col12,
                  bootstrap.colSm3,
                  styles.label,
                  styles.quantity
                )}
              >
                Quantity
              </div>
              <div className={cs(bootstrap.col12, bootstrap.colSm9)}>
                <Quantity
                  id={selectedSize ? selectedSize.id : undefined}
                  minValue={minQuantity}
                  maxValue={maxQuantity}
                  currentValue={quantity}
                  onChange={onQuantityChange}
                  errorMsg={selectedSize ? "Available qty in stock is" : ""}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={bootstrap.row}></div>
      </div>
    </div>
  );
};

export default memo(ProductDetails);
