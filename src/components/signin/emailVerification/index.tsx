import React, { useState, ReactNode, useEffect } from "react";
import cs from "classnames";
// styles
import styles from "../styles.scss";
import globalStyles from "styles/global.scss";
// services
import LoginService from "services/login";
import { useDispatch } from "react-redux";
import Loader from "components/Loader";
// import OtpBox from "components/OtpComponent/otpBox";
import { showGrowlMessage } from "utils/validate";
import { MESSAGE } from "constants/messages";
import { useLocation } from "react-router";
import NewOtpComponent from "components/OtpComponent/NewOtpComponent";
import { decriptdata } from "utils/validate";
import Button from "components/Button";

type Props = {
  successMsg: string;
  email: string;
  changeEmail: (event: any) => void;
  goLogin: () => void;
  socialLogin?: ReactNode;
  setIsSuccessMsg?: (arg: boolean) => void;
  isCheckout?: boolean;
};
const EmailVerification: React.FC<Props> = ({
  successMsg,
  email,
  changeEmail,
  goLogin,
  socialLogin,
  isCheckout
}) => {
  const [isLoading, setIsLoading] = useState(false);
  // const [enableBtn, setEnableBtn] = useState(false);
  // const [timeRemaining, setTimeRemaining] = useState(60);
  //const [showCustCare, setShowCustCare] = useState(false);
  // const [timerId, setTimerId] = useState<any>();
  // const [otpValue, setOtpValue] = useState("");
  const [error, setError] = useState<(JSX.Element | string)[] | string>("");
  const [attempts, setAttempts] = useState({
    attempts: 0,
    maxAttemptsAllow: 5
  });
  // const headingref = React.useRef<null | HTMLDivElement>(null);
  const dispatch = useDispatch();
  // const timer = () => {
  //   setTimeRemaining(90);
  //   setEnableBtn(false);
  //   const id = setInterval(() => {
  //     setTimeRemaining(timeRemaining => timeRemaining - 1);
  //   }, 1000);
  //   setTimerId(id);
  // };

  const showLogin = () => {
    localStorage.setItem("tempEmail", email);
    goLogin();
  };
  const location = useLocation();
  const queryString = location.search;
  const urlParams = new URLSearchParams(queryString);
  const boId = urlParams.get("bo_id");
  const verifyOtp = async (otp: string) => {
    try {
      setIsLoading(true);
      setError("");
      const res = await LoginService.verifyUserOTP(dispatch, email, otp);

      if (res.success) {
        showGrowlMessage(
          dispatch,
          MESSAGE.VERIFY_SUCCESS,
          3000,
          "VERIFY_SUCCESS"
        );
        showLogin();
      } else {
        setAttempts({
          attempts: res?.attempts || 0,
          maxAttemptsAllow: res?.maxAttemptsAllow || 5
        });
        setError("Invalid OTP");
      }
    } catch (error) {
      const data = decriptdata(error.response?.data);
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
      setIsLoading(false);
    }
  };
  const sendOtp = async () => {
    try {
      setIsLoading(true);
      setError("");
      const res = await LoginService.sendUserOTP(dispatch, email);
      if (res.otpSent) {
        // handle success
        // timer();
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
      if (err.response.data.alreadyVerified) {
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
      setIsLoading(false);
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
      className={cs(globalStyles.btnFullWidth, styles.changeEmailBtn)}
      label="Go Back"
      onClick={changeEmail}
      variant="outlineSmallMedCharcoalCta"
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
            Verify Email to Login
          </div>
        )}
        {!isCheckout && (
          <div className={cs(styles.loginFormSubheading, styles.verifyOtp)}>
            Please verify your email ID by entering OTP sent to {email}
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
          goBackCta={!isCheckout && !boId ? goBackCta : null}
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
