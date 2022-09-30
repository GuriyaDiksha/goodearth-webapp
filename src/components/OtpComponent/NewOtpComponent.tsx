import React, { useEffect, useRef, useState } from "react";
import style from "./styles.scss";
import cs from "classnames";

type Props = {
  errorMsg: (JSX.Element | string)[] | string;
  verifyOtp: (x: string) => void;
  resendOtp: () => void;
  attempts: { attempts: number; maxAttemptsAllow: number };
  otpSentVia: string;
  btnText: string;
  startTimer: boolean;
};

const NewOtpComponent: React.FC<Props> = ({
  otpSentVia,
  resendOtp,
  verifyOtp,
  errorMsg,
  attempts,
  btnText,
  startTimer
}) => {
  const [timeRemaining, setTimeRemaining] = useState(90);
  const [timerId, setTimerId] = useState<any>();
  const [error, setError] = useState<(JSX.Element | string)[] | string>("");
  const [input, setInput] = useState({
    otp1: "",
    otp2: "",
    otp3: "",
    otp4: "",
    otp5: "",
    otp6: ""
  });
  const count = useRef(0);

  const secondsToMinutes = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;
    return minutes + ":" + seconds;
  };

  const timer = () => {
    const id = setInterval(() => {
      setTimeRemaining(timeRemaining => timeRemaining - 1);
    }, 1000);
    setTimerId(id);
  };

  const clearTimer = () => {
    clearInterval(timerId);
    setTimeRemaining(0);
  };

  useEffect(() => {
    if (startTimer) {
      setTimeRemaining(90);
      timer();
    }
  }, [startTimer]);

  useEffect(() => {
    if (timeRemaining <= 0) {
      clearTimer();
    }
  }, [timeRemaining, timerId]);

  useEffect(() => {
    if (attempts?.maxAttemptsAllow === attempts?.attempts) {
      setTimeRemaining(300);
      timer();
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
      setError(errorMsg);
    }
  }, [errorMsg]);

  const resetTimer = () => {
    setError("");
    setInput({
      otp1: "",
      otp2: "",
      otp3: "",
      otp4: "",
      otp5: "",
      otp6: ""
    });
    resendOtp();
    setTimeRemaining(90);
    timer();
  };

  const onOtpChange = (e: any) => {
    const max_chars = 2;
    if (e.target.value.length < max_chars) {
      if (count.current !== 0) {
        setInput({ ...input, [`otp${count?.current}`]: "" });
        count.current = 0;
      } else {
        setInput({ ...input, [e.target.name]: e.target.value });
      }
      setError("");
      if (e.target.value !== "") {
        const ele =
          typeof document == "object" &&
          document.getElementById(`otp${+e.target.id.match(/\d+/)[0] + 1}`);
        if (ele) {
          ele.focus();
        }
      }
    }
  };

  const sendOtp = () => {
    verifyOtp(
      `${input?.otp1}${input?.otp2}${input?.otp3}${input?.otp4}${input?.otp5}${input?.otp6}`
    );
  };

  const onPasteOtp = (e: any) => {
    const arr = e?.clipboardData.getData("Text").split("");
    let newObj = {
      otp1: "",
      otp2: "",
      otp3: "",
      otp4: "",
      otp5: "",
      otp6: ""
    };
    setError("");
    arr.map((ele: number, i: number) => {
      newObj = { ...newObj, [`otp${i + 1}`]: ele };
    });
    setInput(newObj);
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Backspace") {
      const ele =
        typeof document == "object" &&
        document.getElementById(`otp${+e.target.id.match(/\d+/)[0] - 1}`);
      if (ele) {
        ele.focus();
        count.current = +e.target.id.match(/\d+/)[0];
      }
    }
  };

  return (
    <div className={style.otpWrp}>
      <p className={style.otpHeading}>
        OTP has been sent to you via your {otpSentVia}. Please enter below:
      </p>
      <div className={style.otpInputErr}>
        <div className={style.otpInputWrp}>
          <input
            className={cs(style.otpInput, error ? style.error : "")}
            value={input["otp1"]}
            onChange={e => onOtpChange(e)}
            onPaste={e => onPasteOtp(e)}
            onKeyDown={e => handleKeyDown(e)}
            id="otp1"
            type="number"
            name="otp1"
            min={0}
            max={9}
          />
          <input
            className={cs(style.otpInput, error ? style.error : "")}
            value={input["otp2"]}
            onChange={e => onOtpChange(e)}
            onPaste={e => onPasteOtp(e)}
            onKeyDown={e => handleKeyDown(e)}
            id="otp2"
            type="number"
            name="otp2"
            min={0}
            max={9}
          />
          <input
            className={cs(style.otpInput, error ? style.error : "")}
            value={input["otp3"]}
            onChange={e => onOtpChange(e)}
            onPaste={e => onPasteOtp(e)}
            onKeyDown={e => handleKeyDown(e)}
            id="otp3"
            type="number"
            name="otp3"
            min={0}
            max={9}
          />
          <input
            className={cs(style.otpInput, error ? style.error : "")}
            value={input["otp4"]}
            onChange={e => onOtpChange(e)}
            onPaste={e => onPasteOtp(e)}
            onKeyDown={e => handleKeyDown(e)}
            id="otp4"
            type="number"
            name="otp4"
            min={0}
            max={9}
          />
          <input
            className={cs(style.otpInput, error ? style.error : "")}
            value={input["otp5"]}
            onChange={e => onOtpChange(e)}
            onPaste={e => onPasteOtp(e)}
            onKeyDown={e => handleKeyDown(e)}
            id="otp5"
            type="number"
            name="otp5"
            min={0}
            max={9}
          />
          <input
            className={cs(style.otpInput, error ? style.error : "")}
            value={input["otp6"]}
            onChange={e => onOtpChange(e)}
            onPaste={e => onPasteOtp(e)}
            onKeyDown={e => handleKeyDown(e)}
            id="otp6"
            type="number"
            name="otp6"
            min={0}
            max={9}
          />
        </div>
        {error ? <p className={style.otpError}>{error}</p> : null}
      </div>

      <p className={style.otpTimer}>
        {timeRemaining ? (
          `Resend OTP code in: ${secondsToMinutes(timeRemaining)}s`
        ) : (
          <div className={style.otpResend}>
            DIDN’T RECEIVE OTP?{" "}
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
            .length !== 6 || attempts?.maxAttemptsAllow === attempts?.attempts
        }
      >
        {btnText}
      </button>
      <p className={style.otpAttempt}>
        Attempt: {attempts?.attempts}/{attempts?.maxAttemptsAllow}
      </p>
      <a
        className={style.otpPolicy}
        href={`/customer-assistance/privacy-policy`}
        rel="noopener noreferrer"
        target="_blank"
      >
        View Privacy Policy
      </a>
    </div>
  );
};

export default NewOtpComponent;
