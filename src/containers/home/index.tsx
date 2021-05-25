import React, { useEffect } from "react";
import styles from "./styles.scss";
import Section1 from "./section1";
import Section2 from "./section2";
import Section3 from "./section3";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
import cs from "classnames";
import * as util from "utils/validate";
import { useSelector } from "react-redux";
import { AppState } from "reducers/typings";
// import { Link } from "react-router-dom";
// import INRBanner from "../../images/banner/INRBanner.jpg";
// import USDGBPBanner from "../../images/banner/USDGBPBanner.jpg";
// import INRBannerMobile from "../../images/banner/INRBannerMobile.jpg";
// import USDGBPBannerMobile from "../../images/banner/USDGBPBannerMobile.jpg";

const Home: React.FC = () => {
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 1000);
    dataLayer.push(function(this: any) {
      this.reset();
    });
    util.pageViewGTM("Home");
    dataLayer.push({
      event: "HomePageView",
      PageURL: location.pathname,
      PageTitle: "virtual_homePage_view"
    });
  }, []);
  const { showTimer } = useSelector((state: AppState) => state.info);

  return (
    <div className={styles.homePage}>
      <div
        className={cs(styles.makerTop, { [styles.makerTopTimer]: showTimer })}
      >
        <div className={bootstrap.containerFluid}>
          <Section1 />
          <Section2 />
          <Section3 />
        </div>
      </div>
    </div>
  );
};

export default Home;
