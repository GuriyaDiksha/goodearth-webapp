import React, { useEffect, useLayoutEffect, useState } from "react";
import MakerEnhance from "maker-enhance";
import styles from "./styles.scss";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "../../styles/global.scss";
import cs from "classnames";
import { useLocation } from "react-router";
import { AppState } from "reducers/typings";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import INRBanner from "../../images/banner/INRBanner.jpg";
import USDGBPBanner from "../../images/banner/USDGBPBanner.jpg";
import INRBannerMobile from "../../images/banner/INRBannerMobile.jpg";
import USDGBPBannerMobile from "../../images/banner/USDGBPBannerMobile.jpg";

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
    dataLayer.push({
      event: "HomePageView",
      PageURL: location.pathname,
      PageTitle: "virtual_homePage_view"
    });
  }, []);

  const mobileBannerImagePath =
    currency == "INR" ? INRBannerMobile : USDGBPBannerMobile;
  const desktopBannerImagePath = currency == "INR" ? INRBanner : USDGBPBanner;
  const bannerUrl =
    currency == "INR"
      ? "/collection/women_ruh-fiza_457/"
      : "/catalogue/category/women/sale-int_271/?source=plp&category_shop=Apparel+%3E+Sale+%3E+50%25";
  return (
    <div className={styles.makerTop}>
      <section>
        <div className={cs(bootstrap.row, styles.firstBlock)}>
          <div className={bootstrap.col12}>
            {mobile && (
              <Link to={bannerUrl}>
                <img
                  src={mobileBannerImagePath}
                  className={globalStyles.imgResponsive}
                />
              </Link>
            )}
            {!mobile && (
              <Link to={bannerUrl}>
                <img
                  src={desktopBannerImagePath}
                  className={globalStyles.imgResponsive}
                />
              </Link>
            )}
          </div>
        </div>
      </section>
      {mounted && (
        <MakerEnhance
          user="goodearth"
          index="1"
          href={`${window.location.origin}${location.pathname}?${location.search}`}
        />
      )}
    </div>
  );
};

export default Home;
