import React from "react";
import cs from "classnames";
import styles from "./style.scss";
import { useSelector } from "react-redux";
import { AppState } from "reducers/typings";
import { CollectionFilter } from "./typing";
import iconStyles from "./../../../styles/iconFonts.scss";

const CollectionFilter: React.FC<CollectionFilter> = ({
  tags,
  activeFilterList,
  activeFilterHandler
}) => {
  const { showTimer } = useSelector((state: AppState) => state.info);
  return (
    <div
      id="secondaryHeader"
      className={cs(styles.collectionFilterPage, {
        [styles.collectionFilterTimer]: showTimer
      })}
    >
      <ul className={styles.collectionFilterWrapper}>
        {["All Collections", ...tags]?.map((tag, i) => (
          <li
            className={cs(styles.collectionFilter, {
              [styles.active]: activeFilterList.includes(tag)
            })}
            value={tag}
            onClick={e => activeFilterHandler(tag)}
            key={i + "tag-filter"}
          >
            <div>{tag}</div>
            {tag !== "All Collections" && activeFilterList.includes(tag) && (
              <div className={styles.cross}>
                <i
                  className={cs(
                    iconStyles.icon,
                    iconStyles.iconCrossNarrowBig,
                    styles.icon,
                    styles.iconCross
                  )}
                ></i>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CollectionFilter;
