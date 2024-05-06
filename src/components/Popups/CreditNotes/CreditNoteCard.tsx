import React, { forwardRef } from "react";
import cs from "classnames";
import CheckboxWithLabel from "components/CheckboxWithLabel";
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
};

const CreditNoteCard = forwardRef<Props, any>(
  (
    {
      creditNote: {
        entry_code,
        is_expired,
        remaining_amount,
        date_created,
        expiring_date,
        applied_amount
      },
      checkedIds,
      onCheck,
      activeKey,
      setActiveKey
    },
    ref
  ) => {
    const { currency } = useSelector((state: AppState) => state);

    return (
      <>
        <div className={cs(styles.creditNote, { [styles.bgGrey]: is_expired })}>
          <div className={styles.headDiv}>
            <h6>{entry_code}</h6>
            {is_expired ? (
              <div className={styles.expiredHead}>
                <p className={cs(styles.iconCarrot)}>
                  {remaining_amount === 0 ? "Balance Over" : "Expired"}{" "}
                  <span
                    className={cs({
                      [styles.active]: activeKey === entry_code
                    })}
                    onClick={() => setActiveKey(entry_code)}
                  ></span>
                </p>
              </div>
            ) : (
              <CheckboxWithLabel
                name={entry_code}
                id={entry_code}
                checked={checkedIds.includes(entry_code)}
                className={styles.checkboxWrp}
                label={[<label key={entry_code} htmlFor={entry_code}></label>]}
                onChange={e => onCheck(e, entry_code)}
              />
            )}
          </div>
          {ref && ref?.current && (
            <div
              ref={el => (ref.current[entry_code] = el)}
              className={cs(styles.bodyDiv, {
                [styles.expiredBody]: is_expired,
                [styles.balanceOverBody]: remaining_amount === 0 || is_expired
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
                <span>
                  {" "}
                  {displayPriceWithCommasFloat(applied_amount, currency)}
                </span>
              </p>
              {!is_expired && (
                <p className={styles.balance}>
                  Balance amount:{" "}
                  {displayPriceWithCommasFloat(remaining_amount, currency)}
                </p>
              )}
            </div>
          )}
        </div>
      </>
    );
  }
);
export default CreditNoteCard;
