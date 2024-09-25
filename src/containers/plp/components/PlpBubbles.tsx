import Slider from "react-slick";
import React, { useCallback, useEffect, useState } from "react";
import styles from "../styles.scss";
import "./PlpBubbles.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import cs from "classnames";
import CookieService from "services/cookie";
import { GA_CALLS } from "constants/cookieConsent";
import { useHistory, useLocation } from "react-router";
interface DataItem {
  url: string;
  image: string;
  name: string;
}

type Props = {
  data: DataItem[];
};
const PlpBubbles: React.FC<Props> = ({ data }) => {
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleCount, setBubbleCount] = useState(0);
  const history = useHistory();
  const location = useLocation();

  const handleShowBubble = useCallback(() => {
    setShowBubble(true);
    setBubbleCount(data.length || 0);
  }, [data]);

  useEffect(() => {
    setTimeout(handleShowBubble, 1000);
  }, [handleShowBubble, data]);
  useEffect(() => {
    // Refresh the page when the user comes back
    history.listen((location, action) => {
      if (action === "POP") {
        window.location.reload();
      }
    });
  }, [history]);

  const settings = {
    dots: false,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 3,
    arrows: bubbleCount > 7,
    infinite: false,
    swipeToSlide: true,

    responsive: [
      {
        breakpoint: 1617,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 1,
          arrows: bubbleCount > 7
        }
      },
      {
        breakpoint: 1500,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
          arrows: bubbleCount > 7
        }
      },
      {
        breakpoint: 1259,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          arrows: bubbleCount > 7
        }
      },

      {
        breakpoint: 992,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
          arrows: bubbleCount > 7
        }
      },
      {
        breakpoint: 938,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          arrows: bubbleCount > 7
        }
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 1,
          arrows: false,
          swipeToSlide: true,
          touchThreshold: 10
        }
      },
      {
        breakpoint: 656,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
          arrows: false,
          swipeToSlide: true,
          touchThreshold: 10
        }
      },

      {
        breakpoint: 551,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          arrows: false,
          swipeToSlide: true,
          touchThreshold: 10,
          infinite: bubbleCount > 3
        }
      },
      {
        breakpoint: 453,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          arrows: false,
          infinite: bubbleCount > 3,
          swipeToSlide: true,
          // touchThreshold: 10 ,
          cssEase: "linear",
          // // variableWidth: true,
          // autoplay: true,
          autoplaySpeed: 5000
        }
      }
    ]
  };
  const plpBubbleGaCall = (categoryType: string): void => {
    const userConsent: string[] = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({
        event: "bubble_click",
        cta_name: categoryType
      });
    }
  };
  const handleClick = (url: string): void => {
    const baseUrl = url.split("Home")[0] + "Home";
    const queryString = url.split("Home")[1];
    const transformedQueryString = queryString.replaceAll(/&/g, "%26");
    const updatedUrl = baseUrl + transformedQueryString;
    history.push(updatedUrl);
  };
  return (
    <React.Fragment>
      {showBubble && (
        <div
          className={cs(
            styles.sliderContainer,
            { [styles.marginLeft]: bubbleCount === 3 },
            "SliderContainer"
          )}
        >
          <Slider {...settings}>
            {data?.map((item: any) => (
              <div className={styles.bubbleContainer} key={item.url}>
                <div
                  className={
                    item.name === "View All"
                      ? styles.highlightImgWrap
                      : styles.imgWrap
                  }
                  onClick={() => (
                    plpBubbleGaCall(item?.name), handleClick(item?.url)
                  )}
                >
                  <img
                    className={styles.bubbleImage}
                    src={item?.image}
                    alt="img"
                  />
                </div>
                <span
                  className={
                    item?.name === "View All"
                      ? styles.highlightBubbleText
                      : styles.bubbleText
                  }
                >
                  {item?.name}
                </span>
              </div>
            ))}
          </Slider>
        </div>
      )}
    </React.Fragment>
  );
};

export default PlpBubbles;
