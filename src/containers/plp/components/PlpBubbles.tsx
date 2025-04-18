import Slider from "react-slick";
import React, { useEffect, useMemo, useState } from "react";
import styles from "../styles.scss";
import "./PlpBubbles.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import cs from "classnames";
import CookieService from "services/cookie";
import { GA_CALLS } from "constants/cookieConsent";
import { useHistory, useLocation } from "react-router";
import globalStyles from "styles/global.scss";
interface DataItem {
  url: string;
  image: string;
  name: string;
  checked?: boolean;
}

type Props = {
  data: DataItem[];
  source?: string;
  handlePlpBubbleL4Click?: (
    title: string,
    e: React.MouseEvent,
    isChecked: boolean
  ) => any;
};

const PlpBubbles: React.FC<Props> = ({
  data,
  source,
  handlePlpBubbleL4Click
}) => {
  const [bubbleCount, setBubbleCount] = useState(0);
  const isThree = useMemo(() => data.length === 3, [data]);
  const [mobileView, setMobileView] = useState(false);
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    setBubbleCount(data.length || 0);
  }, [data]);

  useEffect(() => {
    // Refresh the page when the user comes back
    history.listen((location, action) => {
      if (action === "POP") {
        window.location.reload();
      }
    });
  }, [history]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isMobile: boolean = window.innerWidth < 481;
      setMobileView(isMobile);
    }
  }, [window.innerWidth]);
  const settings = useMemo(
    () => ({
      dots: false,
      speed: 500,
      slidesToShow: 7,
      slidesToScroll: 3,
      arrows: bubbleCount > 7,
      infinite: false,
      swipeToSlide: true,
      touchThreshold: 10,
      responsive: [
        {
          breakpoint: 1617,
          settings: {
            slidesToShow: 6,
            slidesToScroll: 1,
            arrows: bubbleCount > 6
          }
        },
        {
          breakpoint: 1500,
          settings: {
            slidesToShow: 5,
            slidesToScroll: 1,
            arrows: bubbleCount > 5
          }
        },
        {
          breakpoint: 1259,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 1,
            arrows: bubbleCount > 4
          }
        },

        {
          breakpoint: 992,
          settings: {
            slidesToShow: 5,
            slidesToScroll: 1,
            arrows: bubbleCount > 5
          }
        },
        {
          breakpoint: 938,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 1,
            arrows: bubbleCount > 4
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
            touchThreshold: 20,
            infinite: data.length > 3,
            speed: 500
          }
        }
      ]
    }),
    [bubbleCount, isThree]
  );

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
    const baseUrl = url.split("category_shop")[0] + "category_shop";
    const queryString = url.split("category_shop")[1];
    const transformedQueryString = queryString.replaceAll(/&/g, "%26");
    const updatedUrl = baseUrl + transformedQueryString;
    history.push(updatedUrl);
  };
  const handleBubbleClick = (
    title: string,
    e: React.MouseEvent,
    isChecked: boolean
  ): void => {
    handlePlpBubbleL4Click?.(title, e, isChecked);
  };

  return (
    <React.Fragment>
      {!mobileView ? (
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
                    item.name === "View All" || item.checked
                      ? styles.highlightImgWrap
                      : styles.imgWrap
                  }
                  onClick={e => {
                    if (source === "plpBubbleL3") {
                      plpBubbleGaCall(item?.name);
                      handleClick(item?.url);
                    } else if (source === "plpBubbleL4") {
                      handleBubbleClick(item?.name, e, !item?.checked);
                      plpBubbleGaCall(item?.name);
                    }
                  }}
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
      ) : (
        <div
          className={cs(styles.newSliderContainer, {
            [globalStyles.flexGutterCenter]: data.length === 3
          })}
        >
          {data?.map((item: any) => (
            <div className={styles.bubbleContainer} key={item.url}>
              <div
                className={
                  item.name === "View All" || item.checked
                    ? styles.highlightImgWrap
                    : styles.imgWrap
                }
                onClick={e => {
                  if (source === "plpBubbleL3") {
                    plpBubbleGaCall(item?.name);
                    handleClick(item?.url);
                  } else if (source === "plpBubbleL4") {
                    handleBubbleClick(item?.name, e, !item?.checked);
                    plpBubbleGaCall(item?.name);
                  }
                }}
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
        </div>
      )}
    </React.Fragment>
  );
};

export default PlpBubbles;
