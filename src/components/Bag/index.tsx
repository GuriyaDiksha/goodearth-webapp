import React from "react";
import styles from "./styles.scss";
import cs from "classnames";
import { CartProps, State } from "./typings";
import iconStyles from "../../styles/iconFonts.scss";
import globalStyles from "../../styles/global.scss";
import LineItems from "./Item";
import { NavLink, Link } from "react-router-dom";
import { currencyCodes } from "constants/currency";

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
      return (
        <LineItems
          key={item.id}
          {...item}
          currency={currency}
          toggleBag={this.props.toggleBag}
        />
      );
    });
    return item.length > 0 ? (
      item
    ) : (
      <p className={cs(globalStyles.marginT20, globalStyles.textCenter)}>
        No items added to bag.
      </p>
    );
  }
  removeOutOfStockItems() {
    // implement remove out of stock
  }

  getFooter() {
    if (this.props.cart) {
      return (
        <div className={styles.bagFooter}>
          {this.hasOutOfStockItems() && (
            <div
              className={cs(
                globalStyles.errorMsg,
                globalStyles.lineHt10,
                styles.containerCost,
                globalStyles.linkTextUnderline
              )}
              onClick={this.removeOutOfStockItems}
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
            <div className={globalStyles.textRight}>
              <h5 className={cs(styles.totalPrice, globalStyles.bold)}>
                {String.fromCharCode(currencyCodes[this.props.currency])}
                &nbsp;
                {this.props.cart.subTotal}
              </h5>
              <p className={styles.subtext}>
                Excluding estimated cost of shipping
              </p>
            </div>
          </div>
          <div className={cs(globalStyles.flex, styles.bagFlex)}>
            <div className={cs(styles.iconCart, globalStyles.pointer)}>
              <div className={styles.innerDiv}>
                <div className={styles.cartIconDiv}>
                  <i
                    className={cs(
                      iconStyles.icon,
                      iconStyles.iconCart,
                      globalStyles.cerise
                    )}
                  ></i>
                </div>
                <span className={styles.viewBag}>
                  <Link to="/cart">VIEW SHOPPING BAG</Link>
                </span>
              </div>
            </div>
            {this.canCheckout() ? (
              <NavLink key="checkout" to="/order/checkout">
                <button
                  className={cs(globalStyles.ceriseBtn, {
                    [globalStyles.disabledBtn]: !this.canCheckout()
                  })}
                >
                  PROCEED TO CHECKOUT
                </button>
              </NavLink>
            ) : (
              <div>
                <button
                  className={cs(
                    globalStyles.ceriseBtn,
                    globalStyles.disabledBtn
                  )}
                >
                  PROCEED TO CHECKOUT
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }
  }

  canCheckout = () => {
    // if (pathname.indexOf("checkout") > -1) {
    //   return false;
    // }
    // this.amountLeft = 50000 - this.props.cart.subTotal;
    if (
      !this.props.cart.lineItems ||
      this.hasOutOfStockItems() ||
      this.props.cart.lineItems.length == 0
    ) {
      return false;
    }
    if (!this.props.cart.shippable && this.state.shipping == true) {
      this.setState({
        shipping: false
      });
    } else if (
      this.props.cart.subTotal >= 45000 &&
      this.props.cart.subTotal < 50000 &&
      this.state.shipping == false &&
      this.props.currency == "INR" &&
      this.props.cart.shippable
    ) {
      this.setState({
        shipping: true
      });
    } else if (
      (this.props.cart.subTotal < 45000 || this.props.cart.subTotal >= 50000) &&
      this.state.shipping
    ) {
      this.setState({
        shipping: false
      });
    }
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
