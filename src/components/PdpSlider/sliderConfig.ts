import { Settings } from "react-slick";

export const config: Settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  arrows: true,
  slidesToScroll: 1,
  initialSlide: 0,
  responsive: [
    {
      breakpoint: 992,
      settings: {
        dots: false,
        arrows: true
      }
    }
  ]
};
