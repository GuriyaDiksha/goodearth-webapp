import React from "react";
import Slider from "react-slick";
import "./styles.css";

type Props = {
  dots?: boolean;
  val?: any;
  type?: string;
  mobile: boolean;
};

const PlpResultImageSlider: React.FC<Props> = ({ children, mobile }) => {
  const settings = {
    dots: mobile ? true : false,
    arrows: mobile ? false : true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };
  return (
    <div className={"imageSlideronatiner"}>
      <Slider {...settings}>{children}</Slider>
    </div>
  );
};

export default PlpResultImageSlider;
