import Slider from "react-slick";
import React, { useEffect, useState } from "react";
import styles from "../styles.scss";
import "./PlpBubbles.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
type Props = {
  data: any;
};
const PlpBubbles: React.FC<Props> = ({ data }) => {
  const [showBubble, setShowbubble] = useState(false);

  const settings = {
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 1,
    // arrows: false,
    infinite: false,
    initialSlide: 0,
    // nextArrow: (
    //   <div>
    //     <div
    //       className="next-slick-arrow"
    //       style={{ color: "red", marginTop: "12px",marginLeft:"12px" }}
    //     >
    //       &gt;
    //     </div>
    //   </div>
    // ),
    // prevArrow: (
    //   <div>
    //     <div
    //       className="prev-slick-arrow"
    //       style={{ color: "red", marginTop: "12px" }}
    //     >
    //       &lt;
    //     </div>
    //   </div>
    // ),
    responsive: [
      {
        breakpoint: 1132,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 1,
          infinite: true
        }
      },

      {
        breakpoint: 717,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
          arrows: false
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          arrows: false
        }
      },
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          arrows: false
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
    <React.Fragment>
      {showBubble && (
        <div className={styles.sliderContainer}>
          <Slider {...settings}>
            {data?.map((item: any, index: number) => (
              <div className={styles.bubbleContainer} key={index}>
                <a
                  href={item?.url}
                  rel="noopener noreferrer"
                  key={index}
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
