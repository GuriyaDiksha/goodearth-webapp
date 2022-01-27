import React, { Fragment, useEffect } from "react";
import { Switch, useHistory } from "react-router";
import routes from "routes/index";
import Header from "components/header";
import Footer from "components/footer";
import Modal from "components/Modal";
import LoginService from "services/login";
import CookieService from "services/cookie";
import loadable from "@loadable/component";
const CheckoutHeader = loadable(() =>
  import("containers/checkout/checkoutHeader")
);
import globalStyles from "styles/global.scss";
import "styles/chat.css";
import { AppState } from "reducers/typings";
import { useSelector, useDispatch } from "react-redux";
import { updateComponent, updateModal } from "actions/modal";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
import cs from "classnames";
// import MusicPlayer from "components/MusicBar";
// import whatsapp from "../../images/whatsapp.svg";
// import flowerimg2 from "images/flower2.gif";
// import flowerimg3 from "images/flower3.gif";
// import flowerimg4 from "images/flower4.gif";
// import MakerPopup from "components/Popups/MakerPopup";
import { POPUP } from "constants/components";
import Loader from "components/Loader";
import { CUST } from "constants/util";
// import * as _ from "lodash";
const BaseLayout: React.FC = () => {
  const history = useHistory();
  const { pathname, search } = history.location;
  const dispatch = useDispatch();
  const {
    currency,
    basket: { bridal },
    header: { announcementData },
    device: { orientation, tablet, mobile }
    // user: { customerGroup }
  } = useSelector((state: AppState) => state);
  const {
    modal: { component }
  } = useSelector((state: AppState) => state);
  const {
    info: { isLoading }
  } = useSelector((state: AppState) => state);
  const { customerGroup } = useSelector((state: AppState) => state.user);
  // don't show info popup
  const isSuspended = false;
  const popup = useSelector((state: AppState) => state.popup);
  const dominList = ["dv", "stg", "pprod"];
  // const flower = [flowerimg1, flowerimg2, flowerimg3, flowerimg4];
  const getPWADisplayMode = () => {
    const isStandalone = window.matchMedia("(display-mode: standalone)")
      .matches;
    const nav = window.navigator as any;
    if (document.referrer.startsWith("android-app://")) {
      return "twa";
    } else if ((nav && nav.standalone) || isStandalone) {
      return "standalone";
    }
    return "browser";
  };
  useEffect(() => {
    if (getPWADisplayMode() == "standalone") {
      dataLayer.push({
        event: "App Icon Click",
        page: location
      });
    }
  }, []);
  useEffect(() => {
    const value = CookieService.getCookie("auth");
    if (
      value != "true" &&
      dominList.some((v: any) => location.origin.includes(v))
    ) {
      history.push("/auth");
    }
  }, []);

  useEffect(() => {
    if (tablet) {
      if (orientation == "landscape" && !mobile) {
        dispatch(updateComponent(POPUP.ORIENTATIONPOPUP, undefined, true));
        dispatch(updateModal(true));
      } else if (
        orientation == "portrait" &&
        component == POPUP.ORIENTATIONPOPUP
      ) {
        dispatch(updateModal(false));
      }
    }
  }, [orientation, tablet]);

  useEffect(() => {
    window.scrollTo(0, 0);
    // for handling scroll to particalar element with id
    const { hash, search } = location;
    const id = search ? search.replace("?id=", "") : hash.replace("#", "");

    if (id) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView();
        const headerHeight = 50;
        const secondaryHeaderHeight = 48;
        const announcementBarHeight = 30;
        window.scrollBy(
          0,
          -(headerHeight + secondaryHeaderHeight + announcementBarHeight)
        );
      }
    }

    // show popup, if any
    if (popup && popup.length > 0) {
      const currentPopup = popup.filter(
        pop =>
          decodeURI(pop.pageUrl || "") ==
          decodeURI(pathname + history.location.search)
      );
      if (currentPopup && currentPopup.length > 0) {
        let show = currentPopup[0].session == false;
        if (!show) {
          if (
            CookieService.getCookie(
              pathname.split("/").join("_") + "_" + currentPopup[0].heading
            ) != "show"
          ) {
            show = true;
          }
        }
        if (show) {
          dispatch(updateComponent(POPUP.CMSPOPUP, currentPopup[0], true));
          dispatch(updateModal(true));
        }
      }
    }
  }, [pathname, search]);

  useEffect(() => {
    // let isDragging = false;
    document.addEventListener("wheel", (e: WheelEvent) => {
      const elem = e.target as HTMLInputElement;
      if (
        e.target &&
        elem.tagName.toLowerCase() === "input" &&
        elem.type === "number" &&
        elem === document.activeElement &&
        !elem.readOnly
      ) {
        elem.readOnly = true;
        setTimeout(
          (el: HTMLInputElement) => {
            el.readOnly = false;
          },
          0,
          elem
        );
      }
    });

    const setInfoPopupCookie = () => {
      const cookieString =
        "checkoutinfopopup3=show; expires=Sat, 01 Jan 2050 00:00:01 UTC; path=/";
      document.cookie = cookieString;
      // this.setState({
      //     showInfoPopup: 'show'
      // })
    };
    const checkoutInfoPopupCookie = CookieService.getCookie(
      "checkoutinfopopup3"
    );
    const currencyPopup = CookieService.getCookie("currencypopup");
    const isBridalBasket = CookieService.getCookie("isBridal");
    const queryString = location.search;
    const urlParams = new URLSearchParams(queryString);
    const boId = urlParams.get("bo_id");
    const isHomePage = location.pathname == "/";

    const loginPopup = urlParams.get("loginpopup");
    // hide bosporus popup
    // const shownVideoPopup = sessionStorage.getItem("bosporus");
    // if (isHomePage && !shownVideoPopup) {
    //   dispatch(updateComponent(POPUP.VIDEOPOPUP, undefined, true));
    //   dispatch(updateModal(true));
    //   sessionStorage.setItem("bosporus", "1");
    // }
    const shownCerisePopup = sessionStorage.getItem("cerisedbl");
    const isCeriseCustomer =
      customerGroup == CUST.CERISE || customerGroup == CUST.CERISE_SITARA;
    if (
      isHomePage &&
      !shownCerisePopup &&
      isCeriseCustomer &&
      currency == "INR"
    ) {
      dispatch(updateComponent(POPUP.CERISE, undefined, true));
      dispatch(updateModal(true));
      sessionStorage.setItem("cerisedbl", "1");
    }
    if (
      !loginPopup &&
      isHomePage &&
      isSuspended &&
      checkoutInfoPopupCookie != "show"
      // && currencyPopup
    ) {
      dispatch(
        updateComponent(
          POPUP.INFOPOPUP,
          { acceptCondition: setInfoPopupCookie },
          true
        )
      );
      dispatch(updateModal(true));
    }

    if (
      !currencyPopup &&
      (!isBridalBasket || isBridalBasket == "no") &&
      !boId &&
      !location.pathname.includes("/order/orderconfirmation/") &&
      !location.pathname.includes("/bridal/") &&
      !announcementData.isBridalActive
    ) {
      // dispatch(updateComponent(POPUP.CURRENCY, null, true));
      // dispatch(updateModal(true));
    }

    const cookieCurrency = CookieService.getCookie("currency");
    if (
      !cookieCurrency &&
      !(
        location.pathname.includes("/bridal/") ||
        announcementData.isBridalActive ||
        bridal
      )
    ) {
      LoginService.getClientIpCurrency()
        .then(curr => {
          if (curr != "error") {
            if (curr && !cookieCurrency) {
              const goCurrencyValue: any = curr;
              if (
                goCurrencyValue.toString().toLowerCase() !=
                currency.toString().toLowerCase()
              ) {
                const data: any = {
                  currency: goCurrencyValue.toString().toUpperCase()
                };
                LoginService.changeCurrency(dispatch, data);
              } else {
                CookieService.setCookie(
                  "currency",
                  goCurrencyValue.toString().toUpperCase(),
                  365
                );
              }
            }
          } else {
            CookieService.setCookie("currency", "INR", 365);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
    if (cookieCurrency != currency) {
      CookieService.setCookie("currency", currency, 365);
    }
    if (history.location.pathname == "/maintenance") {
      history.push("/");
    }
  }, []);

  useEffect(() => {
    if (bridal) {
      CookieService.setCookie("isBridal", "yes");
    } else {
      CookieService.setCookie("isBridal", "no");
    }
  }, [bridal]);
  const isCheckout =
    pathname.indexOf("/checkout") > -1 ||
    pathname == "/cart" ||
    pathname == "/cart/";
  const confirmation = pathname.indexOf("order/orderconfirmation") > -1;
  const backOrder = pathname.indexOf("backend-order-error") > -1;
  const maintenance = pathname.indexOf("maintenance") > -1;
  const value =
    pathname.indexOf("auth") > -1
      ? false
      : typeof document == "undefined"
      ? true
      : dominList.some((v: any) => location.origin.includes(v))
      ? CookieService.getCookie("auth")
      : true;

  const minimalPage = confirmation || backOrder || maintenance;
  return (
    <Fragment>
      {/* <Whatsapp /> */}
      {!value
        ? ""
        : !minimalPage && (isCheckout ? <CheckoutHeader /> : <Header />)}
      {isLoading && <Loader />}
      <div
        className={
          minimalPage
            ? ""
            : cs(globalStyles.contentContainer, bootstrap.containerFluid)
        }
        id="no-content"
      >
        {/* {!isauth && <FormPage/>} */}
        <Switch>{routes}</Switch>
      </div>
      {value && !(minimalPage || isCheckout) && <Footer />}
      <Modal />
    </Fragment>
  );
};

export default BaseLayout;
