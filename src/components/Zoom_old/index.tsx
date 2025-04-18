import React, {
  useMemo,
  useState,
  MouseEventHandler,
  // useEffect,
  SyntheticEvent,
  MouseEvent,
  useRef,
  useCallback,
  useLayoutEffect,
  useEffect
} from "react";
import cs from "classnames";
import { Props } from "./typings";
import globalStyles from "styles/global.scss";
import styles from "./styles.scss";
import bootstrap from "styles/bootstrap/bootstrap-grid.scss";
import fontStyles from "styles/iconFonts.scss";
import close from "./../../images/closeZoom.svg";

const Zoom: React.FC<Props> = ({
  images = [],
  startIndex = 0,
  mobile = false,
  changeModalState = null,
  alt
}) => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const canUseDOM = !!(
    typeof window !== "undefined" &&
    typeof window.document !== "undefined" &&
    typeof window.document.createElement !== "undefined"
  );

  const useIsomorphicLayoutEffect = canUseDOM ? useLayoutEffect : useEffect;
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
  useIsomorphicLayoutEffect(() => {
    if (!mounted.current) {
      setCurrentIndex(startIndex);
      mounted.current = true;
    }
  });

  // useEffect(() => {
  //   setStyle({
  //     scale: 1.1,
  //     translateX: 0,
  //     translateY: 0,
  //     left: 0,
  //     top: 0
  //   });
  // }, [currentIndex]);

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
    document.body.classList.remove(globalStyles.fixed);
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
          {/* <button
            className={cs(
              fontStyles.icon,
              fontStyles.iconCrossNarrowBig,
              styles.closeBtn
            )}
            onClick={closeModal}
          /> */}
          <img src={close} className={styles.close} onClick={closeModal} />
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
                  alt={alt}
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

  const updateIndex = useCallback((value: number) => {
    setCurrentIndex(currentIndex => currentIndex + value);
  }, []);
  const navigation = useMemo(() => {
    return (
      <div className={styles.navigationContainer}>
        <button
          className={cs(fontStyles.iconArrowLeft, fontStyles.icon, styles.prev)}
          style={{ visibility: currentIndex > 0 ? "visible" : "hidden" }}
          onClick={() => updateIndex(-1)}
        />
        <button
          className={cs(
            fontStyles.iconArrowRight,
            fontStyles.icon,
            styles.next
          )}
          style={{
            visibility: currentIndex < images.length - 1 ? "visible" : "hidden"
          }}
          onClick={() => updateIndex(1)}
        />
      </div>
    );
  }, [images, currentIndex]);
  return (
    <div
      className={styles.container}
      onMouseMove={mobile ? undefined : mouseMoveHandler}
    >
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
            alt={alt}
            src={src}
            onLoad={onImageLoad}
            className={globalStyles.imgResponsive}
            ref={imageRef}
          />
        </div>
      )}
      {sidebar}
      {mobile && (
        // <button
        //   className={cs(
        //     fontStyles.icon,
        //     fontStyles.iconCrossNarrowBig,
        //     styles.closeBtn,
        //     styles.mobile
        //   )}
        //   onClick={closeModal}
        // />
        <img
          src={close}
          className={cs(styles.close, styles.mobile)}
          onClick={closeModal}
          height={30}
          width={30}
        />
      )}
      {mobile && navigation}
    </div>
  );
};

export default Zoom;
