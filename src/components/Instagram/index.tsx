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
      "https://graph.instagram.com/me/media?fields=caption,id,media_type,media_url,permalink,thumbnail_url,timestamp,username&access_token=IGQVJVNHVQSUE1UEhhR0lqVVJzckRRaGZAWYUV6NTBaSWU5dTRMQ19JOXB6eVBGM0k0OW1CM1MycGpNN2h2SVRHRmRzUGNxU1RmcVJwdENEUW1RNk05TUJXc3F3OVROMnlRRkFweDFhRlptdHlpQkYyVwZDZD",
      {
        method: "get"
      }
    )
      .then(res => res.json())
      .then(json => {
        const imageData = json.data.filter((temp: any) => {
          return temp.media_type == "IMAGE";
        });
        setInstData(imageData);
      })
      .catch(function(err) {
        console.log(err);
      });
  }, []);
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
                  src={data.media_url}
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
