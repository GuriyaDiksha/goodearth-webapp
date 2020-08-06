import React from "react";
// import { Link } from "react-router-dom";
import initActionCollection from "./initAction";
import cs from "classnames";
import { AppState } from "reducers/typings";
import { connect } from "react-redux";
import styles from "./styles.scss";
import globalStyles from "styles/global.scss";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
import CartItems from "./cartItem";
import OrderSummary from "containers/checkout/component/orderSummary";
import motifTigerTree from "../../images/motifTigerTree.png";
import { Link } from "react-router-dom";

const mapStateToProps = (state: AppState) => {
  return {
    currency: state.currency,
    mobile: state.device.mobile,
    cart: state.basket
  };
};
type Props = ReturnType<typeof mapStateToProps>;

class CartPage extends React.Component<
  Props,
  { catLanding: boolean; show: boolean; showbottom: boolean; isSale: boolean }
> {
  componentDidMount() {
    const chatButtonElem = document.getElementById("chat-button");
    const scrollToTopButtonElem = document.getElementById("scrollToTop-btn");
    if (scrollToTopButtonElem) {
      scrollToTopButtonElem.style.display = "none";
      scrollToTopButtonElem.style.bottom = "65px";
    }
    if (chatButtonElem) {
      chatButtonElem.style.display = "none";
      chatButtonElem.style.bottom = "10px";
    }
  }

  hasOutOfStockItems = () => {
    const items = this.props.cart.lineItems;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.product.stockRecords[0].numInStock < 1) {
          return true;
        }
      }
    }
    return false;
  };

  getItemsCount() {
    let count = 0;
    const items = this.props.cart.lineItems;
    for (let i = 0; i < items.length; i++) {
      count = count + items[i].quantity;
    }
    return count;
  }

  getItems() {
    const {
      cart: { lineItems },
      currency
    } = this.props;

    const item = lineItems.map(item => {
      return <CartItems key={item.id} {...item} currency={currency} />;
    });
    return item.length > 0 ? (
      item
    ) : (
      // <p className={cs(globalStyles.marginT20, globalStyles.textCenter)}>
      //   No items added to bag.
      // </p>
      <div className={styles.cart}>
        {/* {this.renderMessage()} */}
        <div
          className={cs(
            globalStyles.marginT40,
            globalStyles.textCenter,
            bootstrap.colMd4,
            bootstrap.offsetMd4,
            bootstrap.colSm8,
            bootstrap.offsetSm2,
            bootstrap.col10,
            bootstrap.offset1
          )}
        >
          <div className={styles.emptyMsg}> Your bag is currently empty </div>
          <div className={cs(globalStyles.voffset3, globalStyles.c10LR)}>
            {" "}
            Looking to discover some ideas?{" "}
          </div>
          <div className={globalStyles.voffset5}>
            {" "}
            <Link to="/">
              <button className={globalStyles.ceriseBtn}>Explore</button>
            </Link>{" "}
          </div>
          <div className={globalStyles.voffset5}>
            {" "}
            <img src={motifTigerTree} />{" "}
          </div>
        </div>
      </div>
    );
  }

  goToCart() {
    // history.push("/cart")
  }

  canCheckout = () => {
    return true;
  };

  render() {
    return (
      <div className={cs(bootstrap.row, styles.pageBody)}>
        <div
          className={cs(bootstrap.col12, bootstrap.colMd8, styles.bagContents)}
        >
          {this.getItems()}
        </div>
        <div className={cs(bootstrap.col12, bootstrap.colMd4)}>
          <OrderSummary
            mobile={this.props.mobile}
            currency={this.props.currency}
            shippingAddress={{}}
            salestatus={false}
            validbo={false}
            basket={this.props.cart}
            page="cart"
          />
          `
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(CartPage);
export { initActionCollection };
