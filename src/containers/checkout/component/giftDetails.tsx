import React from "react";
import cl from "classnames";
import styles from "./gift.scss";
import { GiftListProps } from "./typings";
import { Currency, currencyCode } from "typings/currency";
import globalStyles from "styles/global.scss";
import iconStyles from "styles/iconFonts.scss";

const GiftCardItem = ({
  cardId,
  expiryDate,
  type,
  remainingAmount,
  currStatus,
  currency,
  cardType,
  onClose
}: GiftListProps): JSX.Element => {
  let showLocked = false;
  let showExpired = false;
  const unicode = currencyCode[currency as Currency];
  const conditionalRefresh = false;
  const deleteCard = (code: string) => {
    // setOpenState(!menuOpen);
    console.log(showLocked);
  };

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
                  className={cl(
                    iconStyles.icon,
                    iconStyles.iconCrossNarrowBig,
                    styles.promoIcon
                  )}
                ></i>
              </span>
            </p>
            <p>
              <span className={styles.op2}> Date of issue: </span>{" "}
              <span className={styles.fontBold}> {} </span>
            </p>
            <p>
              <span className={styles.op2}> Date of expiry: </span>{" "}
              <span className={styles.fontBold}> {} </span>
            </p>
            {conditionalRefresh && (
              <span
                className={cl(styles.colorPrimary, globalStyles.pointer)}
                onClick={() => {
                  deleteCard(cardId);
                }}
              >
                <a
                  className={cl(
                    globalStyles.cerise,
                    globalStyles.pointer,
                    globalStyles.linkTextUnderline
                  )}
                >
                  Refresh
                </a>
              </span>
            )}
          </div>
        </div>
      ) : (
        <div
          className={cl(styles.textLeft, styles.rtcinfo, globalStyles.voffset3)}
        >
          <span className={styles.txtup}>{cardId} </span>
          <span className={styles.textMuted}>
            {cardType == "CREDITNOTE"
              ? "CREDIT NOTE APPLIED"
              : "GIFT CARD APPLIED"}
          </span>
          <span
            className={styles.cross}
            onClick={() => {
              closeResult(cardId);
            }}
          >
            <i
              className={cl(
                iconStyles.icon,
                iconStyles.iconCrossNarrowBig,
                styles.promoIcon
              )}
            ></i>
          </span>
          <p className={cl(globalStyles.cerise, globalStyles.errorMsg)}>
            {" "}
            Balance:{" "}
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

export default GiftCardItem;
