import React, {
  memo,
  ReactNode,
  useState,
  useCallback,
  useEffect,
  useRef
} from "react";
import cs from "classnames";

import { Props } from "./typings";
import styles from "./styles.scss";
import globalStyles from "styles/global.scss";
import overlay from "images/3d/3Doverlay.svg";
// import Skeleton from "react-loading-skeleton";
// import bootstrapStyles from "../../styles/bootstrap/bootstrap-grid.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../styles/myslick.css";
import "./slick.css";
import Slider from "react-slick";

import { config } from "./sliderConfig";

const PdpSlider: React.FC<Props> = memo(
  ({ images = [], activeIndex = 0, className, onImageClick, alt }) => {
    const [currentIndex, setCurrentIndex] = useState<number>(activeIndex);

    const getClickHandler = useCallback((index: number) => {
      return () => {
        onImageClick && onImageClick(index);
      };
    }, []);

    const sliderRef: any = useRef();

    useEffect(() => {
      if (currentIndex !== activeIndex) {
        setCurrentIndex(activeIndex);
      }
    }, [activeIndex]);
    const imageslist = images.length == 1 ? images.concat(images[0]) : images;
    let iconcount = 0;
    const imageNodes: ReactNode[] = imageslist.map(
      ({ productImage, id, icon }, index) => {
        if (icon) {
          iconcount++;
        }
        return (
          <div
            key={`${id}${index}`}
            className={cs(styles.imageContainer, {
              [styles.active]: currentIndex == index,
              [styles.clickable]: onImageClick
            })}
            onClick={onImageClick ? getClickHandler(index) : undefined}
          >
            <img
              width="400"
              alt={alt}
              className={globalStyles.imgResponsive}
              src={productImage.replace("/Micro/", "/Medium/")}
            ></img>
            {icon && iconcount == 1 && (
              <img src={overlay} className={styles.overlay} width="400"></img>
            )}
          </div>
        );
      }
    );

    useEffect(() => {
      if (config.slidesToShow) {
        if (activeIndex % config.slidesToShow == 0) {
          sliderRef.current ? sliderRef.current.slickGoTo(activeIndex) : "";
        }
      }
    }, [activeIndex]);

    // const tempNode: ReactNode[] = imageNodes.map((data, index) => {
    //   return (
    //     <div key={index} className={cs(styles.imageContainer)}>
    //       {data}
    //     </div>
    //   );
    // });
    const newclass =
      imageslist.length <= 2 ? styles.newcontainer : styles.container;
    return (
      <div
        className={cs(newclass, "pdp-slick", {
          [globalStyles.flex]: imageslist.length <= 2
        })}
      >
        {images.length > 2 ? (
          <Slider ref={sliderRef} {...config}>
            {imageNodes}
          </Slider>
        ) : (
          imageNodes
        )}
      </div>
    );
  }
);

export default PdpSlider;
