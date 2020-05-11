import React from "react";
import { Link } from "react-router-dom";
import cs from "classnames";
import styles from "./styles.scss";
import globalStyles from "../../styles/global.scss";
import bootstrapStyles from "../../styles/bootstrap/bootstrap-grid.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../styles/myslick.css";
import "./slick.css";
import { MoreCollectionSliderProps, MoreCollectionItem } from "./typings";
import Slider from "react-slick";

const MoreCollectionImage: React.FC<MoreCollectionSliderProps> = (
  props: MoreCollectionSliderProps
) => {
  const { data, setting, mobile } = props;
  return (
    <div
      className={cs(bootstrapStyles.colMd12, "more-collection", {
        "mobile-slider": mobile
      })}
    >
      <div className={bootstrapStyles.row}>
        <h2 className={cs(styles.header, globalStyles.voffset5)}>
          more from this collection
        </h2>

        <div className={bootstrapStyles.col12}>
          <Slider {...setting} className="pdp-slider recommend-block">
            {(data as MoreCollectionItem[])?.map(
              (item: MoreCollectionItem, i: number) => {
                return (
                  <div key={item.id}>
                    {item.badgeImage ? (
                      <div className="badge_position_plp">
                        <img src={item.badgeImage} />
                      </div>
                    ) : (
                      ""
                    )}
                    <Link to={item.url}>
                      <img
                        src={item.image || "/static/img/noimageplp.png"}
                        className={cs(
                          globalStyles.imgResponsive,
                          styles.sliderImage
                        )}
                      />
                    </Link>
                    <div className={styles.moreBlock}>
                      <p className={styles.productH}>{item.collection}</p>
                      <p className={styles.productN}>
                        <Link to={item.url}> {item.title} </Link>
                      </p>
                    </div>
                  </div>
                );
              }
            )}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default MoreCollectionImage;
