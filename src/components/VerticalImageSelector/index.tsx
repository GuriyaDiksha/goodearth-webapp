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

const VerticalImageSelector: React.FC<Props> = memo(
  ({ images = [], activeIndex = 0, className, onImageClick, alt }) => {
    const [currentIndex, setCurrentIndex] = useState<number>(activeIndex);

    const getClickHandler = useCallback((index: number) => {
      return () => {
        onImageClick && onImageClick(index);
      };
    }, []);

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

    return <div className={cs(styles.container, className)}>{imageNodes}</div>;
  }
);

export default VerticalImageSelector;
