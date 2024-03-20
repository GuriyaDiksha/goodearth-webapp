import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import "./styles.css";

type Props = {
  children: Array<any>;
  activeSlideIndex?: number;
};

const VerticalImageSlider: React.FC<Props> = ({
  children,
  activeSlideIndex
}) => {
  const [activeIndex, setActiveIndex] = useState(activeSlideIndex || 0);

  const settings = {
    dots: false,
    infinite: false,
    slidesToShow: 4,
    slidesToScroll: 1,
    vertical: true,
    arrows: false
  };

  const sliderRef: any = useRef();

  useEffect(() => {
    sliderRef.current?.slickGoTo(activeSlideIndex);
    setActiveIndex(activeSlideIndex || 0);
  }, [sliderRef.current]);

  return (
    <div className={"vertical-image-slider"}>
      {children?.length > 4 && (
        <button
          className={`prev-btn ${activeIndex == 0 && "hide"}`}
          onClick={() => sliderRef?.current?.slickPrev()}
        />
      )}

      <Slider
        ref={sliderRef}
        {...settings}
        beforeChange={(oldIndex, newIndex) => {
          setActiveIndex(newIndex);
        }}
      >
        {children}
      </Slider>

      {children?.length > 4 && (
        <button
          className={`next-btn ${activeIndex ==
            Math.floor(children?.length / 4) && "hide"}`}
          onClick={() => sliderRef?.current?.slickNext()}
        />
      )}
    </div>
  );
};

export default VerticalImageSlider;
