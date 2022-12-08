import React from "react";
import Slider from "react-slick";
import "./styles.css";

type Props = {
  dots?: boolean;
  val?: any;
  type?: string;
};

const PlpResultImageSlider: React.FC<Props> = ({ children }) => {
  const settings = {
    dots: true,
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
