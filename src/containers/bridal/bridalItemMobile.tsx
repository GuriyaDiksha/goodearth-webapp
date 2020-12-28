import { showMessage } from "actions/growlMessage";
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

type Props = {
  bridalItem: BridalItemData;
  // closeMobile: () => void;
  bridalId: number;
};

const BridalMobile: React.FC<Props> = ({ bridalItem, bridalId }) => {
  const [qtyCurrent, setQtyCurrent] = useState(1);
  const [buttonStatus, setButtonStatus] = useState(false);
  const [btnDisable, setBtnDisable] = useState("btn");
  const [btnContent, setBtnContent] = useState("ADD TO BAG");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (bridalItem.qtyRemaining == 0) {
      setButtonStatus(true);
      setBtnDisable("btn disabled-input");
      setBtnContent("Fulfilled");
    } else if (bridalItem.stock == 0) {
      setButtonStatus(true);
      setBtnDisable("btn disabled-input");
      setBtnContent("Out Of Stock");
    }
  }, []);

  const increaseState = () => {
    const maxQty = bridalItem.stock;
    let qty = qtyCurrent;
    if (qty < maxQty) {
      qty += 1;
      setQtyCurrent(qty);
    } else {
      setErr("Available qty in stock is " + maxQty);
    }
  };

  const decreaseState = () => {
    let qty = qtyCurrent;
    if (qty > 1) {
      qty -= 1;
      setQtyCurrent(qty);
      setErr("");
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
        dispatch(showMessage("Item has been added to your bag!"));
      })
      .catch(err => {
        let errorMessage = err.response.data.reason;
        if (typeof errorMessage != "string") {
          errorMessage = "Can't add to bag";
        }
        dispatch(showMessage(errorMessage));
      });
    // closeMobile();
  };

  return (
    <div
      className={cs(
        styles.sizeBlockBridal,
        styles.ht,
        styles.centerpageDesktop,
        styles.textCenter
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
              <div className={styles.voffset7}>
                <div className={styles.textMuted}>REQUESTED</div>
                <div
                  className={cs(globalStyles.textCenter, globalStyles.c10LR)}
                >
                  {bridalItem.qtyRequested}
                </div>
              </div>
              <div className={globalStyles.voffset3}>
                <div className={styles.textMuted}>REMAINING</div>
                <div
                  className={cs(globalStyles.textCenter, globalStyles.c10LR)}
                >
                  {bridalItem.qtyRemaining}
                </div>
              </div>

              <div className={styles.voffset3}>
                <div className={styles.textMuted}>QTY</div>
                <div className={styles.widgetQty}>
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
            </div>
          </div>
        </div>
      </div>
      <div className={bootstrap.row}>
        <div
          className={cs(
            bootstrap.col8,
            bootstrap.offset2,
            globalStyles.voffset3
          )}
        >
          <button
            className={btnDisable}
            onClick={addToBag}
            disabled={buttonStatus}
          >
            {btnContent}
          </button>
        </div>
      </div>
      <div className={bootstrap.row}>
        <div
          className={cs(
            bootstrap.col8,
            bootstrap.offset2,
            globalStyles.voffset3
          )}
        >
          <div className={globalStyles.c10LR}>
            For regular orders, the delivery time will be 6-8 business days.
            <br />
            <br />
          </div>
          <div className={globalStyles.cerise}>
            {btnContent == "Fulfilled" || btnContent == "Out Of Stock"
              ? btnContent
              : ""}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BridalMobile;
