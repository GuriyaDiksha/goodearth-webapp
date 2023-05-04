import React from "react";
import styles from "./style.scss";
import { CollectionItems } from "./typing";
import ReactHtmlParser from "react-html-parser";
import CollectionImageSlider from "../CollectionImageSlider";
import { Link } from "react-router-dom";

const CollectionItem: React.FC<CollectionItems> = ({ key, collectionData }) => {
  const {
    name,
    longDescription,
    sliderImages,
    tags = [],
    shortDescription,
    url,
    id,
    categoryName
  } = collectionData;

  return (
    <div
      className={styles.collectionItemWrp}
      key={key + "collection-item"}
      id={`${id}`}
    >
      <CollectionImageSlider
        sliderImages={sliderImages}
        url={url}
        name={name}
      />
      <div className={styles.collectionItemContent}>
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
          <h3 className={styles.title}>
            {name} {categoryName?.[0]?.name}
          </h3>
        </Link>
        <p className={styles.subTitle}>{ReactHtmlParser(shortDescription)}</p>
        <p className={styles.description}>
          {longDescription &&
            ReactHtmlParser(
              longDescription?.length > 112
                ? longDescription?.slice(0, 112) +
                    longDescription
                      ?.slice(112, longDescription?.length)
                      ?.split(" ")?.[0] +
                    "..."
                : longDescription
            )}
        </p>
        <Link
          to={{
            pathname: url || "#"
          }}
          className={styles.showMore}
        >
          SHOW MORE
        </Link>
      </div>
    </div>
  );
};

export default CollectionItem;
