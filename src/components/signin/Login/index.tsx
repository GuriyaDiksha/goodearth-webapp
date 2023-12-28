import { connect, useDispatch, useSelector } from "react-redux";
import mapDispatchToProps from "./mapper/actions";
import { useHistory, useLocation, withRouter } from "react-router";
import React, { useEffect, useState } from "react";
import loadable from "@loadable/component";
import Popup from "../popup/Popup";
import { AppState } from "reducers/typings";
import { updateNextUrl } from "actions/info";
import { updateComponent, updateModal } from "actions/modal";
import { POPUP } from "constants/components";
import ModalStyles from "components/Modal/styles.scss";

const MainLogin = loadable(() => import("components/signin/Login/mainLogin"));
const CheckoutRegisterForm = loadable(() =>
  import("components/signin/register/checkoutRegister")
);

const LoginForm = (props: any) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const { nextUrl } = useSelector((state: AppState) => state.info);
  const { mobile } = useSelector((state: AppState) => state.device);
  const history = useHistory();
  const { search, pathname } = useLocation();
  const urlParams = new URLSearchParams(search);
  const id = urlParams.get("loginpopup");
  // const boId = urlParams.get("bo_id");
  const dispatch = useDispatch();

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
    if (pathname.startsWith("/password-reset")) {
      history.push("/");
    }
    if (nextUrl) {
      // if (boId && nextUrl === "/order/checkout") {
      //   props.history.push({
      //     pathname: nextUrl,
      //     search: `?bo_id=${boId}`,
      //     state: { from: "cart" }
      //   });
      //   localStorage.setItem("from", "cart");
      // } else {
      //}

      if (nextUrl === "/wishlist") {
        dispatch(
          updateComponent(
            POPUP.SHAREWISHLIST,
            null,
            mobile ? false : true,
            mobile ? ModalStyles.bottomAlignSlideUp : "",
            mobile ? "slide-up-bottom-align" : ""
          )
        );
        dispatch(updateModal(true));
      } else {
        history.push(nextUrl);
      }
      dispatch(updateNextUrl(""));
    }
  };

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
          isBo={false}
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
