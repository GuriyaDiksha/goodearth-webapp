import React, { EventHandler, MouseEvent } from "react";
import styles from "./styles.scss";
import cs from "classnames";
import { State } from "./typings";
import iconStyles from "../../styles/iconFonts.scss";
import globalStyles from "../../styles/global.scss";
import { Dispatch } from "redux";
import BasketService from "services/basket";
import { connect } from "react-redux";
import { AppState } from "reducers/typings";
import LazyImage from "components/LazyImage";
import CartSlider from "components/CartSlider";
import { Link } from "react-router-dom";
import { currencyCodes } from "constants/currency";
import ModalStyles from "components/Modal/styles.scss";
import bootstrap from "styles/bootstrap/bootstrap-grid.scss";
import SizeSelector from "components/SizeSelector";
import PdpQuantity from "components/quantity/pdpQuantity";
import asset from "images/asset.svg";
import { MESSAGE } from "constants/messages";
import * as valid from "utils/validate";
import { updateComponent, updateModal } from "actions/modal";
import { POPUP } from "constants/components";
import PdpButton from "components/Button/pdpButton";
import { updateQuickviewId } from "actions/quickview";
import { updateshowFiller } from "actions/filler";
import WishlistButtonpdp from "components/WishlistButton/wishlistButtonpdp";

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    removeOutOfStockItems: async () => {
      const res = await BasketService.removeOutOfStockItems(dispatch);
      return res;
    },
    addToBasket: async (id: number, quantity: number) => {
      const res = await BasketService.addToBasket(dispatch, id, quantity);
      return res;
    },
    showGrowlMessage: async () => {
      valid.showGrowlMessage(dispatch, MESSAGE.ADD_TO_BAG_SUCCESS);
    },
    showerrorMessage: async (text: string) => {
      valid.showGrowlMessage(dispatch, text);
    },
    updateComponentModal: (
      component: string,
      props: any,
      fullscreen = false,
      bodyClass?: string
    ) => {
      dispatch(updateComponent(component, props, fullscreen, bodyClass));
    },
    changeModalState: (data: boolean) => {
      dispatch(updateModal(data));
    },
    updatequickview: () => {
      dispatch(updateQuickviewId(0));
      dispatch(updateshowFiller(false));
    },
    updateshowFiller: () => {
      dispatch(updateshowFiller(false));
    }
  };
};
const mapStateToProps = (state: AppState) => {
  return {
    isSale: state.info.isSale,
    customerGroup: state.user.customerGroup,
    isLoggedIn: state.user.isLoggedIn,
    filler: state.filler,
    mobile: state.device.mobile,
    currency: state.currency
  };
};
type Props = ReturnType<typeof mapDispatchToProps> &
  ReturnType<typeof mapStateToProps>;
class CushionBag extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      stockError: "",
      shipping: false,
      value: 1,
      freeShipping: false, // for all_free_shipping_india
      isSuspended: true, // for is_covid19
      goToIndex: {
        index: -1,
        value: ""
      },
      sizeError: "",
      quantity: 1,
      addedToBag: false,
      apiTrigger: false,
      selectedSize:
        props.filler.data.childAttributes?.length === 1
          ? props.filler.data.childAttributes[0]
          : null
    };
  }

  componentDidMount = () => {
    document.body.classList.add(globalStyles.noScroll);
  };

  componentWillUnmount = () => {
    document.body.classList.remove(globalStyles.noScroll);
  };

  onSizeSelect = (selected: any) => {
    this.setState({
      selectedSize: selected,
      sizeError: "",
      quantity: 1
    });
  };
  showSize = () => {
    let show = false;
    const { childAttributes } = this.props.filler.data;
    childAttributes?.every(attr => {
      if (attr.size) {
        show = true;
        return false;
      }
      return false;
    });

    return show;
  };

  onQuantityChange = (value: number) => {
    if (this.state.selectedSize) {
      this.setState({
        quantity: value,
        sizeError: ""
      });
    } else {
      this.setState({
        sizeError: "Please select a Size to proceed"
      });
    }
  };

  getsection() {
    const images: any[] = this.getProductImagesData();
    const {
      data: {
        title,
        invisibleFields,
        discount,
        discountedPriceRecords,
        priceRecords,
        badgeType,
        childAttributes,
        url
      }
    } = this.props.filler;
    const { mobile, isSale, currency } = this.props;
    const { selectedSize, sizeError, quantity } = this.state;
    const [productTitle, subtitle] = title.split("(");

    const price =
      selectedSize && selectedSize.priceRecords
        ? selectedSize.priceRecords[currency]
        : priceRecords[currency];

    const discountPrices =
      selectedSize && selectedSize.discountedPriceRecords
        ? selectedSize.discountedPriceRecords[currency]
        : discountedPriceRecords[currency];
    const minQuantity = 1;
    const maxQuantity = selectedSize ? selectedSize.stock : 1;
    let mobileSlides: any[] = [];
    if (images.length > 0) {
      mobileSlides = images?.map((url, i: number) => {
        return (
          <div key={"filler" + i} className={globalStyles.relative}>
            <LazyImage
              aspectRatio="62:93"
              src={url.replace("/Micro/", "/Medium/")}
              className={globalStyles.imgResponsive}
            />
          </div>
        );
      });
    }
    return (
      <div className={bootstrap.row}>
        <div className={cs(bootstrap.col12, styles.margin0)}>
          {typeof document == "object" && (
            <CartSlider val={this.state.goToIndex}>{mobileSlides}</CartSlider>
          )}
          <div className={styles.innerContainer}>
            <div className={cs(bootstrap.row, globalStyles.voffset4)}>
              <div
                className={cs(bootstrap.col8, bootstrap.colMd8, styles.title)}
              >
                {productTitle}
                {subtitle && <p>({subtitle.split(")")[0]})</p>}
              </div>
              {!(invisibleFields && invisibleFields.indexOf("price") > -1) && (
                <div
                  className={cs(
                    bootstrap.col4,
                    bootstrap.colMd4,
                    styles.priceContainer,
                    { [globalStyles.textCenter]: !mobile }
                  )}
                >
                  {isSale && discount && discountedPriceRecords ? (
                    <span className={styles.discountedPrice}>
                      {String.fromCharCode(...currencyCodes[currency])}
                      &nbsp;
                      {discountPrices}
                      <br />
                    </span>
                  ) : (
                    ""
                  )}
                  {isSale && discount ? (
                    <span className={styles.oldPrice}>
                      {String.fromCharCode(...currencyCodes[currency])}
                      &nbsp;
                      {price}
                    </span>
                  ) : (
                    <span
                      className={
                        badgeType == "B_flat" ? globalStyles.cerise : ""
                      }
                    >
                      {" "}
                      {String.fromCharCode(...currencyCodes[currency])}
                      &nbsp;
                      {price}
                    </span>
                  )}
                </div>
              )}
            </div>
            {this.showSize() ? (
              !(invisibleFields && invisibleFields.indexOf("size") > -1) && (
                <div className={cs(bootstrap.row, styles.spacer)}>
                  <div className={bootstrap.col12}>
                    <div className={bootstrap.row}>
                      <div
                        className={cs(
                          bootstrap.col4,
                          styles.label,
                          styles.size,
                          { [styles.mobileMargin]: mobile }
                        )}
                      >
                        Size
                      </div>
                      <div className={cs(bootstrap.col8, styles.sizeContainer)}>
                        <SizeSelector
                          isCorporatePDP={false}
                          sizes={childAttributes ? childAttributes : []}
                          onChange={this.onSizeSelect}
                          selected={selectedSize ? selectedSize.id : undefined}
                        />
                        <span
                          className={cs(styles.sizeErrorMessage, "show-error")}
                        >
                          {sizeError}
                        </span>
                        <span className={cs(styles.sizeErrorMessage)}>
                          {isSale &&
                            selectedSize &&
                            selectedSize.showStockThreshold &&
                            selectedSize.stock > 0 &&
                            `Only ${selectedSize.stock} Left!${
                              selectedSize.othersBasketCount > 0
                                ? ` *${selectedSize.othersBasketCount} others have this item in their bag.`
                                : ""
                            }`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            ) : (
              <span className={cs(styles.sizeErrorMessage)}>
                {isSale &&
                  selectedSize &&
                  selectedSize.stock > 0 &&
                  selectedSize.showStockThreshold &&
                  `Only ${
                    selectedSize.stock
                  } Left!${selectedSize.othersBasketCount &&
                    ` *${selectedSize.othersBasketCount} others have this item in their bag.`}`}
              </span>
            )}
            <div>
              <div
                className={cs(bootstrap.col12, { [bootstrap.colMd12]: mobile })}
              >
                {!(
                  invisibleFields && invisibleFields.indexOf("quantity") > -1
                ) && (
                  <div className={cs(bootstrap.row, globalStyles.voffset4)}>
                    <div
                      className={cs(
                        bootstrap.col4,
                        styles.label,
                        styles.quantity,
                        { [styles.mobileMargin]: mobile }
                      )}
                    >
                      Quantity
                    </div>
                    <div className={cs(bootstrap.col8, styles.widgetQty)}>
                      <PdpQuantity
                        source="pdp"
                        key={selectedSize?.sku}
                        id={selectedSize?.id || 0}
                        minValue={minQuantity}
                        maxValue={maxQuantity}
                        currentValue={quantity}
                        onChange={this.onQuantityChange}
                        // errorMsg={selectedSize ? "Available qty in stock is" : ""}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/*      
          {Pdpbutton} */}
            <div
              className={cs(
                bootstrap.col12,
                bootstrap.colMd10,
                globalStyles.voffset3,
                styles.cushionError,
                styles.fillerContainer
              )}
            >
              <img
                src={asset}
                className={styles.cushionFiller}
                alt="cushion-filler-icon"
              />
              <div>
                <Link
                  to={url}
                  className={cs(styles.moreDetails)}
                  onClick={() => {
                    // changeModalState(false);
                    // const listPath = `${source || "PLP"}`;
                    // CookieService.setCookie("listPath", listPath);
                    // dispatch(updateQuickviewId(0));
                    this.props.changeModalState(false);
                    this.props.updatequickview();
                  }}
                >
                  View Product Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  getProductImagesData = () => {
    const { data } = this.props.filler;
    let sliderImages;
    if (data) {
      sliderImages = data.plpSliderImages;
    }
    return sliderImages ? sliderImages : [];
  };

  showError = () => {
    setTimeout(() => {
      const firstErrorField = document.getElementsByClassName(
        "show-error"
      )[0] as HTMLDivElement;
      if (firstErrorField) {
        // firstErrorField.focus();
        // mobile &&
        firstErrorField.scrollIntoView({
          block: "center",
          behavior: "smooth"
        });
      }
    }, 0);
  };

  sizeSelectClick = () => {
    // setSizeerror(true);
    this.setState(
      {
        sizeError: "Please select a Size to proceed"
      },
      () => {
        this.showError();
      }
    );
  };

  addToBasket = () => {
    // const {mobile,isSale, currency} = this.props;
    const {
      selectedSize,
      sizeError,
      quantity,
      addedToBag,
      apiTrigger
    } = this.state;

    if (!selectedSize) {
      this.setState({
        sizeError: "Please select a Size to proceed"
      });
      this.showError();
    } else {
      this.setState({
        apiTrigger: true
      });
      this.props
        .addToBasket(selectedSize.id, quantity)
        .then(() => {
          this.setState({
            apiTrigger: false,
            addedToBag: true
          });
          setTimeout(() => {
            this.setState({
              addedToBag: false
            });
          }, 3000);
          this.props.showGrowlMessage();
        })
        .catch(err => {
          this.setState({
            apiTrigger: false
          });
          // if (typeof err.response.data != "object") {
          this.props.showerrorMessage(err.response.data);
          //   valid.errorTracking([err.response.data], window.location.href);
          // }
        });
    }
  };

  notifyMeClick = () => {
    let selectedIndex = undefined;
    const {
      data: {
        childAttributes,
        categories,
        collection,
        priceRecords,
        title,
        discount,
        badgeType,
        discountedPriceRecords
      }
    } = this.props.filler;
    const { currency } = this.props;
    const { selectedSize } = this.state;
    const discountPrices =
      selectedSize && selectedSize.discountedPriceRecords
        ? selectedSize.discountedPriceRecords[currency]
        : discountedPriceRecords[currency];
    childAttributes?.map((v: any, i) => {
      if (v.id === selectedSize?.id) {
        selectedIndex = i;
      }
    });
    const index = categories.length - 1;
    let category = categories[index]
      ? categories[index].replace(/\s/g, "")
      : "";
    category = category.replace(/>/g, "/");
    this.props.updateComponentModal(
      POPUP.NOTIFYMEPOPUP,
      {
        collection: collection,
        category: category,
        price: priceRecords[currency],
        currency: currency,
        childAttributes: childAttributes,
        title: title,
        selectedIndex: selectedIndex,
        discount: discount,
        badgeType: badgeType,
        isSale: this.props.isSale,
        discountedPrice: discountPrices,
        list: "pdp"
      },
      false,
      ModalStyles.bottomAlign
    );
    this.props.changeModalState(true);
  };

  getFooter() {
    let buttonText: string, action: EventHandler<MouseEvent>;
    const {
      data: { childAttributes }
    } = this.props.filler;
    const {
      mobile,
      isSale,
      currency,
      filler: {
        data: { title, categories, id, priceRecords, discountedPriceRecords }
      }
    } = this.props;
    const { selectedSize, apiTrigger, addedToBag } = this.state;
    let allOutOfStock = true;
    childAttributes?.forEach(({ stock }) => {
      if (stock > 0) {
        allOutOfStock = false;
      }
    });

    if (allOutOfStock || (selectedSize && selectedSize.stock == 0)) {
      buttonText = "Notify Me";
      action = apiTrigger ? () => null : this.notifyMeClick;
      // setSizeerror(false);
    } else if (
      !selectedSize &&
      childAttributes &&
      childAttributes?.length > 1
    ) {
      buttonText = "Select Size";
      action = apiTrigger ? () => null : this.sizeSelectClick;
    } else {
      buttonText = addedToBag ? "Added!" : "Add to Bag";
      action = addedToBag
        ? () => null
        : apiTrigger
        ? () => null
        : this.addToBasket;
      // setSizeerror(false);
    }
    if (this.props.filler.show) {
      return (
        <div className={styles.bagFooter}>
          <div className={cs(globalStyles.flex, styles.bagFlex)}>
            <div className={bootstrap.row}>
              <div className={bootstrap.col9}>
                <PdpButton label={buttonText} onClick={action} />
              </div>
              <div className={bootstrap.col3}>
                <WishlistButtonpdp
                  gtmListType={"pdp"}
                  title={title}
                  parentWidth={true}
                  childAttributes={childAttributes}
                  priceRecords={priceRecords}
                  discountedPriceRecords={discountedPriceRecords}
                  categories={categories}
                  id={id}
                  showText={false}
                  size={selectedSize ? selectedSize.size : undefined}
                  iconClassName={styles.mobileWishlistIcon}
                />
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  resetInfoPopupCookie() {
    const cookieString =
      "checkoutinfopopup3=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    document.cookie = cookieString;
  }

  render() {
    const {
      filler: { show }
    } = this.props;
    return (
      <div>
        <div
          className={cs(styles.bagBackdrop, show ? styles.active : "")}
          // onClick={(): void => {

          // }}
        ></div>
        <div
          className={cs(
            styles.bag,
            { [styles.active]: show },
            { [styles.smoothOut]: !show }
          )}
          id="cartslider"
        >
          <div
            className={cs(
              styles.bagHeader,
              globalStyles.flex,
              globalStyles.gutterBetween
            )}
          >
            <div className={styles.heading}></div>
            <div className={styles.heading}>PURCHASE INSERT</div>
            <div
              className={globalStyles.pointer}
              onClick={() => {
                this.props.updateshowFiller();
              }}
            >
              <i
                className={cs(
                  iconStyles.icon,
                  iconStyles.iconCrossNarrowBig,
                  styles.crossfontSize
                )}
              ></i>
            </div>
          </div>
          <div className={styles.bagContents}>{this.getsection()}</div>
          {this.getFooter()}
        </div>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(CushionBag);
