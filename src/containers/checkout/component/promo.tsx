import React, { useState, Fragment, useEffect, useRef } from "react";
import cs from "classnames";
import bootstrapStyles from "../../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import { PromoProps } from "./typings";
import { STEP_ORDER, STEP_PAYMENT, STEP_PROMO } from "../constants";
import ApplyPromo from "./applyPromo";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "reducers/typings";
import { useHistory } from "react-router";
import checkmarkCircle from "./../../../images/checkmarkCircle.svg";
import CheckoutService from "services/checkout";
import BasketService from "services/basket";

const PromoSection: React.FC<PromoProps> = props => {
  const { isActive, next, activeStep, currentStep } = props;
  const [isactivepromo, setIsactivepromo] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  const {
    basket,
    info,
    user: { isLoggedIn },
    device: { mobile }
  } = useSelector((state: AppState) => state);
  const toggleInput = () => {
    setIsactivepromo(!isactivepromo);
  };
  const dispatch = useDispatch();

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
      // util.checkoutGTM(4, currency, basket);
      // next(Steps.STEP_PAYMENT);
    }
  };

  const onNext = () => {
    // util.checkoutGTM(4, currency, basket);
    next(STEP_PAYMENT);
  };

  const onCurrentState = () => {
    next(STEP_PROMO);
  };

  const onlyGiftcard = basket.isOnlyGiftCart || hideBoId;

  const removePromo = async (data: FormData) => {
    const response = await CheckoutService.removePromo(dispatch, data);
    BasketService.fetchBasket(dispatch, "checkout", history, isLoggedIn);
    return response;
  };

  const onPromoRemove: any = (id: string) => {
    const data: any = {
      cardId: id
    };
    removePromo(data);
  };
  return (
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
          {STEP_ORDER[activeStep] < currentStep ||
          basket.voucherDiscounts.length > 0 ? (
            <img
              height={"18px"}
              className={globalStyles.marginR10}
              src={checkmarkCircle}
              alt="checkmarkdone"
            />
          ) : null}
          <span className={isActive || isactivepromo ? "" : styles.closed}>
            PROMO CODE
          </span>
        </div>

        {(!isActive || isactivepromo) && basket.voucherDiscounts.length > 0 && (
          <div
            className={cs(
              styles.col12,
              bootstrapStyles.colMd6,
              styles.selectedStvalue
            )}
            onClick={onCurrentState}
          >
            <span className={styles.marginR10}>
              <span className={styles.promoCode}>
                {basket.voucherDiscounts[0]?.voucher?.code}
              </span>
              <span className={styles.promoCodeApplied}>
                Promo Code Applied
              </span>
            </span>
            <span
              className={cs(globalStyles.pointer, styles.promoEdit)}
              onClick={() => {
                onPromoRemove(basket.voucherDiscounts[0]?.voucher?.code);
                setIsactivepromo(false);
              }}
            >
              Edit
            </span>
          </div>
        )}
      </div>
      {isActive && basket.voucherDiscounts.length <= 0 && (
        <Fragment>
          {!onlyGiftcard && (
            <div className={globalStyles.marginT20}>
              {!mobile && <hr className={styles.hr} />}
              <div className={globalStyles.flex}>
                {/* <div
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
                </div> */}
                <div className={styles.inputContainer}>
                  {/* <div
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
                  </div> */}
                  <label
                    className={cs(globalStyles.flex, globalStyles.crossCenter)}
                  >
                    <div className={styles.marginR10}>
                      <span className={styles.checkbox}>
                        <input
                          type="radio"
                          checked={isactivepromo}
                          onClick={() => {
                            basket.voucherDiscounts.length > 0
                              ? ""
                              : toggleInput();
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
                      {"Apply Promo"}
                    </div>
                  </label>
                  {isactivepromo && (
                    <ApplyPromo
                      onRef={(el: any) => {
                        PromoChild = el;
                      }}
                      onNext={onNext}
                      onsubmit={onsubmit}
                    />
                  )}
                  {/* {renderInput()}
                {renderCoupon()} */}
                </div>
              </div>
              {/* <hr className={styles.hr} /> */}
            </div>
          )}

          {/* <button
            className={cs(globalStyles.marginT40, globalStyles.ceriseBtn)}
            onClick={onsubmit}
          >
            PROCEED TO PAYMENT
          </button> */}
        </Fragment>
      )}
    </div>
  );
};

export default PromoSection;
