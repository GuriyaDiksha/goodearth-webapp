import React from "react";
import cs from "classnames";
import globalStyles from "../../../styles/global.scss";
import styles from "./styles.scss";
import loginFb from "../../../images/loginFb.svg";
import loginGoogle from "../../../images/loginGoogle.svg";
import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import LoginService from "services/login";
import { useDispatch } from "react-redux";
import { props } from "./typings";
import * as util from "../../../utils/validate";

const SocialLogin: React.FC<props> = ({ closeModel }) => {
  const dispatch = useDispatch();
  const onLoginSuccess = (user: any) => {
    if (user?.email) {
      const data: any = {
        provider: "facebook",
        uid: user.userID,
        accessToken: user.accessToken,
        email: "darpanrawat@goodearth.in",
        fname: user.name.split(" ")[0],
        lname: user.name.split(" ")[1],
        requestParam: JSON.stringify(user)
      };
      LoginService.loginSocial(dispatch, data)
        .then(res => {
          // closeModel();
        })
        .catch(err => {
          const data = err.response?.data;
          util.showGrowlMessage(dispatch, data?.non_field_errors?.[0], 6000);
          console.log("Cant Login due to ankur sir !!!!!!");
          closeModel();
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
        email: "darpanrawat@goodearth.in",
        fname: user.profileObj.givenName,
        lname: user.profileObj.familyName,
        requestParam: JSON.stringify(user)
      };
      LoginService.loginSocial(dispatch, data)
        .then(res => {
          closeModel();
        })
        .catch(err => {
          const data = err.response?.data;
          util.showGrowlMessage(dispatch, data?.non_field_errors?.[0], 6000);
          console.log("Cant Login due to ankur sir !!!!!!");
          closeModel();
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
          appId={__FB_APP_ID__}
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
          clientId={__GOOGLE_CLIENT_ID__}
          render={(renderProps: any) => (
            <img
              src={loginGoogle}
              width="40px"
              className={styles.socialLogin}
              onClick={renderProps.onClick}
            />
          )}
          autoLoad={false}
          onSuccess={responseGoogle}
          // cookiePolicy={"single_host_origin"}
        />
      </div>
    </>
  );
};

export default SocialLogin;
