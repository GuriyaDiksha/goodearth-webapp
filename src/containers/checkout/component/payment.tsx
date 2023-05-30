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
import AccountServices from "services/account";
import { updatePreferenceData } from "actions/user";
import LoginService from "services/login";
import { updateCountryData } from "actions/address";
import WhatsappSubscribe from "components/WhatsappSubscribe";
// import { makeid } from "utils/utility";
import { CONFIG } from "constants/util";
import Formsy from "formsy-react";
import { displayPriceWithCommasFloat } from "utils/utility";

const PaymentSection: React.FC<PaymentProps> = props => {
  const data: any = {};
  const {
    basket,
    device: { mobile },
    info: { showGiftWrap },
    basket: { loyalty },
    user: { loyaltyData, isLoggedIn, preferenceData },
    address: { countryData }
  } = useSelector((state: AppState) => state);
  let PaymentChild: any = useRef<typeof ApplyGiftcard>(null);
  const history = useHistory();
  const { isActive, currency, checkout, shippingAddress, salestatus } = props;
  const [paymentError, setPaymentError] = useState("");
  const [whatsappNoErr, setWhatsappNoErr] = useState("");
  const [subscribevalue, setSubscribevalue] = useState(false);
  const [isdList, setIsdList] = useState<any>([]);
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
  const whatsappCheckRef = useRef<HTMLInputElement>();

  const whatsappFormRef = useRef<Formsy>(null);

  const fetchCountryData = async () => {
    const data = await LoginService.fetchCountryData(dispatch);
    dispatch(updateCountryData(data));
    const isdList = data.map(list => {
      return list.isdCode;
    });
    setIsdList(isdList);
  };

  const PaymentButton = useRef(null);

  const toggleInput = async () => {
    if (basket.giftCards.length > 0 && isactivepromo) {
      setIsLoading(true);
      if (PaymentChild.onClose) {
        for await (const giftcard of basket?.giftCards) {
          const data: any = {
            cardId: giftcard?.cardId,
            type: giftcard?.cardType
          };

          await CheckoutService.removeGiftCard(dispatch, data);
        }

        await BasketService.fetchBasket(
          dispatch,
          "checkout",
          history,
          isLoggedIn
        );
        setIsLoading(false);
      }
    }
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
    setIsLoading(true);
    const promo: any = await CheckoutService.removeRedeem(dispatch);
    BasketService.fetchBasket(dispatch, "checkout", history, isLoggedIn);
    setIsLoading(false);
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
    const whatsappFormValues = whatsappFormRef.current?.getCurrentValues();
    let whatsappSubscribe = whatsappFormValues?.whatsappSubscribe;
    let whatsappNo = whatsappFormValues?.whatsappNo;
    let whatsappNoCountryCode = whatsappFormValues?.whatsappNoCountryCode;
    // if (!whatsappSubscribe) {
    //   whatsappNo = preferenceData?.whatsappNo;
    //   whatsappNoCountryCode = preferenceData?.whatsappNoCountryCode;
    // }
    if (currentmethod.mode || isFree) {
      if (!whatsappFormRef.current) {
        whatsappSubscribe = preferenceData.whatsappSubscribe;
        whatsappNo = preferenceData.whatsappNo;
        whatsappNoCountryCode = preferenceData.whatsappNoCountryCode;
      }
      const data: any = {
        paymentMethod: isFree ? "FREE" : currentmethod.key,
        paymentMode: currentmethod.mode,
        whatsappSubscribe: whatsappSubscribe
      };
      if (whatsappSubscribe) {
        data.whatsappNo = whatsappNo;
        data.whatsappNoCountryCode = whatsappNoCountryCode;
      }
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
      setWhatsappNoErr("");
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
          setWhatsappNoErr("");
          let msg = showErrors(error.response?.data.msg);
          const errorType = error.response?.data.errorType;
          if (errorType && errorType == "qty") {
            msg =
              "Some of the products in your cart have been updated/become unavailable. Please refresh before proceeding.";
          }
          setPaymentError(msg);
          errorTracking([msg], location.href);
          document.getElementById("payment-section")?.scrollIntoView();
          setIsLoading(false);
          const errData = error.response?.data;
          if (
            errData === "'whatsappNo'" ||
            errData === "'whatsappNoCountryCode'"
          ) {
            setWhatsappNoErr("Please enter a Whatsapp Number");
          }
          Object.keys(errData).map(key => {
            switch (key) {
              case "whatsappNo":
                if (errData[key][0] == "This field may not be blank.") {
                  setWhatsappNoErr("Please enter a Whatsapp Number");
                }
                // whatsappFormRef.current?.updateInputsWithError(
                //   {
                //     [key]: errData[key][0]
                //   },
                //   true
                // );
                // // setNumberError(errData[key][0]);
                break;
              case "non_field_errors":
                // // Invalid Whatsapp number
                setWhatsappNoErr("Please enter a valid Whatsapp Number");
                // //This is not working
                // whatsappFormRef.current?.updateInputsWithError(
                //   {
                //     ["whatsappNo"]: errData[key][0]
                //   },
                //   true
                // );
                break;
            }
          });
        });
    } else {
      if (whatsappSubscribe) {
        if (whatsappNo == "") {
          setWhatsappNoErr("Please enter a Whatsapp Number");
        } else {
          setWhatsappNoErr("");
        }
      } else {
        setWhatsappNoErr("");
      }
      setPaymentError("Please select a payment method");
      errorTracking(["Please select a payment method"], location.href);
      document.getElementById("payment-section")?.scrollIntoView();
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

    if (countryData.length == 0) {
      fetchCountryData();
    } else {
      const isdList = countryData.map(list => {
        return list.isdCode;
      });
      setIsdList(isdList);
    }
  }, []);

  useEffect(() => {
    if (basket.giftCards.length > 0) {
      setIsactivepromo(true);
    } else {
      setIsactivepromo(false);
    }
    if (basket.loyalty.length > 0) {
      setIsactiveredeem(true);
    } else {
      setIsactiveredeem(false);
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

  useEffect(() => {
    if (isActive) {
      if (CONFIG.WHATSAPP_SUBSCRIBE_ENABLED) {
        AccountServices.fetchAccountPreferences(dispatch).then((data: any) => {
          dispatch(updatePreferenceData(data));
        });
      }
    }
  }, [isActive]);

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
          <div
            className={cs(
              styles.marginR10,
              globalStyles.giftWrapLineHeight,
              globalStyles.marginT5
            )}
          >
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
            <img src={giftwrapIcon} width="30px" alt="Giftwarp Icon" />
          </div>
        </label>
      </div>
    );
  }, [giftwrap]);

  const giftShowPrice = useMemo(() => {
    return (
      <div className={globalStyles.marginT20}>
        <label className={cs(globalStyles.flex, globalStyles.crossCenter)}>
          <div className={cs(styles.marginR10, globalStyles.marginT5)}>
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
          <div
            className={cs(
              styles.formSubheading,
              styles.checkBoxHeading,
              globalStyles.fontSize12
            )}
          >
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
            {loyalty?.[0]?.points || !isActive ? null : (
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

      {(!basket.isOnlyGiftCart || !isActive) && (
        <div
          className={
            isActive
              ? cs(styles.card, styles.cardOpen, styles.marginT5)
              : mobile
              ? styles.hidden
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
                        placeholder={"Add message (optional)"}
                        autoComplete="new-password"
                        onChange={(e: any) => {
                          if (e.target.value.length <= 250) {
                            setTextarea(e.target.value);
                          } else if (e.target.value.length >= 250) {
                            setTextarea(e.target.value.substring(0, 250));
                          }
                        }}
                      />
                      <div
                        className={cs(
                          globalStyles.textLeft,
                          styles.font14,
                          styles.charLimitText
                        )}
                      >
                        Char Limit: {250 - textarea.length}/250
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
                      {isactivepromo ? (
                        <ApplyGiftcard
                          onRef={(e1: any) => {
                            PaymentChild = e1;
                          }}
                        />
                      ) : (
                        ""
                      )}
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
            {CONFIG.WHATSAPP_SUBSCRIBE_ENABLED && (
              <div className={styles.loginForm}>
                <div className={styles.categorylabel}>
                  <WhatsappSubscribe
                    data={preferenceData}
                    innerRef={whatsappCheckRef}
                    isdList={isdList}
                    showTermsMessage={false}
                    showTooltip={true}
                    showManageMsg={true}
                    showPhone={true}
                    whatsappClass={styles.whatsapp}
                    countryCodeClass={styles.countryCode}
                    checkboxLabelClass={styles.checkboxLabel}
                    allowUpdate={true}
                    uniqueKey={"paymentid123"}
                    oneLineMessage={!mobile}
                    whatsappFormRef={whatsappFormRef}
                    whatsappNoErr={whatsappNoErr}
                  />
                </div>
                {/* <div className={styles.whatsappNoErr}>{whatsappNoErr}</div> */}
              {/*</div>
            )}
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
      )}

      {isActive && (
        <>
          <div
            className={
              isActive
                ? cs(styles.card, styles.cardOpen, styles.marginT5)
                : cs(styles.card, styles.cardClosed, styles.marginT5)
            }
            id="payment-section"
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
                        <div
                          className={cs(styles.paymentTitle, {
                            [styles.selectedValue]:
                              method.mode == currentmethod.mode
                          })}
                        >
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
                  {CONFIG.WHATSAPP_SUBSCRIBE_ENABLED && (
                    <div className={styles.loginForm}>
                      <div className={styles.categorylabel}>
                        <WhatsappSubscribe
                          data={preferenceData}
                          innerRef={whatsappCheckRef}
                          isdList={isdList}
                          showTermsMessage={false}
                          showTooltip={true}
                          showManageMsg={true}
                          showPhone={true}
                          whatsappClass={styles.whatsapp}
                          countryCodeClass={styles.countryCode}
                          checkboxLabelClass={styles.checkboxLabel}
                          allowUpdate={true}
                          uniqueKey={"paymentid123"}
                          oneLineMessage={!mobile}
                          whatsappFormRef={whatsappFormRef}
                          whatsappNoErr={whatsappNoErr}
                        />
                      </div>
                      {/* <div className={styles.whatsappNoErr}>
                        {whatsappNoErr}
                      </div> */}
                    </div>
                  )}
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
                        styles.checkBoxHeading,
                        styles.agreeTermsAndCondition
                      )}
                    >
                      I agree to receiving e-mails, newsletters, calls and text
                      messages for service related information. To know more how
                      we keep your data safe, refer to our{" "}
                      <Link
                        to="/customer-assistance/privacy-policy"
                        target="_blank"
                        className="privacyPolicyAgreement"
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
                disabled={isLoading}
              >
                <span>
                  Amount Payable:{" "}
                  {String.fromCharCode(...currencyCodes[props.currency])}{" "}
                  {displayPriceWithCommasFloat(
                    basket?.total?.toString(),
                    currency
                  )}
                  {/* {parseFloat(basket?.total?.toString()).toFixed(2)} */}
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
