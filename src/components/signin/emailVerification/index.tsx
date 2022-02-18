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
import { showGrowlMessage } from "utils/validate";
import { MESSAGE } from "constants/messages";
import { useLocation } from "react-router";

type Props = {
  successMsg: string;
  email: string;
  changeEmail: (event: any) => void;
  goLogin: () => void;
};
const EmailVerification: React.FC<Props> = ({
  successMsg,
  email,
  changeEmail,
  goLogin
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [enableBtn, setEnableBtn] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [showCustCare, setShowCustCare] = useState(false);
  const [timerId, setTimerId] = useState<any>();
  const [otpValue, setOtpValue] = useState("");
  const [error, setError] = useState<(JSX.Element | string)[] | string>("");
  const dispatch = useDispatch();
  const timer = () => {
    setTimeRemaining(60);
    setEnableBtn(false);
    const id = setInterval(() => {
      setTimeRemaining(timeRemaining => timeRemaining - 1);
    }, 1000);
    setTimerId(id);
  };

  const showLogin = () => {
    localStorage.setItem("tempEmail", email);
    goLogin();
  };
  const location = useLocation();
  const queryString = location.search;
  const urlParams = new URLSearchParams(queryString);
  const boId = urlParams.get("bo_id");
  const verifyOtp = async () => {
    try {
      setIsLoading(true);
      setError("");
      const res = await LoginService.verifyUserOTP(
        dispatch,
        email,
        parseInt(otpValue)
      );
      if (res.success) {
        showGrowlMessage(
          dispatch,
          MESSAGE.VERIFY_SUCCESS,
          3000,
          "VERIFY_SUCCESS"
        );
        showLogin();
      } else {
        setError("Invalid OTP");
      }
    } catch (err) {
      if (err.response.data.alreadyVerified) {
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
        setError("OTP Expired or Invalid OTP");
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
        timer();
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
      setShowCustCare(true);
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
        setShowCustCare(true);
      }
    } finally {
      setIsLoading(false);
    }
  };
  const clearTimer = () => {
    clearInterval(timerId);
    setTimeRemaining(0);
    setEnableBtn(true);
  };

  const changeOTP = (value: string) => {
    setOtpValue(value);
    setError("");
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
    <div className={globalStyles.textCenter}>
      {successMsg ? (
        <div className={cs(bootstrapStyles.col12)}>
          <div
            className={cs(
              globalStyles.successMsg,
              globalStyles.textCenter,
              globalStyles.marginT20
            )}
          >
            {successMsg}
          </div>
        </div>
      ) : (
        ""
      )}
      <>
        <div
          className={cs(styles.formHeading, styles.verifyHeading)}
          id="first-heading"
        >
          Verify Email
        </div>
        <div className={cs(styles.para, styles.verifyPara)}>
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
        <OtpBox error={!!error} otpValue={changeOTP} placeholder="Enter OTP" />
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
        {error && (
          <p className={cs(styles.loginErrMsg, styles.verifyErrMsg)}>{error}</p>
        )}
        <br />
        {showCustCare && (
          <>
            <p className={styles.miniTxt}>
              OTP still not received? Contact us:
              <br />
              <a href="tel:+919582999555">+91 95829 99555</a> /{" "}
              <a href="tel:+919582999888">+91 95829 99888</a>
              <br />
              <a href="mailto:customercare@goodearth.in">
                customercare@goodearth.in
              </a>
            </p>
          </>
        )}
        <div
          className={cs(globalStyles.ceriseBtn, styles.btn, {
            [globalStyles.disabledBtn]: otpValue.length != 6
          })}
          onClick={otpValue.length == 6 ? verifyOtp : () => null}
        >
          Verify OTP
        </div>
        <br />
        {!boId && (
          <div className={styles.bigTxt}>
            <div className={globalStyles.pointer} onClick={changeEmail}>
              &lt; Back{" "}
            </div>
          </div>
        )}
      </>
      {isLoading && <Loader />}
    </div>
  );
};

export default EmailVerification;
