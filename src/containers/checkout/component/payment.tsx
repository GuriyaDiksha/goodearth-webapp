import React, { useState, Fragment, useEffect, useMemo } from "react";
import cs from "classnames";
// import iconStyles from "../../styles/iconFonts.scss";
import bootstrapStyles from "../../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import { PaymentProps } from "./typings";
import ApplyGiftcard from "./applyGiftcard";
import { useSelector, useDispatch } from "react-redux";
import { AppState } from "reducers/typings";
import { Link } from "react-router-dom";
import Loader from "components/Loader";
import Reedem from "./redeem";
import { updateComponent, updateModal } from "actions/modal";
import ShippingPopup from "./shippingPopup";
import giftwrapIcon from "../../../images/gift-wrap-icon.svg";
const PaymentSection: React.FC<PaymentProps> = props => {
  const data: any = {};
  const {
    basket,
    device: { mobile }
  } = useSelector((state: AppState) => state);
  const { isActive, currency, checkout, loyaltyData } = props;
  const [paymentError, setPaymentError] = useState("");
  const [subscribevalue, setSubscribevalue] = useState(false);
  const [subscribegbp, setSubscribegbp] = useState(false);
  const [isactivepromo, setIsactivepromo] = useState(false);
  const [isactiveredeem, setIsactiveredeem] = useState(false);
  const [giftwrap, setGiftwrap] = useState(false);
  const [giftwrapprice, setGiftwrapprice] = useState(false);
  const [currentmethod, setCurrentmethod] = useState(data);
  const [isLoading, setIsLoading] = useState(false);
  const [textarea, setTextarea] = useState("");

  const dispatch = useDispatch();

  const toggleInput = () => {
    setIsactivepromo(!isactivepromo);
  };
  const toggleInputReedem = () => {
    setIsactiveredeem(!isactiveredeem);
  };

  const onClickSubscribe = (event: any) => {
    setSubscribevalue(event.target.checked);
  };

  const setAccept = () => {
    setSubscribegbp(true);
  };

  const closeModal = () => {
    // dispatch(updateComponent(<ShippingPopup closeModal={}/>, true));
    dispatch(updateModal(false));
  };

  const onClikcSubscribeGbp = (event: any) => {
    dispatch(
      updateComponent(
        <ShippingPopup closeModal={closeModal} acceptCondition={setAccept} />,
        true
      )
    );
    dispatch(updateModal(true));
  };

  // const onGiftChange =() =>{

  // }

  const onsubmit = () => {
    const isFree = +basket.total <= 0;
    if (currentmethod.mode || isFree) {
      const data: any = {
        paymentMethod: isFree ? "FREE" : currentmethod.key,
        paymentMode: currentmethod.mode
      };
      if (giftwrap) {
        data["isGift"] = giftwrap;
        data["giftRemovePrice"] = giftwrapprice;
        data["giftMessage"] = textarea;
      }
      setIsLoading(true);
      checkout(data)
        .then((response: any) => {
          location.href = `${__API_HOST__ + response.paymentUrl}`;
          setIsLoading(false);
        })
        .catch((error: any) => {
          const msg = error.response?.data?.paymentMode?.[0];
          setPaymentError(msg);
          setIsLoading(false);
        });
    } else {
      setPaymentError("Please select a payment method");
    }
  };

  useEffect(() => {
    if (basket.giftCards.length > 0) {
      setIsactivepromo(true);
    }
    if (basket.loyalty.length > 0) {
      setIsactiveredeem(true);
    }
  }, [basket.giftCards, basket.loyalty]);

  const getMethods = useMemo(() => {
    let methods = [
      {
        key: "payu",
        value: "CREDIT CARD",
        mode: "CC"
      },
      {
        key: "payu",
        value: "DEBIT CARD",
        mode: "DC"
      },
      {
        key: "payu",
        value: "NET BANKING",
        mode: "NB"
      }
    ];

    if (currency != "INR") {
      methods = [
        {
          key: "payu",
          value: "CREDIT CARD",
          mode: "CC"
        },
        {
          key: "payu",
          value: "DEBIT CARD",
          mode: "DC"
        },
        {
          key: "paypal",
          value: "PAYPAL",
          mode: "NA"
        }
      ];
    }
    return methods;
  }, [currency]);

  const onMethodChange = (event: any, method: any) => {
    if (event.target.checked) {
      setCurrentmethod(method);
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
                }}
              />
              <span className={styles.indicator}></span>
            </span>
          </div>
          <div className={globalStyles.c10LR}>{"GIFT WRAP THIS ORDER"}</div>
          <div>
            <img src={giftwrapIcon} width="40px" />
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
              <span className={styles.indicator}></span>
            </span>
          </div>
          <div className={globalStyles.c10LR}>
            {"PLEASE REMOVE PRICES FROM ALL ITEMS IN THIS SHIPMENT"}
          </div>
        </label>
      </div>
    );
  }, [giftwrapprice]);

  return (
    <div
      className={
        isActive
          ? cs(styles.card, styles.cardOpen, styles.marginT20)
          : cs(styles.card, styles.cardClosed, styles.marginT20)
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
          {true && giftWrapRender}
          {giftwrap && (
            <div>
              <textarea
                rows={5}
                cols={45}
                className={styles.giftMessage}
                value={textarea}
                placeholder={"add message (optional)"}
                autoComplete="new-password"
                onChange={(e: any) => {
                  setTextarea(e.target.value);
                }}
              />
              <div className={cs(globalStyles.textLeft, styles.font14)}>
                Character Limit: {120 - textarea.length}
              </div>
            </div>
          )}
          {giftwrap && giftShowPrice}
          <div className={globalStyles.marginT20}>
            {!basket.isOnlyGiftCart && (
              <div className={globalStyles.flex}>
                <hr className={styles.hr} />
                <div
                  className={cs(
                    styles.marginR10,
                    globalStyles.cerise,
                    globalStyles.pointer
                  )}
                  onClick={toggleInput}
                >
                  {isactivepromo ? "-" : "+"}
                </div>
                <div className={styles.inputContainer}>
                  <div
                    className={cs(
                      globalStyles.c10LR,
                      styles.promoMargin,
                      globalStyles.cerise,
                      globalStyles.pointer
                    )}
                    onClick={toggleInput}
                  >
                    APPLY GIFT CARD CODE/ CREDIT NOTE
                  </div>
                  {isactivepromo ? <ApplyGiftcard /> : ""}
                  {/* {renderInput()}
                {renderCoupon()} */}
                </div>
              </div>
            )}

            {loyaltyData.detail && currency == "INR" && (
              <Fragment>
                <hr className={styles.hr} />
                <div className={bootstrapStyles.row}>
                  <div
                    className={cs(
                      bootstrapStyles.col12,
                      bootstrapStyles.colMd6,
                      styles.title
                    )}
                  >
                    <span className={isActive ? "" : styles.closed}>
                      REDEEM CERISE POINTS
                    </span>
                  </div>
                </div>
                <hr className={styles.hr} />
                <div className={globalStyles.flex}>
                  <div
                    className={cs(
                      styles.marginR10,
                      globalStyles.cerise,
                      globalStyles.pointer
                    )}
                    onClick={toggleInputReedem}
                  >
                    {isactiveredeem ? "-" : "+"}
                  </div>
                  <div className={styles.inputContainer}>
                    <div
                      className={cs(
                        globalStyles.c10LR,
                        styles.promoMargin,
                        globalStyles.cerise,
                        globalStyles.pointer
                      )}
                      onClick={toggleInputReedem}
                    >
                      REDEEM CERISE POINTS
                    </div>
                    {isactiveredeem ? <Reedem loyaltyData={loyaltyData} /> : ""}
                  </div>
                </div>
              </Fragment>
            )}

            {isPaymentNeeded && <hr className={styles.hr} />}
            {isPaymentNeeded && (
              <div className={globalStyles.marginT30}>
                <div className="title">SELECT YOUR MODE OF PAYMENT</div>
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
                          <span className={styles.checkbox}>
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
            )}
          </div>

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
              globalStyles.crossCenter,
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
              <label htmlFor="subscribe" className={globalStyles.pointer}>
                I agree to receiving e-mails, calls and text messages for
                service related information. To know more how we keep your data
                safe, refer to our{" "}
                <Link to="/customer-assistance/privacy-policy" target="_blank">
                  Privacy Policy
                </Link>
              </label>
            </div>
          </label>
          {currency == "GBP" && (
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
                <label htmlFor="subscribe1" className={globalStyles.pointer}>
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
          {isLoading && <Loader />}
          <button
            className={cs(globalStyles.marginT40, globalStyles.ceriseBtn)}
            onClick={onsubmit}
          >
            {isPaymentNeeded
              ? mobile
                ? "PROCEED TO PAYMENT GATEWAY"
                : "PROCEED TO A SECURE PAYMENT GATEWAY"
              : "PLACE ORDER"}
          </button>
        </Fragment>
      )}
    </div>
  );
};

export default PaymentSection;
