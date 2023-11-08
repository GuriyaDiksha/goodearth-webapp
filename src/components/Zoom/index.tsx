import React, { RefObject, useEffect, useRef, useState } from "react";
import { Product } from "typings/product";
import styles from "./styles.scss";
import cs from "classnames";
import iconStyles from "styles/iconFonts.scss";
import { ProductImage } from "typings/image";
import globalStyles from "styles/global.scss";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "./styles.css";
import plus from "./../../icons/plus.svg";
import minus from "./../../icons/minus.svg";
import play from "./../../icons/playVideo.svg";
import pause from "./../../icons/pauseVideo.svg";
import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchRef
} from "react-zoom-pan-pinch";
import DockedPanel from "containers/pdp/docked";

type Props = {
  images: ProductImage[];
  mobile?: boolean;
  changeModalState?: any;
  alt: string;
  startIndex: number;
  data: Product;
  buttoncall: any;
  showPrice: boolean;
  price: string | number;
  discountPrices: string | number;
  tablet: boolean;
};

const Zoom: React.FC<Props> = ({
  startIndex,
  images = [],
  mobile = false,
  changeModalState = null,
  alt,
  data,
  buttoncall,
  showPrice,
  price,
  discountPrices,
  tablet = false
}) => {
  const [selectedImage, setSelectedImage] = useState(images?.[startIndex]);
  const [zoom, setZoom] = useState(1);
  const transformComponentRef = useRef<ReactZoomPanPinchRef | null>(null);
  const transformComponentMobileRef = useRef<ReactZoomPanPinchRef | null>(null);
  const [playVideo, setPlayVideo] = useState(false);
  const videoRef: RefObject<HTMLVideoElement> = useRef(null);
  const videoRef2: RefObject<HTMLVideoElement> = useRef(null);

  useEffect(() => {
    if (
      typeof document == "object" &&
      (document?.getElementById("modal-fullscreen") as HTMLElement) &&
      mobile
    ) {
      (document.getElementById(
        "modal-fullscreen"
      ) as HTMLElement).style.height = "calc(100% - 55px)";
    }
    if (document?.getElementById("modal-fullscreen-container") && mobile) {
      (document.getElementById(
        "modal-fullscreen-container"
      ) as HTMLElement).style.height = "calc(100% - 55px)";
    }
  }, []);

  const closeModal = () => {
    changeModalState(false);
    if (
      typeof document == "object" &&
      (document?.getElementById("modal-fullscreen") as HTMLElement) &&
      mobile
    ) {
      (document.getElementById(
        "modal-fullscreen"
      ) as HTMLElement).style.height = "calc(100% - 55px)";
    }
    if (document?.getElementById("modal-fullscreen-container") && mobile) {
      (document.getElementById(
        "modal-fullscreen-container"
      ) as HTMLElement).style.height = "calc(100% - 55px)";
    }

    document.body.classList.remove(globalStyles.fixed);
  };

  const setZoomcall = (value: any) => {
    if (mobile) {
      if (value > zoom) {
        transformComponentMobileRef.current
          ? transformComponentMobileRef.current.zoomIn()
          : "";
      } else {
        transformComponentMobileRef.current
          ? transformComponentMobileRef.current.zoomOut()
          : "";
      }
      setZoom(
        transformComponentMobileRef?.current?.instance?.transformState?.scale ||
          1
      );
    } else {
      if (value > zoom) {
        transformComponentRef.current
          ? transformComponentRef.current.zoomIn()
          : "";
      } else {
        transformComponentRef.current
          ? transformComponentRef.current.zoomOut()
          : "";
      }
      setZoom(
        transformComponentRef?.current?.instance?.transformState?.scale || 1
      );
    }
  };

  const handleScaleChange = (event: any) => {
    setZoom(event.instance.transformState.scale);
  };

  const onPan = (ref: any, e: any) => {
    ref.zoomIn();
  };
  const onPinch = (ref: any, e: any) => {
    ref.zoomOut();
  };

  return (
    <div
      id="zoomPopup"
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
                    selectedImage?.productImage === imgContent?.productImage
                })}
                onClick={() => {
                  setSelectedImage(imgContent);
                  transformComponentRef?.current?.setTransform(0, 0, 1);
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

        <div className={styles.middle}>
          {mobile ? (
            <div className={"zoomImageContainer"}>
              <div className={"imgWrp"}>
                {selectedImage?.media_type === "Image" ||
                selectedImage?.type === "main" ? (
                  <TransformWrapper
                    minScale={1}
                    maxScale={4}
                    initialPositionX={0}
                    initialScale={zoom}
                    initialPositionY={0}
                    ref={transformComponentMobileRef}
                    // pinch={{ disabled: true }}
                    doubleClick={{ disabled: true }}
                    onTransformed={e => handleScaleChange(e)}
                    onPinching={(ref, e) => onPinch(ref, e)}
                    onPanning={(ref, e) => onPan(ref, e)}
                  >
                    <TransformComponent>
                      <img
                        id="pdpImageMobile"
                        src={selectedImage.productImage?.replace(
                          /Micro|Medium/i,
                          "Large"
                        )}
                        alt={alt}
                        className={globalStyles.imgResponsive}
                      />
                    </TransformComponent>
                  </TransformWrapper>
                ) : (
                  <div
                    className={styles.videoWrpHeight}
                    dangerouslySetInnerHTML={{
                      __html: `
                      <video
                       id="pdpImageMobile"
                        loop
                        autoplay
                        playsinline
                        preload="metadata"
                      >
                      <source src="${selectedImage?.video_link}" />
                      </video>`
                    }}
                  />
                )}
              </div>
            </div>
          ) : (
            <div
              id="zoomWrapper"
              className={cs(styles.wrp, {
                [styles.videoWrp]:
                  selectedImage?.media_type !== "Image" &&
                  selectedImage?.type !== "main"
              })}
            >
              {selectedImage?.media_type === "Image" ||
              selectedImage?.type === "main" ? (
                <TransformWrapper
                  minScale={1}
                  maxScale={4}
                  initialPositionX={0}
                  initialScale={zoom}
                  initialPositionY={0}
                  ref={transformComponentRef}
                  // pinch={{ disabled: true }}
                  // wheel={{ disabled: true, touchPadDisabled: true }}
                  doubleClick={{ disabled: true }}
                  onTransformed={e => handleScaleChange(e)}
                  onPinching={(ref, e) => onPinch(ref, e)}
                  onPanning={(ref, e) => onPan(ref, e)}
                >
                  <TransformComponent>
                    <img
                      id="pdpImage"
                      src={selectedImage.productImage?.replace(
                        /Micro|Medium/i,
                        "Large"
                      )}
                      alt={alt}
                      className={globalStyles.imgResponsive}
                    />
                  </TransformComponent>
                </TransformWrapper>
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
          {!mobile &&
            (selectedImage?.media_type === "Image" ||
              selectedImage?.type === "main") && (
              <div className={styles.btnWrp}>
                <button
                  className={styles.plus}
                  onClick={() => zoom < 4 && setZoomcall(zoom + 0.5)}
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
                    onChange={(value: number) => setZoomcall(+value)}
                  />
                </div>

                <button
                  className={styles.minus}
                  onClick={() => zoom > 1 && setZoomcall(zoom - 0.5)}
                >
                  <img src={minus} alt={"incerment"} />
                </button>
              </div>
            )}
        </div>
      </div>
      <div
        className={cs(styles.footer, {
          [styles.mobileFooter]: mobile || tablet
        })}
      >
        <DockedPanel
          data={data}
          buttoncall={buttoncall}
          showPrice={showPrice}
          price={price}
          discountPrice={discountPrices}
          mobile={mobile}
        />
      </div>
    </div>
  );
};

export default Zoom;
