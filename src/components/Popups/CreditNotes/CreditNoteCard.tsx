import React, { forwardRef } from "react";
import cs from "classnames";
import styles from "./index.scss";
import { CreditNote } from "containers/myAccount/components/MyCreditNotes/typings";
import { displayPriceWithCommasFloat } from "utils/utility";
import { AppState } from "reducers/typings";
import { useSelector } from "react-redux";

type Props = {
  creditNote: CreditNote;
  onCheck: (e: React.ChangeEvent<HTMLInputElement>, v: string) => void;
  checkedIds: string[];
  activeKey: string;
  setActiveKey: (x: string) => void;
  error: { key: string }[];
};

const CreditNoteCard = forwardRef<Props, any>(
  (
    {
      creditNote: {
        entry_code,
        remaining_amount,
        date_created,
        expiring_date,
        amount,
        message
      },
      checkedIds,
      onCheck,
      activeKey,
      setActiveKey,
      error
    },
    ref
  ) => {
    const { currency } = useSelector((state: AppState) => state);

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
                <p className={cs(styles.iconCarrot)}>
                  {message}
                  <span
                    className={cs({
                      [styles.active]: activeKey === entry_code
                    })}
                    onClick={() => setActiveKey(entry_code)}
                  ></span>
                </p>
              </div>
            ) : (
              <p
                className={cs(styles.apply, {
                  [styles.active]: checkedIds.includes(entry_code)
                })}
                onClick={() =>
                  onCheck(checkedIds.includes(entry_code), entry_code)
                }
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
                <span> {displayPriceWithCommasFloat(amount, currency)}</span>
              </p>
              {(!message || message === "Balance Over") && (
                <p className={styles.balance}>
                  Balance amount:{" "}
                  {displayPriceWithCommasFloat(remaining_amount, currency)}
                </p>
              )}
            </div>
          )}
        </div>
        <p className={styles.errorMsg}>{error?.[entry_code]}</p>
      </>
    );
  }
);
export default CreditNoteCard;
