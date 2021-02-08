import React, { useEffect, useLayoutEffect, useState } from "react";
//import MakerEnhance from "maker-enhance";
import styles from "./styles.scss";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "../../styles/global.scss";
import cs from "classnames";
import { useLocation } from "react-router";
import { AppState } from "reducers/typings";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
// import INRBanner from "../../images/banner/INRBanner.jpg";
// import USDGBPBanner from "../../images/banner/USDGBPBanner.jpg";
// import INRBannerMobile from "../../images/banner/INRBannerMobile.jpg";
// import USDGBPBannerMobile from "../../images/banner/USDGBPBannerMobile.jpg";

const Home: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const location = useLocation();
  const {
    currency,
    device: { mobile }
  } = useSelector((state: AppState) => state);
  const { makerReloadToggle } = useSelector((state: AppState) => state.info);
  useLayoutEffect(() => {
    setMounted(false);
    setTimeout(() => {
      setMounted(true);
    }, 100);
  }, [currency, makerReloadToggle]);
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 1000);
    dataLayer.push(function(this: any) {
      this.reset();
    });
    dataLayer.push({
      event: "HomePageView",
      PageURL: location.pathname,
      PageTitle: "virtual_homePage_view"
    });
  }, []);

  useEffect(() => {
    const noContentContainerElem = document.getElementById(
      "no-content"
    ) as HTMLDivElement;
    if (location.pathname == "/corporate-gifts-catalogue") {
      if (
        noContentContainerElem.classList.contains(globalStyles.contentContainer)
      ) {
        noContentContainerElem.classList.remove(globalStyles.contentContainer);
      }
    } else if (
      !noContentContainerElem.classList.contains(globalStyles.contentContainer)
    ) {
      noContentContainerElem.classList.add(globalStyles.contentContainer);
    }
  }, [location.pathname]);
  // const mobileBannerImagePath =
  //   currency == "INR" ? INRBannerMobile : USDGBPBannerMobile;
  // const desktopBannerImagePath = currency == "INR" ? INRBanner : USDGBPBanner;
  // const bannerUrl =
  //   currency == "INR"
  //     ? "/collection/women_ruh-fiza_457/"
  //     : "/catalogue/category/women/sale-int_271/?source=plp&category_shop=Apparel+%3E+Sale+%3E+50%25";
  return (
    <div className={styles.makerTop}>
      <section>
        <div className={styles.b1}>
          <a href="#">
            <img
              src="https://djhiy8e1dslha.cloudfront.net/media/uploads/collection-banner-shopthelook-jessamine.jpg"
              className={globalStyles.imgResponsive}
            />
          </a>
          <div className={styles.contentB1}>
            <div className={styles.subtitle}>DINING</div>
            <div className={styles.title}>Jessamine</div>
            <p>
              Fine bone china dinnerware inspired by the fragrant blooms and
              lush foliage of the Himalayan countryside, perfect to add a touch
              of whimsy to your tablescapes. Finished with 24 carat gold
              highlights.
            </p>
            <div className={styles.ctaB1}> SHOP COLLECTION </div>
          </div>
        </div>
      </section>
      <section>
        <div className={cs(styles.b2, styles.bgImg)}>
          <div className={cs(bootstrap.row)}>
            <div className={cs(bootstrap.col6)}>
              <a href="#">
                <img
                  src="https://djhiy8e1dslha.cloudfront.net/media/images/product/Medium/I00219937-1602935338.jpg"
                  className={globalStyles.imgResponsive}
                />
              </a>
              <div className={styles.contentB2}>
                <div className={styles.title}>Bagh E Ferdaus</div>
                <p>
                  Placemats framed with floral creepers and hand-printed with
                  jaal latticework to complement al fresco brunches.
                </p>
                <div className={styles.ctaB2}>
                  {" "}
                  <a href="#"> discover Placemats </a>{" "}
                </div>
              </div>
            </div>
            <div className={cs(bootstrap.col6)}>
              <a href="#">
                <img
                  src="https://djhiy8e1dslha.cloudfront.net/media/images/product/Medium/I00219937-1602935338.jpg"
                  className={globalStyles.imgResponsive}
                />
              </a>
              <div className={styles.contentB2R}>
                <div className={styles.title}>Bagh E Ferdaus</div>
                <p>
                  Placemats framed with floral creepers and hand-printed with
                  jaal latticework to complement al fresco brunches.
                </p>
                <div className={styles.ctaB2}>
                  {" "}
                  <a href="#"> discover vases </a>
                </div>
              </div>
            </div>
          </div>
          <div className={bootstrap.row}>
            <div
              className={cs(
                bootstrap.col6,
                bootstrap.colMd4,
                globalStyles.textCenter
              )}
            >
              <img
                src="https://www.goodearth.in/static/images/butterfly.c581c096c2a27dca0baa665f8dcdbf87.png"
                width="40%"
              />
            </div>
            <div
              className={cs(
                bootstrap.col6,
                bootstrap.colMd4,
                globalStyles.textCenter
              )}
            >
              <img
                src="https://www.goodearth.in/static/images/butterfly.c581c096c2a27dca0baa665f8dcdbf87.png"
                width="40%"
              />
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className={cs(bootstrap.row, styles.sec4)}>
          <div className={cs(bootstrap.colMd4, bootstrap.col6, styles.padd)}>
            <a href="#">
              <img
                src="https://djhiy8e1dslha.cloudfront.net/media/images/product/Medium/I00219937-1602935338.jpg"
                className={globalStyles.imgResponsive}
              />
            </a>
            <div className={styles.sec4Content}>
              <div className={styles.subtitle}>DINING</div>
              <div className={styles.title}>Bagh E Ferdaus</div>
              <p>
                Placemats framed with floral creepers and hand-printed with jaal
                latticework to complement al fresco brunches.
              </p>
              <div className={styles.ctaB2}>
                {" "}
                <a href="#"> discover Placemats </a>{" "}
              </div>
            </div>
          </div>
          <div className={cs(bootstrap.colMd4, bootstrap.col6, styles.padd)}>
            <a href="#">
              <img
                src="https://djhiy8e1dslha.cloudfront.net/media/images/product/Medium/I00219937-1602935338.jpg"
                className={globalStyles.imgResponsive}
              />
            </a>
            <div className={styles.sec4Content}>
              <div className={styles.subtitle}>DINING</div>
              <div className={styles.title}>Bagh E Ferdaus</div>
              <p>
                Placemats framed with floral creepers and hand-printed with jaal
                latticework to complement al fresco brunches.
              </p>
              <div className={styles.ctaB2}>
                {" "}
                <a href="#"> discover vases </a>
              </div>
            </div>
          </div>
          <div className={cs(bootstrap.colMd4, bootstrap.col12, styles.padd)}>
            <a href="#">
              <img
                src="https://djhiy8e1dslha.cloudfront.net/media/images/product/Medium/I00219937-1602935338.jpg"
                className={globalStyles.imgResponsive}
              />
            </a>
            <div className={styles.sec4Content}>
              <div className={styles.subtitle}>DINING</div>
              <div className={styles.title}>Bagh E Ferdaus</div>
              <p>
                Placemats framed with floral creepers and hand-printed with jaal
                latticework to complement al fresco brunches.
              </p>
              <div className={styles.ctaB2}>
                {" "}
                <a href="#"> discover vases </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className={bootstrap.row}>
          <div className={cs(bootstrap.colMd6, bootstrap.col12)}>
            <a href="#">
              <img
                src="https://djhiy8e1dslha.cloudfront.net/media/uploads/collection-banner-shopthelook-jessamine.jpg"
                className={globalStyles.imgResponsive}
              />
            </a>
          </div>
          <div className={cs(bootstrap.colMd6, bootstrap.col12)}>
            <div className={cs(styles.content, styles.contentSpace)}>
              <div className={styles.subtitle}>DINING</div>
              <div className={styles.title}>Jessamine</div>
              <p>
                Fine bone china dinnerware inspired by the fragrant blooms and
                lush foliage of the Himalayan countryside, perfect to add a
                touch of whimsy to your tablescapes. Finished with 24 carat gold
                highlights.
              </p>
              <div className={styles.ctaB1}> SHOP COLLECTION </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className={cs(styles.b1, styles.bgb1)}>
          <a href="#">
            <img
              src="https://djhiy8e1dslha.cloudfront.net/media/uploads/collection-banner-shopthelook-jessamine.jpg"
              className={globalStyles.imgResponsive}
            />
          </a>
          <div className={styles.contentB1}>
            <div className={styles.subtitle}>DINING</div>
            <div className={styles.title}>Jessamine</div>
            <p>
              Fine bone china dinnerware inspired by the fragrant blooms and
              lush foliage of the Himalayan countryside, perfect to add a touch
              of whimsy to your tablescapes. Finished with 24 carat gold
              highlights.
            </p>
            <div className={styles.ctaB1}> SHOP COLLECTION </div>
          </div>
        </div>
      </section>
      {/* {mounted && (
        <MakerEnhance 
          user="goodearth"
          index="1"
          href={`${window.location.origin}${location.pathname}?${location.search}`}
        />
      )}*/}
    </div>
  );
};

export default Home;
