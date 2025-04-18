import React, { useState, useLayoutEffect, useEffect } from "react";
// import { Link } from "react-router-dom";
// import cs from "classnames";
import styles from "./styles.scss";
import bootstrapStyles from "../../styles/bootstrap/bootstrap-grid.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { InstaProps } from "./typings";
import Slider from "react-slick";
// import WishlistButton from "components/WishlistButton";
// import LazyImage from "components/LazyImage";

const Instagram: React.FC<InstaProps> = Props => {
  // const { data, setting, currency, mobile } = props;
  // const code = currencyCode[currency as Currency];
  const [instData, setInstData] = useState([]);
  const canUseDOM = !!(
    typeof window !== "undefined" &&
    typeof window.document !== "undefined" &&
    typeof window.document.createElement !== "undefined"
  );

  const useIsomorphicLayoutEffect = canUseDOM ? useLayoutEffect : useEffect;

  useIsomorphicLayoutEffect(() => {
    fetch(
      "https://graph.instagram.com/me/media?fields=caption,id,media_type,media_url,permalink,thumbnail_url,timestamp,username&access_token=IGQVJYbDJsdXBHT1hGY2M1ZA1dlOHJvVGY1OHpmZA1Y2NGZAFVUs0T084RzlDa1FxeEgtaUpqcmZAZATDFiYlluWjY3SmItcVY1ZAkRBMzI3LUIxcGtlSFpfN2w3LWhZAcU96RzBIZAVN5U2RzR3NRcXlxY1BvLQZDZD",
      {
        method: "get"
      }
    )
      .then(res => res.json())
      .then(json => {
        const imageData = json.data.filter((temp: any) => {
          return ["IMAGE", "CAROUSEL_ALBUM", "VIDEO"].includes(temp.media_type);
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
              <a
                href={data.permalink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={
                    data.media_type == "VIDEO"
                      ? data.thumbnail_url
                      : data.media_url
                  }
                  className={styles.imgResponsive}
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
