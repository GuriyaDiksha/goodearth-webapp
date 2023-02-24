import React, { memo, useState, useEffect } from "react";
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
import { updateModal, updateComponent } from "actions/modal";
import ModalStyles from "components/Modal/styles.scss";
import { ChildProductAttributes } from "typings/product";
import { POPUP } from "constants/components";
import bridalRing from "../../images/bridal/rings.svg";
import { AppState } from "reducers/typings";
import CookieService from "services/cookie";
import { GA_CALLS, ANY_ADS } from "constants/cookieConsent";

const CartItems: React.FC<BasketItem> = memo(
  ({
    mobile,
    tablet,
    id,
    bridalProfile,
    giftCardImage,
    quantity,
    product,
    saleStatus,
    GCValue,
    onMoveToWishlist,
    onNotifyCart
  }) => {
    const [value, setValue] = useState(quantity | 0);
    const [qtyError, setQtyError] = useState(false);
    const [qtyErrorMsg, setQtyErrorMsg] = useState("");
    const isLoggedIn = useSelector((state: AppState) => state.user.isLoggedIn);
    let { currency } = useSelector((state: AppState) => state.basket);
    if (!currency) {
      currency = "INR";
    }
    const { dispatch } = useStore();
    const {
      images,
      collection,
      title,
      url,
      priceRecords,
      discount,
      discountedPriceRecords,
      badgeType,
      inWishlist,
      salesBadgeImage,
      childAttributes,
      stockRecords,
      structure,
      productDeliveryDate,
      attributes,
      categories,
      sku,
      plpSliderImages
    } = product;
    const showDeliveryTimelines = true;
    useEffect(() => {
      setValue(quantity);
    }, [quantity]);

    const handleChange = async (value: number) => {
      await BasketService.updateToBasket(dispatch, id, value, "cart")
        .then(res => {
          setValue(value);
        })
        .catch(err => {
          setQtyError(true);
          setQtyErrorMsg(
            `Only ${quantity} piece${
              quantity > 1 ? "s" : ""
            } available in stock`
          );
          throw err;
        });
    };

    const gtmPushDeleteCartItem = () => {
      try {
        const price = saleStatus
          ? product.childAttributes[0].discountedPriceRecords[currency]
          : product.childAttributes[0].priceRecords[currency];
        let category = "";
        if (categories) {
          const index = categories.length - 1;
          category = categories[index]
            ? categories[index].replace(/\s/g, "")
            : "";
          category = category.replace(/>/g, "/");
        }
        const userConsent = CookieService.getCookie("consent").split(",");

        if (userConsent.includes(ANY_ADS)) {
          Moengage.track_event("remove_from_cart", {
            "Product id": sku || childAttributes[0].sku,
            "Product name": title,
            quantity: quantity,
            price: +price,
            Currency: currency,
            "Collection name": collection,
            "Category name": categories[0]
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
                    name: title,
                    id: sku || childAttributes[0].sku,
                    price: price,
                    brand: "Goodearth",
                    category: category,
                    variant: product.childAttributes?.[0].size || "",
                    quantity: quantity
                  }
                ]
              }
            }
          });
        }
        const categoryList = product.categories
          ? product.categories.length > 0
            ? product.categories[product.categories.length - 1].replace(
                />/g,
                "-"
              )
            : ""
          : "";

        let subcategoryname = categoryList ? categoryList.split(" > ") : "";
        if (subcategoryname) {
          subcategoryname = subcategoryname[subcategoryname.length - 1];
        }
        const size =
          attributes.find(attribute => attribute.name == "Size")?.value || "";
        if (userConsent.includes(GA_CALLS)) {
          dataLayer.push({
            "Event Category": "GA Ecommerce",
            "Event Action": "Cart Removal",
            "Event Label": subcategoryname,
            "Time Stamp": new Date().toISOString(),
            "Cart Source": location.href,
            "Product Category": categoryList,
            "Login Status": isLoggedIn ? "logged in" : "logged out",
            "Product Name": product.title,
            "Product ID": product.id,
            Variant: size
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
                  discount:
                    childAttributes[0]?.discountedPriceRecords[currency], // Pass the discount amount
                  index: "",
                  item_brand: "goodearth",
                  item_category: categories[0],
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
      } catch (err) {
        console.log("cartPage GTM error!");
      }
    };

    const deleteItem = () => {
      BasketService.deleteBasket(dispatch, id, "cart").then(() => {
        gtmPushDeleteCartItem();
      });
    };

    const getSize = (data: any) => {
      const size = data.find(function(attribute: any) {
        if (attribute.name == "Size") {
          return attribute;
        }
      });
      return size ? (
        <div className={styles.sizeWrp}>
          <div
            className={cs(styles.size, { [styles.inline]: mobile || tablet })}
          >
            Size:{" "}
          </div>
          {(mobile || tablet) && " "}
          <div
            className={cs(styles.productSize, {
              [styles.inline]: mobile || tablet
            })}
          >
            {size.value}
          </div>
        </div>
      ) : (
        ""
      );
    };

    const showNotifyPopup = () => {
      dispatch(
        updateComponent(
          POPUP.NOTIFYMEPOPUP,
          {
            basketLineId: id,
            price: priceRecords[currency],
            currency: currency,
            title: title,
            childAttributes: childAttributes as ChildProductAttributes[],
            selectedIndex: 0,
            discount: false,
            onNotifyCart: onNotifyCart,
            // changeSize:{changeSize},
            list: "cart",
            sliderImages: plpSliderImages
          },
          false,
          ModalStyles.bottomAlign
        )
      );
      dispatch(updateModal(true));
    };

    const renderNotifyTrigger = (section: string) => {
      const isOutOfStock = stockRecords[0].numInStock < 1;
      if (isOutOfStock) {
        if (section == "info") {
          return (
            <div>
              <div
                className={cs(
                  globalStyles.italic,
                  globalStyles.marginT10,
                  globalStyles.bold,
                  globalStyles.c10LR,
                  globalStyles.cerise
                )}
              >
                Out of stock
              </div>
              <div
                className={cs(globalStyles.marginT10, styles.triggerNotify, {
                  [globalStyles.hidden]: !(mobile || tablet)
                })}
                onClick={showNotifyPopup}
              >
                NOTIFY ME &#62;
              </div>
            </div>
          );
        }
        return (
          <div
            className={cs(globalStyles.marginT10, styles.triggerNotify, {
              [globalStyles.hidden]: mobile || tablet
            })}
            onClick={showNotifyPopup}
          >
            NOTIFY ME &#62;
          </div>
        );
      }

      return null;
    };

    const price = priceRecords[currency];
    const imageUrl =
      structure == "GiftCard"
        ? giftCardImage
        : images && images.length > 0
        ? images[0].productImage
        : "";
    const isGiftCard = structure.toLowerCase() == "giftcard";
    return (
      <div className={cs(styles.cartItem, styles.gutter15, styles.cart)}>
        <div className={bootstrap.row}>
          <div
            className={cs(
              bootstrap.col5,
              bootstrap.colMd4,
              bootstrap.colLg2,
              styles.cartPadding
            )}
          >
            <div className={globalStyles.relative}>
              <Link to={isGiftCard ? "#" : url}>
                {salesBadgeImage && (
                  <div className={styles.badgePositionPlpMobile}>
                    <img src={salesBadgeImage} />
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
                  src={imageUrl}
                  alt={product.altText || product.title}
                />
              </Link>
            </div>
          </div>
          <div
            className={cs(
              bootstrap.colLg8,
              bootstrap.col5,
              bootstrap.colMd6,
              styles.cartPadding
            )}
          >
            <div className={styles.rowMain}>
              <div className={cs(bootstrap.colLg6, bootstrap.col12)}>
                <div className={cs(styles.section, styles.sectionInfo)}>
                  <div>
                    <div className={styles.collectionName}>{collection}</div>
                    <div className={styles.productName}>
                      <Link to={isGiftCard ? "#" : url}>{title}</Link>
                    </div>
                    <div className={styles.sizeQtyWrp}>
                      <div className={styles.productSize}>
                        {getSize(attributes)}
                      </div>
                      <div>
                        {/* <div className={styles.size}>QTY</div> */}
                        <div className={styles.widgetQty}>
                          <Quantity
                            source="cartpage"
                            key={id}
                            id={id}
                            currentValue={value}
                            minValue={1}
                            maxValue={1000}
                            onChange={x => null}
                            onUpdate={handleChange}
                            class="my-quantity"
                            disabled={
                              stockRecords && stockRecords[0].numInStock < 1
                            }
                            // errorMsg="Available qty in stock is"
                          />
                        </div>
                        {qtyError &&
                          !(
                            saleStatus &&
                            childAttributes[0].showStockThreshold &&
                            childAttributes[0].stock > 0 &&
                            childAttributes[0].othersBasketCount > 0
                          ) && (
                            <span
                              className={cs(
                                globalStyles.errorMsg,
                                styles.stockLeft
                                // {
                                // [styles.stockLeftWithError]: qtyError
                                // }
                              )}
                            >
                              {qtyErrorMsg}
                            </span>
                          )}
                        <span
                          className={cs(
                            globalStyles.errorMsg,
                            styles.stockLeft
                            // {
                            //   [styles.stockLeftWithError]: qtyError
                            // }
                          )}
                        >
                          {saleStatus &&
                            childAttributes[0].showStockThreshold &&
                            childAttributes[0].stock > 0 &&
                            `Only ${childAttributes[0].stock} Left!`}
                          <br />
                          {saleStatus &&
                            childAttributes[0].showStockThreshold &&
                            childAttributes[0].stock > 0 &&
                            childAttributes[0].othersBasketCount > 0 &&
                            ` *${childAttributes[0].othersBasketCount} other${
                              childAttributes[0].othersBasketCount > 1
                                ? "s"
                                : ""
                            } have this item in their bag.`}
                        </span>
                        {renderNotifyTrigger("info")}
                      </div>
                    </div>
                    <div
                      className={cs({
                        [globalStyles.hiddenEye]: isGiftCard || bridalProfile
                      })}
                    >
                      <WishlistButton
                        source="cart"
                        gtmListType="cart"
                        title={title}
                        childAttributes={childAttributes ? childAttributes : []}
                        priceRecords={priceRecords}
                        discountedPriceRecords={discountedPriceRecords}
                        categories={categories}
                        basketLineId={id}
                        id={product.id}
                        size={childAttributes[0].size || ""}
                        showText={false}
                        onMoveToWishlist={onMoveToWishlist}
                        className="wishlist-font"
                        inWishlist={inWishlist}
                      />
                      {renderNotifyTrigger("action")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={cs(
              bootstrap.colMd2,
              bootstrap.col2,
              globalStyles.textCenter,
              styles.cartPadding
            )}
          >
            <div
              className={cs(styles.section, {
                [styles.sectionMobile]: mobile || tablet
              })}
            >
              <div
                className={cs(styles.productPrice, {
                  [styles.extraWidth]: mobile && !tablet
                })}
              >
                {saleStatus && discount && discountedPriceRecords ? (
                  <span className={styles.discountprice}>
                    {String.fromCharCode(...currencyCodes[currency])}
                    &nbsp;
                    {discountedPriceRecords[currency]}
                    &nbsp;&nbsp;&nbsp;
                  </span>
                ) : (
                  ""
                )}
                {saleStatus && discount ? (
                  <span className={styles.strikeprice}>
                    {String.fromCharCode(...currencyCodes[currency])}
                    &nbsp;
                    {price}
                  </span>
                ) : (
                  <span
                    className={badgeType == "B_flat" ? globalStyles.cerise : ""}
                  >
                    {" "}
                    {String.fromCharCode(...currencyCodes[currency])}
                    &nbsp;
                    {structure == "GiftCard" ? GCValue : price}
                  </span>
                )}
              </div>
              <div className={cs(styles.pointer, styles.remove)}>Remove</div>
            </div>
          </div>
        </div>
        {productDeliveryDate && showDeliveryTimelines && (
          <div
            className={cs(styles.deliveryDate, globalStyles.voffset3, {
              [styles.extraWidth]: mobile && !tablet
            })}
          >
            Estimated Delivery:
            <span>{productDeliveryDate}</span>
          </div>
        )}
        <hr className={styles.hr} />
      </div>
    );
  }
);

export default CartItems;
