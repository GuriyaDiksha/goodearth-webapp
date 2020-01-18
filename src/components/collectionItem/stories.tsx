import React from "react";
import styles from "../../styles/bootstrap/bootstrap-grid.scss";
import CollectionImage from "./index";
import { CollectionItem, Settings } from "./typings";
import mydata from "./dummyData.json";

export default { title: "collectionImage" };

export const collectionImage = () => {
  const config: Settings = {
    dots: false,
    infinite: true,
    speed: 500,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          dots: false,
          arrows: true
        }
      }
    ]
  };
  return (
    <div className={styles.row}>
      <div className={styles.colMd5}>
        <CollectionImage
          data={mydata as CollectionItem}
          setting={config as Settings}
        />
      </div>
    </div>
  );
};
