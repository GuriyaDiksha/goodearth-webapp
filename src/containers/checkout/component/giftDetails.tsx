import React from "react";
import cl from "classnames";
import cs from "classnames";
import styles from "./gift.scss";
import { GiftListProps } from "./typings";
import globalStyles from "styles/global.scss";
import iconStyles from "styles/iconFonts.scss";
import { displayPriceWithSeparation } from "utils/utility";
import bootstrapStyles from "styles/bootstrap/bootstrap-grid.scss";
import CookieService from "services/cookie";
import { GA_CALLS } from "constants/cookieConsent";

const GiftCardItem = ({
  cardId,
  expiryDate,
  type,
  cardValue,
  remainingAmount,
  currStatus,
  currency,
  cardType,
  onClose,
  isLoggedIn
}: GiftListProps): JSX.Element => {
  // let showLocked = false;
  let showExpired = false;
  const conditionalRefresh = false;
  const deleteCard = (code: string) => {
    // setOpenState(!menuOpen);
  };

  const closeResult = (code: string, type: string) => {
    onClose(code, type);
  };

  if (currStatus == "Locked" && type == "CNI") {
    // showLocked = true;
  } else if (currStatus == "Expired" && type == "CNI") {
    showExpired = true;
  }

  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  const yyyy = today.getFullYear();
  const today_in_str = dd + "/" + mm + "/" + yyyy;

  return (
    <div
      id="gc-balance-info"
      className={cs(bootstrapStyles.colMd6, styles.giftDetails)}
    >
      {showExpired ? (
        <div>
          <div className={cl(styles.textLeft, styles.rtcinfo, styles.mTop0)}>
            <p className={styles.value12}>
              {cardId}{" "}
              <span
                className={styles.cross}
                onClick={() => {
                  closeResult(cardId, cardType);
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
          className={cl(styles.textLeft, styles.rtcinfo, globalStyles.voffset2)}
        >
          <span className={styles.txtup}>{cardId} </span>
          <span className={styles.textMuted}>
            {cardType == "CREDITNOTE" ? "Applied" : "Gift Card Applied"}
          </span>
          <span
            className={styles.cross}
            onClick={() => {
              closeResult(cardId, cardType);
              const userConsent = CookieService.getCookie("consent").split(",");
              if (userConsent.includes(GA_CALLS)) {
                if (cardType == "CREDITNOTE") {
                  dataLayer.push({
                    event: "remove_credit_note",
                    CN_amount: cardValue,
                    date_of_issue: "NA",
                    date_of_redemption: today_in_str,
                    date_of_expiry: expiryDate
                  });
                } else {
                  dataLayer.push({
                    event: "remove_gift_card",
                    GC_amount: cardValue,
                    date_of_issue: "NA",
                    date_of_redemption: today_in_str,
                    date_of_expiry: expiryDate
                  });
                }
              }
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
          <p className={cl(styles.appliedMsg)}>
            {" "}
            Balance:{" "}
            <span>
              {" "}
              {displayPriceWithSeparation(remainingAmount, currency)}
              {` | Expiry:` + expiryDate}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default GiftCardItem;
