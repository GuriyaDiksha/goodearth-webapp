import React from "react";
import { AppState } from "reducers/typings";
import { BridalItemData } from "containers/myAccount/components/Bridal/typings";
import { Dispatch } from "redux";
import BasketService from "../../services/basket";
import { connect } from "react-redux";
import { Currency } from "typings/currency";
import bootstrap from "styles/bootstrap/bootstrap-grid.scss";
import styles from "./styles.scss";
import globalStyles from "../../styles/global.scss";
import cs from "classnames";
import cartIcon from "../../images/bridal/icons_cartregistry-details.svg";
import { showGrowlMessage } from "../../utils/validate";
import { displayPriceWithCommas } from "utils/utility";
import Button from "components/Button";
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
        showGrowlMessage(
          dispatch,
          "Item has been added to your bag!",
          3000,
          "ADD_TO_BAG_BRIDAL"
        );
        return res;
      } catch (err) {
        let errorMessage = err?.response?.data;
        if (typeof errorMessage != "string") {
          errorMessage = "Can't add to bag";
        }
        showGrowlMessage(dispatch, errorMessage);
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
    btnDisable: globalStyles.aquaBtn,
    btnContent: "ADD TO BAG",
    err: ""
  };

  componentDidMount() {
    if (!this.props.bridalItem.productAvailable) {
      this.setState({
        buttonStatus: true,
        btnDisable: cs(globalStyles.aquaBtn, globalStyles.disabledBtn),
        btnContent: "NOT AVAILABLE"
      });
    } else if (this.props.bridalItem.qtyRemaining == 0) {
      this.setState({
        buttonStatus: true,
        btnDisable: cs(globalStyles.aquaBtn, globalStyles.disabledBtn),
        btnContent: "Fulfilled"
      });
    } else if (this.props.bridalItem.stock == 0) {
      this.setState({
        buttonStatus: true,
        btnDisable: cs(globalStyles.aquaBtn, globalStyles.disabledBtn),
        btnContent: "NOTIFY ME"
      });
    }
  }

  increaseState = () => {
    if (
      !this.props.bridalItem.productAvailable ||
      this.props.bridalItem.stock == 0 ||
      this.props.bridalItem.qtyRemaining == 0
    ) {
    } else {
      const maxQty = this.props.bridalItem.stock;
      let qtyCurrent = this.state.qtyCurrent;
      if (qtyCurrent < maxQty) {
        qtyCurrent += 1;
        this.setState({ qtyCurrent: qtyCurrent });
      } else {
        this.setState({
          err: `Only ${maxQty} piece${maxQty > 1 ? "s" : ""} available in stock`
        });
      }
    }
  };

  decreaseState = () => {
    // if(this.props.bridalItem.stock == 0){
    //   console.log("");
    // }
    if (
      !this.props.bridalItem.productAvailable ||
      this.props.bridalItem.stock == 0 ||
      this.props.bridalItem.qtyRemaining == 0
    ) {
    } else {
      let qtyCurrent = this.state.qtyCurrent;
      if (qtyCurrent > 1) {
        qtyCurrent -= 1;
        this.setState({ qtyCurrent: qtyCurrent, err: "" });
      }
    }
  };

  addToBag = () => {
    const productUrl = `${__DOMAIN__}/myapi/product/${this.props.bridalItem.productId}`;
    this.props.addToBag(this.state.qtyCurrent, productUrl, this.props.bridalId);
  };

  mobileAddToBag = () => {
    if (this.props.bridalItem.productAvailable) {
      const mobileAddIndex = this.props.index;
      this.props.onMobileAdd(mobileAddIndex);
    }
  };

  render() {
    const { mobile } = this.props;
    return (
      <div
        className={cs(styles.cart, styles.cartContainer, {
          [styles.notAvailableItem]: !this.props.bridalItem.productAvailable
        })}
      >
        <div className={cs(styles.cartItem, globalStyles.gutter15)}>
          <div
            className={cs(bootstrap.row, globalStyles.flex, globalStyles.row)}
          >
            <div
              className={cs(bootstrap.col5, bootstrap.colMd2, styles.width50)}
            >
              <a>
                {!this.props.bridalItem.productAvailable ? (
                  <div className={styles.notAvailableTxt}>Not Available</div>
                ) : this.props.bridalItem.stock == 0 ? (
                  <div className={styles.outOfStockTxt}>Out of Stock</div>
                ) : (
                  ""
                )}
                {this.props.bridalItem.badgeImage && (
                  <div className={styles.badgeImage}>
                    <img
                      src={this.props.bridalItem.badgeImage}
                      alt={this.props.bridalItem.badgeImage}
                    />
                  </div>
                )}
                <img
                  className={cs(styles.productImage, {
                    [styles.blurImg]: this.props.bridalItem.stock == 0
                  })}
                  src={this.props.bridalItem.productImage}
                  style={{ cursor: "default" }}
                />
              </a>
            </div>
            <div
              className={cs(bootstrap.col5, bootstrap.colMd7, styles.width50)}
            >
              <div className={styles.rowMain}>
                <div className={cs(bootstrap.col12, bootstrap.colMd6)}>
                  <div
                    className={cs(
                      styles.section,
                      styles.sectionInfo,
                      mobile ? styles.mobPaddingZero : ""
                    )}
                  >
                    <div>
                      <div className={styles.collectionName}>
                        {this.props.bridalItem.collection}
                      </div>
                      <div className={styles.productName}>
                        <a style={{ cursor: "default" }}>
                          {this.props.bridalItem.productName}
                        </a>
                      </div>
                    </div>
                    <div className={styles.productPrice}>
                      {this.props.isSale && this.props.bridalItem.discount ? (
                        <span className={styles.productPrice}>
                          <span className={styles.discountprice}>
                            {displayPriceWithCommas(
                              this.props.bridalItem.discountedPrice[
                                this.props.currency
                              ],
                              this.props.currency
                            )}
                          </span>
                          &nbsp;{" "}
                          <span className={styles.strikeprice}>
                            {displayPriceWithCommas(
                              this.props.bridalItem.price[this.props.currency],
                              this.props.currency
                            )}
                          </span>
                        </span>
                      ) : (
                        <span
                          className={cs(
                            styles.productPrice,
                            this.props.bridalItem.badgeType == "B_flat"
                              ? globalStyles.cerise
                              : ""
                          )}
                        >
                          {displayPriceWithCommas(
                            this.props.bridalItem.price[this.props.currency],
                            this.props.currency
                          )}
                        </span>
                      )}
                    </div>
                    <div className={styles.sizeSku}>
                      <div className={styles.smallfont}>
                        SIZE: {this.props.bridalItem.size}
                      </div>
                      <div className={cs(styles.smallfont)}>
                        SKU: {this.props.bridalItem.sku}
                      </div>
                    </div>
                    {mobile && (
                      <>
                        {/* <div
                          className={cs(styles.mobQtyRemaining)}
                        >
                          <span>Quantity Remaining: {this.props.bridalItem.qtyRemaining}</span>
                        </div> */}
                        <div
                          className={cs(styles.mobQtyStatus)}
                          onClick={this.mobileAddToBag}
                        >
                          {/* <img src={cartIcon} width="40" height="40" /> */}
                          <span>QUANTITY & STATUS</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                {!mobile && (
                  <div className={cs(bootstrap.col12, bootstrap.colMd6)}>
                    <div className={cs(styles.section, styles.sectionMiddle)}>
                      <div className="">
                        {this.props.bridalItem.productAvailable && (
                          <div className={styles.textMuted}>
                            Quantity required
                          </div>
                        )}
                        {this.props.bridalItem.productAvailable && (
                          <div
                            className={cs(styles.widgetQty, {
                              [styles.disableQty]:
                                this.props.bridalItem.stock == 0 ||
                                this.props.bridalItem.qtyRemaining == 0
                            })}
                          >
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
                        )}
                        <div className={styles.h10}>
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
                      <div className={globalStyles.voffset3}>
                        <div className={styles.textMuted}>Quantity Bought</div>
                        <div
                          className={cs(
                            globalStyles.textCenter,
                            globalStyles.c10LR,
                            globalStyles.voffset1
                          )}
                        >
                          {this.props.bridalItem.qtyBought}
                        </div>
                      </div>
                      <div className={globalStyles.voffset3}>
                        <div className={styles.textMuted}>
                          Quantity Remaining
                        </div>
                        <div
                          className={cs(
                            globalStyles.textCenter,
                            globalStyles.c10LR,
                            globalStyles.voffset1
                          )}
                        >
                          {this.props.bridalItem.qtyRemaining}
                        </div>
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
                globalStyles.textCenter,
                styles.width0
              )}
            >
              <div className={styles.section}>
                <div className={styles.manageHeight}>
                  {!mobile && (
                    <>
                      <Button
                        // className={this.state.btnDisable}
                        onClick={this.addToBag}
                        disabled={this.state.buttonStatus}
                        label={this.state.btnContent}
                        // variant="mediumAquaCta300"
                        variant="smallAquaCta"
                      />

                      {this.props.bridalItem.productDeliveryDate && (
                        <div
                          className={cs(
                            globalStyles.c10LR,
                            globalStyles.voffset2
                          )}
                        >
                          Estimated delivery on or before:{" "}
                          <span className={styles.black}>
                            {" "}
                            {this.props.bridalItem.productDeliveryDate}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                  {/* <div className={globalStyles.cerise}>
                    {this.state.btnContent == "Fulfilled" ||
                    this.state.btnContent == "Notify Me"
                      ? this.state.btnContent
                      : ""}
                  </div> */}
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
