import React, { useState } from "react";
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
import { showMessage } from "actions/growlMessage";
import CookieService from "services/cookie";

type Props = {
  uid: string;
  token: string;
} & RouteComponentProps;

const ResetPassword: React.FC<Props> = props => {
  const { mobile } = useSelector((state: AppState) => state.device);
  const ResetPasswordFormRef = React.createRef<Formsy>();
  const [showPassword, setShowPassword] = useState(false);
  const [enableSubmit, setEnableSubmit] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { uid, token } = props;
  const history = useHistory();
  const handleInvalidSubmit = () => {
    setTimeout(() => {
      const firstErrorField = document.getElementsByClassName(
        globalStyles.errorBorder
      )[0] as HTMLElement;
      if (firstErrorField) {
        firstErrorField.focus();
        firstErrorField.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    }, 0);
  };
  const dispatch = useDispatch();

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
        const { bridalCurrency, bridalId } = data;
        bridalId && CookieService.setCookie("bridalId", bridalId);
        bridalCurrency &&
          CookieService.setCookie("bridalCurrency", bridalCurrency);
        dispatch(showMessage("You have been logged out of all sessions."));
        let counter = 5;
        const timer = setInterval(function() {
          if (counter < 0) {
            history.push(data.redirectTo || "/");
            clearInterval(timer);
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
        <div className={myAccountComponentStyles.categorylabel}>
          <div>
            <FormInput
              name="password1"
              placeholder={"New Password"}
              label={"New Password"}
              keyPress={e => (e.key == "Enter" ? e.preventDefault() : "")}
              type={showPassword ? "text" : "password"}
              validations={{
                minLength: 6
              }}
              validationErrors={{
                minLength: "Please enter at least 6 characters for the password"
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
                equalsField: "password1"
              }}
              validationErrors={{
                equalsField: "Passwords do not match"
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
    <div className={globalStyles.containerStart}>
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
