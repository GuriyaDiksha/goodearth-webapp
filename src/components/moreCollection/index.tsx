import React, { useEffect } from "react";
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
import LazyImage from "components/LazyImage";
import {
  MoreFromCollectionProductImpression,
  MoreFromCollectionProductClick
} from "utils/validate";

const MoreCollectionImage: React.FC<MoreCollectionSliderProps> = (
  props: MoreCollectionSliderProps
) => {
  const { data, setting, mobile, currency } = props;
  useEffect(() => {
    MoreFromCollectionProductImpression(
      data,
      "MoreFromCollection",
      currency || "INR"
    );
  }, []);

  return (
    <div
      id="more_collection_div"
      className={cs(bootstrapStyles.colMd12, "more-collection", {
        "mobile-slider": mobile
      })}
    >
      <div className={bootstrapStyles.row}>
        <h2 className={cs(styles.header, { [globalStyles.voffset5]: !mobile })}>
          more from this collection
        </h2>

        <div className={bootstrapStyles.col12}>
          <Slider {...setting} className="pdp-slider recommend-block">
            {(data as MoreCollectionItem[])?.map(
              (item: MoreCollectionItem, i: number) => {
                return (
                  <div key={item.id} className={styles.slide}>
                    {item.badgeImage ? (
                      <div
                        className={cs(
                          { [styles.saleBanner]: !mobile },
                          { [styles.saleBannerMobile]: mobile }
                        )}
                      >
                        <img src={item.badgeImage} />
                      </div>
                    ) : (
                      ""
                    )}
                    {item?.badge_text && (
                      <Link
                        to={item.url}
                        className={cs(
                          globalStyles.textCenter,
                          globalStyles.badgePositionDesktop,
                          styles.badgePosition,
                          globalStyles.pointer,
                          { [globalStyles.badgePositionMobile]: mobile }
                        )}
                      >
                        <div
                          className={cs(
                            globalStyles.badgeContainer,
                            globalStyles.flex
                          )}
                        >
                          {item?.badge_text}
                        </div>
                      </Link>
                    )}
                    <Link
                      to={item.url}
                      className={styles.link}
                      onClick={() =>
                        MoreFromCollectionProductClick(
                          item,
                          "MoreFromCollection",
                          currency || "INR",
                          i
                        )
                      }
                    >
                      <LazyImage
                        aspectRatio="62:93"
                        alt={item.altText || item.title}
                        src={item.image || "/static/img/noimageplp.png"}
                        className={cs(globalStyles.imgResponsive)}
                      />
                    </Link>
                    <div className={styles.moreBlock}>
                      <p className={styles.productH}>{item.collection}</p>
                      <p className={styles.productN}>
                        <Link
                          to={item.url}
                          onClick={() =>
                            MoreFromCollectionProductClick(
                              item,
                              "MoreFromCollection",
                              currency || "INR",
                              i
                            )
                          }
                        >
                          {" "}
                          {item.title}{" "}
                        </Link>
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
