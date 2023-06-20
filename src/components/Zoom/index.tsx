import React, { RefObject, useEffect, useRef, useState } from "react";
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
  const videoRef: RefObject<HTMLVideoElement> = useRef(null);

  const closeModal = () => {
    changeModalState(false);
    document.body.classList.remove(globalStyles.fixed);
  };

  useEffect(() => {
    if (mobile) {
      (document.getElementById(
        selectedMobileImageId
      ) as HTMLDivElement).style.transform = `scale(${zoom})`;
    } else {
      (document.getElementById(
        "pdpImage"
      ) as HTMLDivElement).style.transform = `scale(${zoom})`;
    }
  }, [zoom]);

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
                    selectedImage?.vimeo_link === imgContent?.vimeo_link
                })}
                onClick={() => {
                  setSelectedImage(imgContent);
                  setZoom(1);
                }}
              >
                {imgContent?.media_type === "Image" ? (
                  <img
                    src={imgContent.productImage.replace(
                      /Micro|Large/i,
                      "Medium"
                    )}
                    alt={alt}
                    className={globalStyles.imgResponsive}
                  />
                ) : (
                  <video
                    className={cs(globalStyles.imgResponsive)}
                    src={selectedImage?.vimeo_link}
                    autoPlay
                    loop
                    controls
                    preload="auto"
                  />
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
            />
          ) : (
            <div className={styles.wrp}>
              {selectedImage?.media_type === "Image" ? (
                <img
                  id="pdpImage"
                  src={selectedImage.productImage.replace(
                    /Micro|Large/i,
                    "Medium"
                  )}
                  alt={alt}
                  className={globalStyles.imgResponsive}
                />
              ) : (
                <>
                  <video
                    ref={videoRef}
                    id="pdpImage"
                    className={cs(globalStyles.imgResponsive)}
                    src={selectedImage?.vimeo_link}
                    autoPlay
                    loop
                    controls
                    preload="auto"
                  />
                  {playVideo ? (
                    <button
                      className={styles.play}
                      onClick={() => {
                        videoRef?.current?.pause();
                        setPlayVideo(false);
                      }}
                    >
                      Pause
                    </button>
                  ) : (
                    <button
                      className={styles.play}
                      onClick={() => {
                        videoRef?.current?.play();
                        setPlayVideo(true);
                      }}
                    >
                      Play
                    </button>
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
          {selectedImage?.media_type === "Image" && (
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
        />
      </div>
    </div>
  );
};

export default Zoom;
