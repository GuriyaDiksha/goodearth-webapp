import React from "react";
import cs from "classnames";
import globalStyles from "../../../styles/global.scss";
import styles from "./styles.scss";
import loginFb from "../../../images/loginFb.svg";
import loginGoogle from "../../../images/loginGoogle.svg";
import { GoogleLogin } from "react-google-login";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import LoginService from "services/login";
import { useDispatch } from "react-redux";
import { props } from "./typings";

// import { Context } from "components/Modal/context.ts";
// import UserContext from "contexts/user";
// import { Link } from "react-router-dom";
// import SocialButton from "./button";

const SocialLogin: React.FC<props> = ({ closeModel }) => {
  const dispatch = useDispatch();
  const onLoginSuccess = (user: any) => {
    if (user?.email) {
      const data: any = {
        provider: "facebook",
        uid: user.userID,
        accessToken: user.accessToken,
        TokenExpiresTime: user.data_access_expiration_time,
        email: user.email,
        fname: user.name.split(" ")[0],
        lname: user.name.split(" ")[1]
      };
      LoginService.loginSocial(dispatch, data)
        .then(res => {
          closeModel();
        })
        .catch(err => {
          console.log("Cant Login due to ankur sir !!!!!!");
        });
    } else {
      console.log("Cant Login due not avalable number!!!!!!");
    }
  };

  const responseGoogle = (user: any) => {
    if (user.profileObj?.email) {
      const data: any = {
        provider: "google",
        uid: user.googleId,
        accessToken: user.tokenId,
        TokenExpiresTime: user.tokenObj.expires_at,
        email: user.profileObj.email,
        fname: user.profileObj.givenName,
        lname: user.profileObj.familyName
      };
      LoginService.loginSocial(dispatch, data).catch(err => {
        console.log("Cant Login due to ankur sir !!!!!!");
      });
    } else {
      console.log("Cant Login due not avalable number!!!!!!");
    }
  };

  return (
    <>
      <div className={cs(styles.socialLoginText, globalStyles.voffset5)}>
        {"- OR SIGN IN USING -"}
      </div>
      <div className={globalStyles.voffset3}>
        <FacebookLogin
          appId="2759423167667301"
          autoLoad={false}
          fields="name,email,picture"
          callback={onLoginSuccess}
          render={(renderProps: any) => (
            <img
              src={loginFb}
              width="40px"
              onClick={renderProps.onClick}
              className={styles.socialLogin}
            />
          )}
        />

        <GoogleLogin
          clientId="837034702464-l6tdm1d9enjdb28pt1qlr24797cvstdp.apps.googleusercontent.com"
          render={(renderProps: any) => (
            <img src={loginGoogle} width="40px" onClick={renderProps.onClick} />
          )}
          buttonText="Login"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          cookiePolicy={"single_host_origin"}
        />

        {/* </SocialButton> */}

        {/* <SocialButton
          provider="google"
          appId="837034702464-l6tdm1d9enjdb28pt1qlr24797cvstdp.apps.googleusercontent.com"
          onLoginSuccess={onLoginSuccess}
          onLoginFailure={onLoginFailure}
          key={"google"}
          scope={"https://www.googleapis.com/auth/user.gender.read"}
        >
          <img src={loginGoogle} width="40px" />
        </SocialButton> */}

        {/* <Link to={ROUTES.GOOGLE}> */}
        {/* <i className={cs(iconStyles.icon, iconStyles.iconLoginGoogle)}></i> */}
        {/* <img src={loginGoogle} width="40px" /> */}
        {/* </Link> */}
      </div>
    </>
  );
};

export default SocialLogin;
