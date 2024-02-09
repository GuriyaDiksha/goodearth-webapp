import React, { useEffect, useState, useRef } from "react";
import FilterDropdown from "./FilterDropdown";
import bootstrap from "../../../../styles/bootstrap/bootstrap-grid.scss";
import Close from "./../../../../icons/imastClose.svg";
import True from "./../../../../icons/imastTrue.svg";
import Download from "./../../../../images/imastDownload.svg";
import styles from "./styles.scss";
import cs from "classnames";
import LoyaltyService from "services/loyalty";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "reducers/typings";
import { updateTransaction } from "actions/loyalty";
import { TransactionPayload } from "services/loyalty/typings";
import globalStyles from "./../../../../styles/global.scss";
import Loader from "components/Loader";
import moment from "moment";
import { scrollToGivenId } from "utils/validate";
import { Link } from "react-router-dom";
import tooltipIcon from "images/tooltip.svg";
import tooltipOpenIcon from "images/tooltip-open.svg";

type Props = {
  mobile: boolean;
};

const TransactionTable = ({ mobile }: Props) => {
  const [openStateId, setOpenStateId] = useState<{
    id: string;
    state: boolean;
  }>({ id: "0", state: true });
  const [dropDownValue, setDropdownValue] = useState("L12M");
  const [dropDownValue2, setDropdownValue2] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [numberError, setNumberError] = useState("");
  const [showTip, setShowTip] = useState<{ id?: string; state?: boolean }>({
    id: "0",
    state: false
  });
  const [isLoading, setLoading] = useState(false);
  const [oldFilterState, setOldFilterState] = useState({
    dropDownValue: "",
    dropDownValue2: ""
  });
  const {
    user: { slab, email, firstName, lastName },
    loyalty: {
      transaction: {
        records,
        total_pages,
        nextpage,
        previouspage,
        total_records
      }
    },
    info: { isLoyaltyFilterOpen }
  } = useSelector((state: AppState) => state);
  const dispatch = useDispatch();
  const impactRef = useRef<HTMLInputElement>(null);
  const handleClickOutside = (evt: any) => {
    evt.stopPropagation();
    console.log(impactRef.current?.contains(evt.target));
    if (impactRef.current && !impactRef.current.contains(evt.target)) {
      setShowTip({ id: showTip["id"], state: false });
    }
  };
  const fetchTransaction = (payload: TransactionPayload) => {
    setLoading(true);
    LoyaltyService.getTransaction(dispatch, payload)
      .then(res => {
        setLoading(false);
        dispatch(updateTransaction(res));
      })
      .catch(e => {
        setLoading(false);
        dispatch(
          updateTransaction({
            total_records: 0,
            total_pages: 0,
            previouspage: "",
            nextpage: "",
            EarnPoints: 0,
            RedeemPoints: 0,
            BalancePoints: 0,
            ExpiredPoints: 0,
            records: []
          })
        );
        console.log("e======", e);
      });
  };

  useEffect(() => {
    fetchTransaction({
      email,
      DateRangeFilter: "L12M",
      TransactionFilter: "ALL",
      PageNumber: currentPage,
      PaginationFilter: 1
    });
  }, []);

  useEffect(() => {
    setNumberError("");
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onChangeFilter = (val: string, isMonthFilter: boolean) => {
    if (isMonthFilter) {
      setDropdownValue(val);
    }
    setCurrentPage(1);
    fetchTransaction({
      email,
      DateRangeFilter: isMonthFilter ? val : dropDownValue,
      TransactionFilter: dropDownValue2,
      PageNumber: currentPage,
      PaginationFilter: 1
    });
  };

  const onPageClick = (currentPage: number) => {
    if (total_pages >= currentPage && currentPage > 0) {
      setCurrentPage(currentPage);
      fetchTransaction({
        email,
        DateRangeFilter: dropDownValue,
        TransactionFilter: dropDownValue2,
        PageNumber: currentPage,
        PaginationFilter: 1
      });
    }
  };

  const downloadPdf = () => {
    LoyaltyService.getStatement(dispatch, {
      email,
      DateRangeFilter: dropDownValue,
      TransactionFilter: dropDownValue2,
      PageNumber: currentPage
    })
      .then(res => {
        const linkSource = `data:application/pdf;base64,${res}`;
        const downloadLink = document.createElement("a");
        const fileName = `${slab.replace(
          " ",
          "_"
        )}_${firstName}${lastName}.pdf`;
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
      })
      .catch(e => {
        console.log("e======", e);
      });
  };

  const handleAnimation = (id: string, isShow: boolean) => {
    if (typeof document == "object" && document.getElementById(id)) {
      if (isShow) {
        (document.getElementById(
          id
        ) as HTMLElement).style.maxHeight = document.getElementById(id)
          ?.scrollHeight
          ? `${document.getElementById(id)?.scrollHeight}px`
          : "max-content";
      } else {
        (document.getElementById(id) as HTMLElement).style.maxHeight = "0px";
      }
      // Close previous opened accordion
      if (openStateId?.id != id && document.getElementById(openStateId?.id)) {
        (document.getElementById(
          openStateId?.id
        ) as HTMLElement).style.maxHeight = "0px";
      }
    }
    setOpenStateId({
      id: id,
      state: isShow
    });
  };
  debugger;
  return (
    <>
      <div className={styles.transactionTableBackground}>
        <div
          className={cs(styles.transactionTableHeader, {
            [styles.transactionZindex]: isLoyaltyFilterOpen
          })}
        >
          {mobile ? null : <div className={styles.heading}>Filter by</div>}
          <FilterDropdown
            id="sort-filter"
            className="first-filter"
            items={[
              {
                label: "Last 3 months",
                value: "L3M",
                id: 1
              },
              {
                label: "Last 6 months",
                value: "L6M",
                id: 2
              },
              {
                label: "Last 1 year",
                value: "L12M",
                id: 3
              }
            ]}
            value={dropDownValue}
            onChange={(val: string) => onChangeFilter(val, true)}
            isCheckBox={false}
            handleCheckbox={(val: string) => setDropdownValue(val)}
            setOldFilterState={() =>
              setOldFilterState({ ...oldFilterState, dropDownValue })
            }
            cancelFilter={() => {
              setOldFilterState({ ...oldFilterState, dropDownValue: "" });
              setDropdownValue(oldFilterState?.dropDownValue);
            }}
          />
          <FilterDropdown
            id="transaction-filter"
            items={[
              {
                label: "All transactions",
                value: "ALL",
                id: 1
              },
              {
                label: "Earned",
                value: "ER",
                id: 2
              },
              {
                label: "Redeemed",
                value: "RD",
                id: 3
              }
            ]}
            value={dropDownValue2}
            onChange={(val: string) => onChangeFilter(val, false)}
            isCheckBox={true}
            handleCheckbox={(val: string) => setDropdownValue2(val)}
            setOldFilterState={() =>
              setOldFilterState({ ...oldFilterState, dropDownValue2 })
            }
            cancelFilter={() => {
              setOldFilterState({ ...oldFilterState, dropDownValue2: "" });
              setDropdownValue2(oldFilterState?.dropDownValue2);
            }}
          />
        </div>

        <div className={styles.transactionTable}>
          <div className={cs(bootstrap.row, styles.tableRow)}>
            <p
              className={cs(
                bootstrap.col1,
                styles.tableHeading,
                styles.alignCenterText,
                styles.firstHead
              )}
            ></p>
            <p
              className={cs(
                mobile ? bootstrap.col3 : bootstrap.col2,
                styles.tableHeading,
                styles.alignCenterText,
                styles.invoice
              )}
            >
              INVOICE #
            </p>
            {mobile ? null : (
              <p
                className={cs(
                  bootstrap.col2,
                  styles.tableHeading,
                  styles.alignCenterText
                )}
              >
                DATE
              </p>
            )}
            {mobile ? null : (
              <p
                className={cs(
                  bootstrap.col2,
                  styles.tableHeading,
                  styles.alignCenterText
                )}
              >
                LOCATION
              </p>
            )}
            <p
              className={cs(
                mobile ? bootstrap.col3 : bootstrap.col2,
                styles.tableHeading,
                styles.alignCenterText,
                styles.desc
              )}
            >
              DESCRIPTION
            </p>
            <p
              className={cs(
                mobile ? bootstrap.col3 : bootstrap.col2,
                styles.tableHeading,
                styles.alignCenterText,
                styles.colPoint
              )}
            >
              POINTS
            </p>
            <p
              className={cs(
                bootstrap.col1,
                styles.tableHeading,
                styles.alignCenterText
              )}
            >
              {mobile ? null : "DETAILS"}
            </p>
          </div>
          {records?.map((ele, ind) => (
            <div key={ind}>
              <div key={ind + "t"}>
                <div
                  className={cs(
                    bootstrap.row,
                    styles.tableRow,
                    styles.tableFirstRow
                  )}
                >
                  <div
                    className={cs(
                      bootstrap.col1,
                      styles.alignCenterText,
                      styles.point,
                      {
                        [globalStyles.ceriseBackground]: ele?.EntryType === "Dr"
                      },
                      {
                        [globalStyles.greyBackground]: ele?.EntryType === ""
                      }
                    )}
                  ></div>
                  <p
                    className={cs(
                      mobile ? bootstrap.col3 : bootstrap.col2,
                      styles.alignCenterText,
                      styles.tableHeading,
                      styles.invoice
                    )}
                  >
                    {ele?.DocumentNumber}
                  </p>
                  {mobile ? null : (
                    <p
                      className={cs(
                        bootstrap.col2,
                        styles.tableHeading,
                        styles.alignCenterText
                      )}
                    >
                      {moment(ele?.DocumentDate, "DD/MM/YYYY").format(
                        "DD/MM/YYYY"
                      )}
                    </p>
                  )}
                  {mobile ? null : (
                    <p
                      className={cs(
                        bootstrap.col2,
                        styles.tableHeading,
                        styles.alignCenterText
                      )}
                    >
                      {ele?.Location}
                    </p>
                  )}
                  <p
                    className={cs(
                      mobile ? bootstrap.col3 : bootstrap.col2,
                      styles.tableHeading,
                      styles.alignCenterText,
                      styles.desc
                    )}
                  >
                    {ele?.Description}
                    {/* {ele?.isGst && ele?.Description == "NA" ? (
                      <>
                        &nbsp;&nbsp;&nbsp;
                        <div
                          id={ind + "t"}
                          className={styles.tooltip}
                          ref={impactRef}
                        >
                          <img
                            src={
                              showTip?.id === ind + "t" && showTip.state
                                ? tooltipOpenIcon
                                : tooltipIcon
                            }
                            onClick={e => {
                              debugger;
                              e.stopPropagation();
                              e.preventDefault();
                              setShowTip({
                                id: ind + "t",
                                state: !showTip["state"]
                              });
                            }}
                          />
                          <div
                            className={cs(styles.tooltipMsg, {
                              [styles.show]:
                                showTip?.id === ind + "t" && showTip.state
                            })}
                          >
                            No cerise loyalty points were earned on this order
                            as it was billed with GST */}
                    {/* <Link
                              className={cs(styles.tooltipLink, {
                                [styles.show]: showTip
                              })}
                              to="/account/my-orders"
                            >
                              order details
                            </Link> */}
                    {/* </div>
                        </div>
                      </>
                    ) : (
                      ""
                    )} */}
                  </p>
                  <p
                    className={cs(
                      mobile ? bootstrap.col3 : bootstrap.col2,
                      styles.tableHeading,
                      styles.alignCenterText,
                      styles.colPoint,
                      {
                        [globalStyles.cerise]: ele?.EntryType === "Dr"
                      },
                      { [globalStyles.greyColor]: ele?.EntryType === "" }
                    )}
                  >
                    {ele?.EntryType !== ""
                      ? `[${ele?.EntryType === "Dr" ? "-" : "+"}] ${
                          ele?.Points
                        }`
                      : ele?.Points}
                  </p>
                  {ele?.Description !== "Welcome Bonus" && (
                    <p
                      className={cs(
                        bootstrap.col1,
                        styles.alignCenterText,
                        styles.iconCarrot
                      )}
                    >
                      <span
                        className={
                          openStateId["id"] === ind + "t" &&
                          openStateId["state"]
                            ? styles.active
                            : ""
                        }
                        onClick={() => {
                          handleAnimation(
                            ind + "t",
                            openStateId["id"] === ind + "t"
                              ? !openStateId["state"]
                              : true
                          );
                        }}
                      ></span>
                    </p>
                  )}
                </div>
                <div
                  id={ind + "t"}
                  className={cs(
                    bootstrap.row,
                    styles.tableRow,
                    styles.tableSecondRow,
                    openStateId["id"] === ind + "t" && openStateId["state"]
                      ? styles.active
                      : styles.inactive
                  )}
                >
                  <>
                    {ele?.EntryType === "Cr" || mobile ? (
                      <div className={styles.innerDetailsWrp}>
                        {mobile ? (
                          <div className={styles.innerDetails}>
                            <p className={styles.head}>Date</p>
                            <p className={styles.desc}>{ele?.DocumentDate}</p>
                          </div>
                        ) : null}
                        {ele?.EntryType === "Cr" ? (
                          <div
                            style={{ textAlign: "right" }}
                            className={styles.innerDetails}
                          >
                            <p className={styles.head}>
                              Net eligible amount for earning points
                            </p>
                            <p className={styles.desc}>{ele?.NetEligibleAmt}</p>
                          </div>
                        ) : null}
                      </div>
                    ) : null}

                    {mobile ? (
                      <div className={styles.innerDetailsWrp}>
                        <div className={styles.innerDetails}>
                          <p className={styles.head}>Location</p>
                          <p className={styles.desc}>{ele?.Location}</p>
                        </div>
                      </div>
                    ) : null}
                  </>

                  <table className={cs(styles.col12)}>
                    <tr className={cs(styles.firstTd)}>
                      <th>Items</th>
                      <th className={cs(styles.alignCenterText)}>Price</th>
                      <th className={cs(styles.alignCenterText)}>
                        Eligible for Loyalty
                      </th>
                    </tr>
                    {ele?.ItemDetail.map((e, index) => (
                      <tr key={index}>
                        <td className={cs(styles.firstTd)}>
                          {e?.ItemName} | QTY {e?.ItemQuantity}
                        </td>
                        <td className={cs(styles.alignCenterText)}>
                          ₹ {e?.ItemValue}
                        </td>
                        <td className={cs(styles.alignCenterText)}>
                          {e?.ItemEligiblity === "Yes" ? (
                            <img src={True} />
                          ) : (
                            <img src={Close} />
                          )}
                        </td>
                      </tr>
                    ))}
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          className={cs(styles.orderLink, {
            [styles.floatLeft]: total_records > 10
          })}
        >
          <Link to="/account/my-orders">View all Order details</Link>
        </div>

        {total_records > 10 && (
          <div className={styles.pagination}>
            <p
              className={previouspage ? "" : styles.inactive}
              onClick={() => {
                onPageClick(currentPage - 1);
                scrollToGivenId("transaction");
              }}
            ></p>
            {[...Array(Number(total_pages)).keys()].map((ele, ind) => (
              <p
                key={ind}
                className={currentPage === ele + 1 ? styles.active : ""}
                onClick={() => {
                  onPageClick(ele + 1);
                  scrollToGivenId("transaction");
                }}
              >
                {ele + 1}
              </p>
            ))}
            <p
              className={nextpage ? "" : styles.inactive}
              onClick={() => {
                onPageClick(currentPage + 1);
                scrollToGivenId("transaction");
              }}
            ></p>
          </div>
        )}
        {isLoading && <Loader />}
      </div>
      <div className={styles.tableFooter}>
        <div className={styles.tableFooterLeft}>
          <div className={styles.tableLables}>
            <div className={styles.footerLabel}>
              <p className={styles.point}></p>
              <p className={styles.label}>Points Earned</p>
            </div>
            <div className={styles.footerLabel}>
              <p
                className={cs(styles.point, globalStyles.ceriseBackground)}
              ></p>
              <p className={styles.label}>Points Redeemed</p>
            </div>
            <div className={styles.footerLabel}>
              <p className={cs(styles.point, globalStyles.greyBackground)}></p>
              <p className={styles.label}>Not Available</p>
            </div>
          </div>
          <div className={styles.footerLine}>
            To request a statement older than 1 year, contact{" "}
            <a href={`mailto:customercare@goodearth.in`}>Customer Care.</a>
          </div>
        </div>
        <div className={styles.downloadLink} onClick={() => downloadPdf()}>
          <img src={Download}></img>
          <button>Download Statement PDF</button>
        </div>
      </div>
    </>
  );
};

export default TransactionTable;
