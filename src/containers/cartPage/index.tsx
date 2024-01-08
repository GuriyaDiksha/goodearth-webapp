import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import initActionCollection from "./initAction";
import cs from "classnames";
import { AppState } from "reducers/typings";
import { connect } from "react-redux";
import styles from "./styles.scss";
import globalStyles from "styles/global.scss";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
import CartItems from "./cartItem";
import OrderSummary from "containers/checkout/component/orderSummary";
import { Link } from "react-router-dom";
import { Dispatch } from "redux";
import WishlistService from "services/wishlist";
import { updateBasket } from "actions/basket";
import BasketService from "services/basket";
import { ProductID } from "typings/id";
import {
  showGrowlMessage,
  pageViewGTM,
  getPageType
} from "../../utils/validate";
import { WidgetImage } from "components/header/typings";
import HeaderService from "services/headerFooter";
import LoginService from "services/login";
import noImagePlp from "../../images/noimageplp.png";
import { updateComponent, updateModal } from "actions/modal";
import { POPUP } from "constants/components";
import CookieService from "services/cookie";
import { Currency } from "typings/currency";
import { updateLoader, updateNextUrl } from "actions/info";
import { StaticContext } from "react-router";
import Loader from "components/Loader";
import { GA_CALLS } from "constants/cookieConsent";
import Button from "components/Button";
import { displayPriceWithCommas } from "utils/utility";

const mapStateToProps = (state: AppState) => {
  return {
    currency: state.currency,
    mobile: state.device.mobile,
    tablet: state.device.tablet,
    cart: state.basket,
    isSale: state.info.isSale,
    location: state.router.location,
    isLoggedIn: state.user.isLoggedIn,
    wishlistData: state.wishlist.items,
    user: state.user,
    isLoading: state.info.isLoading,
    showTimer: state.info.showTimer
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    showNotify: (message: string) => {
      showGrowlMessage(dispatch, message, 6000);
    },
    undoMoveToWishlist: async () => {
      const res = await WishlistService.undoMoveToWishlist(dispatch);
      dispatch(updateBasket(res.basket));
      // BasketService.fetchBasket(dispatch, true);
      return res;
    },
    fetchBasket: async () => {
      return await BasketService.fetchBasket(dispatch, "cart");
    },
    deleteBasket: async (basketLineId: ProductID) => {
      const res = await BasketService.deleteBasket(
        dispatch,
        basketLineId,
        "cart"
      );
      dispatch(updateModal(false));
      return res;
    },
    fetchFeaturedContent: async () => {
      const res = HeaderService.fetchSearchFeaturedContent(dispatch);
      return res;
    },
    changeModalState: () => {
      dispatch(updateModal(false));
    },
    openPopup: () => {
      dispatch(updateComponent(POPUP.MAKER, null));
      dispatch(updateModal(true));
    },
    showLoader: () => {
      dispatch(updateLoader(true));
    },
    moveToWishListMsg: (onUndoWishlistClick: any) => {
      const msg = (
        <div>
          Your item has been moved to saved items.&nbsp;&nbsp;
          <span
            className={cs(globalStyles.linkTextUnderline, globalStyles.pointer)}
            onClick={() => {
              onUndoWishlistClick();
              // const userConsent = CookieService.getCookie("consent").split(",");
              // if (userConsent.includes(GA_CALLS)) {
              //   dataLayer.push({
              //     event: "edit_mini_bag_interactions",
              //     click_type: "Save for later"
              //   });
              // }
            }}
          >
            Undo
          </span>
        </div>
      );

      const userConsent = CookieService.getCookie("consent").split(",");
      if (userConsent.includes(GA_CALLS)) {
        dataLayer.push({
          event: "edit_mini_bag_interactions",
          click_type: "Save for later"
        });
      }
      showGrowlMessage(dispatch, msg, 18000);
    },
    goLogin: (event?: React.MouseEvent, nextUrl?: string) => {
      LoginService.showLogin(dispatch);
      nextUrl && dispatch(updateNextUrl(nextUrl));
      event?.preventDefault();
    },
    // getBoDetail: async (id: string) => {
    //   return await CheckoutService.getBoDetail(dispatch, id);
    // },
    logout: async (currency: Currency, customerGroup: string) => {
      return await LoginService.logout(
        dispatch,
        currency,
        customerGroup,
        "cart"
      );
    }
  };
};

type Props = RouteComponentProps<{}, StaticContext, { from: string }> &
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

type State = {
  catLanding: boolean;
  show: boolean;
  showbottom: boolean;
  isSale: boolean;
  showUndoWishlist: boolean;
  showNotifyMessage: boolean;
  featureData: WidgetImage[];
  newLoading: boolean;
};
class CartPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      catLanding: false,
      show: false,
      showbottom: false,
      isSale: false,
      showUndoWishlist: false,
      showNotifyMessage: false,
      featureData: [],
      newLoading: true
    };
  }

  componentDidMount() {
    // const queryString = this.props.location.search;
    // const urlParams = new URLSearchParams(queryString);
    // const boId = urlParams.get("bo_id");

    // if (boId) {
    //   this.props
    //     .getBoDetail(boId)
    //     .then((data: any) => {
    //       localStorage.setItem("tempEmail", data.email);
    //       if (this.props.user.email && data.isLogin) {
    //         CookieService.setCookie("currency", data.currency, 365);
    //         CookieService.setCookie("currencypopup", "true", 365);
    //         this.setState({ newLoading: false });
    //         this.props
    //           .logout(this.props.currency, this.props.user.customerGroup)
    //           .then(res => {
    //             localStorage.setItem("tempEmail", data.email);
    //             this.props.goLogin(undefined, "/order/checkout");
    //             // this.setState({
    //             //   boEmail: data.email,
    //             //   boId: boId
    //             // });
    //           });
    //       } else if (data.email) {
    //         CookieService.setCookie("currency", data.currency, 365);
    //         CookieService.setCookie("currencypopup", "true", 365);
    //         localStorage.setItem("tempEmail", data.email);
    //         this.props.goLogin(undefined, "/order/checkout");
    //       } else {
    //         this.props.history.push("/backend-order-error");
    //       }
    //     })
    //     .catch(error => {
    //       this.props.history.push("/backend-order-error");
    //     });
    // }

    if (this.props.history.location.state?.from == "checkout") {
      if (!this.props.isLoggedIn) {
        this.props.goLogin(undefined, "/order/checkout");
      }
    }
    pageViewGTM("Cart");
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
          "Page Type": getPageType(),
          "Login Status": this.props.isLoggedIn ? "logged in" : "logged out",
          "Page referrer url": CookieService.getCookie("prevUrl") || ""
        });
      }
    } catch (err) {
      console.log(err);
    }
    this.props.fetchBasket().finally(() => {
      this.setState({ newLoading: false });
    });
    const popupCookie = CookieService.getCookie("showCartPagePopup");
    if (popupCookie) {
      this.props.openPopup();
    }
    this.props
      .fetchFeaturedContent()
      .then(data => {
        this.setState({
          featureData: data.widgetImages
        });
      })
      .catch(function(error) {
        console.log(error);
      });

    const userConsent = CookieService.getCookie("consent").split(",");
    const search = CookieService.getCookie("search") || "";

    if (userConsent.includes(GA_CALLS)) {
      const items = this.props.cart.lineItems.map((line, ind) => {
        const index = line?.product.categories
          ? line?.product.categories.length - 1
          : 0;
        const category =
          line?.product.categories && line?.product.categories[index]
            ? line?.product.categories[index].replace(/\s/g, "")
            : "";
        // const arr = category.split(">");
        return {
          item_id: line?.product?.id, //Pass the product id
          item_name: line?.product?.title, // Pass the product name
          affiliation: line?.product?.title, // Pass the product name
          coupon: "NA", // Pass the coupon if available
          currency: this.props.currency, // Pass the currency code
          discount: "NA", // Pass the discount amount
          index: ind,
          item_brand: "Goodearth",
          item_category: category?.split(">")?.join("/"),
          item_category2: line.product?.childAttributes[0]?.size,
          item_category3: line.product.is3d ? "3d" : "non3d",
          item_category4: line.product.is3d ? "YES" : "NO",
          item_list_id: "NA",
          item_list_name: search ? search : "NA",
          item_variant: "NA",
          // item_category5: line?.product?.collection,
          price: line?.product?.priceRecords[this.props.currency],
          quantity: line?.quantity,
          collection_category: line?.product?.collections?.join("|")
        };
      });
      dataLayer.push(function(this: any) {
        this.reset();
      });
      dataLayer.push({
        event: "CartPageView",
        PageURL: this.props.location.pathname,
        Page_Title: "virtual_cartPage_view"
      });
      dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
      dataLayer.push({
        event: "view_cart",
        previous_page_url: CookieService.getCookie("prevUrl"),
        ecommerce: {
          currency: this.props.currency, // Pass the currency code
          value: this.props.cart.total,
          items: items
        }
      });
    }

    if (userConsent.includes(GA_CALLS)) {
      Moengage.track_event("Page viewed", {
        "Page URL": this.props.location.pathname,
        "Page Name": "CartPageView"
      });
    }

    // setTimeout(() => {
    //   window.scrollTo({
    //     top: 0,
    //     behavior: "smooth"
    //   });
    // }, 800);
  }

  onNotifyCart = (basketLineId: ProductID) => {
    this.props.deleteBasket(basketLineId).then(res => {
      this.setState({
        showNotifyMessage: true
      });
    });
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

  onUndoWishlistClick = () => {
    // var self = this;
    this.props.undoMoveToWishlist().then(data => {
      this.setState({
        showUndoWishlist: false
      });
      // if (this.props.getShippingCharges) {
      //     this.props.getShippingCharges();
      // }
      // CheckoutApi.reCalculateGift({}, this.props.dispatch)
    });
  };

  onMoveToWishlist = () => {
    this.props.moveToWishListMsg(this.onUndoWishlistClick);
    this.setState({
      showUndoWishlist: true,
      showNotifyMessage: false
    });
  };

  getItems() {
    const {
      cart: { lineItems },
      currency,
      mobile,
      tablet,
      isLoggedIn,
      wishlistData
    } = this.props;

    const emptyCartContent = (
      <div className={cs(styles.cart, styles.emptyCart)}>
        {/* {this.renderMessage()} */}
        <div
          className={cs(
            globalStyles.textCenter,
            // bootstrap.colMd4,
            // bootstrap.offsetMd4,
            {
              // [bootstrap.col10]: !mobile,
              [bootstrap.col12]: mobile,
              [globalStyles.marginT50]: !mobile
            }
          )}
        >
          {((mobile && (!isLoggedIn || wishlistData.length === 0)) ||
            !mobile) && (
            <>
              <div className={styles.emptyMsg}>
                {" "}
                Your bag is currently empty{" "}
              </div>
              <div
                className={cs(
                  bootstrap.colMd12,
                  styles.searchHeading,
                  { [styles.searchHeadingMobile]: mobile },
                  globalStyles.textCenter
                )}
              >
                <h2
                  className={cs(globalStyles.voffset5, globalStyles.marginB10)}
                >
                  Looking to discover some ideas?
                </h2>
              </div>
            </>
          )}
          <div
            className={cs(globalStyles.voffset3, globalStyles.marginAuto, {
              [bootstrap.col10]:
                mobile && (!wishlistData.length || !isLoggedIn),
              [bootstrap.col12]: isLoggedIn && wishlistData.length
            })}
          >
            {((mobile && (!isLoggedIn || wishlistData.length === 0)) ||
              !mobile) && (
              <div className={bootstrap.row}>
                <div
                  className={cs(
                    bootstrap.colMd12,
                    bootstrap.col12,
                    styles.noResultPadding,
                    styles.checkheight,
                    {
                      // [styles.checkheightMobile]: mobile,
                      [styles.wishlistWrap]: wishlistData.length && isLoggedIn
                    }
                  )}
                >
                  {this.state.featureData.length > 0
                    ? this.state.featureData.map((data, i) => {
                        return (
                          <div
                            key={i}
                            className={cs(
                              bootstrap.colLg3,
                              styles.px10,
                              bootstrap.col5
                            )}
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
                </div>
              </div>
            )}

            {isLoggedIn && wishlistData.length > 0 && (
              <>
                <h6 className={styles.wishlistHead}>From your Wishlist</h6>
                <p className={styles.wishlistSubHead}>
                  There’s more waiting for you in your Wishlist
                </p>
                {!mobile && (
                  <Link className={styles.viewAll} to="/wishlist">
                    VIEW ALL
                  </Link>
                )}
                <div
                  className={cs(
                    bootstrap.col12,
                    globalStyles.marginT20,
                    globalStyles.marginB20
                  )}
                >
                  <div
                    className={cs(
                      bootstrap.row,
                      styles.noResultPadding,
                      styles.wishlistWrap,
                      { [styles.checkheight]: !mobile }
                    )}
                  >
                    {wishlistData.length > 0 && !mobile
                      ? wishlistData?.slice(0, 4)?.map((data, i) => {
                          return (
                            <div
                              key={i}
                              className={cs(
                                bootstrap.colLg3,
                                bootstrap.col5,
                                styles.px10
                              )}
                            >
                              <div className={styles.searchImageboxNew}>
                                {data?.salesBadgeImage && (
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
                                <Link to={data.productUrl}>
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
                                </Link>
                              </div>
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
                                    {this.props?.isSale && data.discount ? (
                                      <span className={styles.discountprice}>
                                        {data.discountedPrice
                                          ? displayPriceWithCommas(
                                              data.discountedPrice[currency],
                                              currency
                                            )
                                          : ""}{" "}
                                        &nbsp;{" "}
                                      </span>
                                    ) : (
                                      ""
                                    )}
                                    {this.props?.isSale && data.discount ? (
                                      <span className={styles.strikeprice}>
                                        {displayPriceWithCommas(
                                          data.price[currency],
                                          currency
                                        )}
                                      </span>
                                    ) : (
                                      <span
                                        className={
                                          data.badgeType == "B_flat"
                                            ? styles.discountprice
                                            : ""
                                        }
                                      >
                                        {displayPriceWithCommas(
                                          data.price[currency],
                                          currency
                                        )}
                                      </span>
                                    )}
                                  </Link>
                                </p>
                              </div>
                            </div>
                          );
                        })
                      : wishlistData.length > 0 && mobile
                      ? [...wishlistData?.slice(0, 5), wishlistData[0]]?.map(
                          (data, i) => {
                            return (
                              <div
                                key={i}
                                className={cs(
                                  bootstrap.colLg6,
                                  bootstrap.col6,
                                  styles.px10
                                )}
                              >
                                <div
                                  className={cs(styles.searchImageboxNew, {
                                    [styles.viewAllMobileWrapper]:
                                      i === wishlistData.length
                                  })}
                                >
                                  {data?.salesBadgeImage && (
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
                                  <Link
                                    to={
                                      i === wishlistData.length
                                        ? "/wishlist"
                                        : data.productUrl
                                    }
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
                                    {i === wishlistData.length && (
                                      <span
                                        className={cs(styles.viewAllMobile)}
                                      >
                                        VIEW ALL
                                      </span>
                                    )}
                                  </Link>
                                </div>
                                {i < wishlistData.length && (
                                  <div className={styles.imageContent}>
                                    <p className={styles.searchFeature}>
                                      <Link to={data.productUrl}>
                                        {data.productName}
                                      </Link>
                                    </p>
                                    <p className={styles.searchFeature}>
                                      <Link to={data.productUrl}>
                                        {this.props?.isSale && data.discount ? (
                                          <span
                                            className={styles.discountprice}
                                          >
                                            {data.discountedPrice
                                              ? displayPriceWithCommas(
                                                  data.discountedPrice[
                                                    currency
                                                  ],
                                                  currency
                                                )
                                              : ""}{" "}
                                            &nbsp;{" "}
                                          </span>
                                        ) : (
                                          ""
                                        )}
                                        {this.props?.isSale && data.discount ? (
                                          <span className={styles.strikeprice}>
                                            {displayPriceWithCommas(
                                              data.price[currency],
                                              currency
                                            )}
                                          </span>
                                        ) : (
                                          <span
                                            className={
                                              data.badgeType == "B_flat"
                                                ? styles.discountprice
                                                : ""
                                            }
                                          >
                                            {displayPriceWithCommas(
                                              data.price[currency],
                                              currency
                                            )}
                                          </span>
                                        )}
                                      </Link>
                                    </p>
                                  </div>
                                )}
                              </div>
                            );
                          }
                        )
                      : ""}
                    {/* {mobile && wishlistData.length > 0 && (
                      <Link
                        className={cs(styles.viewAllMobile)}
                        to="/wishlist"
                      ></Link>
                    )} */}
                  </div>
                </div>
              </>
            )}

            {mobile || tablet ? (
              ""
            ) : (
              <div className={bootstrap.row}>
                <div className={cs(bootstrap.colMd12, bootstrap.col12)}>
                  <div className={cs(styles.searchBottomBlockSecond)}>
                    <div className=" text-center"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {mobile && (
          <div className={styles.continueShoppingBtnWrapper}>
            <Button
              variant="largeMedCharcoalCta"
              className={cs(
                styles.continueShoppingBtn,
                globalStyles.btnFullWidth
              )}
              label={"Continue Shopping"}
              onClick={() => {
                this.props.history.push("/");
              }}
            />
          </div>
        )}
      </div>
    );
    const item = lineItems.map(item => {
      return (
        <CartItems
          onNotifyCart={this.onNotifyCart}
          mobile={this.props.mobile}
          tablet={this.props.tablet}
          key={item.id}
          {...item}
          id={item.id}
          currency={currency}
          saleStatus={this.props.isSale}
          onMoveToWishlist={this.onMoveToWishlist}
        />
      );
    });
    return item.length > 0
      ? item
      : // <p className={cs(globalStyles.marginT20, globalStyles.textCenter)}>
        //   No items added to bag.
        // </p>
        emptyCartContent;
  }

  goToCart() {
    // history.push("/cart")
  }

  canCheckout = () => {
    return true;
  };

  renderMessage() {
    if (this.state.showUndoWishlist) {
      return (
        <div className={styles.message}>
          Your item has been moved to saved items.{" "}
          <span
            className={cs(globalStyles.colorPrimary, globalStyles.pointer)}
            onClick={this.onUndoWishlistClick}
          >
            Undo
          </span>
        </div>
      );
    }

    if (this.state.showNotifyMessage) {
      return (
        <div className={styles.message}>
          We’ll notify you once we have it back in stock. Your item has been
          removed.
        </div>
      );
    }

    if (this.props.cart ? this.props.cart.updated : false) {
      return (
        <div className={styles.message}>
          Quantity of some items have been updated.
        </div>
      );
    }

    // if(this.props.cart?this.props.unpublish:false) {
    //      return (
    //         <div className={styles.message}>
    //             Due to unavailability of some products your cart has been updated.
    //         </div>
    //     )
    // }

    return null;
  }

  render() {
    const {
      totalWithoutShipping,
      freeShippingThreshold,
      freeShippingApplicable,
      shippable
    } = this.props.cart;
    const { showTimer } = this.props;
    return (
      <div
        className={cs(bootstrap.row, styles.pageBody, {
          [styles.timerHeight]: showTimer
        })}
      >
        <div
          className={cs(
            bootstrap.col12,
            bootstrap.colLg8,
            styles.bagContents,
            styles.pUnset,
            {
              [globalStyles.marginT30]:
                this.props.mobile &&
                totalWithoutShipping &&
                totalWithoutShipping >= freeShippingThreshold &&
                totalWithoutShipping < freeShippingApplicable &&
                shippable
            }
          )}
        >
          {this.getItemsCount() === 0 || this.props.mobile ? null : (
            <div className={cs(styles.header)}>
              <p>MY SHOPPING BAG ({this.getItemsCount()})</p>
            </div>
          )}
          {/* {this.renderMessage()} */}
          {this.state.newLoading && <Loader />}
          {this.getItems()}
        </div>

        <div
          className={cs(
            bootstrap.col12,
            bootstrap.colLg4,
            globalStyles.padd0,
            styles.pUnset
          )}
        >
          <OrderSummary
            mobile={this.props.mobile}
            tablet={this.props.tablet}
            currency={this.props.currency}
            shippingAddress={{}}
            salestatus={this.props.isSale}
            validbo={false}
            basket={this.props.cart}
            page="cart"
            goLogin={this.props.goLogin}
          />
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CartPage));
export { initActionCollection };
