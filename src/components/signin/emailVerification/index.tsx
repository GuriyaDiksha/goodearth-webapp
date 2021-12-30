import React, { useEffect, useState } from "react";
import cs from "classnames";
// styles
import styles from "../styles.scss";
import globalStyles from "styles/global.scss";
import bootstrapStyles from "../../../styles/bootstrap/bootstrap-grid.scss";
// services
import LoginService from "services/login";
import { useDispatch } from "react-redux";
import Loader from "components/Loader";
import OtpBox from "components/OtpComponent/otpBox";

type Props = {
  successMsg: string;
  email: string;
  changeEmail: (event: any) => void;
};
const EmailVerification: React.FC<Props> = ({
  successMsg,
  email,
  changeEmail
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [enableBtn, setEnableBtn] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [showCustCare, setShowCustCare] = useState(false);
  const [timerId, setTimerId] = useState<any>();
  const [otpValue, setOtpValue] = useState("");
  const [error, setError] = useState<(JSX.Element | string)[] | string>("");
  const dispatch = useDispatch();
  const timer = () => {
    setTimeRemaining(30);
    setEnableBtn(false);
    const id = setInterval(() => {
      setTimeRemaining(timeRemaining => timeRemaining - 1);
    }, 1000);
    setTimerId(id);
  };

  const goLogin = () => {
    localStorage.setItem("tempEmail", email);
    LoginService.showLogin(dispatch);
  };
  const verifyOtp = async () => {
    try {
      setIsLoading(true);
      const res = await LoginService.verifyUserOTP(
        dispatch,
        email,
        parseInt(otpValue)
      );
      if (res.success) {
        goLogin();
      } else if (res.alreadyVerified) {
        setError([
          "Looks like you are aleady verified. Please",
          <span
            className={cs(
              globalStyles.errorMsg,
              globalStyles.linkTextUnderline
            )}
            key={1}
            onClick={goLogin}
          >
            re-login
          </span>
        ]);
      } else {
        setError(res.message);
      }
    } catch (err) {
      // nothing
    } finally {
      setIsLoading(false);
    }
  };
  const sendOtp = async () => {
    try {
      setIsLoading(true);
      const res = await LoginService.sendUserOTP(dispatch, email);
      if (res.otpSent) {
        // handle success
      }
      timer();
    } catch (err) {
      console.log(err);
      setShowCustCare(true);
    } finally {
      setShowCustCare(true);
      setIsLoading(false);
    }
  };
  const clearTimer = () => {
    clearInterval(timerId);
    setTimeRemaining(0);
    setEnableBtn(true);
  };

  useEffect(() => {
    if (timeRemaining <= 0) {
      clearTimer();
    }
  }, [timeRemaining, timerId]);
  +useEffect(() => {
    timer();
    const elem = document.getElementById("first-heading");
    elem?.scrollIntoView({ block: "end", inline: "nearest" });
    return () => {
      clearTimer();
    };
  }, []);

  const secondsToMinutes = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;
    return minutes + ":" + seconds;
  };
  return (
    <>
      {successMsg ? (
        <div className={cs(bootstrapStyles.col12)}>
          <div className={cs(globalStyles.successMsg, globalStyles.textCenter)}>
            {successMsg}
          </div>
        </div>
      ) : (
        ""
      )}
      <>
        <div className={styles.formHeading} id="first-heading">
          Verify Email
        </div>
        <div className={styles.para}>
          <p>
            Please verify your email id by entering OTP sent to{" "}
            <strong>{email}</strong>
          </p>
          <br />
          <p className={styles.formSubheading}>
            Remember to check spam folder.
          </p>
          <br />
        </div>
        <OtpBox otpValue={setOtpValue} placeholder="Enter OTP" />
        <div className={styles.timerContainer}>
          <p
            className={cs(styles.smallTxt, {
              [globalStyles.hiddenEye]: timeRemaining == 0
            })}
          >
            {secondsToMinutes(timeRemaining)}
          </p>
          <div
            className={cs(styles.resendBtn, styles.smallTxt, {
              [styles.resendBtnDisabled]: !enableBtn
            })}
            onClick={enableBtn ? sendOtp : () => null}
          >
            resend Otp
          </div>
        </div>
        {error && <p className={styles.loginErrMsg}>{error}</p>}
        <div
          className={cs(globalStyles.ceriseBtn, styles.btn, {
            [globalStyles.disabledBtn]: otpValue.length != 6
          })}
          onClick={otpValue.length == 6 ? verifyOtp : () => null}
        >
          Verify OTP
        </div>
        <br />
        {showCustCare && (
          <>
            <p className={styles.miniTxt}>
              Still not received? Please connect us at:
              <br />
              <a href="tel:+919582999555">+91 95829 99555</a> /{" "}
              <a href="tel:+919582999888">+91 95829 99888</a>
            </p>
            <br />
          </>
        )}
        <div className={styles.bigTxt}>
          <div className={globalStyles.pointer} onClick={changeEmail}>
            &lt; Back{" "}
          </div>
        </div>
      </>
      {isLoading && <Loader />}
    </>
  );
};

export default EmailVerification;
