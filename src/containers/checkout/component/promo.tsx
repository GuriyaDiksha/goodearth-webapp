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
import { useHistory } from "react-router";
import * as util from "utils/validate";

const PromoSection: React.FC<PromoProps> = props => {
  const { isActive, next, selectedAddress } = props;
  const [isactivepromo, setIsactivepromo] = useState(false);
  const { basket, currency, info } = useSelector((state: AppState) => state);
  const toggleInput = () => {
    setIsactivepromo(!isactivepromo);
  };

  let PromoChild: any = useRef<typeof ApplyPromo>(null);
  const history = useHistory();
  const queryString = history.location.search;
  const urlParams = new URLSearchParams(queryString);
  const hideBoId = urlParams.get("bo_id")
    ? basket.voucherDiscounts[0]?.voucher?.code
      ? false
      : true
    : false;

  useEffect(() => {
    if (basket.voucherDiscounts.length > 0) {
      setIsactivepromo(true);
    }
  }, [basket.voucherDiscounts]);

  const onsubmit = () => {
    if (
      PromoChild.gcBalance &&
      basket.voucherDiscounts.length == 0 &&
      PromoChild.state.txtvalue
    ) {
      PromoChild.gcBalance();
    } else {
      util.checkoutGTM(4, currency, basket);
      next(Steps.STEP_PAYMENT);
    }
  };

  const onNext = () => {
    util.checkoutGTM(4, currency, basket);
    next(Steps.STEP_PAYMENT);
  };

  const onCurrentState = () => {
    next(Steps.STEP_PROMO);
  };

  const partialSale = true;

  const isSale = info.isSale && !partialSale;
  const onlyGiftcard = basket.isOnlyGiftCart || hideBoId;
  const cardCss = onlyGiftcard
    ? globalStyles.cerise
    : globalStyles.pointer + " " + globalStyles.cerise;
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
              {" PROMO CODE APPLIED"}
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
              onlyGiftcard || isSale ? "" : onCurrentState();
            }}
          >
            <span
              className={cs(
                isSale
                  ? styles.notSelected
                  : isActive || !selectedAddress
                  ? globalStyles.hidden
                  : cardCss
              )}
            >
              {isSale
                ? "Not Applicable during Sale"
                : onlyGiftcard
                ? "Not Applicable"
                : " APPLY PROMO CODE"}
            </span>
          </div>
        )}
      </div>
      {isActive && (
        <Fragment>
          {!onlyGiftcard && (
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
