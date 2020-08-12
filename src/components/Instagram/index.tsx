import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import cs from "classnames";
// import styles from "./styles.scss";
import globalStyles from "../../styles/global.scss";
import bootstrapStyles from "../../styles/bootstrap/bootstrap-grid.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import "../../styles/myslick.css";
// import "./slick.css";

// import { RecommendData, RecommenedSliderProps } from "./typings";
import Slider from "react-slick";
// import WishlistButton from "components/WishlistButton";
// import LazyImage from "components/LazyImage";

const WeRecommend: React.FC<{}> = () => {
  // const { data, setting, currency, mobile } = props;
  // const code = currencyCode[currency as Currency];
  const [instData, setInstData] = useState([]);
  // const items = data?.map((item: any, i: number) => {
  //   return (

  //   );
  // });
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 10,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: true,
    autoplayspeed: 3000,
    arrows: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          centerMode: true,
          className: "center"
        }
      }
    ]
  };

  return (
    <div className={bootstrapStyles.col12}>
      <Slider {...settings}>
        {instData?.map((data: any) => {
          return (
            <div>
              <a href={data.link} target="_blank" rel="noopener noreferrer">
                <img
                  src={data.images.thumbnail.url}
                  className={globalStyles.imgResponsive}
                />{" "}
              </a>
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default WeRecommend;
