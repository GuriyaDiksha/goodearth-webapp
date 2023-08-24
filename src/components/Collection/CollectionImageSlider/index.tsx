import React from "react";
import "./style.css";
import { CollectionImageSlider } from "./typing";
import Slider from "react-slick";
import { Link } from "react-router-dom";

const CollectionImageSlider: React.FC<CollectionImageSlider> = ({
  sliderImages,
  url,
  name
}) => {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  const childern = (sliderImages as string[])?.map(
    (image: string, i: number) => {
      return (
        <div key={i} className={"imgWrp"}>
          <Link
            to={{
              pathname: url || "#"
            }}
          >
            <img
              src={image ? image : "/static/img/noimageplp.png"}
              alt={name}
              width="400"
            />
          </Link>
        </div>
      );
    }
  );

  return (
    <div className={"collectionImageContainer"}>
      <Slider {...settings}>{childern}</Slider>
    </div>
  );
};

export default CollectionImageSlider;
