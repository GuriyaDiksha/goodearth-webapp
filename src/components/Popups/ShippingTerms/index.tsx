import React, { useContext } from "react";
import cs from "classnames";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import iconStyles from "styles/iconFonts.scss";
import { Context } from "components/Modal/context";

const ShippingTerms: React.FC = () => {
  const { closeModal } = useContext(Context);

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
        <div className={styles.headWrp}>
          <div className={styles.deliveryHead}>SHIPPING & PAYMENT</div>
          <div
            className={cs(styles.cross, styles.deliveryIcon)}
            onClick={() => {
              closeModal();
            }}
          >
            <i
              className={cs(
                iconStyles.icon,
                iconStyles.iconCrossNarrowBig,
                styles.icon,
                styles.iconCross
              )}
            ></i>
          </div>
        </div>
        <div
          className={cs(
            globalStyles.paddT20,
            globalStyles.marginLR40,
            styles.gcTnc
          )}
        >
          <p className={styles.desc}>
            Dutles & Taxes are not included in this order and will be charged
            over and above the shipping and handling charges paid at checkout.
          </p>
          <p
            className={cs(
              styles.desc,
              globalStyles.marginT20,
              globalStyles.marginB20
            )}
          >
            Most countries charge duties on imports, which are levied at the
            time of port entry. These are based on the destination country and
            the products being purchased.{" "}
          </p>
          <p className={styles.desc}>
            I agree to pay the additional applicable duties and taxes directly
            to the shipping agency at the time of order delivery.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShippingTerms;
