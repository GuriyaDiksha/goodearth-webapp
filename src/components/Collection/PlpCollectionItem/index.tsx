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
      <Link to={url || "#"}>
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
        <h3 className={styles.name}>{name}</h3>
      </div>
    </div>
  );
};

export default PlpCollectionItem;
