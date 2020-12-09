import React, { useState } from "react";
import { currencyCode, Currency } from "typings/currency";
import { BridalItem } from "./typings";
import BridalService from "services/bridal";
import { useDispatch } from "react-redux";
//styles
import cs from "classnames";
import globalStyles from "../../../../styles/global.scss";
import styles from "./styles.scss";
import bootstrapStyles from "../../../../styles/bootstrap/bootstrap-grid.scss";
import iconStyles from "../../../../styles/iconFonts.scss";
import cartIcon from "../../../../images/bridal/icons_cartregistry-details.svg";
type Props = {
  product: BridalItem;
  mobile: boolean;
  currency: Currency;
  bridalId: number;
  onMobileAdd: (index: number) => void;
  key: number;
  fetchBridalItems: () => void;
  mIndex: number;
};

const BridalItemsList: React.FC<Props> = props => {
  const saleStatus = false;
  const [reqCurrent, setReqCurrent] = useState(props.product.qtyRequested);
  const [err, setErr] = useState("");

  const mobileAddToBag = () => {
    const mobileAddIndex = props.mIndex;
    props.onMobileAdd(mobileAddIndex);
  };

  const getCurrency = () => {
    return String.fromCharCode(currencyCode[props.currency]);
  };
  const dispatch = useDispatch();
  const increaseState = () => {
    if (reqCurrent >= props.product.stock) {
      setErr("Available qty in stock is " + props.product.stock);
      return false;
    }

    const data = {
      bridalId: props.bridalId,
      qtyRequested: reqCurrent + 1,
      productId: props.product.productId
    };

    BridalService.updateBridalItemQuantity(dispatch, data)
      .then(res => {
        setReqCurrent(reqCurrent + 1);
        props.fetchBridalItems();
      })
      .catch(error => {
        // console.log(error);
      });
  };

  const decreaseState = () => {
    if (reqCurrent > 1) {
      const data = {
        bridalId: props.bridalId,
        qtyRequested: reqCurrent - 1,
        productId: props.product.productId
      };

      BridalService.updateBridalItemQuantity(dispatch, data)
        .then(res => {
          setReqCurrent(reqCurrent - 1);
          setErr("");
          props.fetchBridalItems();
        })
        .catch(error => {
          // console.log(error);
        });
    }
  };

  const deleteItem = () => {
    if (!props.product.qtyBought) {
      const data = {
        bridalId: props.bridalId,
        productId: props.product.productId
      };
      BridalService.deleteBridalItem(dispatch, data)
        .then(res => {
          props.fetchBridalItems();
        })
        .catch(error => {
          // console.log(error);
        });
    }
  };
  const {
    discountedPrice,
    productName,
    productUrl,
    collection,
    productImage,
    discount,
    price,
    sku,
    size,
    qtyBought,
    qtyRemaining
  } = props.product;
  return (
    <div className={cs(styles.cart, styles.cartContainer)}>
      <div className={cs("cart-item", styles.bridalPublic)}>
        <div className={cs(bootstrapStyles.row, globalStyles.flex)}>
          <div className={cs(bootstrapStyles.col5, bootstrapStyles.colMd3)}>
            <a href={productUrl}>
              <img className={styles.productImage} src={productImage} />
            </a>
          </div>
          <div className={cs(bootstrapStyles.col7, bootstrapStyles.colMd9)}>
            <div className={styles.rowMain}>
              <div
                className={cs(bootstrapStyles.col12, bootstrapStyles.colMd6)}
              >
                <div className={cs(styles.section, styles.sectionInfo)}>
                  <div>
                    <div className={styles.collectionName}>{collection}</div>
                    <div className={styles.productName}>
                      <a href={productUrl}>{productName}</a>
                    </div>
                  </div>
                  <div className={styles.productPrice}>
                    {saleStatus && discount ? (
                      <span className={styles.productPrice}>
                        <span className={styles.discountprice}>
                          {getCurrency()} {discountedPrice[props.currency]}
                        </span>
                        &nbsp;{" "}
                        <span className={styles.strikeprice}>
                          {getCurrency()} {price[props.currency]}
                        </span>
                      </span>
                    ) : (
                      <span className={styles.productPrice}>
                        {getCurrency()} {price[props.currency]}
                      </span>
                    )}
                  </div>
                  <div className={styles.smallfont}>SIZE: {size}</div>
                  <div className={cs(styles.smallfont, globalStyles.voffset1)}>
                    SKU: {sku}
                  </div>
                  {props.mobile && (
                    <div
                      className={cs(styles.iconCart, globalStyles.voffset3)}
                      onClick={mobileAddToBag}
                    >
                      <img src={cartIcon} width="40" height="40" />
                    </div>
                  )}
                </div>
              </div>
              {!props.mobile && (
                <div
                  className={cs(bootstrapStyles.col12, bootstrapStyles.colMd6)}
                >
                  <div className={cs(styles.section, styles.sectionMiddle)}>
                    <div className="">
                      <div className={styles.textMuted}>QTY REQUESTED</div>
                      <div className={styles.widgetQty}>
                        <span className={styles.btnQty} onClick={decreaseState}>
                          -
                        </span>
                        <span className={styles.qty}>{reqCurrent}</span>
                        <span className={styles.btnQty} onClick={increaseState}>
                          +
                        </span>
                      </div>
                      <div
                        className={cs(
                          globalStyles.errorMsg,
                          globalStyles.textCenter
                        )}
                      >
                        {err}
                      </div>
                    </div>
                    <div className={globalStyles.voffset3}>
                      <div className={styles.textMuted}>QTY BOUGHT</div>
                      <div
                        className={cs(
                          globalStyles.textCenter,
                          globalStyles.C10LR
                        )}
                      >
                        {qtyBought}
                      </div>
                    </div>
                    <div className={globalStyles.voffset3}>
                      <div className={styles.textMuted}>QTY REMAINING</div>
                      <div
                        className={cs(
                          globalStyles.textCenter,
                          globalStyles.C10LR
                        )}
                      >
                        {qtyRemaining}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          {qtyBought ? (
            ""
          ) : (
            <div title="Remove" onClick={deleteItem}>
              <i
                className={cs(
                  iconStyles.icon,
                  iconStyles.iconCrossNarrowBig,
                  styles.icon,
                  styles.iconCross
                )}
              ></i>
            </div>
          )}
        </div>
        <hr />
      </div>
    </div>
  );
};

export default BridalItemsList;
