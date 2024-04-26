import React, { useState } from "react";
import cs from "classnames";
import CheckboxWithLabel from "components/CheckboxWithLabel";
import styles from "./index.scss";
import { CreditNote } from "containers/myAccount/components/MyCreditNotes/typings";
import { displayPriceWithCommasFloat } from "utils/utility";
import { AppState } from "reducers/typings";
import { useSelector } from "react-redux";

type Props = {
  creditNote: CreditNote;
};

const CreditNoteCard: React.FC<Props> = ({
  creditNote: { entry_code, is_expired, remaining_amount }
}) => {
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
                <span className={styles.active}></span>
              </p>
            </div>
          ) : (
            <CheckboxWithLabel
              name={"creditnote"}
              id={"creditnote"}
              checked={true}
              className={styles.checkboxWrp}
              label={[<label key="creditnote" htmlFor={"creditnote"}></label>]}
              onChange={() => {
                console.log("click");
              }}
            />
          )}
        </div>
        <div
          className={cs(styles.bodyDiv, { [styles.expiredBody]: is_expired })}
        >
          <p>
            Date of issue: <span>10 DEC 2023</span>
          </p>
          <p>
            Date of issue: <span>10 DEC 2023</span>
          </p>
          <p>
            Date of issue: <span>10 DEC 2023</span>
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
