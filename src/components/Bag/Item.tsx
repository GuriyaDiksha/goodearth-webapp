import React, { memo, useState } from "react";
import cs from "classnames";
import { Link } from "react-router-dom";
// import styles from "./styles.scss";
import styles from "./styles_new.scss";
import { BasketItem } from "typings/basket";
// import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
// import Quantity from "components/quantity";
import "../../styles/override.css";
import { currencyCodes } from "constants/currency";
import WishlistButton from "components/WishlistButton";
import globalStyles from "../../styles/global.scss";
// import iconStyles from "../../styles/iconFonts.scss";
import BasketService from "services/basket";
import { useSelector, useStore } from "react-redux";
import bridalRing from "../../images/bridal/rings.svg";
import { AppState } from "reducers/typings";
import quantityStyles from "../quantity/styles.scss";
import CookieService from "services/cookie";
import WishlistService from "services/wishlist";
import { GA_CALLS, ANY_ADS } from "constants/cookieConsent";
import PdpQuantity from "components/quantity/pdpQuantity";
import { showGrowlMessage } from "utils/validate";
import { updateBasket } from "actions/basket";
import { displayPriceWithCommas } from "utils/utility";
import { forEach } from "lodash";

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

    const onMoveToWishlist = () => {
      const msg = (
        <div>
          Your item has been moved to saved items.&nbsp;&nbsp;
          <span
            className={cs(globalStyles.linkTextUnderline, globalStyles.pointer)}
            onClick={async () => {
              const res = await WishlistService.undoMoveToWishlist(dispatch);
              dispatch(updateBasket(res.basket));
            }}
          >
            Undo
          </span>
        </div>
      );
      showGrowlMessage(dispatch, msg, 18000);
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
      if (userConsent.includes(ANY_ADS)) {
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

    const getColor = (data: any) => {
      const color = data.find(function(attribute: any) {
        if (attribute.name == "Color") {
          return attribute;
        }
      });
      const colorName = () => {
        let cName = color.value
          .split("-")
          .slice(1)
          .join();
        if (cName[cName.length - 1] == "s") {
          cName = cName.slice(0, -1);
        }
        return cName;
      };

      return color ? (
        <div className={styles.color}>Color: {colorName()}</div>
      ) : (
        ""
      );
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
        <div className={cs(globalStyles.flex, styles.row)}>
          <div
            className={cs(
              styles.productImage,
              product.stockRecords[0].numInStock < 1 && styles.outOfStock
            )}
          >
            {/* <div className={cs(styles.productImage)}> */}
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
          <div className={styles.productDetails}>
            {/* <div className={styles.collectionName}>{collection}</div> */}
            <div className={cs(styles.name)}>
              <div
                className={cs(
                  styles.productTitle,
                  product.stockRecords[0].numInStock < 1 && styles.outOfStock
                )}
              >
                <Link to={isGiftCard ? "#" : url} onClick={toggleBag}>
                  {title}
                </Link>
              </div>
              <div
                className={cs(
                  styles.productPrice,
                  product.stockRecords[0].numInStock < 1 && styles.outOfStock
                )}
              >
                {saleStatus && discount && discountedPriceRecords ? (
                  <span className={styles.discountprice}>
                    {String.fromCharCode(...currencyCodes[currency])}
                    &nbsp;
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
                    {String.fromCharCode(...currencyCodes[currency])}
                    &nbsp;
                    {isGiftCard
                      ? displayPriceWithCommas(GCValue, currency)
                      : displayPriceWithCommas(price, currency)}
                  </span>
                ) : (
                  <span
                    className={badgeType == "B_flat" ? globalStyles.cerise : ""}
                  >
                    {" "}
                    {String.fromCharCode(...currencyCodes[currency])}
                    &nbsp;
                    {isGiftCard
                      ? displayPriceWithCommas(GCValue, currency)
                      : displayPriceWithCommas(price, currency)}
                  </span>
                )}
              </div>
              <div
                className={cs(
                  styles.productSize,
                  product.stockRecords[0].numInStock < 1 && styles.outOfStock
                )}
              >
                {getSize(product.attributes)}
              </div>
              <div
                className={cs(
                  styles.productColor,
                  product.stockRecords[0].numInStock < 1 && styles.outOfStock
                )}
              >
                {getColor(product.attributes)}
              </div>
              {!isGiftCard && (
                <div
                  className={cs(
                    styles.widgetQty,
                    product.stockRecords[0].numInStock < 1 && styles.outOfStock
                  )}
                >
                  <PdpQuantity
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
                  />
                </div>
              )}
              {product.stockRecords ? (
                product.stockRecords[0].numInStock < 1 ? (
                  <div
                    className={cs(
                      globalStyles.errorMsg,
                      styles.stockLeftError,
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
              <div
                className={cs(
                  styles.productActions,
                  globalStyles.flex,
                  globalStyles.gutterBetween
                )}
              >
                {!bridalProfile && (
                  <div
                    className={cs(
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
                      showText={true}
                      inWishlist={inWishlist}
                      onMoveToWishlist={onMoveToWishlist}
                    />
                  </div>
                )}
                <div
                  className={cs(
                    styles.pointer,
                    styles.textCenter,
                    styles.remove
                  )}
                >
                  <span onClick={deleteItem}>REMOVE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default LineItems;
