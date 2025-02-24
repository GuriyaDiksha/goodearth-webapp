import React from "react";
import cs from "classnames";
import Skeleton from "react-loading-skeleton";
import styles from "../styles.scss";
import pdp_top from "images/3d/pdp_top.svg";
import button_image from "images/3d/button_image.svg";
import { useDispatch } from "react-redux";
import { updateComponent, updateModal } from "actions/modal";
import { POPUP } from "constants/components";
import { Product } from "typings/product";
import { Currency } from "typings/currency";
// import ReactPlayer from "react-player";
import { GA_CALLS } from "constants/cookieConsent";
import CookieService from "services/cookie";

type Props = {
  productImages: any;
  onClick: (index: number) => void;
  is3d: boolean;
  data?: Product;
  selectedSizeId?: number | undefined;
  currency?: Currency;
  corporatePDP?: boolean;
  buttoncall?: JSX.Element | null | undefined;
  handleLooksClick: (e: any) => void;
  productName?: string;
};

const PDPImagesContainer: React.FC<Props> = ({
  corporatePDP,
  buttoncall,
  data,
  currency,
  selectedSizeId,
  productImages,
  onClick,
  is3d,
  handleLooksClick,
  productName
}) => {
  const dispatch = useDispatch();

  const onClick3dButton = (e: any, code: any) => {
    if (data && currency) {
      const selectedSize = data?.childAttributes?.filter(
        item => item.id == selectedSizeId
      )[0];

      const price = corporatePDP
        ? data?.priceRecords[currency]
        : selectedSize && selectedSize?.priceRecords
        ? selectedSize?.priceRecords[currency]
        : data?.priceRecords[currency];

      const discountPrices =
        selectedSize && selectedSize?.discountedPriceRecords
          ? selectedSize?.discountedPriceRecords[currency]
          : data?.discountedPriceRecords[currency];

      dispatch(
        updateComponent(
          POPUP.HELLOARPOPUP,
          {
            code,
            data,
            buttoncall,
            showPrice:
              data.invisibleFields &&
              data.invisibleFields.indexOf("price") > -1,
            price,
            discountPrices
          },
          true
        )
      );
    } else {
      dispatch(
        updateComponent(
          POPUP.HELLOARPOPUP,
          {
            code
          },
          true
        )
      );
    }

    dispatch(updateModal(true));
    e.stopPropagation();

    // trigger event on click of VIEW IN 3D Cta
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({
        event: "view_in_3d",
        cta_name: productName
      });
    }
  };

  const viewIn3dBtn = (code: string) => {
    return (
      <div className={styles.viewInBtn} onClick={e => onClick3dButton(e, code)}>
        <img className={styles.image} src={button_image} />
        <div className={styles.text}>VIEW IN 3D</div>
      </div>
    );
  };
  if (productImages.length != 0) {
    // const length = productImages.length;
    let code: string;

    //Stores Index required for styling of top and bottom row Images length 7 and 5
    // const oddRowIndices = {
    //   7: 4,
    //   5: 2
    // };

    return (
      <div
        className={cs(
          styles.productImageContainer,
          styles.oddImages
          //For Even Images
          // { [styles.even]: length % 2 == 0 },
          //For Three Images
          // {
          //   [styles.threeImages]: length == 3
          // },
          //For odd images other than 3
          // {
          //   [styles.oddImages]: length != 3 && length != 1 && length % 2 == 1
          // }
        )}
      >
        {productImages.map((item: any, index: number) => {
          if (item.code) {
            code = item.code;
          }
          return (
            <div
              key={`img_${index}`}
              className={cs(
                styles.productImage,
                styles.topRowImages
                //For 3 Images
                // { [styles.thirdImage]: index == 2 && length == 3 },
                //For 5 and 7 images
                // { [styles.topRowImages]: index != 2 && length == 3 },
                // { [styles.bottomRowImages]: index >= oddRowIndices[length] }
              )}
              onClick={e => {
                onClick(index);
              }}
            >
              {item?.media_type === "Image" || item?.type === "main" ? (
                <img
                  src={productImages[index].productImage?.replace(
                    /Micro|Large/i,
                    "Medium"
                  )}
                />
              ) : (
                // <video
                //   src={item?.video_link}
                //   autoPlay
                //   loop
                //   preload="auto"
                //   onClick={() => {
                //     onClick(index);
                //   }}
                //   width={"100%"}
                //   height={"auto"}
                //   muted
                // />
                <div
                  className={styles.videoWrp}
                  dangerouslySetInnerHTML={{
                    __html: `
                  <video
                    loop
                    muted
                    autoplay
                    playsinline
                    preload="metadata"
                  >
                  <source src="${item?.video_link}" />
                  </video>`
                  }}
                />
              )}
              {item.icon && viewIn3dBtn(item.code)}
              {item.shop_the_look && (
                <div
                  id="looks-btn"
                  className={styles.looksBtn}
                  onClick={e => handleLooksClick(e)}
                >
                  shop look
                </div>
              )}
            </div>
          );
        })}
        {is3d && (
          <img
            className={styles.pdpTop}
            src={pdp_top}
            onClick={e => onClick3dButton(e, code)}
          />
        )}
      </div>
    );
  } else {
    return (
      <div className={styles.productImageContainer}>
        <Skeleton duration={1} height={540} />
      </div>
    );
  }
};
export default PDPImagesContainer;
