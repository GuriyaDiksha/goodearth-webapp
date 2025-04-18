import React, { useContext } from "react";
import cs from "classnames";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import iconStyles from "styles/iconFonts.scss";
import { Context } from "components/Modal/context";
import { useSelector } from "react-redux";
import { AppState } from "reducers/typings";
import { NavLink, useHistory } from "react-router-dom";
import { displayPriceWithCommas } from "utils/utility";
import Button from "components/Button";

type PopupProps = {
  remainingAmount: number;
  freeShippingApplicable: number;
  goLogin: (a: any, b: any) => {};
};

const FreeShipping: React.FC<PopupProps> = props => {
  const { closeModal } = useContext(Context);
  const currency = useSelector((state: AppState) => state.currency);
  const { mobile } = useSelector((state: AppState) => state.device);
  const { isLoggedIn } = useSelector((state: AppState) => state.user);

  const history = useHistory();

  let amountINR = props.freeShippingApplicable.toString();
  if (amountINR.length > 3) {
    const amountArray = amountINR.split("");
    amountArray.splice(-3, 0, ",");
    amountINR = amountArray.join("");
  }

  return (
    <div>
      <div
        className={cs(
          styles.sizeBlockPopup,
          styles.sizeBlockNotFixed,
          globalStyles.textCenter,
          styles.freeShippingPopup,
          {
            [styles.centerpageDesktopFsWidth]: mobile,
            [styles.centerpageDesktopFs]: !mobile
          }
        )}
      >
        <div className={styles.cross} onClick={closeModal}>
          <i
            className={cs(
              iconStyles.icon,
              iconStyles.iconCrossNarrowBig,
              styles.icon,
              styles.iconCross
            )}
          ></i>
        </div>
        <div className={cs(styles.gcTnc)}>
          <div
            className={cs(styles.freeShippingHead, {
              [globalStyles.paddTop50]: mobile
            })}
          >
            Free Shipping
          </div>
          {/* <div className={globalStyles.c10LR}> */}
          <div className={styles.freeShipping}>
            <div>
              You’re a step away from{" "}
              <span className={globalStyles.textUnderline}>free shipping!</span>
              &nbsp;Select products worth{" "}
              <span>
                {displayPriceWithCommas(props.remainingAmount, currency)}
              </span>{" "}
              or more to your order to qualify
            </div>

            <div className={globalStyles.voffset3}>
              {" "}
              <span>
                *Orders within India above Rs. {amountINR} are eligible for free
                shipping
              </span>
            </div>
            <div className={globalStyles.voffset3}>
              {" "}
              <NavLink
                to="/customer-assistance/shipping-payment"
                target="_blank"
                className={cs(styles.linkTextUnderline, styles.linkText)}
              >
                Read Our Shipping & Returns Policy
              </NavLink>{" "}
            </div>
          </div>
        </div>
        <div>
          <Button
            variant="mediumMedCharcoalCta366"
            label={"checkout anyway"}
            onClick={e => {
              if (!isLoggedIn) {
                e.preventDefault();
                props.goLogin(undefined, "/order/checkout");
              } else {
                history.push("/order/checkout");
                closeModal();
              }
            }}
            className={cs({ [globalStyles.btnFullWidthForPopup]: mobile })}
          />
        </div>
        <div className={styles.link}>
          <NavLink to="/" onClick={closeModal}>
            continue shopping
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default FreeShipping;
