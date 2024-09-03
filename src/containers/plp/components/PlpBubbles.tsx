import Slider from "react-slick";
import React, { useEffect, useState } from "react";
import styles from "../styles.scss";
import "./PlpBubbles.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
interface DataItem {
  url: string;
  image: string;
  name: string;
}

type Props = {
  data: DataItem[];
};
const PlpBubbles: React.FC<Props> = ({ data }) => {
  const [showBubble, setShowbubble] = useState(false);
  const [bubbleCount, setBubbleCount] = useState(0);
  // const maxBubbleCount: number = 7;
  useEffect(() => {
    setTimeout(() => {
      setShowbubble(true);
      setBubbleCount(data.length || 0);
    }, 1000);
  }, [data]);
  const settings = {
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 2,
    arrows: bubbleCount >= 7,
    infinite: true,
    // centerMode: true
    // initialSlide: 0,
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
        breakpoint: 1318,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 1,
          infinite: true
        }
      },
      {
        breakpoint: 1108,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
          arrows: false
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
        breakpoint: 470,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          arrows: false,
          infinite: false
        }
      }
    ]
  };

  return (
    <React.Fragment>
      {showBubble && (
        <div className={styles.sliderContainer}>
          <Slider {...settings}>
            {data?.map((item: any, index: number) => (
              <div className={styles.bubbleContainer} key={index}>
                <a
                  href={item.url}
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
