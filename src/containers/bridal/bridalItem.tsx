import React from "react";
import { AppState } from "reducers/typings";
import { BridalItemData } from "containers/myAccount/components/Bridal/typings";
import { showMessage } from "actions/growlMessage";
import { Dispatch } from "redux";
import BasketService from "../../services/basket";
import { connect } from "react-redux";
import { Currency, currencyCode } from "typings/currency";

const mapStateToProps = (state: AppState) => {
  return {
    isSale: state.info.isSale
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    addToBag: async (quantity: number, url: string, bridalId: number) => {
      try {
        const res = await BasketService.addToBasket(
          dispatch,
          0,
          quantity,
          url,
          bridalId
        );
        dispatch(showMessage("Item has been added to your bag!"));
        return res;
      } catch (err) {
        let errorMessage = err.response.data.reason;
        if (typeof errorMessage != "string") {
          errorMessage = "Can't add to bag";
        }
        dispatch(showMessage(errorMessage));
      }
    }
  };
};
type Props = {
  bridalItem: BridalItemData;
  bridalId: number;
  index: number;
  onMobileAdd: (index: number) => void;
  currency: Currency;
} & ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

type State = {
  qtyCurrent: number;
  buttonStatus: boolean;
  btnDisable: string;
  btnContent: string;
  err: string;
};

class BridalItem extends React.Component<Props, State> {
  state: State = {
    qtyCurrent: 1,
    buttonStatus: false,
    btnDisable: "cerise-btn hidden-xs hidden-sm",
    btnContent: "ADD TO BAG",
    err: ""
  };

  componentDidMount() {
    if (this.props.bridalItem.qtyRemaining == 0) {
      this.setState({
        buttonStatus: true,
        btnDisable: "cerise-btn hidden-xs hidden-sm disabled-input",
        btnContent: "Fulfilled"
      });
    } else if (this.props.bridalItem.stock == 0) {
      this.setState({
        buttonStatus: true,
        btnDisable: "cerise-btn hidden-xs hidden-sm disabled-input",
        btnContent: "Out Of Stock"
      });
    }
  }

  increaseState = () => {
    const maxQty = this.props.bridalItem.stock;
    let qtyCurrent = this.state.qtyCurrent;
    if (qtyCurrent < maxQty) {
      qtyCurrent += 1;
      this.setState({ qtyCurrent: qtyCurrent });
    } else {
      this.setState({ err: "Available qty in stock is " + maxQty });
    }
  };

  decreaseState = () => {
    let qtyCurrent = this.state.qtyCurrent;
    if (qtyCurrent > 1) {
      qtyCurrent -= 1;
      this.setState({ qtyCurrent: qtyCurrent, err: "" });
    }
  };

  addToBag() {
    const productUrl = `${__DOMAIN__}/myapi/products/${this.props.bridalItem.productId}/`;
    this.props.addToBag(this.state.qtyCurrent, productUrl, this.props.bridalId);
  }

  mobileAddToBag = () => {
    const mobileAddIndex = this.props.index;
    this.props.onMobileAdd(mobileAddIndex);
  };

  render() {
    const code = currencyCode[this.props.currency as Currency];
    return (
      <div className="cart cart-container">
        <div className="cart-item gutter15">
          <div className="row flex">
            <div className="col-xs-5 col-md-2">
              <a>
                <img
                  className="product-image"
                  src={this.props.bridalItem.productImage}
                />
              </a>
            </div>
            <div className="col-xs-5 col-md-7">
              <div className="row-main">
                <div className="col-xs-12 col-md-6">
                  <div className="section section-info">
                    <div>
                      <div className="collection-name">
                        {this.props.bridalItem.collection}
                      </div>
                      <div className="product-name">
                        <a>{this.props.bridalItem.productName}</a>
                      </div>
                    </div>
                    <div className="product-price">
                      {this.props.isSale && this.props.bridalItem.discount ? (
                        <span className="product-price">
                          <span className="discountprice">
                            {String.fromCharCode(...code)}{" "}
                            {
                              this.props.bridalItem.discountedPrice[
                                this.props.currency
                              ]
                            }
                          </span>
                          &nbsp;{" "}
                          <span className="strikeprice">
                            {String.fromCharCode(...code)}{" "}
                            {this.props.bridalItem.price[this.props.currency]}
                          </span>
                        </span>
                      ) : (
                        <span className="product-price">
                          {String.fromCharCode(...code)}{" "}
                          {this.props.bridalItem.price[this.props.currency]}
                        </span>
                      )}
                    </div>
                    <div className="smallfont">
                      SIZE: {this.props.bridalItem.size}
                    </div>
                    <div className="smallfont voffset1">
                      SKU: {this.props.bridalItem.sku}
                    </div>
                    <div
                      className="icon-cart hidden-md hidden-lg voffset3"
                      onClick={this.mobileAddToBag}
                    >
                      <img
                        src="/static/img/icons_cartregistry-details.svg"
                        width="40"
                        height="40"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-xs-12 col-md-6 hidden-xs hidden-sm">
                  <div className="section section-middle">
                    <div className="">
                      <div className="hidden-xs hidden-sm text-muted">
                        REQUESTED
                      </div>
                      <div className="text-center c10-L-R">
                        {this.props.bridalItem.qtyRequested}
                      </div>
                    </div>
                    <div className="">
                      <div className="hidden-xs hidden-sm text-muted">
                        REMAINING
                      </div>
                      <div className="text-center c10-L-R">
                        {this.props.bridalItem.qtyRemaining}
                      </div>
                    </div>

                    <div className="">
                      <div className="hidden-xs hidden-sm text-muted">QTY</div>
                      <div className="widget-qty">
                        <span className="btn-qty" onClick={this.decreaseState}>
                          -
                        </span>
                        <span className="qty">{this.state.qtyCurrent}</span>
                        <span className="btn-qty" onClick={this.increaseState}>
                          +
                        </span>
                      </div>
                      {this.state.err ? (
                        <div className="error-msg text-center">
                          {this.state.err}
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xs-2 col-md-3 text-center">
              <div className="section">
                <div className="manage-height">
                  <button
                    className={this.state.btnDisable}
                    onClick={this.addToBag}
                    disabled={this.state.buttonStatus}
                  >
                    {this.state.btnContent}
                  </button>
                  <div className="c10-L-R  hidden-xs hidden-sm voffset2">
                    For regular orders, the delivery time will be 6-8 business
                    days
                  </div>
                  <div className="cerise">
                    {this.state.btnContent == "Fulfilled" ||
                    this.state.btnContent == "Out Of Stock"
                      ? this.state.btnContent
                      : ""}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr className="hr" />
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BridalItem);
