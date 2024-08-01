import React from "react";
import { connect } from "react-redux";
import BridalItem from "./bridalItem";
import { BridalPublicProfileData } from "../myAccount/components/Bridal/typings";
import BridalService from "../../services/bridal";
import { RouteComponentProps, withRouter } from "react-router";
import { Dispatch } from "redux";
import { AppState } from "reducers/typings";
import { updateComponent, updateModal } from "actions/modal";
import bootstrap from "styles/bootstrap/bootstrap-grid.scss";
import styles from "./styles.scss";
import globalStyles from "../../styles/global.scss";
import cs from "classnames";
import weddingFloral from "../../images/bridal/wedding-floral.png";
import iconStyles from "styles/iconFonts.scss";
import { POPUP } from "constants/components";
import { pageViewGTM } from "utils/validate";
import addedReg from "../../images/registery/addedReg.svg";
import gift_icon from "../../images/registery/gift_icon.svg";
import Button from "components/Button";
import { Link } from "react-router-dom";
import ModalStyles from "components/Modal/styles.scss";

type RouteInfo = {
  id: string;
};

const mapStateToProps = (state: AppState) => {
  return {
    cart: state.basket,
    mobile: state.device.mobile,
    showTimer: state.info.showTimer,
    isSale: state.info.isSale
  };
};

const mapDispatchToProps = (dispatch: Dispatch, ownProps: any) => {
  return {
    getBridalPublicProfile: async () => {
      const res = await BridalService.fetchBridalPublicProfile(
        dispatch,
        ownProps.id
      );
      return res;
    },
    showMobilePopup: (component: string, props: any) => {
      dispatch(updateComponent(component, props, true));
      dispatch(updateModal(true));
    },
    openNotifyMePopup: (component: string, props: any, mobile: boolean) => {
      dispatch(
        updateComponent(
          component,
          props,
          false,
          mobile ? ModalStyles.bottomAlignSlideUp : "",
          mobile ? "slide-up-bottom-align" : ""
        )
      );
      dispatch(updateModal(true));
    }
  };
};

type State = {
  bridalProfile: BridalPublicProfileData;
  showMobilePopup: boolean;
  mobileIndex: number;
  showSummary: boolean;
};
type Props = {
  key: string;
} & RouteComponentProps<RouteInfo> &
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

class BridalCheckout extends React.Component<Props, State> {
  state: State = {
    bridalProfile: {
      registrantName: "",
      coRegistrantName: "",
      occasion: "",
      occassion_choice: "",
      eventDate: "",
      items: [],
      bridalId: 0,
      registryName: "",
      currency: "INR"
    },
    showMobilePopup: false,
    mobileIndex: 0,
    showSummary: false
  };
  isSuspended = true;
  // this.state = {
  // bridalItems: BridalItem[],
  // mobile_screen: "summary-padding hidden-xs hidden-sm",
  // showMobilePopup: false,
  // mobileIndex: 0,
  // isSuspended: window.is_covid19 ? window.is_covid19 : false,
  // showInfoPopup: false,
  // showSummary: false
  // }
  // this.showHide = this.showHide.bind(this);
  // this.handleMobileAdd = this.handleMobileAdd.bind(this);
  // this.closeMobileAdd = this.closeMobileAdd.bind(this);
  // this.redirectCheckout = this.redirectCheckout.bind(this);
  // this.canCheckoutRegistry = this.canCheckoutRegistry.bind(this);
  // this.getItemsCount = this.getItemsCount.bind(this);
  // this.resetInfoPopupCookie = this.resetInfoPopupCookie.bind(this);
  // }

  showHide = () => {
    document.body.style.overflowY = "auto";
    if (!this.state.showSummary) {
      document.body.style.overflowY = "hidden";
    }
    this.setState(prevState => {
      return {
        showSummary: !prevState.showSummary
      };
    });
  };

  handleMobileAdd = (mindex: number) => {
    // this.setState({ showMobilePopup: true });
    const component = POPUP.BRIDALMOBILE;
    const props = {
      // closeMobile={this.closeMobileAdd}
      bridalItem: this.state.bridalProfile?.items[mindex],
      bridalId: this.state.bridalProfile?.bridalId
    };
    this.props.showMobilePopup(component, props);
    this.setState({ mobileIndex: mindex });
  };

  NotifyMe = (mindex: number) => {
    const component = POPUP.NOTIFYMEPOPUP;
    const bridalItems = this.state.bridalProfile?.items;
    const bridalItem = bridalItems[mindex];
    const currency = this.state.bridalProfile?.currency;
    const childAttributes = bridalItem.childAttributes.map(
      ({
        id,
        sku,
        priceRecords,
        discountedPriceRecords,
        stock,
        othersBasketCount,
        size,
        color,
        isBridalProduct,
        showStockThreshold
      }) => {
        return {
          discountedPriceRecords: discountedPriceRecords,
          id: id,
          isBridalProduct: isBridalProduct,
          sku: sku,
          priceRecords: priceRecords,
          size: size,
          color: color,
          stock: stock,
          showStockThreshold: showStockThreshold
        };
      }
    );
    let selectedIndex;
    let price = bridalItem.price[currency];
    childAttributes.map((v, i) => {
      if (v.size === bridalItem?.size) {
        selectedIndex = i;
        price = v.priceRecords[currency];
      }
    });
    const props = {
      price: price,
      discountedPrice: bridalItem.discountedPrice[currency],
      currency: currency,
      title: bridalItem.productName,
      childAttributes: childAttributes,
      collection: bridalItem.collection,
      selectedIndex: selectedIndex,
      isSale: this.props.isSale,
      discount: bridalItem.discount,
      badgeType: bridalItem.badgeType,
      list: "bridalItems",
      sliderImages: [],
      collections: bridalItem?.collection,
      badge_text: bridalItem?.badge_text
    };
    const mobile = this.props.mobile;
    this.props.openNotifyMePopup(component, props, mobile);
    this.setState({ mobileIndex: mindex });
  };

  // closeMobileAdd = () => {
  //   this.setState({showMobilePopup: false});
  // };

  redirectCheckout = () => {
    if (!this.canCheckoutRegistry()) {
      return false;
    }
    if (this.isSuspended) {
      this.resetInfoPopupCookie();
    }
    this.props.history.push("/order/checkout");
  };

  redirectCart = () => {
    if (!this.canCheckoutRegistry()) {
      return false;
    }
    if (this.isSuspended) {
      this.resetInfoPopupCookie();
    }
    this.props.history.push("/cart");
  };

  componentDidMount() {
    pageViewGTM("BridalPublic");
    const cookieString =
      "intro=" + true + "; expires=Sat, 01 Jan 2050 00:00:01 UTC; path=/";
    document.cookie = cookieString;
    // var key = window.location.href.replace(Config.hostname + 'bridal/', '');
    this.props
      .getBridalPublicProfile()
      .then((res: any) => {
        if (res) {
          this.setState({
            bridalProfile: res
          });
        }
        console.log(this.state.bridalProfile?.message);
      })
      .catch(res => {
        if (res.response.data?.message == "Invalid bridal") {
          this.setState({
            bridalProfile: res.response.data
          });
        }
        console.log(this.state.bridalProfile?.message);
      });
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 1000);

    setTimeout(() => {
      document.addEventListener("scroll", this.handleScroll);
    }, 1000);
  }

  // componentWillUnmount(){
  //   document.removeEventListener('scroll', this.handleScroll);
  // }

  handleScroll() {
    const window_top = window.scrollY;
    const sticky = document.getElementById("sticky");
    const stickyAnchor = document.getElementById("footer-start");
    const topPos = stickyAnchor?.offsetTop;
    // const rect = stickyAnchor?.getBoundingClientRect();
    // const topPos = rect?.top;
    // const bottomPos = rect?.bottom;
    // console.log("window==" +(window_top+window.innerHeight) + "bottom==" +bottomPos + "top==" +topPos)
    if (topPos) {
      if (window_top + window.innerHeight >= topPos) {
        sticky?.classList.remove(styles.stick);
      } else {
        sticky?.classList.add(styles.stick);
      }
    }
  }

  getItemsCount() {
    let count = 0;
    const items = this.props.cart ? this.props.cart.lineItems : [];
    if (items) {
      for (let i = 0; i < items.length; i++) {
        count = count + items[i].quantity;
      }
    }
    return count;
  }

  canCheckoutRegistry() {
    if (
      // window.ischeckout
      //  ||
      this.getItemsCount() == 0
    ) {
      return false;
    } else {
      return true;
    }
  }

  resetInfoPopupCookie() {
    const cookieString =
      "checkoutinfopopup3=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    document.cookie = cookieString;
  }

  // componentDidUpdate() {
  //   if(this.props.mobile && this.state.showMobilePopup) {

  //   }
  // }

  render() {
    const {
      registrantName,
      coRegistrantName,
      registryName,
      occasion,
      occassion_choice,
      eventDate,
      bridalId
    } = this.state.bridalProfile;
    const { mobile } = this.props;
    return (
      <div
        className={cs(
          styles.pageBody,
          { [styles.pageBodyTimer]: this.props.showTimer },
          bootstrap.containerFluid
        )}
      >
        <div className={cs(bootstrap.row, styles.bridalPublic)}>
          <div
            className={cs(
              bootstrap.col12,
              bootstrap.colMd3,
              styles.fixOrdersummary
            )}
          >
            <div className={styles.orderSummary}>
              {mobile && (
                <span
                  className={cs(
                    styles.btnArrow,
                    "visible-xs",
                    styles.colorPrimary
                  )}
                  onClick={this.showHide}
                >
                  <i
                    className={
                      this.state.showSummary
                        ? cs(iconStyles.icon, iconStyles.icon_downarrowblack)
                        : cs(iconStyles.icon, iconStyles.icon_uparrowblack)
                    }
                  ></i>
                </span>
              )}
              <div className={styles.summaryPadding}>
                <h3 className={cs(styles.summaryTitle)}>
                  <span>{registryName}</span>
                  <img src={addedReg} width="25" alt="gift_reg_icon" />
                </h3>
              </div>

              {!mobile && (
                <div className={styles.summaryPadding}>
                  <div className={styles.txtCap}>
                    <hr className="hr" />
                    {registrantName}
                    {coRegistrantName && (
                      <span>&nbsp;&&nbsp;{coRegistrantName}</span>
                    )}
                  </div>
                  <hr className="hr" />
                  <div
                    className={cs(
                      globalStyles.flex,
                      globalStyles.gutterBetween
                    )}
                  >
                    <span
                      className={cs(styles.subtotal, globalStyles.voffset2)}
                    >
                      <span className={cs(globalStyles.op2, styles.label)}>
                        Occasion:
                      </span>
                      &nbsp;&nbsp;
                      <span className={styles.txtCap}>
                        {occassion_choice ? occassion_choice : occasion}{" "}
                      </span>{" "}
                    </span>
                  </div>
                  <div
                    className={cs(
                      globalStyles.flex,
                      globalStyles.gutterBetween
                    )}
                  >
                    <span
                      className={cs(styles.subtotal, globalStyles.voffset2)}
                    >
                      <span className={cs(globalStyles.op2, styles.label)}>
                        Special Occasion Date:
                      </span>
                      &nbsp;&nbsp;
                      <span className={styles.txtCap}>{eventDate}</span>
                    </span>
                  </div>
                </div>
              )}

              {(!mobile || this.state.showSummary) && (
                <div
                  className={cs(styles.summaryPadding, {
                    [styles.mobDiv]: mobile
                  })}
                >
                  {mobile && (
                    <div>
                      <div className={styles.txtCap}>
                        <hr className="hr" />
                        {registrantName}
                        {coRegistrantName && (
                          <span>&nbsp;& &nbsp;{coRegistrantName}</span>
                        )}
                      </div>
                      <hr className="hr" />
                      <div
                        className={cs(
                          styles.flex,
                          styles.gutterBetween,
                          styles.total
                        )}
                      >
                        <span
                          className={cs(styles.subtotal, globalStyles.voffset2)}
                        >
                          <span className={cs(globalStyles.op2, styles.label)}>
                            Occasion:
                          </span>
                          &nbsp;&nbsp;
                          <span className={styles.txtCap}>
                            {occassion_choice ? occassion_choice : occasion}
                          </span>{" "}
                        </span>
                      </div>
                      <div
                        className={cs(
                          styles.flex,
                          styles.gutterBetween,
                          styles.total
                        )}
                      >
                        <span
                          className={cs(styles.subtotal, globalStyles.voffset2)}
                        >
                          <span className={cs(globalStyles.op2, styles.label)}>
                            Special Occasion Date:
                          </span>
                          &nbsp;&nbsp;
                          <span className={styles.txtCap}>{eventDate}</span>
                        </span>
                      </div>
                    </div>
                  )}
                  <hr className="hr" />
                  <div className={styles.bridalSidebarFooter}>
                    <div
                      className={cs(styles.textCoupon, globalStyles.voffset3, {
                        [styles.aquaColorText]: mobile
                      })}
                    >
                      {/* To purchase an item, please select the quantity and
                      click <span className="bold"> ADD TO BAG.</span> */}
                      To purchase an item, please select the quantity and click
                      ADD TO BAG.
                      <br />
                      <br />
                      Please ensure you add the items from this public link only
                      to contribute towards this Bridal Registry.
                    </div>
                    {/* <div
                      className={cs(
                        styles.textCoupon,
                        globalStyles.voffset2,
                        globalStyles.cerise,
                        globalStyles.bold
                      )}
                    >
                      Please ensure you add the items from this public link
                      only to contribute towards this Bridal Registry.
                    </div> */}
                    <div
                      className={cs(styles.textCoupon, globalStyles.voffset3)}
                    >
                      {/* If you need any assistance, talk to our representative
                      on: */}
                      For any assistance, enquiries or feedback, please reach
                      out to us on: <br />
                      <a href="tel: +91 9582999555">+91 9582 999 555</a> /{" "}
                      <a href="tel: +91 9582999888">+91 9582 999 888</a> Monday
                      through Saturday 9:00 am - 5:00 pm IST{" "}
                      <a href="mailto:customercare@goodearth.in">
                        customercare@goodearth.in
                      </a>
                    </div>
                    <div className={cs(globalStyles.voffset3, styles.tcUrl)}>
                      <a
                        href="https://www.goodearth.in/customer-assistance/terms-conditions"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Gifting Registry Terms & Conditions
                      </a>
                    </div>
                  </div>
                  {/* <div
                    className={cs(styles.textCoupon, globalStyles.voffset2)}
                  >
                    <a
                      href="tel: +91 9582999555"
                      className={globalStyles.cerise}
                    >
                      +91 9582999555
                    </a>{" "}
                    /{" "}
                    <a
                      href="tel: +91 9582999888"
                      className={globalStyles.cerise}
                    >
                      +91 9582999888
                    </a>
                  </div>
                  <div
                    className={cs(styles.textCoupon, globalStyles.voffset2)}
                  >
                    <a
                      href="https://www.goodearth.in/customer-assistance/terms-conditions"
                      className={globalStyles.cerise}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Terms of Use
                    </a>{" "}
                    |{" "}
                    <a
                      href="https://www.goodearth.in/customer-assistance/returns-exchanges"
                      className={globalStyles.cerise}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Returns & Exchanges
                    </a>
                  </div> */}

                  {!mobile && (
                    <div
                      className={cs(
                        globalStyles.marginT20,
                        globalStyles.textCenter
                      )}
                    >
                      <img src={weddingFloral} />
                    </div>
                  )}
                </div>
              )}
              {mobile && (
                <div className={globalStyles.voffset3}>
                  <input
                    type="button"
                    disabled={this.canCheckoutRegistry() ? false : true}
                    className={
                      this.canCheckoutRegistry()
                        ? cs(styles.ctaBtn, styles.aquaCta)
                        : cs(
                            styles.ctaBtn,
                            styles.fullDisabledBtn
                            // styles.disabledBtn
                          )
                    }
                    value="REVIEW BAG & CHECKOUT >"
                    onClick={this.redirectCart}
                  />
                </div>
              )}
            </div>
          </div>
          <div
            id="bridal_items_container"
            className={cs(bootstrap.col12, bootstrap.colMd9, styles.cartBlock)}
          >
            {mobile && (
              <div className={styles.registeryDetailsTitle}>
                REGISTRY DETAILS
                <hr />
              </div>
            )}
            {this.state.bridalProfile?.bridalId ? (
              this.state.bridalProfile?.items.length == 0 ? (
                <>
                  <div
                    className={cs(
                      styles.noProduct,
                      globalStyles.marginT20,
                      globalStyles.textCenter
                    )}
                  >
                    <img src={gift_icon} width="40" alt="gift-icon" />
                  </div>
                  <div
                    className={cs(
                      globalStyles.voffset3,
                      styles.textCoupon,
                      styles.endedEvent,
                      globalStyles.textCenter,
                      globalStyles.bold
                    )}
                  >
                    No products added to the registry yet.
                  </div>
                </>
              ) : (
                this.state.bridalProfile?.bridalId &&
                this.state.bridalProfile?.items.map((item, index) => {
                  return (
                    <BridalItem
                      bridalItem={item}
                      onMobileAdd={this.handleMobileAdd}
                      notifyMe={this.NotifyMe}
                      currency={this.state.bridalProfile?.currency}
                      index={index}
                      key={index}
                      bridalId={bridalId}
                    />
                  );
                })
              )
            ) : (
              ""
            )}
            {this.state.bridalProfile?.message == "Invalid bridal" && (
              <>
                <div
                  className={cs(
                    styles.noProduct,
                    globalStyles.marginT20,
                    globalStyles.textCenter
                  )}
                >
                  {/* <svg
                    viewBox="-3 -3 46 46"
                    width="100"
                    height="100"
                    preserveAspectRatio="xMidYMid meet"
                    x="0"
                    y="0"
                    className={styles.bridalRing}
                  >
                    <use xlinkHref={`${bridalRing}#bridal-ring`}></use>
                  </svg> */}
                  <img src={gift_icon} width="40" alt="gift-icon" />
                </div>
                <div
                  className={cs(
                    globalStyles.voffset3,
                    styles.textCoupon,
                    styles.endedEvent,
                    globalStyles.textCenter,
                    globalStyles.bold
                  )}
                >
                  {/* Sorry, the event has ended. */}
                  Looks like the event has ended.
                </div>
                <div className={styles.proceedButton}>
                  <Link to="/">
                    <button className={globalStyles.charcoalBtn}>
                      PROCEED TO GOODEARTH.IN
                    </button>
                  </Link>
                </div>
              </>
            )}
            {!mobile &&
              this.state.bridalProfile?.bridalId &&
              this.state.bridalProfile?.items.length != 0 && (
                <>
                  <div
                    id="sticky"
                    className={cs(
                      globalStyles.voffset4,
                      styles.cart,
                      styles.cartContainer,
                      styles.fixedDiv,
                      styles.stick,
                      {
                        [styles.hide]:
                          this.state.bridalProfile?.message == "Invalid bridal"
                      }
                    )}
                  >
                    <div className={cs(styles.cartItem, globalStyles.gutter15)}>
                      {/* <input
                      type="button"
                      disabled={this.canCheckoutRegistry() ? false : true}
                      className={
                        this.canCheckoutRegistry()
                          ? cs(globalStyles.aquaBtn, styles.reviewBag)
                          : cs(
                              globalStyles.aquaBtn,
                              globalStyles.disabledBtn,
                              styles.reviewBag
                            )
                      }
                      value="REVIEW BAG & CHECKOUT >"
                      onClick={this.redirectCart}
                    /> */}
                      <Button
                        onClick={this.redirectCart}
                        disabled={this.canCheckoutRegistry() ? false : true}
                        label="REVIEW BAG & CHECKOUT"
                        variant="mediumAquaCta300"
                      />
                    </div>
                  </div>
                  {/* <div id="sticky_anchor"></div> */}
                </>
              )}
          </div>
        </div>
      </div>
    );
  }
}

const BridalCheckoutRoute = withRouter(BridalCheckout);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BridalCheckoutRoute);
