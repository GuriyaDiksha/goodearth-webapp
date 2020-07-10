import React from "react";
import cs from "classnames";
// import iconStyles from "../../styles/iconFonts.scss";
import bootstrapStyles from "../../../styles/bootstrap/bootstrap-grid.scss";
// import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import { LoginProps } from "./typings";

const LoginSection: React.FC<LoginProps> = props => {
  const {
    isActive,
    user: { isLoggedIn, email }
  } = props;

  return (
    <div
      className={
        isActive
          ? cs(styles.card, styles.cardOpen)
          : cs(styles.card, styles.cardClosed)
      }
    >
      <div className={bootstrapStyles.row}>
        <div
          className={cs(
            bootstrapStyles.col12,
            bootstrapStyles.colMd6,
            styles.title
          )}
        >
          <span className={isActive ? "" : styles.closed}>LOGIN</span>
        </div>
        {!isActive && (
          <div
            className={cs(
              styles.col12,
              bootstrapStyles.colMd6,
              styles.selectedStvalue
            )}
          >
            <span className={styles.marginR10}>{email}</span>
            {!isLoggedIn && (
              <span className="color-primary cursor-pointer">Edit</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginSection;
