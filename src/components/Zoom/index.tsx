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

type Props = {
  code: string;
  data: Product;
  showAddToBagMobile?: boolean;
  buttoncall: any;
  showPrice: boolean;
  price: string | number;
  discountPrices: string | number;
  images: ProductImage[];
  startIndex: number;
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
  startIndex = 0,
  mobile = false,
  changeModalState = null,
  alt
}) => {
  const [selectedImage, setSelectedImage] = useState(images?.[0].productImage);
  const [zoom, setZoom] = useState(1);

  const closeModal = () => {
    changeModalState(false);
    document.body.classList.remove(globalStyles.fixed);
  };

  useEffect(() => {
    (document.getElementById(
      "pdpImage"
    ) as HTMLDivElement).style.transform = `scale(${zoom})`;
  }, [zoom]);

  return (
    <div
      className={cs(styles.videoPopupContainer, styles.helloar, {
        [styles.mobile]: mobile
      })}
    >
      <div className={styles.body}>
        <div className={styles.left}>
          {images?.map(imgContent => (
            <div
              key={imgContent.id}
              className={cs(styles.thumbnailImg, {
                [styles.selectdImg]: selectedImage === imgContent.productImage
              })}
              onClick={() => setSelectedImage(imgContent.productImage)}
            >
              <img
                src={imgContent.productImage.replace(/Micro|Large/i, "Medium")}
                alt={alt}
                className={globalStyles.imgResponsive}
              />
            </div>
          ))}
        </div>

        <div className={styles.middle}>
          <div className={styles.wrp}>
            <img
              id="pdpImage"
              src={selectedImage.replace(/Micro|Large/i, "Medium")}
              alt={alt}
              className={globalStyles.imgResponsive}
            />
          </div>
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
          <div className={styles.btnWrp}>
            <button
              className={styles.plus}
              onClick={() => zoom < 4 && setZoom(zoom + 0.5)}
            >
              +
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
              -
            </button>
          </div>
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
