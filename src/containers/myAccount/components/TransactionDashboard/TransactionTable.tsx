import React, { useState } from "react";
import FilterDropdown from "./FilterDropdown";
import bootstrap from "../../../../styles/bootstrap/bootstrap-grid.scss";
import Close from "./../../../../icons/imastClose.svg";
import True from "./../../../../icons/imastTrue.svg";
import Download from "./../../../../images/imastDownload.svg";
import dateSort from "./../../../../icons/dateSort.svg";
import styles from "./styles.scss";
import cs from "classnames";
import { Link } from "react-router-dom";

type Props = {
  mobile: boolean;
};
const TransactionTable = ({ mobile }: Props) => {
  const [openStateId, setOpenStateId] = useState({ id: 0, state: true });
  const [dropDownValue, setDropdownValue] = useState("Last 3 months");
  const [dropDownValue2, setDropdownValue2] = useState("All transactions");

  return (
    <>
      <div className={styles.transactionTableBackground}>
        <div className={styles.transactionTableHeader}>
          {mobile ? null : <div className={styles.heading}>Filter by</div>}
          <FilterDropdown
            id="sort-filter"
            className="first-filter"
            items={[
              {
                label: "Last 3 months",
                value: "Last 3 months",
                id: 1
              },
              {
                label: "Last 6 months",
                value: "Last 6 months",
                id: 2
              },
              {
                label: "Last 1 year",
                value: "Last 1 year",
                id: 3
              }
            ]}
            value={dropDownValue}
            onChange={(val: string) => {
              setDropdownValue(val);
            }}
            isCheckBox={false}
          />
          <FilterDropdown
            id="transaction-filter"
            items={[
              {
                label: "All transactions",
                value: "All transactions",
                id: 1
              },
              {
                label: "Earned",
                value: "Earned",
                id: 2
              },
              {
                label: "Redeemed",
                value: "Redeemed",
                id: 3
              }
            ]}
            value={dropDownValue2}
            onChange={(val: string) => {
              setDropdownValue2(val);
            }}
            isCheckBox={true}
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
                Date
                <span>
                  <img src={dateSort} />
                </span>
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

          <>
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
                  styles.point
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
                204129244008
              </p>
              {mobile ? null : (
                <p
                  className={cs(
                    bootstrap.col2,
                    styles.tableHeading,
                    styles.alignCenterText
                  )}
                >
                  30/01/2022
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
                  Saket, New Delhi
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
                Points Earned
              </p>
              <p
                className={cs(
                  mobile ? bootstrap.col3 : bootstrap.col2,
                  styles.tableHeading,
                  styles.alignCenterText,
                  styles.colPoint
                )}
              >
                [+] 100
              </p>
              <p
                className={cs(
                  bootstrap.col1,
                  styles.alignCenterText,
                  styles.iconCarrot
                )}
              >
                <span
                  className={
                    openStateId["id"] === 0 && openStateId["state"]
                      ? styles.active
                      : ""
                  }
                  onClick={() => {
                    setOpenStateId({
                      id: 0,
                      state:
                        openStateId["id"] === 0 ? !openStateId["state"] : true
                    });
                  }}
                ></span>
              </p>
            </div>
            <div
              className={cs(
                bootstrap.row,
                styles.tableRow,
                styles.tableSecondRow,
                openStateId["id"] === 0 && openStateId["state"]
                  ? styles.active
                  : styles.inactive
              )}
            >
              {mobile ? (
                <>
                  <div className={styles.innerDetails}>
                    <p className={styles.head}>Date</p>
                    <p className={styles.desc}>30/01/2022</p>
                  </div>
                  <div className={styles.innerDetails}>
                    <p className={styles.head}>Location</p>
                    <p className={styles.desc}>Rhaghuvanshi Mills, Mumbai</p>
                  </div>
                </>
              ) : null}
              <table className={cs(styles.col12)}>
                <tr className={cs(styles.firstTd)}>
                  <th>Items</th>
                  <th className={cs(styles.alignCenterText)}>Price</th>
                  <th className={cs(styles.alignCenterText)}>
                    Eligible for Loyalty
                  </th>
                </tr>
                <tr>
                  <td className={cs(styles.firstTd)}>
                    Set Of 2- Pomegranates & Roses Dessert Plates | QTY 3
                  </td>
                  <td className={cs(styles.alignCenterText)}>₹ 10,000</td>
                  <td className={cs(styles.alignCenterText)}>
                    <img src={Close}></img>
                  </td>
                </tr>
                <tr>
                  <td className={cs(styles.firstTd)}>
                    Set Of 2- Pomegranates & Roses Dessert Plates | QTY 3
                  </td>
                  <td className={cs(styles.alignCenterText)}>₹ 10,000</td>
                  <td className={cs(styles.alignCenterText)}>
                    <img src={True}></img>
                  </td>
                </tr>
              </table>
            </div>
          </>
          <>
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
                  styles.point
                )}
              ></div>
              <p
                className={cs(
                  mobile ? bootstrap.col3 : bootstrap.col2,
                  styles.alignCenterText,
                  styles.tableHeading
                )}
              >
                204129244008
              </p>
              {mobile ? null : (
                <p
                  className={cs(
                    bootstrap.col2,
                    styles.tableHeading,
                    styles.alignCenterText
                  )}
                >
                  30/01/2022
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
                  Saket, New Delhi
                </p>
              )}
              <p
                className={cs(
                  mobile ? bootstrap.col3 : bootstrap.col2,
                  styles.tableHeading,
                  styles.alignCenterText
                )}
              >
                Points Earned
              </p>
              <p
                className={cs(
                  mobile ? bootstrap.col3 : bootstrap.col2,
                  styles.tableHeading,
                  styles.alignCenterText
                )}
              >
                [+] 100
              </p>
              <p
                className={cs(
                  bootstrap.col1,
                  styles.alignCenterText,
                  styles.iconCarrot
                )}
              >
                <span
                  className={
                    openStateId["id"] === 0 && openStateId["state"]
                      ? styles.active
                      : ""
                  }
                  onClick={() => {
                    setOpenStateId({
                      id: 0,
                      state:
                        openStateId["id"] === 0 ? !openStateId["state"] : true
                    });
                  }}
                ></span>
              </p>
            </div>
            <div
              className={cs(
                bootstrap.row,
                styles.tableRow,
                styles.tableSecondRow,
                openStateId["id"] === 0 && openStateId["state"]
                  ? styles.active
                  : styles.inactive
              )}
            >
              {mobile ? (
                <>
                  <div className={styles.innerDetails}>
                    <p className={styles.head}>Date</p>
                    <p className={styles.desc}>30/01/2022</p>
                  </div>
                  <div className={styles.innerDetails}>
                    <p className={styles.head}>Location</p>
                    <p className={styles.desc}>Rhaghuvanshi Mills, Mumbai</p>
                  </div>
                </>
              ) : null}
              <table className={cs(styles.col12)}>
                <tr className={cs(styles.firstTd)}>
                  <th>Items</th>
                  <th className={cs(styles.alignCenterText)}>Price</th>
                  <th className={cs(styles.alignCenterText)}>
                    Eligible for Loyalty
                  </th>
                </tr>
                <tr>
                  <td className={cs(styles.firstTd)}>
                    Set Of 2- Pomegranates & Roses Dessert Plates | QTY 3
                  </td>
                  <td className={cs(styles.alignCenterText)}>₹ 10,000</td>
                  <td className={cs(styles.alignCenterText)}>
                    <img src={Close}></img>
                  </td>
                </tr>
                <tr>
                  <td className={cs(styles.firstTd)}>
                    Set Of 2- Pomegranates & Roses Dessert Plates | QTY 3
                  </td>
                  <td className={cs(styles.alignCenterText)}>₹ 10,000</td>
                  <td className={cs(styles.alignCenterText)}>
                    <img src={True}></img>
                  </td>
                </tr>
              </table>
            </div>
          </>
          <>
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
                  styles.point
                )}
              ></div>
              <p
                className={cs(
                  mobile ? bootstrap.col3 : bootstrap.col2,
                  styles.alignCenterText,
                  styles.tableHeading
                )}
              >
                204129244008
              </p>
              {mobile ? null : (
                <p
                  className={cs(
                    bootstrap.col2,
                    styles.tableHeading,
                    styles.alignCenterText
                  )}
                >
                  30/01/2022
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
                  Saket, New Delhi
                </p>
              )}
              <p
                className={cs(
                  mobile ? bootstrap.col3 : bootstrap.col2,
                  styles.tableHeading,
                  styles.alignCenterText
                )}
              >
                Points Earned
              </p>
              <p
                className={cs(
                  mobile ? bootstrap.col3 : bootstrap.col2,
                  styles.tableHeading,
                  styles.alignCenterText
                )}
              >
                [+] 100
              </p>
              <p
                className={cs(
                  bootstrap.col1,
                  styles.alignCenterText,
                  styles.iconCarrot
                )}
              >
                <span
                  className={
                    openStateId["id"] === 0 && openStateId["state"]
                      ? styles.active
                      : ""
                  }
                  onClick={() => {
                    setOpenStateId({
                      id: 0,
                      state:
                        openStateId["id"] === 0 ? !openStateId["state"] : true
                    });
                  }}
                ></span>
              </p>
            </div>
            <div
              className={cs(
                bootstrap.row,
                styles.tableRow,
                styles.tableSecondRow,
                openStateId["id"] === 0 && openStateId["state"]
                  ? styles.active
                  : styles.inactive
              )}
            >
              {mobile ? (
                <>
                  <div className={styles.innerDetails}>
                    <p className={styles.head}>Date</p>
                    <p className={styles.desc}>30/01/2022</p>
                  </div>
                  <div className={styles.innerDetails}>
                    <p className={styles.head}>Location</p>
                    <p className={styles.desc}>Rhaghuvanshi Mills, Mumbai</p>
                  </div>
                </>
              ) : null}
              <table className={cs(styles.col12)}>
                <tr className={cs(styles.firstTd)}>
                  <th>Items</th>
                  <th className={cs(styles.alignCenterText)}>Price</th>
                  <th className={cs(styles.alignCenterText)}>
                    Eligible for Loyalty
                  </th>
                </tr>
                <tr>
                  <td className={cs(styles.firstTd)}>
                    Set Of 2- Pomegranates & Roses Dessert Plates | QTY 3
                  </td>
                  <td className={cs(styles.alignCenterText)}>₹ 10,000</td>
                  <td className={cs(styles.alignCenterText)}>
                    <img src={Close}></img>
                  </td>
                </tr>
                <tr>
                  <td className={cs(styles.firstTd)}>
                    Set Of 2- Pomegranates & Roses Dessert Plates | QTY 3
                  </td>
                  <td className={cs(styles.alignCenterText)}>₹ 10,000</td>
                  <td className={cs(styles.alignCenterText)}>
                    <img src={True}></img>
                  </td>
                </tr>
              </table>
            </div>
          </>
        </div>

        <div className={styles.pagination}>
          <p></p>
          <p className={styles.active}>1</p>
          <p>2</p>
          <p>3</p>
          <p>4</p>
          <p></p>
        </div>
      </div>
      <div className={styles.tableFooter}>
        <div className={styles.tableFooterLeft}>
          <div className={styles.tableLables}>
            <div className={styles.footerLabel}>
              <p className={styles.point}></p>
              <p className={styles.label}>Points Earned</p>
            </div>
            <div className={styles.footerLabel}>
              <p className={styles.point}></p>
              <p className={styles.label}>Points Redeemed</p>
            </div>
          </div>
          <div className={styles.footerLine}>
            To request a statement older than 1 year, contact{" "}
            <Link to="/">Customer Care.</Link>
          </div>
        </div>
        <div className={styles.downloadLink}>
          <img src={Download}></img>
          <button>Download Statment PDF</button>
        </div>
      </div>
    </>
  );
};

export default TransactionTable;
