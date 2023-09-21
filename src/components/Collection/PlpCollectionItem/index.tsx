import React from "react";
import { Link } from "react-router-dom";
import styles from "./style.scss";
import { PlpCollectionItems } from "./typing";

const PlpCollectionItem: React.FC<PlpCollectionItems> = ({
  collectionData,
  key
}) => {
  const { sliderImages, tags, name, url } = collectionData;

  return (
    <div key={key} className={styles.moreCollectionImg}>
      <Link
        to={{
          pathname: url || "#"
        }}
      >
        <img src={sliderImages?.[0]} alt="collection-img" width="200" />
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
            pathname: url || "#"
          }}
        >
          <h3 className={styles.name}>{name}</h3>
        </Link>
      </div>
    </div>
  );
};

export default PlpCollectionItem;
