import React, { useContext } from "react";
import cs from "classnames";
import styles from "./styles.scss";
import globalStyles from "styles/global.scss";
import iconStyles from "styles/iconFonts.scss";
import bootstrapStyles from "../../../styles/bootstrap/bootstrap-grid.scss";
import geLogo from "../../../images/gelogoCerise.svg";
import { Context } from "components/Modal/context.ts";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "reducers/typings";
import { updateNextUrl } from "actions/info";

const Popup: React.FC<{ disableClose?: boolean }> = ({
  disableClose,
  children
}) => {
  const dispatch = useDispatch();
  const close = useContext(Context).closeModal;
  const closePopup = () => {
    dispatch(updateNextUrl(""));
    close();
  };
  const { popupBgUrl } = useSelector((state: AppState) => state.info);
  return (
    <div className={cs(bootstrapStyles.row, styles.row, styles.centerpage)}>
      <div
        className={cs(
          bootstrapStyles.colLg6,
          bootstrapStyles.offsetLg3,
          bootstrapStyles.colMd8,
          bootstrapStyles.offsetMd2,
          bootstrapStyles.col12,
          styles.col12,
          globalStyles.textCenter
        )}
      >
        <div
          className={cs(bootstrapStyles.row, styles.row, styles.popupImg)}
          style={{ backgroundImage: `url(${popupBgUrl})` }}
        >
          <div
            className={cs(
              bootstrapStyles.colMd8,
              bootstrapStyles.offsetMd2,
              bootstrapStyles.col12,
              styles.col12,
              globalStyles.textCenter,
              styles.popupFormBg,
              styles.popup
            )}
          >
            <div
              className={cs(styles.fixHead, bootstrapStyles.row, styles.row)}
            >
              <div
                className={cs(
                  bootstrapStyles.col10,
                  styles.col12,
                  bootstrapStyles.offset1,
                  styles.popupHeader
                )}
              >
                <img
                  src={geLogo}
                  className={cs(globalStyles.logo, styles.logoPopup)}
                />
              </div>
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
            <div className={cs(bootstrapStyles.row, styles.row, styles.mTop72)}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Popup;
