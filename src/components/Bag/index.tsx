import React from "react";
import styles from "./styles.scss";
import cs from "classnames";
import { CartProps, State } from "./typings";
import iconStyles from "../../styles/iconFonts.scss";
import globalStyles from "../../styles/global.scss";
import LineItems from "./Item";

export default class Bag extends React.Component<CartProps, State> {
  constructor(props: CartProps) {
    super(props);
    this.state = {
      stockError: "",
      shipping: false,
      value: 1
    };
  }

  hasOutOfStockItems = () => {
    const items = this.props.cart.lineItems;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.product.stockRecords[0].numInStock < 1) {
          return true;
        }
      }
    }
    return false;
  };

  getItemsCount() {
    let count = 0;
    const items = this.props.cart.lineItems;
    for (let i = 0; i < items.length; i++) {
      count = count + items[i].quantity;
    }
    return count;
  }

  getItems() {
    const {
      cart: { lineItems },
      currency
    } = this.props;

    const item = lineItems.map(item => {
      return <LineItems key={item.id} {...item} currency={currency} />;
    });
    return item.length > 0 ? (
      item
    ) : (
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
            <div className={cs(styles.iconCart, globalStyles.pointer)}>
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
              <i
                className={cs(
                  iconStyles.icon,
                  iconStyles.iconCrossNarrowBig,
                  styles.crossfontSize
                )}
              ></i>
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
