import React from "react";
import styles from "../../styles/bootstrap/bootstrap-grid.scss";
import MoreCollectionImage from "./index";
import mydata from "./moreData.json";
import cs from "classnames";
import { Settings } from "react-slick";

export default { title: "moreCollectionImage" };

export const moreCollectionImage = () => {
  const config: Settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 3,
    initialSlide: 0,
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
    <div className={cs(styles.mr1, styles.row, styles.ml1)}>
      <div className={cs(styles.colMd12, "more-collection")}>
        <MoreCollectionImage data={mydata as []} setting={config} />
      </div>
    </div>
  );
};
