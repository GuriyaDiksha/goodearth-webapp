import React, { useState } from "react";
import { Currency } from "typings/currency";
import { BridalItemData } from "./typings";
import BridalService from "services/bridal";
import { useDispatch } from "react-redux";
//styles
import cs from "classnames";
import globalStyles from "../../../../styles/global.scss";
import styles from "./styles.scss";
import bootstrapStyles from "../../../../styles/bootstrap/bootstrap-grid.scss";
import iconStyles from "../../../../styles/iconFonts.scss";
import cartIcon from "../../../../images/bridal/icons_cartregistry-details.svg";
// import { AppState } from "reducers/typings";
import CookieService from "services/cookie";
import { GA_CALLS } from "constants/cookieConsent";
import { displayPriceWithCommas } from "utils/utility";
type Props = {
  product: BridalItemData;
  mobile: boolean;
  currency: Currency;
  bridalId: number;
  onMobileAdd: (index: number) => void;
  key: number;
  fetchBridalItems: () => void;
  mIndex: number;
};

const BridalItemsList: React.FC<Props> = props => {
  // const saleStatus = useSelector((state: AppState) => state.info.isSale);
  const [reqCurrent, setReqCurrent] = useState(props.product.qtyRequested);
  const [err, setErr] = useState("");
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
    qtyRemaining,
    badgeType,
    stock,
    productAvailable
  } = props.product;

  const mobileAddToBag = () => {
    if (productAvailable) {
      const mobileAddIndex = props.mIndex;
      props.onMobileAdd(mobileAddIndex);
    }
  };

  const dispatch = useDispatch();
  const increaseState = () => {
    if (!productAvailable || stock == 0) {
    } else {
      if (reqCurrent >= props.product.stock) {
        setErr(
          `Only ${props.product.stock} piece${
            props.product.stock > 1 ? "s" : ""
          } available in stock`
        );
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
          BridalService.countBridal(dispatch, props.bridalId);
        })
        .catch(error => {
          // console.log(error);
        });
    }
  };

  const decreaseState = () => {
    if (!productAvailable || stock == 0) {
    } else {
      if (reqCurrent > 1 && !productAvailable) {
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
            BridalService.countBridal(dispatch, props.bridalId);
          })
          .catch(error => {
            // console.log(error);
          });
      }
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
          const userConsent = CookieService.getCookie("consent").split(",");
          if (userConsent.includes(GA_CALLS)) {
            dataLayer.push({
              event: "registry",
              "Event Category": "Registry",
              "Event Action": "Product removed",
              "Product Name": props.product.productName,
              "Product ID": props.product.productId,
              Variant: props.product.size
            });
          }
          props.fetchBridalItems();
          BridalService.countBridal(dispatch, props.bridalId);
        })
        .catch(error => {
          // console.log(error);
        });
    }
  };
  return (
    <div className={cs(styles.cart, styles.cartContainer)}>
      <div
        className={cs("cart-item", styles.bridalPublic, {
          [styles.notAvailableItem]: !productAvailable
        })}
      >
        <div className={cs(bootstrapStyles.row, styles.nowrap)}>
          <div className={cs(bootstrapStyles.col5, bootstrapStyles.colMd3)}>
            <a href={productUrl}>
              {!productAvailable ? (
                <div className={styles.notAvailableTxt}>Not Available</div>
              ) : stock == 0 ? (
                <div className={styles.outOfStockTxt}>Out of Stock</div>
              ) : (
                ""
              )}
              <img
                className={cs(styles.productImage, {
                  [styles.blurImg]: stock == 0
                })}
                src={productImage}
                alt={productName}
              />
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
                    {discount ? (
                      <span className={styles.productPrice}>
                        <span className={styles.discountprice}>
                          {displayPriceWithCommas(
                            discountedPrice[props.currency],
                            props.currency
                          )}
                        </span>
                        &nbsp;{" "}
                        <span className={styles.strikeprice}>
                          {displayPriceWithCommas(
                            price[props.currency],
                            props.currency
                          )}
                        </span>
                      </span>
                    ) : (
                      <span
                        className={cs(
                          styles.productPrice,
                          badgeType == "B_flat" ? globalStyles.gold : ""
                        )}
                      >
                        {displayPriceWithCommas(
                          price[props.currency],
                          props.currency
                        )}
                      </span>
                    )}
                  </div>
                  <div className={cs(styles.sizeSku)}>
                    <div className={cs(styles.smallfont)}>SIZE: {size}</div>
                    <div className={cs(styles.smallfont)}>SKU: {sku}</div>
                  </div>
                  {props.mobile && (
                    <div className={cs(styles.mobQtyRemaining)}>
                      <span>Quantity Remaining: {qtyRemaining}</span>
                    </div>
                  )}
                  <div className={props.mobile ? styles.mobFlexDiv : ""}>
                    {qtyBought ? (
                      ""
                    ) : (
                      <div
                        title="Remove"
                        className={styles.bridalItemRemove}
                        onClick={deleteItem}
                      >
                        <span>REMOVE</span>
                        {/* <i
                            className={cs(
                              iconStyles.icon,
                              iconStyles.iconCrossNarrowBig,
                              styles.icon,
                              styles.iconCross
                            )}
                          ></i> */}
                      </div>
                    )}
                    {props.mobile && (
                      <div
                        className={cs(styles.mobQtyStatus)}
                        onClick={mobileAddToBag}
                      >
                        {/* <img src={cartIcon} width="40" height="40" /> */}
                        <span>QUANTITY & STATUS</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {!props.mobile && (
                <div
                  className={cs(bootstrapStyles.col12, bootstrapStyles.colMd6)}
                >
                  <div className={cs(styles.section, styles.sectionMiddle)}>
                    <div className="">
                      <div className={styles.textMuted}>Quantity Required</div>
                      <div
                        className={cs(styles.widgetQty, {
                          [styles.blurTxt]: stock == 0 || !productAvailable
                        })}
                      >
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
                      <div className={styles.textMuted}>Quantity Bought</div>
                      <div
                        className={cs(
                          globalStyles.textCenter,
                          globalStyles.c10LR,
                          globalStyles.voffset1
                        )}
                      >
                        {qtyBought}
                      </div>
                    </div>
                    <div className={globalStyles.voffset3}>
                      <div className={styles.textMuted}>Quantity Remaining</div>
                      <div
                        className={cs(
                          globalStyles.textCenter,
                          globalStyles.c10LR,
                          globalStyles.voffset1
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
        </div>
      </div>
    </div>
  );
};

export default BridalItemsList;
