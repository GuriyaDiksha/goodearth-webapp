import React from "react";
import cl from "classnames";
import styles from "../styles.scss";
import { GiftListProps } from "./typings";
import { Currency, currencyCode } from "typings/currency";
import globalStyles from "styles/global.scss";
import iconStyles from "styles/iconFonts.scss";
import { Link } from "react-router-dom";

const GiftCardItem = ({
  currStatus,
  type,
  createDate,
  expiryDate,
  currCode,
  fullValue,
  remValues,
  conditionalRefresh,
  status,
  // showLocked,
  // showExpired,
  code,
  onClose,
  viewOnly,
  // showInactive,
  isLoggedIn
}: GiftListProps): JSX.Element => {
  // const [showLocked, set = false;
  // let showExpired = false;
  const unicode = currencyCode[currCode as Currency];
  // const conditionalRefresh = false;
  // const deleteCard = (code: string) => {
  // setOpenState(!menuOpen);
  // console.log(showLocked);
  // };

  const closeResult = (code: string) => {
    onClose(code);
  };

  if (currStatus == "Locked" && type == "CNI") {
    // showLocked = true;
  } else if (currStatus == "Expired" && type == "CNI") {
    // showExpired = true;
  }

  return (
    <div id="gc-balance-info">
      {status == "expired" && (
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
              <span className={styles.lineHead}> Date of issue: </span>{" "}
              <span className={styles.line}> {createDate} </span>
            </p>
            <p>
              <span className={styles.lineHead}> Date of expiry: </span>{" "}
              <span className={styles.line}> {expiryDate} </span>
            </p>
            {conditionalRefresh && !isLoggedIn && (
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
        </div>
      )}
      {status == "inactive" && (
        <div className="gc-inactive">
          <div className={cl(styles.textLeft, styles.rtcinfo, styles.mTop0)}>
            {!viewOnly && (
              <p className={styles.value12}>
                {code}{" "}
                <span
                  className={styles.cross}
                  onClick={() => {
                    closeResult(code);
                  }}
                >
                  <i
                    className={cl(
                      iconStyles.icon,
                      iconStyles.iconCrossNarrowBig
                    )}
                  ></i>
                </span>
              </p>
            )}
            <p className={cl(styles.giftcardBalance, globalStyles.voffset1)}>
              {" "}
              Balance amount: {String.fromCharCode(...unicode)} {remValues} |
              Gift Card INACTIVE |{" "}
              <Link
                className={cl(
                  globalStyles.linkTextUnderline,
                  globalStyles.cerise
                )}
                to="/account/giftcard-activation"
              >
                CLICK HERE TO ACTIVATE
              </Link>
            </p>
            {conditionalRefresh && !isLoggedIn && (
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
        </div>
      )}
      {status == "locked" && (
        <div className="gc-inactive">
          <div className={cl(styles.textLeft, styles.rtcinfo, styles.mTop0)}>
            {!viewOnly && (
              <p className={styles.value12}>
                {code}{" "}
                <span
                  className={styles.cross}
                  onClick={() => {
                    closeResult(code);
                  }}
                >
                  <i
                    className={cl(
                      iconStyles.icon,
                      iconStyles.iconCrossNarrowBig
                    )}
                  ></i>
                </span>
              </p>
            )}
            <p className={cl(globalStyles.cerise, globalStyles.voffset1)}>
              Please try again in sometime. For security reasons, your credit
              note / gift card is temporarily locked
            </p>
            {conditionalRefresh && !isLoggedIn && (
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
        </div>
      )}
      {(!status || status == "active") && (
        <div className={cl(styles.textLeft, styles.rtcinfo, styles.mTop0)}>
          {!viewOnly && (
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
          )}
          <p>
            <span className={styles.lineHead}> Date of issue: </span>{" "}
            <span className={styles.line}> {createDate} </span>
          </p>
          <p>
            <span className={styles.lineHead}> Date of expiry: </span>{" "}
            <span className={styles.line}> {expiryDate} </span>
          </p>
          <p>
            <span className={styles.lineHead}> Total value: </span>{" "}
            <span className={styles.line}>
              {" "}
              {String.fromCharCode(...unicode)} {fullValue}{" "}
            </span>
          </p>
          <p className={cl(globalStyles.cerise, globalStyles.voffset1)}>
            {" "}
            Balance amount: {String.fromCharCode(...unicode)} {remValues}{" "}
          </p>
          {conditionalRefresh && !isLoggedIn && (
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
