import React, { memo, useState } from "react";
import cs from "classnames";
import { Link, useHistory } from "react-router-dom";
import styles from "./styles_new.scss";
import { BasketItem } from "typings/basket";
import "../../styles/override.css";
import WishlistButton from "components/WishlistButton";
import globalStyles from "../../styles/global.scss";
import BasketService from "services/basket";
import { useSelector, useStore } from "react-redux";
import bridalRing from "../../images/bridal/rings.svg";
import { AppState } from "reducers/typings";
import quantityStyles from "../quantity/styles.scss";
import CookieService from "services/cookie";
import WishlistService from "services/wishlist";
import { GA_CALLS } from "constants/cookieConsent";
import PdpQuantity from "components/quantity/pdpQuantity";
import { showGrowlMessage } from "utils/validate";
import { updateBasket } from "actions/basket";
import { displayPriceWithCommas } from "utils/utility";
import { currencyCodes } from "constants/currency";
import addedReg from "../../images/registery/addedReg.svg";

const LineItems: React.FC<BasketItem> = memo(
  ({
    id,
    bridalProfile,
    giftCardImage,
    quantity,
    product,
    saleStatus,
    toggleBag,
    GCValue,
    GCMeta,
    is_free_product
  }) => {
    const [value, setValue] = useState(quantity | 0);
    // const [qtyError, setQtyError] = useState(false);
    let {
      basket: { currency }
    } = useSelector((state: AppState) => state);
    const {
      user: { isLoggedIn },
      info: { isSale }
    } = useSelector((state: AppState) => state);
    if (!currency) {
      currency = "INR";
    }
    const { dispatch } = useStore();
    const history = useHistory();
    // const [showError, setShowError] = useState(false);
    // const [error, setError] = useState("");

    const handleChange = async (currentvalue: number) => {
      await BasketService.updateToBasket(dispatch, id, currentvalue)
        .then(res => {
          setValue(currentvalue);
          dataLayer.push({
            event: "edit_mini_bag_interactions",
            click_type: currentvalue > value ? "Quantity(+)" : "Quantity(-)"
          });
        })
        .catch(err => {
          // setShowError(true);
          // setError(
          //   `Only ${quantity} piece${
          //     quantity > 1 ? "s" : ""
          //   } available in stock`
          // );
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
              const res = await WishlistService.undoMoveToWishlist(
                dispatch,
                history.location.pathname.includes("shared-wishlist")
              );
              dispatch(updateBasket(res.basket));
            }}
          >
            Undo
          </span>
        </div>
      );
      const userConsent = CookieService.getCookie("consent").split(",");
      if (userConsent.includes(GA_CALLS)) {
        dataLayer.push({
          event: "edit_mini_bag_interactions",
          click_type: "Save for later"
        });
      }
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
      childAttributes,
      groupedProductsCount,
      badge_text
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
      const search = CookieService.getCookie("search") || "";

      const cat1 = product.categories?.[0]?.split(">");
      const cat2 = product.categories?.[1]?.split(">");

      const L1 = cat1?.[0]?.trim();

      const L2 = cat1?.[1] ? cat1?.[1]?.trim() : cat2?.[1]?.trim();

      const L3 = cat2?.[2]
        ? cat2?.[2]?.trim()
        : product.categories?.[2]?.split(">")?.[2]?.trim();

      const clickType = localStorage.getItem("clickType");

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
          event: "edit_mini_bag_interactions",
          click_type: "Remove"
        });

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
          previous_page_url: CookieService.getCookie("prevUrl"),
          currency: currency,
          value: childAttributes[0]?.discountedPriceRecords[currency]
            ? childAttributes[0]?.discountedPriceRecords[currency]
            : price
            ? price
            : null,
          ecommerce: {
            items: [
              {
                item_id: product.sku || product.childAttributes[0].sku,
                item_name: product.title,
                affiliation: product.title,
                coupon: "NA", // Pass the coupon if available
                currency: currency, // Pass the currency code
                discount:
                  isSale && childAttributes[0]?.discountedPriceRecords[currency]
                    ? badgeType == "B_flat"
                      ? childAttributes[0]?.discountedPriceRecords[currency]
                      : price -
                        childAttributes[0]?.discountedPriceRecords[currency]
                    : "NA", // Pass the discount amount
                index: "NA",
                item_brand: "goodearth",
                item_category: L1,
                item_category2: L2,
                item_category3: L3,
                item_category4: "NA",
                item_category5: "NA",
                item_list_id: "NA",
                item_list_name: search ? `${clickType}-${search}` : "NA",
                item_variant: size || "NA",
                price: price,
                quantity: quantity,
                collection_category: product?.collections?.join("|"),
                price_range: "NA"
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

    const getSize = (data: any, GCMeta: any) => {
      const size = data.find(function(attribute: any) {
        if (attribute.name == "Size") {
          return attribute;
        }
      });
      return size || GCMeta ? (
        <div className={styles.size}>
          {" "}
          {size ? "Size: " : "Recipient's Name: "}{" "}
          {size ? size?.value : GCMeta?.recipeint_name}
        </div>
      ) : (
        ""
      );
    };

    const getColor = (data: any, GCMeta: any) => {
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

      return (color && groupedProductsCount && groupedProductsCount > 0) ||
        GCMeta ? (
        <div className={styles.color}>
          {color ? "Color: " : "Recipient's Email: "}{" "}
          {color ? colorName() : GCMeta?.recipient_email}
        </div>
      ) : (
        ""
      );
    };

    const price = priceRecords[currency];
    const isGiftCard = product.structure.toLowerCase() == "giftcard";
    return (
      <div
        className={cs(styles.cartItem, styles.gutter15, "cart-item", {
          [styles.bgColor]: is_free_product
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
                    <img width="200" src={salesBadgeImage} alt="sales-badge" />
                  </div>
                )}
                {/* <div className={cs(styles.cartRing, styles.bridalIcon)}>
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
                </div> */}
                <img
                  className={styles.productImage}
                  alt={product.altText || product.title}
                  width="200"
                  src={
                    isGiftCard
                      ? giftCardImage
                      : images && images.length > 0
                      ? images[0].productImage
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
              {badge_text && (
                <div
                  className={cs(
                    globalStyles.badgeContainer,
                    globalStyles.grey,
                    globalStyles.marginT10
                  )}
                >
                  {badge_text}
                </div>
              )}
              <div className={bridalProfile ? styles.flexPriceIcon : ""}>
                {is_free_product ? (
                  <p className={cs(styles.productPrice, styles.free)}>FREE</p>
                ) : (
                  <div
                    className={cs(
                      styles.productPrice,
                      product.stockRecords[0].numInStock < 1 &&
                        styles.outOfStock
                    )}
                  >
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
                          badgeType == "B_flat" ? globalStyles.gold : ""
                        }
                      >
                        {" "}
                        {isGiftCard
                          ? displayPriceWithCommas(GCValue, currency)
                          : displayPriceWithCommas(price, currency)}
                      </span>
                    )}
                  </div>
                )}
                <div className={globalStyles.voffset2}>
                  {bridalProfile && (
                    <img src={addedReg} width="25" alt="gift_reg_icon" />
                  )}
                </div>
              </div>
              <div
                className={cs(
                  styles.productSize,
                  product.stockRecords[0].numInStock < 1 && styles.outOfStock
                )}
              >
                {getSize(product.attributes, GCMeta)}
              </div>

              <div
                className={cs(
                  styles.productColor,
                  product.stockRecords[0].numInStock < 1 && styles.outOfStock
                )}
              >
                {getColor(product.attributes, GCMeta)}
              </div>

              {is_free_product ? (
                <p className={styles.freeQuantity}>Quantity: {value} </p>
              ) : (
                <div
                  className={cs(
                    styles.widgetQty,
                    product.stockRecords[0].numInStock < 1 && styles.outOfStock
                  )}
                >
                  {isGiftCard ? (
                    <>
                      <p className={cs(styles.gcTitle)}>Sender&apos;s Name:</p>
                      <p className={styles.gcName}>{GCMeta?.sender_name}</p>
                    </>
                  ) : (
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
                      isSaleErrorMsgOn={
                        saleStatus &&
                        ((childAttributes[0].showStockThreshold &&
                          childAttributes[0].stock > 0) ||
                          childAttributes[0].othersBasketCount > 0)
                      }
                    />
                  )}
                </div>
              )}

              {saleStatus && (
                <span
                  className={cs(styles.stockLeft, {
                    [styles.outOfStock]: product.stockRecords[0].numInStock < 1
                  })}
                >
                  {saleStatus &&
                    childAttributes[0].showStockThreshold &&
                    childAttributes[0].stock > 0 &&
                    childAttributes[0].othersBasketCount > 0 &&
                    `${childAttributes[0].othersBasketCount} other${
                      childAttributes[0].othersBasketCount > 1 ? "s" : ""
                    } have this item in their bag.`}
                  {/* <br /> */}
                  {saleStatus &&
                    childAttributes[0].showStockThreshold &&
                    childAttributes[0].stock > 0 &&
                    ` Only ${childAttributes[0].stock} Left!`}
                </span>
              )}

              {product.stockRecords ? (
                product.stockRecords[0].numInStock < 1 ? (
                  <div
                    className={cs(
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
              {/* {showError &&
                !(
                  (
                    saleStatus &&
                    childAttributes[0].showStockThreshold &&
                    childAttributes[0].stock > 0
                  )
                  //   childAttributes[0].othersBasketCount > 0
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
                )} */}

              {!is_free_product && (
                <div
                  className={cs(
                    styles.productActions,
                    globalStyles.flex,
                    globalStyles.gutterBetween
                  )}
                >
                  <div
                    className={cs(
                      globalStyles.textCenter,
                      styles.wishlistDisplay
                    )}
                  >
                    {bridalProfile || isGiftCard ? null : (
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
                        badgeType={badgeType}
                      />
                    )}
                  </div>

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
              )}
            </div>
          </div>
        </div>
        {/* {productDeliveryDate && (
          <div className={cs(styles.deliveryDate, globalStyles.voffset3)}>
            Estimated delivery:
            <span>{productDeliveryDate}</span>
          </div>
        )} */}
      </div>
    );
  }
);

export default LineItems;
