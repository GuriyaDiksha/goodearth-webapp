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
  return (
    <div className={styles.paginationWrp}>
      <div className={styles.pagination}>
        <p
          className={cs(
            previous ? "" : styles.inactive,
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
        {[...Array(Number(Math.ceil(count / 5))).keys()].map((ele, ind) => (
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
        ))}
        <p
          className={cs(next ? "" : styles.inactive, styles.paginationArrow)}
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
