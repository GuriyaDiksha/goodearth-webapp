import React from "react";
import styles from "./styles.scss";

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
          className={previous ? "" : styles.inactive}
          onClick={() => {
            if (previous) {
              fetchPaginatedData(page - 1);
              collapseExpandItemOnPageChange();
            }
          }}
        ></p>
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
          className={next ? "" : styles.inactive}
          onClick={() => {
            if (next) {
              fetchPaginatedData(page + 1);
              collapseExpandItemOnPageChange();
            }
          }}
        ></p>
      </div>
    </div>
  );
};

export default Pagination;
