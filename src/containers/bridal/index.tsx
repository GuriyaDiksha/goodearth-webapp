import React, { useEffect, useState } from "react";
import BaseLayout from "components/base_layout";
import Config from "components/config";
import { connect } from "react-redux";
// import * as mapper from "pages/bridal/mapper/bridalm"
import BridalItem from "./BridalItem";
import { BridalPublicProfileData } from "../myAccount/components/Bridal/typings";
import BridalMobile from "./addbridalmodal.jsx";
// import InfoPopup from '../../components/common/popup/InfoPopup';
import BridalService from "../../services/bridal";
import { RouteComponentProps, withRouter } from "react-router";
import { Dispatch } from "redux";
import { AppState } from "reducers/typings";
// import mapDispatchToProps from 'components/signin/Login/mapper/actions'

type RouteInfo = {
  key: string;
};

const mapDispatchToProps = (dispatch: Dispatch, params: any) => {
  return {
    getBridalPublicProfile: async () => {
      const res = await BridalService.fetchBridalPublicProfile(
        dispatch,
        params.key
      );
      return res;
    }
  };
};

const mapStateToProps = (state: AppState) => {
  return {
    cart: state.basket,
    mobile: state.device.mobile
  };
};

type State = {
  bridalProfile: BridalPublicProfileData;
  showMobilePopup: boolean;
  mobileIndex: number;
  showSummary: boolean;
};
type Props = {} & RouteComponentProps<RouteInfo> &
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
    // let classValue = (this.state.mobile_screen == "summary-padding") ? "summary-padding hidden-xs hidden-sm" : "summary-padding";
    // this.setState({mobile_screen: classValue});
    // document.body.style.overflowY = 'auto';
    // if (!this.state.showSummary) {
    //     document.body.style.overflowY = 'hidden';
    // }
    // this.setState({
    //     showSummary: !this.state.showSummary
    // });
  };

  handleMobileAdd = (mindex: number) => {
    this.setState({ showMobilePopup: true });
    this.setState({ mobileIndex: mindex });
  };

  closeMobileAdd = () => {
    // this.setState({showMobilePopup: false});
  };
  redirectCheckout = () => {
    // if(!this.canCheckoutRegistry()){
    //     return false;
    // }
    // if(this.state.isSuspended) {
    //     this.resetInfoPopupCookie();
    // }
    // location.href='/order/checkout/';
  };

  componentDidMount() {
    const cookieString =
      "intro=" + true + "; expires=Sat, 01 Jan 2050 00:00:01 UTC; path=/";
    document.cookie = cookieString;
    // var key = window.location.href.replace(Config.hostname + 'bridal/', '');
    this.props.getBridalPublicProfile().then(res => {
      if (res) {
        this.setState({
          bridalProfile: res
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
    if (window.ischeckout || this.getItemsCount() == 0) {
      return false;
    } else {
      return true;
    }
  }

  resetInfoPopupCookie() {
    const cookieString =
      "checkoutinfopopup=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    document.cookie = cookieString;
  }

  render() {
    const {
      registrantName,
      coRegistrantName,
      occasion,
      eventDate,
      bridalId
    } = this.state.bridalProfile;
    return (
      <BaseLayout>
        <div className="row bridal-public">
          <div className="col-xs-12 col-md-3 fix-ordersummary">
            <div className="order-summary">
              <span
                className="btn-arrow visible-xs color-primary"
                onClick={this.showHide}
              >
                <i
                  className={
                    this.state.showSummary
                      ? "icon icon_downarrow-black"
                      : "icon icon_uparrow-black"
                  }
                ></i>
              </span>
              <div className="summary-padding summary-header">
                <h3 className="text-center summary-title">REGISTRY DETAILS</h3>
              </div>
              <div className="summary-padding txtup">
                <hr className="hr" />
                {registrantName}&nbsp; & &nbsp;{coRegistrantName}
              </div>

              <div className="">
                <div className="summary-padding hidden-xs hidden-sm">
                  <hr className="hr" />
                  <div className="flex gutter-between total">
                    <span className="subtotal voffset2">
                      <span className="op2"> Event:</span>{" "}
                      <span className="txt-cap"> {occasion} </span>{" "}
                    </span>
                  </div>
                  <div className="flex gutter-between total">
                    <span className="subtotal voffset2">
                      <span className="op2">Wedding Date:</span> {eventDate}
                    </span>
                  </div>
                </div>

                <div className="">
                  <div className={this.state.mobile_screen}>
                    <div className="hidden-lg hidden-md">
                      <hr className="hr" />
                      <div className="flex gutter-between total">
                        <span className="subtotal voffset2">
                          <span className="op2"> Event:</span>{" "}
                          <span className="txt-cap"> {occasion} </span>{" "}
                        </span>
                      </div>
                      <div className="flex gutter-between total">
                        <span className="subtotal voffset2">
                          <span className="op2">Wedding Date:</span> {eventDate}
                        </span>
                      </div>
                    </div>
                    <hr className="hr" />
                    <div className=" text-coupon voffset4">
                      To purchase an item, please select the quantity and click{" "}
                      <span className="bold"> ADD TO BAG.</span>
                    </div>
                    <div className=" text-coupon voffset2 cerise bold">
                      Please ensure you add the items from this public link only
                      to contribute towards this Bridal Registry.
                    </div>
                    <div className=" text-coupon voffset2">
                      If you need any assistance, talk to our representative on:
                    </div>
                    <div className=" text-coupon voffset2">
                      <a href="tel: +91 9582999555" className="cerise">
                        +91 9582999555
                      </a>{" "}
                      /{" "}
                      <a href="tel: +91 9582999888" className="cerise">
                        +91 9582999888
                      </a>
                    </div>
                    <div className=" text-coupon voffset2">
                      <a
                        href="https://www.goodearth.in/customer-assistance/terms-conditions"
                        className="cerise"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Terms of Use
                      </a>{" "}
                      |{" "}
                      <a
                        href="https://www.goodearth.in/customer-assistance/returns-exchanges"
                        className="cerise"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Returns & Exchanges
                      </a>
                    </div>
                    <div className="wishlist hidden-xs hidden-sm">
                      <img src="/static/img/wedding-floral.png" />
                    </div>
                  </div>
                  <div className="hidden-md hidden-lg voffset4">
                    <input
                      type="button"
                      disabled={this.canCheckoutRegistry() ? false : true}
                      className={
                        !this.canCheckoutRegistry()
                          ? "cerise-btn disabled-btn"
                          : "cerise-btn"
                      }
                      value="PROCEED TO CHECKOUT"
                      onClick={this.redirectCheckout}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-md-9 cart-block">
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
            <div className="hidden-xs hidden-sm voffset4 cart cart-container">
              <div className="cart-item gutter15">
                <input
                  type="button"
                  disabled={this.canCheckoutRegistry() ? false : true}
                  className={
                    !this.canCheckoutRegistry()
                      ? "cerise-btn disabled-btn"
                      : "cerise-btn"
                  }
                  value="PROCEED TO CHECKOUT"
                  onClick={this.redirectCheckout}
                />
              </div>
            </div>
          </div>
        </div>
        {this.props.mobile && this.state.showMobilePopup ? (
          <BridalMobile
            closeMobile={this.closeMobileAdd}
            dispatch={this.props.dispatch}
            itemData={this.state.bridalProfile.items[this.state.mobileIndex]}
            showNotification={this.props.showNotification}
            bridalId={bridalId}
          />
        ) : (
          ""
        )}
        {/* {this.state.showInfoPopup? <InfoPopup acceptPopup={() => {this.setState({showInfoPopup: false})}} /> : ""} */}
      </BaseLayout>
    );
  }
}

const BridalCheckoutRoute = withRouter(BridalCheckout);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BridalCheckoutRoute);
