import React, { ChangeEvent, useContext, useState } from "react";
import cs from "classnames";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import iconStyles from "styles/iconFonts.scss";
import { Context } from "components/Modal/context";
import { NavLink } from "react-router-dom";
import Redeem from "containers/checkout/component/redeem";

type PopupProps = {
  setIsactiveredeem: (data: boolean) => any;
};

const RedeemPopup: React.FC<PopupProps> = ({ setIsactiveredeem }) => {
  const { closeModal } = useContext(Context);

  return (
    <div>
      <div
        className={cs(
          styles.sizeBlockPopup,
          styles.sizeBlockNotFixed,
          styles.centerpageDesktopFs,
          globalStyles.textCenter,
          styles.cerisePopupMobile
        )}
      >
        <div className={styles.headWrp}>
          <div className={styles.deliveryHead}>CERISE LOYALTY POINTS</div>
          <div
            className={cs(styles.cross, styles.deliveryIcon)}
            onClick={() => {
              setIsactiveredeem(false);
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
            globalStyles.paddT0,
            styles.gcTnc,
            globalStyles.marginLR40
          )}
        >
          <Redeem
            closeModal={closeModal}
            setIsactiveredeem={setIsactiveredeem}
          />
        </div>
      </div>
    </div>
  );
};

export default RedeemPopup;
