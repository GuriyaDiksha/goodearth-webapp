import React from "react";
import cs from "classnames";
// import iconStyles from "../../styles/iconFonts.scss";
// import bootstrapStyles from "../../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import { PopupProps } from "./typings";
import iconStyles from "styles/iconFonts.scss";
const ShippingPopup: React.FC<PopupProps> = props => {
  //   const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      <div
        className={cs(
          styles.sizeBlockPopup,
          styles.sizeBlockNotFixed,
          styles.centerpageDesktop,
          styles.centerpageMobile,
          globalStyles.textCenter
        )}
      >
        <div className={styles.cross} onClick={props.closeModal}>
          <i
            className={cs(
              iconStyles.icon,
              iconStyles.iconCrossNarrowBig,
              styles.icon,
              styles.iconCross
            )}
          ></i>
        </div>
        <div className={cs(styles.gcTnc, globalStyles.voffset5)}>
          <div className={globalStyles.c22AI}>Shipping &amp; Payment</div>
          <div className={globalStyles.c10LR}>
            <p>
              Duties &amp; Taxes are not included in this order and will be
              charged over and above the shipping and handling charges paid at
              checkout.
            </p>
            <p>
              Most countries charge duties on imports, which are levied at the
              time of port entry. These are based on the destination country and
              the products being purchased.
            </p>
            <p>
              I agree to pay the additional applicable duties and taxes directly
              to the shipping agency at the time of order delivery.
            </p>
          </div>
        </div>
        <div className={cs(globalStyles.ceriseBtn, styles.ceriseBtnWidth)}>
          <a
            onClick={() => {
              props.acceptCondition();
              props.closeModal();
            }}
          >
            accept &amp; proceed
          </a>
        </div>
        <div className={styles.cancelBtn}>
          <a onClick={props.closeModal}>Cancel</a>
        </div>
      </div>
    </div>
  );
};

export default ShippingPopup;
