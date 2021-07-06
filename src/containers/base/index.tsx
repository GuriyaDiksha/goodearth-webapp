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
// import styles from "./styles.scss";
// import iconStyles from "../../styles/iconFonts.scss";
import cs from "classnames";
// import MusicPlayer from "components/MusicBar";
// import whatsapp from "../../images/whatsapp.svg";
// import flowerimg2 from "images/flower2.gif";
// import flowerimg3 from "images/flower3.gif";
// import flowerimg4 from "images/flower4.gif";
// import MakerPopup from "components/Popups/MakerPopup";
import { POPUP } from "constants/components";
// import * as _ from "lodash";
const BaseLayout: React.FC = () => {
  const history = useHistory();
  const { pathname } = history.location;
  const dispatch = useDispatch();
  const {
    currency,
    // device: { mobile }
    basket: { bridal },
    header: { announcementData }
  } = useSelector((state: AppState) => state);
  const isSuspended = true;
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
  }, [pathname]);

  // history.listen((location, action) => {
  //   if (action == "POP" && CookieService.getCookie("currency") == "INR") {
  //     history.push("/maintenance");
  //   }
  // });
  // const setMakerPopupCookie = () => {
  //   const cookieString =
  //     "makerinfo=show; expires=Sat, 01 Jan 2050 00:00:01 UTC; path=/";
  //   document.cookie = cookieString;
  //   CookieService.setCookie("makerinfo", "show", 365);
  // };
  // const Whatsapp = () => {
  //   return (
  //     <div className={"whatsapp-active"} id={"whatsapp"}>
  //       <a
  //         href={"https://wa.me/+917669303665"}
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         {/* <i className={cs(iconStyles.icon,iconStyles.iconFooterWhatsapp)}></i> */}
  //         <img src={whatsapp} width="40px" />
  //       </a>
  //     </div>
  //   );
  // };
  // const throttle = _.throttle((e: any) => {
  //   const x = e.clientX - 100;
  //   const y = e.clientY - 50;
  //   const img = document.createElement("img");
  //   img.src = flower[Math.floor(Math.random() * Math.floor(4))];
  //   img.style.position = "fixed";
  //   img.classList.add("flower-img");
  //   img.style.width = "150px";
  //   img.style.height = "150px";
  //   img.style.top = y + "px";
  //   img.style.left = x + "px";
  //   document.body.appendChild(img);
  //   setTimeout(() => {
  //     document.body.removeChild(img);
  //   }, 2000);
  // }, 100);
  // }

  // if (
  //   typeof document == "object" &&
  //   CookieService.getCookie("currency") == "INR" &&
  //   CookieService.getCookie("currencypopup") &&
  //   history.location.pathname != "/maintenance"
  // ) {
  //   // debugger
  //   history.push("/maintenance");
  // }

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

    // document.addEventListener("mousedown", (e: any) => {
    //   isDragging = true;
    // });
    // document.addEventListener("mousemove", (e: any) => {
    //   if (isDragging && !mobile) {
    //     throttle(e);
    //   }
    // });
    // document.addEventListener("mouseup", (e: any) => {
    //   isDragging = false;
    // });
    // document.addEventListener("click", (e: any) => {
    //   const x = e.clientX - 100;
    //   const y = e.clientY - 50;
    //   const img = document.createElement("img");
    //   img.src = flower[Math.floor(Math.random() * Math.floor(4))];
    //   img.style.position = "fixed";
    //   img.classList.add("flower-img");
    //   img.style.width = "150px";
    //   img.style.height = "150px";
    //   img.style.top = y + "px";
    //   img.style.left = x + "px";
    //   document.body.appendChild(img);
    //   setTimeout(() => {
    //     document.body.removeChild(img);
    //   }, 2000);
    // });

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
    if (
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
    pathname.indexOf("/checkout") > -1 || pathname.indexOf("/cart") > -1;
  const confirmation = pathname.indexOf("order/orderconfirmation") > -1;
  const backOrder = pathname.indexOf("backend-order-error") > -1;
  const maintenance = pathname.indexOf("maintenance") > -1;
  const minimalPage = confirmation || backOrder || maintenance;
  return (
    <Fragment>
      {/* <Whatsapp /> */}
      {!minimalPage && (isCheckout ? <CheckoutHeader /> : <Header />)}
      <div
        className={
          minimalPage
            ? ""
            : cs(globalStyles.contentContainer, bootstrap.containerFluid)
        }
        id="no-content"
      >
        {/* <MusicPlayer /> */}
        <Switch>{routes}</Switch>
      </div>
      {(!minimalPage || !isCheckout) && <Footer />}
      <Modal />
    </Fragment>
  );
};

export default BaseLayout;
