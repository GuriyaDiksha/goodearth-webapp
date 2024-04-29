import React, { Dispatch, SetStateAction } from "react";
import cs from "classnames";
import CheckboxWithLabel from "components/CheckboxWithLabel";
import styles from "./index.scss";
import { CreditNote } from "containers/myAccount/components/MyCreditNotes/typings";
import { displayPriceWithCommasFloat } from "utils/utility";
import { AppState } from "reducers/typings";
import { useSelector } from "react-redux";

type Props = {
  creditNote: CreditNote;
  setCheckedIds: Dispatch<SetStateAction<string[]>>;
  checkedIds: string[];
};

const CreditNoteCard: React.FC<Props> = ({
  creditNote: {
    entry_code,
    is_expired,
    remaining_amount,
    date_created,
    expiring_date,
    applied_amount
  },
  checkedIds,
  setCheckedIds
}) => {
  const { currency } = useSelector((state: AppState) => state);

  const onCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event?.target.checked) {
      setCheckedIds([...checkedIds, entry_code]);
    } else {
      setCheckedIds([...checkedIds.filter(ele => ele !== entry_code)]);
    }
  };

  return (
    <>
      <div className={cs(styles.creditNote, { [styles.bgGrey]: is_expired })}>
        <div className={styles.headDiv}>
          <h6>{entry_code}</h6>
          {is_expired ? (
            <div className={styles.expiredHead}>
              <p className={cs(styles.iconCarrot)}>
                {remaining_amount === 0 ? "Balance Over" : "Expired"}{" "}
                <span className={styles.active}></span>
              </p>
            </div>
          ) : (
            <CheckboxWithLabel
              name={entry_code}
              id={entry_code}
              checked={checkedIds.includes(entry_code)}
              className={styles.checkboxWrp}
              label={[<label key={entry_code} htmlFor={entry_code}></label>]}
              onChange={onCheck}
            />
          )}
        </div>
        <div
          className={cs(styles.bodyDiv, { [styles.expiredBody]: is_expired })}
        >
          <p>
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
      </div>
    </>
  );
};

export default CreditNoteCard;
