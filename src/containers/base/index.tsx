import React, { Fragment, useEffect } from "react";
import { Switch, useLocation } from "react-router";
import routes from "routes/index";
import Header from "components/header";
import Footer from "components/footer";
import Modal from "components/Modal";
import CheckoutHeader from "containers/checkout/checkoutHeader";
import globalStyles from "styles/global.scss";
import "styles/chat.css";

const BaseLayout: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

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
        <div className={globalStyles.contentContainer}>
          <Switch>{routes}</Switch>
        </div>
        {isCheckout ? "" : <Footer />}
        <Modal />
      </Fragment>
    );
  }
};

export default BaseLayout;
