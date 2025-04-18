import React, { RefObject } from "react";
import styles from "./styles_new.scss";
import cs from "classnames";
import { CartProps, State } from "./typings";
import iconStyles from "../../styles/iconFonts.scss";
import globalStyles from "../../styles/global.scss";
import LineItems from "./Item";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
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
import Button from "components/Button";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
import HeaderService from "services/headerFooter";
import noImagePlp from "../../images/noimageplp.png";
import WishlistService from "services/wishlist";
import Slider from "react-slick";
import "./index.css";

const settings = {
  dots: false,
  arrows: true,
  infinite: true,
  speed: 500,
  slidesToShow: 2,
  centerMode: true
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    removeOutOfStockItems: async () => {
      const res = await BasketService.removeOutOfStockItems(dispatch);
      return res;
    },
    fetchFeaturedContent: async () => {
      const res = HeaderService.fetchSearchFeaturedContent(dispatch);
      return res;
    },
    updateWishlist: async () => {
      await WishlistService.updateWishlist(dispatch);
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
  ReturnType<typeof mapStateToProps> &
  RouteComponentProps;
class Bag extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      stockError: "",
      shipping: false,
      value: 1,
      freeShipping: false, // for all_free_shipping_india
      isSuspended: true, // for is_covid19
      featureData: [],
      mouseDown: false,
      startX: 0,
      scrollLeft: 0
    };
  }

  sliderRef: RefObject<HTMLDivElement> = React.createRef();

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

      // this.props.updateWishlist();

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

  startDragging = (e: any) => {
    this.setState({
      mouseDown: true,
      startX: e.pageX - (this.sliderRef?.current?.offsetLeft || 3),
      scrollLeft: this.sliderRef?.current?.scrollLeft || 0
    });
  };

  stopDragging = (e: any) => {
    this.setState({ mouseDown: false });
  };

  move = (e: any) => {
    e.preventDefault();
    const { mouseDown, startX, scrollLeft } = this.state;

    if (!mouseDown) {
      return;
    }
    const x = e.pageX - (this.sliderRef?.current?.offsetLeft || 3);
    const scroll = x - startX;
    if (this.sliderRef?.current !== null) {
      this.sliderRef.current.scrollLeft = scrollLeft - scroll;
    }
  };

  getItems() {
    const {
      cart: { lineItems },
      currency,
      mobile,
      wishlistData,
      isLoggedIn
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
        <div
          className={cs(globalStyles.textCenter, {
            [bootstrap.col12]: mobile,
            [globalStyles.marginT50]: !mobile
          })}
        >
          <>
            <div className={styles.emptyMsg}> Your bag is currently empty </div>
            <div
              className={cs(
                bootstrap.colMd12,
                styles.searchHeading,
                globalStyles.textCenter
              )}
            >
              <h2 className={cs(globalStyles.voffset5, globalStyles.marginB30)}>
                Looking to discover some ideas?
              </h2>
            </div>
          </>

          <div className={cs(globalStyles.voffset3, bootstrap.col12)}>
            <div className={cs("EmptyCartSlider")}>
              <Slider {...settings}>
                {" "}
                {this.state.featureData.length > 0
                  ? this.state.featureData.map((data, i) => {
                      return (
                        <div
                          key={i}
                          className={
                            cs()
                            // styles.px5,  {
                            // [globalStyles.marginL30]: i === 0,
                            // [globalStyles.marginR30]:
                            //   i === this.state.featureData?.length - 1
                            // }
                          }
                        >
                          <div className={styles.searchImageboxNew}>
                            <Link to={data.ctaUrl}>
                              <img
                                src={
                                  data.ctaImage == ""
                                    ? noImagePlp
                                    : data.ctaImage
                                }
                                // onError={this.addDefaultSrc}
                                alt={data.ctaText}
                                className={styles.imageResultNew}
                              />
                            </Link>
                          </div>
                          <div className={cs(styles.imageContent)}>
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
              </Slider>
            </div>

            {isLoggedIn && wishlistData[0]?.products?.length > 0 && (
              <>
                <h6 className={styles.wishlistHead}>From your Saved List</h6>
                <p className={styles.wishlistSubHead}>
                  There’s more waiting for you in your{" "}
                  <Link
                    className={styles.viewAll}
                    to="/wishlist"
                    onClick={(): void => {
                      this.props.toggleBag();
                    }}
                  >
                    Default Saved List
                  </Link>
                </p>

                <div
                  className={cs(
                    bootstrap.col12,
                    globalStyles.marginT20,
                    globalStyles.marginB40,
                    { [globalStyles.marginB60]: mobile }
                  )}
                >
                  <div
                    className={cs(
                      bootstrap.row,
                      globalStyles.flexGutterStart,
                      styles.mobileConatinerBag
                    )}
                  >
                    {wishlistData[0]?.products?.length > 0 &&
                      wishlistData[0]?.products?.slice(0, 8)?.map((data, i) => {
                        return (
                          <div key={i} className={cs(bootstrap.col5)}>
                            <div
                              className={cs(styles.searchImageboxNew, {
                                [styles.viewAllTile]: i === 7
                              })}
                            >
                              {data?.salesBadgeImage && i < 7 && (
                                <div
                                  className={cs(
                                    {
                                      [styles.badgePositionPlpMobile]: mobile
                                    },
                                    {
                                      [styles.badgePositionPlp]: !mobile
                                    }
                                  )}
                                >
                                  <img src={data.salesBadgeImage} />
                                </div>
                              )}
                              {i < 7 ? (
                                <Link to={data.productUrl}>
                                  <img
                                    src={
                                      data.productImage == ""
                                        ? noImagePlp
                                        : data.productImage
                                    }
                                    alt={data.productName}
                                    className={styles.imageResultNew}
                                  />
                                </Link>
                              ) : (
                                <Link
                                  to={"/wishlist"}
                                  onClick={(): void => {
                                    this.props.toggleBag();
                                  }}
                                >
                                  VIEW ALL
                                </Link>
                              )}
                            </div>
                            {i < 7 && (
                              <div className={styles.imageContent}>
                                <p
                                  className={cs(
                                    styles.searchFeature,
                                    styles.wishlistConetent
                                  )}
                                >
                                  <Link to={data.productUrl}>
                                    {data.productName}
                                  </Link>
                                </p>
                                <p className={styles.searchFeature}>
                                  <Link to={data.productUrl}>
                                    {this.props?.isSale && data.discount ? (
                                      <p className={styles.discountprice}>
                                        {data.discountedPrice
                                          ? displayPriceWithCommas(
                                              data.discountedPrice[currency],
                                              currency,
                                              true,
                                              false
                                            )
                                          : ""}
                                      </p>
                                    ) : (
                                      ""
                                    )}
                                    {this.props?.isSale && data.discount ? (
                                      <p className={styles.strikeprice}>
                                        {displayPriceWithCommas(
                                          data.price[currency],
                                          currency,
                                          true,
                                          false
                                        )}
                                      </p>
                                    ) : (
                                      <p
                                        className={
                                          data.badgeType == "B_flat"
                                            ? styles.discountprice
                                            : ""
                                        }
                                      >
                                        {displayPriceWithCommas(
                                          data.price[currency],
                                          currency,
                                          true,
                                          false
                                        )}
                                      </p>
                                    )}
                                  </Link>
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
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

  getDiscount = (data: any) => {
    return data.length > 0
      ? data.map((discount: any, index: number) => (
          <div
            key={index}
            className={cs(
              globalStyles.flex,
              globalStyles.gutterBetween,
              styles.containerCost,
              styles.discountWrapper
            )}
          >
            <div className={cs(styles.discountPrice)}>{discount?.name}</div>
            <div className={globalStyles.textRight}>
              <h5 className={cs(styles.discountPrice)}>
                (-)
                {displayPriceWithCommasFloat(
                  discount?.amount,
                  this.props.currency,
                  true,
                  false
                )}
              </h5>
            </div>
          </div>
        ))
      : "";
  };

  getFooter() {
    if (this.props.cart) {
      return (
        <div className={styles.bagFooter}>
          {this.canCheckout() && (
            <div className={cs(styles.orderSummaryWrapper)}>
              <div className={cs(styles.orderSummary)}>Order Summary</div>

              <div className={styles.subTotalDiscountWrapper}>
                <div
                  className={cs(globalStyles.flex, globalStyles.gutterBetween)}
                >
                  <div className={cs(styles.subTotalPrice)}>SUBTOTAL</div>

                  <h5 className={cs(styles.subTotalPrice)}>
                    {displayPriceWithCommasFloat(
                      this.props.cart.subTotal,
                      this.props.currency,
                      true,
                      false
                    )}
                  </h5>
                </div>

                {this.getDiscount(this.props.cart?.offerDiscounts)}
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
                    {displayPriceWithCommasFloat(
                      this.props.cart.total,
                      this.props.currency,
                      true,
                      false
                    )}
                  </h5>
                </div>
                <p className={styles.subtext}>
                  *Excluding estimated cost of shipping
                </p>
              </div>
            </div>
          )}

          {this.canCheckout() ? (
            <div className={cs(styles.bagFlex)}>
              <Button
                variant="largeAquaCta"
                // to={!this.hasOutOfStockItems() ? "/cart" : ""}
                // className={cs(this.hasOutOfStockItems() && styles.outOfStock)}
                disabled={this.hasOutOfStockItems()}
                onClick={e => {
                  this.hasOutOfStockItems()
                    ? e.preventDefault()
                    : this.props.toggleBag();
                  const userConsent = CookieService.getCookie("consent").split(
                    ","
                  );
                  if (!this.hasOutOfStockItems()) {
                    this.props.history.push("/cart");
                  }
                  if (userConsent.includes(GA_CALLS)) {
                    dataLayer.push({
                      event: "review_bag_and_checkout"
                    });
                  }
                }}
                label={"REVIEW BAG & CHECKOUT"}
              />
              {/* <span className={styles.viewBag}></span> */}
              {/* </Link> */}
            </div>
          ) : (
            <div className={cs(styles.bagFlex, styles.continue)}>
              <Button
                label={"CONTINUE SHOPPING"}
                variant="largeMedCharcoalCta"
                onClick={e => {
                  this.props.history.push("/");
                  this.props.toggleBag();
                }}
              />
              {/* <span className={styles.viewBag}></span> */}
              {/* </Link> */}
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
    const {
      totalWithoutShipping,
      freeShippingThreshold,
      freeShippingApplicable
    } = this.props.cart;
    if (
      !this.props.cart.lineItems ||
      // this.hasOutOfStockItems() ||
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
    const { showProductWorth, productWorthValue } = this.props.cart;
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

          {showProductWorth ? (
            <div className={cs(styles.freeShippingInfo, globalStyles.flex)}>
              <div className={styles.freeShipImg}>
                <img
                  src={freeShippingInfoIcon}
                  alt="free-shipping"
                  width="200"
                />
              </div>

              <div className={styles.text}>
                Add products worth{" "}
                {displayPriceWithCommas(
                  parseFloat(productWorthValue?.toString() || ""),
                  this.props.currency,
                  true,
                  false
                )}
                &nbsp;or more to qualify for free shipping.
              </div>
            </div>
          ) : (
            ""
          )}
          <div
            className={cs(styles.bagContents, {
              [styles.emptyBagContent]: this.props.cart.lineItems?.length == 0
            })}
          >
            {this.getItems()}
          </div>
          {this.getFooter()}
        </div>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Bag));
