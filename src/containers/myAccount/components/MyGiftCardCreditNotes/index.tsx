import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AccountService from "services/account";
import { CreditNote, SortBy, SortType, GiftCard } from "./typings";
import styles from "./styles.scss";
import GiftCardTable from "./GiftCardTable";
import CreditNotesTable from "./CreditNotesTable";
import cs from "classnames";
import bootstrapStyles from "./../../../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "./../../../../styles/global.scss";
import { AppState } from "reducers/typings";
import { updateLoader } from "actions/info";
import { Link } from "react-router-dom";

type Props = {
  setCurrentSection: () => void;
};

const GiftCardCreditNotes: React.FC<Props> = ({ setCurrentSection }) => {
  const [activeTab, setActiveTab] = useState("giftCard");
  const [data, setData] = useState<CreditNote[]>([]);
  const [pagination, setPagination] = useState({
    count: 0,
    previous: null,
    next: null
  });
  const [dataGiftCard, setDataGiftCard] = useState<GiftCard[]>([]);
  const [paginationGiftCard, setPaginationGiftCard] = useState({
    count: 0,
    previous: null,
    next: null
  });
  const {
    currency,
    device: { mobile }
  } = useSelector((state: AppState) => state);

  const dispatch = useDispatch();

  const fetchCreditNotes = (
    sortBy?: SortBy,
    sortType?: SortType,
    page?: number
  ) => {
    dispatch(updateLoader(true));
    AccountService.fetchCreditNotes(dispatch, sortBy, sortType, page)
      .then(response => {
        const { count, previous, next, results } = response;
        setData(results.filter(ele => ele?.type !== "GC"));
        setPagination({ count, previous, next });
        dispatch(updateLoader(false));
      })
      .catch(e => {
        console.log("fetch credit notes API failed =====", e);
        dispatch(updateLoader(false));
      });
  };

  const fetchGiftCards = (
    sortBy?: SortBy,
    sortType?: SortType,
    page?: number
  ) => {
    dispatch(updateLoader(true));
    AccountService.fetchGiftCards(dispatch, sortBy, sortType, page, false)
      .then(response => {
        const { count, previous, next, results } = response;
        setDataGiftCard(results.filter(ele => ele?.type !== "GC"));
        setPaginationGiftCard({ count, previous, next });
        dispatch(updateLoader(false));
      })
      .catch(e => {
        console.log("fetch gift cards API failed =====", e);
        dispatch(updateLoader(false));
      });
  };

  useEffect(() => {
    setCurrentSection();
    fetchCreditNotes();
    fetchGiftCards();
  }, []);

  const showTab = (tabName: any) => {
    setActiveTab(tabName);
  };

  return (
    <div className={styles.tabsContainer}>
      <div className={cs(styles.tabs, bootstrapStyles.row)}>
        <h3
          className={cs(styles.heading, styles.tabBtn, bootstrapStyles.col6, {
            [styles.active]: activeTab === "giftCard"
          })}
          onClick={() => showTab("giftCard")}
        >
          Gift Card
        </h3>
        <h3
          className={cs(styles.heading, styles.tabBtn, bootstrapStyles.col6, {
            [styles.active]: activeTab === "creditNote"
          })}
          onClick={() => showTab("creditNote")}
        >
          Credit Note
        </h3>
      </div>

      <div
        className={cs(
          styles.tabContent,
          activeTab === "giftCard" ? styles.show : ""
        )}
      >
        {dataGiftCard?.length ? (
          <>
            <GiftCardTable
              data={dataGiftCard}
              fetchGiftCrads={fetchGiftCards}
              pagination={paginationGiftCard}
            />
          </>
        ) : (
          <>
            <div className={styles.noDataContainer}>
              <div className={styles.noDataContent}>
                <p>No active Gift Cards linked with account.</p>
                <Link to={"/account/giftcard-activation"}>
                  Activate Gift Card
                </Link>
              </div>
            </div>
          </>
        )}
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
            {dataGiftCard?.length ? (
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
            ) : (
              ""
            )}
            <p className={styles.enquiry}>
              For queries, contact{" "}
              <a href="mailto:customercare@goodearth.in">Customer Care.</a>
            </p>
          </div>
        </div>
      </div>

      <div
        className={cs(
          styles.tabContent,
          activeTab === "creditNote" ? styles.show : ""
        )}
      >
        {data?.length && currency == "INR" ? (
          <>
            <CreditNotesTable
              data={data}
              fetchCreditNotes={fetchCreditNotes}
              pagination={pagination}
            />

            <div
              className={cs(
                bootstrapStyles.row,
                globalStyles.flexGutterCenter,
                {
                  [styles.mobileMargin]: mobile
                }
              )}
            ></div>
          </>
        ) : (
          <>
            <div className={styles.noDataContainer}>
              <div className={styles.noDataContent}>
                <p>No Credit Note(s) available.</p>
              </div>
            </div>
          </>
        )}
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
            {data?.length ? (
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
            ) : (
              ""
            )}
            <p className={styles.enquiry}>
              For queries, contact{" "}
              <a href="mailto:customercare@goodearth.in">Customer Care.</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiftCardCreditNotes;
