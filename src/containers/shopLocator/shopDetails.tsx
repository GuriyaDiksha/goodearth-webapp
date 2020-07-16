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
  console.log(props);
  const img = [
    "https://d3qn6cjsz7zlnp.cloudfront.net/media/store_locator/citywalkd1.jpg",
    "https://d3qn6cjsz7zlnp.cloudfront.net/media/store_locator/citywalkd2.jpg"
  ];
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
          data={img}
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
                  SHOP &nbsp;<h3> Khan Market </h3>
                </div>
                <div className={cs(globalStyles.voffset2, styles.para)}>
                  An urban haven of contemporary Indian design and lifestyle
                  luxury in the midst of Delhi’s busiest marketplace. Meandering
                  paths of discovery through a dynamically edited Good Earth
                  Home universe and 2600 sq.ft. of Sustain apparel
                </div>
                <div className={cs(styles.small, globalStyles.voffset5)}>
                  <strong className={styles.black}> OPEN 7 DAYS A WEEK </strong>{" "}
                  <br />
                  11:00am - 5:00pm IST
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
                    <Link
                      to="https://www.google.com/maps/dir//28.599641,77.226376/@28.599641,77.226376,16z?hl=en-GB"
                      target="_blank"
                    >
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
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7006.00905424862!2d77.226376!3d28.599641!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xeb0accce6f3226e8!2sGood+Earth!5e0!3m2!1sen!2sin!4v1540965321199"
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
            <BannerSlider data={img} setting={config as Settings} />
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
                    Café &nbsp;<h3> Latitude°28</h3>
                  </div>
                  <div className={cs(globalStyles.voffset2, styles.para)}>
                    Latitude 28 Café and Wine Bar is it perfect place for a
                    power lunch or an afternoon shopping date for a spot of tea
                    with friends. Celebrity chef Ritu Dalmia’s wine paired menu
                    is as delightful as it is dynamic. Café is open till 11pm
                    daily.{" "}
                  </div>
                  <div className={cs(styles.small, globalStyles.voffset4)}>
                    <div className={styles.bold}>CALL FOR RESERVATIONS</div>
                    <div className={cs(globalStyles.voffset2, styles.small)}>
                      T: +91-11-24647175
                      <br /> +91-11-24647176
                      <br /> +91-11-24647179
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
                      <Link
                        to="https://www.google.com/maps/dir//28.599641,77.226376/@28.599641,77.226376,16z?hl=en-GB"
                        target="_blank"
                      >
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
