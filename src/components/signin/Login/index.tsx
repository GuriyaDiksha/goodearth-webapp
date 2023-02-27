import { connect } from "react-redux";
import mapDispatchToProps from "./mapper/actions";
import { useLocation, withRouter } from "react-router";
import React, { useState } from "react";
import loadable from "@loadable/component";
import Popup from "../popup/Popup";

const MainLogin = loadable(() => import("components/signin/Login/mainLogin"));
const CheckoutRegisterForm = loadable(() =>
  import("components/signin/register/checkoutRegister")
);
const LoginForm: React.FC<{}> = props => {
  const [isRegister, setIsRegister] = useState(false);

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
  };
  const { search } = useLocation();
  const urlParams = new URLSearchParams(search);
  const id = urlParams.get("loginpopup");
  return (
    <Popup>
      <div>
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
              isBo={""}
              isCerise={id == "cerise"}
              // heading={"Welcome"}
              // subHeading={
              //   id == "cerise"
              //     ? "Please enter your registered e-mail address to login to your Cerise account."
              //     : "Enter your email address to register or sign in."
              // }
            />
          )}
        </div>
      </div>
    </Popup>
  );
};

const LoginFormRoute = withRouter(LoginForm);
export default connect(mapDispatchToProps)(LoginFormRoute);
