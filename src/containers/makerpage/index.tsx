import React, { useEffect, useLayoutEffect, useState } from "react";
import MakerEnhance from "maker-enhance";
import styles from "./styles.scss";
// import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "../../styles/global.scss";
import cs from "classnames";
import { useLocation } from "react-router";
import { AppState } from "reducers/typings";
import { useSelector } from "react-redux";
// import { Link } from "react-router-dom";
// import INRBanner from "../../images/banner/INRBanner.jpg";
// import USDGBPBanner from "../../images/banner/USDGBPBanner.jpg";
// import INRBannerMobile from "../../images/banner/INRBannerMobile.jpg";
// import USDGBPBannerMobile from "../../images/banner/USDGBPBannerMobile.jpg";

const MakerPage: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const location = useLocation();
  const {
    currency,
    info: { showTimer },
    user: { isLoggedIn }
    // device: { mobile }
  } = useSelector((state: AppState) => state);
  const { makerReloadToggle } = useSelector((state: AppState) => state.info);
  useLayoutEffect(() => {
    setMounted(false);
    setTimeout(() => {
      setMounted(true);
    }, 100);
  }, [currency, isLoggedIn, makerReloadToggle]);
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 1000);
    dataLayer.push(function(this: any) {
      this.reset();
    });
    let page = "";
    let pagetitle = "";
    switch (location.pathname) {
      case "/":
        page = "HomePageView";
        pagetitle = "virtual_homePage_view";
        break;
      case "/workshops":
        page = "WorkshopsPageView";
        pagetitle = "virtual_workshops_view";
        break;
      default:
        pagetitle = "virtual_homePage_view";
        page = "HomePageView";
    }
    dataLayer.push({
      event: page,
      PageURL: location.pathname,
      Page_Title: pagetitle
    });
    Moengage.track_event("Page viewed", {
      "Page URL": location.pathname,
      "Page Name": page
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
    <div className={cs(styles.makerTop, { [styles.makerTopTimer]: showTimer })}>
      {/* <section>
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
      </section> */}
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

export default MakerPage;
