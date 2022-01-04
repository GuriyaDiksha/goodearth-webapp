import React, { useEffect, useRef } from "react";

import "./styles.css";
// import globalStyles from "styles/global.scss";

import Slider, { Settings } from "react-slick";

type Props = {
  dots?: boolean;
  val?: any;
};

const MobileSlider: React.FC<Props> = ({ dots = true, children, val }) => {
  const settings: Settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false
  };

  const sliderRef: any = useRef();

  useEffect(() => {
    // const handleOnClick = (index:number) => {
    if (val && val.value > -1) {
      sliderRef.current ? sliderRef.current.slickGoTo(val.value) : "";
    }
  }, [val?.index]);

  return (
    <div className="mobile-slider">
      {Object.keys(children || {}).length > 0 && (
        <Slider {...settings} ref={sliderRef}>
          {children}
        </Slider>
      )}
    </div>
  );
};

export default MobileSlider;
