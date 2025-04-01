import React, { useState, Fragment, useEffect, useMemo, useRef } from "react";
import cs from "classnames";
import bootstrapStyles from "../../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import { PaymentProps } from "./typings";
import ApplyGiftcard from "./applyGiftcard";
import { useSelector, useDispatch } from "react-redux";
import { AppState } from "reducers/typings";
import { Link, useHistory } from "react-router-dom";
import Loader from "components/Loader";
import giftwrapIcon from "../../../images/gift-wrap-icon.svg";
import { errorTracking, showErrors } from "utils/validate";
// import { POPUP } from "constants/components";
import CookieService from "services/cookie";
import { proceedForPayment, getPageType } from "../../../utils/validate";
// import { currencyCodes } from "constants/currency";
import { updateComponent, updateModal } from "actions/modal";
import { POPUP } from "constants/components";
import checkmarkCircle from "./../../../images/checkmarkCircle.svg";
import BasketService from "services/basket";
import OrderSummary from "./orderSummary";
import CheckoutService from "services/checkout";
import AccountServices from "services/account";
import { GA_CALLS } from "constants/cookieConsent";
import { updatePreferenceData } from "actions/user";
import LoginService from "services/login";
import { updateCountryData } from "actions/address";
import WhatsappSubscribe from "components/WhatsappSubscribe";
import { CONFIG, DEACTIVATE_REDEEM_SECTION } from "constants/util";
import Formsy from "formsy-react";
import CheckboxWithLabel from "components/CheckboxWithLabel";
import { displayPriceWithCommasFloat } from "utils/utility";
import { Currency } from "typings/currency";
import Button from "components/Button";
import { STEP_ORDER } from "../constants";
import FormTextArea from "components/Formsy/FormTextArea";
import ApplyCreditNote from "./ApplyCreditNote";
import ApplyGiftCards from "./ApplyGiftCards";
import AccountService from "services/account";

const PaymentSection: React.FC<PaymentProps> = props => {
  const data: any = {};
  const {
    basket,
    device: { mobile, tablet },
    info: { showGiftWrap, deliveryText },
    basket: { loyalty },
    user: { loyaltyData, isLoggedIn, preferenceData, slab },
    address: { countryData, shippingAddressId, billingAddressId },
    info: { isSale },
    checkout: { GCCNData }
  } = useSelector((state: AppState) => state);
  const PaymentChild: any = useRef<typeof ApplyGiftcard>(null);
  const history = useHistory();
  const {
    isActive,
    currency,
    checkout,
    shippingAddress,
    salestatus,
    gstNo,
    currentStep,
    activeStep,
    isGcCheckout
  } = props;
  const [paymentError, setPaymentError] = useState("");
  const [lineItemError, setLineItemError] = useState("");
  const [policyError, setPolicyError] = useState("");
  const [whatsappNoErr, setWhatsappNoErr] = useState("");
  const [subscribevalue, setSubscribevalue] = useState(false);
  const [usersubscribevalue, setUserSubscribevalue] = useState(false);
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
  // const [redeemOtpError, setRedeemOtpError] = useState("");
  const [getMethods, setGetMethods] = useState<any[]>([]);
  const [checkoutMobileOrderSummary, setCheckoutMobileOrderSummary] = useState(
    false
  );
  const dispatch = useDispatch();
  const whatsappCheckRef = useRef<HTMLInputElement>();

  const whatsappFormRef = useRef<Formsy>(null);

  const prevGiftCardRef = useRef<any>(
    basket.giftCards?.filter(ele => ele?.cardType === "GIFTCARD")
  );
  const prevLoyaltytRef = useRef<any>(basket.loyalty);
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
        for await (const giftcard of basket?.giftCards?.filter(
          ele => ele?.cardType === "GIFTCARD"
        )) {
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

  const removeRedeem = async () => {
    setIsLoading(true);
    const promo: any = await CheckoutService.removeRedeem(dispatch);
    BasketService.fetchBasket(dispatch, "checkout", history, isLoggedIn);
    setIsLoading(false);
    return promo;
  };

  const toggleInputReedem = () => {
    if (DEACTIVATE_REDEEM_SECTION) {
      return false;
    }

    setIsactiveredeem(true);

    dispatch(
      updateComponent(
        POPUP.REDEEMPOPUP,
        {
          setIsactiveredeem,
          removeRedeem
        },
        true
      )
    );
    dispatch(updateModal(true));
  };

  const onClickSubscribe = (event: any) => {
    setSubscribevalue(event.target.checked);
  };

  const onClickUserSubscribe = (event: any) => {
    setUserSubscribevalue(event.target.checked);
    event.target.checked
      ? setPolicyError("")
      : setPolicyError("Please accept the Terms & Conditions");
  };

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
        whatsappSubscribe: whatsappSubscribe,
        subscribe: subscribevalue,
        usersubscribe: usersubscribevalue
      };
      if (whatsappSubscribe) {
        data.whatsappNo = whatsappNo;
        data.whatsappNoCountryCode = whatsappNoCountryCode;
      }
      if (userConsent.includes(GA_CALLS)) {
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
        if (userConsent.includes(GA_CALLS)) {
          dataLayer.push({
            event: "gift_wrap"
          });
        }
      }
      if (!usersubscribevalue) {
        // Set the error message
        setPolicyError("Please accept the Terms & Conditions");

        // Delay scroll action until the next frame
        window?.requestAnimationFrame(() => {
          const policyErrorElement = document?.getElementById("policy-error");
          if (policyErrorElement) {
            policyErrorElement.scrollIntoView({
              behavior: "smooth",
              block: "center"
            });
          }
        });

        return false;
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

      if (userConsent.includes(GA_CALLS)) {
        const categoryname: string[] = [];
        const subcategoryname: string[] = [];
        const productid: string[] = [];
        const productname: string[] = [];
        const productprice: string[] = [];
        const productquantity: number[] = [];

        const items = basket?.lineItems?.map((line: any, ind) => {
          const index = line.product.categories
            ? line.product.categories.length - 1
            : 0;
          let category =
            line.product.categories && line.product.categories[index]
              ? line.product.categories[index].replace(/\s/g, "")
              : "";
          const arr = category.split(">");
          categoryname.push(arr[arr.length - 2]);
          subcategoryname.push(arr[arr.length - 1]);
          category = category.replace(/>/g, "/");
          productid.push(line.product.sku);
          productname.push(line.title);
          productprice.push(
            line?.product?.priceRecords?.[currency as Currency]
          );
          productquantity.push(+line.quantity);
          const search = CookieService.getCookie("search") || "";
          const cat1 = line?.product?.categories?.[0]?.split(">");
          const cat2 = line?.product?.categories?.[1]?.split(">");

          const L1 = cat1?.[0]?.trim();

          const L2 = cat1?.[1] ? cat1?.[1]?.trim() : cat2?.[1]?.trim();

          const L3 = cat2?.[2]
            ? cat2?.[2]?.trim()
            : line?.product?.categories?.[2]?.split(">")?.[2]?.trim();

          const clickType = localStorage.getItem("clickType");

          return {
            item_id: line.stockRecords?.[0]?.partnerSku,
            item_name: line.product?.title,
            affiliation: "NA",
            coupon:
              isSale && basket?.offerDiscounts?.[0]?.name
                ? basket?.offerDiscounts?.[0]?.name
                : "NA", //Pass NA if not applicable at the moment
            discount:
              isSale && basket?.offerDiscounts?.[0]?.amount
                ? line?.badgeType == "B_flat"
                  ? basket?.offerDiscounts?.[0]?.amount
                  : line.product.priceRecords[currency as Currency] -
                    basket?.offerDiscounts?.[0]?.amount
                : "NA",
            index: ind,
            item_brand: "Goodearth",
            item_category: L1,
            item_category2: L2,
            item_category3: L3,
            item_category4: "NA",
            item_category5: line.product.is3d ? "3d" : "non3d",
            item_list_id: "NA",
            item_list_name: search ? `${clickType}-${search}` : "NA",
            item_variant: line.product?.childAttributes[0]?.size || "NA",
            price: line.isEgiftCard
              ? +line.priceExclTax
              : line.product.priceRecords[currency as Currency],
            quantity: line.quantity,
            collection_category: line?.product?.collections?.join("|"),
            country_custom: CookieService.getCookie("country"),
            price_range: "NA"
          };
        });

        const sameAsShipping = shippingAddressId === billingAddressId;

        dataLayer.push({
          event: "add_payment_info",
          previous_page_url: CookieService.getCookie("prevUrl"),
          billing_address: sameAsShipping
            ? "Same as Shipping Address"
            : billingAddressId,
          shipping_address: shippingAddressId,
          gst_invoice: gstNo ? "Yes" : "No",
          gift_wrap: giftwrap ? "Yes" : "No",
          gift_card_code: basket.giftCards?.[0]?.cardId,
          delivery_instruction: deliveryText ? "Yes" : "No", //Pass NA if not applicable the moment
          ecommerce: {
            currency: currency,
            value: +basket.total,
            coupon: basket.voucherDiscounts?.[0]?.voucher?.code || "NA", //Pass NA if Not applicable at the moment
            payment_type: currentmethod.value,
            items: items
          }
        });
      }

      data["subscribe"] = subscribevalue; //Adding subscribe for main checkout API
      checkout(data)
        .then((response: any) => {
          gtmPushPaymentTracking(paymentMode, paymentMethod);
          // proceedForPayment(basket, currency, paymentMethod, isSale);
          dataLayer.push({
            event: "Whatsapp_optin",
            Location: "Checkout",
            Checkbox: data.whatsappSubscribe
              ? "Whatsapp Opt-in"
              : "Whatsapp Opt-out"
          });
          location.href = `${__API_HOST__ + response.paymentUrl}`;
          setIsLoading(false);
        })
        .catch((error: any) => {
          setWhatsappNoErr("");
          let msg = showErrors(error.response?.data.msg);
          const errorType = error.response?.data.errorType;
          if (errorType && errorType == "qty") {
            msg =
              "Some items in your cart have been modified or are no longer available. Kindly refresh before proceeding.";
          }
          setLineItemError(msg);
          errorTracking([msg], location.href);
          document?.getElementById("payment-section")?.scrollIntoView();
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
              case "whatsappNoCountryCode":
                if (errData[key][0] == "This field may not be blank.") {
                  setWhatsappNoErr("Please enter a Whatsapp Number");
                }

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
      setPaymentError("Please select a Payment Method");
      errorTracking(["Please select a Payment Method"], location.href);
      document?.getElementById("payment-section")?.scrollIntoView();
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
    if (prevGiftCardRef.current.length) {
      setIsactivepromo(true);
    }
  }, []);

  useEffect(() => {
    if (prevLoyaltytRef.current.length != basket.loyalty.length) {
      if (basket.loyalty.length > 0 && basket.loyalty[0].isValidated) {
        setIsactiveredeem(true);
        prevLoyaltytRef.current = basket.loyalty;
      } else {
        setIsactiveredeem(false);
      }
    }
    // if (basket.loyalty.length > 0 && basket.loyalty[0].isValidated) {
    //   setIsactiveredeem(true);
    // }
  }, [basket.loyalty]);

  useEffect(() => {
    const GC = basket.giftCards.filter(ele => ele?.cardType === "GIFTCARD");
    if (prevGiftCardRef.current.length != GC.length) {
      if (GC.length > 0) {
        setIsactivepromo(true);
        prevGiftCardRef.current = GC;
      } else {
        setIsactivepromo(false);
      }
    }
  }, [basket.giftCards]);

  useEffect(() => {
    setWhatsappNoErr("");
    CheckoutService.getPaymentList(dispatch)
      .then((res: any) => {
        // console.log(res.methods);
        setGetMethods(res.methods);
      })
      .catch(err => {
        console.group(err);
      });
    AccountService.fetchGC_CN_Ammount(dispatch);
  }, [currency]);

  useEffect(() => {
    if (giftwrap) {
      setGiftwrap(false);
    }
  }, [currency]);

  useEffect(() => {
    if (isActive) {
      if (CONFIG.WHATSAPP_SUBSCRIBE_ENABLED) {
        AccountServices.fetchAccountPreferences(dispatch).then((data: any) => {
          setSubscribevalue(data.subscribe); // Initializing value
          dispatch(updatePreferenceData(data));
          setSubscribevalue(data.subscribe);
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
    // if (event.target.checked) {
    //   setCurrentmethod(method);
    //   setPaymentError("");
    // }
    if (event.target === event.currentTarget) {
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
        <CheckboxWithLabel
          id="giftWrp"
          checked={giftwrap}
          onChange={() => {
            setGiftwrap(!giftwrap);
            setGiftwrapprice(!giftwrap);
          }}
          disabled={!showGiftWrap}
          label={[
            <label
              key="giftWrp"
              htmlFor="giftWrp"
              className={cs(
                styles.formSubheading,
                styles.lineHeightLable,
                styles.giftWrpPos,
                { [styles.disabledGiftWrap]: !showGiftWrap }
              )}
            >
              {"Gift wrap this order"}{" "}
              <span className={styles.giftImg}>
                <img src={giftwrapIcon} width="30px" alt="Giftwarp Icon" />
              </span>
            </label>
          ]}
        />
        {!showGiftWrap && (
          <div className={cs(styles.giftWrapErr)}>
            Due to high order volumes, this service is temporarily unavailable
          </div>
        )}
        {/* <label className={cs(globalStyles.flex, globalStyles.crossCenter)}>
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
            {"Gift wrap this order"}
          </div>
          <div className={styles.giftImg}>
            <img src={giftwrapIcon} width="30px" alt="Giftwarp Icon" />
          </div>
        </label> */}
      </div>
    );
  }, [giftwrap, showGiftWrap, currency]);

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
            {"Please remove prices from all items in this shipment"}
          </div>
        </label>
      </div>
    );
  }, [giftwrapprice]);

  return (
    <>
      {(slab.toLowerCase() === "cerise club" ||
        slab.toLowerCase() === "cerise sitara") &&
        loyaltyData?.CustomerPointInformation &&
        !isGcCheckout &&
        currency == "INR" && (
          <div
            id="cerise-section"
            className={
              isActive && !loyalty?.[0]?.points
                ? cs(styles.card, styles.cardOpen, styles.marginT5)
                : cs(styles.card, styles.cardClosed, styles.marginT5, {
                    [styles.bgWhite]: STEP_ORDER[activeStep] > currentStep
                  })
            }
          >
            <Fragment>
              <div className={bootstrapStyles.row}>
                <div
                  className={cs(
                    bootstrapStyles.col12,
                    bootstrapStyles.colMd6,
                    styles.title,
                    { [globalStyles.marginB15]: mobile }
                  )}
                >
                  {STEP_ORDER[activeStep] <= currentStep &&
                    loyalty?.[0]?.points && (
                      <img
                        height={"15px"}
                        className={globalStyles.marginR10}
                        src={checkmarkCircle}
                        alt="checkmarkdone"
                      />
                    )}
                  <span className={isActive ? "" : styles.closed}>
                    CERISE LOYALTY POINTS
                  </span>
                </div>

                {loyalty?.[0]?.points && STEP_ORDER[activeStep] <= currentStep && (
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
                      onClick={() => removeRedeem()}
                    >
                      REMOVE
                    </span>
                  </div>
                )}
              </div>
              {loyalty?.[0]?.points || !isActive ? null : (
                <>
                  {!mobile && <hr className={styles.hr} />}
                  <div className={globalStyles.flex}>
                    <div className={styles.inputContainer}>
                      <CheckboxWithLabel
                        id="cerise"
                        checked={isactiveredeem}
                        onChange={toggleInputReedem}
                        className={cs({
                          [styles.hideLabel]: DEACTIVATE_REDEEM_SECTION
                        })}
                        label={[
                          <label
                            key="cerise"
                            htmlFor="cerise"
                            className={cs(
                              styles.formSubheading,
                              styles.lineHeightLable
                            )}
                          >
                            See my balance & redeem points
                          </label>
                        ]}
                      />
                      {DEACTIVATE_REDEEM_SECTION && (
                        <p className={styles.saleTimeMsg}>
                          You will not be able to earn or redeem Cerise points
                          during Sale.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* this message only show in Sale */}
                  {isSale && currency == "INR" ? (
                    <div
                      style={{
                        color: "#548B8B",
                        fontSize: "10px",
                        fontFamily: "Montserrat, sans-serif",
                        fontWeight: 500
                      }}
                    >
                      Redemption of points is applicable on select
                      non-discounted products.
                    </div>
                  ) : (
                    ""
                  )}
                </>
              )}
            </Fragment>
          </div>
        )}

      {(!basket.isOnlyGiftCart || !isActive) && (
        <div
          id="gifting-section"
          className={
            isActive
              ? cs(styles.card, styles.cardOpen, styles.marginT5)
              : mobile
              ? styles.hidden
              : cs(styles.card, styles.cardClosed, styles.marginT5, {
                  [styles.bgWhite]: STEP_ORDER[activeStep] > currentStep
                })
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
                {isGcCheckout ? "PAYMENT" : "GIFTING & PAYMENT"}
              </span>
            </div>
          </div>
          {isActive && (
            <Fragment>
              {!isGcCheckout && (
                <>
                  {!basket.isOnlyGiftCart && giftWrapRender}
                  {showGiftWrap && giftwrap && !basket.isOnlyGiftCart && (
                    <div className={styles.giftWrapMessage}>
                      <Formsy>
                        <FormTextArea
                          rows={5}
                          name="giftMessage"
                          value={textarea}
                          placeholder={"Add message (optional)"}
                          handleChange={(e: any) => {
                            if (e.target.value.length <= 250) {
                              setTextarea(e.target.value);
                            }
                          }}
                          charLimit={250}
                          maxLength={250}
                        ></FormTextArea>
                      </Formsy>
                    </div>
                  )}
                  {showGiftWrap &&
                    giftwrap &&
                    !basket.isOnlyGiftCart &&
                    giftShowPrice}
                  {!basket.isOnlyGiftCart && <hr className={styles.hr} />}
                </>
              )}
              {/* <div className={globalStyles.marginT20}>
                {!basket.isOnlyGiftCart && !isGcCheckout && (
                  <div className={globalStyles.flex}>
                    <hr className={styles.hr} />

                    <div className={styles.inputContainer}>
                      <CheckboxWithLabel
                        id="applyGC"
                        checked={isactivepromo}
                        onChange={toggleInput}
                        label={[
                          <label
                            key="applyGC"
                            htmlFor="applyGC"
                            className={cs(
                              styles.formSubheading,
                              styles.lineHeightLable
                            )}
                          >
                            Apply Gift Card
                          </label>
                        ]}
                      />

                      {isactivepromo ? (
                        <ApplyGiftcard
                          onRef={(e1: any) => {
                            PaymentChild = e1;
                          }}
                        />
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                )}
              </div>
                */}

              {!basket.isOnlyGiftCart && !isGcCheckout && (
                <ApplyGiftCards
                  hasGC={GCCNData.hasGC}
                  amountGC={GCCNData.availableGCamount}
                />
              )}

              {!basket.isOnlyGiftCart &&
                !isGcCheckout &&
                (currency === "INR" ? (
                  <ApplyCreditNote amountCN={GCCNData.availableCNamount} />
                ) : (
                  <div className={globalStyles.marginT20}>
                    <CheckboxWithLabel
                      id="applyCN_international"
                      className={styles.disabledLabel}
                      onChange={() => null}
                      label={[
                        <label
                          key="applyCN"
                          htmlFor="applyCN"
                          className={cs(
                            styles.formSubheading,
                            styles.lineHeightLable
                          )}
                        >
                          Apply Credit Note
                        </label>
                      ]}
                    />
                    <div className={styles.gcMsg}>
                      <p className={styles.greyText}>
                        No Credit Note balance available
                      </p>
                    </div>
                  </div>
                ))}

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
                    countryData={countryData}
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
            {/* <div className={styles.marginR10}>
              <span className={styles.checkbox}>
                <input
                  type="checkbox"
                 
                /> */}
              {/* <CheckboxWithLabel
                id="subscribe"
                onChange={e => {
                  onClickSubscribe(e);
                }}
                checked={subscribevalue}
                label={[
                  <label
                    key="subscribe"
                    htmlFor="subscribe"
                    className={cs(
                      globalStyles.pointer,
                      styles.linkCerise,
                      globalStyles.marginT3
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
                ]}
              /> */}
              {/* <span className={styles.indicator}></span>
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
            {
              <div>
                {isPaymentNeeded && (
                  <>
                    <div className={styles.title}>SELECT PAYMENT METHOD</div>
                    <div className={styles.paymentMthodsWrapper}>
                      {getMethods.map(function(method, index) {
                        return (
                          <div
                            className={cs(
                              globalStyles.marginT20,
                              styles.paymentItem,
                              {
                                [styles.active]:
                                  method.mode == currentmethod.mode
                              }
                            )}
                            key={index}
                            onClick={event => onMethodChange(event, method)}
                          >
                            <img src={method.icon} />
                            <div
                              className={cs(styles.paymentTitle)}
                              onClick={event => onMethodChange(event, method)}
                            >
                              {method.value}
                            </div>
                            {/* <label
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
                                      method.mode == currentmethod.mode
                                        ? true
                                        : false
                                    }
                                    onChange={event =>
                                      onMethodChange(event, method)
                                    }
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
                            </label> */}
                          </div>
                        );
                      })}
                      {currency == "INR" && (
                        <div
                          className={cs(
                            globalStyles.marginT20,
                            styles.paymentItem,
                            {
                              [styles.active]: currentmethod.mode == "NA"
                            }
                          )}
                          key={4}
                          onClick={event =>
                            onMethodChange(event, {
                              icon: "",
                              key: "razorpay",
                              mode: "NA",
                              value: "Credit/Debit"
                            })
                          }
                        >
                          <div
                            className={cs(
                              styles.paymentTitle,
                              styles.otherPaymentMode
                            )}
                            onClick={event =>
                              onMethodChange(event, {
                                icon: "",
                                key: "razorpay",
                                mode: "NA",
                                value: "Credit/Debit"
                              })
                            }
                          >
                            Other <br />
                            Modes
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {paymentError && (
                  <div
                    className={cs(
                      globalStyles.errorMsg,
                      globalStyles.marginT20
                    )}
                    data-name="error-msg"
                  >
                    {paymentError}
                  </div>
                )}
                <div>
                  {isPaymentNeeded && <hr className={styles.hr} />}
                  {CONFIG.WHATSAPP_SUBSCRIBE_ENABLED && (
                    <div
                      className={cs(styles.loginForm, styles.customCheckout)}
                    >
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
                          oneLineMessage={!mobile || tablet}
                          whatsappFormRef={whatsappFormRef}
                          whatsappNoErr={whatsappNoErr}
                          countryData={countryData}
                        />
                      </div>
                      {/* <div className={styles.whatsappNoErr}>
                        {whatsappNoErr}
                      </div> */}
                    </div>
                  )}
                </div>
                <div>
                  <div className={globalStyles.marginB20}>
                    <CheckboxWithLabel
                      id="user-subscribe"
                      onChange={e => {
                        onClickUserSubscribe(e);
                      }}
                      checked={usersubscribevalue}
                      label={[
                        <label
                          key="user-subscribe"
                          htmlFor="user-subscribe"
                          className={cs(
                            globalStyles.pointer,
                            styles.linkCerise,
                            styles.formSubheading,
                            styles.checkBoxHeading,
                            styles.agreeTermsAndCondition
                          )}
                        >
                          I agree to the{" "}
                          <Link
                            key="user-subscribe"
                            to="/customer-assistance/terms-conditions"
                            target="_blank"
                          >
                            Terms and Conditions
                          </Link>
                          *
                        </label>
                      ]}
                    />
                  </div>
                </div>
                <div>
                  <div className={globalStyles.marginB20}>
                    <CheckboxWithLabel
                      id="subscribe"
                      onChange={e => {
                        onClickSubscribe(e);
                      }}
                      checked={subscribevalue}
                      label={[
                        <label
                          key="subscribe"
                          htmlFor="subscribe"
                          className={cs(
                            globalStyles.pointer,
                            styles.linkCerise,
                            styles.formSubheading,
                            styles.checkBoxHeading,
                            styles.agreeTermsAndCondition
                          )}
                        >
                          I agree to receiving e-mails, newsletters, calls and
                          text messages for service related information. To know
                          more how we keep your data safe, refer to our{" "}
                          <Link
                            to="/customer-assistance/privacy-policy"
                            target="_blank"
                          >
                            Privacy Policy
                          </Link>
                        </label>
                      ]}
                    />
                  </div>
                </div>
                {/* <label
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
                </label> */}
              </div>
            }
            {lineItemError && (
              <div
                className={cs(globalStyles.errorMsg, globalStyles.marginT20)}
                data-name="error-msg"
              >
                {lineItemError}
              </div>
            )}
            {policyError && (
              <div
                id="policy-error"
                className={cs(globalStyles.errorMsg, globalStyles.marginT20)}
                data-name="error-msg"
              >
                {policyError}
              </div>
            )}
            {isLoading && <Loader />}
            {!checkoutMobileOrderSummary && (
              <Button
                ref={PaymentButton}
                className={cs(
                  globalStyles.marginT10,
                  styles.amtBtn,
                  // styles.sendToPayment,
                  styles.proceedToPayment
                  // {
                  //   [styles.disabledBtn]:
                  //     isLoading || Object.keys(currentmethod).length === 0
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
              checkoutMobileOrderSummary={checkoutMobileOrderSummary}
              tablet={tablet}
            />
          )}
        </>
      )}
    </>
  );
};

export default PaymentSection;
