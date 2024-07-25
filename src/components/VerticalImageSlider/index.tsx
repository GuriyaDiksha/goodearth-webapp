import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import "./styles.css";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import "../../styles/myslick.css";
import cs from "classnames";

type Props = {
  children: Array<any>;
  activeSlideIndex?: number;
};

const VerticalImageSlider: React.FC<Props> = ({
  children,
  activeSlideIndex
}) => {
  // const [activeIndex, setActiveIndex] = useState(activeSlideIndex || 0);
  const [currentSlide, setCurrentSlide] = useState(0);

  const settings = {
    dots: false,
    infinite: false,
    slidesToShow: 4,
    slidesToScroll: 1,
    vertical: true,
    arrows: false,
    afterChange: (current: any) => {
      setCurrentSlide(current);
    }
  };

  const sliderRef: any = useRef();

  // useEffect(() => {
  //   sliderRef.current?.slickGoTo(activeSlideIndex);
  //   setActiveIndex(activeSlideIndex || 0);
  // }, [sliderRef.current]);

  return (
    <div className={"vertical-image-slider"}>
      {children?.length > 4 && (
        <button
          className="prev-btn"
          onClick={() => sliderRef?.current?.slickPrev()}
          disabled={currentSlide === 0}
        />
      )}

      <Slider
        ref={sliderRef}
        {...settings}
        // beforeChange={(oldIndex, newIndex) => {
        //   setActiveIndex(newIndex);
        // }}
      >
        {children}
      </Slider>

      {children?.length > 4 && (
        <button
          className="next-btn"
          onClick={() => sliderRef?.current?.slickNext()}
          disabled={currentSlide === Math.floor(children?.length / 4)}
        />
      )}
    </div>
  );
};

export default VerticalImageSlider;
