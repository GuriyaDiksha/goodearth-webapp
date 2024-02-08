import React, { useState, ReactNode, useEffect } from "react";
import cs from "classnames";
// styles
import styles from "../styles.scss";
import globalStyles from "styles/global.scss";
// services
import LoginService from "services/login";
import { useDispatch, useSelector } from "react-redux";
// import Loader from "components/Loader";
// import OtpBox from "components/OtpComponent/otpBox";
// import { showGrowlMessage } from "utils/validate";
// import { MESSAGE } from "constants/messages";
import { useHistory, useLocation } from "react-router";
import NewOtpComponent from "components/OtpComponent/NewOtpComponent";
import { decriptdata } from "utils/validate";
import { GA_CALLS } from "constants/cookieConsent";
import CookieService from "services/cookie";
import Button from "components/Button";
import { Currency } from "typings/currency";
import { censorEmail, censorPhoneNumber } from "utils/utility";
import { AppState } from "reducers/typings";
import { updateComponent, updateModal } from "actions/modal";
import { POPUP } from "constants/components";
import ModalStyles from "components/Modal/styles.scss";

type Props = {
  successMsg: string;
  email: string;
  changeEmail: (event: any) => void;
  goLogin: () => void;
  socialLogin?: ReactNode;
  setIsSuccessMsg?: (arg: boolean) => void;
  isCheckout?: boolean;
  currency: Currency;
  // nextStep?: () => void;
  products?: any;
  sortBy?: string;
  phoneNo?: string;
  isRegistration?: boolean;
};

const EmailVerification: React.FC<Props> = ({
  successMsg,
  email,
  changeEmail,
  goLogin,
  socialLogin,
  isCheckout,
  currency,
  // nextStep,
  products,
  sortBy,
  phoneNo,
  isRegistration
}) => {
  const [error, setError] = useState<(JSX.Element | string)[] | string>("");
  const [attempts, setAttempts] = useState({
    attempts: 0,
    maxAttemptsAllow: 5
  });
  const [otpSmsSent, setOtpSmsSent] = useState(false);
  // const headingref = React.useRef<null | HTMLDivElement>(null);
  const dispatch = useDispatch();
  const history = useHistory();
  const { mobile } = useSelector((state: AppState) => state.device);
  const { nextUrl } = useSelector((state: AppState) => state.info);

  const showLogin = () => {
    localStorage.setItem("tempEmail", email);
    goLogin();
  };
  const location = useLocation();
  // const queryString = location.search;
  // const urlParams = new URLSearchParams(queryString);
  // const boId = urlParams.get("bo_id");

  useEffect(() => setOtpSmsSent(!!phoneNo), []);

  const gtmPushSignIn = (data: any) => {
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({
        event: "eventsToSend",
        eventAction: "signIn",
        eventCategory: "formSubmission",
        eventLabel: location.pathname
      });
      dataLayer.push({
        event: "login",
        user_status: "logged in", //'Pass the user status ex. logged in OR guest',
        // login_method: "", //'Pass Email or Google as per user selection',
        user_id: data?.userId
      });
    }
  };

  const verifyOtp = async (otp: string) => {
    try {
      // setIsLoading(true);
      const source =
        history.location.pathname.indexOf("checkout") != -1 ? "checkout" : "";
      setError("");
      const res = await LoginService.verifyUserOTP(
        dispatch,
        email,
        otp,
        currency,
        source,
        sortBy
      );

      if (res?.token) {
        gtmPushSignIn(res);
        const userConsent = CookieService.getCookie("consent").split(",");

        if (userConsent.includes(GA_CALLS)) {
          Moengage.track_event("Login", {
            email: res.email
          });
          Moengage.add_first_name(res.firstName);
          Moengage.add_last_name(res.lastName);
          Moengage.add_email(res.email);
          Moengage.add_mobile(res.phoneNo);
          Moengage.add_gender(res.gender);
          Moengage.add_unique_user_id(res.email);
        }
        const loginpopup = new URLSearchParams(location.search).get(
          "loginpopup"
        );
        loginpopup == "cerise" && history.push("/");
        if (userConsent.includes(GA_CALLS)) {
          dataLayer.push({
            event: "checkout",
            ecommerce: {
              currencyCode: currency,
              checkout: {
                actionField: { step: 1 },
                products: products
              }
            }
          });
        }
        // this.context.closeModal();
        // nextStep?.();
        // const history = this.props.history
        // const path = history.location.pathname;
        // if (path.split("/")[1] == "password-reset") {
        //   const searchParams = new URLSearchParams(history.location.search);
        //   history.push(searchParams.get("redirect_to") || "");
        // }

        if (nextUrl === "/wishlist") {
          dispatch(
            updateComponent(
              POPUP.SHAREWISHLIST,
              null,
              mobile ? false : true,
              mobile ? ModalStyles.bottomAlignSlideUp : "",
              mobile ? "slide-up-bottom-align" : ""
            )
          );
          dispatch(updateModal(true));
        } else {
          history.push(nextUrl);
        }

        const boid = new URLSearchParams(history.location.search).get("bo_id");

        if (boid) {
          history.push(`/order/checkout?bo_id=${boid}`);
        }
      } else {
        setAttempts({
          attempts: res?.attempts || 0,
          maxAttemptsAllow: res?.maxAttemptsAllow || 5
        });
        setError("Invalid OTP");
      }
    } catch (error) {
      const data = decriptdata(error?.response?.data);
      setAttempts({
        attempts: data?.attempts || 0,
        maxAttemptsAllow: data?.maxAttemptsAllow || 5
      });

      if (data.alreadyVerified) {
        setError([
          "Looks like you are aleady verified. ",
          <span
            className={cs(
              globalStyles.errorMsg,
              globalStyles.linkTextUnderline
            )}
            key={1}
            onClick={showLogin}
          >
            Please re-login
          </span>
        ]);
      } else {
        setError(data?.message || "OTP Expired or Invalid OTP");
      }
    } finally {
      // setIsLoading(false);
    }
  };
  const sendOtp = async () => {
    try {
      // setIsLoading(true);
      setError("");
      setOtpSmsSent(false);
      const res = await LoginService.sendUserOTP(dispatch, email);
      if (res.otpSent) {
        // handle success
        // timer();
        setOtpSmsSent(res?.otpSmsSent);
      } else if (res.alreadyVerified) {
        setError([
          "Looks like you are aleady verified. ",
          <span
            className={cs(
              globalStyles.errorMsg,
              globalStyles.linkTextUnderline
            )}
            key={1}
            onClick={showLogin}
          >
            Please re-login
          </span>
        ]);
      }
      // setShowCustCare(true);
    } catch (err) {
      if (err?.response?.data?.alreadyVerified) {
        setError([
          "Looks like you are aleady verified. ",
          <span
            className={cs(styles.errorMsg, globalStyles.linkTextUnderline)}
            key={1}
            onClick={showLogin}
          >
            Please re-login
          </span>
        ]);
      } else {
        // setShowCustCare(true);
      }
    } finally {
      // setIsLoading(false);
    }
  };

  useEffect(() => {
    const ele = document.getElementById("email-verification-container");
    ele?.scrollBy(0, ele.offsetTop);
    if (isCheckout) {
      const newele = document.getElementById("checkout-emailverification");
      newele?.scrollIntoView();
    }
  }, []);

  const goBackCta = (
    <Button
      type="submit"
      className={cs(styles.changeEmailBtn, {
        [globalStyles.btnFullWidth]: mobile
      })}
      label="Go Back"
      onClick={changeEmail}
      variant="outlineMediumMedCharcoalCta366"
    />
  );

  return (
    <div
      className={cs(globalStyles.textCenter, styles.emailVerifyContainer)}
      id="myemail"
    >
      {successMsg ? (
        <div
          className={cs(styles.successMsg, {
            [styles.oldSuccessMsg]: isCheckout
          })}
        >
          {successMsg}
        </div>
      ) : (
        ""
      )}
      <>
        {!isCheckout && (
          <div
            className={cs(styles.formHeading, styles.verifyHeading)}
            id="first-heading"
          >
            Welcome
          </div>
        )}
        {!isCheckout && (
          <div className={cs(styles.loginFormSubheading, styles.verifyOtp)}>
            {isRegistration
              ? `Please verify your email ID by entering OTP sent to ${censorEmail(
                  email
                )}`
              : `Please enter the OTP sent to ${censorEmail(email)}
           ${phoneNo &&
             otpSmsSent &&
             `& ${censorPhoneNumber(phoneNo.toString())}`} to login`}
          </div>
        )}

        {isCheckout && (
          <div className={styles.checkoutHeaderContainer}>
            <div className={styles.header}>Verify Email</div>
            <div className={styles.subHeader}>
              OTP has been sent to you via your email. Please enter below:
            </div>
          </div>
        )}
        <NewOtpComponent
          otpSentVia={"email"}
          resendOtp={sendOtp}
          verifyOtp={verifyOtp}
          errorMsg={error}
          attempts={attempts}
          btnText={"Verify OTP & Proceed"}
          startTimer={true}
          setAttempts={setAttempts}
          headingClassName={styles.verifyOtpHeading}
          containerClassName={styles.verifyOtpContainer}
          timerClass={styles.otpTimer}
          otpPolicyClass={styles.otpPolicy}
          otpAttemptClass={styles.otpAttempt}
          verifyCtaClass={styles.verifyOtpCta}
          groupTimerAndAttempts={true}
          goBackCta={!isCheckout ? goBackCta : null}
          socialLogin={socialLogin}
          uniqueId="emailverifyid"
        />
        {/* {!boId && (
          <div className={styles.bigTxt} style={{ marginTop: "10px" }}>
            <div className={globalStyles.pointer} onClick={changeEmail}>
              &lt; Back{" "}
            </div>
          </div>
        )} */}
      </>
      {/* {isLoading && <Loader />} */}
    </div>
  );
};

export default EmailVerification;
