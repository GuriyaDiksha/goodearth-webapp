import React, { useState, useRef } from "react";
import Slider from "react-slick";
import "./announcementBarSlider.css";
import playBtn from "./../../images/play.svg";
import pauseBtn from "./../../images/pause.svg";

type Props = {
  dots?: boolean;
  val?: any;
  type?: string;
  dataLength: number;
  isBridalPage: boolean;
};
const AnnouncementBarSlider: React.FC<Props> = ({
  children,
  dataLength,
  isBridalPage
}) => {
  const [play, setPlay] = useState(true);
  const sliderRef = useRef<Slider>(null);

  console.log(play);
  const settings = {
    dots: true,
    arrows: false,
    fade: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    swipeToSlide: false
  };

  const setPauseBtn = () => {
    if (play) {
      sliderRef?.current?.slickPause();
    } else {
      sliderRef?.current?.slickPlay();
    }
    setPlay(!play);
  };

  return (
    <div className="announcementbarSliderContainer">
      {dataLength > 1 && !isBridalPage ? (
        <div className="play-button">
          <img
            src={play ? pauseBtn : playBtn}
            onClick={() => setPauseBtn()}
            width={17}
          />
        </div>
      ) : null}
      <Slider ref={sliderRef} {...settings}>
        {children}
      </Slider>
    </div>
  );
};

export default AnnouncementBarSlider;
