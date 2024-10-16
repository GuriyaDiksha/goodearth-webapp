import React from "react";
import cs from "classnames";
import bootstrapStyles from "../../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import { LoginProps } from "./typings";
import checkmarkCircle from "./../../../images/checkmarkCircle.svg";
import { AppState } from "reducers/typings";
import { useSelector } from "react-redux";

const LoginSection: React.FC<LoginProps> = props => {
  const { mobile } = useSelector((state: AppState) => state.device);
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
            styles.titleMobile,
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
              styles.selectedStvalue,
              styles.email,
              { [styles.selectedStvalueMobileOnly]: mobile }
            )}
          >
            <span className={styles.emailSpan}>{email}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginSection;
