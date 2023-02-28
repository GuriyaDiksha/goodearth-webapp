import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
// import { Link } from "react-router-dom";
import initActionCollection from "./initAction";
import cs from "classnames";
import { AppState } from "reducers/typings";
import { connect } from "react-redux";
import styles from "./styles.scss";
import globalStyles from "styles/global.scss";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
import CartItems from "./cartItem";
import OrderSummary from "containers/checkout/component/orderSummary";
// import motifTigerTree from "../../images/motifTigerTree.png";
import { Link } from "react-router-dom";
import { Dispatch } from "redux";
import WishlistService from "services/wishlist";
import { updateBasket } from "actions/basket";
import BasketService from "services/basket";
import { ProductID } from "typings/id";
import * as util from "../../utils/validate";
import { WidgetImage } from "components/header/typings";
import HeaderService from "services/headerFooter";
import LoginService from "services/login";
import noImagePlp from "../../images/noimageplp.png";
import { updateComponent, updateModal } from "actions/modal";
import { POPUP } from "constants/components";
import CookieService from "services/cookie";
import { GA_CALLS, ANY_ADS } from "constants/cookieConsent";
import { currencyCode } from "typings/currency";
import { updateNextUrl } from "actions/info";
import { StaticContext } from "react-router";

const mapStateToProps = (state: AppState) => {
  return {
    currency: state.currency,
    mobile: state.device.mobile,
    tablet: state.device.tablet,
    cart: state.basket,
    isSale: state.info.isSale,
    location: state.router.location,
    isLoggedIn: state.user.isLoggedIn,
    wishlistData: state.wishlist.items
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    showNotify: (message: string) => {
      util.showGrowlMessage(dispatch, message, 6000);
    },
    undoMoveToWishlist: async () => {
      const res = await WishlistService.undoMoveToWishlist(dispatch);
      dispatch(updateBasket(res.basket));
      // BasketService.fetchBasket(dispatch, true);
      return res;
    },
    fetchBasket: () => {
      BasketService.fetchBasket(dispatch, "cart");
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
    moveToWishListMsg: (onUndoWishlistClick: any) => {
      const msg = (
        <div>
          Your item has been moved to saved items.&nbsp;&nbsp;
          <span
            className={cs(globalStyles.linkTextUnderline, globalStyles.pointer)}
            onClick={() => onUndoWishlistClick()}
          >
            Undo
          </span>
        </div>
      );
      util.showGrowlMessage(dispatch, msg, 18000);
    },
    goLogin: (event?: React.MouseEvent, nextUrl?: string) => {
      LoginService.showLogin(dispatch);
      nextUrl && dispatch(updateNextUrl(nextUrl));
      event?.preventDefault();
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
      featureData: []
    };
  }

  componentDidMount() {
    if (this.props.history.location.state?.from == "checkout") {
      if (!this.props.isLoggedIn) {
        this.props.goLogin(undefined);
      }
    }
    util.pageViewGTM("Cart");
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
          "Page referrer url": CookieService.getCookie("prevUrl") || ""
        });
      }
    } catch (err) {
      console.log(err);
    }
    this.props.fetchBasket();
    // this.props.changeModalState();
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

    // const items = this.props.cart.lineItems.map((line, ind) => {
    //   const index = line?.product.categories
    //     ? line?.product.categories.length - 1
    //     : 0;
    //   const category =
    //     line?.product.categories && line?.product.categories[index]
    //       ? line?.product.categories[index].replace(/\s/g, "")
    //       : "";
    //   const arr = category.split(">");

    //   return {
    //     item_id: line?.product?.id, //Pass the product id
    //     item_name: line?.product?.title, // Pass the product name
    //     affiliation: line?.product?.title, // Pass the product name
    //     coupon: "", // Pass the coupon if available
    //     currency: this.props.currency, // Pass the currency code
    //     discount: "", // Pass the discount amount
    //     index: ind,
    //     item_brand: "Goodearth",
    //     item_category: arr[arr.length - 2],
    //     item_category2: arr[arr.length - 1],
    //     item_category3: "",
    //     item_list_id: "",
    //     item_list_name: "",
    //     item_variant: "",
    //     item_category4: "",
    //     item_category5: line?.product?.collection,
    //     price: line?.product?.priceRecords[this.props.currency],
    //     quantity: line?.quantity
    //   };
    // });

    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      const items = this.props.cart.lineItems.map((line, ind) => {
        const index = line?.product.categories
          ? line?.product.categories.length - 1
          : 0;
        const category =
          line?.product.categories && line?.product.categories[index]
            ? line?.product.categories[index].replace(/\s/g, "")
            : "";
        const arr = category.split(">");

        return {
          item_id: line?.product?.id, //Pass the product id
          item_name: line?.product?.title, // Pass the product name
          affiliation: line?.product?.title, // Pass the product name
          coupon: "", // Pass the coupon if available
          currency: this.props.currency, // Pass the currency code
          discount: "", // Pass the discount amount
          index: ind,
          item_brand: "Goodearth",
          item_category: arr[arr.length - 2],
          item_category2: arr[arr.length - 1],
          item_category3: "",
          item_list_id: "",
          item_list_name: "",
          item_variant: "",
          item_category4: "",
          item_category5: line?.product?.collection,
          price: line?.product?.priceRecords[this.props.currency],
          quantity: line?.quantity
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
        ecommerce: {
          currency: this.props.currency, // Pass the currency code
          value: this.props.cart.total,
          items: items
        }
      });
    }

    if (userConsent.includes(ANY_ADS)) {
      Moengage.track_event("Page viewed", {
        "Page URL": this.props.location.pathname,
        "Page Name": "CartPageView"
      });
    }
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
      <div className={styles.cart}>
        {/* {this.renderMessage()} */}
        <div
          className={cs(
            globalStyles.marginT50,
            globalStyles.textCenter,
            // bootstrap.colMd4,
            // bootstrap.offsetMd4,
            {
              [bootstrap.col12]: !mobile,
              [bootstrap.col10]: mobile,
              [bootstrap.offset1]: mobile
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
            <div className={bootstrap.row}>
              <div
                className={cs(
                  bootstrap.colMd12,
                  bootstrap.col12,
                  styles.noResultPadding,
                  styles.checkheight,
                  { [styles.checkheightMobile]: mobile }
                )}
              >
                {this.state.featureData.length > 0
                  ? this.state.featureData.map((data, i) => {
                      return (
                        <div
                          key={i}
                          className={cs(bootstrap.colMd2, bootstrap.col6)}
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
            </div>

            {isLoggedIn && (
              <>
                <h6 className={styles.wishlistHead}>From your Wishlist</h6>
                <p className={styles.wishlistSubHead}>
                  There’s more waiting for you in your Wishlist
                </p>
                <Link className={styles.viewAll} to="/wishlist">
                  VIEW ALL
                </Link>
                <div className={cs(bootstrap.row, globalStyles.marginT20)}>
                  <div
                    className={cs(
                      bootstrap.colMd12,
                      bootstrap.col12,
                      styles.noResultPadding,
                      styles.checkheight,
                      { [styles.checkheightMobile]: mobile }
                    )}
                  >
                    {wishlistData.length > 0
                      ? wishlistData?.slice(0, 4)?.map((data, i) => {
                          return (
                            <div
                              key={i}
                              className={cs(bootstrap.colMd2, bootstrap.col6)}
                            >
                              <div className={styles.searchImageboxNew}>
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
                                    {String.fromCharCode(
                                      ...currencyCode[this.props.currency]
                                    ) +
                                      " " +
                                      data.price[currency]}
                                  </Link>
                                </p>
                              </div>
                            </div>
                          );
                        })
                      : ""}
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
    // if(window.ischeckout) {
    //     return  <div className="notify-message ">
    //                     Due to year closing activities, we will <span className="link-text-underline">not</span> be
    //                     able to accept your orders till
    //                     <span className="link-text-underline"> 31st March 2019, midnight IST.</span> Regret the
    //                     inconvenience. We shall resume our normal operations soon
    //                     after.
    //                 </div>
    // }
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
    return (
      <div className={cs(bootstrap.row, styles.pageBody)}>
        <div
          className={cs(bootstrap.col12, bootstrap.colLg9, styles.bagContents)}
        >
          <div className={cs(styles.header)}>
            <p>MY SHOPPING BAG ({this.props?.cart?.lineItems?.length})</p>
          </div>
          {/* {this.renderMessage()} */}
          {this.getItems()}
        </div>
        <div
          className={cs(bootstrap.col12, bootstrap.colMd3, globalStyles.padd0)}
        >
          <OrderSummary
            mobile={this.props.mobile}
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
