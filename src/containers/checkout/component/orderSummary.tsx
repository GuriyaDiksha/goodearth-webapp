import React, { useState } from "react";
import cs from "classnames";
// import iconStyles from "../../styles/iconFonts.scss";
// import bootstrapStyles from "../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import styles from "./styles.scss";
import * as Steps from "containers/checkout/constants";
import { OrderProps } from "./typings";
import { Currency, currencyCode } from "typings/currency";
import { Link } from "react-router-dom";

const OrderSummary: React.FC<OrderProps> = props => {
  const {
    mobile,
    basket,
    currency,
    page,
    shippingAddress,
    salestatus,
    validbo
  } = props;
  const [showSummary, setShowSummary] = useState(true);
  const [isSuspended, setIsSuspended] = useState(true);
  const code = currencyCode[currency as Currency];

  const onArrowButtonClick = () => {
    setShowSummary(!showSummary);
    setIsSuspended(true);
  };

  const getSize = (data: any) => {
    const size = data.find(function(attribute: any) {
      if (attribute.name == "Size") {
        return attribute;
      }
    });
    return size ? <span>Size: {size.value}</span> : "";
  };

  const getDeliveryStatusMobile = () => {
    const html = [];
    if (!basket.lineItems) return false;
    if (basket.shippable == false || mobile) {
      html.push();
    } else {
      html.push(
        <div className={styles.padd}>
          {!isSuspended &&
            (salestatus
              ? currency == "INR"
                ? "Delivery within 8-10 business days"
                : "Delivery within 10-12 business days"
              : currency == "INR"
              ? "Expected Delivery: 6-8 business days"
              : `Expected Delivery: 7-10 business days`)}
          <div>
            {isSuspended ? (
              ""
            ) : (
              <p>
                *Expected Delivery for Wallcoverings- within 40 business days
              </p>
            )}
            {
              <div>
                <p className={globalStyles.cerise}>
                  Apply code: <b>SAVE20</b> at checkout to avail 20% discount on
                  international orders, valid from 1st July till 10th July 2020,
                  midnight IST.
                </p>
                <br />
              </div>
            }
            {isSuspended && (
              <p>
                {" "}
                In the current scenario, the delivery time of your order(s)
                placed during this period will vary as per restrictions imposed
                in that area. Please bear with us and connect with our customer
                care for assistance.
              </p>
            )}
            {isSuspended && (
              <p>
                We have resumed International shipping and shipping within
                India, in select zones (as per Government guidelines).
              </p>
            )}
            {/* *Expected Delivery of Pichwai Art is 15 to 18 business days */}
          </div>
        </div>
      );
    }
    return html;
  };

  const getOrderItems = () => {
    return (
      <div className={cs(styles.orderItems, styles.fixOrderItems)}>
        {basket.lineItems.map(function(item, index) {
          return (
            <div key={index}>
              <div className={globalStyles.voffset1}>
                <div
                  className={cs(globalStyles.flex, globalStyles.gutterBetween)}
                >
                  <span className={styles.collectionName}>
                    {item.product.collections}
                  </span>
                  <span></span>
                </div>
                <div
                  className={cs(globalStyles.flex, globalStyles.gutterBetween)}
                >
                  <span className={styles.productName}>
                    {item.product.title}
                  </span>

                  {salestatus && item.product.discount ? (
                    <span className={styles.productPrice}>
                      <span className={styles.discountprice}>
                        price_excl_tax_excl_discounts
                        {String.fromCharCode(code)}{" "}
                        {item.product.sku == Steps.DYNAMIC_GIFTCARD_SKU
                          ? item.product.priceRecords[currency]
                          : item.product.discountedPriceRecords[currency]}
                      </span>
                      &nbsp;
                      <span className={styles.strikeprice}>
                        {String.fromCharCode(code)}{" "}
                        {item.product.sku == Steps.DYNAMIC_GIFTCARD_SKU
                          ? item.product.priceRecords[currency]
                          : item.product.priceRecords[currency]}{" "}
                      </span>{" "}
                    </span>
                  ) : (
                    <span className={styles.productPrice}>
                      {String.fromCharCode(code)}{" "}
                      {item.product.sku == Steps.DYNAMIC_GIFTCARD_SKU
                        ? item.product.priceRecords[currency]
                        : item.product.priceRecords[currency]}
                    </span>
                  )}
                </div>

                <div
                  className={cs(
                    globalStyles.flex,
                    globalStyles.gutterBetween,
                    globalStyles.voffset1
                  )}
                >
                  <span className={styles.productSize}>
                    {getSize(item.product.attributes)}
                  </span>
                  <span className={styles.productQty}>
                    <span>Qty: </span> {item.quantity}
                  </span>
                </div>
              </div>
              <hr className={styles.hr} />
            </div>
          );
        })}
        {getDeliveryStatusMobile()}
      </div>
    );
  };

  const getCoupons = () => {
    // let coupon = null;
    // let giftCard = null;
    // let loyalty = null;
    // let voucherDiscount = this.props.voucher_discounts[0];
    // if (voucherDiscount || this.props.giftCard) {
    //     if (voucherDiscount) {
    //         coupon = (
    //             <div className="flex gutter-between">
    //                 <span className="subtotal">
    //                     <span className="margin-r-10">{voucherDiscount.voucher.code}</span>
    //                     <span className="promo-message">
    //                         <span className="text-muted margin-r-10">PROMO CODE APPLIED</span>
    //                         <span onClick={() => this.onPromoRemove(voucherDiscount.voucher.code)}><i
    //                             className={window.valid_bo ? "icon icon_cross-narrow-big remove hidden" : "icon icon_cross-narrow-big remove"}></i></span>
    //                     </span>
    //                 </span>
    //                 <span className="subtotal">(-) {Currency.getSymbol()} {voucherDiscount.amount}</span>
    //             </div>
    //         );
    //     }

    //     if (this.props.giftCard) {
    //         giftCard = this.props.giftCard.map((gift, index) => {
    //             return <div className="flex gutter-between margin-t-20 cross-center" key={index}>
    //                 <span className="subtotal">
    //                     <span className="margin-r-10 txtup">{gift.card_id}</span>
    //                     <span className="promo-message">
    //                         <span className="text-muted margin-r-10">{gift.card_type=='CREDITNOTE'?'CREDIT NOTE APPLIED':'GIFT CODE APPLIED'}</span>
    //                         <span className="remove"
    //                               onClick={() => this.onGiftCardRemove(gift.card_id)}>
    //                             <i className="icon icon_cross-narrow-big remove"></i>
    //                         </span>
    //                     </span>
    //                 </span>
    //                 <span
    //                     className="subtotal">(-) {Currency.getSymbol()} {gift.gift_card_total_value - gift.gift_card_balance}</span>
    //             </div>
    //         })
    //     }
    //     if(this.props.loyalty){
    //         loyalty =(
    //             <div className="flex gutter-between">
    //                 <span className="subtotal">
    //                     <span className="margin-r-10">CERISE POINTS</span>
    //                     <span className="promo-message">
    //                         <span className="text-muted margin-r-10">REDEEMED</span>
    //                         <span onClick={() => this.onLoyaltyRemove()}><i
    //                             className="icon icon_cross-narrow-big remove"></i></span>
    //                     </span>
    //                 </span>
    //                 <span className="subtotal">(-) {Currency.getSymbol()} {this.props.loyalty}</span>
    //             </div>
    //         )
    //     }
    //     return (
    //         <div>
    //             {(coupon || giftCard.length > 0) && <hr className="hr"/>}
    //             {coupon}
    //             {giftCard}
    //             {loyalty}
    //         </div>
    //     );
    // }

    return null;
  };

  const getDeliveryStatus = () => {
    return true;
  };

  const canCheckout = () => {
    return true;
  };

  const chkshipping = () => {
    return true;
  };

  const hasOutOfStockItems = () => {
    return true;
  };

  const onRemoveOutOfStockItemsClick = () => {
    return true;
  };

  const goTowishlist = () => {
    return true;
  };

  const getDiscount = (data: any) => {
    // let initial = 0,
    //     price;
    // if (data.length > 1) {
    //     price = data.reduce((acc, pre) => {
    //         return acc + parseFloat(+pre.amount)
    //     }, 0);
    // } else if (data.length == 1) {
    //     price = initial + (+data[0].amount)
    // }

    return data.length > 0
      ? data.map((discount: any, index: number) => (
          <div
            className={cs(
              globalStyles.flex,
              globalStyles.gutterBetween,
              globalStyles.marginT20
            )}
            key={index}
          >
            <span className={styles.subtotal}>
              {discount.name == "price-discount" ? "DISCOUNT" : discount.name}
            </span>
            <span className={styles.subtotal}>
              (-) {String.fromCharCode(code)}{" "}
              {parseFloat(discount.amount).toFixed(2)}
            </span>
          </div>
        ))
      : "";
  };

  const getSummary = () => {
    let shippingCharge: any = 0;
    if (basket.shippingCharge) {
      shippingCharge = basket.shippingCharge;
    }
    if (basket.lineItems) {
      return (
        <div
          className={
            showSummary
              ? cs(styles.summaryPadding, styles.fixOrderItemsMobile)
              : cs(styles.summaryPadding, globalStyles.hidden)
          }
        >
          {getOrderItems()}
          <div className={cs(globalStyles.flex, globalStyles.gutterBetween)}>
            <span className={styles.subtotal}>SUBTOTAL</span>
            <span className={styles.subtotal}>
              {String.fromCharCode(code)} {basket.subTotal}
            </span>
          </div>
          <div
            className={cs(
              globalStyles.flex,
              globalStyles.gutterBetween,
              globalStyles.marginT20
            )}
          >
            <span className={styles.subtotal}>ESTIMATED SHIPPING</span>
            <span className={styles.subtotal}>
              (+) {String.fromCharCode(code)}{" "}
              {parseFloat(shippingCharge).toFixed(2)}
            </span>
          </div>
          {getDiscount(basket.offerDiscounts)}
          {shippingAddress && (
            <div
              className={cs(
                styles.small,
                styles.selectedStvalue,
                globalStyles.marginT10
              )}
            >
              to {shippingAddress.state} - {shippingAddress.postcode}
            </div>
          )}
          {getCoupons()}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.orderSummary}>
      {mobile && (
        <span
          className="btn-arrow visible-xs color-primary"
          onClick={onArrowButtonClick}
        >
          <i
            className={
              showSummary
                ? "icon icon_downarrow-black"
                : "icon icon_uparrow-black"
            }
          ></i>
        </span>
      )}
      <div className={cs(styles.summaryPadding, styles.summaryHeader)}>
        <h3 className={cs(globalStyles.textCenter, styles.summaryTitle)}>
          ORDER SUMMARY{" "}
          {page == "checkout" && !validbo ? (
            <Link className={styles.editCart} to={"/cart"}>
              {" "}
              EDIT CART
            </Link>
          ) : (
            ""
          )}
        </h3>
      </div>
      <div className={styles.justchk}>
        {getSummary()}
        <div className={styles.summaryPadding}>
          <hr className={styles.hr} />
          <div
            className={cs(
              globalStyles.flex,
              globalStyles.gutterBetween,
              styles.total
            )}
          >
            <span className={cs(styles.subtotal, globalStyles.voffset2)}>
              TOTAL
            </span>
            <span className={cs(styles.grandTotal, globalStyles.voffset2)}>
              {String.fromCharCode(code)} {basket.total}
            </span>
          </div>
          {getDeliveryStatus()}
          {currency == "INR" ? (
            ""
          ) : basket.shippable == false ? (
            ""
          ) : (
            <div
              className={cs(
                globalStyles.c10LR,
                globalStyles.voffset2,
                globalStyles.marginB10
              )}
            >
              Custom Duties & Taxes are extra, can be upto 30% or more of order
              value in some cases, depending upon local customs assessment.
            </div>
          )}
          {page == "cart" && (
            <div className={showSummary ? "" : "hidden-xs hidden-sm"}>
              <hr className="hr" />
              <a
                href={canCheckout() ? "/order/checkout/" : "javascript:void(0)"}
              >
                <button
                  onClick={chkshipping}
                  className={
                    canCheckout()
                      ? "cerise-btn hidden-xs hidden-sm"
                      : "cerise-btn disabled hidden-xs hidden-sm"
                  }
                >
                  PROCEED TO CHECKOUT
                </button>
              </a>
              {hasOutOfStockItems() && (
                <p
                  className="text-center text-remove-items color-primary"
                  onClick={onRemoveOutOfStockItemsClick}
                >
                  Please
                  <span className="trigger-remove-items">REMOVE ALL ITEMS</span>
                  which are out of stock to proceed
                </p>
              )}
              <div className="text-center text-coupon voffset4">
                If you have promo code or a gift card code,
                <br />
                you can apply the same during payment.
              </div>
              <div className="wishlist">
                <a onClick={goTowishlist}>
                  <span>
                    <i className="icon icon_wishlist pointer"></i>
                  </span>
                  &nbsp;<span className="wishlist-align">VIEW WISHLIST</span>
                </a>
              </div>
            </div>
          )}
        </div>
        {page == "cart" && (
          <div className="visible-xs visible-sm summary-footer">
            <a href={canCheckout() ? "/order/checkout" : "#"}>
              <button
                onClick={chkshipping}
                className={canCheckout() ? "cerise-btn" : "cerise-btn disabled"}
              >
                PROCEED TO CHECKOUT
              </button>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderSummary;
