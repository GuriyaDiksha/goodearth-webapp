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
import AddressSection from "./component/address";
import OrderSummary from "./component/orderSummary";
import PromoSection from "./component/promo";
import PaymentSection from "./component/payment";

const mapStateToProps = (state: AppState) => {
  return {
    refresh: state.user.refresh,
    location: state.router.location,
    user: state.user,
    basket: state.basket,
    mobile: state.device.mobile,
    currency: state.currency
  };
};
type props = ReturnType<typeof mapStateToProps>;

class Checkout extends React.Component<props, { activeStep: string }> {
  constructor(props: props) {
    super(props);
    this.state = {
      activeStep: props.user.isLoggedIn ? Steps.STEP_PROMO : Steps.STEP_LOGIN
    };
  }

  isActiveStep = (step: string) => {
    return this.state.activeStep == step;
  };

  nextStep = (step: string) => {
    this.setState({
      activeStep: step
    });
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
                globalStyles.voffset5
              )}
            >
              <LoginSection
                isActive={this.isActiveStep(Steps.STEP_LOGIN)}
                user={this.props.user}
              />
              <AddressSection
                isActive={this.isActiveStep(Steps.STEP_SHIPPING)}
                user={this.props.user}
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
            <div
              className={cs(
                bootstrap.col12,
                bootstrap.colMd4,
                globalStyles.voffset5
              )}
            >
              <OrderSummary
                mobile={this.props.mobile}
                currency={this.props.currency}
                shippingAddress={{}}
                salestatus={false}
                validbo={true}
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

export default connect(mapStateToProps)(Checkout);
