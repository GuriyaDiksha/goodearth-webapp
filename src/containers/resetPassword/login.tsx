import { useHistory } from "react-router";
import React, { useState } from "react";
import cs from "classnames";
import bootstrapStyles from "../../styles/bootstrap/bootstrap-grid.scss";
import loadable from "@loadable/component";
import { useEffect } from "react";

const MainLogin = loadable(() => import("components/signin/Login/mainLogin"));
const CheckoutRegisterForm = loadable(() =>
  import("components/signin/register/checkoutRegister")
);

const LoginForm: React.FC<{ redirectTo: string }> = ({ redirectTo }) => {
  const [isRegister, setIsRegister] = useState(false);
  const history = useHistory();

  const urlParams = new URLSearchParams(history.location.search);
  const id = urlParams.get("loginpopup");

  const goToRegister = () => {
    setIsRegister(true);
  };

  const changeEmail = () => {
    setIsRegister(false);
    localStorage.removeItem("tempEmail");
  };

  const goLogin = () => {
    setIsRegister(false);
  };

  const nextStep = () => {
    // code for after login
    // history.push(redirectTo || "/");
    if (redirectTo.split("=")?.[1]) {
      history.push(redirectTo || "");
      localStorage.setItem("from", "cart");
    } else {
      history.push(redirectTo || "/");
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className={cs(bootstrapStyles.col12)}>
      <div>
        {isRegister ? (
          <CheckoutRegisterForm
            nextStep={nextStep}
            changeEmail={changeEmail}
            goToLogin={goLogin}
          />
        ) : (
          <MainLogin
            showRegister={goToRegister}
            nextStep={nextStep}
            isBo={true}
            isCerise={id == "cerise"}
            heading={"Welcome"}
            subHeading={
              id == "cerise"
                ? "Please enter your registered e-mail address to login to your Cerise account."
                : "Please enter the New Password to Sign in!"
            }
            source="password-reset"
          />
        )}
      </div>
    </div>
  );
};

export default LoginForm;
