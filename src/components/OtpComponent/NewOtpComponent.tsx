import React, { useEffect, useState } from "react";
import style from "./styles.scss";

type Props = {
  errorMsg: (JSX.Element | string)[] | string;
  verifyOtp: (x: string) => void;
  resendOtp: () => void;
  attempts: { attempts: number; maxAttemptsAllow: number };
  setAttempts: (x: any) => void;
  otpSentVia: string;
  btnText: string;
};

const NewOtpComponent: React.FC<Props> = ({
  otpSentVia,
  resendOtp,
  verifyOtp,
  errorMsg,
  attempts,
  setAttempts,
  btnText
}) => {
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [input, setInput] = useState({
    otp1: "",
    otp2: "",
    otp3: "",
    otp4: "",
    otp5: "",
    otp6: ""
  });

  const secondsToMinutes = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;
    return minutes + ":" + seconds;
  };

  const timer = (time: number) => {
    setTimeRemaining(time);
    setInterval(() => {
      setTimeRemaining(timeRemaining => timeRemaining - 1);
    }, 1000);
  };

  const clearTimer = () => {
    clearInterval(0);
    setTimeRemaining(0);
    if (attempts?.maxAttemptsAllow === attempts?.attempts) {
      setAttempts({
        attempts: 0,
        maxAttemptsAllow: 5
      });
    }
  };

  useEffect(() => {
    timer(60);
  }, []);

  useEffect(() => {
    if (timeRemaining <= 0) {
      clearTimer();
    }
  }, [timeRemaining]);

  useEffect(() => {
    if (attempts?.maxAttemptsAllow === attempts?.attempts) {
      timer(60);
    }
  }, [attempts?.attempts]);

  useEffect(() => {
    if (errorMsg) {
      setInput({
        otp1: "",
        otp2: "",
        otp3: "",
        otp4: "",
        otp5: "",
        otp6: ""
      });
    }
  }, [errorMsg]);

  const resetTimer = () => {
    resendOtp();
    setTimeRemaining(60);
    timer(60);
  };

  const onOtpChange = (e: any) => {
    const max_chars = 2;

    if (e.target.value.length < max_chars) {
      setInput({ ...input, [e.target.name]: e.target.value });
      const ele =
        typeof document == "object" &&
        document.getElementById(`otp${+e.target.id.match(/\d+/)[0] + 1}`);
      if (ele) {
        ele.focus();
      }
    }
  };

  const sendOtp = () => {
    verifyOtp(
      `${input?.otp1}${input?.otp2}${input?.otp3}${input?.otp4}${input?.otp5}${input?.otp6}`
    );
  };

  return (
    <div className={style.otpWrp}>
      <p className={style.otpHeading}>
        OTP has been sent to you via your {otpSentVia}. Please enter below:
      </p>

      <div className={style.otpInputWrp}>
        <input
          className={style.otpInput}
          value={input["otp1"]}
          onChange={e => onOtpChange(e)}
          id="otp1"
          type="number"
          name="otp1"
          min={0}
          max={9}
        />
        <input
          className={style.otpInput}
          value={input["otp2"]}
          onChange={e => onOtpChange(e)}
          id="otp2"
          type="number"
          name="otp2"
          min={0}
          max={9}
        />
        <input
          className={style.otpInput}
          value={input["otp3"]}
          onChange={e => onOtpChange(e)}
          id="otp3"
          type="number"
          name="otp3"
          min={0}
          max={9}
        />
        <input
          className={style.otpInput}
          value={input["otp4"]}
          onChange={e => onOtpChange(e)}
          id="otp4"
          type="number"
          name="otp4"
          min={0}
          max={9}
        />
        <input
          className={style.otpInput}
          value={input["otp5"]}
          onChange={e => onOtpChange(e)}
          id="otp5"
          type="number"
          name="otp5"
          min={0}
          max={9}
        />
        <input
          className={style.otpInput}
          value={input["otp6"]}
          onChange={e => onOtpChange(e)}
          id="otp6"
          type="number"
          name="otp6"
          min={0}
          max={9}
        />
      </div>
      {errorMsg || attempts?.maxAttemptsAllow === attempts?.attempts ? (
        <p className={style.otpError}>
          {attempts?.maxAttemptsAllow === attempts?.attempts
            ? "Maximum attempts reached. Please request for a new OTP after 5 mins"
            : errorMsg}
        </p>
      ) : null}

      <p className={style.otpTimer}>
        {timeRemaining ? (
          `Resend OTP code in: ${secondsToMinutes(timeRemaining)}s`
        ) : (
          <div className={style.otpResend}>
            DIDN’T RECEIVE OTP ?{" "}
            <span onClick={() => resetTimer()}>RE-SEND OTP</span>
          </div>
        )}
      </p>
      <button
        className={`${style.otpBtn} ${
          `${input?.otp1}${input?.otp2}${input?.otp3}${input?.otp4}${input?.otp5}${input?.otp6}`
            .length !== 6 || attempts?.maxAttemptsAllow === attempts?.attempts
            ? style.disable
            : ""
        }`}
        onClick={() => sendOtp()}
        disabled={
          `${input?.otp1}${input?.otp2}${input?.otp3}${input?.otp4}${input?.otp5}${input?.otp6}`
            .length !== 6 ||
          attempts?.maxAttemptsAllow === attempts?.attempts ||
          errorMsg !== ""
        }
      >
        {btnText}
      </button>
      <p className={style.otpAttempt}>
        Attempt: {attempts?.attempts}/{attempts?.maxAttemptsAllow}
      </p>
      <a
        className={style.otpPolicy}
        href={`${window.location.hostname}/customer-assistance/cookie-policy`}
        rel="noopener noreferrer"
        target="_blank"
      >
        View Privacy Policy
      </a>
    </div>
  );
};

export default NewOtpComponent;
