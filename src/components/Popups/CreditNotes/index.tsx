import React, { useContext, useEffect, useState } from "react";
import cs from "classnames";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import style from "./index.scss";
import iconStyles from "styles/iconFonts.scss";
import { Context } from "components/Modal/context";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "reducers/typings";
import Button from "components/Button";
import CreditNoteCard from "./CreditNoteCard";
import AccountService from "services/account";
import { CreditNote } from "containers/myAccount/components/MyCreditNotes/typings";

const CreditNotes = () => {
  const [data, setData] = useState<CreditNote[]>([]);
  const { closeModal } = useContext(Context);
  const { mobile } = useSelector((state: AppState) => state.device);

  const dispatch = useDispatch();

  const fetchCreditNotes = () => {
    AccountService.fetchCreditNotes(dispatch)
      .then(response => {
        const { results } = response;
        setData(results);
      })
      .catch(e => {
        console.log("fetch credit notes API failed =====", e);
      });
  };

  useEffect(() => {
    fetchCreditNotes();
  }, []);

  return (
    !!data?.length && (
      <div>
        <div
          className={cs(
            styles.sizeBlockPopup,
            styles.sizeBlockNotFixed,
            { [styles.centerpageDesktopFs]: !mobile },
            globalStyles.textCenter,
            { [styles.centerpageDesktopFsWidth]: mobile }
          )}
        >
          <div className={styles.headWrp}>
            <div className={style.creditNoteHead}>Apply credit note</div>
            <div
              className={cs(styles.cross, styles.deliveryIcon)}
              onClick={closeModal}
            >
              <i
                className={cs(
                  iconStyles.icon,
                  iconStyles.iconCrossNarrowBig,
                  styles.icon,
                  styles.iconCross,
                  styles.freeShippingPopup
                )}
              ></i>
            </div>
          </div>

          <div className={cs(style.cnBody)}>
            <div className={style.boxWrp}>
              {data?.map(creditNote => (
                <CreditNoteCard
                  key={creditNote?.entry_code}
                  creditNote={creditNote}
                />
              ))}
            </div>
            <Button variant="mediumMedCharcoalCta366" label={"Continue"} />
          </div>
        </div>
      </div>
    )
  );
};

export default CreditNotes;
