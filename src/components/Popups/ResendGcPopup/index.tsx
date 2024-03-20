import React, { useContext, useEffect } from "react";
import cs from "classnames";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import iconStyles from "styles/iconFonts.scss";
import { Context } from "components/Modal/context";
import resendEmail from "images/resendEmail.svg";
import Button from "components/Button";

type PopupProps = {
  email: string;
};

const ResendGcPopup: React.FC<PopupProps> = props => {
  const { closeModal } = useContext(Context);

  useEffect(() => {
    const btn = document.getElementById("info-popup-accept-button");
    btn?.focus();
  }, []);

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
        <div className={cs(styles.resendGc, styles.gcTnc, styles.sideMargin)}>
          <img src={resendEmail} className={styles.iconResend} />
          <div className={globalStyles.c10LR}>
            <p>
              Your email is sent successfully to <b>{props.email}</b>
            </p>
          </div>
          <div className={cs(globalStyles.marginT40)}>
            <Button
              id="info-popup-accept-button"
              variant="smallMedCharcoalCta"
              tabIndex={-1}
              onClick={() => {
                closeModal();
              }}
              label={"CONTINUE SHOPPING"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResendGcPopup;
