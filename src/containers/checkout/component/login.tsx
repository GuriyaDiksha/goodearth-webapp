import React, { useState } from "react";
import cs from "classnames";
// import iconStyles from "../../styles/iconFonts.scss";
import bootstrapStyles from "../../../styles/bootstrap/bootstrap-grid.scss";
import styles from "../styles.scss";
import { LoginProps } from "./typings";
import { STEP_SHIPPING } from "../constants";
import loadable from "@loadable/component";

const CheckoutLoginForm = loadable(() =>
  import("components/signin/Login/checkoutLogin")
);
const CheckoutRegisterForm = loadable(() =>
  import("components/signin/register/checkoutRegister")
);
const LoginSection: React.FC<LoginProps> = props => {
  const {
    isActive,
    user: { isLoggedIn, email },
    next,
    boEmail
  } = props;
  const [isRegister, setIsRegister] = useState(false);

  const goToRegister = () => {
    setIsRegister(true);
  };

  const changeEmail = () => {
    setIsRegister(false);
    localStorage.removeItem("tempEmail");
  };

  const goLogin = () => {
    setIsRegister(false);
  };
  const nextStep = () => {
    if (next) next(STEP_SHIPPING);
  };
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
          <p className={isActive ? "" : styles.closed}>LOGIN / REGISTER</p>
          <div>
            {!isLoggedIn ? (
              isRegister ? (
                <CheckoutRegisterForm
                  nextStep={nextStep}
                  changeEmail={changeEmail}
                  goToLogin={goLogin}
                />
              ) : (
                <CheckoutLoginForm
                  showRegister={goToRegister}
                  nextStep={nextStep}
                  isBo={boEmail}
                />
              )
            ) : (
              ""
            )}
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
            {/* {!isLoggedIn && (
              <span className={cs(globalStyles.cerise, globalStyles.pointer)}>
                Edit
              </span>
            )} */}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginSection;
