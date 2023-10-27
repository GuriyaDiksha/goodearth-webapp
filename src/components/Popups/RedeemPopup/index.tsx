import React, { useContext, useState } from "react";
import cs from "classnames";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import iconStyles from "styles/iconFonts.scss";
import { Context } from "components/Modal/context";
import Redeem from "containers/checkout/component/redeem";

type PopupProps = {
  setIsactiveredeem: (data: boolean) => any;
  removeRedeem: () => any;
};

const RedeemPopup: React.FC<PopupProps> = ({
  setIsactiveredeem,
  removeRedeem
}) => {
  const { closeModal } = useContext(Context);
  const [isOTPSent, setIsOTPSent] = useState(false);

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
              if (isOTPSent) {
                removeRedeem();
              }
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
            isOTPSent={isOTPSent}
            setIsOTPSent={setIsOTPSent}
          />
        </div>
      </div>
    </div>
  );
};

export default RedeemPopup;
