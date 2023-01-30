import React, { useEffect, useLayoutEffect, useState } from "react";
import MakerEnhance from "maker-enhance";
import styles from "./styles.scss";
// import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "../../styles/global.scss";
import cs from "classnames";
import { useLocation } from "react-router";
import { AppState } from "reducers/typings";
import { useSelector, useStore } from "react-redux";
import * as util from "utils/validate";
import CookieService from "services/cookie";
import { GA_CALLS } from "constants/cookieConsent";
import MetaService from "services/meta";

const MakerPage: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const location = useLocation();
  const store = useStore();
  const {
    currency,
    info: { showTimer },
    user: { isLoggedIn }
    // device: { mobile }
  } = useSelector((state: AppState) => state);
  const { makerReloadToggle } = useSelector((state: AppState) => state.info);
  const canUseDOM = !!(
    typeof window !== "undefined" &&
    typeof window.document !== "undefined" &&
    typeof window.document.createElement !== "undefined"
  );

  const useIsomorphicLayoutEffect = canUseDOM ? useLayoutEffect : useEffect;

  useIsomorphicLayoutEffect(() => {
    setMounted(false);
    setTimeout(() => {
      setMounted(true);
    }, 100);
  }, [currency, isLoggedIn, makerReloadToggle]);
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 1000);
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push(function(this: any) {
        this.reset();
      });
    }
    let page = "";
    switch (location.pathname) {
      case "/":
        page = "Home";
        break;
      case "/workshops":
        page = "Workshops";
        break;
      default:
        page = "Home";
    }
    util.pageViewGTM(page);
    if (location.pathname == "/about-us") {
      const request = {
        page: "static",
        pathName: location.pathname
      };
      MetaService.updatePageMeta(store.dispatch, request);
    }
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
