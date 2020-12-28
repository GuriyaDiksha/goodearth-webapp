import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { BridalItemData } from "./typings";
import BridalService from "services/bridal";

type Props = {
  fetchBridalItems: () => void;
  itemData: BridalItemData;
  bridalId: number;
};

const BridalMobileProductUpdate: React.FC<Props> = props => {
  const [currentQty, setCurrentQty] = useState(props.itemData.qtyRequested);
  const [btnDisable, setBtnDisable] = useState(true);
  const [err, setErr] = useState("");

  const closeMPopup = () => {
    props.fetchBridalItems();
    // & close popup
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
    let qty = currentQty;
    if (qty >= props.itemData.stock) {
      setErr("Available qty in stock is " + props.itemData.stock);
      return false;
    }
    qty += 1;
    setCurrentQty(qty);
    setBtnDisable(false);
  };

  return (
    <>
      <div className="size-block-bridal ht centerpage-desktop text-center">
        <div className="cross">
          <i className="icon icon_cross" onClick={closeMPopup}></i>
        </div>
        <div className="row voffset6">
          <div className="col-xs-8 col-xs-offset-2">
            <div className="login-form">
              <div className="section section-middle cart">
                <div className="voffset4">
                  <div className="text-muted">QTY REQUESTED</div>
                  <div className="widget-qty">
                    <span className="btn-qty" onClick={decreaseState}>
                      -
                    </span>{" "}
                    <span className="qty">{currentQty}</span>{" "}
                    <span className="btn-qty" onClick={increaseState}>
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
                  <div className="error-msg text-center">{err}</div>
                </div>
                <div className="voffset4">
                  <div className="text-muted">QTY BOUGHT</div>
                  <div className="text-center c10-L-R">
                    {props.itemData.qtyBought}
                  </div>
                </div>
                <div className="voffset4">
                  <div className="text-muted">QTY REMAINING</div>
                  <div className="text-center c10-L-R">
                    {currentQty - props.itemData.qtyBought}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-8 col-xs-offset-2 voffset3">
            <div
              className={btnDisable ? "btn disabled-input" : "btn"}
              onClick={save}
            >
              save
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-8 col-xs-offset-2 voffset3">
            <div className="c10-L-R">
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
