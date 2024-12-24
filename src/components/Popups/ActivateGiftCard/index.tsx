import React, { useEffect, useContext } from "react";
import cs from "classnames";
import globalStyles from "styles/global.scss";
import bootstrapStyles from "../../../styles/bootstrap/bootstrap-grid.scss";
import styles from "../styles.scss";
import style from "./index.scss";
import iconStyles from "styles/iconFonts.scss";
import Giftcard from "./activateGiftCard";
import { Link } from "react-router-dom";
// import { PasswordProps } from "../ChangePassword/typings";
import { PasswordProps } from "./typings";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "reducers/typings";
import { Context } from "components/Modal/context";

const ActivateGiftCard: React.FC<PasswordProps> = () => {
  // useEffect(() => {
  //   setCurrentSection();
  // }, []);

  const {
    device: { mobile }
  } = useSelector((state: AppState) => state);
  const { closeModal } = useContext(Context);

  return (
    <div>
      <div
        className={cs(
          styles.sizeBlockPopup,
          styles.sizeBlockNotFixed,
          styles.popUpHeight,
          { [styles.centerpageDesktopFs]: !mobile },
          globalStyles.textCenter,
          { [styles.centerpageDesktopFsWidth]: mobile }
        )}
      >
        <div className={styles.activategcheadWrp}>
          <div
            className={cs(styles.cross, styles.deliveryIcon)}
            onClick={closeModal}
          >
            <i
              className={cs(
                iconStyles.icon,
                iconStyles.iconCrossNarrowBig,
                styles.icon,
                styles.iconCross,
                styles.freeShippingPopup
              )}
            ></i>
          </div>
          <div className={style.activategcHead}>
            <div className={style.formHeading}>Activate Gift Card</div>
            <div
              className={cs(style.formSubheading, styles.activategcSubheading)}
            >
              Enter your personal information to activate <br />
              your gift card
            </div>
          </div>
        </div>
        <div className={cs(style.cnBody)}>
          <div className={cs(styles.loginForm)}>
            <div className={style.giftcardContent}>
              <Giftcard />
            </div>
            <div className={style.tcLink}>
              <Link
                to="/customer-assistance/terms-conditions?id=howtoactivategiftcard"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.viewTnc}
              >
                View Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivateGiftCard;
