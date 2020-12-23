import React from "react";
import { AppState } from "reducers/typings";
import { BridalItemData } from "containers/myAccount/components/Bridal/typings";
import { showMessage } from "actions/growlMessage";
import { Dispatch } from "redux";
import BasketService from "../../services/basket";
import { connect } from "react-redux";
import { Currency, currencyCode } from "typings/currency";
import bootstrap from "styles/bootstrap/bootstrap-grid.scss";
import styles from "./styles.scss";
import globalStyles from "../../styles/global.scss";
import cs from "classnames";
import cartIcon from "../../images/bridal/icons_cartregistry-details.svg";
const mapStateToProps = (state: AppState) => {
  return {
    isSale: state.info.isSale,
    mobile: state.device.mobile
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
          undefined,
          bridalId,
          url
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
    btnDisable: globalStyles.ceriseBtn,
    btnContent: "ADD TO BAG",
    err: ""
  };

  componentDidMount() {
    if (this.props.bridalItem.qtyRemaining == 0) {
      this.setState({
        buttonStatus: true,
        btnDisable: cs(globalStyles.ceriseBtn, globalStyles.disabledBtn),
        btnContent: "Fulfilled"
      });
    } else if (this.props.bridalItem.stock == 0) {
      this.setState({
        buttonStatus: true,
        btnDisable: cs(globalStyles.ceriseBtn, globalStyles.disabledBtn),
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

  addToBag = () => {
    const productUrl = `${__DOMAIN__}/myapi/product/${this.props.bridalItem.productId}`;
    this.props.addToBag(this.state.qtyCurrent, productUrl, this.props.bridalId);
  };

  mobileAddToBag = () => {
    const mobileAddIndex = this.props.index;
    this.props.onMobileAdd(mobileAddIndex);
  };

  render() {
    const code = currencyCode[this.props.currency as Currency];
    const { mobile } = this.props;
    return (
      <div className={cs(styles.cart, styles.cartContainer)}>
        <div className={cs(styles.cartItem, globalStyles.gutter15)}>
          <div
            className={cs(bootstrap.row, globalStyles.flex, globalStyles.row)}
          >
            <div className={cs(bootstrap.col5, bootstrap.colMd2)}>
              <a>
                <img
                  className={styles.productImage}
                  src={this.props.bridalItem.productImage}
                />
              </a>
            </div>
            <div className={cs(bootstrap.col5, bootstrap.colMd7)}>
              <div className={styles.rowMain}>
                <div className={cs(bootstrap.col12, bootstrap.colMd6)}>
                  <div className={cs(styles.section, styles.sectionInfo)}>
                    <div>
                      <div className={styles.collectionName}>
                        {this.props.bridalItem.collection}
                      </div>
                      <div className={styles.productName}>
                        <a>{this.props.bridalItem.productName}</a>
                      </div>
                    </div>
                    <div className={styles.productPrice}>
                      {this.props.isSale && this.props.bridalItem.discount ? (
                        <span className={styles.productPrice}>
                          <span className={styles.discountprice}>
                            {String.fromCharCode(...code)}{" "}
                            {
                              this.props.bridalItem.discountedPrice[
                                this.props.currency
                              ]
                            }
                          </span>
                          &nbsp;{" "}
                          <span className={styles.strikeprice}>
                            {String.fromCharCode(...code)}{" "}
                            {this.props.bridalItem.price[this.props.currency]}
                          </span>
                        </span>
                      ) : (
                        <span className={styles.productPrice}>
                          {String.fromCharCode(...code)}{" "}
                          {this.props.bridalItem.price[this.props.currency]}
                        </span>
                      )}
                    </div>
                    <div className={styles.smallfont}>
                      SIZE: {this.props.bridalItem.size}
                    </div>
                    <div
                      className={cs(styles.smallfont, globalStyles.voffset1)}
                    >
                      SKU: {this.props.bridalItem.sku}
                    </div>
                    {mobile && (
                      <div
                        className={globalStyles.voffset3}
                        onClick={this.mobileAddToBag}
                      >
                        <img src={cartIcon} width="40" height="40" />
                      </div>
                    )}
                  </div>
                </div>
                {!mobile && (
                  <div className={cs(bootstrap.col12, bootstrap.colMd6)}>
                    <div className={cs(styles.section, styles.sectionMiddle)}>
                      <div className="">
                        <div className={styles.textMuted}>REQUESTED</div>
                        <div
                          className={cs(
                            globalStyles.textCenter,
                            globalStyles.c10LR
                          )}
                        >
                          {this.props.bridalItem.qtyRequested}
                        </div>
                      </div>
                      <div className="">
                        <div className={styles.textMuted}>REMAINING</div>
                        <div
                          className={cs(
                            globalStyles.textCenter,
                            globalStyles.c10LR
                          )}
                        >
                          {this.props.bridalItem.qtyRemaining}
                        </div>
                      </div>

                      <div className="">
                        <div className={styles.textMuted}>QTY</div>
                        <div className={styles.widgetQty}>
                          <span
                            className={styles.btnQty}
                            onClick={this.decreaseState}
                          >
                            -
                          </span>
                          <span className={styles.qty}>
                            {this.state.qtyCurrent}
                          </span>
                          <span
                            className={styles.btnQty}
                            onClick={this.increaseState}
                          >
                            +
                          </span>
                        </div>
                        {this.state.err ? (
                          <div
                            className={cs(
                              globalStyles.errorMsg,
                              globalStyles.textCenter
                            )}
                          >
                            {this.state.err}
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div
              className={cs(
                bootstrap.col2,
                bootstrap.colMd3,
                globalStyles.textCenter
              )}
            >
              <div className={styles.section}>
                <div className={styles.manageHeight}>
                  <button
                    className={this.state.btnDisable}
                    onClick={this.addToBag}
                    disabled={this.state.buttonStatus}
                  >
                    {this.state.btnContent}
                  </button>
                  {!mobile && (
                    <div
                      className={cs(globalStyles.c10LR, globalStyles.voffset2)}
                    >
                      For regular orders, the delivery time will be 6-8 business
                      days
                    </div>
                  )}
                  <div className={globalStyles.cerise}>
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
