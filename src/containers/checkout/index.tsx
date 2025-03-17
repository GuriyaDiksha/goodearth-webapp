import React from "react";
import { AppState } from "reducers/typings";
import { connect } from "react-redux";
import {
  STEP_BILLING,
  STEP_LOGIN,
  STEP_PAYMENT,
  STEP_SHIPPING,
  STEP_PROMO,
  STEP_ORDER
} from "./constants";
import styles from "./styles.scss";
import globalStyles from "styles/global.scss";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
import cs from "classnames";
import LoginSection from "./component/login";
import PaymentSection from "./component/payment";
import AddressMain from "components/Address/AddressMain";
import { AddressData } from "components/Address/typings";
import CookieService from "services/cookie";
import AddressService from "services/address";
import CheckoutService from "services/checkout";
import LoginService from "services/login";
import HeaderService from "services/headerFooter";
import Api from "services/api";
import { Dispatch } from "redux";
import { specifyBillingAddressData } from "containers/checkout/typings";
import { updateAddressList, updateAddressMode } from "actions/address";
import {
  showGrowlMessage,
  showErrors,
  pageViewGTM,
  proceedTocheckout,
  checkoutGTM
} from "utils/validate";
import { refreshPage, updateUser } from "actions/user";
import OrderSummary from "./component/orderSummary";
import PromoSection from "./component/promo";
import { Cookies } from "typings/cookies";
import MetaService from "services/meta";
import BasketService from "services/basket";
import { getPageType } from "../../utils/validate";
import { User } from "typings/user";
import {
  MESSAGE,
  REGISTRY_MIXED_SHIPPING,
  REGISTRY_OWNER_CHECKOUT
} from "constants/messages";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { updateComponent, updateModal } from "actions/modal";
import { POPUP } from "constants/components";
import { Basket } from "typings/basket";
import { Currency } from "typings/currency";
import CheckoutBreadcrumb from "./component/CheckoutBreadcrumb";
import { GA_CALLS } from "constants/cookieConsent";
import {
  updateCheckoutLoader,
  updateLoader,
  updateShowShippingAddress
} from "actions/info";
import { useLocation } from "react-router";
import Loader from "components/Loader";
import ModalStyles from "components/Modal/styles.scss";

const mapStateToProps = (state: AppState) => {
  return {
    refresh: state.user.refresh,
    location: state.router.location,
    user: state.user,
    basket: state.basket,
    addresses: state.address.addressList,
    mobile: state.device.mobile,
    tablet: state.device.tablet,
    currency: state.currency,
    cookies: state.cookies,
    isSale: state.info.isSale,
    deliveryText: state.info.deliveryText,
    showPromo: state.info.showPromo,
    bridalId: state.user.bridalId,
    billingAddressId: state.address.billingAddressId,
    showShipping: state.info.showShipping,
    isLoading: state.info.isLoading,
    isCheckoutLoading: state.info.isCheckoutLoading
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  const isGcCheckout = useLocation().pathname.endsWith("gc_checkout");
  return {
    // create function for dispatch
    showNotify: (message: string) => {
      showGrowlMessage(dispatch, message, 6000);
    },
    showRegistryMix: (message: string) => {
      showGrowlMessage(dispatch, message, 0);
    },
    specifyShippingAddress: async (
      shippingAddressId: number,
      shippingAddress: AddressData,
      user: User,
      isBridal = false,
      history: any
      // boId: string
    ) => {
      const data = await AddressService.specifyShippingAddress(
        dispatch,
        shippingAddressId,
        isBridal,
        history,
        undefined
      );
      const userData = { ...user, shippingData: shippingAddress };
      dispatch(updateUser(userData));
      // isLoading(true);
      AddressService.fetchAddressList(dispatch, undefined, isGcCheckout).then(
        addressList => {
          dispatch(updateAddressList(addressList));
        }
      );
      // .finally(()=> isLoading(false));

      return data;
    },
    specifyBillingAddress: async (
      specifyBillingAddressData: specifyBillingAddressData,
      user: User
    ) => {
      const data = await AddressService.specifyBillingAddress(
        dispatch,
        specifyBillingAddressData
      );
      AddressService.fetchAddressList(dispatch, undefined, isGcCheckout).then(
        addressList => {
          dispatch(updateAddressList(addressList));
        }
      );
      CheckoutService.getLoyaltyPoints(dispatch, { email: user?.email }).then(
        loyalty => {
          dispatch(updateUser({ loyaltyData: loyalty }));
        }
      );
      return data;
    },
    fetchAddressBridal: async () => {
      const addressList = await AddressService.fetchAddressList(
        dispatch,
        undefined,
        isGcCheckout
      );
      dispatch(updateAddressList(addressList));
      return addressList;
    },
    reloadPage: async (cookies: Cookies, history: any, isLoggedIn: boolean) => {
      dispatch(refreshPage(undefined));

      HeaderService.fetchHeaderDetails(dispatch);
      Api.getSalesStatus(dispatch).catch(err => {
        console.log("Sale status API error === " + err);
      });
      Api.getPopups(dispatch).catch(err => {
        console.log("Popups Api ERROR === " + err);
      });

      return await BasketService.fetchBasket(
        dispatch,
        isGcCheckout ? "gc_checkout" : "checkout",
        history,
        isLoggedIn
      ).then(async () => {
        const response = await MetaService.updateMeta(dispatch, cookies);

        if (response) {
          showGrowlMessage(dispatch, MESSAGE.CURRENCY_CHANGED_SUCCESS, 7000);
          return response;
        }
      });
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
      dispatch(updateUser({ loyaltyData: points }));
    },
    showPopup: (setInfoPopupCookie: () => void) => {
      dispatch(
        updateComponent(
          POPUP.INFOPOPUP,
          { acceptCondition: setInfoPopupCookie },
          true
        )
      );
      dispatch(updateModal(true));
    },
    fetchBasket: async (history: any, isLoggedIn: boolean) => {
      return await BasketService.fetchBasket(
        dispatch,
        isGcCheckout ? "gc_checkout" : "checkout",
        history,
        isLoggedIn
      );
    },
    getBoDetail: async (id: string) => {
      return await CheckoutService.getBoDetail(dispatch, id);
    },
    logout: async (currency: Currency, customerGroup: string) => {
      return await LoginService.logout(
        dispatch,
        currency,
        customerGroup,
        "checkout"
      );
    },
    checkPinCodeShippable: async (pinCode: string) => {
      const res = await HeaderService.checkPinCodeShippable(dispatch, pinCode);
      return res;
    },
    removeRedeem: async (isLoggedIn: boolean) => {
      const response = await CheckoutService.removeRedeem(dispatch);
      BasketService.fetchBasket(dispatch, "checkout", history, isLoggedIn);
      return response;
    },
    goLogin: (event?: React.MouseEvent, nextUrl?: string) => {
      LoginService.showLogin(dispatch);
      event?.preventDefault();
    },
    showShippingAddress: () => {
      dispatch(updateShowShippingAddress(false));
    },
    updateMode: () => {
      dispatch(updateAddressMode("list"));
    },
    showExitPopup: (location: any, action: any, mobile: any, basket: any) => {
      dispatch(
        updateComponent(
          POPUP.GCCHECKOUT,
          {
            location: location,
            action: action,
            history: history,
            basket: basket
          },
          mobile ? false : true,
          mobile ? ModalStyles.bottomAlignSlideUp : "",
          mobile ? "slide-up-bottom-align" : ""
        )
      );
      dispatch(updateModal(true));
    },
    updateLoaderValue: (value: boolean) => {
      dispatch(updateCheckoutLoader(value));
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
  unpublish: boolean;
  id: string;
  addressIdError: string;
  isGoodearthShipping: boolean;
  isSuspended: boolean;
  boEmail: string;
  // boId: string;
  errorNotification: string;
  onlyOnetime: boolean;
  isShipping: boolean;
  currentStep: number;
};

class Checkout extends React.Component<Props, State> {
  public unlisten: any = "";
  constructor(props: Props) {
    super(props);
    const isGcCheckout = props.location.pathname.endsWith("gc_checkout");
    this.state = {
      activeStep: props.user.isLoggedIn
        ? props.user.shippingData || isGcCheckout
          ? STEP_BILLING
          : STEP_SHIPPING
        : STEP_LOGIN,
      shippingAddress: props.user.shippingData
        ? props.user.shippingData
        : undefined,
      billingAddress: undefined,
      shippingError: "",
      errorNotification: "",
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
      unpublish: false,
      id: "",
      addressIdError: "",
      boEmail: "",
      // boId: "",
      isSuspended: true,
      isGoodearthShipping:
        props.user.shippingData && props.user.shippingData.isTulsi
          ? true
          : false,
      onlyOnetime: true,
      isShipping: false,
      currentStep: props.user.isLoggedIn
        ? props.user.shippingData || isGcCheckout
          ? STEP_ORDER[STEP_BILLING]
          : STEP_ORDER[STEP_SHIPPING]
        : STEP_ORDER[STEP_LOGIN]
    };
  }

  setCurrentStep = (step: number) => {
    this.setState({ currentStep: step });
  };

  setInfoPopupCookie() {
    if (typeof document != "undefined" && typeof window != "undefined") {
      const cookieString =
        "checkoutinfopopup3=show; expires=Sat, 01 Jan 2050 00:00:01 UTC; path=/";
      document.cookie = cookieString;
    }
    // this.setState({
    //     showInfoPopup: 'show'
    // })
  }

  checkToMessage(basket: Basket) {
    let item1 = false,
      item2 = false;

    basket.lineItems
      ?.filter(data => !data?.is_free_product)
      ?.map(data => {
        if (!data.bridalProfile) item1 = true;
        if (data.bridalProfile) item2 = true;
      });
    return item1 && item2;
  }

  componentWillUnmount() {
    this.unlisten();
  }

  componentDidMount() {
    // const bridalId = CookieService.getCookie("bridalId");
    // const gaKey = CookieService.getCookie("_ga");
    // this.setState({ bridalId, gaKey });
    pageViewGTM("Checkout");
    localStorage.setItem("openGCExitModal", "false");
    const checkoutPopupCookie = CookieService.getCookie("checkoutinfopopup3");
    // const boId = urlParams.get("bo_id");
    // const boId = urlParams.get("bo_id");

    const isGcCheckout = this.props.location.pathname.endsWith("gc_checkout");
    this.unlisten = this.props.history.block((location, action) => {
      // false means stop navigation
      if (isGcCheckout) {
        if (localStorage.getItem("openGCExitModal") === "true") {
          // Do nothing
        } else {
          localStorage.setItem("openGCExitModal", "true");
          this.props.showExitPopup(
            location,
            action,
            this.props.mobile,
            this.props.basket
          );

          if (this.props.location.pathname !== "/order/gc_checkout") {
            this.props?.history?.replace({ pathname: "/order/gc_checkout" });
          }
          return false;
        }
      }
    });
    // if (boId) {
    //   this.setState({
    //     activeStep: STEP_BILLING,
    //     currentStep: STEP_ORDER[STEP_BILLING],
    //     boId: boId,
    //     billingAddress: this.state.shippingAddress
    //   });

    //   if (
    //     localStorage.getItem("from") === "cart" &&
    //     this.props.user.isLoggedIn
    //   ) {
    //     this.props
    //       .getBoDetail(boId)
    //       .then((data: any) => {
    //         if (!data?.email && !data?.isLogin) {
    //           this.props.history.push("/backend-order-error");
    //         }
    //       })
    //       .catch(error => {
    //         this.props.history.push("/backend-order-error");
    //       });
    //   }

    //   if (
    //     localStorage.getItem("from") !== "cart" &&
    //     this.props.user.isLoggedIn
    //   ) {
    //     localStorage.removeItem("from");
    //     this.props
    //       .getBoDetail(boId)
    //       .then(() => {
    //         this.props
    //           .logout(this.props.currency, this.props.user.customerGroup)
    //           .then(res => {
    //             this.props.history.push(`/cart?bo_id=${boId}`, {
    //               from: "checkout"
    //             });
    //           });
    //       })
    //       .catch(error => {
    //         this.props.history.push("/backend-order-error");
    //       });
    //   }

    //   if (!this.props.user.isLoggedIn) {
    //     this.props.history.push(`/cart?bo_id=${boId}`, { from: "checkout" });
    //   }

    //   localStorage.removeItem("from");
    //   // this.props
    //   //   .getBoDetail(boId)
    //   //   .then((data: any) => {
    //   //     localStorage.setItem("tempEmail", data.email);
    //   //     if (this.props.user.email && data.isLogin) {
    //   //       CookieService.setCookie("currency", data.currency, 365);
    //   //       CookieService.setCookie("currencypopup", "true", 365);
    //   //       this.props
    //   //         .logout(this.props.currency, this.props.user.customerGroup)
    //   //         .then(res => {
    //   //           localStorage.setItem("tempEmail", data.email);
    //   //           this.setState({
    //   //             boEmail: data.email,
    //   //             boId: boId
    //   //           });
    //   //         });
    //   //     } else if (data.email) {
    //   //       CookieService.setCookie("currency", data.currency, 365);
    //   //       CookieService.setCookie("currencypopup", "true", 365);
    //   //       localStorage.setItem("tempEmail", data.email);
    //   //       this.setState({
    //   //         boEmail: data.email,
    //   //         boId: boId
    //   //       });
    //   //     } else {
    //   //       this.props.history.push("/backend-order-error");
    //   //     }
    //   //   })
    //   //   .catch(error => {
    //   //     this.props.history.push("/backend-order-error");
    //   //   });
    // } else {
    if (!this.props.user.isLoggedIn) {
      this.props.history.push("/cart", { from: "checkout" });
    }
    // }
    if (this.state.isSuspended && checkoutPopupCookie !== "show") {
      // this.props.showPopup(this.setInfoPopupCookie);
    }
    const {
      user: { email },
      getLoyaltyPoints
    } = this.props;
    this.state.isGoodearthShipping
      ? checkoutGTM(2, this.props.currency, this.props.basket)
      : "";
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push(function(this: any) {
        this.reset();
      });
      dataLayer.push({
        event: "checkoutView",
        PageURL: this.props.location.pathname,
        Page_Title: "virtual_checkout_view"
      });
      dataLayer.push({
        "Event Category": "GA Ecommerce",
        "Event Action": "Login Screen ",
        "Time Stamp": new Date().toISOString(),
        "Page Url": location.href,
        "Page Type": getPageType(),
        "Page referrer url": CookieService.getCookie("prevUrl")
      });
    }
    if (userConsent.includes(GA_CALLS)) {
      Moengage.track_event("Page viewed", {
        "Page URL": this.props.location.pathname,
        "Page Name": "checkoutView"
      });
    }
    this.props
      .fetchBasket(this.props.history, this.props.user.isLoggedIn)
      .then(res => {
        let basketBridalId = 0;
        res.lineItems.map(item =>
          item.bridalProfile ? (basketBridalId = item.bridalProfile) : ""
        );
        if (basketBridalId && basketBridalId == this.props.bridalId) {
          this.props.showNotify(REGISTRY_OWNER_CHECKOUT);
        }
        if (this.checkToMessage(res)) {
          this.props.showRegistryMix(REGISTRY_MIXED_SHIPPING);
        }
        // if (
        //   res?.loyalty?.length &&
        //   !(res?.loyalty?.[0]?.isValidated === true)
        // ) {
        this.props.removeRedeem(this.props.user.isLoggedIn);
        // }

        proceedTocheckout(res, this.props.currency, this.props.isSale);
        checkoutGTM(1, this.props.currency, res);
        // code for call loyalty point api only one time
        if (email) {
          const data: any = {
            email: email
          };
          getLoyaltyPoints(data);
        }
        if (!res.bridal && this.props.user.isLoggedIn) {
          if (isGcCheckout) {
            this.nextStep(STEP_BILLING);
          } else {
            const {
              user: { shippingData },
              addresses,
              currency
            } = this.props;
            const { isGoodearthShipping } = this.state;
            const defaultAddresses = addresses.filter(
              val => val.currency == currency
            );
            if (
              defaultAddresses?.length &&
              defaultAddresses.filter(val => val?.id === shippingData?.id)
                .length === 0
            ) {
              this.setState(
                {
                  shippingAddress: defaultAddresses.find(
                    val => val?.isDefaultForShipping
                  ),
                  billingAddress: isGoodearthShipping
                    ? undefined
                    : defaultAddresses.find(val => val?.isDefaultForShipping)
                },
                () => {
                  this.nextStep(STEP_SHIPPING);
                  this.props.updateMode();
                }
              );
            }
          }
        }
      });
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    const { isGoodearthShipping } = this.state;
    const { isLoading } = this.props;
    const isGcCheckout = this.props.location.pathname.endsWith("gc_checkout");
    if (nextProps.user.isLoggedIn) {
      const { shippingData } = nextProps.user;

      if (
        (this.state.activeStep == STEP_SHIPPING ||
          this.state.activeStep == STEP_LOGIN) &&
        shippingData &&
        shippingData?.id !== this.state.shippingAddress?.id &&
        ((nextProps.addresses.filter((val: any) => val?.id === shippingData?.id)
          .length !== 0 &&
          !nextProps.basket.bridal) ||
          nextProps.basket.bridal) &&
        !isLoading
      ) {
        this.setState({
          shippingAddress: shippingData || undefined,
          billingAddress:
            isGoodearthShipping || nextProps.basket.bridal
              ? undefined
              : shippingData,
          activeStep: STEP_BILLING
        });
      }
      if (
        this.state.activeStep == STEP_BILLING &&
        shippingData &&
        (nextProps.currency != this.props.currency || this.state.onlyOnetime)
      ) {
        this.setState({
          onlyOnetime: false
        });
        if (shippingData.country == "IN") {
          this.props
            .checkPinCodeShippable(shippingData.postCode)
            .then(response => {
              this.setState({
                errorNotification:
                  this.props.currency == "INR" &&
                  !this.props.basket.isOnlyGiftCart
                    ? response.status
                      ? ""
                      : "We are currently not delivering to this pin code however, will dispatch your order as soon as deliveries resume."
                    : ""
              });
            })
            .catch(err => {
              console.log(err);
            });
        }
      }
      // things to reset on currency change
      if (!shippingData && !isGcCheckout) {
        if (this.state.isShipping == false) {
          const userConsent = CookieService.getCookie("consent").split(",");
          if (userConsent.includes(GA_CALLS)) {
            dataLayer.push({
              "Event Category": "GA Ecommerce",
              "Event Action": "Checkout Step 2",
              "Event Label": "Address Detail Page",
              "Time Stamp": new Date().toISOString(),
              "Page Url": location.href,
              "Page Type": getPageType(),
              "Login Status": this.props.user.isLoggedIn
                ? "logged in"
                : "logged out",
              "Page referrer url": CookieService.getCookie("prevUrl")
            });
          }
        }

        this.setState({
          activeStep: STEP_SHIPPING,
          shippingAddress: nextProps.basket.bridal
            ? undefined
            : nextProps.addresses
                .filter(val => val.currency == this.props.currency)
                .find(val => val?.isDefaultForShipping),
          billingAddress:
            isGoodearthShipping || nextProps.basket.bridal
              ? undefined
              : nextProps.addresses
                  .filter(val => val.currency == this.props.currency)
                  .find(val => val?.isDefaultForShipping),
          isShipping: true
        });
      }
      if (
        shippingData !== this.state.shippingAddress &&
        nextProps.addresses.filter(val => val?.id === shippingData?.id)
          .length !== 0 &&
        !nextProps.basket.bridal &&
        !isLoading
      ) {
        this.setState({
          shippingAddress: shippingData || undefined,
          billingAddress:
            isGoodearthShipping || nextProps.basket.bridal
              ? undefined
              : shippingData || undefined
        });
      }
      if (
        !this.state.isGoodearthShipping &&
        shippingData &&
        shippingData.isTulsi
      ) {
        this.setState({ isGoodearthShipping: true });
      }
      if (!nextProps.basket.bridal && this.props.basket.bridal) {
        this.props.fetchAddressBridal();
      }
    } else {
      // this.props.updateShipping(nextProps.user.shippingData?.id || 0)
      this.setState({
        activeStep: STEP_LOGIN,
        shippingAddress: nextProps.user.shippingData || undefined,
        billingAddress:
          isGoodearthShipping || nextProps.basket.bridal
            ? undefined
            : nextProps.user.shippingData || undefined,
        errorNotification: ""
      });
    }

    if (this.props.showShipping !== nextProps.showShipping) {
      if (nextProps.showShipping) {
        this.nextStep(STEP_SHIPPING);
        this.props.showShippingAddress();
      }
    }
  }

  isActiveStep = (step: string) => {
    return this.state.activeStep == step;
  };

  nextStep = (step: string) => {
    this.setState({ activeStep: step, currentStep: STEP_ORDER[step] });
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
          "isEdit",
          "currency"
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
      const firstErrorField = document?.getElementsByClassName(
        "error-msg"
      )[0] as HTMLDivElement;

      if (firstErrorField) {
        firstErrorField.focus();
        firstErrorField.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    }, 500);
  }

  showErrorMsgs = () => {
    setTimeout(() => {
      const firstErrorField = document?.getElementsByClassName(
        globalStyles.errorMsg
      )[0] as HTMLInputElement;

      if (firstErrorField) {
        firstErrorField.focus();
        firstErrorField.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    }, 500);
  };

  finalizeAddress = (
    address: AddressData | null,
    activeStep: string,
    obj: { gstNo?: string; panPassportNo: string; gstType?: string }
  ) => {
    this.props.updateLoaderValue(true);
    // this.setState({ isLoading: true }, () => {
    if (activeStep == STEP_SHIPPING && address) {
      const { bridal } = this.props.basket;

      const userConsent = CookieService.getCookie("consent").split(",");

      this.props
        .specifyShippingAddress(
          address.id,
          address,
          this.props.user,
          bridal,
          this.props.history
        )
        .then(data => {
          if (userConsent.includes(GA_CALLS)) {
            Moengage.track_event("Shipping Address Added", {
              "First Name": address.firstName,
              "Last Name": address.lastName,
              "Zip code": address.postCode,
              Country: address.countryName,
              State: address.state,
              Address: address.line1 + address.line2,
              City: address.city,
              "Contact Number": address.phoneCountryCode + address.phoneNumber
            });
          }
          if (address.country == "IN") {
            this.props
              .checkPinCodeShippable(address.postCode)
              .then(response => {
                this.setState(
                  {
                    errorNotification:
                      this.props.currency == "INR" &&
                      !this.props.basket.isOnlyGiftCart
                        ? response.status
                          ? ""
                          : "We are currently not delivering to this pin code however, will dispatch your order as soon as deliveries resume."
                        : ""
                  },
                  () => {
                    this.props.updateLoaderValue(false);
                  }
                );
              })
              .catch(err => {
                console.log(err);
                this.props.updateLoaderValue(false);

                // this.setState({ isLoading: false });
              })
              .finally(() => {
                if (data.status) {
                  const isGoodearthShipping = address.isTulsi
                    ? address.isTulsi
                    : false;

                  checkoutGTM(2, this.props.currency, this.props.basket);
                  if (data.data.basket.pageReload) {
                    const emailData: any = {
                      email: this.props.user.email
                    };
                    this.props.getLoyaltyPoints(emailData);

                    this.props
                      .reloadPage(
                        this.props.cookies,
                        this.props.history,
                        this.props.user.isLoggedIn
                      )
                      .then(() => {
                        this.setState({ isGoodearthShipping });
                        this.setState(
                          {
                            shippingCharge: data.data.basket.shippingCharge,
                            shippingAddress: address,
                            billingAddress:
                              isGoodearthShipping || bridal
                                ? undefined
                                : address,
                            activeStep: STEP_BILLING
                          },
                          () => {
                            this.nextStep(STEP_BILLING);
                            this.props.updateLoaderValue(false);

                            // this.setState({ isLoading: false });
                          }
                        );
                      });
                  } else {
                    this.setState({ isGoodearthShipping });
                    this.setState(
                      {
                        shippingCharge: data.data.basket.shippingCharge,
                        shippingAddress: address,
                        billingAddress:
                          isGoodearthShipping || bridal ? undefined : address,
                        activeStep: STEP_BILLING
                      },
                      () => {
                        this.nextStep(STEP_BILLING);
                        this.props.updateLoaderValue(false);

                        // this.setState({ isLoading: false });
                      }
                    );
                  }
                }
              });
          } else {
            this.setState({
              errorNotification: ""
            });
            if (data.status) {
              const isGoodearthShipping = address.isTulsi
                ? address.isTulsi
                : false;

              if (!data.data.basket.pageReload) {
                this.setState({ isGoodearthShipping });
                this.setState(
                  {
                    shippingCharge: data.data.basket.shippingCharge,
                    shippingAddress: address,
                    billingAddress:
                      isGoodearthShipping || bridal ? undefined : address,
                    activeStep: STEP_BILLING
                  },
                  () => {
                    this.nextStep(STEP_BILLING);
                    this.props.updateLoaderValue(false);

                    // this.setState({ isLoading: false });
                  }
                );
              }

              checkoutGTM(2, this.props.currency, this.props.basket);
              if (data.data.basket.pageReload) {
                const emailData: any = {
                  email: this.props.user.email
                };
                this.props.getLoyaltyPoints(emailData);
                this.props
                  .reloadPage(
                    this.props.cookies,
                    this.props.history,
                    this.props.user.isLoggedIn
                  )
                  .then(() => {
                    this.setState({ isGoodearthShipping });
                    this.setState(
                      {
                        shippingCharge: data.data.basket.shippingCharge,
                        shippingAddress: address,
                        billingAddress:
                          isGoodearthShipping || bridal ? undefined : address,
                        activeStep: STEP_BILLING
                      },
                      () => {
                        this.nextStep(STEP_BILLING);
                        this.props.updateLoaderValue(false);

                        // this.setState({ isLoading: false });
                      }
                    );
                  });
              }
            }
          }
        })
        .catch(err => {
          if (err.response.status == 406) {
            return false;
          }
          if (!err.response.data.status) {
            this.setState({
              shippingError: showErrors(err.response.data)
            });
            this.showErrorMsg();
          }
          this.props.updateLoaderValue(false);

          // this.setState({ isLoading: false });
        });
    } else {
      let data: specifyBillingAddressData;
      const billingAddress = address ? address : this.state.shippingAddress;
      const isGcCheckout = this.props.location.pathname.endsWith("gc_checkout");
      if (billingAddress) {
        data = {
          billingAddressId: billingAddress.id,
          source: isGcCheckout ? "gc_checkout" : ""
        };
        // let stopBillingApi = false;
        // if (this.state.shippingAddress?.id != billingAddress.id) {
        //   stopBillingApi = false;
        // }
        if (obj.gstNo) {
          // stopBillingApi = false;
          data = Object.assign(
            {},
            {
              gstType: obj.gstType,
              gstNo: obj.gstNo,
              panPassportNo: obj.panPassportNo
            },
            data
          );
        } else if (obj.panPassportNo) {
          // stopBillingApi = false;
          data = Object.assign(
            {},
            {
              panPassportNo: obj.panPassportNo
            },
            data
          );
        }
        this.props
          .specifyBillingAddress(data, this.props.user)
          .then(() => {
            const userConsent = CookieService.getCookie("consent").split(",");
            if (userConsent.includes(GA_CALLS)) {
              Moengage.track_event("Billing Address Added", {
                "First Name": billingAddress.firstName,
                "Last Name": billingAddress.lastName,
                "Zip code": billingAddress.postCode,
                Country: billingAddress.countryName,
                State: billingAddress.state,
                Address: billingAddress.line1 + billingAddress.line2,
                City: billingAddress.city,
                "Contact Number":
                  billingAddress.phoneCountryCode + billingAddress.phoneNumber
              });
            }
            this.setState(
              {
                billingAddress: billingAddress,
                activeStep:
                  localStorage.getItem("validBo") ||
                  localStorage.getItem("isSale") ||
                  (!this.props.showPromo &&
                    this.props.basket.voucherDiscounts.length === 0)
                    ? // || this.props.isSale
                      STEP_PAYMENT
                    : STEP_PROMO,
                billingError: "",
                pancardNo: obj.panPassportNo,
                gstNo: obj.gstNo || "",
                gstType: obj.gstType || ""
              },
              () => {
                if (activeStep === STEP_BILLING) {
                  this.nextStep(
                    this.props.showPromo &&
                      this.props.basket.voucherDiscounts.length === 0
                      ? STEP_PROMO
                      : STEP_PAYMENT
                  );

                  if (
                    this.props.showPromo &&
                    this.props.basket.voucherDiscounts.length === 0
                  ) {
                    document?.getElementById("promo-section")?.scrollIntoView({
                      block: "center",
                      behavior: "smooth"
                    });
                  } else {
                    if (document?.getElementById("cerise-section")) {
                      document
                        ?.getElementById("cerise-section")
                        ?.scrollIntoView({
                          block: "center",
                          behavior: "smooth"
                        });
                    } else if (document?.getElementById("gifting-section")) {
                      document
                        ?.getElementById("gifting-section")
                        ?.scrollIntoView({
                          block: "center",
                          behavior: "smooth"
                        });
                    } else {
                      document
                        ?.getElementById("payment-section")
                        ?.scrollIntoView({
                          block: "center",
                          behavior: "smooth"
                        });
                    }
                  }
                }
              }
            );
            checkoutGTM(
              3,
              this.props.currency,
              this.props.basket,
              "",
              obj.gstNo,
              this.props.billingAddressId,
              this.props.deliveryText
            );
          })
          .catch(err => {
            if (isGcCheckout && this.props.basket.lineItems.length == 0) {
              this.setState({
                billingError: showErrors("There are no items in your cart.")
              });
            } else {
              this.setState({
                billingError:
                  // showErrors(err.response.data) || err.response.data.msg || ""
                  showErrors(err.response.data.msg[0])
              });
            }

            this.showErrorMsg();
            this.showErrorMsgs();
          })
          .finally(() => this.props.updateLoaderValue(false));
      }
    }
    // });
  };

  finalOrder = async (data: any) => {
    if (this.state.gstType) {
      data["gstNo"] = this.state.gstNo;
      data["gstType"] = this.state.gstType;
    }

    if (this.state.pancardNo) {
      data["panPassportNo"] = this.state.pancardNo;
    }
    // if (this.state.boId) {
    //   data["BoId"] = this.state.boId;
    // }
    if (this.props.deliveryText) {
      data["deliveryInstructions"] = this.props.deliveryText;
    }
    const response = await this.props.finalCheckout(data);

    checkoutGTM(4, this.props.currency, this.props.basket, data.paymentMethod);
    checkoutGTM(5, this.props.currency, this.props.basket, data.paymentMethod);
    return response;
  };
  render() {
    const isGcCheckout = this.props.location.pathname.endsWith("gc_checkout");
    return (
      <div
        className={cs(bootstrap.containerFluid, styles.pageBody, {
          // [styles.pB100]: !this.props.mobile
        })}
      >
        <div className={styles.checkout}>
          <div className={bootstrap.row}>
            <div
              className={cs(
                bootstrap.col12,
                bootstrap.colLg8,
                globalStyles.bgWhite,
                globalStyles.padd0
              )}
            >
              {/* Breadcrumb */}
              <CheckoutBreadcrumb active={this.state.activeStep} />

              <LoginSection
                isActive={this.isActiveStep(STEP_LOGIN)}
                user={this.props.user}
                next={this.nextStep}
                boEmail={this.state.boEmail}
              />
              {!isGcCheckout && (
                <AddressMain
                  isActive={this.isActiveStep(STEP_SHIPPING)}
                  isBridal={false}
                  selectedAddress={this.state.shippingAddress}
                  currentCallBackComponent="checkout-shipping"
                  next={this.nextStep}
                  finalizeAddress={this.finalizeAddress}
                  hidesameShipping={true}
                  activeStep={STEP_SHIPPING}
                  bridalId=""
                  isGoodearthShipping={this.state.isGoodearthShipping}
                  addressType={STEP_SHIPPING}
                  addresses={this.props.addresses}
                  error={this.state.shippingError}
                  errorNotification={this.state.errorNotification}
                  currentStep={this.state.currentStep}
                  isGcCheckout={isGcCheckout}
                />
              )}
              <AddressMain
                isActive={this.isActiveStep(STEP_BILLING)}
                isBridal={false}
                selectedAddress={this.state.billingAddress}
                currentCallBackComponent="checkout-billing"
                next={this.nextStep}
                finalizeAddress={this.finalizeAddress}
                hidesameShipping={true}
                activeStep={STEP_BILLING}
                bridalId=""
                isGoodearthShipping={this.state.isGoodearthShipping}
                addressType={STEP_BILLING}
                addresses={this.props.addresses}
                error={this.state.billingError}
                currentStep={this.state.currentStep}
                isGcCheckout={isGcCheckout}
              />
              {!this.props.isSale &&
                this.props.showPromo &&
                this.props.basket.showCouponSection && (
                  <PromoSection
                    isActive={this.isActiveStep(STEP_PROMO)}
                    user={this.props.user}
                    next={this.nextStep}
                    selectedAddress={this.state.billingAddress}
                    activeStep={STEP_PROMO}
                    currentStep={this.state.currentStep}
                  />
                )}
              <PaymentSection
                isActive={
                  this.isActiveStep(STEP_PAYMENT) ||
                  this.isActiveStep(STEP_PROMO)
                }
                user={this.props.user}
                checkout={this.finalOrder}
                currency={this.props.currency}
                shippingAddress={this.state.shippingAddress}
                salestatus={this.props.isSale}
                gstNo={this.state.gstNo}
                activeStep={STEP_PROMO}
                currentStep={this.state.currentStep}
                isGcCheckout={isGcCheckout}
              />
            </div>
            <div
              className={cs(
                bootstrap.col12,
                bootstrap.colLg4
                // globalStyles.marginB20
              )}
            >
              <OrderSummary
                mobile={this.props.mobile}
                currency={this.props.currency}
                shippingAddress={this.state.shippingAddress}
                salestatus={this.props.isSale}
                validbo={false}
                basket={this.props.basket}
                page="checkout"
                // boId={this.state.boId}
                tablet={this.props.tablet}
              />
            </div>
          </div>
        </div>
        {this.props.isLoading &&
          !this.props.user.isLoggedIn &&
          this.props.history.push("/cart", { from: "checkout" })}
      </div>
    );
  }
}
const checkoutRouter = withRouter(Checkout);
export default connect(mapStateToProps, mapDispatchToProps)(checkoutRouter);
