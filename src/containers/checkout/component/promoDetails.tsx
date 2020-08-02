import React from "react";
import cl from "classnames";
import styles from "./gift.scss";
import { PromoListProps } from "./typings";
import globalStyles from "styles/global.scss";
import iconStyles from "styles/iconFonts.scss";

const PromoItem = ({ code, onClose }: PromoListProps): JSX.Element => {
  // let showLocked = false;
  const showExpired = false;

  const closeResult = (code: string) => {
    onClose(code);
  };

  return (
    <div id="gc-balance-info">
      {showExpired ? (
        <div>
          <div className={cl(styles.textLeft, styles.rtcinfo, styles.mTop0)}>
            <p className={styles.value12}>
              {code}{" "}
              <span
                className={styles.cross}
                onClick={() => {
                  closeResult(code);
                }}
              >
                <i
                  className={cl(iconStyles.icon, iconStyles.iconCrossNarrowBig)}
                ></i>
              </span>
            </p>
          </div>
        </div>
      ) : (
        <div
          className={cl(styles.textLeft, styles.rtcinfo, globalStyles.voffset3)}
        >
          <span className={styles.txtup}>{code} </span>
          <span className={styles.textMuted}>PROMO CARD APPLIED</span>
          <span
            className={styles.cross}
            onClick={() => {
              closeResult(code);
            }}
          >
            <i
              className={cl(iconStyles.icon, iconStyles.iconCrossNarrowBig)}
            ></i>
          </span>
        </div>
      )}
    </div>
  );
};

export default PromoItem;
