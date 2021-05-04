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
import { useStore } from "react-redux";
import { updateModal, updateComponent } from "actions/modal";
import ModalStyles from "components/Modal/styles.scss";
import { ChildProductAttributes } from "typings/product";
import { POPUP } from "constants/components";
import bridalRing from "../../images/bridal/rings.svg";

const CartItems: React.FC<BasketItem> = memo(
  ({
    mobile,
    id,
    bridalProfile,
    giftCardImage,
    quantity,
    product,
    currency,
    saleStatus,
    GCValue,
    onMoveToWishlist,
    onNotifyCart
  }) => {
    const [value, setValue] = useState(quantity | 0);
    const { dispatch } = useStore();

    const showDeliveryTimelines = false;
    useEffect(() => {
      setValue(quantity);
    }, [quantity]);

    const handleChange = async (value: number) => {
      await BasketService.updateToBasket(dispatch, id, value, "cart").then(
        res => {
          setValue(value);
        }
      );
    };

    const gtmPushDeleteCartItem = () => {
      try {
        const price = saleStatus
          ? product.discountedPriceRecords[currency]
          : product.priceRecords[currency];
        let category = "";
        if (product.categories) {
          const index = product.categories.length - 1;
          category = product.categories[index]
            ? product.categories[index].replace(/\s/g, "")
            : "";
          category = category.replace(/>/g, "/");
        }

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
                  // 'variant': product.ga_variant,
                  variant: product.childAttributes?.[0].size || "",
                  list:
                    location.href.indexOf("cart") != -1
                      ? `Cart ${location.pathname}`
                      : `Checkout ${location.pathname}`,
                  quantity: quantity
                }
              ]
            }
          }
        });
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
        <div>
          <div className={cs(styles.size, { [styles.inline]: mobile })}>
            Size:{" "}
          </div>
          {mobile && " "}
          <div className={cs(styles.productSize, { [styles.inline]: mobile })}>
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
            price: product.priceRecords[currency],
            currency: currency,
            title: product.title,
            childAttributes: product.childAttributes as ChildProductAttributes[],
            selectedIndex: 0,
            discount: false,
            onNotifyCart: onNotifyCart,
            // changeSize:{changeSize},
            list: "cart"
          },
          false,
          ModalStyles.bottomAlign
        )
      );
      dispatch(updateModal(true));
    };

    const renderNotifyTrigger = (section: string) => {
      const isOutOfStock = product.stockRecords[0].numInStock < 1;
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
                  [globalStyles.hidden]: !mobile
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
              [globalStyles.hidden]: mobile
            })}
            onClick={showNotifyPopup}
          >
            NOTIFY ME &#62;
          </div>
        );
      }

      return null;
    };
    const {
      images,
      collections,
      title,
      url,
      priceRecords,
      discount,
      discountedPriceRecords,
      badgeType,
      inWishlist
    } = product;

    const price = priceRecords[currency];
    const imageUrl =
      product.structure == "GiftCard"
        ? giftCardImage
        : images && images.length > 0
        ? images[0].productImage
        : "";
    const isGiftCard = product.structure.toLowerCase() == "giftcard";

    return (
      <div className={cs(styles.cartItem, styles.gutter15, styles.cart)}>
        <div className={bootstrap.row}>
          <div
            className={cs(bootstrap.col5, bootstrap.colMd2, styles.cartPadding)}
          >
            <div className={styles.cartRing}>
              {bridalProfile && (
                <svg
                  viewBox="-5 -5 50 50"
                  width="40"
                  height="40"
                  preserveAspectRatio="xMidYMid meet"
                  x="0"
                  y="0"
                  className={styles.ceriseBridalRings}
                >
                  <use xlinkHref={`${bridalRing}#bridal-ring`}></use>
                </svg>
              )}
            </div>
            <Link to={isGiftCard ? "#" : url}>
              <img className={styles.productImage} src={imageUrl} />
            </Link>
          </div>
          <div
            className={cs(bootstrap.colMd8, bootstrap.col5, styles.cartPadding)}
          >
            <div className={styles.rowMain}>
              <div className={cs(bootstrap.colMd6, bootstrap.col12)}>
                <div className={cs(styles.section, styles.sectionInfo)}>
                  <div>
                    <div className={styles.collectionName}>
                      {collections[0]}
                    </div>
                    <div className={styles.productName}>
                      <Link to={isGiftCard ? "#" : url}>{title}</Link>
                    </div>
                    {product.productDeliveryDate && showDeliveryTimelines && (
                      <div
                        className={cs(
                          styles.deliveryDate,
                          globalStyles.voffset3,
                          { [styles.extraWidth]: mobile }
                        )}
                      >
                        Estimated Delivery On or Before: <br />
                        <span className={styles.black}>
                          {product.productDeliveryDate}
                        </span>
                      </div>
                    )}
                  </div>
                  <div
                    className={cs(styles.productPrice, {
                      [styles.extraWidth]: mobile
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
                        className={
                          badgeType == "B_flat" ? globalStyles.cerise : ""
                        }
                      >
                        {" "}
                        {String.fromCharCode(...currencyCodes[currency])}
                        &nbsp;
                        {product.structure == "GiftCard" ? GCValue : price}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className={cs(bootstrap.colMd6, bootstrap.col12)}>
                <div
                  className={cs(styles.section, styles.sectionMiddle, {
                    [globalStyles.hiddenEye]: isGiftCard,
                    [styles.extraWidth]: mobile
                  })}
                >
                  <div className={styles.productSize}>
                    {getSize(product.attributes)}
                  </div>
                  <div>
                    <div className={styles.size}>QTY</div>
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
                          product.stockRecords &&
                          product.stockRecords[0].numInStock < 1
                        }
                        // errorMsg="Available qty in stock is"
                      />
                    </div>
                    {renderNotifyTrigger("info")}
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
            <div className={styles.section}>
              <div className={cs(styles.pointer, styles.remove)}>
                <i
                  className={cs(
                    iconStyles.icon,
                    iconStyles.iconCrossNarrowBig,
                    styles.crossiconItem
                  )}
                  onClick={deleteItem}
                ></i>
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
                  childAttributes={
                    product.childAttributes ? product.childAttributes : []
                  }
                  priceRecords={priceRecords}
                  discountedPriceRecords={discountedPriceRecords}
                  categories={product.categories}
                  basketLineId={id}
                  id={product.id}
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
        <hr className={styles.hr} />
      </div>
    );
  }
);

export default CartItems;
