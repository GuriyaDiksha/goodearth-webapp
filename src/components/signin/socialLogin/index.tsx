import React from "react";
import cs from "classnames";
import globalStyles from "../../../styles/global.scss";
import styles from "./styles.scss";
import loginFb from "../../../images/loginFb.svg";
import loginGoogle from "../../../images/loginGoogle.svg";
import { Link } from "react-router-dom";

const SocialLogin: React.FC = () => {
  return (
    <>
      <div className={cs(styles.socialLoginText, globalStyles.voffset5)}>
        {"- OR SIGN IN USING -"}
      </div>
      <div className={globalStyles.voffset3}>
        <Link to={"/account/facebook/login/?next=/"}>
          {/* <i className={cs(iconStyles.icon, iconStyles.iconLoginFb)}></i> */}
          <img src={loginFb} width="40px" />
        </Link>
        <Link to={"/account/google/login/?next=/"}>
          {/* <i className={cs(iconStyles.icon, iconStyles.iconLoginGoogle)}></i> */}
          <img src={loginGoogle} width="40px" />
        </Link>
      </div>
    </>
  );
};

export default SocialLogin;
