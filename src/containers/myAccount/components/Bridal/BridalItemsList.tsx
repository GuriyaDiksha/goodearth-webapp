import React, { useState } from "react";
import { currencyCode, Currency } from "typings/currency";
import { BridalItem } from "./typings";
import BridalService from "services/bridal";
import { useDispatch } from "react-redux";

type Props = {
  product: BridalItem;
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
    <div className="cart cart-container">
      <div className="cart-item bridal-public">
        <div className="row flex">
          <div className="col-xs-5 col-md-3">
            <a href={productUrl}>
              <img className="product-image" src={productImage} />
            </a>
          </div>
          <div className="col-xs-7 col-md-9">
            <div className="row-main">
              <div className="col-xs-12 col-md-6">
                <div className="section section-info">
                  <div>
                    <div className="collection-name">{collection}</div>
                    <div className="product-name">
                      <a href={productUrl}>{productName}</a>
                    </div>
                  </div>
                  <div className="product-price">
                    {saleStatus && discount ? (
                      <span className="product-price">
                        <span className="discountprice">
                          {getCurrency()} {discountedPrice[props.currency]}
                        </span>
                        &nbsp;{" "}
                        <span className="strikeprice">
                          {getCurrency()} {price[props.currency]}
                        </span>
                      </span>
                    ) : (
                      <span className="product-price">
                        {getCurrency()} {price[props.currency]}
                      </span>
                    )}
                  </div>
                  <div className="smallfont">SIZE: {size}</div>
                  <div className="smallfont voffset1">SKU: {sku}</div>
                  <div
                    className="icon-cart hidden-md hidden-lg voffset3"
                    onClick={mobileAddToBag}
                  >
                    <img
                      src="/static/img/icons_cartregistry-details.svg"
                      width="40"
                      height="40"
                    />
                  </div>
                </div>
              </div>
              <div className="col-xs-12 col-md-6 hidden-xs hidden-sm">
                <div className="section section-middle">
                  <div className="">
                    <div className="hidden-xs hidden-sm text-muted">
                      QTY REQUESTED
                    </div>
                    <div className="widget-qty">
                      <span className="btn-qty" onClick={decreaseState}>
                        -
                      </span>
                      <span className="qty">{reqCurrent}</span>
                      <span className="btn-qty" onClick={increaseState}>
                        +
                      </span>
                    </div>
                    <div className="error-msg text-center">{err}</div>
                  </div>
                  <div className="voffset3">
                    <div className="hidden-xs hidden-sm text-muted">
                      QTY BOUGHT
                    </div>
                    <div className="text-center c10-L-R">{qtyBought}</div>
                  </div>
                  <div className="voffset3">
                    <div className="hidden-xs hidden-sm text-muted">
                      QTY REMAINING
                    </div>
                    <div className="text-center c10-L-R">{qtyRemaining}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {qtyBought ? (
            ""
          ) : (
            <div title="Remove" onClick={deleteItem}>
              <i className="icon icon_cross-narrow-big remove"></i>
            </div>
          )}
        </div>
        <hr className="hr" />
      </div>
    </div>
  );
};

export default BridalItemsList;
