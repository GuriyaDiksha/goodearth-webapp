import React from "react";
import cl from "classnames";
import styles from "./gift.scss";
import { GiftListProps } from "./typings";
import { Currency, currencyCode } from "typings/currency";
import globalStyles from "styles/global.scss";
import iconStyles from "styles/iconFonts.scss";

const PromoItem = ({
  cardId,
  expiryDate,
  type,
  remainingAmount,
  currStatus,
  currency,
  onClose
}: GiftListProps): JSX.Element => {
  let showLocked = false;
  let showExpired = false;
  const unicode = currencyCode[currency as Currency];

  const closeResult = (code: string) => {
    onClose(code);
  };

  if (currStatus == "Locked" && type == "CNI") {
    showLocked = true;
  } else if (currStatus == "Expired" && type == "CNI") {
    showExpired = true;
  }
  return (
    <div id="gc-balance-info">
      {showExpired ? (
        <div>
          <div className={cl(styles.textLeft, styles.rtcinfo, styles.mTop0)}>
            <p className={styles.value12}>
              {cardId}{" "}
              <span
                className={styles.cross}
                onClick={() => {
                  closeResult(cardId);
                }}
              >
                <i
                  className={cl(iconStyles.icon, iconStyles.iconCrossNarrowBig)}
                ></i>
              </span>
            </p>
            error
          </div>
        </div>
      ) : (
        <div
          className={cl(styles.textLeft, styles.rtcinfo, globalStyles.voffset3)}
        >
          <span className={styles.txtup}>{cardId} </span>
          <span className={styles.textMuted}>GIFT CARD APPLIED</span>
          <span
            className={styles.cross}
            onClick={() => {
              closeResult(cardId);
            }}
          >
            <i
              className={cl(iconStyles.icon, iconStyles.iconCrossNarrowBig)}
            ></i>
          </span>
          <p className={cl(globalStyles.cerise, globalStyles.errorMsg)}>
            {" "}
            Balance amount:{" "}
            <span>
              {" "}
              {String.fromCharCode(unicode)} {remainingAmount}
              {` exipires on` + expiryDate}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default PromoItem;
