import React from "react";
import styles from "../../styles/bootstrap/bootstrap-grid.scss";
import CollectionImage from "./index";
import { CollectionItem } from "./typings";
import { Settings } from "../../typings/settings";
import mydata from "./dummyData.json";
import cs from "classnames";

export default { title: "collectionImage" };

export const collectionImage = () => {
  const config: Settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          dots: false,
          arrows: false
        }
      }
    ]
  };
  return (
    <div className={cs(styles.row, "collection-item")}>
      <div className={styles.colMd5}>
        <CollectionImage
          data={mydata as CollectionItem}
          setting={config as Settings}
        />
      </div>
    </div>
  );
};
