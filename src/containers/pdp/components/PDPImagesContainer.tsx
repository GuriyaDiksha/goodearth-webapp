import React from "react";
import cs from "classnames";
import Skeleton from "react-loading-skeleton";
import styles from "../styles.scss";

type Props = {
  productImages: any;
  onClick: (index: number) => void;
};

const PDPImagesContainer: React.FC<Props> = ({ productImages, onClick }) => {
  // console.log(productImages)
  if (productImages.length % 2 == 1) {
    switch (productImages.length) {
      case 1:
        return (
          <div className={styles.productImageContainer}>
            <img
              src={productImages[0].productImage}
              onClick={() => {
                onClick(0);
              }}
            />
          </div>
        );
      case 3:
        return (
          <div className={cs(styles.productImageContainer, styles.threeImages)}>
            {productImages.map((item: any, index: number) => {
              return (
                <div
                  className={cs({ [styles.thirdImage]: index == 2 })}
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
                </div>
              );
            })}
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
                    { [styles.bottomRowImages]: index >= 2 }
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
                </div>
              );
            })}
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
                    { [styles.bottomRowImages]: index >= 4 }
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
                </div>
              );
            })}
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
            <div key={`img_${index}`}>
              <img
                src={productImages[index].productImage.replace(
                  /Micro|Large/i,
                  "Medium"
                )}
                onClick={() => {
                  onClick(index);
                }}
              />
            </div>
          );
        })}
      </div>
    );
  }
};

export default PDPImagesContainer;
