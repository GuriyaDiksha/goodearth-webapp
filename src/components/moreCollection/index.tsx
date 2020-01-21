import React from "react";
import styles from "./styles.scss";
import "./slick.css";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { MoreCollectionData, MoreCollectionItem } from "./typings";
// import cs from "classnames";
import Slider from "react-slick";

const MoreCollectionImage: React.FC<MoreCollectionData> = (
  props: MoreCollectionData
) => {
  const { data, setting } = props;
  return (
    <div className={styles.row}>
      <h2>more from this collection</h2>
      <Slider {...setting}>
        {(data as MoreCollectionItem[])?.map(
          (item: MoreCollectionItem, i: number) => {
            console.log(item);
            return (
              <div>
                {item.badgeImage ? (
                  <div className="badge_position_plp">
                    <img src={item.badgeImage} />
                  </div>
                ) : (
                  ""
                )}
                <a href={item.productUrl}>
                  <img
                    src={
                      item.productImage
                        ? item.productImage
                        : "/static/img/noimageplp.png"
                    }
                    className={styles.imgResponsive}
                  />
                </a>
                <div className={styles.moreBlock}>
                  <p className={styles.productH}>{item.collectionName}</p>
                  <p className={styles.productN}>
                    <a href={item.productUrl}> {item.productName} </a>
                  </p>
                </div>
              </div>
            );
          }
        )}
      </Slider>
    </div>
  );
};

export default MoreCollectionImage;
