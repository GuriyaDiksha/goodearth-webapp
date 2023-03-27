import React from "react";
// import styles from "./styles.scss";
import styles from "./styles_new.scss";
import cs from "classnames";
import { CartProps, State } from "./typings";
import iconStyles from "../../styles/iconFonts.scss";
import globalStyles from "../../styles/global.scss";
import LineItems from "./Item";
import { Link } from "react-router-dom";
import { currencyCodes } from "constants/currency";
import { Dispatch } from "redux";
import BasketService from "services/basket";
import { connect } from "react-redux";
import { AppState } from "reducers/typings";
import { getPageType } from "../../utils/validate";
import CookieService from "services/cookie";
import { GA_CALLS } from "constants/cookieConsent";
import freeShippingInfoIcon from "../../images/free_shipping_info.svg";
import {
  displayPriceWithCommas,
  displayPriceWithCommasFloat
} from "utils/utility";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
import HeaderService from "services/headerFooter";
import noImagePlp from "../../images/noimageplp.png";
import { currencyCode } from "typings/currency";

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    removeOutOfStockItems: async () => {
      const res = await BasketService.removeOutOfStockItems(dispatch);
      return res;
    },
    fetchFeaturedContent: async () => {
      const res = HeaderService.fetchSearchFeaturedContent(dispatch);
      return res;
    }
  };
};
const mapStateToProps = (state: AppState) => {
  return {
    isSale: state.info.isSale,
    customerGroup: state.user.customerGroup,
    isLoggedIn: state.user.isLoggedIn,
    mobile: state.device.mobile,
    wishlistData: state.wishlist.items,
    tablet: state.device.tablet
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
      isSuspended: true, // for is_covid19
      featureData: []
    };
  }

  componentDidMount = () => {
    document?.body?.classList?.add(globalStyles.noScroll);
    try {
      const skuList = this.props.cart.lineItems?.map(
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
          "Page Type": getPageType(),
          "Login Status": this.props.isLoggedIn ? "logged in" : "logged out",
          "Page referrer url": location.href
        });
      }

      this.props
        .fetchFeaturedContent()
        .then(data => {
          this.setState({
            featureData: data?.widgetImages
          });
        })
        .catch(function(error) {
          console.log(error);
        });
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
      currency,
      mobile,
      wishlistData,
      isLoggedIn,
      tablet
    } = this.props;

    const item = lineItems?.map(item => {
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
      <div className={cs(styles.cart, styles.emptyCart)}>
        {/* {this.renderMessage()} */}
        <div
          className={cs(
            globalStyles.marginT50,
            globalStyles.textCenter,
            // bootstrap.colMd4,
            // bootstrap.offsetMd4,
            {
              // [bootstrap.col10]: !mobile,
              [bootstrap.col12]: mobile
            }
          )}
        >
          <div className={styles.emptyMsg}> Your bag is currently empty </div>
          <div
            className={cs(
              bootstrap.colMd12,
              styles.searchHeading,
              { [styles.searchHeadingMobile]: mobile },
              globalStyles.textCenter
            )}
          >
            <h2 className={globalStyles.voffset5}>
              Looking to discover some ideas?
            </h2>
          </div>
          <div className={cs(bootstrap.col12, globalStyles.voffset3)}>
            <div
              className={cs(
                bootstrap.row,
                styles.noResultPadding,
                styles.checkheight,
                { [styles.checkheightMobile]: mobile },
                styles.cartRow
              )}
            >
              {this.state.featureData.length > 0
                ? this.state.featureData.map((data, i) => {
                    return (
                      <div
                        key={i}
                        className={cs(
                          bootstrap.colLg6,
                          bootstrap.col6,
                          styles.px10
                        )}
                      >
                        <div className={styles.searchImageboxNew}>
                          <Link to={data.ctaUrl}>
                            <img
                              src={
                                data.ctaImage == "" ? noImagePlp : data.ctaImage
                              }
                              // onError={this.addDefaultSrc}
                              alt={data.ctaText}
                              className={styles.imageResultNew}
                            />
                          </Link>
                        </div>
                        <div className={styles.imageContent}>
                          <p className={styles.searchImageTitle}>
                            {data.ctaText}
                          </p>
                          <p className={styles.searchFeature}>
                            <Link to={data.ctaUrl}>{data.title}</Link>
                          </p>
                        </div>
                      </div>
                    );
                  })
                : ""}
            </div>

            {isLoggedIn && wishlistData.length > 0 && (
              <>
                <h6 className={styles.wishlistHead}>From your Wishlist</h6>
                <p className={styles.wishlistSubHead}>
                  There’s more waiting for you in your Wishlist
                </p>

                <div className={cs(bootstrap.col12, globalStyles.marginT20)}>
                  <div
                    className={cs(
                      bootstrap.row,
                      styles.noResultPadding,
                      styles.checkheight,
                      { [styles.checkheightMobile]: mobile },
                      styles.cartRow
                    )}
                  >
                    {wishlistData.length > 0
                      ? wishlistData?.slice(0, 5)?.map((data, i) => {
                          return (
                            <div
                              key={i}
                              className={cs(bootstrap.colLg6, bootstrap.col6)}
                            >
                              <div
                                className={cs(styles.searchImageboxNew, {
                                  [styles.viewAllMobileWrapper]: i == 4
                                })}
                              >
                                <Link
                                  to={i < 4 ? data.productUrl : "/wishlist"}
                                >
                                  <img
                                    src={
                                      data.productImage == ""
                                        ? noImagePlp
                                        : data.productImage
                                    }
                                    // onError={this.addDefaultSrc}
                                    alt={data.productName}
                                    className={styles.imageResultNew}
                                  />
                                  {i == 4 && (
                                    <span className={cs(styles.viewAllMobile)}>
                                      VIEW ALL
                                    </span>
                                  )}
                                </Link>
                              </div>
                              {i < 4 && (
                                <div className={styles.imageContent}>
                                  {/* <p className={styles.searchImageTitle}>
                              {data.productName}
                            </p> */}
                                  <p className={styles.searchFeature}>
                                    <Link to={data.productUrl}>
                                      {data.productName}
                                    </Link>
                                  </p>
                                  <p className={styles.searchFeature}>
                                    <Link to={data.productUrl}>
                                      {String.fromCharCode(
                                        ...currencyCode[this.props.currency]
                                      ) +
                                        " " +
                                        data.price[currency]}
                                    </Link>
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        })
                      : ""}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
  removeOutOfStockItems = () => {
    this.props.removeOutOfStockItems();
  };

  getFooter() {
    if (this.props.cart) {
      const discountAmount = this.props.cart?.offerDiscounts
        ?.map(discount => {
          return +discount.amount;
        })
        .reduce((partialSum, a) => partialSum + a, 0);

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
                  {displayPriceWithCommasFloat(
                    this.props.cart.subTotal,
                    this.props.currency
                  )}
                </h5>
              </div>
              {this.props.isLoggedIn &&
                this.props.currency == "INR" &&
                this.props.customerGroup.includes("employee") && (
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
                        {String.fromCharCode(
                          ...currencyCodes[this.props.currency]
                        )}
                        &nbsp;
                        {displayPriceWithCommasFloat(
                          discountAmount,
                          this.props.currency
                        )}
                      </h5>
                    </div>
                  </div>
                )}
            </div>

            {this.hasOutOfStockItems() && (
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
                  {displayPriceWithCommasFloat(
                    this.props.cart.total,
                    this.props.currency
                  )}
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
          {this.canCheckout() && (
            <div className={cs(styles.bagFlex)}>
              <Link
                to="/cart"
                className={cs(this.hasOutOfStockItems() && styles.outOfStock)}
              >
                <span className={styles.viewBag}>REVIEW BAG & CHECKOUT</span>
              </Link>
            </div>
          )}
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
          {this.state.shipping &&
          totalWithoutShipping &&
          totalWithoutShipping >= freeShippingThreshold &&
          totalWithoutShipping < freeShippingApplicable &&
          this.props.cart.shippable ? (
            <div className={cs(styles.freeShippingInfo, globalStyles.flex)}>
              <div>
                <img src={freeShippingInfoIcon} alt="free-shipping" />
              </div>

              <div className={styles.text}>
                Add products worth{" "}
                {String.fromCharCode(...currencyCodes[this.props.currency])}{" "}
                {displayPriceWithCommas(
                  this.props.cart.freeShippingApplicable -
                    parseInt(this.props.cart.total.toString()),
                  this.props.currency
                )}
                or more to qualify for free shipping.
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
