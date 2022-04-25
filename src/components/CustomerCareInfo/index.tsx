import React from "react";
import cs from "classnames";
import globalStyles from "../../styles/global.scss";
import styles from "./styles.scss";
import iconStyles from "../../styles/iconFonts.scss";

const CustomerCareInfo: React.FC = () => {
  return (
    <div className={cs(globalStyles.voffset3, styles.customercare)}>
      <h3>FOR ANY QUERIES OR ASSISTANCE</h3>
      <p>Write to us at:</p>
      <p>
        <span className={globalStyles.cerise}>
          <i
            className={cs(iconStyles.icon, iconStyles.iconEmail, styles.icon)}
          />
          <a href="mailto:customercare@goodearth.in">
            customercare@goodearth.in
          </a>
        </span>
      </p>
      <p>Call us at:</p>
      <p>
        <span className={globalStyles.cerise}>
          <i
            className={cs(iconStyles.icon, iconStyles.iconPhone, styles.icon)}
          />
          <a href="tel:+919582999555">+91 95829 99555</a> /{" "}
          <a href="tel:+919582999888">+91 95829 99888</a>
        </span>
      </p>
      <p>Mon-Sat | 9am-5pm IST</p>
    </div>
  );
};

export default CustomerCareInfo;
