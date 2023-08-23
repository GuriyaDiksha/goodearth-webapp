import React, { useEffect, useRef, useState } from "react";
// import DockedPanel from "containers/pdp/docked";
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
import ReactPlayer from "react-player";
import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchRef
} from "react-zoom-pan-pinch";

type Props = {
  code: string;
  data: Product;
  showAddToBagMobile?: boolean;
  buttoncall: any;
  showPrice: boolean;
  price: string | number;
  discountPrices: string | number;
  images: ProductImage[];
  mobile?: boolean;
  changeModalState?: any;
  alt: string;
};

const Zoom: React.FC<Props> = ({
  data,
  buttoncall,
  showPrice,
  price,
  discountPrices,
  images = [],
  mobile = false,
  changeModalState = null,
  alt
}) => {
  const [selectedImage, setSelectedImage] = useState(images?.[0]);
  const [zoom, setZoom] = useState(1);
  const transformComponentRef = useRef<ReactZoomPanPinchRef | null>(null);
  const transformComponentMobileRef = useRef<ReactZoomPanPinchRef | null>(null);
  const [playVideo, setPlayVideo] = useState(false);

  const closeModal = () => {
    changeModalState(false);

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
    }
    setZoom(value);
  };

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
                    selectedImage?.productImage === imgContent?.productImage
                  // selectedImage?.vimeo_link === imgContent?.vimeo_link
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
                    <div className={styles.overlayDiv}></div>
                    <ReactPlayer
                      url={imgContent?.vimeo_link}
                      width={"100%"}
                      height={"auto"}
                      playing={playVideo}
                      playsinline={true}
                    />
                    {playVideo &&
                    imgContent?.vimeo_link === selectedImage?.vimeo_link ? (
                      <img
                        src={pause}
                        alt="pause"
                        className={styles.play}
                        onClick={() => {
                          setPlayVideo(false);
                        }}
                      />
                    ) : (
                      <img
                        src={play}
                        alt="play"
                        className={styles.play}
                        onClick={() => {
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
                    initialPositionX={0}
                    initialScale={zoom}
                    initialPositionY={0}
                    ref={transformComponentMobileRef}
                    pinch={{ disabled: true }}
                    wheel={{ disabled: true, touchPadDisabled: true }}
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
                  ""
                )}
              </div>
            </div>
          ) : (
            <div id="zoomWrapper" className={styles.wrp}>
              {selectedImage?.media_type === "Image" ||
              selectedImage?.type === "main" ? (
                <TransformWrapper
                  initialPositionX={0}
                  initialScale={zoom}
                  initialPositionY={0}
                  ref={transformComponentRef}
                  pinch={{ disabled: true }}
                  wheel={{ disabled: true, touchPadDisabled: true }}
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
                  <ReactPlayer
                    url={selectedImage?.vimeo_link}
                    playing={playVideo}
                    width={"100%"}
                    height={"auto"}
                    playsinline={true}
                  />
                  {playVideo ? (
                    <img
                      src={pause}
                      alt="pause"
                      className={styles.play}
                      onClick={() => {
                        // videoRef?.current?.pause();
                        setPlayVideo(false);
                      }}
                    />
                  ) : (
                    <img
                      src={play}
                      alt="play"
                      className={styles.play}
                      onClick={() => {
                        // videoRef?.current?.play();
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
