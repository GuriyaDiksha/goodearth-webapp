import React from "react";
import styles from "../../styles/bootstrap/bootstrap-grid.scss";

import PlpResultItem from "./index";

export default { title: "PLP" };
import data from "./dummyData.json";
import { PLPProductItem } from "../../typings/product";

export const PlpResult = () => {
  return (
    <div className={styles.row}>
      <div className={styles.colMd4}>
        <PlpResultItem
          product={data as PLPProductItem}
          addedToWishlist={false}
          currency={"INR"}
        />
      </div>
    </div>
  );
};
