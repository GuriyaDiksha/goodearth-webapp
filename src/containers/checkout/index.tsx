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
import MetaService from "services/meta";
import BasketService from "services/basket";
import { Dispatch } from "redux";
import { specifyBillingAddressData } from "containers/checkout/typings";
import { updateAddressList } from "actions/address";
import * as valid from "utils/validate";
import { refreshPage } from "actions/user";
import OrderSummary from "./component/orderSummary";
import PromoSection from "./component/promo";
import PaymentSection from "./component/payment";
import { Cookies } from "typings/cookies";

const mapStateToProps = (state: AppState) => {
  return {
    refresh: state.user.refresh,
    location: state.router.location,
    user: state.user,
    basket: state.basket,
    addresses: state.address.addressList,
    mobile: state.device.mobile,
    currency: state.currency,
    cookies: state.cookies
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    specifyShippingAddress: async (shippingAddressId: number) => {
      const data = await AddressService.specifyShippingAddress(
        dispatch,
        shippingAddressId
      );
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
    refreshPage: () => {
      dispatch(refreshPage(undefined));
    },
    updateMeta: (cookies: Cookies) => {
      MetaService.updateMeta(dispatch, cookies);
      BasketService.fetchBasket(dispatch);
    }
  };
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

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
      isGoodearthShipping: false
    };
  }
  componentDidMount() {
    const bridalId = CookieService.getCookie("bridalId");
    const gaKey = CookieService.getCookie("_ga");
    this.setState({ bridalId, gaKey });
    this.props.updateMeta(this.props.cookies);
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    const shippingData = nextProps.user.shippingData;
    if (shippingData && !this.props.user.shippingData) {
      this.setState({
        shippingAddress: shippingData,
        activeStep: shippingData ? Steps.STEP_BILLING : Steps.STEP_SHIPPING
      });
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
        .specifyShippingAddress(address.id)
        .then(data => {
          const isGoodearthShipping = address.isEdit ? address.isEdit : false;
          this.setState({ isGoodearthShipping });
          localStorage.setItem(
            "shippingDataUserAddressId",
            address.id.toString()
          );

          this.setState({
            shippingCharge: data.shippingCharge,
            shippingAddress: address,
            activeStep: Steps.STEP_BILLING,
            shippingError: ""
          });
          if (data.pageReload) {
            window.location.reload();
            this.props.refreshPage();
          }
        })
        .catch(err => {
          // console.log(err.response.data);
          this.setState({ shippingError: valid.showErrors(err.response.data) });
          this.showErrorMsg();
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

  finalOrder = () => {
    return true;
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
                // items={this.props.basket}
                // bridalId={this.props.bridalId}
                bridalId=""
                isGoodearthShipping={this.state.isGoodearthShipping}
                addressType={Steps.STEP_SHIPPING}
                addresses={this.props.addresses}
                // user={this.props.user}
                error={this.state.billingError}
              />
              <PromoSection
                isActive={this.isActiveStep(Steps.STEP_PROMO)}
                user={this.props.user}
                next={this.nextStep}
              />
              <PaymentSection
                isActive={this.isActiveStep(Steps.STEP_PAYMENT)}
                user={this.props.user}
                checkout={this.finalOrder}
                currency={this.props.currency}
              />
            </div>
            <div className={cs(bootstrap.col12, bootstrap.colMd4)}>
              <OrderSummary
                mobile={this.props.mobile}
                currency={this.props.currency}
                shippingAddress={this.state.shippingAddress}
                salestatus={false}
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

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);
