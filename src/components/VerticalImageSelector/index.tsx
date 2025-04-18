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
import Skeleton from "react-loading-skeleton";
// import ReactPlayer from "react-player";
import VerticalImageSlider from "components/VerticalImageSlider";

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
      ({ productImage, id, icon, media_type, type, video_link }, index) => {
        return (
          <div
            key={id}
            className={cs(styles.imageContainer, {
              [styles.active]: currentIndex == index,
              [styles.clickable]: onImageClick
            })}
            onClick={onImageClick ? getClickHandler(index) : undefined}
          >
            {media_type === "Image" || type === "main" ? (
              <img
                alt={alt}
                className={globalStyles.imgResponsive}
                src={productImage}
              ></img>
            ) : (
              <>
                {/* <div className={styles.overlayDiv}></div>
                <ReactPlayer
                  url={vimeo_link}
                  playing={true}
                  volume={1}
                  muted={true}
                  width={"100%"}
                  height={"auto"}
                  playsinline={true}
                /> */}
                <div
                  dangerouslySetInnerHTML={{
                    __html: `
                      <video
                       id="pdpImageMobile"
                        loop
                        autoplay
                        playsinline
                        preload="metadata"
                        width="100%"
                        height="auto"
                      >
                      <source src="${video_link}" />
                      </video>`
                  }}
                />
              </>
            )}

            {/* {icon && <img src={overlay} className={styles.overlay}></img>} */}
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
      <div className={cs(styles.container, className)} key={images?.[0]?.id}>
        {images.length > 4 ? (
          <VerticalImageSlider>
            {images.length > 0 ? imageNodes : tempNode}
          </VerticalImageSlider>
        ) : images.length > 0 ? (
          imageNodes
        ) : (
          tempNode
        )}
      </div>
    );
  }
);

export default VerticalImageSelector;
