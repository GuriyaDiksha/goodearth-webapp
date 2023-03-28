import React from "react";
import cs from "classnames";
import styles from "./style.scss";
import { useSelector } from "react-redux";
import { AppState } from "reducers/typings";
import { CollectionFilter } from "./typing";

const CollectionFilter: React.FC<CollectionFilter> = props => {
  const { ActiveFilterHandler } = props;
  const { showTimer } = useSelector((state: AppState) => state.info);

  return (
    <div
      id="secondaryHeader"
      className={cs(styles.collectionFilterPage, {
        [styles.collectionFilterTimer]: showTimer
      })}
    >
      <ul className={styles.collectionFilterWrapper}>
        <li
          className={styles.collectionFilter}
          value="All Collections"
          onClick={() => ActiveFilterHandler("All Collections")}
        >
          All Collections
        </li>
        <li
          className={styles.collectionFilter}
          value="Fine Bone China"
          onClick={e => ActiveFilterHandler("Fine Bone China")}
        >
          Fine Bone China
        </li>
        <li
          className={styles.collectionFilter}
          value="Porcelain"
          onClick={e => ActiveFilterHandler("Porcelain")}
        >
          Porcelain
        </li>
        <li
          className={styles.collectionFilter}
          value="Stoneware"
          onClick={e => ActiveFilterHandler("Stoneware")}
        >
          Stoneware
        </li>
        <li
          className={styles.collectionFilter}
          value="Metal"
          onClick={e => ActiveFilterHandler("Metal")}
        >
          Metal
        </li>
      </ul>
    </div>
  );
};

export default CollectionFilter;
