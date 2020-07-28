import React from "react";
import cs from "classnames";
// import iconStyles from "../../styles/iconFonts.scss";
import bootstrapStyles from "../../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import { LoginProps } from "./typings";
import CheckoutLoginForm from "components/signin/Login/checkoutLogin";
const LoginSection: React.FC<LoginProps> = props => {
  const {
    isActive,
    user: { isLoggedIn, email }
  } = props;
  console.log(!isActive || "darpan");
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
          <p className={isActive ? "" : styles.closed}>LOGIN</p>
          <div>
            <CheckoutLoginForm />{" "}
          </div>
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
              <span className={cs(globalStyles.cerise, globalStyles.pointer)}>
                Edit
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginSection;
