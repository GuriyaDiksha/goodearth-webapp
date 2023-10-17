import React from "react";
import cs from "classnames";
import styles from "./styles.scss";
import { useSelector, useDispatch } from "react-redux";
import { AppState } from "reducers/typings";
import { Dispatch } from "redux";
import LoginService from "services/login";
import { updateNextUrl } from "actions/info";

const RegisteryDockcta: React.FC = () => {
  const { isLoggedIn, bridalId } = useSelector((state: AppState) => state.user);
  const dispatch = useDispatch();
  const ctaClicked = (dispatch: Dispatch, nextUrl?: string) => {
    LoginService.showLogin(dispatch);
    nextUrl && dispatch(updateNextUrl(nextUrl));
  };
  return (
    <div>
      {isLoggedIn ? (
        <div className="loginUser">
          <span className={cs(styles.dockText)}>
            Hi, let’s get started with your Registry! &nbsp;&nbsp;&nbsp;{" "}
          </span>
          {bridalId == 0 ? (
            <span className={cs(styles.dockCta)}>
              <a href="/account/bridal">CREATE MY REGISTRY</a>
            </span>
          ) : (
            <span className={cs(styles.dockCta)}>
              <a href="/account/bridal">VIEW MY REGISTRY</a>
            </span>
          )}
        </div>
      ) : (
        <div className="nonLoginUser">
          <span className={cs(styles.dockText)}>
            Sign up or login to get started with your Registry!
            &nbsp;&nbsp;&nbsp;{" "}
          </span>
          <span
            className={cs(styles.dockCta)}
            onClick={() => ctaClicked(dispatch, "/account/bridal")}
          >
            SIGN UP / LOGIN
          </span>
        </div>
      )}
    </div>
  );
};

export default RegisteryDockcta;
