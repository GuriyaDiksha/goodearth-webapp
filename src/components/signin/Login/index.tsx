import { connect } from "react-redux";
import mapDispatchToProps from "./mapper/actions";
import { useLocation, withRouter } from "react-router";
import React, { useState } from "react";
import cs from "classnames";
// import iconStyles from "../../styles/iconFonts.scss";
import bootstrapStyles from "../../../styles/bootstrap/bootstrap-grid.scss";
// import { LoginProps } from "./typings";
// import * as Steps from "../constants";
import styles from "../styles.scss";
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
  };

  const nextStep = () => {
    // code for after login
  };
  const { search } = useLocation();
  const urlParams = new URLSearchParams(search);
  const id = urlParams.get("loginpopup");
  return (
    <Popup>
      <div className={cs(bootstrapStyles.col10, bootstrapStyles.offset1)}>
        <div className={styles.formHeading}>Welcome</div>
        <div className={styles.formSubheading}>
          {isRegister
            ? "Please Enter Your Email To Register"
            : id == "cerise"
            ? "Please enter your registered e-mail address to login to your Cerise account."
            : "Enter your email address to register or sign in."}
        </div>

        <div>
          {isRegister ? (
            <CheckoutRegisterForm
              nextStep={nextStep}
              changeEmail={changeEmail}
            />
          ) : (
            <MainLogin
              showRegister={goToRegister}
              nextStep={nextStep}
              isBo={""}
            />
          )}
        </div>
      </div>
    </Popup>
  );
};

const LoginFormRoute = withRouter(LoginForm);
export default connect(mapDispatchToProps)(LoginFormRoute);
