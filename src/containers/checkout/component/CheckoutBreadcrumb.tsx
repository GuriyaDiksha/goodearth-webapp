import React from "react";
import cs from "classnames";
import styles from "../styles.scss";
import globalStyles from "styles/global.scss";
import fontStyles from "styles/iconFonts.scss";
import bootstrapStyles from "../../../styles/bootstrap/bootstrap-grid.scss";

const CheckoutBreadcrumb: React.FC = () => {
  return (
    <div className={cs(styles.breadcrumb)}>
      <div className={cs(styles.card)}>
        <div className={cs(styles.breadcrumbWrapper)}>
          <div className={globalStyles.flex}>
            <div>Login</div>
            <div>
              Address
              <span
                className={cs(fontStyles.iconArrowLeft, fontStyles.icon)}
              ></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutBreadcrumb;
