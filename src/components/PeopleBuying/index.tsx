import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import cs from "classnames";
import styles from "./styles.scss";
import globalStyles from "../../styles/global.scss";
import bootstrapStyles from "../../styles/bootstrap/bootstrap-grid.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../styles/myslick.css";
import "./slick.css";

// import { Currency, currencyCode } from "../../typings/currency";
import { PeopleRecommend, RecommenedSliderProps } from "./typings";
import Slider from "react-slick";
import WishlistButton from "components/WishlistButton";
import * as valid from "utils/validate";

const WhatPeopleBuying: React.FC<RecommenedSliderProps> = (
  props: RecommenedSliderProps
) => {
  const { data, setting, mobile, currency } = props;
  const [currentId, setCurrentId] = useState(-1);
  if (typeof document == "undefined") {
    return null;
  }

  useEffect(() => {
    valid.sliderProductImpression(data, "PeopleBuying", currency || "INR");
  }, []);
  const items = data?.map((item: PeopleRecommend, i: number) => {
    return (
      <div
        onMouseEnter={() => setCurrentId(item.id)}
        onMouseLeave={() => setCurrentId(-1)}
        key={item.id}
        className={cs({
          // [bootstrapStyles.col6]: mobile,
          [bootstrapStyles.colMd4]: mobile,
          [bootstrapStyles.col12]: !mobile
        })}
      >
        {item.badgeImage ? (
          <div className={styles.badge_position_plp}>
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
              gtmListType="PeopleBuying"
              title={item.title}
              id={item.id}
              showText={false}
              key={item.id}
              mobile={true}
            />
          </div>
        )}
        <Link
          to={item.url}
          onClick={() =>
            valid.sliderProductClick(item, "PeopleBuying", currency || "INR", i)
          }
        >
          <img
            src={item.image ? item.image : "/static/img/noimageplp.png"}
            className={cs(globalStyles.imgResponsive, styles.sliderImage)}
          />
        </Link>
        <div className={cs(styles.moreBlock, globalStyles.voffset3)}>
          <p className={styles.productN}>
            <Link to={item.url}> {item.title} </Link>
          </p>
          <p className={styles.productH}>{item.country}</p>
        </div>
      </div>
    );
  });
  return (
    <div
      className={cs(
        styles.recommendBg,
        bootstrapStyles.colMd12,
        "people-buying"
      )}
    >
      <div className={cs(bootstrapStyles.colMd12)}>
        <h2 className={cs(styles.recommendHeader, globalStyles.voffset5)}>
          What People Are Buying
        </h2>
        <div
          className={
            mobile
              ? bootstrapStyles.col12
              : cs(bootstrapStyles.col10, bootstrapStyles.offset1)
          }
        >
          {<Slider {...setting}>{items}</Slider>}
          {/* {mobile && <div className={bootstrapStyles.row}>{items}</div>} */}
        </div>
      </div>
    </div>
  );
};

export default WhatPeopleBuying;
