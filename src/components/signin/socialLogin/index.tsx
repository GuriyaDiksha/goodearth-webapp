import React from "react";
import cs from "classnames";
import globalStyles from "../../../styles/global.scss";
import styles from "./styles.scss";
// import loginFb from "../../../images/loginFb.svg";
import loginGoogle from "../../../images/loginGoogle.svg";
import GoogleLogin from "react-google-login";
// import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import LoginService from "services/login";
import { useDispatch, useSelector } from "react-redux";
import { props } from "./typings";
import * as util from "../../../utils/validate";
import { useHistory } from "react-router";
import { AppState } from "reducers/typings";

const SocialLogin: React.FC<props> = ({ closeModel }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { sortBy } = useSelector((state: AppState) => state.wishlist);
  const currency = useSelector((state: AppState) => state.currency);
  const source =
    history.location.pathname.indexOf("checkout") != -1 ? "checkout" : "";
  // const onLoginSuccess = (user: any) => {
  //   if (user?.email) {
  //     const data: any = {
  //       provider: "facebook",
  //       uid: user.userID,
  //       accessToken: user.accessToken,
  //       email: user.email,
  //       fname: user.name.split(" ")[0],
  //       lname: user.name.split(" ")[1],
  //       requestParam: JSON.stringify(user)
  //     };
  //     LoginService.loginSocial(dispatch, data, source, history)
  //       .then(res => {
  //         // closeModel();
  //       })
  //       .catch(err => {
  //         const data = err.response?.data;
  //         util.showGrowlMessage(dispatch, data?.non_field_errors?.[0], 6000);
  //         closeModel();
  //         console.log("Cant Login due to ankur sir !!!!!!");
  //       });
  //   } else {
  //     console.log("Cant Login due not avalable number!!!!!!");
  //   }
  // };

  const responseGoogle = (user: any) => {
    if (user.profileObj?.email) {
      const data: any = {
        provider: "google",
        uid: user.googleId,
        accessToken: user.tokenId,
        email: user.profileObj.email,
        fname: user.profileObj.givenName,
        lname: user.profileObj.familyName,
        requestParam: JSON.stringify(user)
      };
      LoginService.loginSocial(
        dispatch,
        data,
        currency,
        source,
        history,
        sortBy
      )
        .then(res => {
          closeModel();
        })
        .catch(err => {
          const data = err.response?.data;
          util.showGrowlMessage(dispatch, data?.non_field_errors?.[0], 6000);
          closeModel();
          console.log("Cant Login due to ankur sir !!!!!!");
        });
    } else {
      console.log("Cant Login due not avalable number!!!!!!");
    }
  };

  const responseGoogleFail = (err: any) => {
    console.log(err);
  };
  return (
    <>
      <div className={cs(styles.socialLoginText, globalStyles.voffset5)}>
        {"- OR LOGIN USING -"}
      </div>
      <div className={globalStyles.voffset3}>
        {/* <FacebookLogin
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
        /> */}

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
          onFailure={responseGoogleFail}
          // cookiePolicy={"single_host_origin"}
        />
      </div>
    </>
  );
};

export default SocialLogin;
