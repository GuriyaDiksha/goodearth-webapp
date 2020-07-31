import React, { Fragment } from "react";
import { Switch } from "react-router";
import routes from "routes/index";
import Header from "components/header";
import Footer from "components/footer";
import Modal from "components/Modal";
import { AppState } from "reducers/typings";
import { connect } from "react-redux";
import CheckoutHeader from "containers/checkout/checkoutHeader";
import globalStyles from "styles/global.scss";
import "styles/chat.css";

const mapStateToProps = (state: AppState) => {
  return {
    refresh: state.user.refresh,
    location: state.router.location
  };
};
type props = ReturnType<typeof mapStateToProps>;

class BaseLayout extends React.Component<props, {}> {
  render() {
    const {
      location: { pathname }
    } = this.props;
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
  }
}

export default connect(mapStateToProps)(BaseLayout);
