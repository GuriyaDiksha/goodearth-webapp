import React from "react";
// import styles from "./styles.scss";
import styles from "./styles_new.scss";
import cs from "classnames";
import { CartProps, State } from "./typings";
import iconStyles from "../../styles/iconFonts.scss";
import globalStyles from "../../styles/global.scss";
import LineItems from "./Item";
import { NavLink, Link } from "react-router-dom";
import { currencyCodes } from "constants/currency";
import { Dispatch } from "redux";
import BasketService from "services/basket";
import { connect } from "react-redux";
import { AppState } from "reducers/typings";
import * as util from "../../utils/validate";
import CookieService from "services/cookie";
import { GA_CALLS } from "constants/cookieConsent";

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    removeOutOfStockItems: async () => {
      const res = await BasketService.removeOutOfStockItems(dispatch);
      return res;
    }
  };
};
const mapStateToProps = (state: AppState) => {
  return {
    isSale: state.info.isSale,
    customerGroup: state.user.customerGroup,
    isLoggedIn: state.user.isLoggedIn
  };
};
type Props = CartProps &
  ReturnType<typeof mapDispatchToProps> &
  ReturnType<typeof mapStateToProps>;
class Bag extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      stockError: "",
      shipping: false,
      value: 1,
      freeShipping: false, // for all_free_shipping_india
      isSuspended: true // for is_covid19
    };
  }

  componentDidMount = () => {
    document.body.classList.add(globalStyles.noScroll);
    try {
      const skuList = this.props.cart.lineItems.map(
        item => item.product.childAttributes?.[0].sku
      );
      const userConsent = CookieService.getCookie("consent").split(",");
      if (userConsent.includes(GA_CALLS)) {
        dataLayer.push({
          "Event Category": "GA Ecommerce",
          "Event Action": "Cart Summary Page",
          "Event Label": skuList.length > 0 ? skuList.join(",") : "",
          "Time Stamp": new Date().toISOString(),
          "Page Url": location.href,
          "Page Type": util.getPageType(),
          "Login Status": this.props.isLoggedIn ? "logged in" : "logged out",
          "Page referrer url": location.href
        });
      }
    } catch (err) {
      console.log(err);
    }
  };
  componentWillUnmount = () => {
    document.body.classList.remove(globalStyles.noScroll);
  };

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
          saleStatus={this.props.isSale}
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
  removeOutOfStockItems = () => {
    this.props.removeOutOfStockItems();
  };

  getFooter() {
    if (this.props.cart) {
      const discountAmount = this.props.cart.offerDiscounts
        .map(discount => {
          return +discount.amount;
        })
        .reduce((partialSum, a) => partialSum + a, 0);

      console.log("CART VALUE", this.props.cart);
      return (
        <div className={styles.bagFooter}>
          <div className={cs(styles.orderSummaryWrapper)}>
            <div className={cs(styles.orderSummary)}>Order Summary</div>

            <div className={styles.subTotalDiscountWrapper}>
              <div
                className={cs(globalStyles.flex, globalStyles.gutterBetween)}
              >
                <div className={cs(styles.subTotalPrice)}>SUBTOTAL</div>

                <h5 className={cs(styles.subTotalPrice)}>
                  {String.fromCharCode(...currencyCodes[this.props.currency])}
                  &nbsp;
                  {parseFloat(this.props.cart.subTotal.toString()).toFixed(2)}
                </h5>
              </div>
              {/* {discountAmount > 0 && ( */}
              <div
                className={cs(
                  globalStyles.flex,
                  globalStyles.gutterBetween,
                  styles.containerCost,
                  styles.discountWrapper
                )}
              >
                <div className={cs(styles.discountPrice)}>EMP Discount</div>
                <div className={globalStyles.textRight}>
                  <h5 className={cs(styles.discountPrice)}>
                    (-)
                    {String.fromCharCode(...currencyCodes[this.props.currency])}
                    &nbsp;
                    {parseFloat(discountAmount.toString()).toFixed(2)}
                  </h5>
                </div>
              </div>
              {/* )} */}
            </div>

            {!this.hasOutOfStockItems() && (
              <div
                className={cs(
                  globalStyles.errorMsg,
                  globalStyles.lineHt10,
                  styles.containerCost,
                  globalStyles.linkTextUnderline,
                  styles.removeOutOfStock
                )}
                onClick={this.removeOutOfStockItems}
              >
                Remove all Items out of stock
              </div>
            )}

            <div className={cs(styles.containerCost, styles.totalAmount)}>
              <div
                className={cs(globalStyles.flex, globalStyles.gutterBetween)}
              >
                <div className={cs(styles.totalPrice, globalStyles.bold)}>
                  TOTAL*
                </div>

                <h5 className={cs(styles.totalPrice, globalStyles.bold)}>
                  {String.fromCharCode(...currencyCodes[this.props.currency])}
                  &nbsp;
                  {parseFloat(this.props.cart.total.toString()).toFixed(2)}
                </h5>
              </div>
              <p className={styles.subtext}>
                *Excluding estimated cost of shipping
              </p>
            </div>
          </div>
          {/* {amount.name && (
            <div
              className={cs(
                globalStyles.flex,
                globalStyles.gutterBetween,
                styles.containerCost
              )}
            >
              <div className={cs(styles.disPrice)}>EMP Discount</div>
              <div className={globalStyles.textRight}>
                <h5 className={cs(styles.disPrice, globalStyles.bold)}>
                  (-)
                  {String.fromCharCode(...currencyCodes[this.props.currency])}
                  &nbsp;
                  {parseFloat(amount.amount?.toString()).toFixed(2)}
                </h5>
              </div>
            </div>
          )}
          {amount.name && <div
            className={cs(
              globalStyles.flex,
              globalStyles.gutterBetween,
              styles.containerCost
            )}
          >
            <div className={cs(styles.totalPrice, globalStyles.bold)}>
              TOTAL
            </div>
            <div className={globalStyles.textRight}>
              <h5 className={cs(styles.totalPrice, globalStyles.bold)}>
                {String.fromCharCode(...currencyCodes[this.props.currency])}
                &nbsp;
                {parseFloat(
                  this.props.cart.amountPayable?.toString() || ""
                ).toFixed(2)}
              </h5>
            </div>
          </div>
          } */}

          <div className={cs(styles.bagFlex)}>
            <Link
              to="/cart"
              className={cs(this.hasOutOfStockItems() && styles.outOfStock)}
            >
              <span className={styles.viewBag}>REVIEW BAG & CHECKOUT</span>
            </Link>
          </div>
        </div>
      );
    }
  }

  resetInfoPopupCookie() {
    const cookieString =
      "checkoutinfopopup3=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    document.cookie = cookieString;
  }

  chkshipping = (event: React.MouseEvent) => {
    // if (window.ischeckout) {
    //     return false;
    // }
    // const self = this;
    const {
      totalWithoutShipping,
      freeShippingThreshold,
      freeShippingApplicable
    } = this.props.cart;
    if (this.state.isSuspended) {
      this.resetInfoPopupCookie();
    }
    if (
      !this.state.freeShipping &&
      totalWithoutShipping &&
      totalWithoutShipping >= freeShippingThreshold &&
      totalWithoutShipping < freeShippingApplicable &&
      this.props.cart.shippable
    ) {
      this.props.showShipping(
        freeShippingApplicable -
          parseInt((totalWithoutShipping || 0).toString()),
        freeShippingApplicable
      );
      event.preventDefault();
    }
  };

  canCheckout = () => {
    // if (pathname.indexOf("checkout") > -1) {
    //   return false;
    // }
    // this.amountLeft = 50000 - this.props.cart.subTotal;
    const {
      totalWithoutShipping,
      freeShippingThreshold,
      freeShippingApplicable
    } = this.props.cart;
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
      totalWithoutShipping &&
      totalWithoutShipping >= freeShippingThreshold &&
      totalWithoutShipping < freeShippingApplicable &&
      this.state.shipping == false &&
      this.props.currency == "INR" &&
      this.props.cart.shippable
    ) {
      this.setState({
        shipping: true
      });
    } else if (
      totalWithoutShipping &&
      (totalWithoutShipping < freeShippingThreshold ||
        totalWithoutShipping >= freeShippingApplicable) &&
      this.state.shipping
    ) {
      this.setState({
        shipping: false
      });
    }
    return true;
  };

  render() {
    const {
      totalWithoutShipping,
      freeShippingThreshold,
      freeShippingApplicable
    } = this.props.cart;
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
            <div className={styles.heading}>
              Mini BAG ({this.props.cart ? this.getItemsCount() : "0"} ITEMS)
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
          <div className={cs(styles.freeShippingInfo, globalStyles.flex)}>
            <div>
              <i
                className={cs(
                  iconStyles.icon,
                  iconStyles.iconWishlist,
                  styles.exclamationFontSize
                )}
              ></i>
            </div>
            <div className={styles.text}>
              Add products worth ₹ 1300 or more to qualify for free shipping.
            </div>
          </div>
          {this.state.shipping &&
          totalWithoutShipping &&
          totalWithoutShipping >= freeShippingThreshold &&
          totalWithoutShipping < freeShippingApplicable &&
          this.props.cart.shippable ? (
            <div className={styles.cart}>
              <div className={cs(styles.message, styles.noMargin)}>
                You&apos; re a step away from{" "}
                <span className={globalStyles.textUnderline}>
                  free shipping
                </span>
                !
                <br /> Select products worth{" "}
                <span>
                  {String.fromCharCode(...currencyCodes[this.props.currency])}{" "}
                  {this.props.cart.freeShippingApplicable -
                    parseInt(this.props.cart.total.toString())}
                </span>{" "}
                or more to your order to qualify.
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
export default connect(mapStateToProps, mapDispatchToProps)(Bag);
