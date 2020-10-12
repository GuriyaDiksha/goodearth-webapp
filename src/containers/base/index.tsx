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
import MakerPopup from "components/Popups/MakerPopup";

const BaseLayout: React.FC = () => {
  const location = useLocation();
  const { pathname } = location;
  const dispatch = useDispatch();
  const { currency } = useSelector((state: AppState) => state);
  const isSuspended = true;

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

  const setMakerPopupCookie = () => {
    const cookieString =
      "suspensioninfo=show; expires=Sat, 01 Jan 2050 00:00:01 UTC; path=/";
    document.cookie = cookieString;
    CookieService.setCookie("suspensioninfo", "show", 365);
  };

  useEffect(() => {
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
    const popupCookie = CookieService.getCookie("suspensioninfo");
    if (isSuspended && popupCookie != "show") {
      dispatch(
        updateComponent(
          <MakerPopup acceptCondition={setMakerPopupCookie} />,
          true
        )
      );
      dispatch(updateModal(true));
    }
    LoginService.getClientIpCurrency()
      .then(curr => {
        if (curr != "error") {
          const cookieCurrency = CookieService.getCookie("currency");
          if (curr && !cookieCurrency) {
            const goCurrencyValue: any = curr;
            if (
              goCurrencyValue.toString().toLowerCase() !=
              currency.toString().toLowerCase()
            ) {
              const data: any = {
                currency: goCurrencyValue.toString().toLowerCase()
              };
              LoginService.changeCurrency(dispatch, data);
            }
          }
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const isCheckout =
    pathname.indexOf("/checkout") > -1 || pathname.indexOf("/cart") > -1;
  const confirmation = pathname.indexOf("order/orderconfirmation") > -1;
  if (confirmation) {
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
