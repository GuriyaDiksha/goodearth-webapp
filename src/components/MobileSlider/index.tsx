import React, { useEffect, useRef, useState } from "react";
import cs from "classnames";
import "./styles.css";
// import globalStyles from "styles/global.scss";

import Slider, { Settings } from "react-slick";
import Counter from "components/ProductCounter/counter";

type Props = {
  dots?: boolean;
  val?: any;
  type?: string;
};

const MobileSlider: React.FC<Props> = ({
  dots = true,
  children,
  val,
  type
}) => {
  const [counter, setCounter] = useState(1);
  let set = {};
  const settings: Settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    useTransform: true,
    cssEase: "ease-in-out",
    onReInit: () => {
      document
        ?.getElementsByClassName("slick-not-init")?.[0]
        ?.classList.remove("slick-not-init");
    },
    responsive: [
      {
        breakpoint: 992,
        settings: {
          centerMode: true
        }
      },
      {
        breakpoint: 766,
        settings: {
          centerMode: false
        }
      }
    ]
  };
  if (type == "pdp") {
    set = {
      customPaging: (index: number) => {
        let width = "0px";
        if (typeof document == "object") {
          const screenWidth =
            window.innerWidth > 0 ? window.innerWidth : screen.width;
          const total = Object.keys(children || {}).length;
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
  }

  const sliderRef: any = useRef();

  useEffect(() => {
    // const handleOnClick = (index:number) => {
    // sliderRef.current?.props.customPaging();
    if (val && val.value > -1) {
      sliderRef.current ? sliderRef.current.slickGoTo(val.value) : "";
    }
  }, [val?.index]);
  return (
    <div
      className={cs(
        "mobile-slider",
        { "pdp-slider": type == "pdp" },
        { "pdp-slider-padding": type == "pdp" },
        "slick-not-init"
      )}
    >
      {Object.keys(children || {}).length > 0 && (
        <Slider
          {...{ ...settings, ...set }}
          ref={sliderRef}
          afterChange={index => {
            setCounter(index + 1);
          }}
        >
          {children}
        </Slider>
      )}
      {type == "pdp" && (
        <Counter
          id="pdp-image-counter"
          current={counter}
          total={Object.keys(children || {}).length}
        />
      )}
    </div>
  );
};

export default MobileSlider;
