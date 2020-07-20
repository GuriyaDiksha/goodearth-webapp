import React from "react";
import cs from "classnames";
// import iconStyles from "../../styles/iconFonts.scss";
import bootstrapStyles from "../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import styles from "./styles.scss";
import { ShopLocatorProps } from "./typings";
import { Link } from "react-router-dom";
import BannerSlider from "components/BannerSlider";
import { Settings } from "react-slick";
import borderImg from "images/category/bannerBottom.jpg";

const ShopDetail: React.FC<ShopLocatorProps> = props => {
  const { mobile, data } = props;
  const shopImage = data?.[0]?.bannerShop
    ?.filter((image: any) => {
      if (mobile) {
        return image.imageType == 2;
      } else {
        return image.imageType == 1;
      }
    })
    .map((filter: any) => filter.image);
  const cafeImage = data?.[0]?.bannerCafe
    ?.filter((image: any) => {
      if (mobile) {
        return image.imageType == 2;
      } else {
        return image.imageType == 1;
      }
    })
    .map((filter: any) => filter.image);
  const shopData = data ? data[0] : {};

  const config: Settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          dots: true,
          arrows: false
        }
      }
    ]
  };
  return (
    <div>
      <div className={cs(bootstrapStyles.colMd12, styles.im)}>
        <BannerSlider
          data={shopImage}
          setting={config as Settings}
          mobile={props.mobile}
        />
        <img src={borderImg} className={globalStyles.imgResponsive}></img>
      </div>
      <div className={bootstrapStyles.row}>
        <div
          className={cs(
            bootstrapStyles.colMd12,
            styles.moveLink,
            styles.moveLinkMobile,
            globalStyles.textCenter
          )}
        >
          <span className={styles.shopLink}>
            <Link to="#shop" id="shopname">
              SHOP{" "}
            </Link>
          </span>{" "}
          &nbsp;
          <span className={styles.cafeLink}>
            <Link to="#cafe" id="cafename">
              | &nbsp; CAFE{" "}
            </Link>
          </span>
        </div>
      </div>
      <div className={cs(styles.locationBg, styles.details)}>
        <div className={bootstrapStyles.container}>
          <div className={bootstrapStyles.row}>
            <div
              className={cs(bootstrapStyles.colMd5, bootstrapStyles.col10, {
                [bootstrapStyles.offset1]: props.mobile
              })}
            >
              <div className={cs(styles.shopAddBlock, globalStyles.voffset5)}>
                <div className={styles.shop}>
                  SHOP &nbsp;<h3> {shopData.place} </h3>
                </div>
                <div className={cs(globalStyles.voffset2, styles.para)}>
                  {shopData.shopContent}
                </div>
                <div className={cs(styles.small, globalStyles.voffset5)}>
                  <strong className={styles.black}>
                    {" "}
                    {shopData.opendays}{" "}
                  </strong>{" "}
                  <br />
                  {shopData.time}
                </div>
                <div className={cs(styles.small, globalStyles.voffset3)}>
                  {shopData.address
                    ?.split(";")
                    .map((line: string, i: number) => {
                      return (
                        <div className={styles.small} key={i}>
                          {line}
                        </div>
                      );
                    })}
                </div>

                <div
                  className={cs(
                    styles.viewDirectionsBlock,
                    bootstrapStyles.row,
                    globalStyles.voffset5
                  )}
                >
                  <div
                    className={cs(bootstrapStyles.col12, styles.getDirections)}
                  >
                    <Link to={shopData.direction} target="_blank">
                      {" "}
                      get directions{" "}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={cs(bootstrapStyles.colMd6, bootstrapStyles.offsetMd1)}
            >
              <iframe
                src={shopData.iframemap}
                scrolling="no"
                height="400"
                width="100%"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
      <div className={bootstrapStyles.row}>
        <div
          className={cs(globalStyles.col12, styles.cafe, styles.heroBannerHome)}
        >
          <div className={globalStyles.voffset4}>
            <BannerSlider data={cafeImage} setting={config as Settings} />
          </div>
          <div className={styles.cafeContent}>
            <div className={styles.inner}>
              <div
                className={cs(
                  bootstrapStyles.colMd8,
                  bootstrapStyles.colMdOffset2,
                  bootstrapStyles.col10,
                  bootstrapStyles.offset1,
                  styles.paddTop80
                )}
              >
                <div
                  className={cs(styles.shopAddBlock, {
                    [globalStyles.voffset4]: props.mobile
                  })}
                >
                  <div className={styles.shop}>
                    Café &nbsp;<h3> {shopData.cafeHeading2}</h3>
                  </div>
                  <div className={cs(globalStyles.voffset2, styles.para)}>
                    {shopData.cafeContent}{" "}
                  </div>
                  <div className={cs(styles.small, globalStyles.voffset4)}>
                    <div className={styles.bold}>CALL FOR RESERVATIONS</div>
                    <div className={cs(globalStyles.voffset2, styles.small)}>
                      {shopData.cafeTel1?.map((num: string, i: number) => {
                        if (mobile) {
                          return (
                            <div key={i}>
                              <a
                                rel="noopener noreferrer"
                                href={"tel:" + (num ? num.split("+")[1] : num)}
                              >
                                {num}
                              </a>
                              <br />
                            </div>
                          );
                        } else {
                          return (
                            <div key={i}>
                              {num}
                              <br />
                            </div>
                          );
                        }
                      })}
                    </div>
                  </div>
                  <div
                    className={cs(
                      styles.viewDirectionsBlock,
                      bootstrapStyles.row,
                      globalStyles.voffset4
                    )}
                  >
                    <div
                      className={cs(
                        bootstrapStyles.col12,
                        styles.getDirections
                      )}
                    >
                      <Link to={shopData.cafeDirection} target="_blank">
                        {" "}
                        get directions{" "}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDetail;
