import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./style.scss";
import { PlpCollectionItems } from "./typing";

const PlpCollectionItem: React.FC<PlpCollectionItems> = ({
  collectionData,
  key
}) => {
  const { sliderImages, tags, name, url } = collectionData;

  const { search, pathname } = useLocation();

  const vars: { tags?: string } = {};
  const re = /[?&]+([^=&]+)=([^&]*)/gi;
  let match;

  while ((match = re.exec(search))) {
    vars[match[1]] = match[2];
  }

  return (
    <div key={key} className={styles.moreCollectionImg}>
      <Link
        to={{
          pathname: url || "#",
          search: "?tags=" + `${vars.tags || "All Collections"}`,
          state: { prevPath: `${pathname}` }
        }}
      >
        <img src={sliderImages?.[0]} alt="collection-img" />
      </Link>
      <div className={styles.textWrp}>
        <div className={styles.tagWrp}>
          {tags?.map((tag: string, i: number) => (
            <p key={i} className={styles.tag}>
              {tag}
            </p>
          ))}
        </div>
        <Link
          to={{
            pathname: url || "#",
            search: "?tags=" + `${vars.tags || "All Collections"}`,
            state: { prevPath: `${pathname}` }
          }}
        >
          <h3 className={styles.name}>{name}</h3>
        </Link>
      </div>
    </div>
  );
};

export default PlpCollectionItem;
