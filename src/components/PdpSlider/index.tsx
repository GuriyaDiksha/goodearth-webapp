import React, {
  memo,
  ReactNode,
  useState,
  useCallback,
  useEffect
} from "react";
import cs from "classnames";

import { Props } from "./typings";
import styles from "./styles.scss";
import globalStyles from "styles/global.scss";
import overlay from "images/3d/3Doverlay.svg";
import Skeleton from "react-loading-skeleton";
import bootstrapStyles from "../../styles/bootstrap/bootstrap-grid.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../styles/myslick.css";
import "./slick.css";
import Slider, { Settings } from "react-slick";

const PdpSlider: React.FC<Props> = memo(
  ({ images = [], activeIndex = 0, className, onImageClick, alt }) => {
    const [currentIndex, setCurrentIndex] = useState<number>(activeIndex);

    const getClickHandler = useCallback((index: number) => {
      return () => {
        onImageClick && onImageClick(index);
      };
    }, []);

    const config: Settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 3,
      arrows: true,
      slidesToScroll: 1,
      initialSlide: 0,
      responsive: [
        {
          breakpoint: 992,
          settings: {
            dots: false,
            arrows: true
          }
        }
      ]
    };

    useEffect(() => {
      if (currentIndex !== activeIndex) {
        setCurrentIndex(activeIndex);
      }
    }, [activeIndex]);

    const imageNodes: ReactNode[] = images.map(
      ({ productImage, id, icon }, index) => {
        return (
          <div
            key={id}
            className={cs(styles.imageContainer, {
              [styles.active]: currentIndex == index,
              [styles.clickable]: onImageClick
            })}
            onClick={onImageClick ? getClickHandler(index) : undefined}
          >
            <img
              alt={alt}
              className={globalStyles.imgResponsive}
              src={productImage}
            ></img>
            {icon && <img src={overlay} className={styles.overlay}></img>}
          </div>
        );
      }
    );

    const tempNode: ReactNode[] = [1, 2, 3].map((id, index) => {
      return (
        <div
          key={id}
          className={cs(styles.imageContainer, {
            [styles.active]: currentIndex == index
          })}
        >
          <Skeleton duration={1} height={160} />
        </div>
      );
    });

    return (
      <div className={cs(styles.container, "pdp-slick")}>
        {images.length > 0 ? (
          <Slider {...config}>{imageNodes}</Slider>
        ) : (
          tempNode
        )}
      </div>
    );
  }
);

export default PdpSlider;
