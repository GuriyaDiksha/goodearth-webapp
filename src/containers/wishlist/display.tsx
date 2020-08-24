import React from "react";
import { currencyCodes } from "constants/currency";
import { WishListGridItem } from "typings/wishlist";
import { Props as WishlistProps } from "./index";
import { Currency } from "typings/currency";
import styles from "./styles.scss";
import iconStyles from "../../styles/iconFonts.scss";
import globalStyles from "../../styles/global.scss";
// import bootstrapStyles from "../../styles/bootstrap/bootstrap-grid.scss";
import cs from "classnames";

type Props = {
  grid: WishlistProps;
  removeProduct: (item: WishListGridItem) => void;
  item: WishListGridItem;
  currency: Currency;
  mobile: boolean;
  isSale: boolean;
};

const SampleDisplay: React.FC<Props> = props => {
  // const { currency } = useSelector((state: AppState) => state);
  // const { mobile } = useSelector((state: AppState) => state.device);

  const { isSale } = props;

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
    const { item, currency } = props;
    props.grid.openPopup(item, currency, isSale);
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
    return flag ? "Select Size" : "Size: -";
  };

  const renderWishlist = (data: WishListGridItem) => {
    const { mobile, currency } = props;
    if (Object.keys(data).length === 0) return false;
    return (
      <div>
        <div className={styles.imagebox}>
          {mobile ? (
            <i
              className={cs(
                iconStyles.icon,
                iconStyles.iconCross,
                styles.iconCrossMobile
              )}
              onTouchStart={e => {
                props.removeProduct(data);
              }}
            ></i>
          ) : (
            <i
              className={cs(
                iconStyles.icon,
                iconStyles.iconCross,
                styles.iconCross
              )}
              onClick={e => {
                props.removeProduct(data);
              }}
            ></i>
          )}

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
                {String.fromCharCode(currencyCodes[currency])}&nbsp;{" "}
                {data.discountedPrice ? data.discountedPrice[currency] : ""}{" "}
                &nbsp;{" "}
              </span>
            ) : (
              ""
            )}
            {isSale && data.discount ? (
              <span className={styles.strikeprice}>
                {String.fromCharCode(currencyCodes[currency])}&nbsp;{" "}
                {data.price[currency]}
              </span>
            ) : (
              <span
                className={
                  data.badgeType == "B_flat" ? globalStyles.cerise : ""
                }
              >
                {String.fromCharCode(currencyCodes[currency])}&nbsp;{" "}
                {data.price[currency]}
              </span>
            )}
          </p>
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
