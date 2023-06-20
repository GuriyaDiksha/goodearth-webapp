import React from "react";
import "./styles.css";
import Slider from "react-slick";
import { ProductImage } from "typings/image";

type Props = {
  images: ProductImage[];
  alt: string;
  setSelectedMobileImageId: (id: string) => void;
  setZoom: (num: number) => void;
};

const ZoomImageSlider: React.FC<Props> = ({
  images,
  alt,
  setSelectedMobileImageId,
  setZoom
}) => {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: (current: number, next: number) => {
      //Set previous image zoom to 1
      (document.getElementById(
        `product${current}`
      ) as HTMLDivElement).style.transform = `scale(${1})`;
      //Set current image zoom to 1
      setSelectedMobileImageId(`product${next}`);
      setZoom(1);
    }
  };

  const childern = images?.map((imgContent, i: number) => {
    return (
      <div key={i} className={"imgWrp"}>
        {imgContent?.media_type === "Image" ? (
          <img
            id={`product${i}`}
            src={imgContent.productImage.replace(/Micro|Large/i, "Large")}
            alt={alt}
          />
        ) : (
          <video
            id={`product${i}`}
            src={imgContent?.vimeo_link}
            autoPlay
            loop
            controls
            preload="auto"
          />
        )}
      </div>
    );
  });

  return (
    <div className={"zoomImageContainer"}>
      <Slider {...settings}>{childern}</Slider>
    </div>
  );
};

export default ZoomImageSlider;
