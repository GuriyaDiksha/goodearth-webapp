import React, { ReactNode, useEffect, useRef, useState } from "react";
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
  setAttempts: (x: any) => void;
  containerClassName?: string;
  headingClassName?: string;
  timerClass?: string;
  verifyCtaClass?: string;
  otpPolicyClass?: string;
  groupTimerAndAttempts?: boolean;
  goBackCta?: ReactNode;
  socialLogin?: ReactNode;
  otpAttemptClass?: string;
  uniqueId: string;
};

const NewOtpComponent: React.FC<Props> = ({
  otpSentVia,
  resendOtp,
  verifyOtp,
  errorMsg,
  attempts,
  btnText,
  startTimer,
  setAttempts,
  headingClassName,
  containerClassName,
  timerClass,
  otpPolicyClass,
  otpAttemptClass,
  verifyCtaClass,
  groupTimerAndAttempts,
  goBackCta,
  socialLogin,
  uniqueId //made this component unique in dom
}) => {
  const [timeRemaining, setTimeRemaining] = useState(90);
  const [timerId, setTimerId] = useState<any>();
  const [error, setError] = useState<(JSX.Element | string)[] | string>("");
  const [input, setInput] = useState({
    [`${uniqueId}otp1`]: "",
    [`${uniqueId}otp2`]: "",
    [`${uniqueId}otp3`]: "",
    [`${uniqueId}otp4`]: "",
    [`${uniqueId}otp5`]: "",
    [`${uniqueId}otp6`]: ""
  });
  const count = useRef(0);

  const secondsToMinutes = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;
    return minutes + ":" + seconds;
  };

  const timer = () => {
    clearInterval(timerId);
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

    return () => {
      clearTimer();
    };
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
        [`${uniqueId}otp1`]: "",
        [`${uniqueId}otp2`]: "",
        [`${uniqueId}otp3`]: "",
        [`${uniqueId}otp4`]: "",
        [`${uniqueId}otp5`]: "",
        [`${uniqueId}otp6`]: ""
      });
      setError(errorMsg);
    }
  }, [errorMsg]);

  const resetTimer = () => {
    setError("");
    setInput({
      [`${uniqueId}otp1`]: "",
      [`${uniqueId}otp2`]: "",
      [`${uniqueId}otp3`]: "",
      [`${uniqueId}otp4`]: "",
      [`${uniqueId}otp5`]: "",
      [`${uniqueId}otp6`]: ""
    });
    setAttempts({
      attempts: 0,
      maxAttemptsAllow: 5
    });
    resendOtp();
    setTimeRemaining(90);
    timer();
  };

  const onOtpChange = (e: any) => {
    const max_chars = 2;
    if (e.target.value.length < max_chars) {
      if (count.current !== 0) {
        setInput({ ...input, [`${uniqueId}otp${count?.current}`]: "" });
        count.current = 0;
      } else {
        setInput({ ...input, [e.target.name]: e.target.value });
      }
      setError("");
      if (e.target.value !== "") {
        const ele =
          typeof document == "object" &&
          document.getElementById(
            `${uniqueId}otp${+e.target.id.match(/\d+/)[0] + 1}`
          );
        if (ele) {
          ele.focus();
        }
      }
    }
  };

  const sendOtp = () => {
    verifyOtp(
      `${input?.[`${uniqueId}otp1`]}${input?.[`${uniqueId}otp2`]}${
        input?.[`${uniqueId}otp3`]
      }${input?.[`${uniqueId}otp4`]}${input?.[`${uniqueId}otp5`]}${
        input?.[`${uniqueId}otp6`]
      }`
    );
  };

  const onPasteOtp = (e: any) => {
    if (e?.clipboardData.getData("Text").match(/([e|E])/)) {
      e.preventDefault();
    } else {
      const arr = e?.clipboardData.getData("Text").split("");
      let newObj = {
        [`${uniqueId}otp1`]: "",
        [`${uniqueId}otp2`]: "",
        [`${uniqueId}otp3`]: "",
        [`${uniqueId}otp4`]: "",
        [`${uniqueId}otp5`]: "",
        [`${uniqueId}otp6`]: ""
      };
      setError("");
      arr.map((ele: string, i: number) => {
        newObj = { ...newObj, [`${uniqueId}otp${i + 1}`]: ele };
      });
      setInput(newObj);
    }
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Backspace") {
      const ele =
        typeof document == "object" &&
        document.getElementById(
          `${uniqueId}otp${+e.target.id.match(/\d+/)[0] - 1}`
        );
      if (ele) {
        ele.focus();
        count.current = +e.target.id.match(/\d+/)[0];
      }
    } else if (e.which === 69) {
      e.preventDefault();
    }
  };

  return (
    <div className={cs(containerClassName, style.otpWrp)} id={uniqueId}>
      <p className={cs(headingClassName, style.otpHeading)}>
        OTP has been sent to you via your {otpSentVia}. Please enter below:
      </p>
      <div className={style.otpInputErr}>
        <div className={style.otpInputWrp}>
          <input
            className={cs(style.otpInput, error ? style.error : "")}
            value={input[`${uniqueId}otp1`]}
            onChange={e => onOtpChange(e)}
            onPaste={e => onPasteOtp(e)}
            onKeyDown={e => handleKeyDown(e)}
            id={`${uniqueId}otp1`}
            type="number"
            name={`${uniqueId}otp1`}
            min={0}
            max={9}
          />
          <input
            className={cs(style.otpInput, error ? style.error : "")}
            value={input[`${uniqueId}otp2`]}
            onChange={e => onOtpChange(e)}
            onPaste={e => onPasteOtp(e)}
            onKeyDown={e => handleKeyDown(e)}
            id={`${uniqueId}otp2`}
            type="number"
            name={`${uniqueId}otp2`}
            min={0}
            max={9}
          />
          <input
            className={cs(style.otpInput, error ? style.error : "")}
            value={input[`${uniqueId}otp3`]}
            onChange={e => onOtpChange(e)}
            onPaste={e => onPasteOtp(e)}
            onKeyDown={e => handleKeyDown(e)}
            id={`${uniqueId}otp3`}
            type="number"
            name={`${uniqueId}otp3`}
            min={0}
            max={9}
          />
          <input
            className={cs(style.otpInput, error ? style.error : "")}
            value={input[`${uniqueId}otp4`]}
            onChange={e => onOtpChange(e)}
            onPaste={e => onPasteOtp(e)}
            onKeyDown={e => handleKeyDown(e)}
            id={`${uniqueId}otp4`}
            type="number"
            name={`${uniqueId}otp4`}
            min={0}
            max={9}
          />
          <input
            className={cs(style.otpInput, error ? style.error : "")}
            value={input[`${uniqueId}otp5`]}
            onChange={e => onOtpChange(e)}
            onPaste={e => onPasteOtp(e)}
            onKeyDown={e => handleKeyDown(e)}
            id={`${uniqueId}otp5`}
            type="number"
            name={`${uniqueId}otp5`}
            min={0}
            max={9}
          />
          <input
            className={cs(style.otpInput, error ? style.error : "")}
            value={input[`${uniqueId}otp6`]}
            onChange={e => onOtpChange(e)}
            onPaste={e => onPasteOtp(e)}
            onKeyDown={e => handleKeyDown(e)}
            id={`${uniqueId}otp6`}
            type="number"
            name={`${uniqueId}otp6`}
            min={0}
            max={9}
          />
        </div>
        {error ? <p className={style.otpError}>{error}</p> : null}
      </div>

      <p className={cs(style.otpTimer, timerClass)}>
        {timeRemaining ? (
          `Resend OTP code in: ${secondsToMinutes(timeRemaining)}s`
        ) : (
          <div className={style.otpResend}>
            DIDN’T RECEIVE OTP?{" "}
            <span onClick={() => resetTimer()}>RE-SEND OTP</span>
          </div>
        )}
      </p>
      {groupTimerAndAttempts && (
        <p className={cs(style.otpAttempt, otpAttemptClass)}>
          Attempt: {attempts?.attempts}/{attempts?.maxAttemptsAllow}
        </p>
      )}
      <button
        className={cs(
          `${style.otpBtn} ${
            `${input?.[`${uniqueId}otp1`]}${input?.[`${uniqueId}otp2`]}${
              input?.[`${uniqueId}otp3`]
            }${input?.[`${uniqueId}otp4`]}${input?.[`${uniqueId}otp5`]}${
              input?.[`${uniqueId}otp6`]
            }`.length !== 6 || attempts?.maxAttemptsAllow === attempts?.attempts
              ? style.disable
              : ""
          }`,
          verifyCtaClass
        )}
        onClick={() => sendOtp()}
        disabled={
          `${input?.[`${uniqueId}otp1`]}${input?.[`${uniqueId}otp2`]}${
            input?.[`${uniqueId}otp3`]
          }${input?.[`${uniqueId}otp4`]}${input?.[`${uniqueId}otp5`]}${
            input?.[`${uniqueId}otp6`]
          }`.length !== 6 || attempts?.maxAttemptsAllow === attempts?.attempts
        }
      >
        {btnText}
      </button>
      {!groupTimerAndAttempts && (
        <p className={cs(style.otpAttempt, otpAttemptClass)}>
          Attempt: {attempts?.attempts}/{attempts?.maxAttemptsAllow}
        </p>
      )}
      {goBackCta}
      {socialLogin}
      <a
        className={cs(style.otpPolicy, otpPolicyClass)}
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
