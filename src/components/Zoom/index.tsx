import React, {
  useMemo,
  useState,
  MouseEventHandler,
  useEffect,
  SyntheticEvent,
  MouseEvent,
  useRef,
  useCallback,
  useLayoutEffect
} from "react";
import cs from "classnames";
import { Props } from "./typings";
import globalStyles from "styles/global.scss";
import styles from "./styles.scss";
import bootstrap from "styles/bootstrap/bootstrap-grid.scss";
import fontStyles from "styles/iconFonts.scss";

const Zoom: React.FC<Props> = ({
  images = [],
  startIndex = 0,
  mobile = false,
  changeModalState = null
}) => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [style, setStyle] = useState({
    scale: 1.1,
    translateX: 0,
    translateY: 0,
    left: 0,
    top: 0
  });
  const mounted = useRef(false);

  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  useLayoutEffect(() => {
    if (!mounted.current) {
      setCurrentIndex(startIndex);
      mounted.current = true;
    }
  });

  useEffect(() => {
    setStyle({
      scale: 1.1,
      translateX: 0,
      translateY: 0,
      left: 0,
      top: 0
    });
  }, [currentIndex]);

  const [imageLoaded, setImageLoaded] = useState(false);

  const onImageLoad = useCallback(
    (event: SyntheticEvent<HTMLImageElement>) => {
      const img = event.currentTarget;
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      const imageVisibleScaleRatio = windowWidth / width;
      const imageVisibleWidth = windowWidth;
      const imageVisibleHeight = height * imageVisibleScaleRatio;
      let scale = 1.1;

      if (windowHeight / imageVisibleHeight > scale) {
        scale = windowHeight / imageVisibleHeight;
      }
      if (windowWidth / imageVisibleWidth > scale) {
        scale = windowWidth / imageVisibleWidth;
      }

      const top = (windowHeight - imageVisibleHeight) / 2;
      const left = (windowWidth - imageVisibleWidth) / 2;

      setStyle({
        scale,
        translateX: 0,
        translateY: 0,
        left: left,
        top: top
      });

      setImageLoaded(true);
    },
    [style, currentIndex]
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const { productImage } = images[currentIndex] || {};
  const src = productImage && productImage.replace(/Micro|Medium/i, "Large");

  const { scale, translateX, translateY, left, top } = style;

  const onImageClick: MouseEventHandler = event => {
    const target = event.currentTarget;
    const index = Number(target.getAttribute("data-index"));
    setCurrentIndex(index);
  };
  const closeModal = () => {
    changeModalState(false);
  };

  const mouseMoveHandler = (e: MouseEvent) => {
    const deltaX = windowWidth / 2 - e.clientX;
    if (!containerRef.current) {
      return;
    }
    const { width, height } = containerRef.current?.getBoundingClientRect();
    const normalizedDeltaX =
      ((deltaX * 2) / windowWidth) * Math.abs((windowWidth - width) / 2);
    const translateX = normalizedDeltaX;

    const deltaY = windowHeight / 2 - e.clientY;
    const normalizedDeltaY =
      ((deltaY * 2) / windowHeight) * Math.abs((windowHeight - height) / 2);
    const translateY = normalizedDeltaY;

    setStyle({
      ...style,
      translateX,
      translateY
    });
  };

  const sidebar = useMemo(() => {
    if (!mobile) {
      return (
        <div className={cs(bootstrap.colMd1, styles.sidebar)}>
          <button
            className={cs(
              fontStyles.icon,
              fontStyles.iconCrossNarrowBig,
              styles.closeBtn
            )}
            onClick={closeModal}
          />
          {images.map(function(v, i) {
            return (
              <div
                className={cs(styles.thumbnailContainer, {
                  [styles.activeThumbnail]: i === currentIndex
                })}
                data-index={i}
                onClick={onImageClick}
                key={v.id}
              >
                <img
                  className={globalStyles.imgResponsive}
                  src={v.productImage}
                />
              </div>
            );
          })}
        </div>
      );
    }
  }, [images, currentIndex]);

  return (
    <div className={styles.container} onMouseMove={mouseMoveHandler}>
      {currentIndex !== undefined && (
        <div
          className={cs(styles.mainImageContainer, {
            [styles.hidden]: !imageLoaded
          })}
          style={{
            transform: `translateX(${translateX}px) translateY(${translateY}px) scale(${scale})`,
            left: `${left}px`,
            top: `${top}px`
          }}
          ref={containerRef}
          onClick={closeModal}
        >
          <img
            src={src}
            onLoad={onImageLoad}
            className={globalStyles.imgResponsive}
            ref={imageRef}
          />
        </div>
      )}
      {sidebar}
    </div>
  );
};

export default Zoom;
