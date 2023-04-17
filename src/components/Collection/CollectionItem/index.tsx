import React from "react";
import styles from "./style.scss";
import { CollectionItems } from "./typing";
import ReactHtmlParser from "react-html-parser";
import CollectionImageSlider from "../CollectionImageSlider";
import { Link, useLocation } from "react-router-dom";

const CollectionItem: React.FC<CollectionItems> = ({ key, collectionData }) => {
  const {
    name,
    longDescription,
    sliderImages,
    tags = [],
    shortDescription,
    url,
    id
  } = collectionData;
  const { search, pathname } = useLocation();

  const vars: { tags?: string } = {};
  const re = /[?&]+([^=&]+)=([^&]*)/gi;
  let match;

  while ((match = re.exec(search))) {
    vars[match[1]] = match[2];
  }

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
        <h3 className={styles.title}>{name}</h3>
        <p className={styles.subTitle}>{ReactHtmlParser(shortDescription)}</p>
        <p className={styles.description}>
          {longDescription &&
            ReactHtmlParser(
              longDescription?.length > 112
                ? longDescription?.slice(0, 112) + "..."
                : longDescription
            )}
        </p>
        <Link
          to={{
            pathname: url || "#",
            search: "?tags=" + `${vars.tags || "All Collections"}`,
            state: { prevPath: `${pathname}` }
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
