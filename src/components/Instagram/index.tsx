import React, { useState, useLayoutEffect } from "react";
// import { Link } from "react-router-dom";
// import cs from "classnames";
// import styles from "./styles.scss";
import globalStyles from "../../styles/global.scss";
import bootstrapStyles from "../../styles/bootstrap/bootstrap-grid.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import "../../styles/myslick.css";
// import "./slick.css";
import { InstaProps } from "./typings";

// import { RecommendData, RecommenedSliderProps } from "./typings";
import Slider from "react-slick";
// import WishlistButton from "components/WishlistButton";
// import LazyImage from "components/LazyImage";

const Instagram: React.FC<InstaProps> = Props => {
  // const { data, setting, currency, mobile } = props;
  // const code = currencyCode[currency as Currency];
  const [instData, setInstData] = useState([]);
  // const items = data?.map((item: any, i: number) => {
  //   return (

  //   );
  // });
  useLayoutEffect(() => {
    fetch(
      "https://graph.instagram.com/17841400218133714/media?fields=media_url&access_token=IGQVJVbnFjN0dyTjY1VHVBNTE3LUFiMDN4S2JScF90SVkwVmtmSlNhWUlraVFLLUs1RzF2MDQtWHhIdGdzS1JBaXZAiTEhUZAFY2SjZALV1lDYWt2ckJkOTJoaEVfTG9JdHpaX3RMUG1CM3NVTnl4dFNHRQZDZD",
      {
        method: "get"
      }
    )
      .then(res => res.json())
      .then(json => {
        // debugger
        setInstData([]);
        // this.setState({instData: json.data || []});
      })
      .catch(function(err) {
        console.log(err);
      });
  });
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

export default Instagram;
