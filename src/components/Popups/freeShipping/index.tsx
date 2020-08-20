import React, { useContext } from "react";
import cs from "classnames";
// import iconStyles from "../../styles/iconFonts.scss";
// import bootstrapStyles from "../../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
// import { PopupProps } from "./typings";
import iconStyles from "styles/iconFonts.scss";
import { Context } from "components/Modal/context.ts";
import { currencyCodes } from "constants/currency";
import { useSelector } from "react-redux";
import { AppState } from "reducers/typings";
import { NavLink } from "react-router-dom";

type PopupProps = {
  remainingAmount: number;
  // closeModal: (data?: any) => any;
  // acceptCondition: (data?: any) => any;
};

const FreeShipping: React.FC<PopupProps> = props => {
  //   const [isLoading, setIsLoading] = useState(false);
  const { closeModal } = useContext(Context);
  const currency = useSelector((state: AppState) => state.currency);

  return (
    <div>
      <div
        className={cs(
          styles.sizeBlockPopup,
          styles.sizeBlockNotFixed,
          styles.centerpageDesktopFs,
          globalStyles.textCenter
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
          <div className={globalStyles.c22AI}>Free Shipping</div>
          {/* <div className={globalStyles.c10LR}> */}
          <div className={styles.freeShipping}>
            <div>
              You’re a step away from{" "}
              <span className={styles.linkTextUnderline}>free shipping!</span>
            </div>
            <div>
              Select products worth{" "}
              <span>
                {String.fromCharCode(currencyCodes[currency])}{" "}
                {props.remainingAmount}
              </span>{" "}
              or more to your order to qualify
            </div>
            <div className={globalStyles.voffset3}>
              {" "}
              <span>
                *Orders within India above Rs. 50,000 are eligible for free
                shipping
              </span>
            </div>
            <div className={globalStyles.voffset3}>
              {" "}
              <NavLink
                to="/customer-assistance/shipping-payment"
                target="_blank"
                className={styles.linkTextUnderline}
              >
                Read Our Shipping & Returns Policy
              </NavLink>{" "}
            </div>
          </div>
        </div>
        <div className={cs(globalStyles.ceriseBtn, styles.ceriseBtnWidth)}>
          <NavLink to="/" onClick={closeModal}>
            continue shopping
          </NavLink>
        </div>
        <div className={styles.link}>
          <NavLink to="/order/checkout" onClick={closeModal}>
            checkout anyway
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default FreeShipping;
