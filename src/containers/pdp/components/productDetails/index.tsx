import React, { memo, useState, useCallback, useMemo } from "react";
import cs from "classnames";
import { Props } from "./typings";

import { currencyCodes } from "constants/currency";

import bootstrap from "styles/bootstrap/bootstrap-grid.scss";
import styles from "./styles.scss";
import globalStyles from "styles/global.scss";
import iconStyles from "styles/iconFonts.scss";

import { ChildProductAttributes } from "typings/product";
import SizeSelector from "components/SizeSelector";
import Quantity from "components/quantity";
import Button from "components/Button";
import Share from "components/Share";
import Accordion from "components/Accordion";
import { renderModal } from "utils/modal";
import SizeChartPopup from "../sizeChartPopup";

const saleStatus = true;

const ProductDetails: React.FC<Props> = ({
  data: {
    id,
    title,
    details,
    collection,
    collectionUrl,
    images = [],
    discount,
    discountedPriceRecords,
    priceRecords,
    childAttributes,
    sizeChartHtml,
    categories,
    loyalityDisabled,
    shipping,
    compAndCare,
    sku
  },
  mobile,
  wishlist,
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

  const onSizeChartClick = useCallback(() => {
    if (!sizeChartHtml) {
      return;
    }
    renderModal(<SizeChartPopup html={sizeChartHtml} />);
  }, [sizeChartHtml]);

  const addedToWishlist = useMemo(() => {
    return wishlist.indexOf(id) !== -1;
  }, [wishlist, id]);

  const accordionSections = useMemo(() => {
    return [
      {
        header: "Details",
        body: <div dangerouslySetInnerHTML={{ __html: details }}></div>,
        id: "details"
      },
      {
        header: "Dimensions & Care",
        body: <div dangerouslySetInnerHTML={{ __html: compAndCare }}></div>,
        id: "compAndCare"
      },
      {
        header: "Shipping & Handling",
        body: <div dangerouslySetInnerHTML={{ __html: shipping }}></div>,
        id: "shippAndHandle"
      }
    ];
  }, [details, compAndCare, compAndCare]);
  //   const toggleWishlistState = useCallback(()=> {

  //   }, [addedToWishlist]);

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
        <div className={cs(bootstrap.row, styles.spacer)}>
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
          {sizeChartHtml && (
            <div
              className={cs(
                bootstrap.colSm4,
                styles.label,
                globalStyles.textCenter
              )}
            >
              <span className={styles.sizeGuide} onClick={onSizeChartClick}>
                {" "}
                Size Guide{" "}
              </span>
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
        <div className={cs(bootstrap.row, styles.spacer)}>
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
          <div
            className={cs(
              bootstrap.col4,
              globalStyles.textCenter,
              styles.bridalSection
            )}
          >
            <div
              className={cs(
                iconStyles.icon,
                iconStyles.iconRings,
                styles.bridalRing
              )}
            ></div>
            <p className={styles.label}>add to registry</p>
          </div>
        </div>
        <div className={cs(bootstrap.row, styles.spacer)}>
          <div className={bootstrap.colSm8}>
            {selectedSize && selectedSize.stock == 0 ? (
              <Button label="NOTIFY ME" />
            ) : (
              <Button label="ADD TO BAG" />
            )}
          </div>
          <div
            className={cs(bootstrap.colSm4, globalStyles.textCenter, {
              [styles.addedToWishlist]: addedToWishlist
            })}
          >
            <div
              className={cs(iconStyles.icon, styles.wishlistIcon, {
                [iconStyles.iconWishlistAdded]: addedToWishlist,
                [iconStyles.iconWishlist]: !addedToWishlist
              })}
            ></div>
            <div className={styles.label}>
              {addedToWishlist ? "REMOVE FROM WISHLIST" : "ADD TO WISHLIST"}
            </div>
          </div>
        </div>
        <div
          className={cs(
            bootstrap.col12,
            bootstrap.colMd9,
            globalStyles.voffset1
          )}
        >
          {loyalityDisabled ? (
            <p className={styles.errorMsg}>
              This product is not eligible for Cerise points accumulation.
            </p>
          ) : (
            ""
          )}
        </div>
        <div
          className={cs(
            bootstrap.col12,
            bootstrap.colMd9,
            globalStyles.voffset3
          )}
        >
          <Share
            mobile={mobile}
            link={window.location.href}
            mailSubject="Gifting Ideas"
            mailText={
              "Here's what I found! It reminded me of you, check it out on Good Earth's web boutique " +
              window.location.href
            }
          />

          <div>
            <Accordion
              sections={accordionSections}
              headerClassName={styles.accordionHeader}
              bodyClassName={styles.accordionBody}
              defaultOpen="details"
            />
          </div>
          <div className={cs(styles.sku, globalStyles.voffset4)}>
            Vref. {sku}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ProductDetails);
