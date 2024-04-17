import React, { memo, useState, useEffect } from "react";
import cs from "classnames";
import { Link } from "react-router-dom";
import styles from "./styles.scss";
import { BasketItem } from "typings/basket";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
import "../../styles/override.css";
import WishlistButton from "components/WishlistButton";
import globalStyles from "../../styles/global.scss";
import BasketService from "services/basket";
import { useSelector, useStore } from "react-redux";
import bridalRing from "../../images/bridal/rings.svg";
import { AppState } from "reducers/typings";
import CookieService from "services/cookie";
import PdpQuantity from "components/quantity/pdpQuantity";
import { GA_CALLS } from "constants/cookieConsent";
import { displayPriceWithCommas } from "utils/utility";
import addedReg from "../../images/registery/addedReg.svg";

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
    onNotifyCart,
    GCMeta,
    is_free_product
  }) => {
    const [value, setValue] = useState(quantity | 0);
    // const [qtyError, setQtyError] = useState(false);
    // const [qtyErrorMsg, setQtyErrorMsg] = useState("");
    const isLoggedIn = useSelector((state: AppState) => state.user.isLoggedIn);
    let { currency } = useSelector((state: AppState) => state.basket);
    const isSale = useSelector((state: AppState) => state.info.isSale);
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
      groupedProductsCount
    } = product;
    const showDeliveryTimelines = true;
    useEffect(() => {
      setValue(quantity);
    }, [quantity]);

    const handleChange = async (currentvalue: number) => {
      await BasketService.updateToBasket(dispatch, id, currentvalue, "cart")
        .then(res => {
          setValue(currentvalue);
          const userConsent = CookieService.getCookie("consent").split(",");
          if (userConsent.includes(GA_CALLS)) {
            dataLayer.push({
              event: "edit_bag_interactions",
              click_type: currentvalue > value ? "Quantity(+)" : "Quantity(-)"
            });
          }
        })
        .catch(err => {
          // setQtyError(true);
          // setQtyErrorMsg(
          //   `Only ${quantity} piece${
          //     quantity > 1 ? "s" : ""
          //   } available in stock`
          // );
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
        const search = CookieService.getCookie("search") || "";
        const cat1 = categories?.[0]?.split(">");
        const cat2 = categories?.[1]?.split(">");

        const L1 = cat1?.[0]?.trim();

        const L2 = cat1?.[1] ? cat1?.[1]?.trim() : cat2?.[1]?.trim();

        const L3 = cat2?.[2]
          ? cat2?.[2]?.trim()
          : categories?.[2]?.split(">")?.[2]?.trim();

        const clickType = localStorage.getItem("clickType");

        if (userConsent.includes(GA_CALLS)) {
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
          dataLayer.push({
            event: "edit_bag_interactions",
            click_type: "Remove"
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
                    isSale &&
                    childAttributes[0]?.discountedPriceRecords[currency]
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
      } catch (err) {
        console.log("cartPage GTM error!");
      }
    };

    const deleteItem = () => {
      BasketService.deleteBasket(dispatch, id, "cart").then(() => {
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
        <div className={globalStyles.flex}>
          <div
            className={cs(styles.size, { [styles.inline]: mobile || tablet })}
          >
            {size ? "Size: " : "Recipient's Name: "}
          </div>
          {(mobile || tablet) && " "}
          <div
            className={cs({
              [styles.inline]: mobile || tablet
            })}
          >
            {size ? size?.value : GCMeta?.recipeint_name}
          </div>
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
          {color ? "Color: " : "Recipient's Email: "}
          {color ? colorName() : GCMeta?.recipient_email}
        </div>
      ) : (
        ""
      );
    };

    // const showNotifyPopup = () => {
    //   dispatch(
    //     updateComponent(
    //       POPUP.NOTIFYMEPOPUP,
    //       {
    //         basketLineId: id,
    //         price: priceRecords[currency],
    //         currency: currency,
    //         title: title,
    //         childAttributes: childAttributes as ChildProductAttributes[],
    //         selectedIndex: 0,
    //         discount: false,
    //         onNotifyCart: onNotifyCart,
    //         // changeSize:{changeSize},
    //         list: "cart",
    //         sliderImages: plpSliderImages
    //       },
    //       false,
    //       mobile ? ModalStyles.bottomAlign : undefined
    //     )
    //   );
    //   dispatch(updateModal(true));
    // };

    const renderNotifyTrigger = (section: string) => {
      const isOutOfStock = stockRecords[0].numInStock < 1;
      if (isOutOfStock) {
        if (section == "info") {
          return (
            <div>
              <div className={cs(globalStyles.c10LR, styles.outOfStockError)}>
                Out of stock
              </div>
              {/* <div
                className={cs(globalStyles.marginT10, styles.triggerNotify, {
                  [globalStyles.hidden]: !(mobile || tablet)
                })}
                onClick={showNotifyPopup}
              >
                NOTIFY ME &#62;
              </div> */}
            </div>
          );
        }
        // return (
        //   <div
        //     className={cs(globalStyles.marginT10, styles.triggerNotify, {
        //       [globalStyles.hidden]: mobile || tablet
        //     })}
        //     onClick={showNotifyPopup}
        //   >
        //     NOTIFY ME &#62;
        //   </div>
        // );
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
      <div
        className={cs(styles.cartItem, styles.gutter15, styles.cart, {
          [styles.bgColor]: is_free_product
        })}
      >
        <div className={cs(bootstrap.row, styles.cartRow)}>
          <div
            className={cs(
              bootstrap.col4,
              bootstrap.colSm2,
              bootstrap.colLg3,
              styles.desktopImgSize,
              {
                [styles.outOfStock]: stockRecords[0].numInStock < 1,
                [globalStyles.paddR10]: !mobile
              }
            )}
          >
            <div className={globalStyles.relative}>
              <Link to={isGiftCard ? "#" : url}>
                {salesBadgeImage && (
                  <div className={styles.badgePositionPlpMobile}>
                    <img src={salesBadgeImage} alt="Sales Badge Image" />
                  </div>
                )}
                {/* <div className={styles.cartRing}>
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
                  src={imageUrl}
                  alt={product.altText || product.title}
                />
              </Link>
            </div>
          </div>
          <div
            className={cs(
              bootstrap.colLg9,
              bootstrap.colSm10,
              bootstrap.col8,
              styles.desktopDivSize
            )}
          >
            <div className={cs(styles.rowMain, globalStyles.gutterBetween)}>
              <div className={cs(bootstrap.colLg8, bootstrap.col12)}>
                <div className={cs("sectionInfo", styles.sectionInfo)}>
                  <div>
                    {collection && (
                      <div
                        className={cs(styles.collectionName, {
                          [styles.outOfStock]: stockRecords[0].numInStock < 1
                        })}
                      >
                        {collection}
                      </div>
                    )}
                    <div
                      className={cs(styles.productName, {
                        [styles.outOfStock]: stockRecords[0].numInStock < 1
                      })}
                    >
                      <Link to={isGiftCard ? "#" : url}>{title}</Link>
                    </div>
                    <div
                      className={cs(
                        styles.productPrice,
                        styles.productPriceMobile,
                        styles.flexPriceIcon,
                        {
                          [styles.outOfStock]: stockRecords[0].numInStock < 1
                        }
                      )}
                    >
                      {is_free_product ? (
                        <p className={styles.free}>FREE</p>
                      ) : (
                        <div>
                          {saleStatus && discount && discountedPriceRecords ? (
                            <span className={styles.discountprice}>
                              {displayPriceWithCommas(
                                discountedPriceRecords[currency],
                                currency
                              )}
                              &nbsp;&nbsp;&nbsp;
                            </span>
                          ) : (
                            ""
                          )}
                          {saleStatus && discount ? (
                            <span className={styles.strikeprice}>
                              {displayPriceWithCommas(price, currency)}
                            </span>
                          ) : (
                            <span
                              className={
                                badgeType == "B_flat" ? globalStyles.gold : ""
                              }
                            >
                              {displayPriceWithCommas(
                                structure == "GiftCard" ? GCValue : price,
                                currency
                              )}
                            </span>
                          )}
                        </div>
                      )}
                      <div className={cs({ [globalStyles.voffset2]: !mobile })}>
                        {bridalProfile && (
                          <img src={addedReg} width="25" alt="gift_reg_icon" />
                        )}
                      </div>
                    </div>
                    <div className={cs(styles.sizeQtyWrp)}>
                      <div
                        className={cs(styles.productSize, {
                          [styles.outOfStock]: stockRecords[0].numInStock < 1
                        })}
                      >
                        {getSize(attributes, GCMeta)}
                      </div>

                      <div
                        className={cs(styles.productColor, {
                          [styles.outOfStock]: stockRecords[0].numInStock < 1
                        })}
                      >
                        {getColor(attributes, GCMeta)}
                      </div>

                      <div>
                        {/* <div className={styles.size}>QTY</div> */}
                        {is_free_product ? (
                          <p className={styles.size}>Quantity: {value} </p>
                        ) : (
                          <div
                            className={cs(styles.widgetQty, {
                              [styles.outOfStock]:
                                stockRecords[0].numInStock < 1
                            })}
                          >
                            {isGiftCard ? (
                              <>
                                <p
                                  className={cs(
                                    styles.size,
                                    globalStyles.marginT10
                                  )}
                                >
                                  Sender&apos;s Name:
                                </p>
                                <p className={styles.gcName}>
                                  {GCMeta?.sender_name}
                                </p>
                              </>
                            ) : (
                              <PdpQuantity
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
                                isSaleErrorMsgOn={
                                  saleStatus &&
                                  ((childAttributes[0].showStockThreshold &&
                                    childAttributes[0].stock > 0) ||
                                    childAttributes[0].othersBasketCount > 0)
                                }
                                // errorMsg="Available qty in stock is"
                              />
                            )}
                          </div>
                        )}

                        {saleStatus &&
                          ((childAttributes[0].showStockThreshold &&
                            childAttributes[0].stock > 0 &&
                            childAttributes[0].othersBasketCount > 0) ||
                            (childAttributes[0].showStockThreshold &&
                              childAttributes[0].stock > 0)) && (
                            <span
                              className={cs(styles.stockLeft, {
                                [styles.outOfStock]:
                                  stockRecords[0].numInStock < 1
                              })}
                            >
                              {saleStatus &&
                                childAttributes[0].showStockThreshold &&
                                childAttributes[0].stock > 0 &&
                                childAttributes[0].othersBasketCount > 0 &&
                                `${childAttributes[0].othersBasketCount} other${
                                  childAttributes[0].othersBasketCount > 1
                                    ? "s"
                                    : ""
                                } have this item in their bag.`}
                              <br />
                              {saleStatus &&
                                childAttributes[0].showStockThreshold &&
                                childAttributes[0].stock > 0 &&
                                `Only ${childAttributes[0].stock} Left!`}
                            </span>
                          )}
                        {renderNotifyTrigger("info")}
                      </div>
                    </div>
                  </div>
                  <div
                    className={cs(
                      {
                        [globalStyles.hiddenEye]:
                          isGiftCard || bridalProfile || is_free_product
                      },
                      styles.wishlistDisplay,
                      styles.disableMobile,
                      globalStyles.voffset2
                    )}
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
                      showText={true}
                      onMoveToWishlist={onMoveToWishlist}
                      className="wishlist-font"
                      inWishlist={inWishlist}
                      badgeType={badgeType}
                    />
                    {renderNotifyTrigger("action")}
                  </div>
                </div>
              </div>
              <div
                className={cs(
                  bootstrap.colLg4,
                  bootstrap.col12,
                  globalStyles.textRight
                )}
              >
                <div
                  className={cs(styles.section, {
                    [styles.sectionMobile]: mobile || tablet
                  })}
                >
                  {is_free_product ? (
                    <p className={cs(styles.productPrice, styles.free)}>FREE</p>
                  ) : (
                    <div
                      className={cs(styles.productPrice, {
                        [styles.extraWidth]: mobile && !tablet,
                        [styles.outOfStock]: stockRecords[0].numInStock < 1
                      })}
                    >
                      {saleStatus && discount && discountedPriceRecords ? (
                        <span className={styles.discountprice}>
                          {displayPriceWithCommas(
                            discountedPriceRecords[currency],
                            currency
                          )}
                          &nbsp;&nbsp;&nbsp;
                        </span>
                      ) : (
                        ""
                      )}
                      {saleStatus && discount ? (
                        <span className={styles.strikeprice}>
                          {displayPriceWithCommas(price, currency)}
                        </span>
                      ) : (
                        <span
                          className={
                            badgeType == "B_flat" ? globalStyles.gold : ""
                          }
                        >
                          {" "}
                          {structure == "GiftCard"
                            ? displayPriceWithCommas(GCValue, currency)
                            : displayPriceWithCommas(price, currency)}
                        </span>
                      )}
                      <div className={cs({ [globalStyles.voffset2]: !mobile })}>
                        {bridalProfile && (
                          <img src={addedReg} width="25" alt="gift_reg_icon" />
                        )}
                      </div>
                    </div>
                  )}
                  <div
                    className={cs(
                      styles.enableMobile,
                      {
                        [globalStyles.hiddenEye]:
                          isGiftCard || bridalProfile || is_free_product
                      },
                      styles.wishlistDisplay
                    )}
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
                      showText={true}
                      onMoveToWishlist={onMoveToWishlist}
                      className="wishlist-font"
                      inWishlist={inWishlist}
                      badgeType={badgeType}
                    />
                    {renderNotifyTrigger("action")}
                  </div>
                  {!is_free_product && (
                    <div>
                      <div
                        className={cs(styles.pointer, styles.remove)}
                        onClick={() => deleteItem()}
                      >
                        Remove
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {productDeliveryDate && showDeliveryTimelines && (
          <div
            className={cs(styles.deliveryDate, globalStyles.marginT20, {
              [styles.extraWidth]: mobile && !tablet
            })}
          >
            Estimated delivery on or before:
            <span className={styles.expectedDelivetryDate}>
              {productDeliveryDate}
            </span>
          </div>
        )}
        <hr className={styles.hr} />
      </div>
    );
  }
);

export default CartItems;
