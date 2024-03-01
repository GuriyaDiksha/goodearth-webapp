import React from "react";
import Slider from "react-slick";
// import { Settings} from 'react-slick';
import cs from "classnames";
import styles from "./styles.scss";
import spa from "./../../../../images/registery/spa.jpg";
import cushions from "./../../../../images/registery/cushions.png";
import decor from "./../../../../images/registery/decor.jpg";
import apparel from "./../../../../images/registery/apparel.jpg";
import dinnerware from "./../../../../images/registery/dinnerware.jpg";
// import teaset from "./../../../../images/registery/teaset.jpg";

// export type Props = {
//     setting: Settings;
//   };
const RegisterySlider: React.FC = () => {
  const settings = {
    dot: false,
    arrow: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    adaptiveHeight: true,
    centerMode: true,
    centerPadding: "10%",
    responsive: [
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };
  return (
    <div>
      <Slider {...settings} className={cs(styles.geUniverseSliders)}>
        <div className={cs(styles.sliderItem)}>
          <div className={cs(styles.sliderImg)}>
            <a href="https://www.goodearth.in/catalogue/category/living/dining_28/?source=plp&category_shop=Home+%3E+Dining+%3E+Dinnerware">
              <img src={dinnerware} alt="dinnerware" />
            </a>
          </div>
          <div className={cs(styles.sliderTitle)}>
            <a href="https://www.goodearth.in/catalogue/category/living/dining_28/?source=plp&category_shop=Home+%3E+Dining+%3E+Dinnerware">
              DINNERWARE
            </a>
          </div>
        </div>
        <div className={cs(styles.sliderItem)}>
          <div className={cs(styles.sliderImg)}>
            <a href="https://www.goodearth.in/catalogue/category/women/uppers_3/?source=plp&category_shop=Apparel+%3E+Sustain+Woman">
              <img src={apparel} alt="apparel" />
            </a>
          </div>
          <div className={cs(styles.sliderTitle)}>
            <a href="https://www.goodearth.in/catalogue/category/women/uppers_3/?source=plp&category_shop=Apparel+%3E+Sustain+Woman">
              APPAREL
            </a>
          </div>
        </div>
        {/* <div className={cs(styles.sliderItem)}>
            <div className={cs(styles.sliderImg)}><img src={teaset} alt="teaset" /></div>
            <div className={cs(styles.sliderTitle)}>TEASET</div>
        </div> */}
        <div className={cs(styles.sliderItem)}>
          <div className={cs(styles.sliderImg)}>
            <a href="https://www.goodearth.in/catalogue/category/living/wellness_64/?source=plp&category_shop=Home+%3E+Ancient+Rituals">
              <img src={spa} alt="spa" />
            </a>
          </div>
          <div className={cs(styles.sliderTitle)}>
            <a href="https://www.goodearth.in/catalogue/category/living/wellness_64/?source=plp&category_shop=Home+%3E+Ancient+Rituals">
              SPA
            </a>
          </div>
        </div>
        <div className={cs(styles.sliderItem)}>
          <div className={cs(styles.sliderImg)}>
            <a href="https://www.goodearth.in/catalogue/category/living/bed-bath_194/?source=plp&category_shop=Home+%3E+Home+Textiles+%3E+Cushions">
              <img src={cushions} alt="cushions" />
            </a>
          </div>
          <div className={cs(styles.sliderTitle)}>
            <a href="https://www.goodearth.in/catalogue/category/living/bed-bath_194/?source=plp&category_shop=Home+%3E+Home+Textiles+%3E+Cushions">
              CUSHIONS
            </a>
          </div>
        </div>
        <div className={cs(styles.sliderItem)}>
          <div className={cs(styles.sliderImg)}>
            <a href="https://www.goodearth.in/catalogue/category/living/decor_49/?source=plp&category_shop=Home+%3E+Decor">
              <img src={decor} alt="decor" />
            </a>
          </div>
          <div className={cs(styles.sliderTitle)}>
            <a href="https://www.goodearth.in/catalogue/category/living/decor_49/?source=plp&category_shop=Home+%3E+Decor">
              DECOR
            </a>
          </div>
        </div>
      </Slider>
    </div>
  );
};
export default RegisterySlider;
