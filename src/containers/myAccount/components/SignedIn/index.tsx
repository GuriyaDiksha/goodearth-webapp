import React from "react";
import cs from "classnames";
import styles from "../styles.scss";
import iconStyles from "styles/iconFonts.scss";
import loginFb from "../../../../images/loginFb.svg";
import loginGoogle from "../../../../images/loginGoogle.svg";

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
                iconStyles.iconEmail,
                styles.iconStyle
              )}
            ></i>
          )}
          {loginVia == "facebook" && <img src={loginFb} width="40px" />}
          {loginVia == "google" && <img src={loginGoogle} width="40px" />}
        </span>
      }{" "}
    </div>
  );
};

export default SignedIn;
