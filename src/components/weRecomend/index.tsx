import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import cs from "classnames";
import styles from "./styles.scss";
import globalStyles from "../../styles/global.scss";
import bootstrapStyles from "../../styles/bootstrap/bootstrap-grid.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../styles/myslick.css";
import "./slick.css";

import { Currency } from "../../typings/currency";
import { RecommendData, RecommenedSliderProps } from "./typings";
import Slider from "react-slick";
import WishlistButton from "components/WishlistButton";
import LazyImage from "components/LazyImage";
import { weRecommendProductImpression } from "utils/validate";
import CookieService from "../../services/cookie";
import { GA_CALLS } from "constants/cookieConsent";
import { displayPriceWithCommas } from "utils/utility";

const WeRecommend: React.FC<RecommenedSliderProps> = (
  props: RecommenedSliderProps
) => {
  const {
    data,
    setting,
    currency,
    mobile,
    recommendedProducts,
    isSale,
    corporatePDP
  } = props;
  const [currentId, setCurrentId] = useState(-1);
  const gtmPushWeRecommendClick = (e: any, data: RecommendData, i: number) => {
    try {
      const products: any = [];
      const index = recommendedProducts[i].categories
        ? recommendedProducts[i].categories.length - 1
        : 0;
      let category =
        recommendedProducts[i].categories &&
        recommendedProducts[i].categories[index]
          ? recommendedProducts[i].categories[index].replace(/\s/g, "")
          : "";
      category = category.replace(/>/g, "/");
      const listPath = `WeRecommend`;
      CookieService.setCookie("listPath", listPath);
      const attr = recommendedProducts[i].childAttributes.map((child: any) => {
        return Object.assign(
          {},
          {
            name: recommendedProducts[i].title,
            id: child.sku,
            price:
              child.discountedPriceRecords[currency] ||
              child.priceRecords[currency],
            brand: "Goodearth",
            category: category,
            variant: child.size || "",
            position: i,
            dimension12: child?.color
          }
        );
      });
      const userConsent = CookieService.getCookie("consent").split(",");
      if (userConsent.includes(GA_CALLS)) {
        dataLayer.push({
          event: "productClick",
          ecommerce: {
            currencyCode: currency,
            click: {
              // actionField: { list: "We Recommend" },
              actionField: { list: listPath },
              products: products.concat(attr)
            }
          }
        });
      }
    } catch (err) {
      console.log("weRecommend GTM error!");
    }
  };
  const withoutZeroPriceData = data?.filter(
    (item: RecommendData, i: number) => {
      return item.pricerecords[currency as Currency] != 0;
    }
  );

  useEffect(() => {
    weRecommendProductImpression(recommendedProducts, "WeRecommend", currency);
  }, []);

  const items = withoutZeroPriceData?.map((item: any, i: number) => {
    return (
      <div
        key={item.id}
        className={cs(styles.slide, {
          [bootstrapStyles.col6]: mobile,
          [bootstrapStyles.col12]: !mobile
        })}
        onMouseEnter={() => setCurrentId(item.id)}
        onMouseLeave={() => {
          setCurrentId(-1);
        }}
      >
        {item.badgeImage ? (
          <div className={styles.saleBanner}>
            <img src={item.badgeImage} />
          </div>
        ) : (
          ""
        )}
        {(mobile || currentId == item.id) && !corporatePDP && (
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
              gtmListType="WeRecommend"
              id={item.id}
              showText={false}
              key={item.id}
              mobile={true}
              onComplete={() => {
                setCurrentId(item.id);
              }}
              badgeType={item?.badgeType}
            />
          </div>
        )}
        {item?.badgeText && (
          <div
            className={cs(
              globalStyles.textCenter,
              globalStyles.badgePositionDesktop,
              styles.badgePosition,
              { [globalStyles.badgePositionMobile]: mobile }
            )}
          >
            <div className={cs(globalStyles.badgeContainer)}>
              {item?.badgeText}
            </div>
          </div>
        )}
        <Link
          to={item.productUrl}
          onClick={e => gtmPushWeRecommendClick(e, item, i)}
        >
          <LazyImage
            alt={item.altText || item.productName}
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
          <p className={styles.productH}>{item.collection}</p>
          <p className={styles.productN}>
            <Link to={item.productUrl}> {item.productName} </Link>
          </p>
          {!corporatePDP && (
            <p className={styles.productN}>
              {isSale && item.discount ? (
                <span className={styles.discountprice}>
                  {displayPriceWithCommas(
                    item.discountedPriceRecords[currency as Currency],
                    currency
                  )}
                </span>
              ) : (
                ""
              )}
              {isSale && item.discount ? (
                <span className={styles.strikeprice}>
                  {" "}
                  {displayPriceWithCommas(
                    item.pricerecords[currency as Currency],
                    currency
                  )}{" "}
                </span>
              ) : (
                <span
                  className={
                    item.badgeType == "B_flat" ? globalStyles.gold : ""
                  }
                >
                  {" "}
                  {displayPriceWithCommas(
                    item.pricerecords[currency as Currency],
                    currency
                  )}{" "}
                </span>
              )}
            </p>
          )}
        </div>
      </div>
    );
  });

  return (
    <Fragment>
      {items.length > 0 && (
        <div
          id="more_collection_div"
          className={cs(
            styles.recommendBg,
            bootstrapStyles.colMd12,
            "we-recommend"
          )}
        >
          <div
            className={cs(bootstrapStyles.colMd8, bootstrapStyles.offsetMd2)}
          >
            <h2 className={cs(styles.recommendHeader, globalStyles.voffset5)}>
              We Recommend
            </h2>
            <div className={bootstrapStyles.col12}>
              {!mobile ? (
                items.length >= 4 ? (
                  <Slider {...setting}>{items}</Slider>
                ) : (
                  <Slider {...setting} infinite={false}>
                    {items}
                  </Slider>
                )
              ) : (
                ""
              )}
              {mobile && <div className={bootstrapStyles.row}>{items}</div>}
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default WeRecommend;
