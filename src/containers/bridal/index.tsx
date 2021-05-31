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
import bridalRing from "../../images/bridal/rings.svg";
import iconStyles from "styles/iconFonts.scss";
import { POPUP } from "constants/components";
import * as util from "utils/validate";

type RouteInfo = {
  id: string;
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
    }
  };
};

const mapStateToProps = (state: AppState) => {
  return {
    cart: state.basket,
    mobile: state.device.mobile,
    showTimer: state.info.showTimer
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
      bridalItem: this.state.bridalProfile.items[mindex],
      bridalId: this.state.bridalProfile.bridalId
    };
    this.props.showMobilePopup(component, props);
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
    this.props.history.push("/order/checkout/");
  };

  componentDidMount() {
    util.pageViewGTM("BridalPublic");
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
      })
      .catch(res => {
        if (res.response.data?.message == "Invalid bridal") {
          this.setState({
            bridalProfile: res.response.data
          });
        }
      });
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 1000);
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
      occasion,
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
                <h3
                  className={cs(globalStyles.textCenter, styles.summaryTitle)}
                >
                  REGISTRY DETAILS
                </h3>
              </div>
              <div className={cs(styles.summaryPadding, styles.txtup)}>
                <hr className="hr" />
                {registrantName}&nbsp; & &nbsp;{coRegistrantName}
              </div>

              <div className="">
                {!mobile && (
                  <div className={styles.summaryPadding}>
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
                        <span className={globalStyles.op2}> Event:</span>{" "}
                        <span className={styles.txtCap}> {occasion} </span>{" "}
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
                        <span className={globalStyles.op2}>Wedding Date:</span>{" "}
                        {eventDate}
                      </span>
                    </div>
                  </div>
                )}

                <div className="">
                  {(!mobile || this.state.showSummary) && (
                    <div className={styles.summaryPadding}>
                      {mobile && (
                        <div>
                          <hr className="hr" />
                          <div
                            className={cs(
                              styles.flex,
                              styles.gutterBetween,
                              styles.total
                            )}
                          >
                            <span
                              className={cs(
                                styles.subtotal,
                                globalStyles.voffset2
                              )}
                            >
                              <span className={globalStyles.op2}> Event:</span>{" "}
                              <span className={styles.txtCap}>
                                {" "}
                                {occasion}{" "}
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
                              className={cs(
                                styles.subtotal,
                                globalStyles.voffset2
                              )}
                            >
                              <span className={globalStyles.op2}>
                                Wedding Date:
                              </span>{" "}
                              {eventDate}
                            </span>
                          </div>
                        </div>
                      )}
                      <hr className="hr" />
                      <div
                        className={cs(styles.textCoupon, globalStyles.voffset4)}
                      >
                        To purchase an item, please select the quantity and
                        click <span className="bold"> ADD TO BAG.</span>
                      </div>
                      <div
                        className={cs(
                          styles.textCoupon,
                          globalStyles.voffset2,
                          globalStyles.cerise,
                          globalStyles.bold
                        )}
                      >
                        Please ensure you add the items from this public link
                        only to contribute towards this Bridal Registry.
                      </div>
                      <div
                        className={cs(styles.textCoupon, globalStyles.voffset2)}
                      >
                        If you need any assistance, talk to our representative
                        on:
                      </div>
                      <div
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
                      </div>
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
                    <div className={globalStyles.voffset4}>
                      <input
                        type="button"
                        disabled={this.canCheckoutRegistry() ? false : true}
                        className={
                          this.canCheckoutRegistry()
                            ? cs(globalStyles.ceriseBtn)
                            : cs(
                                globalStyles.ceriseBtn,
                                globalStyles.disabled,
                                styles.disabledBtn
                              )
                        }
                        value="PROCEED TO CHECKOUT"
                        onClick={this.redirectCheckout}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div
            className={cs(bootstrap.col12, bootstrap.colMd9, styles.cartBlock)}
          >
            {this.state.bridalProfile.bridalId
              ? this.state.bridalProfile.items.map((item, index) => {
                  return (
                    <BridalItem
                      bridalItem={item}
                      onMobileAdd={this.handleMobileAdd}
                      currency={this.state.bridalProfile.currency}
                      index={index}
                      key={index}
                      bridalId={bridalId}
                    />
                  );
                })
              : ""}
            {this.state.bridalProfile?.message == "Invalid bridal" && (
              <>
                <div
                  className={cs(
                    globalStyles.marginT20,
                    globalStyles.textCenter
                  )}
                >
                  <svg
                    viewBox="-3 -3 46 46"
                    width="100"
                    height="100"
                    preserveAspectRatio="xMidYMid meet"
                    x="0"
                    y="0"
                    className={styles.bridalRing}
                  >
                    <use xlinkHref={`${bridalRing}#bridal-ring`}></use>
                  </svg>
                </div>
                <div
                  className={cs(
                    globalStyles.voffset4,
                    styles.textCoupon,
                    globalStyles.textCenter,
                    globalStyles.bold
                  )}
                >
                  Sorry, {this.state.bridalProfile.registryName} and{" "}
                  {this.state.bridalProfile.coRegistrantName}{" "}
                  {this.state.bridalProfile.registryName} has been concluded.
                </div>
              </>
            )}
            {!mobile && (
              <div
                className={cs(
                  globalStyles.voffset4,
                  styles.cart,
                  styles.cartContainer
                )}
              >
                <div className={cs(styles.cartItem, globalStyles.gutter15)}>
                  <input
                    type="button"
                    disabled={this.canCheckoutRegistry() ? false : true}
                    className={
                      this.canCheckoutRegistry()
                        ? cs(globalStyles.ceriseBtn)
                        : cs(globalStyles.ceriseBtn, globalStyles.disabled)
                    }
                    value="PROCEED TO CHECKOUT"
                    onClick={this.redirectCheckout}
                  />
                </div>
              </div>
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
