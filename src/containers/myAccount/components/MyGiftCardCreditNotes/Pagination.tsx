import React from "react";
import styles from "./styles.scss";
import cs from "classnames";
import paginationLeftIcon from "../../../../images/myCreditNotes/paginationLeft.svg";
import paginationRightIcon from "../../../../images/myCreditNotes/paginationRight.svg";

type Props = {
  previous: string | null;
  next: string | null;
  count: number;
  page: number;
  fetchPaginatedData: (z: number) => void;
  collapseExpandItemOnPageChange: () => void;
};

const Pagination: React.FC<Props> = ({
  previous,
  next,
  count,
  fetchPaginatedData,
  collapseExpandItemOnPageChange,
  page
}) => {
  const totalPages = Math.ceil(count / 5);

  // Calculate the visible range of pages
  const getVisiblePages = () => {
    let startPage, endPage;
    if (totalPages <= 7) {
      // If total pages are less than or equal to 7, show all pages
      startPage = 1;
      endPage = totalPages;
    } else {
      // Calculate start and end pages based on current page
      startPage = Math.max(1, page); // Start 3 pages before current
      endPage = Math.min(totalPages, startPage + 6); // Show 7 pages

      // Adjust start page if end page exceeds total
      if (endPage - startPage < 6) {
        startPage = Math.max(1, endPage - 6);
      }
    }
    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };

  const visiblePages = getVisiblePages();

  return (
    <div className={styles.paginationWrp}>
      <div className={styles.pagination}>
        <p
          className={cs(
            page === 1 ? styles.disabled : "",
            styles.paginationArrow
          )}
          onClick={() => {
            if (previous) {
              fetchPaginatedData(page - 1);
              collapseExpandItemOnPageChange();
            }
          }}
        >
          <img src={paginationLeftIcon} alt="paginationLeftIcon" />
        </p>
        {/* {[...Array(Number(Math.ceil(count / 5))).keys()].map((ele, ind) => (
          <p
            key={ind}
            className={page === ele + 1 ? styles.active : ""}
            onClick={() => {
              fetchPaginatedData(ele + 1);
              collapseExpandItemOnPageChange();
            }}
          >
            {ele + 1}
          </p>
        ))} */}
        {visiblePages.map(pageNum => (
          <p
            key={pageNum}
            className={page === pageNum ? styles.active : ""}
            onClick={() => {
              fetchPaginatedData(pageNum);
              collapseExpandItemOnPageChange();
            }}
          >
            {pageNum}
          </p>
        ))}
        <p
          className={cs(
            page === totalPages ? styles.disabled : "",
            styles.paginationArrow
          )}
          onClick={() => {
            if (next) {
              fetchPaginatedData(page + 1);
              collapseExpandItemOnPageChange();
            }
          }}
        >
          <img src={paginationRightIcon} alt="paginationRightIcon" />
        </p>
      </div>
    </div>
  );
};

export default Pagination;
