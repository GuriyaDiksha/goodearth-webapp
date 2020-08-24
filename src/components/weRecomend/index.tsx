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
import { RecommendData, RecommenedSliderProps } from "./typings";
import Slider from "react-slick";
import WishlistButton from "components/WishlistButton";
import LazyImage from "components/LazyImage";

const WeRecommend: React.FC<RecommenedSliderProps> = (
  props: RecommenedSliderProps
) => {
  const { data, setting, currency, mobile } = props;
  const code = currencyCode[currency as Currency];
  const [currentId, setCurrentId] = useState(-1);
  const gtmPushWeRecommendClick = (e: any, data: RecommendData, i: number) => {
    // let index = data.categories.length - 1;
    // let category = data.categories[index].replace(/\s/g, '');
    // category = category.replace(/>/g, '/');
    // let cur = this.state.salestatus ? data.discounted}ricerecords[currency] : data.pricerecords[currency];
    localStorage.setItem("list", "We Recommend");
    dataLayer.push({
      event: "productClick",
      ecommerce: {
        currencyCode: currency,
        click: {
          actionField: { list: "We Recommend" },
          products: [
            {
              name: data.productName,
              id: data.id,
              price: data.pricerecords[currency],
              brand: "Goodearth",
              category: "",
              variant: "",
              position: i
            }
          ]
        }
      }
    });
    // if (ga_traking) {
    //     ga('gtm24.send', {
    //             hitType: 'event',
    //             eventCategory: 'Recommendation',
    //             eventAction: this.props.parentsku,
    //             eventLabel: data.sku,
    //             eventValue: data.recommendation_final_score
    //         }
    //     )
    // }
  };
  const withoutZeroPriceData = data?.filter(
    (item: RecommendData, i: number) => {
      return item.pricerecords[currency as Currency] != 0;
    }
  );
  const items = withoutZeroPriceData?.map((item: RecommendData, i: number) => {
    return (
      <div
        onMouseEnter={() => setCurrentId(item.id)}
        onMouseLeave={() => setCurrentId(-1)}
        key={item.id}
        className={cs(styles.slide, {
          [bootstrapStyles.col6]: mobile,
          [bootstrapStyles.colMd4]: mobile,
          [bootstrapStyles.col12]: !mobile
        })}
      >
        {item.badgeImage ? (
          <div className={styles.saleBanner}>
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
              gtmListType="We Recommend"
              id={item.id}
              showText={false}
              key={item.id}
              mobile={true}
            />
          </div>
        )}
        <Link
          to={item.productUrl}
          onClick={e => gtmPushWeRecommendClick(e, item, i)}
        >
          <LazyImage
            aspectRatio="62:93"
            src={
              item.productImage
                ? item.productImage
                : "/static/img/noimageplp.png"
            }
            className={cs(globalStyles.imgResponsive)}
          />
        </Link>
        <div className={styles.moreBlock}>
          <p className={styles.productH}>{item.collectionName}</p>
          <p className={styles.productN}>
            <Link to={item.productUrl}> {item.productName} </Link>
          </p>
          <p className={styles.productN}>
            <span
              className={item.badgeType == "B_flat" ? globalStyles.cerise : ""}
            >
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
