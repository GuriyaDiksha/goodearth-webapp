import React from "react";
import styles from "../../styles/bootstrap/bootstrap-grid.scss";
import WeRecommend from "./index";
import { Settings } from "../../typings/settings";
import mydata from "./moreData.json";
import cs from "classnames";

export default { title: "WeRecommended" };

export const weRecommended = () => {
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
    <div className={styles.row}>
      <div className={cs(styles.colMd8, styles.offset2)}>
        <WeRecommend
          data={mydata as []}
          setting={config as Settings}
          currency={"INR"}
        />
      </div>
    </div>
  );
};
