import React from "react";
import "./styles.css";
import Slider from "react-slick";
import { ProductImage } from "typings/image";
import ReactPlayer from "react-player";

type Props = {
  images: ProductImage[];
  alt: string;
  setSelectedMobileImageId: (id: string) => void;
  setZoom: (num: number) => void;
  setSelectedImage: (imgcontent: any) => void;
};

const ZoomImageSlider: React.FC<Props> = ({
  images,
  alt,
  setSelectedMobileImageId,
  setZoom,
  setSelectedImage
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
      setSelectedImage(images?.[next]);
      setZoom(1);
    }
  };

  const childern = images?.map((imgContent, i: number) => {
    return (
      <div key={i} className={"imgWrp"}>
        {imgContent?.media_type === "Image" || imgContent?.type === "main" ? (
          <img
            id={`product${i}`}
            src={imgContent?.productImage?.replace(/Micro|Large/i, "Large")}
            alt={alt}
          />
        ) : (
          <>
            <div className={"overlayDiv"}></div>
            <ReactPlayer
              url={imgContent?.vimeo_link}
              playing={true}
              width={"100%"}
              height={"auto"}
              volume={1}
              muted={true}
              id={`product${i}`}
            />
          </>
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
