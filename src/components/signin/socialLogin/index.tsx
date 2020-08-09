import React from "react";
import cs from "classnames";
import globalStyles from "../../../styles/global.scss";
import styles from "./styles.scss";
import loginFb from "../../../images/loginFb.svg";
import loginGoogle from "../../../images/loginGoogle.svg";
// import { Link } from "react-router-dom";
// import { ROUTES } from "routes/typings";
import SocialButton from "./button";

const SocialLogin: React.FC = () => {
  const onLoginSuccess = (user: any) => {
    console.log(user);
  };

  const onLoginFailure = (user: any) => {
    console.log(user);
  };

  return (
    <>
      <div className={cs(styles.socialLoginText, globalStyles.voffset5)}>
        {"- OR SIGN IN USING -"}
      </div>
      <div className={globalStyles.voffset3}>
        {/* <Link to={ROUTES.FB}> */}
        {/* <i className={cs(iconStyles.icon, iconStyles.iconLoginFb)}></i> */}
        {/* <img src={loginFb} width="40px" /> */}
        {/* </Link> */}
        <SocialButton
          provider="facebook"
          appId="2759423167667301"
          onLoginSuccess={onLoginSuccess}
          onLoginFailure={onLoginFailure}
          key={"facebook"}
        >
          <img src={loginFb} width="40px" />
        </SocialButton>

        <SocialButton
          provider="google"
          appId="837034702464-l6tdm1d9enjdb28pt1qlr24797cvstdp.apps.googleusercontent.com"
          onLoginSuccess={onLoginSuccess}
          onLoginFailure={onLoginFailure}
          key={"google"}
        >
          <img src={loginGoogle} width="40px" />
        </SocialButton>

        {/* <Link to={ROUTES.GOOGLE}> */}
        {/* <i className={cs(iconStyles.icon, iconStyles.iconLoginGoogle)}></i> */}
        {/* <img src={loginGoogle} width="40px" /> */}
        {/* </Link> */}
      </div>
    </>
  );
};

export default SocialLogin;
