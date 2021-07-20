import React, { useEffect, useState } from "react";
import cs from "classnames";
import globalStyles from "styles/global.scss";
import styles from "./orderStyles.scss";
import { OrderProps } from "./typings";
import { Currency, currencyCode } from "typings/currency";
import { Link, useLocation, NavLink, useHistory } from "react-router-dom";
import iconStyles from "styles/iconFonts.scss";
import { useDispatch, useSelector } from "react-redux";
import CheckoutService from "services/checkout";
import BasketService from "services/basket";
import { AppState } from "reducers/typings";
import { updateComponent, updateModal } from "actions/modal";
import { updateDeliveryText } from "actions/info";
import { POPUP } from "constants/components";

const OrderSummary: React.FC<OrderProps> = props => {
  const {
    mobile,
    basket,
    currency,
    page,
    shippingAddress,
    salestatus,
    validbo
  } = props;
  const [showSummary, setShowSummary] = useState(mobile ? false : true);
  const [isSuspended, setIsSuspended] = useState(true);
  const [fullText, setFullText] = useState(false);
  const [freeShipping] = useState(false);
  const code = currencyCode[currency as Currency];
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state: AppState) => state.user);
  const { isSale } = useSelector((state: AppState) => state.info);
  const { deliveryText } = useSelector((state: AppState) => state.info);
  const onArrowButtonClick = () => {
    setShowSummary(!showSummary);
    setIsSuspended(true);
  };

  const showDeliveryTimelines = true;
  const history = useHistory();
  const queryString = history.location.search;
  const urlParams = new URLSearchParams(queryString);
  const boId = urlParams.get("bo_id");

  const removePromo = async (data: FormData) => {
    const response = await CheckoutService.removePromo(dispatch, data);
    BasketService.fetchBasket(dispatch, "checkout", history, isLoggedIn);
    return response;
  };

  const onPromoRemove = (id: string) => {
    const data: any = {
      cardId: id
    };
    removePromo(data);
  };

  const getSize = (data: any) => {
    const size = data.find(function(attribute: any) {
      if (attribute.name == "Size") {
        return attribute;
      }
    });
    return size ? <span>Size: {size.value}</span> : "";
  };

  const getDeliveryStatusMobile = () => {
    const html = [];
    if (!basket.lineItems) return false;
    if (basket.shippable == false) {
      html.push();
    } else {
      html.push(
        <div className={styles.padd}>
          <div>
            {isSuspended ? (
              ""
            ) : (
              <p>
                *Expected Delivery for Wallcoverings- within 40 business days
              </p>
            )}
            {false && (
              <div>
                <p className={globalStyles.cerise}>
                  Apply code: <b>SAVE20</b> at checkout to avail 20% discount on
                  international orders, valid from 1st July till 10th July 2020,
                  midnight IST.
                </p>
                <br />
              </div>
            )}
            {isSuspended && isSale && (
              <>
                <p>
                  {" "}
                  All standard WHO guidelines and relevant precautionary
                  measures are in place, to ensure a safe and secure shopping
                  experience for you.
                </p>
              </>
            )}
            {isSuspended && !isSale && (
              <>
                <p>
                  {" "}
                  All standard WHO guidelines and relevant precautionary
                  measures are in place, to ensure a safe and secure shopping
                  experience for you.
                </p>
              </>
            )}
            {/* *Expected Delivery of Pichwai Art is 15 to 18 business days */}
          </div>
        </div>
      );
    }
    return html;
  };

  const getOrderItems = () => {
    return (
      <div className={cs(styles.orderItems, styles.fixOrderItems)}>
        {basket.lineItems.map(function(item, index) {
          return (
            <div key={index}>
              <div className={globalStyles.voffset1}>
                <div
                  className={cs(globalStyles.flex, globalStyles.gutterBetween)}
                >
                  <span className={styles.collectionName}>
                    {item.product.collections}
                  </span>
                  <span></span>
                </div>
                <div
                  className={cs(globalStyles.flex, globalStyles.gutterBetween)}
                >
                  <span className={styles.productName}>
                    {item.product.title}
                  </span>

                  {salestatus && item.product.discount ? (
                    <span className={styles.productPrice}>
                      <span className={styles.discountprice}>
                        {String.fromCharCode(...code)}{" "}
                        {item.product.structure == "GiftCard"
                          ? parseFloat(item.GCValue.toString()).toFixed(2)
                          : parseFloat(
                              item.product.discountedPriceRecords[
                                currency
                              ].toString()
                            ).toFixed(2)}
                      </span>
                      &nbsp; &nbsp;
                      <span className={styles.strikeprice}>
                        {String.fromCharCode(...code)}{" "}
                        {item.product.structure == "GiftCard"
                          ? parseFloat(item.GCValue.toString()).toFixed(2)
                          : parseFloat(
                              item.product.priceRecords[currency].toString()
                            ).toFixed(2)}{" "}
                      </span>{" "}
                    </span>
                  ) : (
                    <span
                      className={cs(styles.productPrice, {
                        [globalStyles.cerise]:
                          item.product.badgeType == "B_flat"
                      })}
                    >
                      {String.fromCharCode(...code)}{" "}
                      {item.product.structure == "GiftCard"
                        ? parseFloat(item.GCValue.toString()).toFixed(2)
                        : parseFloat(
                            item.product.priceRecords[currency].toString()
                          ).toFixed(2)}
                    </span>
                  )}
                </div>

                <div
                  className={cs(
                    globalStyles.flex,
                    globalStyles.gutterBetween,
                    globalStyles.voffset1
                  )}
                >
                  <span className={styles.productSize}>
                    {getSize(item.product.attributes)}
                  </span>
                  <span className={styles.productQty}>
                    <span>Qty: </span> {item.quantity}
                  </span>
                </div>
              </div>
              <hr className={styles.hr} />
            </div>
          );
        })}
        {mobile && getDeliveryStatusMobile()}
      </div>
    );
  };

  const removeGiftCard = async (data: FormData) => {
    const response = await CheckoutService.removeGiftCard(dispatch, data);
    BasketService.fetchBasket(dispatch, "checkout", history, isLoggedIn);
    return response;
  };

  const removeRedeem = async () => {
    const response = await CheckoutService.removeRedeem(dispatch);
    BasketService.fetchBasket(dispatch, "checkout", history, isLoggedIn);
    return response;
  };

  const onGiftCardRemove = (id: string, type: string) => {
    const data: any = {
      cardId: id,
      type: type
    };
    removeGiftCard(data);
  };

  const getCoupons = () => {
    let coupon = null;
    let giftCard = null;
    let loyalty = null;
    // let voucherDiscount = props.voucher_discounts[0];
    if (basket.voucherDiscounts.length > 0) {
      const couponDetails = basket.voucherDiscounts?.[0];
      if (couponDetails) {
        coupon = basket.voucherDiscounts.map((gift, index: number) => {
          const voucher = gift.voucher;
          return (
            <div
              className={cs(
                globalStyles.flex,
                globalStyles.gutterBetween,
                globalStyles.marginT20,
                globalStyles.crossCenter
              )}
              key={"voucher" + index}
            >
              <span className={styles.subtotal}>
                <span className={cs(globalStyles.marginR10, styles.subtotal)}>
                  {voucher.code}
                </span>
                <span className={styles.textMuted}>
                  {" "}
                  {"PROMO CODE APPLIED"}
                  {boId ? (
                    ""
                  ) : (
                    <span
                      className={styles.cross}
                      onClick={() => {
                        onPromoRemove(voucher.code);
                      }}
                    >
                      <i
                        className={cs(
                          iconStyles.icon,
                          iconStyles.iconCrossNarrowBig,
                          styles.discountFont
                        )}
                      ></i>
                    </span>
                  )}
                </span>
              </span>
              <span className={styles.subtotal}>
                (-) {String.fromCharCode(...code)} {gift.amount}
              </span>
            </div>
          );
        });
      }
    }

    if (basket.giftCards) {
      giftCard = basket.giftCards.map((gift, index: number) => {
        return (
          <div
            className={cs(
              globalStyles.flex,
              globalStyles.gutterBetween,
              globalStyles.marginT20,
              globalStyles.crossCenter
            )}
            key={index}
          >
            <span className={styles.subtotal}>
              <span className={cs(globalStyles.marginR10, styles.subtotal)}>
                {gift.cardId}
              </span>
              <span className={styles.textMuted}>
                {" "}
                {gift.cardType == "CREDITNOTE"
                  ? "CREDIT NOTE APPLIED"
                  : "GIFT CODE APPLIED"}
                <span
                  className={styles.cross}
                  onClick={() => {
                    onGiftCardRemove(gift.cardId, gift.cardType);
                  }}
                >
                  <i
                    className={cs(
                      iconStyles.icon,
                      iconStyles.iconCrossNarrowBig,
                      styles.discountFont
                    )}
                  ></i>
                </span>
              </span>
            </span>
            <span className={styles.subtotal}>
              (-) {String.fromCharCode(...code)} {gift.appliedAmount}
            </span>
          </div>
        );
      });
    }
    const redeemDetails = basket.loyalty?.[0];
    if (redeemDetails) {
      loyalty = (
        <div
          className={cs(
            globalStyles.flex,
            globalStyles.gutterBetween,
            globalStyles.marginT20,
            globalStyles.crossCenter
          )}
          key={"redeems"}
        >
          <span className={styles.subtotal}>
            <span className={cs(globalStyles.marginR10, styles.subtotal)}>
              CERISE POINTS
            </span>
            <span className={styles.textMuted}>
              {" "}
              {"REDEEMED"}
              <span
                className={styles.cross}
                onClick={() => {
                  removeRedeem();
                }}
              >
                <i
                  className={cs(
                    iconStyles.icon,
                    iconStyles.iconCrossNarrowBig,
                    styles.discountFont
                  )}
                ></i>
              </span>
            </span>
          </span>
          <span className={styles.subtotal}>
            (-) {String.fromCharCode(...code)} {redeemDetails.points}
          </span>
        </div>
      );
    }
    return (
      <div>
        {/* {(coupon || giftCard.length > 0) && <hr className="hr"/>} */}
        {coupon}
        {giftCard}
        {loyalty}
      </div>
    );
    // }

    //return null;
  };

  const { pathname } = useLocation();

  const hasOutOfStockItems = () => {
    const items = basket.lineItems;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.product.stockRecords[0].numInStock < 1) {
          return true;
        }
      }
    }
    return false;
  };

  useEffect(() => {
    if (mobile && hasOutOfStockItems()) {
      setShowSummary(true);
      setTimeout(() => {
        document
          .getElementsByClassName(styles.textRemoveItems)[0]
          ?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    }
  }, [basket]);

  const canCheckout = () => {
    if (pathname.indexOf("checkout") > -1) {
      return false;
    }
    if (
      !basket.lineItems ||
      hasOutOfStockItems() ||
      basket.lineItems.length == 0
    ) {
      return false;
    }
    return true;
  };

  const resetInfoPopupCookie = () => {
    const cookieString =
      "checkoutinfopopup3=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    document.cookie = cookieString;
  };
  const chkshipping = (event: any) => {
    const {
      total,
      freeShippingThreshold,
      freeShippingApplicable,
      shippable
    } = basket;
    if (page != "cart") {
      return false;
    }
    if (isSuspended) {
      resetInfoPopupCookie();
    }
    if (
      !freeShipping &&
      total >= freeShippingThreshold &&
      total < freeShippingApplicable &&
      currency == "INR" &&
      shippable
    ) {
      dispatch(
        updateComponent(
          POPUP.FREESHIPPING,
          {
            remainingAmount:
              freeShippingApplicable -
              parseInt((basket.total - basket.shippingCharge).toString()),
            freeShippingApplicable
          },
          true
        )
      );
      dispatch(updateModal(true));
      event.preventDefault();
    }
  };

  const onRemoveOutOfStockItemsClick = () => {
    BasketService.removeOutOfStockItems(dispatch, "cart");
  };

  const goToWishlist = (e: any) => {
    dataLayer.push({
      event: "eventsToSend",
      eventAction: "wishListClick",
      eventCategory: "Click",
      eventLabel: location.pathname
    });
  };
  const saveInstruction = (data: string) => {
    dispatch(updateDeliveryText(data));
    dataLayer.push({
      event: "Delivery Instruction",
      message: data
    });
  };

  const openDeliveryBox = () => {
    dispatch(
      updateComponent(
        POPUP.DELIVERY,
        { saveInstruction: saveInstruction },
        true
      )
    );
    dispatch(updateModal(true));
  };

  const getDiscount = (data: any) => {
    // let initial = 0,
    //     price;
    // if (data.length > 1) {
    //     price = data.reduce((acc, pre) => {
    //         return acc + parseFloat(+pre.amount)
    //     }, 0);
    // } else if (data.length == 1) {
    //     price = initial + (+data[0].amount)
    // }

    return data.length > 0
      ? data.map((discount: any, index: number) => (
          <div
            className={cs(
              globalStyles.flex,
              globalStyles.gutterBetween,
              globalStyles.marginT20
            )}
            key={index + "getDiscount"}
          >
            <span className={styles.subtotal}>
              {discount.name == "price-discount" ? "DISCOUNT" : discount.name}
            </span>
            <span className={styles.subtotal}>
              (-) {String.fromCharCode(...code)}{" "}
              {parseFloat(discount.amount).toFixed(2)}
            </span>
          </div>
        ))
      : "";
  };

  const getSummary = () => {
    let shippingCharge: any = 0;
    if (basket.shippingCharge) {
      shippingCharge = basket.shippingCharge;
    }
    if (basket.lineItems) {
      return (
        <div
          className={
            showSummary
              ? cs(styles.summaryPadding, styles.fixOrderItemsMobile)
              : cs(styles.summaryPadding, globalStyles.hidden)
          }
        >
          {getOrderItems()}
          <div className={cs(globalStyles.flex, globalStyles.gutterBetween)}>
            <span className={styles.subtotal}>SUBTOTAL</span>
            <span className={styles.subtotal}>
              {String.fromCharCode(...code)}{" "}
              {parseFloat("" + basket.subTotal).toFixed(2)}
            </span>
          </div>
          <div
            className={cs(
              globalStyles.flex,
              globalStyles.gutterBetween,
              globalStyles.marginT20
            )}
          >
            <span className={styles.subtotal}>ESTIMATED SHIPPING</span>
            <span className={styles.subtotal}>
              (+) {String.fromCharCode(...code)}{" "}
              {parseFloat(shippingCharge).toFixed(2)}
            </span>
          </div>
          {basket.finalDeliveryDate && showDeliveryTimelines && (
            <div className={styles.deliveryDate}>
              Estimated Delivery On or Before:{" "}
              <span className={styles.black}>{basket.finalDeliveryDate}</span>
            </div>
          )}
          {shippingAddress?.state && (
            <div
              className={cs(
                styles.small,
                styles.selectedStvalue,
                globalStyles.marginT10
              )}
            >
              to {shippingAddress.state} - {shippingAddress.postCode}
            </div>
          )}
          {page == "cart" || basket.isOnlyGiftCart || salestatus ? (
            ""
          ) : (
            <div
              className={cs(
                globalStyles.flex,
                globalStyles.gutterBetween,
                globalStyles.marginT20
              )}
            >
              <span
                className={cs(
                  styles.deliveryfont,
                  globalStyles.cerise,
                  globalStyles.pointer
                )}
                onClick={openDeliveryBox}
              >
                {deliveryText.length == 0 ? "ADD" : "EDIT"} DELIVERY
                INSTRUCTIONS
              </span>
              {/* <span className={styles.subtotal}>
              (+) {String.fromCharCode(...code)}{" "}
              {parseFloat(shippingCharge).toFixed(2)}
            </span> */}
            </div>
          )}
          {deliveryText.length == 0 ||
          page == "cart" ||
          basket.isOnlyGiftCart ||
          salestatus ? (
            ""
          ) : (
            <div className={cs(styles.deliveryDate, styles.wrap)}>
              {fullText ? deliveryText : deliveryText.substr(0, 85)}
              {deliveryText.length > 85 ? (
                <span
                  className={cs(globalStyles.cerise, globalStyles.pointer)}
                  onClick={() => {
                    setFullText(!fullText);
                  }}
                >
                  {" "}
                  [{fullText ? "-" : "+"}]
                </span>
              ) : (
                ""
              )}
            </div>
          )}
          <hr className={styles.hr} />
          <div className={cs(globalStyles.flex, globalStyles.gutterBetween)}>
            <span className={styles.subtotal}>TOTAL</span>
            <span className={styles.subtotal}>
              {String.fromCharCode(...code)}{" "}
              {parseFloat("" + basket.total).toFixed(2)}
            </span>
          </div>
          <hr className={styles.hr} />
          {getDiscount(basket.offerDiscounts)}
          {getCoupons()}
        </div>
      );
    }
    return null;
  };

  // chkshipping = (event: React.MouseEvent) => {
  //   // if (window.ischeckout) {
  //   //     return false;
  //   // }
  //   // const self = this;
  //   if (this.state.isSuspended) {
  //     this.resetInfoPopupCookie();
  //   }
  //   if (
  //     !this.state.freeShipping &&
  //     this.props.cart.total >= 45000 &&
  //     this.props.cart.total < 50000 &&
  //     this.props.currency == "INR" &&
  //     this.props.cart.shippable
  //   ) {
  //     this.props.showShipping(
  //       50000 - parseInt(this.props.cart.total.toString())
  //     );
  //     event.preventDefault();
  //   }
  // };

  return (
    <div className={cs(globalStyles.col12, styles.fixOrdersummary)}>
      <div className={styles.orderSummary}>
        {mobile && (
          <span
            className={cs(styles.btnArrow, globalStyles.colorPrimary)}
            onClick={onArrowButtonClick}
          >
            <i
              className={
                showSummary
                  ? cs(iconStyles.icon, iconStyles.icon_downarrowblack)
                  : cs(iconStyles.icon, iconStyles.icon_uparrowblack)
              }
            ></i>
          </span>
        )}
        <div className={cs(styles.summaryPadding, styles.summaryHeader)}>
          <h3 className={cs(globalStyles.textCenter, styles.summaryTitle)}>
            ORDER SUMMARY
            {page == "checkout" && !validbo ? (
              boId ? (
                ""
              ) : (
                <Link className={styles.editCart} to={"/cart"}>
                  EDIT BAG
                </Link>
              )
            ) : (
              ""
            )}
          </h3>
        </div>
        <div className={styles.justchk}>
          {getSummary()}
          <div className={styles.summaryPadding}>
            <hr className={styles.hr} />
            <div
              className={cs(
                globalStyles.flex,
                globalStyles.gutterBetween,
                styles.total
              )}
            >
              <span className={cs(styles.subtotal, globalStyles.voffset2)}>
                AMOUNT PAYABLE
              </span>
              <span className={cs(styles.grandTotal, globalStyles.voffset2)}>
                {String.fromCharCode(...code)}{" "}
                {parseFloat("" + basket.amountPayable).toFixed(2)}
              </span>
            </div>
            {!mobile && getDeliveryStatusMobile()}
            {currency == "INR" ? (
              ""
            ) : basket.shippable == false ? (
              ""
            ) : (
              <div
                className={cs(
                  globalStyles.c10LR,
                  globalStyles.voffset2,
                  globalStyles.marginB10
                )}
              >
                Custom Duties & Taxes are extra, can be upto 30% or more of
                order value in some cases, depending upon local customs
                assessment.
              </div>
            )}
            {page == "cart" && (
              <div
                className={
                  showSummary ? "" : cs({ [globalStyles.hidden]: mobile })
                }
              >
                <hr className={styles.hr} />
                <NavLink
                  key="cartCheckout"
                  to={canCheckout() ? "/order/checkout/" : "#"}
                >
                  <button
                    onClick={chkshipping}
                    className={
                      canCheckout()
                        ? cs(globalStyles.ceriseBtn, {
                            [globalStyles.hidden]: mobile
                          })
                        : cs(globalStyles.ceriseBtn, globalStyles.disabledBtn, {
                            [globalStyles.hidden]: mobile
                          })
                    }
                  >
                    PROCEED TO CHECKOUT
                  </button>
                </NavLink>
                {hasOutOfStockItems() && (
                  <p
                    className={cs(
                      globalStyles.textCenter,
                      styles.textRemoveItems,
                      globalStyles.colorPrimary
                    )}
                    onClick={onRemoveOutOfStockItemsClick}
                  >
                    Please&nbsp;
                    <span className={styles.triggerRemoveItems}>
                      REMOVE ALL ITEMS
                    </span>
                    &nbsp; which are out of stock to proceed
                  </p>
                )}
                <div
                  className={cs(
                    globalStyles.textCenter,
                    styles.textCoupon,
                    globalStyles.voffset4
                  )}
                >
                  If you have promo code or a gift card code,
                  <br />
                  you can apply the same during payment.
                </div>
                <div className={styles.wishlist}>
                  <Link to="/wishlist" onClick={goToWishlist}>
                    <span>
                      <i
                        className={cs(
                          iconStyles.icon,
                          iconStyles.iconWishlist,
                          styles.font30,
                          globalStyles.pointer
                        )}
                      ></i>
                    </span>
                    &nbsp;
                    <span className={styles.wishlistAlign}>
                      VIEW SAVED ITEMS
                    </span>
                  </Link>
                </div>
              </div>
            )}
          </div>
          {page == "cart" && (
            <div
              className={cs(styles.summaryFooter, {
                [globalStyles.hidden]: !mobile
              })}
            >
              <NavLink
                key="cartCheckoutMobile"
                to={canCheckout() ? "/order/checkout" : "#"}
              >
                <button
                  onClick={chkshipping}
                  className={
                    canCheckout()
                      ? cs(globalStyles.ceriseBtn, styles.posFixed)
                      : cs(
                          globalStyles.ceriseBtn,
                          globalStyles.disabled,
                          styles.posFixed
                        )
                  }
                >
                  PROCEED TO CHECKOUT
                </button>
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
