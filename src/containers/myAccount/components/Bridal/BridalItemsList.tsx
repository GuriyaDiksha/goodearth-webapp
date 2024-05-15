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
  mIndex: number;
  onMobileAdd: (mIndex: number) => void;
  key: number;
  fetchBridalItems: () => void;
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
    badgeImage,
    productImage,
    discount,
    price,
    sku,
    size,
    qtyBought,
    qtyRemaining,
    badgeType,
    stock,
    productAvailable,
    colors,
    groupedProductsCount,
    badge_text
  } = props.product;

  const mobileAddToBag = () => {
    if (stock == 0 || price[props.currency] == 0 || !productAvailable) {
    } else {
      const mobileAddIndex = props.mIndex;
      props.onMobileAdd(mobileAddIndex);
    }
  };

  const dispatch = useDispatch();
  const increaseState = () => {
    if (!productAvailable || stock == 0 || price[props.currency] == 0) {
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
          // BridalService.countBridal(dispatch, props.bridalId);
        })
        .catch(error => {
          // console.log(error);
        });
    }
  };

  const decreaseState = () => {
    if (!productAvailable || stock == 0 || price[props.currency] == 0) {
    } else {
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
            // BridalService.countBridal(dispatch, props.bridalId);
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

  const colorName = (value: string) => {
    let cName = value
      .split("-")
      .slice(1)
      .join();
    if (cName[cName.length - 1] == "s") {
      cName = cName.slice(0, -1);
    }
    return cName;
  };

  return (
    <div className={cs(styles.cart, styles.cartContainer)}>
      <div className={cs("cart-item", styles.bridalPublic)}>
        <div className={cs(bootstrapStyles.row, styles.nowrap)}>
          <div className={cs(bootstrapStyles.col5, bootstrapStyles.colMd3)}>
            {!productAvailable || price[props.currency] == 0 ? (
              <div className={styles.notAvailableTxt}>Not Available</div>
            ) : stock == 0 ? (
              <div className={styles.outOfStockTxt}>Out of Stock</div>
            ) : (
              ""
            )}
            {!productAvailable || price[props.currency] == 0 ? (
              <div className={cs(styles.productImageSection, styles.blur)}>
                {badgeImage && (
                  <div className={styles.badgeImage}>
                    <img src={badgeImage} alt={badgeImage} />
                  </div>
                )}
                <div className={styles.productImage}>
                  <img src={productImage} alt={productName} />
                </div>
              </div>
            ) : (
              <a href={productUrl} className={styles.productUrl}>
                <div
                  className={cs(styles.productImageSection, {
                    [styles.blur]: stock == 0 || !productAvailable
                  })}
                >
                  {badgeImage && (
                    <div className={styles.badgeImage}>
                      <img src={badgeImage} alt={badgeImage} />
                    </div>
                  )}
                  <div className={styles.productImage}>
                    <img src={productImage} alt={productName} />
                  </div>
                </div>
              </a>
            )}
          </div>

          <div className={cs(bootstrapStyles.col7, bootstrapStyles.colMd9)}>
            <div className={styles.rowMain}>
              <div
                className={cs(bootstrapStyles.col12, bootstrapStyles.colMd6)}
              >
                <div className={cs(styles.section, styles.sectionInfo)}>
                  <div
                    className={cs({
                      [styles.blur]:
                        !productAvailable || price[props.currency] == 0
                    })}
                  >
                    <div>
                      <div className={styles.collectionName}>{collection}</div>
                      <div className={styles.productName}>
                        {!productAvailable || price[props.currency] == 0 ? (
                          productName
                        ) : (
                          <a href={productUrl}>{productName}</a>
                        )}
                      </div>
                    </div>
                    {badge_text && (
                      <div
                        className={cs(
                          globalStyles.badgeContainer,
                          globalStyles.grey,
                          globalStyles.marginB10,
                          globalStyles.marginT5
                        )}
                      >
                        {badge_text}
                      </div>
                    )}
                    {price[props.currency] != 0 ? (
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
                    ) : (
                      <div className={styles.notAvailablePriceMsg}>
                        <span>
                          This product is not available in the selected currency
                        </span>
                      </div>
                    )}
                    <div className={cs(styles.sizeSku)}>
                      {size && (
                        <div className={cs(styles.smallfont)}>SIZE: {size}</div>
                      )}
                      {colors?.length &&
                      groupedProductsCount &&
                      groupedProductsCount > 0 ? (
                        <div className={cs(styles.smallfont)}>
                          COLOR: {colorName(colors?.[0])}
                        </div>
                      ) : null}
                      <div className={cs(styles.smallfont)}>SKU: {sku}</div>
                    </div>
                  </div>
                  {props.mobile && (
                    <div
                      className={cs(styles.mobQtyRemaining, {
                        [styles.aquaText]: qtyRemaining == 0,
                        [styles.blurTxt]: price[props.currency] == 0,
                        [styles.blur]: !productAvailable
                      })}
                    >
                      <div>Quantity Remaining: {qtyRemaining}</div>
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
                        className={cs(styles.mobQtyStatus, {
                          [styles.blurTxt]:
                            stock == 0 || price[props.currency] == 0,
                          [styles.blur]: !productAvailable
                        })}
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
                  <div
                    className={cs(styles.section, styles.sectionMiddle, {
                      [styles.blur]:
                        !productAvailable || price[props.currency] == 0
                    })}
                  >
                    <div className="">
                      <div className={styles.textMuted}>Quantity Required</div>
                      <div
                        className={cs(styles.widgetQty, {
                          [styles.blurTxt]: stock == 0
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
                          styles.qtyLeftMsg,
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
                    <div
                      className={cs(globalStyles.voffset3, {
                        [styles.aquaText]: qtyRemaining == 0
                      })}
                    >
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
