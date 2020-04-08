import React from "react";
import cs from "classnames";
import styles from "./styles.scss";
import globalStyles from "../../styles/global.scss";
import bootstrapStyles from "../../styles/bootstrap/bootstrap-grid.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../styles/myslick.css";
import "./slick.css";

import { Currency, currencyCode } from "../../typings/currency";
import { RecommendData, RecommenedSliderProps } from "./typings";
import Slider from "react-slick";
import WishlistButton from "components/WishlistButton";

const WeRecommend: React.FC<RecommenedSliderProps> = (
  props: RecommenedSliderProps
) => {
  const { data, setting, currency, mobile } = props;
  const code = currencyCode[currency as Currency];

  const items = data?.map((item: RecommendData, i: number) => {
    return (
      <div
        key={item.id}
        className={cs({
          [bootstrapStyles.col6]: mobile,
          [bootstrapStyles.colMd4]: mobile
        })}
      >
        {item.badgeImage ? (
          <div className="badge_position_plp">
            <img src={item.badgeImage} />
          </div>
        ) : (
          ""
        )}
        {mobile && (
          <div
            className={cs(
              globalStyles.textCenter,
              globalStyles.mobileWishlist,
              {
                [styles.wishlistBtnContainer]: mobile
              }
            )}
          >
            <WishlistButton
              id={item.id}
              showText={false}
              key={item.id}
              mobile={mobile}
            />
          </div>
        )}
        <a href={item.productUrl}>
          <img
            src={
              item.productImage
                ? item.productImage
                : "/static/img/noimageplp.png"
            }
            className={cs(globalStyles.imgResponsive, styles.sliderImage)}
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
  });
  return (
    <div
      className={cs(
        styles.recommendBg,
        bootstrapStyles.colMd12,
        "we-recommend"
      )}
    >
      <div className={cs(bootstrapStyles.colMd8, bootstrapStyles.offsetMd2)}>
        <h2 className={cs(styles.recommendHeader, globalStyles.voffset5)}>
          We Recommend
        </h2>
        <div className={bootstrapStyles.col12}>
          {!mobile && <Slider {...setting}>{items}</Slider>}
          {mobile && <div className={bootstrapStyles.row}>{items}</div>}
        </div>
      </div>
    </div>
  );
};

export default WeRecommend;
