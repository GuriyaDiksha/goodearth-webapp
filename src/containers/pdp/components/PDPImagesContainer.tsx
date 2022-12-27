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

type Props = {
  productImages: any;
  onClick: (index: number) => void;
  is3d: boolean;
  data?: Product;
  selectedSizeId?: number | undefined;
  currency?: Currency;
  corporatePDP?: boolean;
  buttoncall?: JSX.Element | null | undefined;
  handleLooksClick: () => void;
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
  handleLooksClick
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
  };

  const viewIn3dBtn = (code: string) => {
    return (
      <div className={styles.viewInBtn} onClick={e => onClick3dButton(e, code)}>
        <img className={styles.image} src={button_image} />
        <div className={styles.text}>VIEW IN 3D</div>
      </div>
    );
  };

  if (productImages.length % 2 == 1) {
    switch (productImages.length) {
      case 1:
        return (
          <div className={styles.productImageContainer}>
            <div className={styles.productImage}>
              <img
                src={productImages[0].productImage}
                onClick={() => {
                  onClick(0);
                }}
              />
              {productImages[0].icon && viewIn3dBtn(productImages[0].code)}
            </div>
            {is3d && (
              <img
                className={styles.pdpTop}
                src={pdp_top}
                onClick={e => onClick3dButton(e, productImages[0].code)}
              />
            )}
            {productImages[0].shop_the_look && (
              <div id="looks-btn" className={styles.looksBtn}>
                shop the look
              </div>
            )}
          </div>
        );
      case 3:
        return (
          <div className={cs(styles.productImageContainer, styles.threeImages)}>
            {productImages.map((item: any, index: number) => {
              return (
                <div
                  className={cs(
                    { [styles.thirdImage]: index == 2 },
                    styles.productImage
                  )}
                  key={`img_${index}`}
                >
                  <img
                    src={productImages[index].productImage.replace(
                      /Micro|Large/i,
                      "Medium"
                    )}
                    onClick={() => {
                      onClick(index);
                    }}
                  />
                  {item.icon && viewIn3dBtn(item.code)}
                  {item.shop_the_look && (
                    <div id="looks-btn" className={styles.looksBtn}>
                      shop the look
                    </div>
                  )}
                </div>
              );
            })}
            {is3d && <img className={styles.pdpTop} src={pdp_top} />}
          </div>
        );
      case 5:
        return (
          <div className={cs(styles.productImageContainer, styles.oddImages)}>
            {productImages.map((item: any, index: number) => {
              return (
                <div
                  className={cs(
                    { [styles.topRowImages]: index < 2 },
                    { [styles.bottomRowImages]: index >= 2 },
                    styles.productImage
                  )}
                  key={`img_${index}`}
                >
                  <img
                    src={productImages[index].productImage.replace(
                      /Micro|Large/i,
                      "Medium"
                    )}
                    onClick={() => {
                      onClick(index);
                    }}
                  />
                  {item.icon && viewIn3dBtn(item.code)}
                  {item.shop_the_look && (
                    <div
                      id="looks-btn"
                      className={styles.looksBtn}
                      onClick={handleLooksClick}
                    >
                      shop the look
                    </div>
                  )}
                </div>
              );
            })}
            {is3d && <img className={styles.pdpTop} src={pdp_top} />}
          </div>
        );
      case 7:
        return (
          <div className={cs(styles.productImageContainer, styles.oddImages)}>
            {productImages.map((item: any, index: number) => {
              return (
                <div
                  className={cs(
                    { [styles.topRowImages]: index < 4 },
                    { [styles.bottomRowImages]: index >= 4 },
                    styles.productImage
                  )}
                  key={`img_${index}`}
                >
                  <img
                    src={productImages[index].productImage.replace(
                      /Micro|Large/i,
                      "Medium"
                    )}
                    onClick={() => {
                      onClick(index);
                    }}
                  />
                  {item.icon && viewIn3dBtn(item.code)}
                  {item.shop_the_look && (
                    <div id="looks-btn" className={styles.looksBtn}>
                      shop the look
                    </div>
                  )}
                </div>
              );
            })}
            {is3d && <img className={styles.pdpTop} src={pdp_top} />}
          </div>
        );
      default:
        return (
          <div className={styles.productImageContainer}>
            <Skeleton duration={1} height={540} />
          </div>
        );
    }
  } else {
    return (
      <div className={cs(styles.productImageContainer, styles.even)}>
        {productImages.map((item: any, index: number) => {
          return (
            <div key={`img_${index}`} className={styles.productImage}>
              <img
                src={productImages[index].productImage.replace(
                  /Micro|Large/i,
                  "Medium"
                )}
                onClick={() => {
                  onClick(index);
                }}
              />
              {item.icon && viewIn3dBtn(item.code)}
              {item.shop_the_look && (
                <div id="looks-btn" className={styles.looksBtn}>
                  shop the look
                </div>
              )}
            </div>
          );
        })}
        {is3d && <img className={styles.pdpTop} src={pdp_top} />}
      </div>
    );
  }
};

export default PDPImagesContainer;
