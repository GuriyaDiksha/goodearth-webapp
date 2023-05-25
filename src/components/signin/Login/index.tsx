import { connect, useSelector } from "react-redux";
import mapDispatchToProps from "./mapper/actions";
import { useHistory, useLocation, withRouter } from "react-router";
import React, { useEffect, useState } from "react";
import loadable from "@loadable/component";
import Popup from "../popup/Popup";
import { AppState } from "reducers/typings";

const MainLogin = loadable(() => import("components/signin/Login/mainLogin"));
const CheckoutRegisterForm = loadable(() =>
  import("components/signin/register/checkoutRegister")
);

const LoginForm = (props: any) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const history = useHistory();
  const { nextUrl } = useSelector((state: AppState) => state.info);

  useEffect(() => {
    if (props.isRegister) {
      setIsRegister(true);
    }
  }, []);

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
    if (nextUrl) {
      history.push(nextUrl);
    }
  };
  const { search } = useLocation();
  const urlParams = new URLSearchParams(search);
  const id = urlParams.get("loginpopup");
  const boId = urlParams.get("bo_id");

  return (
    <Popup>
      {isRegister ? (
        <CheckoutRegisterForm
          nextStep={nextStep}
          changeEmail={changeEmail}
          goToLogin={goLogin}
          setEmail={setEmail}
          email={email || props.email}
        />
      ) : (
        <MainLogin
          showRegister={goToRegister}
          nextStep={nextStep}
          isBo={boId}
          isCerise={id == "cerise"}
          setEmail={setEmail}
          email={email}
          // heading={"Welcome"}
          // subHeading={
          //   id == "cerise"
          //     ? "Please enter your registered e-mail address to login to your Cerise account."
          //     : "Enter your email address to register or sign in."
          // }
        />
      )}
    </Popup>
  );
};

const LoginFormRoute = withRouter(LoginForm);
export default connect(mapDispatchToProps)(LoginFormRoute);
