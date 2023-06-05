import React, { memo, useState } from "react";
import cs from "classnames";
import { Link } from "react-router-dom";
import styles from "./styles.scss";
import { BasketItem } from "typings/basket";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
import Quantity from "components/quantity";
import "../../styles/override.css";
import { currencyCodes } from "constants/currency";
import WishlistButton from "components/WishlistButton";
import globalStyles from "../../styles/global.scss";
import iconStyles from "../../styles/iconFonts.scss";
import BasketService from "services/basket";
import { useSelector, useStore } from "react-redux";
import bridalRing from "../../images/bridal/rings.svg";
import { AppState } from "reducers/typings";
import quantityStyles from "../quantity/styles.scss";
import CookieService from "services/cookie";
import { GA_CALLS } from "constants/cookieConsent";
import { displayPriceWithCommas } from "utils/utility";

const LineItems: React.FC<BasketItem> = memo(
  ({
    id,
    bridalProfile,
    giftCardImage,
    quantity,
    product,
    saleStatus,
    toggleBag,
    GCValue
  }) => {
    const [value, setValue] = useState(quantity | 0);
    // const [qtyError, setQtyError] = useState(false);
    let {
      basket: { currency }
    } = useSelector((state: AppState) => state);
    const {
      device: { tablet },
      user: { isLoggedIn }
    } = useSelector((state: AppState) => state);
    if (!currency) {
      currency = "INR";
    }
    const { dispatch } = useStore();
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState("");
    const handleChange = async (value: number) => {
      await BasketService.updateToBasket(dispatch, id, value)
        .then(res => {
          setValue(value);
        })
        .catch(err => {
          setShowError(true);
          setError(
            `Only ${quantity} piece${
              quantity > 1 ? "s" : ""
            } available in stock`
          );
          // setQtyError(true);
          throw err;
        });
    };

    const {
      images,
      // collection,
      title,
      url,
      priceRecords,
      discount,
      discountedPriceRecords,
      badgeType,
      salesBadgeImage,
      inWishlist,
      attributes,
      childAttributes
    } = product;
    const size =
      attributes.find(attribute => attribute.name == "Size")?.value || "";

    const gtmPushDeleteCartItem = () => {
      const price = saleStatus
        ? childAttributes[0].discountedPriceRecords[currency]
        : childAttributes[0].priceRecords[currency];
      const index = product.categories ? product.categories.length - 1 : 0;
      const category =
        product.categories && product.categories[index]
          ? product.categories[index].replace(/\s/g, "")
          : "";
      const arr = category.split(">");
      const categoryname = arr[arr.length - 2];
      const subcategoryname = arr[arr.length - 1];
      const userConsent = CookieService.getCookie("consent").split(",");
      if (userConsent.includes(GA_CALLS)) {
        Moengage.track_event("remove_from_cart", {
          "Product id": product.sku || product.childAttributes[0].sku,
          "Product name": product.title,
          quantity: quantity,
          price: +price,
          Currency: currency,
          "Collection name": product.collection,
          "Category name": categoryname,
          "Sub Category Name": subcategoryname
        });
      }
      if (userConsent.includes(GA_CALLS)) {
        dataLayer.push({
          event: "removeFromCart",
          ecommerce: {
            currencyCode: currency,
            remove: {
              products: [
                {
                  name: product.title,
                  id: product.sku || product.childAttributes[0].sku,
                  price: price,
                  brand: "Goodearth",
                  category: category,
                  variant: size,
                  quantity: quantity
                }
              ]
            }
          }
        });
        dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
        dataLayer.push({
          event: "remove_from_cart",
          ecommerce: {
            items: [
              {
                item_id: product.sku || product.childAttributes[0].sku,
                item_name: product.title,
                affiliation: product.title,
                coupon: "", // Pass the coupon if available
                currency: currency, // Pass the currency code
                discount: childAttributes[0]?.discountedPriceRecords[currency], // Pass the discount amount
                index: "",
                item_brand: "goodearth",
                item_category: categoryname,
                item_category2: size,
                item_category3: "",
                item_list_id: "",
                item_list_name: "",
                item_variant: "",
                item_category4: product.categories[0],
                item_category5: product.collection,
                price: price,
                quantity: quantity
              }
            ]
          }
        });
      }
      const categoryList = product.categories
        ? product.categories.length > 0
          ? product.categories[product.categories.length - 1].replace(/>/g, "-")
          : ""
        : "";

      let subcategory = categoryList ? categoryList.split(" > ") : "";
      if (subcategory) {
        subcategory = subcategory[subcategory.length - 1];
      }
      if (userConsent.includes(GA_CALLS)) {
        dataLayer.push({
          "Event Category": "GA Ecommerce",
          "Event Action": "Cart Removal",
          "Event Label": subcategory,
          "Time Stamp": new Date().toISOString(),
          "Cart Source": location.href,
          "Product Category": categoryList,
          "Login Status": isLoggedIn ? "logged in" : "logged out",
          "Product Name": product.title,
          "Product ID": product.id,
          Variant: size
        });
      }
    };

    const deleteItem = () => {
      BasketService.deleteBasket(dispatch, id).then(() => {
        gtmPushDeleteCartItem();
      });
    };

    const getSize = (data: any) => {
      const size = data.find(function(attribute: any) {
        if (attribute.name == "Size") {
          return attribute;
        }
      });
      return size ? <div className={styles.size}>Size: {size.value}</div> : "";
    };

    const price = priceRecords[currency];
    const isGiftCard = product.structure.toLowerCase() == "giftcard";
    return (
      <div
        className={cs(styles.cartItem, styles.gutter15, "cart-item", {
          // [styles.spacingError]:
          //   saleStatus &&
          //   childAttributes[0].showStockThreshold &&
          //   childAttributes[0].stock > 0
        })}
        data-sku={product.childAttributes[0].sku}
      >
        <div className={bootstrap.row}>
          <div className={cs(bootstrap.col4, styles.cartPadding)}>
            <div className={globalStyles.relative}>
              <Link to={isGiftCard ? "#" : url} onClick={toggleBag}>
                {salesBadgeImage && (
                  <div className={styles.badgePositionPlpMobile}>
                    <img src={salesBadgeImage} alt="sales-badge" />
                  </div>
                )}
                <div className={styles.cartRing}>
                  {bridalProfile && (
                    <svg
                      viewBox="-5 -5 50 50"
                      width="30"
                      height="30"
                      preserveAspectRatio="xMidYMid meet"
                      x="0"
                      y="0"
                      className={styles.ceriseBridalRings}
                    >
                      <use xlinkHref={`${bridalRing}#bridal-ring`}></use>
                    </svg>
                  )}
                </div>
                <img
                  className={styles.productImage}
                  alt={product.altText || product.title}
                  src={
                    isGiftCard
                      ? giftCardImage
                      : images && images.length > 0
                      ? tablet
                        ? images[0].productImage
                        : images[0].productImage.replace("Medium", "Micro")
                      : ""
                  }
                />
              </Link>
            </div>
          </div>
          <div className={cs(bootstrap.col8, styles.cartPadding)}>
            {/* <div className={styles.collectionName}>{collection}</div> */}
            <div className={bootstrap.row}>
              <div className={cs(bootstrap.col10, styles.name)}>
                <div>
                  <Link to={isGiftCard ? "#" : url} onClick={toggleBag}>
                    {title}
                  </Link>
                </div>
                <div className={styles.productPrice}>
                  {saleStatus && discount && discountedPriceRecords ? (
                    <span className={styles.discountprice}>
                      {displayPriceWithCommas(
                        discountedPriceRecords[currency],
                        currency
                      )}
                      &nbsp; &nbsp;
                    </span>
                  ) : (
                    ""
                  )}
                  {saleStatus && discount ? (
                    <span className={styles.strikeprice}>
                      {isGiftCard
                        ? displayPriceWithCommas(GCValue, currency)
                        : displayPriceWithCommas(price, currency)}
                    </span>
                  ) : (
                    <span
                      className={
                        badgeType == "B_flat" ? globalStyles.cerise : ""
                      }
                    >
                      {" "}
                      {isGiftCard
                        ? displayPriceWithCommas(GCValue, currency)
                        : displayPriceWithCommas(price, currency)}
                    </span>
                  )}
                </div>
              </div>
              <div
                className={cs(
                  bootstrap.col2,
                  styles.pointer,
                  styles.textCenter,
                  styles.remove
                )}
              >
                <i
                  className={cs(
                    iconStyles.icon,
                    iconStyles.iconCrossNarrowBig,
                    styles.crossiconItem
                  )}
                  onClick={deleteItem}
                ></i>
              </div>
            </div>
            <div
              className={cs(bootstrap.row, styles.section, {
                [globalStyles.hiddenEye]: isGiftCard
              })}
            >
              <div className={bootstrap.col10}>
                {getSize(product.attributes)}
                <div className={cs(styles.widgetQty)}>
                  <Quantity
                    source="bag"
                    key={id}
                    id={id}
                    currentValue={value}
                    minValue={1}
                    maxValue={1000}
                    onChange={x => null}
                    onUpdate={handleChange}
                    class={styles.myQuantity}
                    disabled={
                      product.stockRecords &&
                      product.stockRecords[0].numInStock < 1
                    }
                    // errorMsg="Available qty in stock is"
                  />
                </div>
              </div>
              {!bridalProfile && (
                <div
                  className={cs(
                    bootstrap.col2,
                    globalStyles.textCenter,
                    styles.wishlistDisplay
                  )}
                >
                  <WishlistButton
                    gtmListType="MiniBag"
                    title={product.title}
                    childAttributes={product.childAttributes}
                    priceRecords={product.priceRecords}
                    discountedPriceRecords={product.discountedPriceRecords}
                    categories={product.categories}
                    basketLineId={id}
                    size={size}
                    id={product.id}
                    showText={false}
                    inWishlist={inWishlist}
                  />
                </div>
              )}
              {product.stockRecords ? (
                product.stockRecords[0].numInStock < 1 ? (
                  <div
                    className={cs(
                      globalStyles.errorMsg,
                      styles.stockLeft,
                      quantityStyles.errorMsg,
                      quantityStyles.fontStyle
                    )}
                  >
                    Out of stock
                  </div>
                ) : (
                  ""
                )
              ) : (
                ""
              )}
              {showError &&
                !(
                  saleStatus &&
                  childAttributes[0].showStockThreshold &&
                  childAttributes[0].stock > 0 &&
                  childAttributes[0].othersBasketCount > 0
                ) && (
                  <span
                    className={cs(
                      globalStyles.errorMsg,
                      styles.stockLeft,
                      quantityStyles.errorMsg,
                      quantityStyles.fontStyle
                    )}
                  >
                    {error}
                  </span>
                )}

              {saleStatus &&
                childAttributes[0].showStockThreshold &&
                childAttributes[0].stock > 0 && (
                  <span
                    className={cs(
                      globalStyles.errorMsg,
                      styles.stockLeft,
                      quantityStyles.errorMsg,
                      quantityStyles.fontStyle
                    )}
                  >
                    {`Only ${childAttributes[0].stock} Left!`}
                    {childAttributes[0].showStockThreshold &&
                      childAttributes[0].stock > 0 &&
                      childAttributes[0].othersBasketCount > 0 &&
                      ` *${childAttributes[0].othersBasketCount} other${
                        childAttributes[0].othersBasketCount > 1 ? "s" : ""
                      } have this item in their bag`}
                  </span>
                )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default LineItems;
