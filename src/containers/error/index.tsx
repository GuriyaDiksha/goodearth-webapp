import React, { useLayoutEffect } from "react";
import globalStyles from "styles/global.scss";
import { useHistory } from "react-router";
import mobileImg from "../../images/404mobile.jpg";
import desktopMobile from "../../images/404desktop.jpg";
import { AppState } from "reducers/typings";
import { useSelector } from "react-redux";
import * as util from "utils/validate";

const ErrorPage: React.FC = () => {
  const history = useHistory();
  const { mobile } = useSelector((state: AppState) => state.device);

  useLayoutEffect(() => {
    util.pageViewGTM("Error");
    setTimeout(() => {
      history.push("/");
    }, 3000);
  }, []);

  return (
    <div className={globalStyles.col12}>
      <img
        src={mobile ? mobileImg : desktopMobile}
        className={globalStyles.imgResponsive}
      ></img>
    </div>
  );
};

export default ErrorPage;
