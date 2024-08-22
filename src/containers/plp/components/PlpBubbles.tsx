import Slider from "react-slick";
import React, { useEffect, useState } from "react";
import styles from "../styles.scss";
type Props = {
  data: any;
};
const PlpBubbles: React.FC<Props> = ({ data }) => {
  const [showBubble, setShowbubble] = useState(false);

  const settings = {
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 1,

    infinite: false,
    nextArrow: (
      <div>
        <div className="next-slick-arrow">&gt;</div>
      </div>
    ),
    prevArrow: (
      <div>
        <div className="prev-slick-arrow"> &lt;</div>
      </div>
    ),
    responsive: [
      {
        breakpoint: 1132,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 717,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 717,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      }
    ]
  };
  useEffect(() => {
    setTimeout(() => {
      setShowbubble(true);
    }, 1000);
  }, []);

  return (
    <>
      {showBubble && (
        <div className={styles.sliderContainer}>
          <Slider {...settings}>
            {data.map((item: any, index: number) => (
              <div className={styles.bubbleContainer} key={index}>
                <div>
                  <img
                    className={styles.bubbleImage}
                    src={item.image}
                    alt="img"
                  />
                </div>
                <span className={styles.bubbleText}>{item.name}</span>
              </div>
            ))}
          </Slider>
        </div>
      )}
    </>
  );
};

export default PlpBubbles;
