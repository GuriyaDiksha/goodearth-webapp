import React from "react";
import styles from "./style.scss";
import { CollectionItems } from "./typing";
import ReactHtmlParser from "react-html-parser";
import CollectionImageSlider from "../CollectionImageSlider";
import { Link } from "react-router-dom";
import CookieService from "services/cookie";
import { GA_CALLS } from "constants/cookieConsent";

const CollectionItem: React.FC<CollectionItems> = ({
  key,
  collectionData,
  activeFilterHandler
}) => {
  const {
    name,
    longDescription,
    sliderImages,
    tags = [],
    shortDescription,
    url,
    id
  } = collectionData;

  const onClickGaEvents = () => {
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({
        event: "collection_click",
        filter_name: tags?.join("|"),
        click_type: name
      });
    }
  };

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
        onClickGaEvents={onClickGaEvents}
      />
      <div className={styles.collectionItemContent}>
        <div className={styles.tagWrp}>
          {tags?.map((tag: string, i: number) => (
            <p
              key={i}
              className={styles.tag}
              onClick={() => activeFilterHandler(tag)}
            >
              {tag}
            </p>
          ))}
        </div>
        <Link
          to={{
            pathname: url || "#"
          }}
          onClick={() => onClickGaEvents()}
        >
          <h3 className={styles.title}>{name}</h3>
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
          onClick={() => onClickGaEvents()}
        >
          SHOW MORE
        </Link>
      </div>
    </div>
  );
};

export default CollectionItem;
