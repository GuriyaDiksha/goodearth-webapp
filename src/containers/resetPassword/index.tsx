import React, { useState, useEffect } from "react";
import bootstrapStyles from "../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import myAccountComponentStyles from "../myAccount/components/styles.scss";
import myAccountStyles from "../myAccount/styles.scss";
import cs from "classnames";
import SecondaryHeader from "components/SecondaryHeader";
import { useSelector, useDispatch } from "react-redux";
import { AppState } from "reducers/typings";
import Formsy from "formsy-react";
import FormInput from "components/Formsy/FormInput";
import show from "../../images/show.svg";
import hide from "../../images/hide.svg";
import { RouteComponentProps, withRouter, useHistory } from "react-router";
import AccountService from "services/account";
// import CookieService from "services/cookie";
import { MESSAGE } from "constants/messages";
import * as valid from "utils/validate";
import LoginService from "services/login";

type Props = {
  uid: string;
  token: string;
} & RouteComponentProps;

const ResetPassword: React.FC<Props> = props => {
  const {
    device: { mobile },
    user: { isLoggedIn },
    info: { showTimer }
  } = useSelector((state: AppState) => state);
  const ResetPasswordFormRef = React.createRef<Formsy>();
  const [showPassword, setShowPassword] = useState(false);
  const [enableSubmit, setEnableSubmit] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const { uid, token } = props;
  const history = useHistory();

  useEffect(() => {
    const noContentContainerElem = document.getElementById(
      "no-content"
    ) as HTMLDivElement;
    if (
      noContentContainerElem.classList.contains(globalStyles.contentContainer)
    ) {
      noContentContainerElem.classList.remove(globalStyles.contentContainer);
    }
    if (isLoggedIn) {
      LoginService.logout(dispatch);
    }
    valid.pageViewGTM("ResetPassword");
  }, []);
  const handleInvalidSubmit = () => {
    setTimeout(() => {
      const firstErrorField = document.getElementsByClassName(
        globalStyles.errorBorder
      )[0] as HTMLElement;
      if (firstErrorField) {
        firstErrorField.focus();
        firstErrorField.scrollIntoView({ block: "center", behavior: "smooth" });
      }
      // for error Tracking
      const errorList = valid.getErrorList(
        globalStyles.errorMsg,
        "reset-password-form"
      );
      if (errorList && errorList.length) {
        valid.errorTracking(errorList, location.href);
      }
    }, 0);
  };

  const handleSubmit = (
    model: any,
    resetForm: any,
    updateInputWithError: any
  ) => {
    const { password1, password2 } = model;
    const formData = {
      uid,
      token,
      newPassword1: password1,
      newPassword2: password2
    };

    AccountService.confirmResetPassword(dispatch, formData)
      .then(data => {
        resetForm();
        // const { bridalCurrency, bridalId } = data;
        // bridalId && CookieService.setCookie("bridalId", bridalId);
        // bridalCurrency &&
        //   CookieService.setCookie("bridalCurrency", bridalCurrency);
        valid.showGrowlMessage(dispatch, MESSAGE.ALL_SESSION_LOGOUT);
        let counter = 5;
        const timer = setInterval(function() {
          if (counter < 0) {
            history.push(data.redirectTo || "/");
            clearInterval(timer);
            localStorage.setItem("tempEmail", data.email);
            data.redirectTo != "/order/checkout" &&
              LoginService.showLogin(dispatch);
          } else {
            setErrorMessage(
              data.message + " This page will redirect in " + counter + " sec."
            );
          }
          counter--;
        }, 1000);
        //  else {
        // const msg = (typeof data.errorMessage) == "string" ? data.errorMessage : "Something went wrong Please try again later!";
        // const { newPassword1, newPassword2 } = data.errorMessage;
        // setErrorMessage(msg);
        // if (newPassword1 || newPassword2) {
        //   updateInputWithError({ newPassword1, newPassword2 });
        // }
        // }
      })
      .catch((err: any) => {
        setErrorMessage(err.response.data.errorMessage);
      });
  };

  const formContent = (
    <div
      className={cs(myAccountComponentStyles.loginForm, globalStyles.voffset4)}
    >
      <Formsy
        ref={ResetPasswordFormRef}
        onValid={() => setEnableSubmit(true)}
        onValidSubmit={handleSubmit}
        onInvalidSubmit={handleInvalidSubmit}
      >
        <div
          className={myAccountComponentStyles.categorylabel}
          id="reset-password-form"
        >
          <div>
            <FormInput
              name="password1"
              placeholder={"New Password"}
              label={"New Password"}
              keyPress={e => (e.key == "Enter" ? e.preventDefault() : "")}
              type={showPassword ? "text" : "password"}
              validations={{
                isValid: (values, value) => {
                  return (
                    values.password1 &&
                    value &&
                    value.length >= 6 &&
                    /[a-z]/.test(value) &&
                    /[0-9]/.test(value) &&
                    /[A-Z]/.test(value)
                  );
                }
              }}
              validationErrors={{
                isValid:
                  "Password should be between 6 to 20 characters which should contain at least one numeric digit, one uppercase and one lowercase letter."
              }}
              required
            />
            <span
              className={myAccountComponentStyles.togglePasswordBtn}
              onClick={() => setShowPassword(!showPassword)}
            >
              <img src={showPassword ? show : hide} />
            </span>
          </div>
          <div>
            <FormInput
              name="password2"
              placeholder={"Confirm Password"}
              label={"Confirm Password"}
              isDrop={true}
              isPaste={true}
              keyPress={e => (e.key == "Enter" ? e.preventDefault() : "")}
              type={showPassword ? "text" : "password"}
              validations={{
                equalsField: "password1",
                isValid: (values, value) => {
                  return (
                    values.password2 &&
                    value &&
                    /[a-z]/.test(value) &&
                    /[0-9]/.test(value) &&
                    /[A-Z]/.test(value)
                  );
                }
              }}
              validationErrors={{
                equalsField: "The password entered doesn't match",
                isValid:
                  "Password should be between 6 to 20 characters which should contain at least one numeric digit, one uppercase and one lowercase letter."
              }}
              required
            />
          </div>
          <div>
            {errorMessage ? (
              <p className={cs(globalStyles.errorMsg, globalStyles.marginB10)}>
                {errorMessage}
              </p>
            ) : (
              ""
            )}
            <input
              type="submit"
              disabled={!enableSubmit}
              className={
                enableSubmit
                  ? globalStyles.ceriseBtn
                  : cs(globalStyles.disabledBtn, globalStyles.ceriseBtn)
              }
              value="Save"
            />
          </div>
        </div>
      </Formsy>
    </div>
  );
  const mainContent = (
    <div className={bootstrapStyles.row}>
      <div
        className={cs(
          bootstrapStyles.col10,
          bootstrapStyles.offset1,
          bootstrapStyles.colMd8,
          bootstrapStyles.offsetMd2
        )}
      >
        <div className={myAccountComponentStyles.formHeading}>
          Reset Password
        </div>
        <div className={myAccountComponentStyles.formSubheading}>
          Please fill in the fields below
        </div>
        {formContent}
      </div>
    </div>
  );

  const bgClass = cs(globalStyles.col12, myAccountStyles.bgProfile);
  return (
    <div
      className={cs(globalStyles.containerStart, {
        [globalStyles.containerStartTimer]: showTimer
      })}
    >
      {!mobile && (
        <SecondaryHeader>
          <div
            className={cs(bootstrapStyles.colMd11, bootstrapStyles.offsetMd1)}
          >
            <span className={myAccountStyles.heading}>Reset Password</span>
          </div>
        </SecondaryHeader>
      )}
      <div className={bootstrapStyles.row}>
        <div className={bgClass}>
          <div className={bootstrapStyles.row}>
            <div
              className={cs(
                bootstrapStyles.colMd4,
                bootstrapStyles.offsetMd4,
                bootstrapStyles.col12,
                globalStyles.textCenter,
                { [myAccountStyles.accountFormBg]: !mobile },
                { [myAccountStyles.accountFormBgMobile]: mobile }
              )}
            >
              {mainContent}
              {/* {notificationData ? <Growl text={this.state.notificationData} show={true}/> : ""} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(ResetPassword);
