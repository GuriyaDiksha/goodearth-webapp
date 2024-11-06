import React, { useContext, useEffect, useState } from "react";
import cs from "classnames";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
//import iconStyles from "styles/iconFonts.scss";
import { Context } from "components/Modal/context";
import { useSelector } from "react-redux";
import { AppState } from "reducers/typings";
import { useHistory } from "react-router";
import CookieService from "services/cookie";
import { GA_CALLS } from "constants/cookieConsent";

type PopupProps = {
  location: any;
  action: any;
  history: any;
  basket: any;
  // closeModal: (data?: any) => any;
  // acceptCondition: (data?: any) => any;
};

const exitGCCheckout: React.FC<PopupProps> = props => {
  //   const [isLoading, setIsLoading] = useState(false);
  const { closeModal } = useContext(Context);
  const history = useHistory();
  //const currency = useSelector((state: AppState) => state.currency);
  const { mobile, tablet } = useSelector((state: AppState) => state.device);

  return (
    <div>
      <div
        className={cs(
          styles.sizeBlockPopup,
          styles.sizeBlockNotFixed,
          globalStyles.textCenter,
          styles.freeShippingPopup,
          styles.customHeight,
          {
            [styles.mobilePopup]: mobile,
            [globalStyles.paddBottom20]: mobile,
            [styles.centerpageDesktopFs]: !mobile && !tablet
          }
        )}
      >
        <div className={cs(styles.gcTnc)}>
          <div
            className={cs(styles.freeShippingHead, {
              [globalStyles.marginT30]: mobile
            })}
          >
            Are you sure you want to exit this page?
          </div>
          {/* <div className={globalStyles.c10LR}> */}
          <div className={styles.freeShipping}>
            <div>
              Leaving this page will cancel your gift card checkout and remove
              the gift card from your cart.
            </div>
          </div>
        </div>
        <div className={cs(globalStyles.ceriseBtn, styles.freeshipBtnWidth)}>
          <a
            onClick={() => {
              closeModal();
              localStorage.setItem("openGCExitModal", "false");
            }}
          >
            NO, CONTINUE WITH CHECKOUT
          </a>
        </div>
        <div className={cs(styles.link, styles.linkDecor, styles.gcCheckout)}>
          <p
            onClick={() => {
              const userConsent = CookieService.getCookie("consent").split(",");
              if (userConsent.includes(GA_CALLS)) {
                dataLayer.push({
                  event: "cancel_giftcard_checkout",
                  value: props.basket.lineItems[0].GCValue,
                  shipping: sessionStorage.getItem("GCCountrySelected")
                });
              }
              closeModal();
              // if (props.action == "PUSH") {
              //   history.push(props.location.pathname);
              // } else if (props.action == "REPLACE") {
              //   history.replace(props.location.pathname);
              // } else if (props.action == "POP") {
              //   history.replace(props.location.pathname);
              // }
              history.push("/");
              localStorage.setItem("openGCExitModal", "false");
            }}
          >
            YES, CANCEL GIFT CARD CHECKOUT
          </p>
        </div>
      </div>
    </div>
  );
};

export default exitGCCheckout;
