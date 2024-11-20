import React from "react";
import Slider from "react-slick";
import "./styles.css";
import CookieService from "services/cookie";
import { GA_CALLS } from "constants/cookieConsent";

type Props = {
  dots?: boolean;
  val?: any;
  type?: string;
  mobile: boolean;
  productName?: string;
};

const PlpResultImageSlider: React.FC<Props> = ({
  children,
  mobile,
  productName
}) => {
  // Adding GA Events on Product Image Swap
  const handleSlideChange = () => {
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({
        event: "plp_product_swipe",
        click_type: productName
      });
    }
  };

  const settings = {
    dots: mobile ? true : false,
    arrows: mobile ? false : true,
    infinite: true,
    speed: 100,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: handleSlideChange // This will be our event listener for slide change
  };

  return (
    <div className={"imageSlideronatiner"}>
      <Slider {...settings}>{children}</Slider>
    </div>
  );
};

export default PlpResultImageSlider;
