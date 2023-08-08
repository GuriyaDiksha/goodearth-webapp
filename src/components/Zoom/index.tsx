import React, { useEffect, useState } from "react";
import DockedPanel from "containers/pdp/docked";
import { Product } from "typings/product";
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
import ReactPlayer from "react-player";

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
  const [selectedMobileImageId, setSelectedMobileImageId] = useState(
    `product0`
  );
  const [playVideo, setPlayVideo] = useState(false);

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
      (document.getElementById(
        selectedMobileImageId
      ) as HTMLDivElement).style.transform = `scale(${zoom})`;
      (document.getElementById(selectedMobileImageId) as HTMLDivElement).style[
        "-webkit-transform"
      ] = `scale(${zoom})`;
      (document.getElementById(selectedMobileImageId) as HTMLDivElement).style[
        "-ms-transform"
      ] = `scale(${zoom})`;
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
    }
  }, [zoom]);

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
            <ZoomImageSlider
              images={images}
              alt={alt}
              setSelectedMobileImageId={setSelectedMobileImageId}
              setZoom={setZoom}
              setSelectedImage={setSelectedImage}
            />
          ) : (
            <div className={styles.wrp}>
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
      <div className={cs(styles.footer, { [styles.mobileFooter]: mobile })}>
        <DockedPanel
          data={data}
          buttoncall={buttoncall}
          showPrice={showPrice}
          price={price}
          discountPrice={discountPrices}
          mobile={mobile}
          hideAddToBag={true}
        />
      </div>
    </div>
  );
};

export default Zoom;
