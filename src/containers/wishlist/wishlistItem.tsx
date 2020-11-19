import React from "react";
import { useSelector } from "react-redux";
import { AppState } from "reducers/typings";
import { currencyCodes } from "constants/currency";
import { WishlistItem as ItemType } from "typings/wishlist";
import styles from "./styles.scss";
import iconStyles from "../../styles/iconFonts.scss";
// import globalStyles from "../../styles/global.scss";
import cs from "classnames";
import noPlpImage from "images/noimageplp.png";

type Props = {
  removeProduct: (data: ItemType) => void;
  item: ItemType;
  showSize: (id: number) => void;
  showNotify: (id: number) => void;
};

const WishlistItem: React.FC<Props> = props => {
  // const [disableSelectedbox, setDisableSelectedbox ] = useState(false);
  const { currency } = useSelector((state: AppState) => state);
  const { mobile } = useSelector((state: AppState) => state.device);
  // salestatus: window.is_sale

  const atbOrNotify = (item: ItemType) => {
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

  const atbHandler = (item: ItemType) => {
    return () => {
      // if(item.size){
      //     console.log('Added To Bag');
      // }else{
      props.showSize(item.id);
      // }
    };
  };

  const setNotify = (item: ItemType) => {
    // let productId = item.productId;
    // if (item.size) {
    //     item.stock_details.map(data => {
    //         if (item.size == data.size) {
    //             product_id = data.product_id;
    //         }
    //     })
    // } else {
    //     product_id = item.product_id;
    // }
    return () => {
      props.showNotify(item.productId);
    };
  };

  const atbOrNotifyHandler = (item: ItemType) => {
    let flag = false;
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
    const func = flag ? atbHandler(item) : setNotify(item);
    return () => func();
  };

  const sizeHandler = (data: ItemType) => {
    let flag = true;
    if (data.size) {
      return "Size: " + data.size;
    } else {
      data.stockDetails.map(stockData => {
        if (!stockData.size) {
          flag = false;
        }
      });
    }
    return flag ? "Select Size" : "Size: -";
  };

  const renderWishlist = (data: ItemType) => {
    if (Object.keys(data).length === 0) return false;
    return (
      <div>
        <div className={styles.imagebox}>
          {mobile ? (
            <i
              className={cs(iconStyles.icon, iconStyles.iconCross)}
              onTouchStart={e => {
                props.removeProduct(data);
              }}
            ></i>
          ) : (
            <i
              className={cs(iconStyles.icon, iconStyles.iconCross)}
              onClick={e => {
                props.removeProduct(data);
              }}
            ></i>
          )}

          <a href={data.productUrl}>
            <img
              src={data.productImage ? data.productImage : noPlpImage}
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
                  onTouchStart={() => {
                    props.showSize(data.id);
                  }}
                >
                  <span>{sizeHandler(data)}</span>
                </div>
                <div
                  onTouchStart={atbOrNotifyHandler(data)}
                  className={styles.atb}
                >
                  {atbOrNotify(data)}
                </div>
              </div>
            ) : (
              <div>
                <div
                  className={styles.size}
                  onClick={() => {
                    props.showSize(data.id);
                  }}
                >
                  <span>{sizeHandler(data)}</span>
                </div>
                <div onClick={atbOrNotifyHandler(data)} className={styles.atb}>
                  {atbOrNotify(data)}
                </div>
              </div>
            )}
          </div>
          {/* <div className="hidden"><i
                    className="icon icon_wishlist bg_wishlist"> </i>
                </div> */}
        </div>
        <div className={styles.imageContent}>
          {/*<p className="product-h">{data.collection ? data.collection : ''}</p>*/}

          <p className={styles.productN}>
            <a href={data.productUrl}>
              {data.productName ? data.productName : ""}{" "}
            </a>
          </p>
          <p className={styles.productN}>
            {// this.state.salestatus
            true && data.discount ? (
              <span className={styles.discountprice}>
                {String.fromCharCode(...currencyCodes[currency])}&nbsp;{" "}
                {data.discountedPrice ? data.discountedPrice[currency] : ""}{" "}
                &nbsp;{" "}
              </span>
            ) : (
              ""
            )}
            {// this.state.salestatus
            true && data.discount ? (
              <span className={styles.strikeprice}>
                {String.fromCharCode(...currencyCodes[currency])}&nbsp;{" "}
                {data.price[currency]}
              </span>
            ) : (
              <span>
                {String.fromCharCode(...currencyCodes[currency])}&nbsp;{" "}
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

export default WishlistItem;
