import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import cs from "classnames";
import globalStyles from "styles/global.scss";
import styles from "./orderStyles.scss";
import paymentStyles from "../styles.scss";
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
import CookieService from "services/cookie";
import { GA_CALLS } from "constants/cookieConsent";
import { displayPriceWithCommasFloat } from "utils/utility";

import checkoutIcon from "../../../images/checkout.svg";
import freeShippingInfoIcon from "../../../images/free_shipping_info.svg";
import { invalid } from "moment";
import { currencyCodes } from "constants/currency";

const OrderSummary: React.FC<OrderProps> = props => {
  const {
    mobile,
    basket,
    page,
    shippingAddress,
    salestatus,
    validbo,
    setCheckoutMobileOrderSummary,
    onsubmit,
    isLoading,
    currentmethod,
    isPaymentNeeded
  } = props;
  const [isSuspended, setIsSuspended] = useState(true);
  const [fullText, setFullText] = useState(false);
  const [freeShipping] = useState(false);
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state: AppState) => state.user);
  const canUseDOM = !!(
    typeof window !== "undefined" &&
    typeof window.document !== "undefined" &&
    typeof window.document.createElement !== "undefined"
  );

  const useIsomorphicLayoutEffect = canUseDOM ? useLayoutEffect : useEffect;

  // Begin: Intersection Observer (Mobile)
  const [previewTriggerStatus, setPreviewTriggerStatus] = useState(false);

  const [checkoutOrderSummaryStatus, setCheckoutOrderSummaryStatus] = useState(
    false
  );

  const orderSummaryRef = useRef(null);
  const orderSummaryRefCheckout = useRef(null);
  let observer: any;

  const handleScroll = () => {
    const observerOptions = {
      rootMargin: "-130px 0px -170px 0px"
    };
    const interSectionCallBack = (enteries: any) => {
      setPreviewTriggerStatus(enteries[0].isIntersecting);
      setCheckoutMobileOrderSummary(enteries[0].isIntersecting);
    };
    observer = new IntersectionObserver(interSectionCallBack, observerOptions);
    observer.observe(orderSummaryRef.current, orderSummaryRefCheckout.current);
  };
  useIsomorphicLayoutEffect(() => {
    handleScroll();
    return () =>
      observer?.unobserve(
        orderSummaryRef?.current,
        orderSummaryRefCheckout?.current
      );
  }, []);
  // End: Intersection Observer (Mobile)

  const { isSale, showDeliveryInstruction, deliveryText } = useSelector(
    (state: AppState) => state.info
  );
  let { currency } = useSelector((state: AppState) => state.basket);
  if (!currency) {
    currency = "INR";
  }
  const code = currencyCode[currency as Currency];
  const onArrowButtonClick = () => {
    setIsSuspended(true);
    // orderSummaryRef.current
    if (orderSummaryRef && orderSummaryRef?.current) {
      (orderSummaryRef?.current as HTMLDivElement)?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  };

  const CheckoutOrderSummaryHandler = () => {
    setCheckoutOrderSummaryStatus(!checkoutOrderSummaryStatus);
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
        <div className={cs(styles.summaryPadding, styles.padd)}>
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
                <p className={styles.summaryPadding}>
                  {" "}
                  All standard WHO guidelines and relevant precautionary
                  measures are in place, to ensure a safe and secure shopping
                  experience for you.
                </p>
              </>
            )}
            {isSuspended && !isSale && (
              <>
                {/* <hr className={styles.hr} /> */}
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
              <div
                className={cs(
                  globalStyles.voffset1,
                  globalStyles.flex,
                  styles.productWrp
                )}
              >
                <div className={styles.productImg}>
                  <img
                    src={item?.product?.images?.[0]?.productImage}
                    alt="product image"
                  />
                </div>
                <div className={styles.infoWrp}>
                  <div className={styles.productName}>{item.product.title}</div>

                  {salestatus && item.product.discount ? (
                    <div className={styles.productPrice}>
                      <span className={styles.discountprice}>
                        {String.fromCharCode(...code)}{" "}
                        {item.product.structure == "GiftCard"
                          ? displayPriceWithCommasFloat(item.GCValue, currency)
                          : displayPriceWithCommasFloat(
                              item.product.discountedPriceRecords[currency],
                              currency
                            )}
                      </span>
                      &nbsp; &nbsp;
                      <span className={styles.strikeprice}>
                        {String.fromCharCode(...code)}{" "}
                        {item.product.structure == "GiftCard"
                          ? displayPriceWithCommasFloat(item.GCValue, currency)
                          : displayPriceWithCommasFloat(
                              item.product.priceRecords[currency],
                              currency
                            )}{" "}
                      </span>{" "}
                    </div>
                  ) : (
                    <div
                      className={cs(styles.productPrice, {
                        [globalStyles.cerise]:
                          item.product.badgeType == "B_flat"
                      })}
                    >
                      {String.fromCharCode(...code)}{" "}
                      {item.product.structure == "GiftCard"
                        ? displayPriceWithCommasFloat(item.GCValue, currency)
                        : displayPriceWithCommasFloat(
                            item.product.priceRecords[currency],
                            currency
                          )}
                    </div>
                  )}

                  <span className={styles.productSize}>
                    {getSize(item.product.attributes)}
                  </span>
                </div>

                {/* <div
                  className={cs(
                    globalStyles.flex,
                    globalStyles.gutterBetween,
                    globalStyles.voffset1
                  )}
                >
                 
                  <span className={styles.productQty}>
                    <span>Qty: </span> {item.quantity}
                  </span>
                </div> */}
              </div>
              {basket.lineItems?.length === index + 1 ? null : (
                <hr className={styles.hrProduct} />
              )}
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
    let isline = false;
    // let voucherDiscount = props.voucher_discounts[0];
    if (basket.voucherDiscounts.length > 0) {
      const couponDetails = basket.voucherDiscounts?.[0];
      if (couponDetails) {
        coupon = basket.voucherDiscounts.map((gift, index: number) => {
          const voucher = gift.voucher;
          if (page != "checkoutMobileBottom") {
            isline = true;
          }
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
                (-) {String.fromCharCode(...code)}{" "}
                {displayPriceWithCommasFloat(gift.amount, currency)}
              </span>
            </div>
          );
        });
      }
    }

    if (basket.giftCards) {
      giftCard = basket.giftCards.map((gift, index: number) => {
        isline = true;
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
              (-) {String.fromCharCode(...code)}{" "}
              {displayPriceWithCommasFloat(gift.appliedAmount, currency)}
            </span>
          </div>
        );
      });
    }
    const redeemDetails = basket.loyalty?.[0];
    if (redeemDetails) {
      isline = true;
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
            (-) {String.fromCharCode(...code)}{" "}
            {displayPriceWithCommasFloat(redeemDetails.points, currency)}
          </span>
        </div>
      );
    }
    return (
      <div>
        {isline && <hr className={styles.hr} />}
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
    if (!isLoggedIn) {
      props.goLogin?.(undefined, "/order/checkout");
      return;
    }
    const {
      totalWithoutShipping,
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
      totalWithoutShipping &&
      totalWithoutShipping >= freeShippingThreshold &&
      totalWithoutShipping < freeShippingApplicable &&
      currency == "INR" &&
      shippable
    ) {
      dispatch(
        updateComponent(
          POPUP.FREESHIPPING,
          {
            remainingAmount:
              freeShippingApplicable -
              parseInt((basket.totalWithoutShipping || 0).toString()),
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
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({
        event: "eventsToSend",
        eventAction: "wishListClick",
        eventCategory: "Click",
        eventLabel: location.pathname
      });
    }
  };
  const saveInstruction = (data: string) => {
    dispatch(updateDeliveryText(data));
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({
        event: "Delivery Instruction",
        message: data
      });
    }
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
              {displayPriceWithCommasFloat(discount.amount, currency)}
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
    if (basket.lineItems.length > 0) {
      return (
        <div className={cs(styles.summaryPadding, styles.fixOrderItemsMobile)}>
          {pathname === "/order/checkout" && page !== "checkoutMobileBottom"
            ? getOrderItems()
            : null}
          {pathname === "/order/checkout" ? null : <hr className={styles.hr} />}
          <div className={styles.summaryAmountWrapper}>
            {mobile && page == "checkout" && (
              <div className={styles.orderSummaryTitle}>
                <span className={styles.text}>ORDER SUMMARY</span>
              </div>
            )}
            <div className={cs(globalStyles.flex, globalStyles.gutterBetween)}>
              <span className={styles.subtotal}>SUBTOTAL</span>
              <span className={styles.subtotal}>
                {String.fromCharCode(...code)}{" "}
                {displayPriceWithCommasFloat(basket.subTotal, currency)}
              </span>
            </div>
            {getDiscount(basket.offerDiscounts)}
            {/* <hr className={styles.hr} /> */}
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

            <hr className={styles.hr} />
            <div className={cs(globalStyles.flex, globalStyles.gutterBetween)}>
              <span className={styles.subtotal}>TOTAL</span>
              <span className={styles.subtotal}>
                {String.fromCharCode(...code)}{" "}
                {parseFloat("" + basket.subTotalWithShipping).toFixed(2)}
              </span>
            </div>
          </div>
          {pathname !== "/order/checkout" ||
            (page == "checkoutMobileBottom" && getCoupons())}
          {page == "checkoutMobileBottom" ? <hr className={styles.hr} /> : ""}
        </div>
      );
    } else {
      return (
        <div className={cs(styles.summaryPadding, styles.fixOrderItemsMobile)}>
          <hr className={styles.hr} />
          <div className={cs(globalStyles.flex, globalStyles.gutterBetween)}>
            <span className={styles.orderTotal}>TOTAL</span>
            <span className={styles.orderTotal}>
              {String.fromCharCode(...code)}{" "}
              {displayPriceWithCommasFloat(
                basket.subTotalWithShipping,
                currency
              )}
            </span>
          </div>
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

  const {
    totalWithoutShipping,
    freeShippingThreshold,
    freeShippingApplicable,
    shippable,
    total
  } = props.basket;

  return (
    <div
      className={cs(
        globalStyles.col12,
        styles.fixOrdersummary,
        {
          [styles.checkoutOrderSummary]: page == "checkout"
        },
        { [styles.checkoutOrderSummaryMobile]: page === "checkoutMobileBottom" }
      )}
      ref={page === "checkoutMobileBottom" ? orderSummaryRefCheckout : null}
    >
      {totalWithoutShipping &&
      totalWithoutShipping >= freeShippingThreshold &&
      totalWithoutShipping < freeShippingApplicable &&
      shippable &&
      page != "checkout" &&
      page != "checkoutMobileBottom" ? (
        <div className={cs(styles.freeShippingInfo, globalStyles.flex)}>
          <img src={freeShippingInfoIcon} alt="free-shipping" />
          <div className={styles.text}>
            Add products worth{" "}
            {String.fromCharCode(...currencyCode[props.currency])}{" "}
            {freeShippingApplicable - parseInt(total.toString())} or more to
            qualify for free shipping.
          </div>
        </div>
      ) : (
        ""
      )}
      {mobile && !previewTriggerStatus && page != "checkout" && (
        <div id="show-preview" className={cs(styles.previewTrigger)}>
          <div
            className={cs(styles.carretContainer)}
            onClick={onArrowButtonClick}
          >
            <div className={cs(styles.carretUp)}></div>
          </div>
          <div className={styles.fixTotal}>
            <div className={cs(globalStyles.flex, globalStyles.gutterBetween)}>
              <span className={styles.total}>TOTAL</span>
              <span className={styles.total}>
                {String.fromCharCode(...code)}{" "}
                {parseFloat("" + basket.subTotalWithShipping).toFixed(2)}
              </span>
            </div>
            {hasOutOfStockItems() && (
              <p
                className={cs(
                  globalStyles.textCenter,
                  styles.textRemoveItems,
                  globalStyles.colorPrimary
                )}
                onClick={onRemoveOutOfStockItemsClick}
              >
                <span className={styles.triggerRemoveItems}>
                  REMOVE ALL OUT OF STOCK ITEMS TO PROCEED
                </span>
              </p>
            )}
          </div>
        </div>
      )}
      {mobile && page == "checkout" && (
        <div
          className={cs(styles.checkoutPreviewTrigger)}
          onClick={CheckoutOrderSummaryHandler}
        >
          <div className={styles.fixTotal}>
            <div className={cs(globalStyles.flex, globalStyles.gutterBetween)}>
              <h3 className={cs(styles.summaryTitle)}>
                ORDER SUMMARY{" "}
                {pathname === "/order/checkout"
                  ? `(${basket.lineItems?.length})`
                  : null}
              </h3>
              <div className={styles.payableAmount}>
                <span>Amount Payable:</span>
                <span className={styles.totalAmount}>
                  {String.fromCharCode(...code)}{" "}
                  {parseFloat("" + basket.subTotalWithShipping).toFixed(2)}
                </span>
                <span className={cs(styles.carretDown)}></span>
              </div>
            </div>
          </div>
        </div>
      )}
      <div
        className={cs(
          styles.orderSummary,
          { [styles.checkoutOrder]: page == "checkout" },
          { [styles.openSummary]: checkoutOrderSummaryStatus }
        )}
        ref={orderSummaryRef}
        id="order-summary"
      >
        {mobile && page == "checkout" ? (
          ""
        ) : (
          <div className={cs(styles.summaryPadding, styles.summaryHeader)}>
            <h3 className={cs(styles.summaryTitle)}>
              ORDER SUMMARY{" "}
              {pathname === "/order/checkout"
                ? `(${basket.lineItems?.length})`
                : null}
              {page == "checkout" && !validbo ? (
                boId ? (
                  ""
                ) : (
                  <></>
                  // <Link className={styles.editCart} to={"/cart"}>
                  //   EDIT BAG
                  // </Link>
                )
              ) : (
                ""
              )}
            </h3>
          </div>
        )}

        <div className={cs(styles.justchk)}>
          {getSummary()}

          <div
            className={cs(styles.finalAmountWrapper, {
              [styles.checkoutMobileBottom]: page == "checkoutMobileBottom"
            })}
          >
            <div className={cs(styles.summaryPadding)}>
              <hr className={cs(styles.hr)} />
            </div>
            <div
              className={cs(
                globalStyles.flex,
                globalStyles.gutterBetween,
                styles.summaryPadding,
                styles.grandTotalWrapper
              )}
            >
              <span className={cs(styles.grandTotal, globalStyles.voffset2)}>
                AMOUNT PAYABLE
              </span>
              <span
                className={cs(styles.grandTotalAmount, globalStyles.voffset2)}
              >
                {String.fromCharCode(...code)}{" "}
                {displayPriceWithCommasFloat(basket.total, currency)}
              </span>
            </div>
            {pathname === "/order/checkout" ? (
              <div className={cs(styles.summaryPadding)}>
                <hr className={cs(styles.hr)} />
              </div>
            ) : null}

            {page == "checkoutMobileBottom" && (
              <button
                className={cs(
                  globalStyles.marginT10,
                  paymentStyles.sendToPayment,
                  styles.proceedToPayment,
                  {
                    [paymentStyles.disabledBtn]:
                      isLoading || Object.keys(currentmethod).length === 0
                  }
                )}
                onClick={onsubmit}
                disabled={isLoading || Object.keys(currentmethod).length === 0}
              >
                <span>
                  Amount Payable:{" "}
                  {String.fromCharCode(...currencyCodes[props.currency])}{" "}
                  {parseFloat(basket?.total?.toString()).toFixed(2)}
                  <br />
                </span>
                {isPaymentNeeded ? "PROCEED TO PAYMENT" : "PLACE ORDER"}
              </button>
            )}
            {page == "checkout" && mobile ? (
              ""
            ) : (
              <>
                {page == "cart" ||
                basket.isOnlyGiftCart ||
                !showDeliveryInstruction ? (
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
                      className={cs(styles.deliveryfont, globalStyles.pointer)}
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
                  <div
                    className={cs(
                      styles.deliveryDate,
                      globalStyles.marginB10,
                      styles.wrap,
                      {
                        [globalStyles.textCenter]:
                          page == "checkoutMobileBottom"
                      }
                    )}
                  >
                    {fullText ? deliveryText : deliveryText.substr(0, 85)}
                    {deliveryText.length > 85 ? (
                      <span
                        className={cs(
                          globalStyles.cerise,
                          globalStyles.pointer
                        )}
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
                {!mobile
                  ? getDeliveryStatusMobile()
                  : page == "checkoutMobileBottom"
                  ? getDeliveryStatusMobile()
                  : ""}
                {currency == "INR" ? (
                  ""
                ) : basket.shippable == false ? (
                  ""
                ) : (
                  <div
                    className={cs(
                      globalStyles.c10LR,
                      globalStyles.voffset2,
                      globalStyles.marginB10,
                      globalStyles.textCenter,
                      styles.summaryPadding
                    )}
                  >
                    Custom Duties & Taxes are extra, can be upto 30% or more of
                    order value in some cases, depending upon local customs
                    assessment.
                  </div>
                )}
              </>
            )}

            {hasOutOfStockItems() && (
              <p
                className={cs(
                  globalStyles.textCenter,
                  styles.textRemoveItems,
                  globalStyles.colorPrimary
                )}
                onClick={onRemoveOutOfStockItemsClick}
              >
                <span className={styles.triggerRemoveItems}>
                  REMOVE ALL OUT OF STOCK ITEMS TO PROCEED
                </span>
              </p>
            )}
            {page == "cart" && (
              <div>
                {/* <hr className={styles.hr} /> */}
                <NavLink
                  to={canCheckout() && isLoggedIn ? "/order/checkout" : "#"}
                >
                  <button
                    onClick={chkshipping}
                    className={
                      canCheckout()
                        ? cs(
                            globalStyles.checkoutBtn,
                            globalStyles.marginT30,
                            {
                              [globalStyles.hidden]: mobile
                            },
                            styles.checkoutBtn
                          )
                        : cs(
                            globalStyles.checkoutBtn,
                            globalStyles.marginT30,
                            globalStyles.disabledBtn,
                            {
                              [globalStyles.hidden]: mobile
                            },
                            styles.checkoutBtn
                          )
                    }
                  >
                    <img src={checkoutIcon} alt="checkout-button" />
                    <span>PROCEED TO CHECKOUT</span>
                  </button>
                </NavLink>

                <div
                  className={cs(
                    globalStyles.textCenter,
                    styles.textCoupon,
                    globalStyles.voffset4,
                    styles.summaryPadding
                  )}
                >
                  Promo Codes (if applicable), Gift Cards & Credit Notes can be
                  applied at Checkout
                </div>
                {/* <div className={styles.wishlist}>
                  <Link to="/wishlist" onClick={goToWishlist}>
                    <span>
                      <i
                        className={cs(
                          iconStyles.icon,
                          iconStyles.iconWishlist,
                          styles.wishlistIconOrderSummary,
                          globalStyles.pointer
                        )}
                      ></i>
                    </span>
                    &nbsp;
                    <span className={styles.wishlistAlign}>
                      VIEW SAVED ITEMS
                    </span>
                  </Link>
                </div> */}
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
                to={canCheckout() && isLoggedIn ? "/order/checkout" : "#"}
              >
                <button
                  onClick={chkshipping}
                  className={
                    canCheckout()
                      ? cs(globalStyles.checkoutBtn, styles.posFixed)
                      : cs(
                          globalStyles.checkoutBtn,
                          globalStyles.disabled,
                          styles.posFixed
                        )
                  }
                >
                  <img src={checkoutIcon} alt="checkout-button" />
                  <span>PROCEED TO CHECKOUT</span>
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
