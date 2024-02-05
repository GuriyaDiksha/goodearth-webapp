import { BridalItemData } from "containers/myAccount/components/Bridal/typings";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import BasketService from "../../services/basket";
import bootstrap from "styles/bootstrap/bootstrap-grid.scss";
import iconStyles from "../../styles/iconFonts.scss";
import styles from "./styles.scss";
import globalStyles from "../../styles/global.scss";
import cs from "classnames";
import { Context } from "components/Modal/context";
import { showGrowlMessage } from "../../utils/validate";

type Props = {
  bridalItem: BridalItemData;
  // closeMobile: () => void;
  bridalId: number;
};

const BridalMobile: React.FC<Props> = ({ bridalItem, bridalId }) => {
  const [qtyCurrent, setQtyCurrent] = useState(1);
  const [buttonStatus, setButtonStatus] = useState(false);
  const [btnDisable, setBtnDisable] = useState(styles.ctaBtn);
  const [btnContent, setBtnContent] = useState("ADD TO BAG");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!bridalItem.productAvailable) {
      setButtonStatus(true);
      setBtnDisable(cs(styles.ctaBtn, styles.fullDisabledBtn));
      setBtnContent("NOT AVAILABLE");
    } else if (bridalItem.qtyRemaining == 0) {
      setButtonStatus(true);
      setBtnDisable(cs(styles.ctaBtn, styles.fullDisabledBtn));
      setBtnContent("Fulfilled");
    } else if (bridalItem.stock == 0) {
      setButtonStatus(true);
      setBtnDisable(cs(styles.fullDisabledBtn));
      setBtnContent("Notify Me");
    }
  }, []);

  const increaseState = () => {
    if (
      !bridalItem.productAvailable ||
      bridalItem.stock == 0 ||
      bridalItem.qtyRemaining == 0
    ) {
    } else {
      const maxQty = bridalItem.stock;
      let qty = qtyCurrent;
      if (qty < maxQty) {
        qty += 1;
        setQtyCurrent(qty);
      } else {
        setErr(
          `Only ${maxQty} piece${maxQty > 1 ? "s" : ""} available in stock`
        );
      }
    }
  };

  const decreaseState = () => {
    if (
      !bridalItem.productAvailable ||
      bridalItem.stock == 0 ||
      bridalItem.qtyRemaining == 0
    ) {
    } else {
      let qty = qtyCurrent;
      if (qty > 1) {
        qty -= 1;
        setQtyCurrent(qty);
        setErr("");
      }
    }
  };
  const dispatch = useDispatch();
  const { closeModal } = useContext(Context);
  const addToBag = () => {
    const productUrl = `${__DOMAIN__}/myapi/product/${bridalItem.productId}`;
    BasketService.addToBasket(
      dispatch,
      0,
      qtyCurrent,
      undefined,
      bridalId,
      productUrl
    )
      .then(res => {
        showGrowlMessage(
          dispatch,
          "Item has been added to your bag!",
          3000,
          "ADD_TO_BAG_BRIDAL"
        );
      })
      .catch(err => {
        let errorMessage = err.response.data;
        if (typeof errorMessage != "string") {
          errorMessage = "Can't add to bag";
        }
        showGrowlMessage(dispatch, errorMessage);
      });
    // closeMobile();
  };

  return (
    <div
      className={cs(
        styles.sizeBlockBridal,
        styles.ht,
        styles.centerpageMobile,
        globalStyles.textCenter
      )}
    >
      <div className={styles.cross} onClick={closeModal}>
        <i
          className={cs(
            iconStyles.icon,
            iconStyles.iconCrossNarrowBig,
            styles.icon,
            styles.iconCross
          )}
        ></i>
      </div>
      {/* <div className="cross"><i
                    className="icon icon_cross" onClick={closeMobile}></i></div> */}
      <div className={bootstrap.row}>
        <div className={cs(bootstrap.col8, bootstrap.offset2)}>
          <div className={styles.loginForm}>
            <div
              className={cs(styles.section, styles.sectionMiddle, styles.cart)}
            >
              {bridalItem.productAvailable && (
                <div className={globalStyles.voffset7}>
                  <div className={styles.textMuted}>Add Your Quantity</div>
                  <div
                    className={cs(styles.widgetQty, {
                      [styles.blurTxt]:
                        bridalItem.stock == 0 || bridalItem.qtyRemaining == 0
                    })}
                  >
                    <span className={styles.btnQty} onClick={decreaseState}>
                      -
                    </span>
                    <span className={styles.qty}>{qtyCurrent}</span>
                    <span className={styles.btnQty} onClick={increaseState}>
                      +
                    </span>
                  </div>
                  {err ? (
                    <div
                      className={cs(
                        globalStyles.errorMsg,
                        globalStyles.textCenter
                      )}
                    >
                      {err}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              )}
              <div
                className={cs(globalStyles.voffset4, {
                  [styles.auqaColorText]: bridalItem.qtyRemaining == 0
                })}
              >
                <div className={cs(styles.textMuted)}>Quantity Remaining</div>
                <div
                  className={cs(
                    globalStyles.textCenter,
                    globalStyles.c10LR,
                    globalStyles.voffset1
                  )}
                >
                  {bridalItem.qtyRemaining}
                </div>
              </div>
              <div className={cs(globalStyles.voffset4, styles.lightCharcoal)}>
                <div className={styles.textMuted}>Quantity Bought</div>
                <div
                  className={cs(
                    globalStyles.textCenter,
                    globalStyles.c10LR,
                    globalStyles.voffset1
                  )}
                >
                  {bridalItem.qtyBought}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={cs(bootstrap.row, globalStyles.voffset4)}>
        <button
          className={cs(btnDisable, {
            [styles.aquaCta]: btnContent == "ADD TO BAG"
          })}
          onClick={addToBag}
          disabled={buttonStatus}
        >
          {btnContent}
        </button>
      </div>
      {/* {bridalItem.productDeliveryDate && (
        <div className={bootstrap.row}>
          <div
            className={cs(
              bootstrap.col8,
              bootstrap.offset2,
              globalStyles.voffset3
            )}
          >
            <div className={globalStyles.c10LR}>
              Estimated delivery on or before:{" "}
              <span className={styles.black}>
                {bridalItem.productDeliveryDate}{" "}
              </span>
              <br />
              <br />
            </div>
            <div className={cs(globalStyles.cerise, styles.font14)}>
              {btnContent == "Fulfilled" || btnContent == "Notify Me"
                ? btnContent
                : ""}
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default BridalMobile;
