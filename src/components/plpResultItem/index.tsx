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
import { AppState } from "reducers/typings";
import { useSelector } from "react-redux";
import Price from "components/Price";
import SkeletonImage from "./skeleton";
import * as valid from "utils/validate";
import CookieService from "services/cookie";
const PlpResultItem: React.FC<PLPResultItemProps> = (
  props: PLPResultItemProps
) => {
  const {
    product,
    currency,
    onClickQuickView,
    mobile,
    isVisible,
    isCorporate,
    position,
    page,
    loader
  } = props;
  const code = currencyCode[currency as Currency];
  // const {} = useStore({state:App})
  const [primaryimage, setPrimaryimage] = useState(true);
  const {
    info,
    user: { isLoggedIn }
  } = useSelector((state: AppState) => state);

  const onMouseEnter = (): void => {
    product.plpImages?.[1] ? setPrimaryimage(false) : "";
  };
  const attribute: any = product.childAttributes || [];
  const totalStock = attribute.reduce(function(total: any, num: any) {
    return total + +num.stock;
  }, 0);
  const sizeExit =
    attribute.filter(function(item: any) {
      return item.size;
    }).length > 0;
  const onMouseLeave = (): void => {
    product.plpImages?.[1] ? setPrimaryimage(true) : "";
  };

  const onClickQuickview = (): void => {
    onClickQuickView ? onClickQuickView(product.id) : "";
  };

  const gtmProductClick = () => {
    CookieService.setCookie("listPath", page);
    valid.plpProductClick(product, page, currency, position);
    const len = product.categories.length;
    const category = product.categories[len - 1];
    const l3Len = category.split(">").length;
    const l3 = category.split(">")[l3Len - 1];
    dataLayer.push({
      "Event Category": "GA Ecommerce",
      "Event Action": "Product Click ",
      "Event Label": l3,
      "Time Stamp": new Date().toISOString(),
      "Page Url": location.href,
      "Page Type": valid.getPageType(),
      "Product Category": category.replaceAll(">", "-"),
      "Login Status": isLoggedIn ? "logged in" : "logged out",
      "Page referrer url": CookieService.getCookie("prevUrl"),
      "Product Name": product.title,
      "Product ID": product.id
    });
  };
  const image = primaryimage
    ? product.plpImages
      ? product.plpImages[0]
      : ""
    : product.plpImages
    ? product.plpImages[1]
    : "";
  const isStockAvailable = isCorporate || product.inStock;
  return loader ? (
    <div className={styles.plpMain}>
      <SkeletonImage />
    </div>
  ) : (
    <div className={styles.plpMain}>
      {product.salesBadgeImage && (
        <div className={mobile ? styles.badgeImageMobile : styles.badgeImage}>
          <img src={product.salesBadgeImage} />
        </div>
      )}
      {product.justAddedBadge && !mobile && (
        <div className={styles.newBadgeImage}>
          <img src={product.justAddedBadge} />
        </div>
      )}
      <div
        className={styles.imageBoxnew}
        id={"" + product.id}
        onMouseLeave={onMouseLeave}
      >
        {mobile && !isCorporate && (
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
              gtmListType="Search"
              title={product.title}
              childAttributes={product.childAttributes}
              priceRecords={product.priceRecords}
              discountedPriceRecords={product.discountedPriceRecords}
              categories={product.categories}
              id={product.id}
              showText={false}
              key={product.id}
              mobile={mobile}
            />
          </div>
        )}
        <Link
          to={product.url}
          onMouseEnter={onMouseEnter}
          onClick={gtmProductClick}
        >
          <LazyImage
            aspectRatio="62:93"
            src={image}
            alt={product.altText || product.title}
            className={styles.imageResultnew}
            isVisible={isVisible}
            onError={(e: any) => {
              e.target.onerror = null;
              e.target.src = noPlpImage;
            }}
          />
        </Link>
        <div
          className={cs(
            isStockAvailable
              ? globalStyles.hidden
              : totalStock > 0
              ? globalStyles.hidden
              : styles.outstock
          )}
        >
          <Link to={product.url}> NOTIFY ME</Link>
        </div>
        {!mobile && (
          <div className={styles.combodiv}>
            <div
              className={
                isCorporate ? styles.imageHoverCorporate : styles.imageHover
              }
            >
              <p onClick={onClickQuickview}>
                {isCorporate ? "quickview" : "add to bag"}
              </p>
            </div>
            {!isCorporate && (
              <div className={styles.imageHover}>
                <div
                  className={cs(globalStyles.textCenter, {
                    [styles.wishlistBtnContainer]: mobile
                  })}
                >
                  <WishlistButton
                    gtmListType="Search"
                    title={product.title}
                    childAttributes={product.childAttributes}
                    priceRecords={product.priceRecords}
                    discountedPriceRecords={product.discountedPriceRecords}
                    categories={product.categories}
                    id={product.id}
                    showText={false}
                    key={product.id}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <div className={styles.imageContent}>
        {/* {isCollection ? (
          <p className={styles.collectionName}>{product.collection}</p>
        ) : (
          ""
        )} */}
        <p className={styles.productN}>
          <Link to={product.url}> {product.title} </Link>
        </p>
        {!(product.invisibleFields?.indexOf("price") > -1) && (
          <Price
            product={product}
            code={code}
            isSale={info.isSale}
            currency={currency}
          />
        )}
        {product.justAddedBadge && mobile && (
          <p className={styles.productN}>
            <span className={styles.mobileBadge}>
              <img src={product.justAddedBadge} />
            </span>
          </p>
        )}
        {sizeExit && !mobile && (
          <div
            className={cs(
              styles.productSizeList,
              // { [styles.productSizeListMobile]: mobile },
              bootstyles.row
            )}
          >
            <div className={styles.productSize}> size</div>
            <div className="">
              {!(product.invisibleFields?.indexOf("size") > -1) && (
                <ul>
                  {(props.product
                    .childAttributes as PartialChildProductAttributes[])?.map(
                    (data: PartialChildProductAttributes, i: number) => {
                      return (
                        <li
                          className={
                            +data.stock || isCorporate ? "" : styles.disabled
                          }
                          key={i}
                        >
                          {data.size}
                        </li>
                      );
                    }
                  )}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlpResultItem;
