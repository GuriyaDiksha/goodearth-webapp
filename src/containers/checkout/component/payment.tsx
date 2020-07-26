import React, { useState, Fragment, useEffect } from "react";
import cs from "classnames";
// import iconStyles from "../../styles/iconFonts.scss";
import bootstrapStyles from "../../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import { PaymentProps } from "./typings";
import ApplyGiftcard from "./applyGiftcard";
import { useSelector } from "react-redux";
import { AppState } from "reducers/typings";
import { Link } from "react-router-dom";
import Loader from "components/Loader";
const PaymentSection: React.FC<PaymentProps> = props => {
  const data: any = {};
  const {
    basket,
    device: { mobile }
  } = useSelector((state: AppState) => state);
  const { isActive, currency, checkout } = props;
  const [paymentError, setPaymentError] = useState("");
  const [subscribevalue, setSubscribevalue] = useState(false);
  const [isactivepromo, setIsactivepromo] = useState(false);
  const [currentmethod, setCurrentmethod] = useState(data);
  const [isLoading, setIsLoading] = useState(false);
  const toggleInput = () => {
    setIsactivepromo(!isactivepromo);
  };

  const onClikSubscribe = (event: any) => {
    setSubscribevalue(event.target.checked);
  };

  const onsubmit = () => {
    const isFree = +basket.total <= 0;
    if (currentmethod.mode || isFree) {
      const data: any = {
        paymentMethod: isFree ? "FREE" : currentmethod.key,
        paymentMode: currentmethod.mode
      };
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
  }, [basket.giftCards]);

  const getMethods = () => {
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
        key: "paypal",
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
  };

  const onMethodChange = (event: any, method: any) => {
    if (event.target.checked) {
      setCurrentmethod(method);
    }
  };

  const isPaymentNeeded = () => {
    if (+basket.total > 0) {
      return true;
    } else {
      return false;
    }
  };

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
          <div className={globalStyles.marginT20}>
            <hr className={styles.hr} />
            <div className={globalStyles.flex}>
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
            <hr className={styles.hr} />
            {isPaymentNeeded() && (
              <div className={globalStyles.marginT30}>
                <div className="title">SELECT YOUR MODE OF PAYMENT</div>
                {getMethods().map(function(method, index) {
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
                    onClikSubscribe(e);
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
          {isLoading && <Loader />}
          <button
            className={cs(globalStyles.marginT40, globalStyles.ceriseBtn)}
            onClick={onsubmit}
          >
            {isPaymentNeeded()
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
