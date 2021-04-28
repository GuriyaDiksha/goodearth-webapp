import React from "react";

import "./styles.css";
// import globalStyles from "styles/global.scss";

import Slider, { Settings } from "react-slick";

type Props = {
  dots?: boolean;
};

const MobileSlider: React.FC<Props> = ({ dots = true, children }) => {
  const settings: Settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false
  };
  return (
    <div className="mobile-slider">
      {Object.keys(children || {}).length > 0 && (
        <Slider {...settings}>{children}</Slider>
      )}
    </div>
  );
};

export default MobileSlider;
