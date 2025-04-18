import React, { useEffect, useLayoutEffect } from "react";
import globalStyles from "styles/global.scss";
import { useHistory } from "react-router";
import mobileImg from "../../images/404mobile.jpg";
import desktopMobile from "../../images/404desktop.jpg";
import { AppState } from "reducers/typings";
import { useSelector } from "react-redux";
import { pageViewGTM } from "utils/validate";

const ErrorPage: React.FC = () => {
  const history = useHistory();
  const { mobile } = useSelector((state: AppState) => state.device);
  const canUseDOM = !!(
    typeof window !== "undefined" &&
    typeof window.document !== "undefined" &&
    typeof window.document.createElement !== "undefined"
  );

  const useIsomorphicLayoutEffect = canUseDOM ? useLayoutEffect : useEffect;

  useIsomorphicLayoutEffect(() => {
    pageViewGTM("Error");
    setTimeout(() => {
      if (history.location.pathname === "/error-page") {
        history.push("/");
      }
    }, 3000);
  }, []);

  return (
    <div className={globalStyles.col12}>
      <img
        alt="404-page"
        src={mobile ? mobileImg : desktopMobile}
        className={globalStyles.imgResponsive}
      ></img>
    </div>
  );
};

export default ErrorPage;
