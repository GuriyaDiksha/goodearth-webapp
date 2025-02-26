import React, { useContext, useState } from "react";
import cs from "classnames";
import styles from "./styles.scss";
import globalStyles from "styles/global.scss";
import iconStyles from "styles/iconFonts.scss";
import bootstrapStyles from "../../../styles/bootstrap/bootstrap-grid.scss";
import geLogo from "../../../images/gelogoCerise.svg";
import { Context } from "components/Modal/context";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "reducers/typings";
import { updateNextUrl } from "actions/info";
import { useLocation, useHistory } from "react-router";
import { Link } from "react-router-dom";

const Popup: React.FC<{
  disableClose?: boolean;
  setUpdateProfilePhoneNo?: any;
}> = ({ disableClose, setUpdateProfilePhoneNo, children }) => {
  const dispatch = useDispatch();
  const close = useContext(Context).closeModal;
  const [isSuccessMsg, setIsSuccessMsg] = useState(false);

  const location = useLocation();
  const history = useHistory();

  const closePopup = () => {
    dispatch(updateNextUrl(""));
    close();
    setUpdateProfilePhoneNo && setUpdateProfilePhoneNo();
  };
  const { popupBgUrl } = useSelector((state: AppState) => state.info);

  return (
    <div className={cs(bootstrapStyles.row, styles.row, styles.centerpage)}>
      <div className={cs(globalStyles.textCenter)}>
        <div
          className={cs(bootstrapStyles.row, styles.row, styles.popupImg)}
          style={{ backgroundImage: `url(${popupBgUrl})` }}
        >
          <div className={cs(styles.popupFormBg, styles.popup)}>
            <div
              className={cs(styles.fixHead, bootstrapStyles.row, styles.row)}
            >
              <div className={styles.header}>
                {/* Only login pop up on Giftcard page will have link in logo */}
                {/* {location.pathname == "/giftcard" ? (
                  <Link
                    to=""
                    onClick={() => {
                      closePopup();
                      history.push("/");
                    }}
                  >
                    <img
                      alt="goodearth-logo"
                      src={geLogo}
                      className={cs(globalStyles.logo)}
                      style={{
                        height: "70px"
                      }}
                    />
                  </Link>
                ) : ( */}
                <img
                  alt="goodearth-logo"
                  src={geLogo}
                  className={cs(globalStyles.logo)}
                  style={{
                    height: "70px"
                  }}
                />
                {/* )} */}

                {/* {disableClose || location.pathname == "/giftcard1" ? null : ( */}
                {!disableClose && (
                  <button
                    className={cs(
                      styles.closePopup,
                      iconStyles.icon,
                      iconStyles.iconCross
                    )}
                    onClick={closePopup}
                  ></button>
                )}
              </div>
            </div>
            <div
              className={cs(styles.childrenContainer, {
                [styles.isSuccessMsg]: isSuccessMsg
              })}
              id="email-verification-container"
            >
              {React.cloneElement(children as React.ReactElement<any>, {
                setIsSuccessMsg
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Popup;
