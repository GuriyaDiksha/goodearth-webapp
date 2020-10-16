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
import InfoPopup from "components/Popups/InfoPopup";
import flowerimg from "images/flower.gif";

const BaseLayout: React.FC = () => {
  const location = useLocation();
  const { pathname } = location;
  const dispatch = useDispatch();
  const { currency } = useSelector((state: AppState) => state);
  // const [showInfoPopup, setShowInfoPopup] = useState("yes");
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

  const setInfoPopupCookie = () => {
    const cookieString =
      "suspensioninfo=show; expires=Sat, 01 Jan 2050 00:00:01 UTC; path=/";
    document.cookie = cookieString;
    CookieService.setCookie("suspensioninfo", "show", 365);
    // setShowInfoPopup("show");
  };

  useEffect(() => {
    // document.addEventListener("wheel", )
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
    document.addEventListener("click", (e: any) => {
      const x = e.clientX - 100;
      const y = e.clientY - 50;
      const img = document.createElement("img");
      img.src = flowerimg;
      img.style.position = "fixed";
      img.style.width = "100px";
      img.style.height = "100px";
      img.style.top = y + "px";
      img.style.left = x + "px";
      document.body.appendChild(img);
      setTimeout(() => {
        document.body.removeChild(img);
      }, 3000);
    });
    const popupCookie = CookieService.getCookie("suspensioninfo");
    // setShowInfoPopup(popupCookie);
    if (isSuspended && popupCookie != "show") {
      dispatch(
        updateComponent(
          <InfoPopup acceptCondition={setInfoPopupCookie} />,
          true
        )
      );
      dispatch(updateModal(true));
    }
    setTimeout(() => {
      const goCurrencyElem: any = document.getElementById("defaultcurrency");
      const cookieCurrency = CookieService.getCookie("currency");
      if (goCurrencyElem && !cookieCurrency) {
        const goCurrencyValue: any = goCurrencyElem.value;
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
    }, 2000);
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
