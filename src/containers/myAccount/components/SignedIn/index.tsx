import React from "react";
import cs from "classnames";
import styles from "../styles.scss";
import iconStyles from "styles/iconFonts.scss";

const SignedIn: React.FC<{ loginVia: string }> = props => {
  const { loginVia } = props;
  return (
    <div className={cs(styles.formSubheading, styles.iconSignedin)}>
      {" "}
      SIGNED IN USING
      {
        <span>
          {loginVia == "email" && (
            <i
              className={cs(
                iconStyles.icon,
                iconStyles.iconEmailGrey,
                styles.iconStyle
              )}
            ></i>
          )}
          {loginVia == "facebook" && (
            <i
              className={cs(
                iconStyles.icon,
                iconStyles.iconLoginFb,
                styles.iconStyle
              )}
            ></i>
          )}
          {loginVia == "google" && (
            <i
              className={cs(
                iconStyles.icon,
                iconStyles.iconLoginGoogle,
                styles.iconStyle
              )}
            ></i>
          )}
        </span>
      }{" "}
    </div>
  );
};

export default SignedIn;
