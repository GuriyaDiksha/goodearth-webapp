import React, { useState } from "react";
import styles from "../../styles/bootstrap/bootstrap-grid.scss";
import VerticalImageSlider from "./index";

export default { title: "Vertical Image Slider" };

const VerticalSliderDemo: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(1);

  const images = [
    {
      id: 214952,
      productImage:
        "https://djhiy8e1dslha.cloudfront.net/media/images/product/Medium/I00203970-1579587625.jpg",
      displayOrder: 0,
      social: true
    },
    {
      id: 461678,
      productImage:
        "https://djhiy8e1dslha.cloudfront.net/media/images/product/Micro/I00203970_S-1579587621.jpg",
      caption: "",
      displayOrder: 0,
      social: false
    },
    {
      id: 461679,
      productImage:
        "https://djhiy8e1dslha.cloudfront.net/media/images/product/Micro/I00203970_S-1579587623.jpg",
      caption: "",
      displayOrder: 1,
      social: false
    }
  ];

  const onImageClick = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className={styles.row}>
      <div className={styles.colMd1}>
        <VerticalImageSlider
          images={images}
          activeIndex={activeIndex}
          onImageClick={onImageClick}
        />
      </div>
    </div>
  );
};

export const VerticalSlider = () => {
  return <VerticalSliderDemo />;
};
