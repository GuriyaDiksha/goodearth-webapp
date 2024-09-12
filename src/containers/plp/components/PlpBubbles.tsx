import Slider from "react-slick";
import React, { useCallback, useEffect, useState } from "react";
import styles from "../styles.scss";
import "./PlpBubbles.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import cs from "classnames";
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
  const handleShowBubble = useCallback(() => {
    setShowBubble(true);
    setBubbleCount(data.length || 0);
  }, [data]);

  useEffect(() => {
    setTimeout(handleShowBubble, 1000);
  }, [handleShowBubble, data]);

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
          arrows: bubbleCount >= 7
        }
      },
      {
        breakpoint: 1256,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          arrows: bubbleCount >= 7
        }
      },

      {
        breakpoint: 992,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
          arrows: bubbleCount >= 7
        }
      },
      {
        breakpoint: 938,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          arrows: bubbleCount >= 7
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
        breakpoint: 680,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
          arrows: false,
          swipeToSlide: true,
          touchThreshold: 10
        }
      },
      {
        breakpoint: 580,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 3,
          arrows: false,
          swipeToSlide: true,
          touchThreshold: 10
        }
      },
      {
        breakpoint: 465,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          arrows: false,
          infinite: true,
          swipeToSlide: true,
          touchThreshold: 10
        }
      }
    ]
  };

  return (
    <React.Fragment>
      {showBubble && (
        <div className={cs(styles.sliderContainer, "SliderContainer")}>
          <Slider {...settings}>
            {data?.map((item: any) => (
              <div className={styles.bubbleContainer} key={item.url}>
                <a
                  href={item.url}
                  rel="noopener noreferrer"
                  className={
                    item.name === "View All"
                      ? styles.highlightImgWrap
                      : styles.imgWrap
                  }
                >
                  <img
                    className={styles.bubbleImage}
                    src={item.image}
                    alt="img"
                  />
                </a>
                <span
                  className={
                    item.name === "View All"
                      ? styles.highlightBubbleText
                      : styles.bubbleText
                  }
                >
                  {item.name}
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
