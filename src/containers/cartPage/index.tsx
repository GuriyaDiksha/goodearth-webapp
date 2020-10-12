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
import { Dispatch } from "redux";
import WishlistService from "services/wishlist";
import { updateBasket } from "actions/basket";
import { showMessage } from "actions/growlMessage";
import BasketService from "services/basket";
import { ProductID } from "typings/id";
import { updateModal } from "actions/modal";

const mapStateToProps = (state: AppState) => {
  return {
    currency: state.currency,
    mobile: state.device.mobile,
    cart: state.basket,
    isSale: state.info.isSale,
    location: state.router.location
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    showNotify: (message: string) => {
      dispatch(showMessage(message, 6000));
    },
    undoMoveToWishlist: async () => {
      const res = await WishlistService.undoMoveToWishlist(dispatch);
      dispatch(updateBasket(res.basket));
      // BasketService.fetchBasket(dispatch, true);
      return res;
    },
    fetchBasket: () => {
      BasketService.fetchBasket(dispatch, "cart");
    },
    deleteBasket: async (basketLineId: ProductID) => {
      const res = await BasketService.deleteBasket(
        dispatch,
        basketLineId,
        "cart"
      );
      dispatch(updateModal(false));
      return res;
    }
  };
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

type State = {
  catLanding: boolean;
  show: boolean;
  showbottom: boolean;
  isSale: boolean;
  showUndoWishlist: boolean;
  showNotifyMessage: boolean;
};
class CartPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      catLanding: false,
      show: false,
      showbottom: false,
      isSale: false,
      showUndoWishlist: false,
      showNotifyMessage: false
    };
  }

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
    this.props.fetchBasket();
    dataLayer.push({
      event: "CartPageView",
      PageURL: this.props.location.pathname,
      PageTitle: "virtual_cartpage_view"
    });
  }

  componentWillUnmount() {
    const chatButtonElem = document.getElementById("chat-button");
    const scrollToTopButtonElem = document.getElementById("scrollToTop-btn");
    if (scrollToTopButtonElem) {
      scrollToTopButtonElem.style.removeProperty("display");
      scrollToTopButtonElem.style.removeProperty("bottom");
    }
    if (chatButtonElem) {
      chatButtonElem.style.removeProperty("display");
      chatButtonElem.style.removeProperty("bottom");
    }
  }

  onNotifyCart = (basketLineId: ProductID) => {
    this.props.deleteBasket(basketLineId).then(res => {
      this.setState({
        showNotifyMessage: true
      });
    });
  };

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

  onUndoWishlistClick = () => {
    // var self = this;
    this.props.undoMoveToWishlist().then(data => {
      this.setState({
        showUndoWishlist: false
      });
      // if (this.props.getShippingCharges) {
      //     this.props.getShippingCharges();
      // }
      // CheckoutApi.reCalculateGift({}, this.props.dispatch)
    });
  };

  onMoveToWishlist = () => {
    this.setState({
      showUndoWishlist: true,
      showNotifyMessage: false
    });
  };

  getItems() {
    const {
      cart: { lineItems },
      currency
    } = this.props;

    const item = lineItems.map(item => {
      return (
        <CartItems
          onNotifyCart={this.onNotifyCart}
          mobile={this.props.mobile}
          key={item.id}
          {...item}
          currency={currency}
          saleStatus={this.props.isSale}
          onMoveToWishlist={this.onMoveToWishlist}
        />
      );
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

  renderMessage() {
    // if(window.ischeckout) {
    //     return  <div className="notify-message ">
    //                     Due to year closing activities, we will <span className="link-text-underline">not</span> be
    //                     able to accept your orders till
    //                     <span className="link-text-underline"> 31st March 2019, midnight IST.</span> Regret the
    //                     inconvenience. We shall resume our normal operations soon
    //                     after.
    //                 </div>
    // }
    if (this.state.showUndoWishlist) {
      return (
        <div className={styles.message}>
          Your item has been moved to wishlist.{" "}
          <span
            className={cs(globalStyles.colorPrimary, globalStyles.pointer)}
            onClick={this.onUndoWishlistClick}
          >
            Undo
          </span>
        </div>
      );
    }

    if (this.state.showNotifyMessage) {
      return (
        <div className={styles.message}>
          We’ll notify you once we have it back in stock. Your item has been
          removed.
        </div>
      );
    }

    if (this.props.cart ? this.props.cart.updated : false) {
      return (
        <div className={styles.message}>
          Quantity of some items have been updated.
        </div>
      );
    }

    // if(this.props.cart?this.props.unpublish:false) {
    //      return (
    //         <div className={styles.message}>
    //             Due to unavailability of some products your cart has been updated.
    //         </div>
    //     )
    // }

    return null;
  }

  render() {
    return (
      <div className={cs(bootstrap.row, styles.pageBody)}>
        <div
          className={cs(bootstrap.col12, bootstrap.colMd8, styles.bagContents)}
        >
          {this.renderMessage()}
          {this.getItems()}
        </div>
        <div className={cs(bootstrap.col12, bootstrap.colMd4)}>
          <OrderSummary
            mobile={this.props.mobile}
            currency={this.props.currency}
            shippingAddress={{}}
            salestatus={this.props.isSale}
            validbo={false}
            basket={this.props.cart}
            page="cart"
          />
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CartPage);
export { initActionCollection };
