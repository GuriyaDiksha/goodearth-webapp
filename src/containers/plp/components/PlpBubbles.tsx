import Slider from "react-slick";
import React from "react";

type Props = {
  facets: object;
  bubbleTitle: any;
  categoryShop: string;
};
type Item = [string, ...any[]];

const PlpBubbles: React.FC<Props> = ({ bubbleTitle, facets, categoryShop }) => {
  const settings = {
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: false,
    centerMode: true, // enable center mode
    centerPadding: "50px" // set center padding
  };

  console.log(
    "Bubble Title bbb ---> ",
    bubbleTitle?.categoryObj?.[categoryShop.trim()]
  );
  const data: Item[] = bubbleTitle?.categoryObj?.[categoryShop.trim()] || [];
  const elements = Array.isArray(data) ? data.map(item => item[0].trim()) : [];
  console.log(elements);

  return (
    <Slider {...settings}>
      {elements.map((item, index) => (
        <div
          style={{
            borderRadius: "50%",
            maxHeight: "97px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            backgroundColor: "pink",
            width: "fit-content"
          }}
          key={index}
        >
          <img
            src="https://static8.depositphotos.com/1020341/896/i/950/depositphotos_8969502-stock-photo-human-face-with-cracked-texture.jpg"
            alt="img"
            style={{
              borderRadius: "50%",
              width: "97px",
              height: "97px",
              objectFit: "cover"
            }}
          />
          <span
            style={{ color: "#000", fontSize: "12px", textAlign: "center" }}
          >
            {item}
          </span>
        </div>
      ))}
    </Slider>
  );
};

export default PlpBubbles;
