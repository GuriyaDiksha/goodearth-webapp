import React from "react";
import cs from "classnames";
import globalStyles from "../../styles/global.scss";
import styles from "./styles.scss";
import iconStyles from "../../styles/iconFonts.scss";

const pdpCustomerCareInfo: React.FC = () => {
  return (
    <div className={cs(styles.pdpcustomercare)}>
      <p>
        <span className={globalStyles.gold}>
          <i
            className={cs(iconStyles.icon, iconStyles.iconEmail, styles.icon)}
          />
          <a
            href="mailto:customercare@goodearth.in"
            className={globalStyles.gold}
          >
            customercare@goodearth.in
          </a>
        </span>
      </p>
      <p className={styles.pdpinfo}>
        <span className={globalStyles.gold}>
          <i
            className={cs(iconStyles.icon, iconStyles.iconPhone, styles.icon)}
          />
          <a href="tel:+919582999555" className={globalStyles.gold}>
            +91 95829 99555
          </a>{" "}
          /{" "}
          <a href="tel:+919582999888" className={globalStyles.gold}>
            +91 95829 99888
          </a>
        </span>
      </p>
      <p className={globalStyles.gold}>Mon-Sat | 9am-5pm IST</p>
    </div>
  );
};

export default pdpCustomerCareInfo;
