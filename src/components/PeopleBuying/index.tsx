import React, { useState } from "react";
import { Link } from "react-router-dom";
import cs from "classnames";
import styles from "./styles.scss";
import globalStyles from "../../styles/global.scss";
import bootstrapStyles from "../../styles/bootstrap/bootstrap-grid.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../styles/myslick.css";
import "./slick.css";

import { Currency, currencyCode } from "../../typings/currency";
import { PeopleRecommend, RecommenedSliderProps } from "./typings";
import Slider from "react-slick";
import WishlistButton from "components/WishlistButton";

const WeRecommend: React.FC<RecommenedSliderProps> = (
  props: RecommenedSliderProps
) => {
  const { data, setting, currency, mobile } = props;
  const code = currencyCode[currency as Currency];
  const [currentId, setCurrentId] = useState(-1);
  const items = data?.map((item: PeopleRecommend, i: number) => {
    return (
      <div
        onMouseEnter={() => setCurrentId(item.id)}
        onMouseLeave={() => setCurrentId(-1)}
        key={item.id}
        className={cs({
          [bootstrapStyles.col6]: mobile,
          [bootstrapStyles.colMd4]: mobile,
          [bootstrapStyles.col12]: !mobile
        })}
      >
        {item.badgeImage ? (
          <div className="badge_position_plp">
            <img src={item.badgeImage} />
          </div>
        ) : (
          ""
        )}
        {(mobile || currentId == item.id) && (
          <div
            className={cs(
              globalStyles.textCenter,
              globalStyles.mobileWishlist,
              {
                [styles.wishlistBtnContainer]: true
              }
            )}
          >
            <WishlistButton
              gtmListType="What People Are Buying"
              title={item.title}
              id={item.id}
              showText={false}
              key={item.id}
              mobile={true}
            />
          </div>
        )}
        <Link to={item.url}>
          <img
            src={item.image ? item.image : "/static/img/noimageplp.png"}
            className={cs(globalStyles.imgResponsive, styles.sliderImage)}
          />
        </Link>
        <div className={styles.moreBlock}>
          <p className={styles.productH}>{item.title}</p>
          <p className={styles.productN}>
            <Link to={item.url}> {item.title} </Link>
          </p>
          <p className={styles.productN}>
            <span>{item.country}</span>
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
