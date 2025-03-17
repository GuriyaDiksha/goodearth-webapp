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
import CookieService from "services/cookie";
import BasketService from "services/basket";
import Loader from "components/Loader";
import { GA_CALLS } from "constants/cookieConsent";

const PromoSection: React.FC<PromoProps> = props => {
  const { isActive, next, activeStep, currentStep } = props;
  const [isactivepromo, setIsactivepromo] = useState(false);
  const [promoVal, setPromoVal] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    basket,
    user: { isLoggedIn },
    device: { mobile }
  } = useSelector((state: AppState) => state);
  const dispatch = useDispatch();

  let PromoChild: any = useRef<typeof ApplyPromo>(null);
  const history = useHistory();
  // const queryString = history.location.search;
  // const urlParams = new URLSearchParams(queryString);
  // const hideBoId = urlParams.get("bo_id")
  //   ? basket.voucherDiscounts[0]?.voucher?.code
  //     ? false
  //     : true
  //   : false;
  // const isBoId = urlParams.get("bo_id");

  const removePromo = async (data: FormData) => {
    setIsLoading(true);
    const userConsent = CookieService.getCookie("consent").split(",");
    const response = await CheckoutService.removePromo(dispatch, data);
    BasketService.fetchBasket(dispatch, "checkout", history, isLoggedIn);
    setIsLoading(false);
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({
        event: "remove_promocode",
        click_type: "Checkout Page"
      });
    }
    return response;
  };

  const onPromoRemove: any = (id: string) => {
    const data: any = {
      cardId: id
    };
    try {
      removePromo(data);
    } catch (e) {
      setIsLoading(false);
    }
  };

  const toggleInput = () => {
    if (isactivepromo) {
      setPromoVal("");
      if (basket.voucherDiscounts[0]?.voucher?.code != undefined) {
        onPromoRemove(basket.voucherDiscounts[0]?.voucher?.code);
      }
    }
    setIsactivepromo(!isactivepromo);
  };

  useEffect(() => {
    document?.getElementById("promo-section")?.scrollIntoView();
  }, []);

  useEffect(() => {
    if (basket.voucherDiscounts.length === 0) {
      if (STEP_ORDER[activeStep] < currentStep) {
        setIsEdit(true);
      }
      setIsactivepromo(false);
      setPromoVal("");
    } else {
      setPromoVal(basket.voucherDiscounts[0]?.voucher?.code);
      setIsEdit(false);
    }
  }, [basket.voucherDiscounts]);

  const onsubmit = () => {
    setIsLoading(true);
    if (PromoChild.gcBalance && PromoChild.state.txtvalue) {
      setPromoVal(PromoChild.state.txtvalue);
      PromoChild.gcBalance();
    }
    setIsLoading(false);
  };

  const onNext = () => {
    // util.checkoutGTM(4, currency, basket);
    next(STEP_PAYMENT);
  };

  const onCurrentState = () => {
    if (basket.voucherDiscounts.length > 0) {
      setIsactivepromo(true);
    }
    setIsEdit(true);
    next(STEP_PROMO);
  };

  const showPromo = basket.showCouponSection;

  return (
    <div
      id="promo-section"
      className={
        isActive || isEdit
          ? cs(
              styles.card,
              styles.cardOpen,
              styles.marginT5,
              styles.promoWrapper
            )
          : // : mobile
            // ? styles.hidden
            cs(styles.card, styles.cardClosed, styles.marginT5, {
              [styles.bgWhite]: STEP_ORDER[activeStep] > currentStep
            })
      }
    >
      <div className={bootstrapStyles.row}>
        <div
          className={cs(
            bootstrapStyles.col12,
            bootstrapStyles.colLg6,
            styles.title
          )}
        >
          {STEP_ORDER[activeStep] <= currentStep &&
          basket.voucherDiscounts.length > 0 &&
          !isEdit ? (
            <img
              height={"15px"}
              className={globalStyles.marginR10}
              src={checkmarkCircle}
              alt="checkmarkdone"
            />
          ) : null}
          <span
            className={cs(
              {
                [styles.iscompleted]:
                  STEP_ORDER[activeStep] < currentStep && !isActive && !isEdit
              },
              STEP_ORDER[activeStep] <= currentStep ? "" : styles.closed
            )}
          >
            PROMO CODE
          </span>
          {STEP_ORDER[activeStep] <= currentStep &&
            basket.voucherDiscounts.length > 0 &&
            !isEdit &&
            mobile && (
              <span
                className={cs(globalStyles.pointer, styles.promoEdit, {
                  // [styles.hidden]: !(isActive || isactivepromo)
                })}
                onClick={() => {
                  onCurrentState();
                }}
              >
                Edit
              </span>
            )}
        </div>
        {mobile && <hr />}
        {STEP_ORDER[activeStep] <= currentStep &&
          basket.voucherDiscounts.length > 0 &&
          !isEdit && (
            <div
              className={cs(
                styles.col12,
                bootstrapStyles.colLg6,
                styles.selectedStvalue
              )}
            >
              <span className={styles.marginR10}>
                <span className={styles.promoCode}>
                  {basket.voucherDiscounts[0]?.voucher?.code}
                </span>
                <span className={styles.promoCodeApplied}>
                  Promo Code Applied
                </span>
              </span>
              {!mobile && (
                <span
                  className={cs(globalStyles.pointer, styles.promoEdit)}
                  onClick={() => {
                    onCurrentState();
                  }}
                >
                  Edit
                </span>
              )}
            </div>
          )}
      </div>

      {STEP_ORDER[activeStep] <= currentStep &&
        ((isActive && basket.voucherDiscounts.length === 0) || isEdit) && (
          <Fragment>
            {showPromo && (
              <div className={globalStyles.marginT20}>
                {!mobile && <hr className={styles.hr} />}
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
                            checked={isactivepromo}
                            onClick={() => toggleInput()}
                          />
                          <span
                            className={cs(styles.indicator, {
                              [styles.checked]: isactivepromo
                            })}
                          ></span>
                        </span>
                      </div>
                      <div className={cs(styles.formSubheading)}>
                        {"Apply Promo Code"}
                      </div>
                    </label>
                    {isactivepromo && (
                      <ApplyPromo
                        onRef={(el: any) => {
                          PromoChild = el;
                        }}
                        onNext={onNext}
                        onsubmit={onsubmit}
                        promoVal={promoVal}
                        setIsLoading={setIsLoading}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
          </Fragment>
        )}
      {isLoading && <Loader />}
    </div>
  );
};

export default PromoSection;
