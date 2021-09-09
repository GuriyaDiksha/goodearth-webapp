import React, { useState, useEffect, useContext } from "react";
import cs from "classnames";
// styles
import styles from "../styles.scss";
import globalStyles from "styles/global.scss";
// services
import LoginService from "services/login";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { Context } from "components/Modal/context";

type Props = {
  email: string;
  changeEmail: (event: any) => void;
};
const EmailVerification: React.FC<Props> = ({ email, changeEmail }) => {
  const [enableBtn, setEnableBtn] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [showCustCare, setShowCustCare] = useState(false);
  const [timerId, setTimerId] = useState<any>();
  const [alreadyVerified, setAlreadyVerified] = useState(false);

  const dispatch = useDispatch();
  const timer = () => {
    setTimeRemaining(60);
    setEnableBtn(false);
    const id = setInterval(() => {
      setTimeRemaining(timeRemaining => timeRemaining - 1);
    }, 1000);
    setTimerId(id);
  };

  const sendEmail = async () => {
    try {
      const res = await LoginService.sendVerificationEmail(dispatch, email);
      if (res.success) {
        // handle success
      } else if (res.alreadyVerified) {
        setAlreadyVerified(true);
      }
      timer();
    } catch (err) {
      console.log(err);
      setShowCustCare(true);
    } finally {
      setShowCustCare(true);
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

  useEffect(() => {
    timer();
    return () => {
      clearTimer();
    };
  }, []);

  const { closeModal } = useContext(Context);
  const secondsToMinutes = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;
    return minutes + ":" + seconds;
  };
  return alreadyVerified ? (
    <>
      <div className={cs(styles.para, globalStyles.marginT50)}>
        <p>Seems like you have already verified your email.</p>
      </div>
      <div className={cs(globalStyles.ceriseBtn, styles.bigBtn)}>
        <NavLink to="/" onClick={closeModal}>
          continue shopping
        </NavLink>
      </div>
    </>
  ) : (
    <>
      <div className={styles.formHeading}>Welcome</div>
      <div className={styles.para}>
        <p>
          We&apos;ve emailed you a verification link to <strong>{email}</strong>
        </p>
        <p>It will expire shortly, so verify soon.</p>
        <br />
        <p>Remember to check spam folder.</p>
        <br />
      </div>
      <div
        className={cs(globalStyles.ceriseBtn, styles.btn, {
          [globalStyles.disabledBtn]: !enableBtn
        })}
        onClick={enableBtn ? sendEmail : () => null}
      >
        Resend Email
      </div>
      <p className={styles.smallTxt}>
        Didn&apos;t receive an email? Resend it in{" "}
        {secondsToMinutes(timeRemaining)}
      </p>
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
        Change Email Address? <a onClick={changeEmail}>Sign Up</a>
      </div>
    </>
  );
};

export default EmailVerification;
