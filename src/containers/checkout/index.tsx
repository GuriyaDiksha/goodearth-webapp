import React from "react";
// import Modal from "components/Modal";
import { AppState } from "reducers/typings";
import { connect } from "react-redux";
// import iconStyles from "../../styles/iconFonts.scss";
import * as Steps from "./constants";
import styles from "./styles.scss";
import globalStyles from "styles/global.scss";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
import cs from "classnames";
import LoginSection from "./component/login";
import AddressMain from "components/Address/AddressMain";
import { AddressData } from "components/Address/typings";
import CookieService from "services/cookie";
import AddressService from "services/address";
import CheckoutService from "services/checkout";
import { Dispatch } from "redux";
import { specifyBillingAddressData } from "containers/checkout/typings";
import { updateAddressList } from "actions/address";
import * as valid from "utils/validate";
import { refreshPage, updateUser } from "actions/user";
import OrderSummary from "./component/orderSummary";
import PromoSection from "./component/promo";
import PaymentSection from "./component/payment";
import { Cookies } from "typings/cookies";
import MetaService from "services/meta";
import BasketService from "services/basket";
import { User } from "typings/user";
import { showMessage } from "actions/growlMessage";
import { CURRENCY_CHANGED_SUCCESS } from "constants/messages";
import { RouteComponentProps, withRouter } from "react-router-dom";

const mapStateToProps = (state: AppState) => {
  return {
    refresh: state.user.refresh,
    location: state.router.location,
    user: state.user,
    basket: state.basket,
    addresses: state.address.addressList,
    mobile: state.device.mobile,
    currency: state.currency,
    cookies: state.cookies,
    isSale: state.info.isSale
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    // create function for dispatch
    showNotify: (message: string) => {
      dispatch(showMessage(message, 6000));
    },
    specifyShippingAddress: async (
      shippingAddressId: number,
      shippingAddress: AddressData,
      user: User
    ) => {
      const data = await AddressService.specifyShippingAddress(
        dispatch,
        shippingAddressId
      );
      const userData = { ...user, shippingData: shippingAddress };
      dispatch(updateUser(userData));
      AddressService.fetchAddressList(dispatch).then(addressList => {
        dispatch(updateAddressList(addressList));
      });
      return data;
    },
    specifyBillingAddress: async (
      specifyBillingAddressData: specifyBillingAddressData
    ) => {
      const data = await AddressService.specifyBillingAddress(
        dispatch,
        specifyBillingAddressData
      );
      AddressService.fetchAddressList(dispatch).then(addressList => {
        dispatch(updateAddressList(addressList));
      });
      return data;
    },
    reloadPage: (cookies: Cookies) => {
      dispatch(refreshPage(undefined));
      MetaService.updateMeta(dispatch, cookies);
      BasketService.fetchBasket(dispatch, true);
      dispatch(showMessage(CURRENCY_CHANGED_SUCCESS, 7000));
    },
    finalCheckout: async (data: FormData) => {
      const response = await CheckoutService.finalCheckout(dispatch, data);
      return response;
    },
    getLoyaltyPoints: async (data: FormData) => {
      const points: any = await CheckoutService.getLoyaltyPoints(
        dispatch,
        data
      );
      return points;
    }
  };
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps;

type State = {
  activeStep: string;
  shippingAddress: AddressData | undefined;
  billingAddress: AddressData | undefined;
  shippingError: string;
  billingError: string;
  paymentError: string;
  shippingCharge: number;
  giftCardDiscount: number;
  showcard: boolean;
  disableSelectedbox: boolean;
  gaKey: string;
  // showInfoPopup;
  pancardNo: string;
  gstNo: string;
  gstType: string;
  bridalId: string;
  unpublish: boolean;
  isLoading: boolean;
  id: string;
  addressIdError: string;
  isGoodearthShipping: boolean;
  loyaltyData: any;
};

class Checkout extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      activeStep: props.user.isLoggedIn
        ? props.user.shippingData
          ? Steps.STEP_BILLING
          : Steps.STEP_SHIPPING
        : Steps.STEP_LOGIN,
      shippingAddress: props.user.shippingData
        ? props.user.shippingData
        : undefined,
      billingAddress: undefined,
      shippingError: "",
      billingError: "",
      paymentError: "",
      shippingCharge: 0,
      giftCardDiscount: 0,
      showcard: true,
      disableSelectedbox: false,
      gaKey: "",
      // showInfoPopup,
      pancardNo: "",
      gstNo: "",
      gstType: "",
      bridalId: "",
      unpublish: false,
      isLoading: false,
      id: "",
      addressIdError: "",
      isGoodearthShipping:
        props.user.shippingData && props.user.shippingData.isTulsi
          ? true
          : false,
      loyaltyData: {}
    };
  }
  componentDidMount() {
    const bridalId = CookieService.getCookie("bridalId");
    const gaKey = CookieService.getCookie("_ga");
    this.setState({ bridalId, gaKey });
    const {
      user: { email },
      getLoyaltyPoints
    } = this.props;
    this.state.isGoodearthShipping
      ? dataLayer.push({
          event: "checkout",
          ecommerce: {
            currencyCode: this.props.currency,
            checkout: {
              actionField: { step: 2 },
              products: this.props.basket.products
            }
          }
        })
      : "";
    // code for call loyalty point api only one time
    if (email) {
      const data: any = {
        email: email
      };

      getLoyaltyPoints(data).then(loyalty => {
        this.setState({
          loyaltyData: loyalty
        });
      });
    }
    if (this.props.basket.publishRemove) {
      this.props.showNotify(
        "Due to unavailability of some products your cart has been updated."
      );
    }
    const chatButtonElem = document.getElementById("chat-button");
    const scrollToTopButtonElem = document.getElementById("scrollToTop-btn");
    if (scrollToTopButtonElem) {
      scrollToTopButtonElem.style.display = "none";
      scrollToTopButtonElem.style.bottom = "65px";
    }
    if (chatButtonElem) {
      chatButtonElem.style.display = "none";
      chatButtonElem.style.bottom = "10px";
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (nextProps.user.isLoggedIn) {
      const { shippingData } = nextProps.user;
      const {
        user: { email },
        getLoyaltyPoints
      } = this.props;

      // code for call loyalty point api only one time
      if (!email && nextProps.user.email) {
        const data: any = {
          email: nextProps.user.email
        };
        getLoyaltyPoints(data).then(loyalty => {
          this.setState({
            loyaltyData: loyalty
          });
        });
      }

      if (nextProps.basket.redirectToCart) {
        this.props.history.push("/cart", {});
      }
      if (nextProps.basket.publishRemove && !this.props.basket.publishRemove) {
        this.props.showNotify(
          "Due to unavailability of some products your cart has been updated."
        );
      }
      if (
        (this.state.activeStep == Steps.STEP_SHIPPING ||
          this.state.activeStep == Steps.STEP_LOGIN) &&
        shippingData &&
        shippingData?.id !== this.state.shippingAddress?.id
      ) {
        this.setState({
          activeStep: Steps.STEP_BILLING
        });
      }
      // things to reset on currency change
      if (!shippingData) {
        this.setState({
          activeStep: Steps.STEP_SHIPPING,
          billingAddress: undefined
        });
      }
      if (shippingData !== this.state.shippingAddress) {
        this.setState({
          shippingAddress: shippingData || undefined
        });
      }
      if (
        !this.state.isGoodearthShipping &&
        shippingData &&
        shippingData.isTulsi
      ) {
        this.setState({ isGoodearthShipping: true });
      }
    }
  }

  isActiveStep = (step: string) => {
    return this.state.activeStep == step;
  };

  nextStep = (step: string) => {
    this.setState({ activeStep: step });
  };

  appendObjectToFormData(data: any, obj: AddressData, rootKey: any) {
    for (let key in obj) {
      if (
        [
          "registrantName",
          "coRegistrantName",
          "isBridal",
          "countryName",
          "isDefaultForShipping",
          "isDefaultForBilling",
          "occasion",
          "isEdit"
        ].indexOf(key) == -1
      ) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const AddressDataKey: keyof AddressData = key as keyof AddressData;
          const val = obj[AddressDataKey];
          //hack for line3 & line 4
          if (key == "EmailId") {
            key = "line3";
          }
          if (key == "city") {
            key = "line4";
          }
          if (rootKey) {
            data.append(rootKey + "[" + key + "]", val);
          } else {
            data.append(key, val);
          }
        }
      }
    }
  }

  appendObjectToJsonData(data: any, obj: AddressData, rootKey: any) {
    data[rootKey] = {};
    for (let key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (
          [
            "coRegistrantName",
            "countryName",
            "isBridal",
            "registrantName",
            "occasion",
            "isEdit"
          ].indexOf(key) == -1
        ) {
          const AddressDataKey: keyof AddressData = key as keyof AddressData;
          const val = obj[AddressDataKey];
          //hack for line3 & line 4
          if (key == "EmailId") {
            key = "line3";
          }
          if (key == "city") {
            key = "line4";
          }
          if (key == "isDefaultForShipping" || key == "isDefaultForBilling") {
            continue;
          }
          data[rootKey][key] = val;
        }
      }
    }
    return data;
  }

  showErrorMsg() {
    setTimeout(() => {
      const firstErrorField = document.getElementsByClassName(
        "error-msg"
      )[0] as HTMLDivElement;

      if (firstErrorField) {
        firstErrorField.focus();
        firstErrorField.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    }, 500);
  }

  finalizeAddress = (
    address: AddressData | null,
    activeStep: string,
    obj: { gstNo?: string; panPassportNo: string; gstType?: string }
  ) => {
    // let paths = window.location.href.split("/");
    // let path = paths[0] + "//" + paths[2] + "/myapi/countries/";
    // let msg;
    if (activeStep == Steps.STEP_SHIPPING && address) {
      // if (this.props.user.isLoggedIn) {
      //     data.append("shippingAddressId", address.id.toString());
      // } else {
      // this.appendObjectToFormData(data, address, null);
      // data.append("country", path + address.country + "/");
      // }

      this.props
        .specifyShippingAddress(address.id, address, this.props.user)
        .then(data => {
          if (data.status) {
            const isGoodearthShipping = address.isTulsi
              ? address.isTulsi
              : false;
            this.setState({ isGoodearthShipping });

            this.setState({
              shippingCharge: data.data.shippingCharge,
              shippingAddress: address,
              billingAddress: undefined,
              activeStep: Steps.STEP_BILLING,
              shippingError: ""
            });
            dataLayer.push({
              event: "checkout",
              ecommerce: {
                currencyCode: this.props.currency,
                checkout: {
                  actionField: { step: 2 },
                  products: this.props.basket.products
                }
              }
            });
            if (data.data.pageReload) {
              // window.location.reload();
              this.props.reloadPage(this.props.cookies);
            }
          }
        })
        .catch(err => {
          // console.log(err.response.data);
          if (!err.response.data.status) {
            this.setState({
              shippingError: valid.showErrors(err.response.data)
            });
            this.showErrorMsg();
          }
        });
    } else {
      let data: specifyBillingAddressData;
      const billingAddress = address ? address : this.state.shippingAddress;
      if (billingAddress) {
        data = {
          billingAddressId: billingAddress.id
        };
        if (obj.gstNo) {
          data = Object.assign(
            {},
            {
              gstType: obj.gstType,
              gstNo: obj.gstNo,
              panPassportNo: obj.panPassportNo
            },
            data
          );
        }
        this.props
          .specifyBillingAddress(data)
          .then(data => {
            this.setState({
              billingAddress: billingAddress,
              activeStep:
                localStorage.getItem("validBo") ||
                localStorage.getItem("isSale")
                  ? Steps.STEP_PAYMENT
                  : Steps.STEP_PROMO,
              billingError: "",
              pancardNo: obj.panPassportNo,
              gstNo: obj.gstNo || "",
              gstType: obj.gstType || ""
            });
            dataLayer.push({
              event: "checkout",
              ecommerce: {
                currencyCode: this.props.currency,
                checkout: {
                  actionField: { step: 3 },
                  products: this.props.basket.products
                }
              }
            });
          })
          .catch(err => {
            // console.log(err.response.data);
            this.setState({
              billingError: valid.showErrors(err.response.data)
            });
            this.showErrorMsg();
          });
      }
    }
  };

  finalOrder = async (data: any) => {
    const response = await this.props.finalCheckout(data);
    dataLayer.push({
      event: "checkout",
      ecommerce: {
        currencyCode: this.props.currency,
        checkout: {
          actionField: { step: 5 },
          products: this.props.basket.products
        }
      }
    });
    return response;
  };

  render() {
    return (
      <div className={styles.pageBody}>
        <div className={styles.checkout}>
          <div className={bootstrap.row}>
            <div
              className={cs(
                bootstrap.col12,
                bootstrap.colMd8,
                globalStyles.voffset5,
                styles.pB100
              )}
            >
              <LoginSection
                isActive={this.isActiveStep(Steps.STEP_LOGIN)}
                user={this.props.user}
                next={this.nextStep}
              />
              <AddressMain
                isActive={this.isActiveStep(Steps.STEP_SHIPPING)}
                isBridal={false}
                selectedAddress={this.state.shippingAddress}
                currentCallBackComponent="checkout-shipping"
                next={this.nextStep}
                finalizeAddress={this.finalizeAddress}
                hidesameShipping={true}
                activeStep={Steps.STEP_SHIPPING}
                // items={this.props.basket}
                // bridalId={this.props.bridalId}
                bridalId=""
                isGoodearthShipping={this.state.isGoodearthShipping}
                addressType={Steps.STEP_SHIPPING}
                addresses={this.props.addresses}
                // user={this.props.user}
                error={this.state.shippingError}
              />
              <AddressMain
                isActive={this.isActiveStep(Steps.STEP_BILLING)}
                isBridal={false}
                selectedAddress={this.state.billingAddress}
                currentCallBackComponent="checkout-billing"
                next={this.nextStep}
                finalizeAddress={this.finalizeAddress}
                hidesameShipping={true}
                activeStep={Steps.STEP_BILLING}
                bridalId=""
                isGoodearthShipping={this.state.isGoodearthShipping}
                addressType={Steps.STEP_BILLING}
                addresses={this.props.addresses}
                error={this.state.billingError}
              />
              <PromoSection
                isActive={this.isActiveStep(Steps.STEP_PROMO)}
                user={this.props.user}
                next={this.nextStep}
                selectedAddress={this.state.billingAddress}
              />
              <PaymentSection
                isActive={this.isActiveStep(Steps.STEP_PAYMENT)}
                user={this.props.user}
                checkout={this.finalOrder}
                currency={this.props.currency}
                loyaltyData={this.state.loyaltyData}
              />
            </div>
            <div className={cs(bootstrap.col12, bootstrap.colMd4)}>
              <OrderSummary
                mobile={this.props.mobile}
                currency={this.props.currency}
                shippingAddress={this.state.shippingAddress}
                salestatus={this.props.isSale}
                validbo={false}
                basket={this.props.basket}
                page="checkout"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const checkoutRouter = withRouter(Checkout);
export default connect(mapStateToProps, mapDispatchToProps)(checkoutRouter);
