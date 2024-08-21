import Slider from "react-slick";
import React, { useEffect, useState } from "react";
import styles from "../styles.scss";
type Props = {
  facets: object;
  bubbleTitle: any;
  categoryShop: string;
};
type Item = [string, ...any[]];

const PlpBubbles: React.FC<Props> = ({ bubbleTitle, categoryShop }) => {
  const [plpData, setData] = useState([]);
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
    const data: Item[] = bubbleTitle?.categoryObj?.[categoryShop.trim()] || [];
    const elements: any = Array.isArray(data)
      ? data.map(item => item[0].trim())
      : [];
    setData(elements);
  }, [bubbleTitle]);

  return (
    <div className={styles.sliderContainer}>
      <Slider {...settings}>
        {plpData.map((item, index) => (
          <div className={styles.bubbleContainer} key={index}>
            <div>
              <img
                className={styles.bubbleImage}
                src="https://static8.depositphotos.com/1020341/896/i/950/depositphotos_8969502-stock-photo-human-face-with-cracked-texture.jpg"
                alt="img"
              />
            </div>

            <span className={styles.bubbleText}>{item}</span>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default PlpBubbles;
