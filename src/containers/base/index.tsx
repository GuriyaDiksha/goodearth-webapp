import React, { Fragment, useEffect } from "react";
import { Switch, useLocation } from "react-router";
import routes from "routes/index";
import Header from "components/header";
import Footer from "components/footer";
import Modal from "components/Modal";
import LoginService from "services/login";
import CookieService from "services/cookie";
import CheckoutHeader from "containers/checkout/checkoutHeader";
import globalStyles from "styles/global.scss";
import "styles/chat.css";
import { AppState } from "reducers/typings";
import { useSelector, useDispatch } from "react-redux";
import { updateComponent, updateModal } from "actions/modal";
// import flowerimg1 from "images/flower1.gif";
// import flowerimg2 from "images/flower2.gif";
// import flowerimg3 from "images/flower3.gif";
// import flowerimg4 from "images/flower4.gif";
// import MakerPopup from "components/Popups/MakerPopup";
import CurrencyPopup from "components/Popups/CurrencyPopup";
// import * as _ from "lodash";
const BaseLayout: React.FC = () => {
  const location = useLocation();
  const { pathname } = location;
  const dispatch = useDispatch();
  const {
    currency
    // device: { mobile }
  } = useSelector((state: AppState) => state);
  // const isSuspended = true;
  // const flower = [flowerimg1, flowerimg2, flowerimg3, flowerimg4];
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

  // const setMakerPopupCookie = () => {
  //   const cookieString =
  //     "makerinfo=show; expires=Sat, 01 Jan 2050 00:00:01 UTC; path=/";
  //   document.cookie = cookieString;
  //   CookieService.setCookie("makerinfo", "show", 365);
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
    // const popupCookie = CookieService.getCookie("makerinfo");
    const currencyPopup = CookieService.getCookie("currencypopup");
    const queryString = location.search;
    const urlParams = new URLSearchParams(queryString);
    const boId = urlParams.get("bo_id");
    // const isHomePage = location.pathname == "/";
    // if (isHomePage && isSuspended && popupCookie != "show" && currencyPopup) {
    //   dispatch(
    //     updateComponent(
    //       <MakerPopup acceptCondition={setMakerPopupCookie} />,
    //       true
    //     )
    //   );
    //   dispatch(updateModal(true));
    // }

    if (
      !currencyPopup &&
      !boId &&
      !location.pathname.includes("/order/orderconfirmation/")
    ) {
      dispatch(updateComponent(<CurrencyPopup />, true));
      dispatch(updateModal(true));
    }

    const cookieCurrency = CookieService.getCookie("currency");
    if (!cookieCurrency) {
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
  }, []);

  const isCheckout =
    pathname.indexOf("/checkout") > -1 || pathname.indexOf("/cart") > -1;
  const confirmation = pathname.indexOf("order/orderconfirmation") > -1;
  const backOrder = pathname.indexOf("backend-order-error") > -1;
  if (confirmation || backOrder) {
    return (
      <div>
        <Switch>{routes}</Switch>
        <Modal />
      </div>
    );
  } else {
    return (
      <Fragment>
        {isCheckout ? <CheckoutHeader /> : <Header />}
        <div className={globalStyles.contentContainer} id="no-content">
          <Switch>{routes}</Switch>
        </div>
        {isCheckout ? "" : <Footer />}
        <Modal />
      </Fragment>
    );
  }
};

export default BaseLayout;
