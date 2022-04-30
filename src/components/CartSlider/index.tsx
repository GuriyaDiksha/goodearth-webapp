import React, { useEffect, useRef } from "react";
import cs from "classnames";
import "./styles.css";
// import globalStyles from "styles/global.scss";

import Slider, { Settings } from "react-slick";

type Props = {
  dots?: boolean;
  val?: any;
};

const CartSlider: React.FC<Props> = ({ dots = true, children, val }) => {
  const settings: Settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    useTransform: true,
    cssEase: "ease-in-out"
  };

  const set = {
    customPaging: (index: number) => {
      let width = "0px";
      if (typeof document == "object") {
        const element: any = document.getElementById("cartslider") || "";
        const screenWidth = element.offsetWidth;
        const total = Object.keys(children || {}).length;
        console.log(screenWidth, total);
        width = (screenWidth / total - total * 2 - 4) * 0.9 + "px";
      }
      return (
        <div
          className="pageritem"
          style={{
            width: width
          }}
          key={"item" + index}
        >
          {" "}
        </div>
      );
    }
  };

  const sliderRef: any = useRef();

  useEffect(() => {
    // const handleOnClick = (index:number) => {
    // sliderRef.current?.props.customPaging();
    if (val && val.value > -1) {
      sliderRef.current ? sliderRef.current.slickGoTo(val.value) : "";
    }
  }, [val?.index]);
  return (
    <div className={cs("mobile-slider", "pdp-slider")}>
      {Object.keys(children || {}).length > 0 && (
        <Slider {...{ ...settings, ...set }} ref={sliderRef}>
          {children}
        </Slider>
      )}
    </div>
  );
};

export default CartSlider;
