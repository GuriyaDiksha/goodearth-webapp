import React from "react";
import cs from "classnames";
import bootstrapStyles from "../../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import { LoginProps } from "./typings";
import checkmarkCircle from "./../../../images/checkmarkCircle.svg";

const LoginSection: React.FC<LoginProps> = props => {
  const {
    isActive,
    user: { email }
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
            styles.title,
            globalStyles.flex
          )}
          id="checkout-emailverification"
        >
          <img
            height={"15px"}
            className={globalStyles.marginR10}
            src={checkmarkCircle}
            alt="checkmarkdone"
          />
          <p className={isActive ? "" : styles.iscompleted}>LOGGED IN AS</p>
          <div></div>
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
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginSection;
