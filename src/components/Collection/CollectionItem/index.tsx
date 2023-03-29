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
    tags,
    shortDescription,
    url
  } = collectionData;

  return (
    <div className={styles.collectionItemWrp} key={key + "collection-item"}>
      <CollectionImageSlider
        sliderImages={sliderImages}
        url={url}
        name={name}
      />
      <div className={styles.collectionItemContent}>
        <div>
          {tags?.map((tag: string, i: number) => (
            <p key={i} className={styles.tag}>
              {tag}
            </p>
          ))}
        </div>
        <h3 className={styles.title}>{name}</h3>
        <p className={styles.subTitle}>{ReactHtmlParser(shortDescription)}</p>
        <p className={styles.description}>
          {ReactHtmlParser(
            longDescription.length > 112
              ? longDescription.slice(0, 112) + "..."
              : longDescription
          )}
        </p>
        <Link to={url || "#"} className={styles.showMore}>
          SHOW MORE
        </Link>
      </div>
    </div>
  );
};

export default CollectionItem;
