import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AccountService from "services/account";
import { CreditNote, SortBy, SortType } from "./typings";
import styles from "./styles.scss";
import CreditNotesTable from "./CreditNotesTable";
import cs from "classnames";
import bootstrapStyles from "./../../../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "./../../../../styles/global.scss";
import { AppState } from "reducers/typings";

type Props = {
  setCurrentSection: () => void;
};

const MyCreditNotes: React.FC<Props> = ({ setCurrentSection }) => {
  const [data, setData] = useState<CreditNote[]>([]);
  const [pagination, setPagination] = useState({
    count: 0,
    previous: null,
    next: null
  });
  const {
    device: { mobile }
  } = useSelector((state: AppState) => state);

  const dispatch = useDispatch();

  const fetchCreditNotes = (
    sortBy?: SortBy,
    sortType?: SortType,
    page?: number
  ) => {
    AccountService.fetchCreditNotes(dispatch, sortBy, sortType, page)
      .then(response => {
        const { count, previous, next, results } = response;
        setData(results.filter(ele => ele?.type === "CN"));
        setPagination({ count, previous, next });
      })
      .catch(e => {
        console.log("fetch credit notes API failed =====", e);
      });
  };

  useEffect(() => {
    setCurrentSection();
    fetchCreditNotes();
  }, []);

  return (
    <div>
      <h3 className={styles.heading}>Good Earth Credit Notes</h3>
      {data?.length ? (
        <>
          <CreditNotesTable
            data={data}
            fetchCreditNotes={fetchCreditNotes}
            pagination={pagination}
          />

          <div
            className={cs(bootstrapStyles.row, globalStyles.flexGutterCenter, {
              [styles.mobileMargin]: mobile
            })}
          >
            <div
              className={cs(
                bootstrapStyles.colLg10,
                bootstrapStyles.col12,
                styles.footer
              )}
            >
              <div className={cs(styles.labelWrp)}>
                <div className={styles.pending}>
                  <div className={styles.circle}></div>
                  <p>Balance Pending</p>
                </div>
                <div className={cs(styles.expired)}>
                  <div className={cs(styles.circle, styles.greyCircle)}></div>
                  <p>Balance Exhausted / Expired</p>
                </div>
              </div>
              <p className={styles.enquiry}>
                For queries, contact{" "}
                <a href="mailto:customercare@goodearth.in">Customer Care.</a>
              </p>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default MyCreditNotes;
