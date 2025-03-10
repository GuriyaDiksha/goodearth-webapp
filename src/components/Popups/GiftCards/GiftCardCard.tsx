import React, { forwardRef, useEffect, useRef, useState } from "react";
import cs from "classnames";
import styles from "./index.scss";
import { GiftCard } from "containers/myAccount/components/MyCreditNotes/typings";
import { displayPriceWithSeparation } from "utils/utility";
import CookieService from "services/cookie";
import { GA_CALLS } from "constants/cookieConsent";

type Props = {
  giftCardData: GiftCard;
  onCheck: (
    e: React.ChangeEvent<HTMLInputElement> | boolean,
    v: string
  ) => void;
  checkedIds: string[];
  activeKey: string;
  setActiveKey: (x: string) => void;
  error: { [key: string]: string };
};

const GiftCardCard = forwardRef<Props, any>(
  (
    {
      giftCardData: {
        entry_code,
        remaining_amount,
        date_created,
        expiring_date,
        amount,
        message,
        currency
      },
      checkedIds,
      onCheck,
      activeKey,
      setActiveKey,
      error
    },
    ref
  ) => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    const yyyy = today.getFullYear();
    const today_in_str = dd + "/" + mm + "/" + yyyy;
    const errorRef = useRef<HTMLParagraphElement | null>(null);
    const [lastClicked, setLastClicked] = useState<string | null>(null);

    // Separate useEffect for initial errors on component mount
    useEffect(() => {
      if (error && error[entry_code] && errorRef.current) {
        errorRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
        errorRef.current?.focus();
      }
    }, []); // Empty dependency array for mount only

    // This effect handles errors that appear after clicking the Apply button
    useEffect(() => {
      if (
        lastClicked === entry_code &&
        error &&
        error[entry_code] &&
        errorRef.current
      ) {
        // Only scroll if this specific card was just clicked and has an error
        setTimeout(() => {
          errorRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
          errorRef.current?.focus();
        }, 100);
        // Reset lastClicked after scrolling
        setLastClicked(null);
      }
    }, [error, lastClicked, entry_code]);

    const handleApplyClick = () => {
      // Set this card as the last clicked one before calling onCheck
      setLastClicked(entry_code);

      onCheck(checkedIds.includes(entry_code), entry_code);

      const userConsent = CookieService.getCookie("consent").split(",");
      if (checkedIds.includes(entry_code)) {
        // Hit Remove credit_note event on click of Apply CTA
        if (userConsent.includes(GA_CALLS)) {
          dataLayer.push({
            event: "remove_gift_card",
            GC_amount: amount,
            date_of_issue: date_created,
            date_of_redemption: today_in_str,
            date_of_expiry: expiring_date
          });
        }
      } else {
        // Hit Apply credit_note event on click of Remove CTA
        if (userConsent.includes(GA_CALLS)) {
          dataLayer.push({
            event: "apply_gift_card",
            GC_amount: amount,
            date_of_issue: date_created,
            date_of_redemption: today_in_str,
            date_of_expiry: expiring_date
          });
        }
      }
    };

    return (
      <>
        <div
          className={cs(styles.creditNote, {
            [styles.bgGrey]: message,
            [styles.darkBorder]: checkedIds.includes(entry_code)
          })}
        >
          <div className={styles.headDiv}>
            <h6>{entry_code}</h6>
            {message ? (
              <div className={styles.expiredHead}>
                <p
                  className={cs(styles.iconCarrot)}
                  onClick={() => setActiveKey(entry_code)}
                >
                  {message}
                  <span
                    className={cs({
                      [styles.active]: activeKey === entry_code
                    })}
                  ></span>
                </p>
              </div>
            ) : (
              <p
                className={cs(styles.apply, {
                  [styles.active]: checkedIds.includes(entry_code)
                })}
                onClick={handleApplyClick}
              >
                {checkedIds.includes(entry_code) ? "REMOVE" : "APPLY"}
              </p>
            )}
          </div>
          {ref && ref?.current && (
            <div
              ref={el => (ref.current[entry_code] = el)}
              className={cs(styles.bodyDiv, {
                [styles.expiredBody]: message === "Expired",
                [styles.balanceOverBody]: message
              })}
            >
              <p className={styles.firstLine}>
                Date of issue: <span>{date_created}</span>
              </p>
              <p>
                Date of expiry: <span>{expiring_date}</span>
              </p>
              <p>
                Total value:{" "}
                <span> {displayPriceWithSeparation(amount, currency)}</span>
              </p>
              {(!message || message === "Balance Over") && (
                <p className={styles.balance}>
                  Balance amount:{" "}
                  {displayPriceWithSeparation(remaining_amount, currency)}
                </p>
              )}
            </div>
          )}
        </div>
        {error && error[entry_code] && (
          <p
            ref={errorRef}
            className={styles.errorMsg}
            tabIndex={-1}
            id={`error-${entry_code}`}
          >
            {error[entry_code]}
          </p>
        )}
      </>
    );
  }
);
export default GiftCardCard;
