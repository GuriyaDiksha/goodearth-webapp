import React from "react";
import style from "./styles.scss";

const NewOtpComponent = () => {
  return (
    <div className={style.otpWrp}>
      <p className={style.otpHeading}>
        OTP has been sent to you via your mobile number. Please enter below:
      </p>

      <div className={style.otpInputWrp}>
        <input className={style.otpInput} type="number" />
        <input className={style.otpInput} type="number" />
        <input className={style.otpInput} type="number" />
        <input className={style.otpInput} type="number" />
        <input className={style.otpInput} type="number" />
        <input className={style.otpInput} type="number" />
      </div>

      <p className={style.otpTimer}>Resend OTP code in: 2:50s</p>
      <button className={style.otpBtn}>Send</button>
      <p className={style.otpAttempt}>Attempt: 0/5</p>
      <a className={style.otpPolicy}>View Privacy Policy</a>
    </div>
  );
};

export default NewOtpComponent;
