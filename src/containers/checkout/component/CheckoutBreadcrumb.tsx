import React from "react";
import cs from "classnames";
import styles from "../styles.scss";
import globalStyles from "styles/global.scss";
import fontStyles from "styles/iconFonts.scss";
import { BreadcrumbProps } from "./typings";
import { useSelector } from "react-redux";
import { AppState } from "reducers/typings";

const CheckoutBreadcrumb: React.FC<BreadcrumbProps> = props => {
  const { active } = props;
  const { mobile } = useSelector((state: AppState) => state.device);

  return (
    <div className={cs(styles.breadcrumb)}>
      <div className={cs(styles.card)}>
        <div
          className={cs(styles.breadcrumbWrapper, globalStyles.flex, {
            [styles.justifyCenter]: mobile
          })}
        >
          <div className={cs(styles.breadcrumbItem)}>
            <span className={cs(styles.text, styles.login)}>Login</span>
          </div>
          <div className={cs(styles.breadcrumbItem)}>
            <span
              className={cs(fontStyles.iconArrowRight, fontStyles.icon)}
            ></span>
            <span
              className={cs(
                styles.text,
                active === "SHIPPING"
                  ? styles.active
                  : active === "BILLING"
                  ? styles.active
                  : styles.visited
              )}
            >
              Address
            </span>
          </div>
          <div className={cs(styles.breadcrumbItem)}>
            <span
              className={cs(fontStyles.iconArrowRight, fontStyles.icon)}
            ></span>
            <span
              className={cs(styles.text, active === "PAYMENT" && styles.active)}
            >
              Payment
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutBreadcrumb;
