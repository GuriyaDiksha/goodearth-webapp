import React, { Fragment, useEffect, useState } from "react";
import { Redirect, Route, Switch, useHistory } from "react-router";
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
import { GA_CALLS } from "constants/cookieConsent";
import CheckoutFooter from "containers/checkout/checkoutFooter";
import { updateOpenCookiePopup } from "actions/info";
import { updateRegion } from "actions/widget";
import { isAEDDisabled } from "typings/currency";
// import { CUST } from "constants/util";
// import * as _ from "lodash";
const BaseLayout: React.FC = () => {
  const history = useHistory();
  const { pathname, search } = history.location;
  const dispatch = useDispatch();
  const {
    currency,
    basket: { bridal },
    header: { announcementData },
    device: { orientation, tablet, mobile },
    user: { customerGroup, isLoggedIn }
  } = useSelector((state: AppState) => state);
  const {
    modal: { component }
  } = useSelector((state: AppState) => state);
  const {
    info: { isLoading, isCheckoutLoading }
  } = useSelector((state: AppState) => state);
  // const { customerGroup } = useSelector((state: AppState) => state.user);
  // don't show info popup
  const isSuspended = false;
  const popup = useSelector((state: AppState) => state.popup);
  // const isLoggedIn = useSelector((state: AppState) => state.user.isLoggedIn);
  const [prevUrl, setPrevUrl] = useState("");
  const dominList = ["dv", "stg", "pprod"];
  // const flower = [flowerimg1, flowerimg2, flowerimg3, flowerimg4];
  const [isUAEpage, setIsUAEpage] = useState(true);
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
      const userConsent = CookieService.getCookie("consent").split(",");
      if (userConsent.includes(GA_CALLS)) {
        dataLayer.push({
          event: "App Icon Click",
          page: location
        });
      }
    }
  }, []);
  // useEffect(() => {
  // const chatContainer = document.getElementById("mobile-chat-container");
  // if (chatContainer) {
  //   if (currency == "INR" && chatContainer) {
  //     chatContainer.style.display = "none";
  //   } else if (chatContainer) {
  //     chatContainer.style.display = "block";
  //   }
  // } else {
  //   setTimeout(() => {
  //     const chatContainer = document.getElementById("mobile-chat-container");
  //     if (currency == "INR" && chatContainer) {
  //       chatContainer.style.display = "none";
  //     } else if (chatContainer) {
  //       chatContainer.style.display = "block";
  //     }
  //   }, 1000);
  // }

  // const ele:any = document.getElementById("mobile-chat-container");
  // if(currency != "INR") {
  //   ele?.style.display = 'none';
  // } else{
  //   ele?.style.display = 'block';
  // }
  // }, []);

  useEffect(() => {
    const isHomePage = location.pathname == "/";
    if (isHomePage) {
      const userConsent = CookieService.getCookie("consent").split(",");
      if (userConsent.includes(GA_CALLS)) {
        dataLayer.push({
          "Event Category": "General Pages",
          "Event Action": "Home Page",
          "Event Label": " web|home",
          "Time Stamp": new Date().toISOString(),
          "Page Url": location.hostname + location.pathname,
          "Page Type": "Home",
          "Login Status": isLoggedIn ? "logged in" : "logged out"
        });
      }
    }
    CookieService.setCookie("prevUrl", prevUrl);
    setPrevUrl(location.href);
  }, [history.location.pathname, history.location.search]);

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
      if (orientation == "landscape") {
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

  const showPopup = (isShow: boolean) => {
    if (popup && popup.length > 0) {
      const currentPopup = popup.filter(
        pop =>
          decodeURI(pop.pageUrl || "") ==
            decodeURI(pathname + history.location.search) ||
          pop?.pageRules === "ANY_PAGE"
      );

      if (currentPopup && currentPopup.length > 0) {
        //Check for session
        let show = currentPopup[0].session == false;

        //Check for cookie path
        if (!show) {
          if (CookieService.getCookie("_" + currentPopup[0].id) != "show") {
            show = true;
            CookieService.setCookie("_" + currentPopup[0].id, "show");
          }
        }

        //Check for when to show
        if (currentPopup[0]?.whenToShow === "AFTER_SECONDS" && show) {
          show = false;
          setTimeout(() => {
            show = true;
            dispatch(updateComponent(POPUP.CMSPOPUP, currentPopup[0], true));
            dispatch(updateModal(true));
          }, (currentPopup[0]?.timeInSeconds || 0) * 1000);
        } else if (
          currentPopup[0]?.whenToShow === "AFTER_SCROLL" &&
          isShow &&
          show
        ) {
          show = isShow;
        }

        if (show) {
          dispatch(updateComponent(POPUP.CMSPOPUP, currentPopup[0], true));
          dispatch(updateModal(true));
        }
      }
    }
  };

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

    let isScroll = false;
    const currentPopup = popup.filter(
      pop =>
        decodeURI(pop.pageUrl || "") ==
          decodeURI(pathname + history.location.search) ||
        pop?.pageRules === "ANY_PAGE"
    );
    const handleScroll = () => {
      if (currentPopup[0]?.whenToShow === "AFTER_SCROLL" && !isScroll) {
        isScroll = true;
        showPopup(true);
      }
    };

    // show popup, if any
    if (currentPopup[0]?.whenToShow !== "AFTER_SCROLL") {
      showPopup(false);
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.addEventListener("scroll", handleScroll);
    };
  }, [pathname, search, popup.length]);

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
    // const boId = urlParams.get("bo_id");
    const isHomePage = location.pathname == "/";

    const loginPopup = urlParams.get("loginpopup");
    // hide bosporus popup
    // const shownVideoPopup = sessionStorage.getItem("bosporus");
    // if (isHomePage && !shownVideoPopup) {
    //   dispatch(updateComponent(POPUP.VIDEOPOPUP, undefined, true));
    //   dispatch(updateModal(true));
    //   sessionStorage.setItem("bosporus", "1");
    // }
    // hide cerise popup
    // const shownCerisePopup = sessionStorage.getItem("cerisedbl");
    // const isCeriseCustomer =
    //   customerGroup == CUST.CERISE || customerGroup == CUST.CERISE_SITARA;
    // if (
    //   isHomePage &&
    //   !shownCerisePopup &&
    //   isCeriseCustomer &&
    //   currency == "INR"
    // ) {
    //   dispatch(updateComponent(POPUP.CERISE, undefined, true));
    //   dispatch(updateModal(true));
    //   sessionStorage.setItem("cerisedbl", "1");
    // }
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
      // !boId &&
      !location.pathname.includes("/order/orderconfirmation/") &&
      !location.pathname.includes("/registry/") &&
      !announcementData.isBridalActive
    ) {
      // dispatch(updateComponent(POPUP.CURRENCY, null, true));
      // dispatch(updateModal(true));
    }

    const cookieCurrency = CookieService.getCookie("currency");
    const cookieRegion = CookieService.getCookie("region");
    if (
      (!cookieCurrency &&
        !(
          location.pathname.includes("/registry/") ||
          announcementData.isBridalActive ||
          bridal
        )) ||
      !cookieRegion
    ) {
      dispatch(updateOpenCookiePopup(false));
      LoginService.getClientIpCurrency(dispatch)
        .then(curr => {
          const countryName = CookieService.getCookie("country");

          if (countryName.toLowerCase() === "india") {
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
                  LoginService.changeCurrency(dispatch, data).then(res => {
                    setTimeout(() => {
                      LoginService.reloadPage(
                        dispatch,
                        data?.currency,
                        customerGroup
                      );
                    }, 2000);
                  });
                } else {
                  CookieService.setCookie(
                    "currency",
                    goCurrencyValue.toString().toUpperCase(),
                    365
                  );
                  dispatch(
                    updateRegion({
                      region: "India",
                      ip: "",
                      country: "India"
                    })
                  );
                }
              }
            } else {
              CookieService.setCookie("currency", "INR", 365);
            }

            dispatch(updateOpenCookiePopup(true));
          } else if (
            isAEDDisabled &&
            countryName.toLowerCase() === "united arab emirates"
          ) {
            if (isUAEpage && location.pathname != "/auth") {
              history.push("/uaeshop");
            }
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
                  LoginService.changeCurrency(dispatch, data).then(res => {
                    setTimeout(() => {
                      LoginService.reloadPage(
                        dispatch,
                        data?.currency,
                        customerGroup
                      );
                    }, 2000);
                  });
                } else {
                  CookieService.setCookie(
                    "currency",
                    goCurrencyValue.toString().toUpperCase(),
                    365
                  );
                  dispatch(
                    updateRegion({
                      region: "United Arab Emirates",
                      ip: "",
                      country: "United Arab Emirates"
                    })
                  );
                }
              }
            } else {
              CookieService.setCookie("currency", "AED", 365);
            }

            dispatch(updateOpenCookiePopup(true));
          } else {
            dispatch(
              updateComponent(
                POPUP.COUNTRYPOPUP,
                { initSection: 1 },
                mobile ? false : true
              )
            );
            dispatch(updateModal(true));
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
    // if (cookieCurrency != currency) {
    //   CookieService.setCookie("currency", currency, 365);
    // }
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

  // const chatContainer =
  //   typeof document == "object"
  //     ? document?.getElementById("mobile-chat-container")
  //     : "";
  // if (chatContainer) {
  //   if (currency == "INR" && chatContainer) {
  //     chatContainer.style.display = "none";
  //   } else if (chatContainer) {
  //     chatContainer.style.display = "block";
  //   }
  // }

  // Define the pages where you want to hide the header and footer both
  const hideHeaderFooterPages = [
    "/goodearth-corporate-catalogue",
    "/uaeshop",
    "/backend-order-error",
    "/maintenance"
  ];
  // Check if the current route matches any of the routes
  const hideHeaderFooter = hideHeaderFooterPages.includes(pathname);

  // Define the pages where you want to hide footer only
  const hideFooterPages = ["/cart"];
  const hideFooterOnly = hideFooterPages.includes(pathname);

  const isCheckout =
    pathname.indexOf("/checkout") > -1 ||
    pathname.indexOf("/gc_checkout") > -1 ||
    pathname.indexOf("order/orderconfirmation") > -1;
  // const isCart = pathname == "/cart" || pathname == "/cart/";
  // const isCorporate =
  //   pathname == "/goodearth-corporate-catalogue" ||
  //   pathname == "/goodearth-corporate-catalogue/";
  // const isUaeshop =  pathname == "/uaeshop" || pathname == "/uaeshop/";
  // const confirmation = pathname.indexOf("order/orderconfirmation") > -1;
  // const backOrder = pathname.indexOf("backend-order-error") > -1;
  // const maintenance = pathname.indexOf("maintenance") > -1;
  const value =
    pathname.indexOf("auth") > -1
      ? false
      : typeof document == "undefined"
      ? true
      : dominList.some((v: any) => location.origin.includes(v))
      ? CookieService.getCookie("auth")
      : true;

  // const minimalPage = backOrder || maintenance;

  // redirection on UAEshop Page whne uae country encountered
  useEffect(() => {
    if (location.pathname != "/uaeshop") {
      setIsUAEpage(false);
    }
  }, [pathname]);

  return (
    <Fragment>
      {/* <Whatsapp /> */}
      {value &&
        !hideHeaderFooter &&
        (isCheckout ? <CheckoutHeader /> : <Header />)}
      {(isLoading || isCheckoutLoading) && <Loader />}
      <div
        className={
          hideHeaderFooter
            ? ""
            : cs(globalStyles.contentContainer, bootstrap.containerFluid, {
                //Failsafe if padding is required in other pages than pdp
                [bootstrap.noPad]:
                  pathname.indexOf("/catalogue") > -1 && !mobile
              })
        }
        id="no-content"
      >
        {/* {!isauth && <FormPage/>} */}
        <Switch>
          {routes}
          <Route path="*">
            <Redirect to="/404" />
          </Route>
        </Switch>
      </div>
      {value &&
        !hideHeaderFooter &&
        (isCheckout ? <CheckoutFooter /> : !hideFooterOnly && <Footer />)}
      <Modal />
    </Fragment>
  );
};

export default BaseLayout;
