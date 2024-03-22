import React from "react";
import styles from "./styles.scss";

type Props = {
  previous: string | null;
  next: string | null;
  count: number;
  page: number;
  fetchPaginatedData: (z: number) => void;
};

const Pagination: React.FC<Props> = ({
  previous,
  next,
  count,
  fetchPaginatedData,
  page
}) => {
  return (
    <div className={styles.paginationWrp}>
      <div className={styles.pagination}>
        <p
          className={previous ? "" : styles.inactive}
          onClick={() => previous && fetchPaginatedData(page - 1)}
        ></p>
        {[...Array(Number(Math.ceil(count / 5))).keys()].map((ele, ind) => (
          <p
            key={ind}
            className={page === ele + 1 ? styles.active : ""}
            onClick={() => fetchPaginatedData(ele + 1)}
          >
            {ele + 1}
          </p>
        ))}
        <p
          className={next ? "" : styles.inactive}
          onClick={() => next && fetchPaginatedData(page + 1)}
        ></p>
      </div>
    </div>
  );
};

export default Pagination;
