import React from "react";
import "./style.css";
import { CollectionImageSlider } from "./typing";
import Slider from "react-slick";
import { Link, useLocation } from "react-router-dom";

const CollectionImageSlider: React.FC<CollectionImageSlider> = ({
  sliderImages,
  url,
  name
}) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  const { search, pathname } = useLocation();

  const vars: { tags?: string } = {};
  const re = /[?&]+([^=&]+)=([^&]*)/gi;
  let match;

  while ((match = re.exec(search))) {
    vars[match[1]] = match[2];
  }

  const childern = (sliderImages as string[])?.map(
    (image: string, i: number) => {
      return (
        <div key={i} className={"imgWrp"}>
          <Link
            to={{
              pathname: url || "#",
              search: "?tags=" + `${vars.tags || "All Collections"}`,
              state: { prevPath: `${pathname}` }
            }}
          >
            <img
              src={image ? image : "/static/img/noimageplp.png"}
              alt={name}
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
