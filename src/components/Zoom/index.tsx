import React, {
  RefObject,
  useEffect,
  useRef,
  useState,
  MouseEvent
} from "react";
import styles from "./styles.scss";
import cs from "classnames";
import iconStyles from "styles/iconFonts.scss";
import { ProductImage } from "typings/image";
import globalStyles from "styles/global.scss";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "./styles.css";
import ZoomImageSlider from "./ZoomImageSlider";
import plus from "./../../icons/plus.svg";
import minus from "./../../icons/minus.svg";
import play from "./../../icons/playVideo.svg";
import pause from "./../../icons/pauseVideo.svg";

type Props = {
  images: ProductImage[];
  mobile?: boolean;
  changeModalState?: any;
  alt: string;
  startIndex: number;
};

const Zoom: React.FC<Props> = ({
  startIndex,
  images = [],
  mobile = false,
  changeModalState = null,
  alt
}) => {
  const [selectedImage, setSelectedImage] = useState(images?.[startIndex]);
  const [zoom, setZoom] = useState(1);
  const [selectedMobileImageId, setSelectedMobileImageId] = useState(
    `product0`
  );
  const [playVideo, setPlayVideo] = useState(false);
  const videoRef: RefObject<HTMLVideoElement> = useRef(null);
  const videoRef2: RefObject<HTMLVideoElement> = useRef(null);

  const closeModal = () => {
    changeModalState(false);
    // if (mobile) {
    //   (document.getElementById(
    //     "modal-fullscreen"
    //   ) as HTMLDivElement).style.height = "100%";
    //   (document.getElementById(
    //     "modal-fullscreen-container"
    //   ) as HTMLDivElement).style.height = "100%";
    // }

    document.body.classList.remove(globalStyles.fixed);
  };

  useEffect(() => {
    if (mobile) {
      if (document.getElementById(selectedMobileImageId) as HTMLDivElement) {
        (document.getElementById(
          selectedMobileImageId
        ) as HTMLDivElement).style.transform = `scale(${zoom})`;
        (document.getElementById(
          selectedMobileImageId
        ) as HTMLDivElement).style["-webkit-transform"] = `scale(${zoom})`;
        (document.getElementById(
          selectedMobileImageId
        ) as HTMLDivElement).style["-ms-transform"] = `scale(${zoom})`;
      }
    } else {
      (document.getElementById(
        "pdpImage"
      ) as HTMLDivElement).style.transform = `scale(${zoom})`;
      (document.getElementById("pdpImage") as HTMLDivElement).style[
        "-webkit-transform"
      ] = `scale(${zoom})`;
      (document.getElementById("pdpImage") as HTMLDivElement).style[
        "-ms-transform"
      ] = `scale(${zoom})`;
      (document.getElementById(
        "zoomWrapper"
      ) as HTMLDivElement).style.transform = "unset";
    }
  }, [zoom]);

  // ********************** zoom drag *************************
  const [style, setStyle] = useState({
    scale: 1,
    panning: false,
    pointX: 0,
    pointY: 0,
    start: { x: 0, y: 0 }
  });

  const { scale, panning, pointX, pointY, start } = style;
  // const containerRef = useRef<HTMLDivElement>(null);
  // const imageRef = useRef<HTMLImageElement>(null);

  const mouseDownHandler = (e: MouseEvent) => {
    e.preventDefault();
    setStyle({
      ...style,
      start: { x: e.clientX - pointX, y: e.clientY - pointY },
      panning: true
    });
  };
  const mouseUpHandler = (e: MouseEvent) => {
    e.preventDefault();
    setStyle({
      ...style,
      panning: false
    });
  };

  const mouseMoveHandler = (e: MouseEvent) => {
    e.preventDefault();
    if (!panning) {
      return;
    }
    setStyle({
      ...style,
      // pointX: (e.clientX - start.x),
      pointY: e.clientY - start.y
    });
    console.log("Point Y ==" + pointY);
    console.log("Start Y ==" + start.y);
  };
  // ********************** End zoom drag *************************

  // useEffect(() => {
  //   if (
  //     (document.getElementById("modal-fullscreen") as HTMLDivElement) &&
  //     mobile
  //   ) {
  //     (document.getElementById(
  //       "modal-fullscreen"
  //     ) as HTMLDivElement).style.height = "calc(100% - 55px)";
  //     (document.getElementById(
  //       "modal-fullscreen-container"
  //     ) as HTMLDivElement).style.height = "calc(100% - 55px)";
  //   }
  // }, [mobile]);

  return (
    <div
      className={cs(styles.videoPopupContainer, styles.helloar, {
        [styles.mobile]: mobile
      })}
    >
      <div className={styles.body}>
        {!mobile && (
          <div className={styles.left}>
            {images?.map(imgContent => (
              <div
                key={imgContent.id}
                className={cs(styles.thumbnailImg, {
                  [styles.selectdImg]:
                    selectedImage?.productImage === imgContent?.productImage ||
                    selectedImage?.video_link === imgContent?.video_link
                })}
                onClick={() => {
                  setSelectedImage(imgContent);
                  setZoom(1);
                }}
              >
                {imgContent?.media_type === "Image" ||
                imgContent?.type === "main" ? (
                  <img
                    src={imgContent.productImage?.replace(
                      /Micro|Large/i,
                      "Medium"
                    )}
                    alt={alt}
                    className={globalStyles.imgResponsive}
                  />
                ) : (
                  <>
                    {/* <div className={styles.overlayDiv}></div>
                    <ReactPlayer
                      url={imgContent?.vimeo_link}
                      width={"100%"}
                      height={"auto"}
                      playing={playVideo}
                      playsinline={true}
                    /> */}
                    <video
                      ref={videoRef2}
                      src={imgContent?.video_link}
                      autoPlay={false}
                      loop
                      preload="auto"
                      width="100%"
                      height="auto"
                    />
                    {playVideo &&
                    imgContent?.video_link === selectedImage?.video_link ? (
                      <img
                        src={pause}
                        alt="pause"
                        className={styles.play}
                        onClick={() => {
                          videoRef?.current?.pause();
                          videoRef2?.current?.pause();
                          setPlayVideo(false);
                        }}
                      />
                    ) : (
                      <img
                        src={play}
                        alt="play"
                        className={styles.play}
                        onClick={() => {
                          videoRef?.current?.play();
                          videoRef2?.current?.play();
                          setPlayVideo(true);
                        }}
                      />
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        <div
          className={styles.middle}
          onMouseDown={zoom > 1 ? mouseDownHandler : undefined}
          onMouseUp={zoom > 1 ? mouseUpHandler : undefined}
          onMouseMove={zoom > 1 ? mouseMoveHandler : undefined}
        >
          {mobile ? (
            <ZoomImageSlider
              images={images}
              alt={alt}
              setSelectedMobileImageId={setSelectedMobileImageId}
              setZoom={setZoom}
              setSelectedImage={setSelectedImage}
              startIndex={startIndex}
              selectedImage={selectedImage}
            />
          ) : (
            <div
              id="zoomWrapper"
              className={styles.wrp}
              style={{
                transform: `translateX(${pointX}px) translateY(${pointY}px) scale(${scale})`
              }}
            >
              {selectedImage?.media_type === "Image" ||
              selectedImage?.type === "main" ? (
                <img
                  id="pdpImage"
                  src={selectedImage.productImage?.replace(
                    /Micro|Large/i,
                    "Medium"
                  )}
                  alt={alt}
                  className={globalStyles.imgResponsive}
                />
              ) : (
                <>
                  {/* <ReactPlayer
                    url={selectedImage?.vimeo_link}
                    playing={playVideo}
                    width={"100%"}
                    height={"auto"}
                    playsinline={true}
                  /> */}
                  <video
                    id="pdpImage"
                    ref={videoRef}
                    src={selectedImage?.video_link}
                    autoPlay={false}
                    loop
                    preload="auto"
                    width="100%"
                    height="auto"
                  />
                  {playVideo ? (
                    <img
                      src={pause}
                      alt="pause"
                      className={styles.play}
                      onClick={() => {
                        videoRef?.current?.pause();
                        videoRef2?.current?.pause();
                        setPlayVideo(false);
                      }}
                    />
                  ) : (
                    <img
                      src={play}
                      alt="play"
                      className={styles.play}
                      onClick={() => {
                        videoRef?.current?.play();
                        videoRef2?.current?.play();
                        setPlayVideo(true);
                      }}
                    />
                  )}
                </>
              )}
            </div>
          )}
        </div>

        <div className={styles.right}>
          <div className={styles.close} onClick={closeModal}>
            <i
              className={cs(
                iconStyles.icon,
                iconStyles.iconCrossNarrowBig,
                styles.icon,
                styles.iconCross
              )}
            ></i>
          </div>
          {(selectedImage?.media_type === "Image" ||
            selectedImage?.type === "main") && (
            <div className={styles.btnWrp}>
              <button
                className={styles.plus}
                onClick={() => zoom < 4 && setZoom(zoom + 0.5)}
              >
                <img src={plus} alt={"incerment"} />
              </button>

              <div className="custom-range">
                <Slider
                  min={1}
                  max={4}
                  step={0.1}
                  vertical={true}
                  value={zoom}
                  onChange={(value: number) => setZoom(+value)}
                />
              </div>

              <button
                className={styles.minus}
                onClick={() => zoom > 1 && setZoom(zoom - 0.5)}
              >
                <img src={minus} alt={"incerment"} />
              </button>
            </div>
          )}
        </div>
      </div>
      {/* <div className={cs(styles.footer, { [styles.mobileFooter]: mobile })}>
        <DockedPanel
          data={data}
          buttoncall={buttoncall}
          showPrice={showPrice}
          price={price}
          discountPrice={discountPrices}
          mobile={mobile}
          hideAddToBag={true}
        />
      </div> */}
    </div>
  );
};

export default Zoom;
