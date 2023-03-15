import React, { useEffect } from "react";
import cs from "classnames";
import globalStyles from "styles/global.scss";
import bootstrapStyles from "../../../../styles/bootstrap/bootstrap-grid.scss";
import styles from "../styles.scss";
import Giftcard from "./activateGiftCard";
import { Link } from "react-router-dom";
import { PasswordProps } from "../ChangePassword/typings";

const ActivateGiftCard: React.FC<PasswordProps> = ({ setCurrentSection }) => {
  useEffect(() => {
    setCurrentSection();
  }, []);

  return (
    <div className={bootstrapStyles.row}>
      <div className={bootstrapStyles.col12}>
        <div className={styles.formHeading}>Activate Gift Card </div>
        <div className={styles.formSubheading}>
          Enter your personal information to activate your gift card
        </div>
        <div className={cs(styles.loginForm, globalStyles.voffset4)}>
          <div
            className={cs(bootstrapStyles.row, styles.otpComponentContainer)}
          >
            <div
              className={cs(
                bootstrapStyles.colMd12,
                globalStyles.textCenter,
                styles.popupformbg
              )}
            >
              <div className={cs(bootstrapStyles.row, styles.formContainer)}>
                <div
                  className={cs(
                    bootstrapStyles.col10,
                    // bootstrapStyles.offset1,
                    bootstrapStyles.colMd8
                    // bootstrapStyles.offsetMd2
                  )}
                >
                  <Giftcard />
                </div>
              </div>
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
