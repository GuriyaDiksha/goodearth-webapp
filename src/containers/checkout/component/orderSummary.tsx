import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import cs from "classnames";
import globalStyles from "styles/global.scss";
import styles from "./orderStyles.scss";
import { OrderProps } from "./typings";
import { currencyCode } from "typings/currency";
import { useLocation, NavLink, useHistory, Link } from "react-router-dom";
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
import Button from "components/Button";
import checkoutIcon from "../../../images/checkout.svg";
import freeShippingInfoIcon from "../../../images/free_shipping_info.svg";
import Loader from "components/Loader";
import ModalStyles from "components/Modal/styles.scss";
import { countWishlist } from "actions/wishlist";
import { updateCheckoutLoader } from "actions/info";

const OrderSummary: React.FC<OrderProps> = props => {
  const {
    mobile,
    basket,
    page,
    shippingAddress,
    salestatus,
    setCheckoutMobileOrderSummary,
    onsubmit,
    isPaymentNeeded,
    tablet
  } = props;
  const [isLoading, setLoading] = useState(false);
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

  const { mode } = useSelector((state: AppState) => state.address);
  const { isSale } = useSelector((state: AppState) => state.info);

  const useIsomorphicLayoutEffect = canUseDOM ? useLayoutEffect : useEffect;

  // Begin: Intersection Observer (Mobile)
  const [previewTriggerStatus, setPreviewTriggerStatus] = useState(false);

  const [checkoutOrderSummaryStatus, setCheckoutOrderSummaryStatus] = useState(
    false
  );
  const { pathname } = useLocation();
  const orderSummaryRef = useRef<HTMLDivElement>(null);
  const orderSummaryRefCheckout = useRef(null);
  const impactRef = useRef<HTMLDivElement>(null);
  let observer: any;

  const handleScroll = () => {
    const observerOptions = {
      rootMargin: "-120px 0px -120px 0px"
    };
    const interSectionCallBack = (enteries: any) => {
      setPreviewTriggerStatus(enteries[0].isIntersecting);
      setCheckoutMobileOrderSummary &&
        setCheckoutMobileOrderSummary(enteries[0].isIntersecting);
    };

    observer = new IntersectionObserver(interSectionCallBack, observerOptions);
    observer.observe(
      orderSummaryRef?.current,
      orderSummaryRefCheckout?.current
    );
  };
  useIsomorphicLayoutEffect(() => {
    handleScroll();
    return () =>
      orderSummaryRef?.current &&
      observer?.unobserve(
        orderSummaryRef?.current,
        orderSummaryRefCheckout?.current
      );
  }, []);
  // End: Intersection Observer (Mobile)

  const { showDeliveryInstruction, deliveryText } = useSelector(
    (state: AppState) => state.info
  );
  let { currency } = useSelector((state: AppState) => state.basket);
  if (!currency) {
    currency = "INR";
  }
  const onArrowButtonClick = () => {
    setIsSuspended(true);
    // orderSummaryRef.current
    if (orderSummaryRef && orderSummaryRef?.current) {
      (orderSummaryRef?.current as HTMLDivElement)?.scrollIntoView({
        behavior: "smooth",
        block: "end"
      });
    }
  };

  const CheckoutOrderSummaryHandler = () => {
    setCheckoutOrderSummaryStatus(!checkoutOrderSummaryStatus);
  };

  // const handleClickOutside = (evt: any) => {
  //   if (impactRef.current && impactRef.current.contains(evt.target)) {
  //     CheckoutOrderSummaryHandler();
  //   }
  // };

  const showDeliveryTimelines = true;
  const history = useHistory();
  // const queryString = history.location.search;
  // const urlParams = new URLSearchParams(queryString);
  // const boId = urlParams.get("bo_id");

  const removePromo = async (data: FormData) => {
    const userConsent = CookieService.getCookie("consent").split(",");
    setLoading(true);
    const response = await CheckoutService.removePromo(dispatch, data);
    BasketService.fetchBasket(dispatch, "checkout", history, isLoggedIn);
    setLoading(false);

    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({
        event: "remove_promocode",
        click_type: pathname === "/cart" ? "Cart page" : "Checkout Page"
      });
    }
    return response;
  };

  const onPromoRemove = (id: string) => {
    const data: any = {
      cardId: id
    };
    try {
      removePromo(data);
    } catch (e) {
      setLoading(false);
    }
  };

  // Update total qty of cart items and print it in order summary
  const getItemsCount = () => {
    let count = 0;
    const items = basket.lineItems;
    for (let i = 0; i < items.length; i++) {
      count = count + items[i].quantity;
    }
    return count;
  };

  const colorName = (value: string) => {
    let cName = value
      .split("-")
      .slice(1)
      .join();
    if (cName[cName.length - 1] == "s") {
      cName = cName.slice(0, -1);
    }
    return cName;
  };

  const getSizeAndQty = (
    data: any,
    qty: any,
    isGC: boolean,
    groupedProductsCount?: number
  ) => {
    const size = data.find(function(attribute: any) {
      if (attribute.name == "Size") {
        return attribute;
      }
    });

    const color = data.find(function(attribute: any) {
      if (attribute.name == "Color") {
        return attribute;
      }
    });
    return (size || qty || color?.value) && !isGC ? (
      <span className={globalStyles.marginT5}>
        {size && `Size: ${size.value} | `}{" "}
        {color?.value && groupedProductsCount && groupedProductsCount > 0
          ? `Color: ${colorName(color?.value)} | `
          : ""}
        QTY: {qty}
      </span>
    ) : null;
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
            {/* commented as per requirement */}
            {/* {isSuspended && isSale && (
              <>
                <p
                  className={cs(styles.summaryPadding, {
                    [globalStyles.marginT20]: mobile
                  })}
                >
                  {" "}
                  All standard WHO guidelines and relevant precautionary
                  measures are in place, to ensure a safe and secure shopping
                  experience for you.
                </p>
              </>
            )} */}
            {/* <hr className={styles.hr} /> */}
            {/* {isSuspended && !isSale && (
              <>
                <p className={cs(globalStyles.marginT20)}>
                  {" "}
                  All standard WHO guidelines and relevant precautionary
                  measures are in place, to ensure a safe and secure shopping
                  experience for you.
                </p>
              </>
            )} */}
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
                    src={
                      item?.product.structure.toLowerCase() == "giftcard"
                        ? item?.giftCardImage
                        : item?.product?.images?.[0]?.productImage
                    }
                    alt="product image"
                  />
                </div>
                <div className={styles.infoWrp}>
                  <div className={styles.productName}>{item.product.title}</div>

                  {item?.product?.badge_text && (
                    <div
                      className={cs(
                        globalStyles.badgeContainer,
                        globalStyles.grey,
                        styles.badgeContainer
                      )}
                    >
                      {item?.product?.badge_text}
                    </div>
                  )}

                  {item?.is_free_product ? (
                    <p className={cs(styles.free)}>FREE</p>
                  ) : salestatus && item.product.discount ? (
                    <div className={styles.productPrice}>
                      <span className={styles.discountprice}>
                        {item.product.structure == "GiftCard"
                          ? displayPriceWithCommasFloat(
                              item.GCValue,
                              currency,
                              true,
                              false
                            )
                          : displayPriceWithCommasFloat(
                              item.product.discountedPriceRecords[currency],
                              currency,
                              true,
                              false
                            )}
                      </span>
                      &nbsp;
                      <span className={styles.strikeprice}>
                        {item.product.structure == "GiftCard"
                          ? displayPriceWithCommasFloat(
                              item.GCValue,
                              currency,
                              true,
                              false
                            )
                          : displayPriceWithCommasFloat(
                              item.product.priceRecords[currency],
                              currency,
                              true,
                              false
                            )}{" "}
                      </span>{" "}
                    </div>
                  ) : (
                    <div
                      className={cs(styles.productPrice, {
                        [globalStyles.gold]: item.product.badgeType == "B_flat"
                      })}
                    >
                      {item.product.structure == "GiftCard"
                        ? displayPriceWithCommasFloat(
                            item.GCValue,
                            currency,
                            true,
                            false
                          )
                        : displayPriceWithCommasFloat(
                            item.product.priceRecords[currency],
                            currency,
                            true,
                            false
                          )}
                    </div>
                  )}

                  <span className={cs(styles.productSize)}>
                    {getSizeAndQty(
                      item.product.attributes,
                      item.quantity,
                      item.product.structure == "GiftCard",
                      item?.product?.groupedProductsCount
                    )}
                  </span>
                  {item.product.structure == "GiftCard" && (
                    <>
                      <p className={cs(styles.productSize)}>
                        Recipient&apos;s Name: {item?.GCMeta?.recipeint_name}
                      </p>
                      <p className={cs(styles.productSize)}>
                        Recipient&apos;s Email: {item?.GCMeta?.recipient_email}
                      </p>
                      <p className={cs(styles.productSize)}>
                        Sender&apos;s Name: {item?.GCMeta?.sender_name}
                      </p>
                    </>
                  )}
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
    setLoading(true);
    dispatch(updateCheckoutLoader(true));
    const response = await CheckoutService.removeGiftCard(dispatch, data);
    const basketRes = await BasketService.fetchBasket(
      dispatch,
      "checkout",
      history,
      isLoggedIn
    );
    setLoading(false);
    if (basketRes) {
      dispatch(updateCheckoutLoader(false));
    }
    return response;
  };

  const removeRedeem = async () => {
    setLoading(true);
    dispatch(updateCheckoutLoader(true));
    const response = await CheckoutService.removeRedeem(dispatch);
    const basketRes = await BasketService.fetchBasket(
      dispatch,
      "checkout",
      history,
      isLoggedIn
    );
    setLoading(false);
    if (basketRes) {
      dispatch(updateCheckoutLoader(false));
    }
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
          if (
            page != "checkoutMobileBottom" ||
            pathname !== "/order/checkout"
          ) {
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
                <span className={cs(globalStyles.marginR5, styles.subtotal)}>
                  {voucher.code}
                </span>
                <span className={styles.textMuted}>
                  {!mobile && "(Promo Code Applied)"}
                  {/* {
                  boId ? (
                    mobile && (
                      <span className={styles.giftCreditCodeText}>
                        (Promo Code Applied)
                      </span>
                    )
                  ) :
                   ( */}
                  <span
                    className={cs(globalStyles.marginL5, styles.cross)}
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
                    {mobile && (
                      <span className={styles.giftCreditCodeText}>
                        (Promo Code Applied)
                      </span>
                    )}
                  </span>
                  {/* } */}
                </span>
              </span>
              <span className={styles.subtotal}>
                (-){" "}
                {displayPriceWithCommasFloat(
                  gift.amount,
                  currency,
                  true,
                  false
                )}
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
              <span className={cs(globalStyles.marginR5, styles.subtotal)}>
                {gift.cardId}
              </span>
              <span className={styles.textMuted}>
                {" "}
                {!mobile
                  ? gift.cardType == "CREDITNOTE"
                    ? "(Credit Note Applied)"
                    : "(Gift Card Applied)"
                  : null}
                <span
                  className={cs(globalStyles.marginL5, styles.cross)}
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
                {mobile && (
                  <span className={styles.giftCreditCodeText}>
                    {gift.cardType == "CREDITNOTE"
                      ? "(Credit Note Applied)"
                      : "(Gift Card Applied)"}
                  </span>
                )}
              </span>
            </span>
            <span className={styles.subtotal}>
              (-){" "}
              {displayPriceWithCommasFloat(
                gift.appliedAmount,
                currency,
                true,
                false
              )}
            </span>
          </div>
        );
      });
    }
    const redeemDetails = basket.loyalty?.[0];
    if (redeemDetails && redeemDetails?.isValidated) {
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
            <span className={cs(globalStyles.marginR5, styles.subtotal)}>
              CERISE POINTS
            </span>
            <span className={styles.textMuted}>
              {" "}
              {"(Redeemed)"}
              <span
                className={cs(globalStyles.marginL5, styles.cross)}
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
            (-){" "}
            {displayPriceWithCommasFloat(
              redeemDetails.points,
              currency,
              true,
              false
            )}
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
    if (mobile || tablet) {
      if (checkoutOrderSummaryStatus) {
        document?.body?.classList.add(globalStyles.noScroll);
      } else {
        document?.body?.classList.remove(globalStyles.noScroll);
      }
    }
  }, [checkoutOrderSummaryStatus]);

  useEffect(() => {
    if (mobile && hasOutOfStockItems()) {
      setTimeout(() => {
        document
          ?.getElementsByClassName(styles.textRemoveItems)[0]
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
    if (typeof document != "undefined" && typeof window != "undefined") {
      const cookieString =
        "checkoutinfopopup3=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
      document.cookie = cookieString;
    }
  };
  const chkshipping = (event: any) => {
    const {
      totalWithoutShipping,
      freeShippingThreshold,
      freeShippingApplicable,
      shippable
    } = basket;
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
              parseInt((basket.totalWithoutShipping || 0)?.toString()),
            freeShippingApplicable,
            goLogin: props.goLogin
          },
          mobile ? false : true,
          mobile ? ModalStyles.bottomAlignSlideUp : "",
          mobile ? "slide-up-bottom-align" : ""
        )
      );
      dispatch(updateModal(true));
      event.preventDefault();
    } else {
      if (!isLoggedIn) {
        props.goLogin?.(undefined, "/order/checkout");
        return;
      }
    }
    if (page != "cart") {
      return false;
    }
    if (isSuspended) {
      resetInfoPopupCookie();
      // dispatch(countWishlist(0));
    }
  };

  const onRemoveOutOfStockItemsClick = () => {
    BasketService.removeOutOfStockItems(dispatch, "cart");
  };

  // const goToWishlist = (e: any) => {
  //   const userConsent = CookieService.getCookie("consent").split(",");
  //   if (userConsent.includes(GA_CALLS)) {
  //     dataLayer.push({
  //       event: "eventsToSend",1
  //       eventAction: "wishListClick",
  //       eventCategory: "Click",
  //       eventLabel: location.pathname
  //     });
  //   }
  // };
  const saveInstruction = (data: string) => {
    dispatch(updateDeliveryText(data));
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({
        event: "Delivery Instruction",
        message: data
      });
      dataLayer.push({
        event: "delivery_instruction"
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
            <span className={cs(styles.subtotal, globalStyles.gold)}>
              {discount.name == "price-discount" ? "DISCOUNT" : discount.name}
            </span>
            <span className={cs(styles.subtotal, globalStyles.gold)}>
              (-){" "}
              {displayPriceWithCommasFloat(
                discount.amount,
                currency,
                true,
                false
              )}
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
        <div
          className={cs(styles.summaryPadding, {
            [styles.fixOrderItemsMobile]: checkoutOrderSummaryStatus
          })}
        >
          {["/order/checkout", "/order/gc_checkout"].includes(pathname) &&
          page !== "checkoutMobileBottom"
            ? getOrderItems()
            : null}
          {["/order/checkout", "/order/gc_checkout"].includes(
            pathname
          ) ? null : (
            <hr className={styles.hr} />
          )}
          {mobile &&
          page == "checkout" &&
          !(pathname == "/order/gc_checkout") ? null : (
            <div className={styles.summaryAmountWrapper}>
              {pathname != "/order/gc_checkout" && (
                <div
                  className={cs(globalStyles.flex, globalStyles.gutterBetween)}
                >
                  <span className={styles.subtotal}>SUBTOTAL</span>
                  <span className={styles.subtotal}>
                    {displayPriceWithCommasFloat(
                      basket.subTotal,
                      currency,
                      true,
                      false
                    )}
                  </span>
                </div>
              )}
              {getDiscount(basket.offerDiscounts)}
              {pathname != "/order/gc_checkout" && (
                <div
                  className={cs(
                    globalStyles.flex,
                    globalStyles.gutterBetween,
                    globalStyles.marginT20
                  )}
                >
                  <span className={styles.subtotal}>SHIPPING</span>
                  <span className={styles.subtotal}>
                    (+)
                    {displayPriceWithCommasFloat(
                      parseFloat(shippingCharge),
                      currency,
                      true,
                      false
                    )}
                  </span>
                </div>
              )}
              {basket.finalDeliveryDate && showDeliveryTimelines && (
                <div className={cs(styles.deliveryDate, styles.maxWidth)}>
                  Estimated delivery on or before:{" "}
                  <span className={styles.black}>
                    {basket.finalDeliveryDate}
                  </span>
                </div>
              )}
              {shippingAddress?.state && !(pathname == "/order/gc_checkout") && (
                <div
                  className={cs(styles.selectedStvalue, globalStyles.marginT10)}
                >
                  to {shippingAddress.state} - {shippingAddress.postCode}
                </div>
              )}
              {!(pathname == "/order/gc_checkout") && (
                <hr className={styles.hr} />
              )}
              <div
                className={cs(globalStyles.flex, globalStyles.gutterBetween)}
              >
                <span className={styles.subtotal}>TOTAL</span>
                <span className={styles.subtotal}>
                  {displayPriceWithCommasFloat(
                    basket.subTotalWithShipping,
                    currency,
                    true,
                    false
                  )}
                </span>
              </div>
              {((["/order/checkout", "/order/gc_checkout"].includes(pathname) &&
                !mobile) ||
                pathname === "/cart" ||
                (page == "checkoutMobileBottom" &&
                  !checkoutOrderSummaryStatus)) &&
                getCoupons()}
              {/* {!(pathname == "/order/gc_checkout") && ( */}
              <hr className={styles.hr} />
              {/* )} */}
              <div
                className={cs(
                  globalStyles.flex,
                  globalStyles.gutterBetween,
                  globalStyles.marginB10
                )}
              >
                <span className={styles.subtotal}>AMOUNT PAYABLE</span>
                <span className={styles.subtotal}>
                  {displayPriceWithCommasFloat(
                    basket?.total,
                    currency,
                    true,
                    false
                  )}
                </span>
              </div>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div
          className={cs(styles.summaryPadding, {
            [styles.fixOrderItemsMobile]: checkoutOrderSummaryStatus
          })}
        >
          <hr className={styles.hr} />
          <div className={cs(globalStyles.flex, globalStyles.gutterBetween)}>
            <span className={styles.orderTotal}>
              {basket.lineItems.length > 0 ? "TOTAL" : "ORDER TOTAL"}
            </span>
            <span className={styles.orderTotal}>
              {displayPriceWithCommasFloat(
                basket.subTotalWithShipping,
                props.currency,
                true,
                false
              )}
            </span>
          </div>
          {/* {getCoupons()} */}
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
  // console.log(deliveryText, salestatus, fullText);

  const { showProductWorth, productWorthValue } = props.basket;
  return (
    <div
      className={cs(
        globalStyles.col12,
        styles.fixOrdersummary,
        {
          [styles.checkoutOrderSummary]: page == "checkout"
        },
        {
          [styles.checkoutOrderSummaryMobile]: page === "checkoutMobileBottom"
        },
        {
          [styles.hideSummary]:
            page == "cart" && mobile && basket.lineItems?.length == 0
        }
      )}
      ref={page === "checkoutMobileBottom" ? orderSummaryRefCheckout : null}
    >
      {showProductWorth && page != "checkout" ? (
        <div className={cs(styles.freeShippingInfo, globalStyles.flex)}>
          <img src={freeShippingInfoIcon} alt="free-shipping" />
          <div className={styles.text}>
            Add products worth{" "}
            {String.fromCharCode(...currencyCode[props.currency])}{" "}
            {parseFloat(productWorthValue?.toString() || "")} or more to qualify
            for free shipping. Limited time only!
          </div>
        </div>
      ) : (
        ""
      )}
      {mobile &&
        !previewTriggerStatus &&
        page != "checkout" &&
        basket.lineItems?.length && (
          <div
            id="show-preview"
            className={cs(styles.previewTrigger, styles.cartPageTotalBottom)}
          >
            <div
              className={cs(styles.carretContainer)}
              onClick={onArrowButtonClick}
            >
              <div className={cs(styles.carretUp)}></div>
            </div>
            <div className={styles.fixTotal}>
              <div
                className={cs(globalStyles.flex, globalStyles.gutterBetween)}
              >
                <span>
                  <span className={styles.total}>TOTAL*</span>
                  {/* <p className={styles.subtext}>
                    {" "}
                    *Excluding estimated cost of shipping{" "}
                  </p> */}
                </span>
                <span>
                  <span className={styles.total}>
                    {displayPriceWithCommasFloat(
                      basket.subTotalWithShipping,
                      currency,
                      true,
                      false
                    )}
                    {/* {parseFloat("" + basket.subTotalWithShipping).toFixed(2)} */}
                  </span>
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
      {mobile && page == "checkout" && mode == "list" && (
        <div
          className={cs(styles.checkoutPreviewTrigger)}
          onClick={CheckoutOrderSummaryHandler}
        >
          {checkoutOrderSummaryStatus ? (
            <div className={styles.fixTotal}>
              <div
                className={cs(globalStyles.flex, globalStyles.gutterBetween)}
              >
                <h3 className={cs(styles.summaryTitle)}>BACK TO CHECKOUT</h3>
                <div className={styles.payableAmount}>
                  <span className={styles.totalAmount}>
                    {displayPriceWithCommasFloat(
                      basket?.total?.toString(),
                      currency,
                      true,
                      false
                    )}
                  </span>
                  <span className={cs(styles.carretUp)}></span>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.fixTotal}>
              <div
                className={cs(globalStyles.flex, globalStyles.gutterBetween)}
              >
                <h3 className={cs(styles.summaryTitle)}>
                  VIEW ITEMS{" "}
                  {["/order/checkout", "/order/gc_checkout"].includes(pathname)
                    ? `(${getItemsCount()})`
                    : null}
                </h3>
                <div className={styles.payableAmount}>
                  <span className={styles.totalAmount}>
                    {displayPriceWithCommasFloat(
                      basket?.total?.toString(),
                      currency,
                      true,
                      false
                    )}
                  </span>
                  <span className={cs(styles.carretDown)}></span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {mobile && (
        <div
          className={cs(styles.orderSummaryOutside, {
            [styles.closeSummary]: !checkoutOrderSummaryStatus
          })}
          onClick={CheckoutOrderSummaryHandler}
        ></div>
      )}
      <div
        className={cs(
          styles.orderSummary,
          { [styles.checkoutOrder]: page == "checkout" },
          { [styles.openSummary]: checkoutOrderSummaryStatus }
        )}
        ref={checkoutOrderSummaryStatus ? impactRef : orderSummaryRef}
        id="order-summary"
      >
        <div
          className={cs(styles.summaryPadding, styles.summaryHeader, {
            [styles.marginLR30]: checkoutOrderSummaryStatus
          })}
        >
          <h3
            className={cs(styles.summaryTitle, {
              [styles.summaryTitleTwo]: pathname === "/cart"
            })}
          >
            {mobile && page == "checkout" ? "SHOPPING BAG " : "ORDER SUMMARY"}
            {["/order/checkout", "/order/gc_checkout"].includes(pathname)
              ? `(${getItemsCount()})`
              : null}
          </h3>
          {pathname === "/order/checkout" && <Link to="/cart">EDIT BAG</Link>}
        </div>

        <div className={cs(styles.justchk)}>
          {getSummary()}

          {/* {!mobile && */}
          <div
            className={cs(styles.finalAmountWrapper, {
              [styles.checkoutMobileBottom]: page == "checkoutMobileBottom"
            })}
          >
            {/* <div className={cs(styles.summaryPadding)}>
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
              <span className={cs(globalStyles.voffset2)}>
                <span className={cs(styles.grandTotal, globalStyles.voffset2)}>
                  AMOUNT PAYABLE
                </span>
               
              </span>
              <span
                className={cs(styles.grandTotalAmount, globalStyles.voffset2)}
              >
                {String.fromCharCode(...code)}{" "}
                {displayPriceWithCommasFloat(basket.total, currency)}
              </span>
            </div> */}
            {/* {pathname === "/order/checkout" ? (
              <div className={cs(styles.summaryPadding)}>
                <hr className={cs(styles.hr)} />
              </div>
            ) : null} */}

            {page == "checkoutMobileBottom" && (
              <Button
                className={cs(
                  globalStyles.marginT10,
                  styles.amtBtn,
                  { [globalStyles.btnFullWidth]: mobile || tablet },
                  // paymentStyles.sendToPayment,
                  styles.proceedToPayment
                  // {
                  //   [paymentStyles.disabledBtn]: isLoading
                  // }
                )}
                onClick={onsubmit}
                disabled={isLoading}
                variant="largeMedCharcoalCta"
                label={
                  (
                    <>
                      <span className={styles.amtPayable}>
                        Amount Payable:{" "}
                        {displayPriceWithCommasFloat(
                          basket?.total?.toString(),
                          currency,
                          true,
                          false
                        )}
                        {/* {parseFloat(basket?.total?.toString()).toFixed(2)} */}
                        <br />
                      </span>
                      {isPaymentNeeded ? "PROCEED TO PAYMENT" : "PLACE ORDER"}
                    </>
                  ) as JSX.Element
                }
              />
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
                !showDeliveryInstruction ? (
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
                    {deliveryText && deliveryText}
                    {/* {fullText ? deliveryText : deliveryText.substr(0, 85)}
                    {deliveryText.length > 85 ? (
                      <span
                        className={cs(
                          // globalStyles.cerise,
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
                    )} */}
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
                      globalStyles.voffset3v1,
                      globalStyles.marginB10,
                      globalStyles.textCenter,
                      styles.summaryPadding,
                      { [globalStyles.cerise]: isSale }
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
                  className={
                    !canCheckout() ? cs(globalStyles.checkoutBtnDisabled) : ""
                  }
                  to={canCheckout() && isLoggedIn ? "/order/checkout" : "#"}
                >
                  <Button
                    onClick={chkshipping}
                    // className={
                    //   canCheckout()
                    //     ? cs(
                    //         globalStyles.checkoutBtn,
                    //         globalStyles.marginT10,
                    //         {
                    //           [globalStyles.hidden]: mobile
                    //         },
                    //         styles.checkoutBtn
                    //       )
                    //     : cs(
                    //         globalStyles.checkoutBtn,
                    //         globalStyles.marginT10,
                    //         globalStyles.disabledBtn,
                    //         {
                    //           [globalStyles.hidden]: mobile
                    //         },
                    //         styles.checkoutBtn
                    //       )
                    // }
                    className={cs(
                      globalStyles.marginT10,
                      styles.checkoutBtn,
                      globalStyles.btnFullWidth,
                      { [globalStyles.hidden]: mobile }
                    )}
                    disabled={canCheckout() ? false : true}
                    label={
                      (
                        <>
                          <img src={checkoutIcon} alt="checkout-button" />
                          <span>PROCEED TO CHECKOUT</span>
                        </>
                      ) as JSX.Element
                    }
                    variant="largeAquaCta"
                  />
                </NavLink>

                <div
                  className={cs(
                    globalStyles.textCenter,
                    styles.textCoupon,
                    globalStyles.voffset4,
                    styles.summaryPadding,
                    styles.promocodeText,
                    { [globalStyles.marginB50]: mobile }
                  )}
                >
                  {salestatus
                    ? "Gift Cards & Credit Notes can be applied at Checkout. Promo Codes cannot be applied during Sale."
                    : "Promo Codes (if applicable), Gift Cards & Credit Notes can be applied at Checkout"}
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
          {/* } */}

          {page == "cart" && (
            <div
              className={cs(styles.summaryFooter, {
                [globalStyles.hidden]: !mobile
              })}
            >
              <NavLink
                className={
                  !canCheckout() ? cs(globalStyles.checkoutBtnDisabled) : ""
                }
                to={canCheckout() && isLoggedIn ? "/order/checkout" : "#"}
              >
                <Button
                  onClick={chkshipping}
                  className={
                    // canCheckout()
                    //   ?

                    cs(styles.posFixed, styles.checkoutBtn)
                    // : cs(
                    //     globalStyles.checkoutBtn,
                    //     styles.posFixed,
                    //     globalStyles.disabledBtn,
                    //     styles.checkoutBtn
                    //   )
                  }
                  disabled={canCheckout() ? false : true}
                  variant="largeAquaCta"
                  label={
                    (
                      <>
                        <img src={checkoutIcon} alt="checkout-button" />
                        <span>PROCEED TO CHECKOUT</span>
                      </>
                    ) as JSX.Element
                  }
                />
              </NavLink>
            </div>
          )}
        </div>
      </div>
      {isLoading && <Loader />}
    </div>
  );
};

export default OrderSummary;
