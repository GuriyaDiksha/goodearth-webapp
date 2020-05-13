import React, { useContext } from "react";
import cs from "classnames";
import styles from "./styles.scss";
import globalStyles from "styles/global.scss";
import iconStyles from "styles/iconFonts.scss";
import bootstrapStyles from "../../../styles/bootstrap/bootstrap-grid.scss";
import geLogo from "../../../images/gelogoCerise.svg";
import { Context } from "components/Modal/context.ts";

const Popup: React.FC = ({ children }) => {
  const closePopup = useContext(Context).closeModal;
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
        <div className={cs(bootstrapStyles.row, styles.row, styles.popupImg)}>
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
              {/* <span className={cs(styles.closePopup, "hidden-xs", "hidden-sm")} onClick={() => closePopup()} >
                                <i className={cs(iconStyles.icon, iconStyles.iconCross)}></i>
                            </span> */}

              <div
                className={cs(
                  bootstrapStyles.col10,
                  styles.col12,
                  bootstrapStyles.offset1,
                  styles.popupHeader
                )}
              >
                {/* <span className={cs(styles.closePopup, "hidden-md", "hidden-lg")} onClick={() => closePopup()} >
                                    <i className={cs(iconStyles.icon, iconStyles.iconCross)}></i>
                                </span> */}
                <img
                  src={geLogo}
                  className={cs(globalStyles.logo, styles.logoPopup)}
                />
              </div>
              <button
                className={cs(
                  styles.closePopup,
                  iconStyles.icon,
                  iconStyles.iconCross
                )}
                onClick={() => closePopup()}
              ></button>
            </div>
            <div className={cs(bootstrapStyles.row, styles.row, styles.mTop60)}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Popup;
