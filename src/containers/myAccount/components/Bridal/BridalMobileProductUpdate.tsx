import React, { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { BridalItemData } from "./typings";
import BridalService from "services/bridal";
import bootstrap from "../../../../styles/bootstrap/bootstrap-grid.scss";
import iconStyles from "../../../../styles/iconFonts.scss";
import styles from "./styles.scss";
import globalStyles from "../../../../styles/global.scss";
import cs from "classnames";
import { Context } from "components/Modal/context";

type Props = {
  fetchBridalItems: () => void;
  itemData: BridalItemData;
  bridalId: number;
};

const BridalMobileProductUpdate: React.FC<Props> = props => {
  const [currentQty, setCurrentQty] = useState(props.itemData.qtyRequested);
  const [btnDisable, setBtnDisable] = useState(true);
  const [err, setErr] = useState("");
  const { closeModal } = useContext(Context);
  const closeMPopup = () => {
    props.fetchBridalItems();
    // & close popup
    closeModal();
  };
  const dispatch = useDispatch();

  const save = () => {
    if (btnDisable) return false;
    const data = {
      bridalId: props.bridalId,
      qtyRequested: currentQty,
      productId: props.itemData.productId
    };

    BridalService.updateBridalItemQuantity(dispatch, data)
      .then(res => {
        closeMPopup();
      })
      .catch(error => {
        // console.log(error);
      });
  };

  const decreaseState = () => {
    let qty = currentQty;
    if (qty > 1) {
      qty -= 1;
      setCurrentQty(qty);
      setBtnDisable(false);
      setErr("");
    }
  };

  const increaseState = () => {
    const { stock } = props.itemData;
    let qty = currentQty;
    if (qty >= props.itemData.stock) {
      setErr(`Only ${stock} piece${stock > 1 ? "s" : ""} available in stock`);
      return false;
    }
    qty += 1;
    setCurrentQty(qty);
    setBtnDisable(false);
  };

  return (
    <>
      <div
        className={cs(
          styles.sizeBlockBridal,
          styles.ht,
          styles.centerpageMobile,
          globalStyles.textCenter
        )}
      >
        <div className={styles.cross} onClick={closeMPopup}>
          <i className={cs(iconStyles.icon, iconStyles.iconCrossNarrowBig)}></i>
        </div>
        <div className={cs(bootstrap.row, globalStyles.voffset6)}>
          <div className={cs(bootstrap.col8, bootstrap.offset2)}>
            <div className={styles.loginForm}>
              <div
                className={cs(
                  styles.section,
                  styles.sectionMiddle,
                  styles.cart
                )}
              >
                <div className={globalStyles.voffset4}>
                  <div className={styles.textMuted}>QTY REQUESTED</div>
                  <div className={styles.widgetQty}>
                    <span className={styles.btnQty} onClick={decreaseState}>
                      -
                    </span>{" "}
                    <span className={styles.qty}>{currentQty}</span>{" "}
                    <span className={styles.btnQty} onClick={increaseState}>
                      +
                    </span>
                  </div>
                  {/* <div className={styles.widgetQty}>
                  <Quantity
                    key={id}
                    currentValue={value}
                    minValue={1}
                    maxValue={100}
                    onChange={handleChange}
                    // class="my-quantity"
                    errorMsg="Available qty in stock is"
                  />
                </div> */}
                  <div
                    className={cs(
                      globalStyles.errorMsg,
                      globalStyles.textCenter
                    )}
                  >
                    {err}
                  </div>
                </div>
                <div className={globalStyles.voffset4}>
                  <div className={styles.textMuted}>QTY BOUGHT</div>
                  <div
                    className={cs(globalStyles.textCenter, globalStyles.c10LR)}
                  >
                    {props.itemData.qtyBought}
                  </div>
                </div>
                <div className={globalStyles.voffset4}>
                  <div className={styles.textMuted}>QTY REMAINING</div>
                  <div
                    className={cs(globalStyles.textCenter, globalStyles.c10LR)}
                  >
                    {currentQty - props.itemData.qtyBought}
                  </div>
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
            <div
              className={
                btnDisable
                  ? cs(globalStyles.ceriseBtn, globalStyles.disabledBtn)
                  : globalStyles.ceriseBtn
              }
              onClick={save}
            >
              save
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
            <div className={globalStyles.c10LR}>
              For regular orders, the delivery time will be 6-8 business days.{" "}
              <br />
              <br />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BridalMobileProductUpdate;
