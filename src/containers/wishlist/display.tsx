import React from "react";
import { WishListGridItem } from "typings/wishlist";
import { Props as WishlistProps } from "./index";
import { Currency } from "typings/currency";
import styles from "./styles.scss";
import globalStyles from "../../styles/global.scss";
import cs from "classnames";
import { displayPriceWithCommas } from "utils/utility";
import cross from "./../../icons/wishlist_cross.svg";

type Props = {
  grid: WishlistProps;
  removeProduct: (item: WishListGridItem) => void;
  item: WishListGridItem;
  currency: Currency;
  mobile: boolean;
  isSale: boolean;
  sortBy: string;
  isShared: boolean;
};

const SampleDisplay: React.FC<Props> = props => {
  // const { currency } = useSelector((state: AppState) => state);
  // const { isSale } = useSelector((state: AppState) => state.info);
  const { isSale, isShared } = props;

  const atbOrNotify = (item: WishListGridItem) => {
    let flag = false;
    let innerString = "";
    item.stockDetails.map(stockData => {
      if (item.size) {
        if (stockData.stock > 0 && item.size == stockData.size) {
          flag = true;
        }
      } else {
        if (stockData.stock > 0) {
          flag = true;
        }
      }
    });
    innerString = flag ? "ADD TO BAG" : "NOTIFY ME";
    return innerString;
  };

  const openPopup = (productId: number) => {
    const { item, currency, mobile } = props;
    props.grid.openPopup(
      item,
      currency,
      props.sortBy,
      isSale,
      mobile,
      isShared
    );
  };

  const sizeText = (item: WishListGridItem) => {
    let flag = true;
    if (item.size) {
      return "Size: " + item.size;
    } else {
      item.stockDetails.map(stockData => {
        if (!stockData.size) {
          flag = false;
        }
      });
    }
    return flag ? "Select Size" : "Size: NA";
  };

  const renderWishlist = (data: WishListGridItem) => {
    const { mobile, currency } = props;
    let showStockMessage = false;
    if (data.size) {
      const selectedSize = data.stockDetails.filter(
        item => item.size == data.size
      )[0];
      showStockMessage =
        selectedSize &&
        selectedSize.stock > 0 &&
        selectedSize.showStockThreshold;
    } else {
      showStockMessage =
        !data.stockDetails[0].size &&
        data.stockDetails[0].stock > 0 &&
        data.stockDetails[0].showStockThreshold;
    }
    const stock = data.size
      ? data.stockDetails.filter(item => item.size == data.size).length > 0
        ? data.stockDetails.filter(item => item.size == data.size)[0].stock
        : data.stockDetails[0].stock
      : data.stockDetails[0].stock;
    if (Object.keys(data).length === 0) return false;
    return (
      <div>
        <div className={styles.imagebox}>
          {data.salesBadgeImage && (
            <div
              className={cs(
                {
                  [styles.badgePositionPlpMobile]: mobile
                },
                {
                  [styles.badgePositionPlp]: !mobile
                }
              )}
            >
              <img src={data.salesBadgeImage} />
            </div>
          )}
          {!isShared && (
            // mobile ? (
            <img
              src={cross}
              alt="remove"
              className={cs(styles.iconCross)}
              onClick={e => {
                props.removeProduct(data);
              }}
            />
          )
          // : (
          //   <i
          //     className={cs(
          //       iconStyles.icon,
          //       iconStyles.iconCross,
          //       styles.iconCross
          //     )}
          //     onClick={e => {
          //       props.removeProduct(data);
          //     }}
          //   ></i>
          // ))
          }

          <a href={data.productUrl}>
            <img
              src={
                data.productImage
                  ? data.productImage
                  : "/static/img/noimageplp.png"
              }
              // onError={this.addDefaultSrc}
              alt="Others"
              className={styles.imageResult}
            />
          </a>
          <div className={styles.imgBottom}>
            {mobile ? (
              <div>
                <div
                  className={styles.size}
                  onTouchStart={() => openPopup(data.productId)}
                >
                  <span>{sizeText(data)}</span>
                </div>
                <div
                  onTouchStart={() => openPopup(data.productId)}
                  className={styles.atb}
                >
                  {atbOrNotify(data)}
                </div>
              </div>
            ) : (
              <div>
                <div
                  className={styles.size}
                  onClick={() => openPopup(data.productId)}
                >
                  <span>{sizeText(data)}</span>
                </div>
                <div
                  onClick={() => openPopup(data.productId)}
                  className={styles.atb}
                >
                  {atbOrNotify(data)}
                </div>
              </div>
            )}
          </div>
          <div className="hidden">
            <i className="icon icon_wishlist bg_wishlist"> </i>
          </div>
        </div>
        <div className={styles.imageContent}>
          {/*<p className="product-h">{data.collection ? data.collection : ''}</p>*/}
          <p className={styles.productN}>
            <a href={data.productUrl}>
              {data.productName ? data.productName : ""}{" "}
            </a>
          </p>
          <p className={styles.productN}>
            {isSale && data.discount ? (
              <span className={styles.discountprice}>
                {data.discountedPrice
                  ? displayPriceWithCommas(
                      data.discountedPrice[currency],
                      currency
                    )
                  : ""}{" "}
                &nbsp;{" "}
              </span>
            ) : (
              ""
            )}
            {isSale && data.discount ? (
              <span className={styles.strikeprice}>
                {displayPriceWithCommas(data.price[currency], currency)}
              </span>
            ) : (
              <span
                className={
                  data.badgeType == "B_flat" ? styles.discountprice : ""
                }
              >
                {displayPriceWithCommas(data.price[currency], currency)}
              </span>
            )}
          </p>
          <span
            className={cs(
              globalStyles.errorMsg,
              globalStyles.gold,
              styles.errMsg
            )}
          >
            {isSale && showStockMessage && `Only ${stock} Left!`}
          </span>
        </div>
      </div>
    );
  };

  // const itemStyle = {
  //     display: 'block',
  //     width: '100%',
  //     height: '100%'
  // };
  const data = props.item;
  return <div className="">{data ? renderWishlist(data) : ""}</div>;
};

export default SampleDisplay;
