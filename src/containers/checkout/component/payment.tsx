import React, { useState, Fragment, useEffect, useMemo, useRef } from "react";
import cs from "classnames";
// import iconStyles from "../../styles/iconFonts.scss";
import bootstrapStyles from "../../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import { PaymentProps } from "./typings";
import ApplyGiftcard from "./applyGiftcard";
import { useSelector, useDispatch } from "react-redux";
import { AppState } from "reducers/typings";
import { Link, useHistory } from "react-router-dom";
import Loader from "components/Loader";
import Reedem from "./redeem";
// import { updateComponent, updateModal } from "actions/modal";
import giftwrapIcon from "../../../images/gift-wrap-icon.svg";
import { errorTracking, showErrors } from "utils/validate";
// import { POPUP } from "constants/components";
import CookieService from "services/cookie";
import { proceedForPayment, getPageType } from "../../../utils/validate";
import { GA_CALLS, ANY_ADS } from "constants/cookieConsent";
import { currencyCodes } from "constants/currency";
import { updateComponent, updateModal } from "actions/modal";
import { POPUP } from "constants/components";
import checkmarkCircle from "./../../../images/checkmarkCircle.svg";
import CheckoutService from "services/checkout";
import BasketService from "services/basket";
import OrderSummary from "./orderSummary";

const PaymentSection: React.FC<PaymentProps> = props => {
  const data: any = {};
  const {
    basket,
    device: { mobile },
    info: { showGiftWrap },
    user: { loyaltyData, isLoggedIn },
    basket: { loyalty }
  } = useSelector((state: AppState) => state);
  const history = useHistory();
  const { isActive, currency, checkout, shippingAddress, salestatus } = props;
  const [paymentError, setPaymentError] = useState("");
  const [subscribevalue, setSubscribevalue] = useState(false);
  //  const [subscribegbp, setSubscribegbp] = useState(true);
  const [subscribegbp] = useState(true);
  const [isactivepromo, setIsactivepromo] = useState(false);
  const [isactiveredeem, setIsactiveredeem] = useState(false);
  const [giftwrap, setGiftwrap] = useState(false);
  const [giftwrapprice, setGiftwrapprice] = useState(false);
  const [currentmethod, setCurrentmethod] = useState(data);
  const [isLoading, setIsLoading] = useState(false);
  const [textarea, setTextarea] = useState("");
  // const [gbpError, setGbpError] = useState("");
  const [getMethods, setGetMethods] = useState<any[]>([]);
  const [checkoutMobileOrderSummary, setCheckoutMobileOrderSummary] = useState(
    false
  );
  const dispatch = useDispatch();

  const PaymentButton = useRef(null);

  // const CheckoutMobileOrderSummaryHandler= () =>{
  //   setCheckoutMobileOrderSummary(!checkoutMobileOrderSummary)
  // }

  const toggleInput = () => {
    setIsactivepromo(!isactivepromo);
  };
  const toggleInputReedem = () => {
    setIsactiveredeem(true);

    dispatch(
      updateComponent(
        POPUP.REDEEMPOPUP,
        {
          setIsactiveredeem: setIsactiveredeem
        },
        true
      )
    );
    dispatch(updateModal(true));
  };

  const removeRedeem = async (history: any, isLoggedIn: boolean) => {
    const promo: any = await CheckoutService.removeRedeem(dispatch);
    BasketService.fetchBasket(dispatch, "checkout", history, isLoggedIn);
    return promo;
  };

  const onClickSubscribe = (event: any) => {
    setSubscribevalue(event.target.checked);
  };

  // const setAccept = () => {
  //   setSubscribegbp(true);
  //   setGbpError("");
  // };

  // const closeModal = () => {
  //   // dispatch(updateComponent(<ShippingPopup closeModal={}/>, true));
  //   dispatch(updateModal(false));
  // };

  // const onClikcSubscribeGbp = (event: any) => {
  //   if (!subscribegbp) {
  // dispatch(
  //   updateComponent(
  //     POPUP.SHIPPINGPOPUP,
  //     { closeModal: closeModal, acceptCondition: setAccept },
  //     true
  //   )
  // );
  // dispatch(updateModal(true));
  //   } else {
  //     setSubscribegbp(false);
  //     setGbpError("");
  //   }
  // };

  // const onGiftChange =() =>{

  // }

  const gtmPushPaymentTracking = (
    paymentMode: string[],
    paymentMethod: string
  ) => {
    try {
      const userConsent = CookieService.getCookie("consent").split(",");
      if (userConsent.includes(GA_CALLS)) {
        dataLayer.push({
          event: "paymentDetails",
          paymentMode: paymentMode,
          paymentMethod: paymentMethod
        });
      }
    } catch (e) {
      console.log(e);
      console.log("payment Tracking error");
    }
  };

  const onsubmit = () => {
    const isFree = +basket.total <= 0;
    const userConsent = CookieService.getCookie("consent").split(",");

    if (currentmethod.mode || isFree) {
      const data: any = {
        paymentMethod: isFree ? "FREE" : currentmethod.key,
        paymentMode: currentmethod.mode
      };
      if (userConsent.includes(ANY_ADS)) {
        Moengage.track_event("Mode of payment selected", {
          "Payment Method": currentmethod.value,
          Amount: +basket.total,
          Currency: currency
        });
      }
      if (giftwrap) {
        data["isGift"] = giftwrap;
        data["giftRemovePrice"] = giftwrapprice;
        data["giftMessage"] = textarea;
      }
      if (currency == "GBP" && !subscribegbp) {
        //setGbpError("Please agree to shipping & payment terms.");
        errorTracking(
          ["Please agree to shipping & payment terms."],
          location.href
        );
        return false;
      }
      setIsLoading(true);
      const paymentMode: string[] = [];
      let paymentMethod = "";
      if (!isFree) {
        paymentMethod = currentmethod.value;
        paymentMode.push("Online");
      }
      if (basket.giftCards.length > 0) {
        paymentMode.push("GiftCard");
      }
      if (basket.loyalty.length > 0) {
        paymentMode.push("Loyalty");
      }
      checkout(data)
        .then((response: any) => {
          gtmPushPaymentTracking(paymentMode, paymentMethod);
          proceedForPayment(basket, currency, paymentMethod);
          location.href = `${__API_HOST__ + response.paymentUrl}`;
          setIsLoading(false);
        })
        .catch((error: any) => {
          let msg = showErrors(error.response?.data.msg);
          const errorType = error.response?.data.errorType;
          if (errorType && errorType == "qty") {
            msg =
              "Some of the products in your cart have been updated/become unavailable. Please refresh before proceeding.";
          }
          setPaymentError(msg);
          errorTracking([msg], location.href);
          setIsLoading(false);
        });
    } else {
      setPaymentError("Please select a payment method");
      errorTracking(["Please select a payment method"], location.href);
    }
  };

  useEffect(() => {
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({
        "Event Category": "GA Ecommerce",
        "Event Action": "Checkout Step 3",
        "Event Label": "Payment Option Page",
        "Time Stamp": new Date().toISOString(),
        "Page Url": location.href,
        "Page Type": getPageType(),
        "Login Status": isLoggedIn ? "logged in" : "logged out",
        "Page referrer url": CookieService.getCookie("prevUrl")
      });
    }
  }, []);

  useEffect(() => {
    if (basket.giftCards.length > 0) {
      setIsactivepromo(true);
    }
    if (basket.loyalty.length > 0) {
      setIsactiveredeem(true);
    }
  }, [basket.giftCards, basket.loyalty]);

  useEffect(() => {
    CheckoutService.getPaymentList(dispatch)
      .then((res: any) => {
        // console.log(res.methods);
        setGetMethods(res.methods);
      })
      .catch(err => {
        console.group(err);
      });
  }, [currency]);

  // const getMethods = useMemo(() => {
  //   let methods = [
  //     {
  //       key: "payu",
  //       value: "CREDIT CARD",
  //       mode: "CC"
  //     },
  //     {
  //       key: "payu",
  //       value: "DEBIT CARD",
  //       mode: "DC"
  //     },
  //     {
  //       key: "payu",
  //       value: "NET BANKING",
  //       mode: "NB"
  //     },
  //     {
  //       key: "payu",
  //       value: "WALLETS",
  //       mode: "CASH"
  //     },
  //     {
  //       key: "payu",
  //       value: "UPI",
  //       mode: "UPI"
  //     }
  //   ];

  //   if (currency != "INR") {
  //     methods = [
  //       {
  //         key: "payu",
  //         value: "CREDIT CARD",
  //         mode: "CC"
  //       },
  //       {
  //         key: "payu",
  //         value: "DEBIT CARD",
  //         mode: "DC"
  //       },
  //       {
  //         key: "paypal",
  //         value: "PAYPAL",
  //         mode: "NA"
  //       }
  //     ];
  //   }

  //   if (currency == "AED") {
  //     methods = methods.filter(data => {
  //       return data.key != "paypal";
  //     });
  //   }
  //   return methods;
  // }, [currency]);

  const onMethodChange = (event: any, method: any) => {
    if (event.target.checked) {
      setCurrentmethod(method);
      setPaymentError("");
    }
  };

  const isPaymentNeeded = useMemo(() => {
    if (+basket.total > 0) {
      return true;
    } else {
      return false;
    }
  }, [basket.total]);

  const giftWrapRender = useMemo(() => {
    return (
      <div className={globalStyles.marginT20}>
        <label className={cs(globalStyles.flex, globalStyles.crossCenter)}>
          <div className={styles.marginR10}>
            <span className={styles.checkbox}>
              <input
                type="radio"
                checked={giftwrap}
                onClick={() => {
                  setGiftwrap(!giftwrap);
                  setGiftwrapprice(!giftwrap);
                }}
              />
              <span
                className={cs(styles.indicator, { [styles.checked]: giftwrap })}
              ></span>
            </span>
          </div>
          <div className={cs(styles.formSubheading)}>
            {"Gift Wrap This Order"}
          </div>
          <div className={styles.giftImg}>
            <img src={giftwrapIcon} width="30px" />
          </div>
        </label>
      </div>
    );
  }, [giftwrap]);

  const giftShowPrice = useMemo(() => {
    return (
      <div className={globalStyles.marginT20}>
        <label className={cs(globalStyles.flex, globalStyles.crossCenter)}>
          <div className={styles.marginR10}>
            <span className={styles.checkbox}>
              <input
                type="radio"
                checked={giftwrapprice}
                onClick={() => {
                  setGiftwrapprice(!giftwrapprice);
                }}
              />
              <span
                className={cs(styles.indicator, {
                  [styles.checked]: giftwrapprice
                })}
              ></span>
            </span>
          </div>
          <div className={cs(styles.formSubheading, styles.checkBoxHeading)}>
            {"Please Remove Prices From All Items In This Shipment"}
          </div>
        </label>
      </div>
    );
  }, [giftwrapprice]);

  return (
    <>
      {loyaltyData?.detail && currency == "INR" && (
        <div
          className={
            isActive
              ? cs(styles.card, styles.cardOpen, styles.marginT5)
              : cs(styles.card, styles.cardClosed, styles.marginT5)
          }
        >
          <Fragment>
            <div className={bootstrapStyles.row}>
              <div
                className={cs(
                  bootstrapStyles.col12,
                  bootstrapStyles.colMd6,
                  styles.title
                )}
              >
                {loyalty?.[0]?.points && (
                  <img
                    height={"18px"}
                    className={globalStyles.marginR10}
                    src={checkmarkCircle}
                    alt="checkmarkdone"
                  />
                )}
                <span className={isActive ? "" : styles.closed}>
                  CERISE LOYALTY POINTS
                </span>
              </div>

              {loyalty?.[0]?.points && (
                <div
                  className={cs(
                    styles.col12,
                    bootstrapStyles.colMd6,
                    styles.selectedStvalue,
                    styles.cerisePointsWrapper
                  )}
                >
                  <span className={styles.marginR10}>
                    <span className={styles.redeemPoints}>
                      {loyalty?.[0]?.points} CERISE POINTS
                    </span>
                    <span className={styles.promoCodeApplied}>Redeemed</span>
                    <span className={styles.redeemPointsText}>
                      You have successfully redeemed your Cerise Points
                    </span>
                  </span>
                  <span
                    className={cs(globalStyles.pointer, styles.promoEdit)}
                    onClick={() => removeRedeem(history, isLoggedIn)}
                  >
                    REMOVE
                  </span>
                </div>
              )}
            </div>
            {loyalty?.[0]?.points ? null : (
              <>
                <hr className={styles.hr} />
                <div className={globalStyles.flex}>
                  <div className={styles.inputContainer}>
                    <label
                      className={cs(
                        globalStyles.flex,
                        globalStyles.crossCenter
                      )}
                    >
                      <div className={styles.marginR10}>
                        <span className={styles.checkbox}>
                          <input
                            type="radio"
                            checked={isactiveredeem}
                            onClick={() => {
                              toggleInputReedem();
                            }}
                          />
                          <span
                            className={cs(styles.indicator, {
                              [styles.checked]: isactiveredeem
                            })}
                          ></span>
                        </span>
                      </div>
                      <div
                        className={cs(
                          styles.formSubheading,
                          styles.checkBoxHeading
                        )}
                      >
                        See my balance & redeem points
                      </div>
                    </label>
                  </div>
                </div>
              </>
            )}
          </Fragment>
        </div>
      )}

      <div
        className={
          isActive
            ? cs(styles.card, styles.cardOpen, styles.marginT5)
            : cs(styles.card, styles.cardClosed, styles.marginT5)
        }
      >
        <div className={bootstrapStyles.row}>
          <div
            className={cs(
              bootstrapStyles.col12,
              bootstrapStyles.colMd6,
              styles.title
            )}
          >
            <span className={isActive ? "" : styles.closed}>
              GIFTING & PAYMENT
            </span>
          </div>
        </div>
        {isActive && (
          <Fragment>
            {showGiftWrap && (
              <>
                {!basket.isOnlyGiftCart && giftWrapRender}
                {giftwrap && !basket.isOnlyGiftCart && (
                  <div className={styles.giftWrapMessage}>
                    <textarea
                      rows={5}
                      className={styles.giftMessage}
                      value={textarea}
                      placeholder={"add message (optional)"}
                      autoComplete="new-password"
                      onChange={(e: any) => {
                        if (e.target.value.length <= 250) {
                          setTextarea(e.target.value);
                        } else if (e.target.value.length >= 250) {
                          setTextarea(e.target.value.substring(0, 250));
                        }
                      }}
                    />
                    <div className={cs(globalStyles.textLeft, styles.font14)}>
                      Char Limit: {250 - textarea.length} / 250
                    </div>
                  </div>
                )}
                {giftwrap && !basket.isOnlyGiftCart && giftShowPrice}
                {!basket.isOnlyGiftCart && <hr className={styles.hr} />}
              </>
            )}
            <div className={globalStyles.marginT20}>
              {!basket.isOnlyGiftCart && (
                <div className={globalStyles.flex}>
                  <hr className={styles.hr} />
                  {/* <div
                  className={cs(
                    styles.marginR10,
                    globalStyles.cerise,
                    globalStyles.pointer
                  )}
                  onClick={toggleInput}
                >
                  {isactivepromo ? "-" : "+"}
                </div> */}
                  <div className={styles.inputContainer}>
                    <label
                      className={cs(
                        globalStyles.flex,
                        globalStyles.crossCenter
                      )}
                    >
                      <div className={styles.marginR10}>
                        <span className={styles.checkbox}>
                          <input
                            type="radio"
                            checked={isactivepromo}
                            onClick={() => {
                              toggleInput();
                            }}
                          />
                          <span
                            className={cs(styles.indicator, {
                              [styles.checked]: isactivepromo
                            })}
                          ></span>
                        </span>
                      </div>
                      <div className={cs(styles.formSubheading)}>
                        {"Apply Gift Card Code/ Credit Note"}
                      </div>
                    </label>
                    {isactivepromo ? <ApplyGiftcard /> : ""}
                    {/* {renderInput()}
                {renderCoupon()} */}
                  </div>
                </div>
              )}

              {/* {isPaymentNeeded && <hr className={styles.hr} />} */}
              {/* {isPaymentNeeded && (
              <div className={globalStyles.marginT30}>
                <div className={styles.title}>SELECT YOUR MODE OF PAYMENT</div>
                {getMethods.map(function(method, index) {
                  return (
                    <div className={globalStyles.marginT20} key={index}>
                      <label
                        className={cs(
                          globalStyles.flex,
                          globalStyles.crossCenter
                        )}
                      >
                        <div className={styles.marginR10}>
                          <span className={styles.radio}>
                            <input
                              type="radio"
                              value={method.mode}
                              checked={
                                method.mode == currentmethod.mode ? true : false
                              }
                              onChange={event => onMethodChange(event, method)}
                            />
                            <span className={styles.indicator}></span>
                          </span>
                        </div>
                        <div className={globalStyles.c10LR}>{method.value}</div>
                      </label>
                    </div>
                  );
                })}
              </div>
            )} */}
            </div>

            {/* <div
            className={cs(globalStyles.errorMsg, globalStyles.marginT20)}
            data-name="error-msg"
          >
            {paymentError}
          </div>
          <div>
            <hr className={styles.hr} />
          </div>
          <label
            className={cs(
              globalStyles.flex,
              { [globalStyles.crossCenter]: !mobile },
              globalStyles.voffset2
            )}
          >
            <div className={styles.marginR10}>
              <span className={styles.checkbox}>
                <input
                  type="checkbox"
                  id="subscribe"
                  onChange={e => {
                    onClickSubscribe(e);
                  }}
                  checked={subscribevalue}
                />
                <span className={styles.indicator}></span>
              </span>
            </div>
            <div className={globalStyles.c10LR}>
              <label
                htmlFor="subscribe"
                className={cs(globalStyles.pointer, styles.linkCerise)}
              >
                I agree to receiving e-mails, newsletters, calls and text
                messages for service related information. To know more how we
                keep your data safe, refer to our{" "}
                <Link to="/customer-assistance/privacy-policy" target="_blank">
                  Privacy Policy
                </Link>
              </label>
            </div>
          </label> */}
            {/* {currency == "GBP" && (
            <label
              className={cs(
                globalStyles.flex,
                globalStyles.crossCenter,
                globalStyles.voffset2
              )}
            >
              <div className={styles.marginR10}>
                <span className={styles.checkbox}>
                  <input
                    type="checkbox"
                    id="subscribe1"
                    onChange={e => {
                      onClikcSubscribeGbp(e);
                    }}
                    checked={subscribegbp}
                  />
                  <span className={styles.indicator}></span>
                </span>
              </div>
              <div className={globalStyles.c10LR}>
                <label
                  htmlFor="subscribe1"
                  className={cs(globalStyles.pointer, styles.linkCerise)}
                >
                  I agree to pay the additional applicable duties and taxes
                  directly to the shipping agency at the time of order delivery.
                  To know more, refer to our{" "}
                  <Link
                    to="/customer-assistance/shipping-payment"
                    target="_blank"
                  >
                    {`Shipping & Payment Terms`}
                  </Link>
                </label>
              </div>
            </label>
          )}
          <div
            className={cs(globalStyles.errorMsg, globalStyles.marginT20)}
            data-name="error-msg"
          >
            {gbpError}
          </div> */}
            {/* {isLoading && <Loader />}
          <button
            className={cs(globalStyles.marginT10, globalStyles.ceriseBtn, {
              [globalStyles.disabledBtn]: isLoading
            })}
            onClick={onsubmit}
            disabled={isLoading}
          >
            {isPaymentNeeded
              ? mobile
                ? "PROCEED TO PAYMENT GATEWAY"
                : "PROCEED TO A SECURE PAYMENT GATEWAY"
              : "PLACE ORDER"}
          </button> */}
          </Fragment>
        )}
      </div>

      {isActive && (
        <>
          <div
            className={
              isActive
                ? cs(styles.card, styles.cardOpen, styles.marginT5)
                : cs(styles.card, styles.cardClosed, styles.marginT5)
            }
          >
            {isPaymentNeeded && (
              <div className={globalStyles.marginT30}>
                <div className={styles.title}>SELECT PAYMENT METHOD</div>
                {getMethods.map(function(method, index) {
                  return (
                    <div className={globalStyles.marginT20} key={index}>
                      <label
                        className={cs(
                          globalStyles.flex,
                          globalStyles.crossCenter
                        )}
                      >
                        <div className={styles.marginR10}>
                          <span className={styles.radio}>
                            <input
                              type="radio"
                              value={method.mode}
                              checked={
                                method.mode == currentmethod.mode ? true : false
                              }
                              onChange={event => onMethodChange(event, method)}
                            />
                            <span className={styles.indicator}></span>
                          </span>
                        </div>
                        <div className={styles.paymentTitle}>
                          {method.value}
                        </div>
                      </label>
                    </div>
                  );
                })}

                <div
                  className={cs(globalStyles.errorMsg, globalStyles.marginT20)}
                  data-name="error-msg"
                >
                  {paymentError}
                </div>
                <div>
                  <hr className={styles.hr} />
                </div>
                <label
                  className={cs(
                    globalStyles.flex,
                    { [globalStyles.crossCenter]: !mobile },
                    globalStyles.voffset2
                  )}
                >
                  <div className={styles.marginR10}>
                    <span className={styles.checkbox}>
                      <input
                        type="checkbox"
                        id="subscribe"
                        onChange={e => {
                          onClickSubscribe(e);
                        }}
                        checked={subscribevalue}
                      />
                      <span
                        className={cs(styles.indicator, {
                          [styles.checked]: subscribevalue
                        })}
                      ></span>
                    </span>
                  </div>
                  <div className={globalStyles.c10LR}>
                    <label
                      htmlFor="subscribe"
                      className={cs(
                        globalStyles.pointer,
                        styles.linkCerise,
                        styles.formSubheading,
                        styles.checkBoxHeading
                      )}
                    >
                      I agree to receiving e-mails, newsletters, calls and text
                      messages for service related information. To know more how
                      we keep your data safe, refer to our{" "}
                      <Link
                        to="/customer-assistance/privacy-policy"
                        target="_blank"
                      >
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                </label>
              </div>
            )}
            {isLoading && <Loader />}
            {!checkoutMobileOrderSummary && (
              <button
                ref={PaymentButton}
                className={cs(
                  globalStyles.marginT10,
                  styles.sendToPayment,
                  styles.proceedToPayment,
                  {
                    [styles.disabledBtn]:
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
          </div>
          {mobile && (
            <OrderSummary
              mobile={mobile}
              currency={currency}
              shippingAddress={shippingAddress}
              salestatus={salestatus}
              validbo={false}
              basket={basket}
              page="checkoutMobileBottom"
              setCheckoutMobileOrderSummary={setCheckoutMobileOrderSummary}
              isLoading={isLoading}
              currentmethod={currentmethod}
              isPaymentNeeded={isPaymentNeeded}
              onsubmit={onsubmit}
            />
          )}
        </>
      )}
    </>
  );
};

export default PaymentSection;
