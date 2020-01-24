import React from "react";
import styles from "./styles.scss";
import "../../styles/myslick.css";
import "./slick.css";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { Currency, currencyCode } from "../../typings/currency";
import { RecommendData, RecommenedSliderProps } from "./typings";
import Slider from "react-slick";

const WeRecommend: React.FC<RecommenedSliderProps> = (
  props: RecommenedSliderProps
) => {
  const { data, setting, currency } = props;
  const code = currencyCode[currency as Currency];
  return (
    <div className={styles.row}>
      <h2>We Recommend</h2>
      <Slider {...setting}>
        {data?.map((item: RecommendData, i: number) => {
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
                <p className={styles.productN}>
                  <span>
                    {" "}
                    {String.fromCharCode(code)}{" "}
                    {item.pricerecords[currency as Currency]}{" "}
                  </span>
                </p>
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default WeRecommend;
