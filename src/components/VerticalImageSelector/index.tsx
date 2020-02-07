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

const VerticalImageSelector: React.FC<Props> = memo(
  ({ images = [], activeIndex = 0, className, onImageClick }) => {
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
      ({ productImage, id }, index) => {
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
              className={globalStyles.imgResponsive}
              src={productImage}
            ></img>
          </div>
        );
      }
    );

    return <div className={cs(styles.container, className)}>{imageNodes}</div>;
  }
);

export default VerticalImageSelector;
