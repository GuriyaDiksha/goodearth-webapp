import React, { useEffect, useMemo } from "react";
import cs from "classnames";
import styles from "./style.scss";
import { useSelector } from "react-redux";
import { AppState } from "reducers/typings";
import { CollectionFilter } from "./typing";
import iconStyles from "./../../../styles/iconFonts.scss";
import CookieService from "services/cookie";
import { GA_CALLS } from "constants/cookieConsent";

const CollectionFilter: React.FC<CollectionFilter> = ({
  tags,
  activeFilterList,
  activeFilterHandler
}) => {
  const { showTimer } = useSelector((state: AppState) => state.info);

  //Memoized value for ga events
  const activeFilters = useMemo(() => {
    const filter = [...activeFilterList];
    const tempTags = [...tags];
    return filter.includes("All Collections")
      ? tempTags.join("|")
      : filter.join("|");
  }, [activeFilterList, tags]);

  useEffect(() => {
    //GA events added
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS) && activeFilters) {
      dataLayer.push({
        event: "collection_filter",
        filter_value: activeFilters
      });
    }
  }, [activeFilters]);

  return (
    <div
      id="secondaryHeader"
      className={cs(styles.collectionFilterPage, {
        [styles.collectionFilterTimer]: showTimer
      })}
    >
      <ul id="tagList" className={styles.collectionFilterWrapper}>
        {["All Collections", ...tags]?.map((tag, i) => (
          <li
            className={cs(styles.collectionFilter, {
              [styles.active]: activeFilterList.includes(tag)
            })}
            id={tag}
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
