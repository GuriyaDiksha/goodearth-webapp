import { connect } from "react-redux";
import mapDispatchToProps from "./mapper/actions";
import { RouteComponentProps, useLocation, withRouter } from "react-router";
import React, { useContext, useState } from "react";
import cs from "classnames";
// import iconStyles from "../../styles/iconFonts.scss";
import bootstrapStyles from "../../../styles/bootstrap/bootstrap-grid.scss";
// import { LoginProps } from "./typings";
// import * as Steps from "../constants";
import styles from "../styles.scss";
import globalStyles from "styles/global.scss";
import loadable from "@loadable/component";
import Popup from "../popup/Popup";

const MainLogin = loadable(() => import("components/signin/Login/mainLogin"));
import { verifyEmailResponse } from "services/login/typings";
import { NavLink } from "react-router-dom";
import { Context } from "components/Modal/context";
const CheckoutRegisterForm = loadable(() =>
  import("components/signin/register/checkoutRegister")
);
type Props = (verifyEmailResponse | undefined) & RouteComponentProps;
const LoginForm: React.FC<Props> = props => {
  const [isRegister, setIsRegister] = useState(false);

  const goToRegister = () => {
    setIsRegister(true);
  };

  const changeEmail = () => {
    setIsRegister(false);
    localStorage.removeItem("tempEmail");
  };

  const nextStep = () => {
    // code for after login
  };
  const { search } = useLocation();
  const urlParams = new URLSearchParams(search);
  const id = urlParams.get("loginpopup");
  // if(res.alreadyActive || res.expired) {
  //   if(res.alreadyLoggedIn) {
  //     // handle
  //   } else {
  //     // handle
  //   }
  // }

  const { closeModal } = useContext(Context);
  const ExpiredLoggedIn = (
    <>
      <div className={cs(styles.para, globalStyles.marginT50)}>
        <p>
          Sorry, the link is expired. It looks like you are already logged in!
        </p>
      </div>
      <div className={cs(globalStyles.ceriseBtn, styles.bigBtn)}>
        <NavLink to="/" onClick={closeModal}>
          continue shopping
        </NavLink>
      </div>
    </>
  );

  return (
    <Popup>
      <div className={cs(bootstrapStyles.col10, bootstrapStyles.offset1)}>
        <div>
          {isRegister ? (
            <CheckoutRegisterForm
              nextStep={nextStep}
              changeEmail={changeEmail}
            />
          ) : props && (props.alreadyActive || props.expired) ? (
            props.alreadyLoggedIn ? (
              ExpiredLoggedIn
            ) : (
              <MainLogin
                showRegister={goToRegister}
                nextStep={nextStep}
                isBo={""}
                heading={""}
                heading2={"Sorry, the link is expired."}
                subHeading="Enter your email address to register or sign in."
              />
            )
          ) : (
            <MainLogin
              showRegister={goToRegister}
              nextStep={nextStep}
              isBo={""}
              heading={"Welcome"}
              subHeading={
                id == "cerise"
                  ? "Please enter your registered e-mail address to login to your Cerise account."
                  : "Enter your email address to register or sign in."
              }
            />
          )}
        </div>
      </div>
    </Popup>
  );
};

const LoginFormRoute = withRouter(LoginForm);
export default connect(mapDispatchToProps)(LoginFormRoute);
