import React, { useState, Fragment, useEffect, useRef } from "react";
import cs from "classnames";
// import iconStyles from "../../styles/iconFonts.scss";
import bootstrapStyles from "../../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import { PromoProps } from "./typings";
import * as Steps from "../constants";
import ApplyPromo from "./applyPromo";
import { useSelector } from "react-redux";
import { AppState } from "reducers/typings";

const PromoSection: React.FC<PromoProps> = props => {
  const { isActive, next, selectedAddress } = props;
  const [isactivepromo, setIsactivepromo] = useState(false);
  const { basket } = useSelector((state: AppState) => state);
  const toggleInput = () => {
    setIsactivepromo(!isactivepromo);
  };

  let PromoChild: any = useRef<typeof ApplyPromo>(null);

  useEffect(() => {
    if (basket.voucherDiscounts.length > 0) {
      setIsactivepromo(true);
    }
  }, [basket.voucherDiscounts]);

  const onsubmit = () => {
    if (PromoChild.gcBalance && basket.voucherDiscounts.length == 0) {
      PromoChild.gcBalance();
    } else {
      next(Steps.STEP_PAYMENT);
    }
  };

  const onNext = () => {
    next(Steps.STEP_PAYMENT);
  };

  const onCurrentState = () => {
    next(Steps.STEP_PROMO);
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
          <span className={isActive ? "" : styles.closed}>PROMO CODE</span>
        </div>

        {!isActive && basket.voucherDiscounts.length > 0 ? (
          <div
            className={cs(
              styles.col12,
              bootstrapStyles.colMd6,
              styles.selectedStvalue
            )}
            onClick={onCurrentState}
          >
            <span className={styles.marginR10}>
              <span className={styles.bold}>
                {basket.voucherDiscounts[0]?.voucher?.code}
              </span>
              {" APPLY PROMO CODE"}
            </span>
            <span className={cs(globalStyles.cerise, globalStyles.pointer)}>
              Edit
            </span>
          </div>
        ) : (
          <div
            className={cs(
              styles.col12,
              bootstrapStyles.colMd6,
              styles.selectedStvalue
            )}
            onClick={() => {
              basket.isOnlyGiftCart ? "" : onCurrentState();
            }}
          >
            <span
              className={
                isActive || !selectedAddress
                  ? globalStyles.hidden
                  : globalStyles.cerise
              }
            >
              {basket.isOnlyGiftCart ? "Not Applicable" : " APPLY PROMO CODE"}
            </span>
          </div>
        )}
      </div>
      {isActive && (
        <Fragment>
          {!basket.isOnlyGiftCart && (
            <div className={globalStyles.marginT20}>
              <hr className={styles.hr} />
              <div className={globalStyles.flex}>
                <div
                  className={cs(
                    styles.marginR10,
                    globalStyles.cerise,
                    globalStyles.pointer
                  )}
                  onClick={() => {
                    basket.voucherDiscounts.length > 0 ? "" : toggleInput();
                  }}
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
                    onClick={() => {
                      basket.voucherDiscounts.length > 0 ? "" : toggleInput();
                    }}
                  >
                    APPLY PROMO CODE
                  </div>
                  {isactivepromo && (
                    <ApplyPromo
                      onRef={(el: any) => {
                        PromoChild = el;
                      }}
                      onNext={onNext}
                    />
                  )}
                  {/* {renderInput()}
                {renderCoupon()} */}
                </div>
              </div>
              <hr className={styles.hr} />
            </div>
          )}

          <button
            className={cs(globalStyles.marginT40, globalStyles.ceriseBtn)}
            onClick={onsubmit}
          >
            PROCEED TO PAYMENT
          </button>
        </Fragment>
      )}
    </div>
  );
};

export default PromoSection;
