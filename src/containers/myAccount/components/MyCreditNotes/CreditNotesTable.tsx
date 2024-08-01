import React, { useRef, useState } from "react";
import cs from "classnames";
import bootstrapStyles from "./../../../../styles/bootstrap/bootstrap-grid.scss";
import iconStyles from "styles/iconFonts.scss";
import globalStyles from "./../../../../styles/global.scss";
import styles from "./styles.scss";
import { CreditNote, HeaderData, SortBy, SortType } from "./typings";
import { AppState } from "reducers/typings";
import { useSelector } from "react-redux";
import { displayPriceWithSeparation } from "utils/utility";
import Pagination from "./Pagination";

type Props = {
  data: CreditNote[];
  fetchCreditNotes: (x: SortBy, y: SortType, z?: number) => void;
  pagination: {
    count: number;
    previous: string | null;
    next: string | null;
  };
};

const TableHeader: HeaderData = [
  {
    key: "date_created",
    title: "DATE OF ISSUE",
    sortIcon: true,
    isPrice: false
  },
  { key: "entry_code", title: "CODE #", sortIcon: false, isPrice: false },
  { key: "amount", title: "INITIAL VALUE", sortIcon: false, isPrice: true },
  {
    key: "remaining_amount",
    title: "BALANCE VALUE",
    sortIcon: false,
    isPrice: true
  },
  { key: "expiring_date", title: "EXPIRY", sortIcon: true, isPrice: false }
];

const CreditNotesTable: React.FC<Props> = ({
  data,
  fetchCreditNotes,
  pagination
}) => {
  const [activeIndex, setActiveIndex] = useState("");
  const [sortBy, setSortBy] = useState("expiring_date");
  const [sortType, setSortType] = useState("asc");
  const [page, setPage] = useState(1);

  const {
    currency,
    device: { mobile }
  } = useSelector((state: AppState) => state);
  const bodyRef = useRef<Array<string>>([]);

  const handleHeaderClick = (code: string) => {
    if (activeIndex !== "") {
      const currentBody = bodyRef.current[activeIndex];
      currentBody.style.maxHeight = 0 + "px";
    }

    const newBody = bodyRef.current[code];

    if (activeIndex == code) {
      setActiveIndex("");
      newBody.style.maxHeight = 0 + "px";
    } else {
      setActiveIndex(code);
      newBody.style.maxHeight = newBody.scrollHeight + 15 + "px";
    }
  };

  const fetchSortedData = (key: SortBy) => {
    const value: SortType =
      sortBy !== key ? "desc" : sortType === "asc" ? "desc" : "asc";
    fetchCreditNotes(key, value, page);
    setSortBy(key);
    setSortType(value);
  };

  const fetchPaginatedData = (page: number) => {
    fetchCreditNotes(sortBy as SortBy, sortType as SortType, page);
    setPage(page);
  };

  const collapseExpandItemOnPageChange = () => {
    if (activeIndex !== "") {
      setActiveIndex("");
      const currentBody = bodyRef.current[activeIndex];
      currentBody.style.maxHeight = 0 + "px";
    }
  };

  return (
    <>
      {/* Table Header */}
      <div
        className={cs(bootstrapStyles.row, globalStyles.flexGutterCenter, {
          [styles.mobileMargin]: mobile
        })}
      >
        <div
          className={cs(
            bootstrapStyles.colLg10,
            bootstrapStyles.col12,
            styles.tableHeading,
            styles.tableRow
          )}
        >
          {mobile && (
            <div
              className={cs(bootstrapStyles.colLg1, bootstrapStyles.col1)}
            ></div>
          )}
          {TableHeader?.slice(mobile ? 1 : 0, mobile ? 4 : 5)?.map(
            (header, index) => (
              <div
                key={header?.key}
                className={cs(bootstrapStyles.colLg2, bootstrapStyles.col3, {
                  [globalStyles.textLeft]: index === 0 && mobile,
                  [styles.customLg]: header?.sortIcon && !mobile
                })}
              >
                {header.title}
                {header?.sortIcon && (
                  <i
                    className={cs(
                      iconStyles.icon,
                      iconStyles.iconDateSort,
                      styles.sortIcon
                    )}
                    onClick={() => fetchSortedData(header?.key as SortBy)}
                  ></i>
                )}
              </div>
            )
          )}
          {mobile && <div className={cs(bootstrapStyles.col1)}></div>}
        </div>
      </div>
      {/* Table content start */}
      {data?.map(creditNote => (
        //=========Row start==========//
        <div
          key={creditNote?.entry_code}
          className={cs(bootstrapStyles.row, globalStyles.flexGutterCenter, {
            [styles.mobileMargin]: mobile
          })}
        >
          {/* Primary Row */}
          <div
            className={cs(
              bootstrapStyles.colLg10,
              bootstrapStyles.colSm12,
              styles.tableRow,
              { [styles.greyRow]: creditNote?.message }
            )}
          >
            {/* Columns */}
            {mobile && (
              <div
                className={cs(
                  bootstrapStyles.colLg1,
                  bootstrapStyles.col1,
                  globalStyles.flex,
                  globalStyles.flexGutterRight
                )}
              >
                <div
                  className={cs(styles.circle, {
                    [styles.greyCircle]: creditNote?.message
                  })}
                ></div>
              </div>
            )}
            {TableHeader?.slice(mobile ? 1 : 0, mobile ? 4 : 5).map(
              (header, index) => (
                <div
                  key={header?.key}
                  className={cs(bootstrapStyles.colLg2, bootstrapStyles.col3, {
                    [globalStyles.textLeft]: index === 0 && mobile,
                    [styles.firstCol]: index === 0 && !mobile,
                    [styles.customLg]: header?.sortIcon && !mobile
                  })}
                >
                  {!mobile && index === 0 && (
                    <div
                      className={cs(styles.circle, {
                        [styles.greyCircle]: creditNote?.message
                      })}
                    ></div>
                  )}
                  {header?.isPrice
                    ? displayPriceWithSeparation(
                        creditNote?.[header?.key],
                        currency
                      )
                    : creditNote?.[header?.key]}
                </div>
              )
            )}
            {mobile && (
              <div className={cs(bootstrapStyles.col1, styles.iconCarrot)}>
                <span
                  className={cs({
                    [styles.active]: activeIndex === creditNote?.entry_code
                  })}
                  onClick={() => handleHeaderClick(creditNote?.entry_code)}
                ></span>
              </div>
            )}
          </div>

          {/* Secondary(Inner) Row */}
          {mobile && creditNote?.entry_code === activeIndex && (
            <hr className={styles.mobileBorder} />
          )}
          {mobile && (
            <div
              ref={el => (bodyRef.current[creditNote?.entry_code] = el)}
              className={cs(bootstrapStyles.col12, styles.tableSecondaryRow, {
                [styles.greyRow]: creditNote?.message
              })}
            >
              <div className={cs(bootstrapStyles.col1)}></div>
              <div
                className={cs(
                  bootstrapStyles.col3,
                  globalStyles.textLeft,
                  styles.colDate
                )}
              >
                <p className={styles.subHeading}>Date Of Issue</p>
                <p>{creditNote?.[TableHeader?.[0]?.key]}</p>
              </div>
              <div
                className={cs(
                  bootstrapStyles.col3,
                  globalStyles.textCenter,
                  styles.colDate
                )}
              >
                <p className={styles.subHeading}>Date Of Expiry</p>
                <p>{creditNote?.[TableHeader?.[4]?.key]}</p>
              </div>
              <div className={cs(bootstrapStyles.col3, styles.colDate)}></div>
              <div className={cs(bootstrapStyles.col1)}></div>
            </div>
          )}
        </div>
      ))}

      {pagination.count > 5 ? (
        <Pagination
          previous={pagination?.previous}
          next={pagination?.next}
          count={pagination?.count}
          page={page}
          fetchPaginatedData={fetchPaginatedData}
          collapseExpandItemOnPageChange={collapseExpandItemOnPageChange}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default CreditNotesTable;
