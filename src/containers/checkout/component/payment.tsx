import React, { useState, Fragment } from "react";
import cs from "classnames";
// import iconStyles from "../../styles/iconFonts.scss";
import bootstrapStyles from "../../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import { PaymentProps } from "./typings";
import * as Steps from "../constants";
import ApplyGiftcard from "./applyGiftcard";
const PaymentSection: React.FC<PaymentProps> = props => {
  const data: any = {};
  const { isActive, currency, checkout } = props;
  const [isactivepromo, setIsactivepromo] = useState(false);
  const [currentmethod, setCurrentmethod] = useState(data);
  const toggleInput = () => {
    setIsactivepromo(!isactivepromo);
  };

  const onsubmit = () => {
    checkout(Steps.STEP_PAYMENT);
  };

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
  };

  const onMethodChange = (event: any, method: any) => {
    if (event.target.checked) {
      setCurrentmethod(method);
    }
  };
  // console.log(method.mode == currentmethod.mode ? true : false)
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
          </div>
          <button
            className={cs(globalStyles.marginT40, globalStyles.ceriseBtn)}
            onClick={onsubmit}
          >
            PROCEED TO A SECURE PAYMENT GATEWAY
          </button>
        </Fragment>
      )}
    </div>
  );
};

export default PaymentSection;
