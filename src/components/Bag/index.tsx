import React from "react";
import styles from "./styles.scss";
import cs from "classnames";
import { CartProps, State } from "./typings";
import iconStyles from "../../styles/iconFonts.scss";
import globalStyles from "../../styles/global.scss";
// import history from "history";

export default class Bag extends React.Component<CartProps, State> {
  constructor(props: CartProps) {
    super(props);
    this.state = {
      stockError: "",
      shipping: false
    };
  }

  hasOutOfStockItems = () => {
    // let items = this.props.cart.products;
    // if (items) {
    //   for (var i = 0; i < items.length; i++) {
    //     let item = items[i];
    //     if (item.product.stockrecords[0].num_in_stock < 1) {
    //       return true;
    //     }
    //   }
    // }
    return false;
  };

  getItemsCount() {
    const count = 0;
    // let items = this.props.cart.products;
    // for (var i = 0; i < items.length; i++) {
    //   count = count + items[i].quantity;
    // }
    return count;
  }

  getSize = (data: number) => {
    // let size = data.find(function(attribute) {
    //   if (attribute.name == "Size") {
    //     return attribute;
    //   }
    // });
    // return size ? <div className="size">Size: {size.value}</div> : "";
  };

  getItems() {
    // if (this.props.cart && this.props.cart.products.length > 0) {
    //   var items:Product[] = [];
    //   for (let i = 0; i < this.props.cart.products.length; i++) {
    //     let item:Product = this.props.cart.products[i];
    //     let heartIcon = (
    //       <i
    //         className="icon icon_wishlist pointer"
    //         title="Move to Wishlist"
    //       ></i>
    //     );

    //     if (item.isInWishlist) {
    //       heartIcon = (
    //         <i
    //           className="icon icon_heart-cerise-fill pointer"
    //           title="Remove from Wishlist"
    //         ></i>
    //       );
    //     }
    //     items.push(
    //       <div className="cart-item gutter15">
    //         <div className="row">
    //           <div className="col-xs-4">
    //             <div className="cart-ring">
    //               {item. ? (
    //                 <svg
    //                   viewBox="-5 -5 50 50"
    //                   width="40"
    //                   height="40"
    //                   preserveAspectRatio="xMidYMid meet"
    //                   x="0"
    //                   y="0"
    //                   className="bridal-ring-cerise"
    //                 >
    //                   <use xlinkHref="/static/img/bridal/rings.svg#bridal-ring"></use>
    //                 </svg>
    //               ) : (
    //                 ""
    //               )}
    //             </div>
    //             <a
    //               href={
    //                 item.structure.toLowerCase() == "giftcard"
    //                   ? "#"
    //                   : item.product.get_absolute_url
    //               }
    //             >
    //               <img
    //                 className="product-image"
    //                 src={
    //                   item.product.structure.toLowerCase() == "giftcard"
    //                     ? item.gift_card_image
    //                     : item.product.images[0]
    //                     ? item.product.images[0].product_image.replace(
    //                         "/Medium/",
    //                         "/Micro/"
    //                       )
    //                     : ""
    //                 }
    //               />
    //             </a>
    //           </div>
    //           <div className="col-xs-8">
    //             <div className="collection-name">{item.product.collection}</div>
    //             <div className="row">
    //               <div className="col-xs-10 name">
    //                 <div>
    //                   <a
    //                     href={
    //                       item.product.structure.toLowerCase() == "giftcard"
    //                         ? "#"
    //                         : item.product.get_absolute_url
    //                     }
    //                   >
    //                     {item.product.title}
    //                   </a>
    //                 </div>
    //                 {this.state.salestatus && item.product.discount ? (
    //                   <div className="product-price">
    //                     {" "}
    //                     <span className="discountprice">
    //                       {Currency.getSymbol()}{" "}
    //                       {item.product.sku == Steps.DYNAMIC_GIFTCARD_SKU
    //                         ? item.price_incl_tax
    //                         : item.product.discounted_pricerecord[
    //                             item.price_currency
    //                           ]}
    //                     </span>
    //                     &nbsp;{" "}
    //                     <span className="strikeprice">
    //                       {Currency.getSymbol()}{" "}
    //                       {item.product.sku == Steps.DYNAMIC_GIFTCARD_SKU
    //                         ? item.price_incl_tax
    //                         : item.product.pricerecords[item.price_currency]}
    //                     </span>
    //                   </div>
    //                 ) : (
    //                   <div className="product-price">
    //                     {Currency.getSymbol()}{" "}
    //                     {item.product.sku == Steps.DYNAMIC_GIFTCARD_SKU
    //                       ? item.price_incl_tax
    //                       : item.product.pricerecords[item.price_currency]}
    //                   </div>
    //                 )}
    //               </div>
    //               <div
    //                 className="col-xs-2 pointer text-center remove"
    //                 onClick={() => this.removeItem(item, i)}
    //                 title="Remove"
    //               >
    //                 <i className="icon icon_cross-narrow-big"></i>
    //               </div>
    //             </div>
    //             <div
    //               className={
    //                 item.product.structure
    //                   ? item.product.structure.toLowerCase() == "giftcard"
    //                     ? "row section hidden-eye"
    //                     : "row section"
    //                   : "row section"
    //               }
    //             >
    //               <div className="col-xs-10">
    //                 {this.getSize(item.product.attributes)}
    //                 <WidgetQty {...item} changeQty={this.changeQty} index={i} />
    //                 {this.state.stock_error[i] ? (
    //                   <p className="error-msg ">{this.state.stock_error[i]}</p>
    //                 ) : (
    //                   ""
    //                 )}
    //                 {item.product.stockrecords ? (
    //                   item.product.stockrecords[0].num_in_stock < 1 ? (
    //                     <div className="color-primary italic margin-t-10 bold c10-L-R error-msg">
    //                       Out of stock
    //                     </div>
    //                   ) : (
    //                     ""
    //                   )
    //                 ) : (
    //                   ""
    //                 )}
    //               </div>
    //               {item.bridal_profile ? (
    //                 ""
    //               ) : (
    //                 <div className="col-xs-2 text-center heart">
    //                   {heartIcon}
    //                 </div>
    //               )}
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     );
    //   }
    //   return items;
    // }

    return (
      <p className={cs(globalStyles.marginT20, globalStyles.textCenter)}>
        No items added to bag.
      </p>
    );
  }

  goToCart() {
    // history.push("/cart")
  }

  getFooter() {
    if (this.props.cart) {
      return (
        <div className={styles.bagFooter}>
          {this.hasOutOfStockItems() && (
            <div
              className={cs(
                styles.errorMsg,
                globalStyles.lineHt10,
                styles.containerCost,
                globalStyles.linkTextUnderline
              )}
              style={{ display: "inline-block" }}
            >
              Remove all Items out of stock
            </div>
          )}
          <div
            className={cs(
              globalStyles.flex,
              globalStyles.gutterBetween,
              styles.containerCost
            )}
          >
            <div className={cs(styles.totalPrice, globalStyles.bold)}>
              SUBTOTAL
            </div>
            <div className={styles.textRight}>
              <h5 className={cs(styles.totalPrice, globalStyles.bold)}>
                {/* {Currency.getSymbol()} {this.calculateDiscount()} */}
              </h5>
              <p className={styles.subtext}>
                Excluding estimated cost of shipping
              </p>
            </div>
          </div>
          <div className={cs(globalStyles.flex, styles.bagFlex)}>
            <div className={cs(styles.iconCart, globalStyles.cursorPointer)}>
              <div
                className={styles.innerDiv}
                onClick={this.goToCart.bind(this)}
              >
                <div className={styles.cartIconDiv}>
                  <i
                    className={cs(
                      iconStyles.icon,
                      iconStyles.iconCart,
                      globalStyles.cerise
                    )}
                  ></i>
                </div>
                <span className={styles.viewBag}>VIEW SHOPPING BAG</span>
              </div>
            </div>
            <button
              className={cs(globalStyles.ceriseBtn, {
                [globalStyles.disabled]: !this.canCheckout()
              })}
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      );
    }
  }

  canCheckout = () => {
    return true;
  };

  render() {
    if (this.props.cart) {
      // this.props.onCartCountChange(this.getItemsCount());
      // this.amountLeft = 50000 - this.calculateDiscount();
    }
    return (
      <div>
        <div
          className={cs(
            styles.bagBackdrop,
            this.props.active ? styles.active : ""
          )}
          onClick={(): void => {
            this.props.toggleBag();
          }}
        ></div>
        <div
          className={cs(
            styles.bag,
            { [styles.active]: this.props.active },
            { [styles.smoothOut]: !this.props.active }
          )}
        >
          <div
            className={cs(
              styles.bagHeader,
              globalStyles.flex,
              globalStyles.gutterBetween
            )}
          >
            <div className={styles.heading}>Mini BAG</div>
            <div className={styles.subtext}>
              {this.props.cart ? this.getItemsCount() : "0"} item(s) in bag
            </div>
            <div
              className={globalStyles.pointer}
              onClick={this.props.toggleBag}
            >
              <i className={cs(iconStyles.icon, iconStyles.iconCross)}></i>
            </div>
          </div>
          {this.state.shipping ? (
            <div className={styles.cart}>
              <div className={cs(styles.message, styles.noMargin)}>
                You&apos; re a step away from{" "}
                <span className={globalStyles.linkTextUnderline}>
                  free shipping
                </span>
                !
                <br /> Select products worth
                {} or more to your order to qualify.
              </div>
            </div>
          ) : (
            ""
          )}

          <div className={styles.bagContents}>{this.getItems()}</div>
          {this.getFooter()}
        </div>
      </div>
    );
  }
}
