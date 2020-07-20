import React from "react";
import cl from "classnames";
import styles from "./gift.scss";
import { GiftListProps } from "./typings";
import { Currency, currencyCode } from "typings/currency";
import globalStyles from "styles/global.scss";
import iconStyles from "styles/iconFonts.scss";

const GiftCardItem = ({
  cardId,
  cardType,
  appliedAmount,
  cardValue,
  type,
  remainingAmount,
  currStatus,
  code,
  currency,
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
                  deleteCard(code);
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
        <div className={cl(styles.textLeft, styles.rtcinfo, styles.mTop0)}>
          <p className={styles.textMuted}>
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
          <p className={cl(globalStyles.cerise, globalStyles.errorMsg)}>
            {" "}
            Balance amount:{" "}
            <span>
              {" "}
              {String.fromCharCode(unicode)} {remainingAmount}{" "}
            </span>
          </p>
          {conditionalRefresh && (
            <span
              className={cl(styles.colorPrimary, globalStyles.pointer)}
              onClick={() => {
                closeResult(code);
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
      )}
    </div>
  );
};

export default GiftCardItem;
