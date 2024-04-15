import React from "react";
import { connect } from "react-redux";
import cs from "classnames";
import iconStyles from "../../styles/iconFonts.scss";
import createAbsoluteGrid from "react-absolute-grid";
import SampleDisplay from "./display";
import { createRoot } from "react-dom/client";
import { AppState } from "reducers/typings";
import { Dispatch } from "redux";
import Loader from "components/Loader";
import SecondaryHeader from "components/SecondaryHeader";
import SecondaryHeaderDropdown from "components/dropdown/secondaryHeaderDropdown";
import { WishlistItem, WishListGridItem } from "typings/wishlist";
import WishlistService from "services/wishlist";
import { Link } from "react-router-dom";
import debounce from "lodash/debounce";
import find from "lodash/find";
import { updateComponent, updateModal } from "../../actions/modal";
import { Currency } from "typings/currency";
import globalStyles from "../../styles/global.scss";
import bootstrapStyles from "../../styles/bootstrap/bootstrap-grid.scss";
import styles from "./styles.scss";
import ModalStyles from "components/Modal/styles.scss";
import { withRouter, RouteComponentProps } from "react-router";
import { WidgetImage } from "components/header/typings";
// services
import HeaderService from "services/headerFooter";
import LoginService from "services/login";
import { POPUP } from "constants/components";
import { sortGTM, pageViewGTM } from "utils/validate";
import CookieService from "../../services/cookie";
import { GA_CALLS } from "constants/cookieConsent";
import {
  displayPriceWithCommas,
  displayPriceWithCommasFloat
} from "utils/utility";
import Button from "components/Button";
import { updateNextUrl } from "actions/info";
import linkIcon from "./../../images/linkIcon.svg";
// import { isEqual } from "lodash";

let AbsoluteGrid: any;

const mapStateToProps = (state: AppState) => {
  return {
    mobile: state.device.mobile,
    currency: state.currency,
    wishlistData: state.router.location.pathname.includes("shared-wishlist")
      ? state.wishlist.sharedItems
      : state.wishlist.items,
    wishlistCountData: state.wishlist.count,
    sortedDiscount: state.wishlist.sortedDiscount,
    isLoggedIn: state.user.isLoggedIn,
    isSale: state.info.isSale,
    showTimer: state.info.showTimer,
    location: state.router.location,
    isShared: state.router.location.pathname.includes("shared-wishlist"),
    ownerName: state.wishlist.owner_name,
    message: state.wishlist.message,
    isSuccess: state.wishlist.is_success,
    user: state.user,
    openModal: state.modal.openModal
  };
};
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    fetchFeaturedContent: async () => {
      const res = HeaderService.fetchSearchFeaturedContent(dispatch);
      return res;
    },
    removeFromWishlist: async (
      sortBy: string,
      productId?: number,
      id?: number
    ) =>
      await WishlistService.removeFromWishlist(dispatch, productId, id, sortBy),
    updateWishlist: async (sortBy: string) =>
      await WishlistService.updateWishlist(dispatch, sortBy),
    updateWishlistShared: async (sortBy: string, location: any) => {
      const urlParam = new URLSearchParams(location.search);
      const uid = urlParam.get("key") || "";

      await WishlistService.updateWishlistShared(dispatch, uid, sortBy);
    },
    // countWishlist: async () => await WishlistService.countWishlist(dispatch),
    updateWishlistSequencing: async (sequencing: [number, number][]) =>
      await WishlistService.updateWishlistSequencing(dispatch, sequencing),
    openLogin: (url: string, isShareLinkClicked: boolean) => {
      //Stored this value for share wishlist popup
      localStorage.setItem("isShareLinkClicked", String(isShareLinkClicked));

      LoginService.showLogin(dispatch);
      if (url) {
        dispatch(updateNextUrl(url));
      }
    },
    openSharePopup: (mobile: boolean) => {
      dispatch(
        updateComponent(
          POPUP.SHAREWISHLIST,
          {
            // shareUrl: "https://www.goodearth.in/sssss"
            // bridalDetails={bridalDetails}
          },
          mobile ? false : true,
          mobile ? ModalStyles.bottomAlignSlideUp : "",
          mobile ? "slide-up-bottom-align" : ""
        )
      );
      dispatch(updateModal(true));
    },
    openPopup: (
      item: WishListGridItem,
      currency: Currency,
      sortBy: string,
      isSale?: boolean,
      mobile?: boolean,
      isShared?: boolean
    ) => {
      const childAttributes = item.stockDetails.map(
        ({
          discountedPrice,
          productId,
          stock,
          size,
          price,
          sku,
          showStockThreshold
        }) => {
          return {
            discountedPriceRecords: discountedPrice,
            id: productId,
            isBridalProduct: false,
            sku: sku,
            priceRecords: price,
            size: size,
            stock: stock,
            showStockThreshold: showStockThreshold
          };
        }
      );
      let selectedIndex;
      let price = item.price[currency];
      childAttributes.map((v, i) => {
        if (v.size === item?.size) {
          selectedIndex = i;
          price = v.priceRecords[currency];
        }
      });
      const changeSize = async (size: string, quantity?: number) => {
        if (!isShared) {
          await WishlistService.modifyWishlistItem(
            dispatch,
            item.id,
            size,
            quantity,
            sortBy
          );
        }
      };

      const index = item.category.length - 1;
      let category = item.category[index]
        ? item.category[index].replace(/\s/g, "")
        : "";
      category = category.replace(/>/g, "/");

      dispatch(
        updateComponent(
          POPUP.NOTIFYMEPOPUP,
          {
            sortBy: sortBy,
            price: price,
            discountedPrice: item.discountedPrice[currency],
            currency: currency,
            title: item.productName,
            childAttributes: childAttributes,
            collection: item.collection,
            selectedIndex: selectedIndex,
            changeSize: changeSize,
            isSale: isSale,
            discount: item.discount,
            badgeType: item.badgeType,
            list: "wishlist",
            sliderImages: [],
            collections: item?.collection,
            category: category
          },
          false,
          mobile ? ModalStyles.bottomAlignSlideUp : "",
          mobile ? "slide-up-bottom-align" : ""
        )
      );
      dispatch(updateModal(true));
    },
    openWishlistPopup: (mobile: boolean) => {
      dispatch(
        updateComponent(
          POPUP.SHAREWISHLIST,
          null,
          mobile ? false : true,
          mobile ? ModalStyles.bottomAlignSlideUp : "",
          mobile ? "slide-up-bottom-align" : ""
        )
      );
      dispatch(updateModal(true));
    },
    updateComponent: () => {
      dispatch(updateNextUrl(""));
    }
  };
};

export type Props = {
  wishlistData: WishlistItem[];
} & ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps;

type State = {
  isLoading: boolean;
  dragDrop: boolean;
  sampleItems: WishListGridItem[];
  filterListing: boolean;
  defaultOption: { value: string; label: string };
  currentFilter: string;
  wishlistCount: number;
  totalPrice: number;
  saleStatus: boolean;
  featureData: WidgetImage[];
};

class Wishlist extends React.Component<Props, State> {
  dragFlag: boolean;
  impression: boolean;
  container: any;
  root: any;
  constructor(props: Props) {
    super(props);
    this.state = {
      featureData: [],
      isLoading: false,
      dragDrop: false,
      sampleItems: [],
      filterListing: false,
      defaultOption: { value: "added_on", label: "Recently Added" },
      currentFilter: "added_on",
      wishlistCount: 0,
      totalPrice: 0,
      saleStatus: false
    };
    this.impression = true;
    this.dragFlag = false;
    AbsoluteGrid = createAbsoluteGrid(
      SampleDisplay,
      {
        grid: this.props,
        removeProduct: this.removeProduct,
        mobile: this.props.mobile,
        currency: this.props.currency,
        isSale: this.props.isSale,
        sortBy: this.state.currentFilter,
        isShared: this.props.isShared
      },
      false
    );
  }

  getWishlist = (sortBy: string, isUnmount?: boolean) => {
    this.setState({
      isLoading: true
    });
    if (!sortBy && this.state.defaultOption.value) {
      sortBy = this.state.defaultOption.value;
    }
    if (!this.props.isShared || isUnmount) {
      this.props
        .updateWishlist(sortBy)
        .then(res => {
          this.setState({
            isLoading: false
          });
        })
        .catch(error => {
          this.setState({
            isLoading: false
          });
          // console.log(error);
        });
    } else {
      this.props
        .updateWishlistShared(sortBy, this.props.location)
        .then(res => {
          this.setState({
            isLoading: false
          });
        })
        .catch(error => {
          this.setState({
            isLoading: false
          });
          // console.log(error);
        });
    }
  };

  onChangeFilter = (data?: string, label?: string) => {
    // this.root.unmount(document.getElementById("wishlist") as HTMLDivElement);
    switch (data) {
      case "sequence":
        this.setState(
          {
            dragDrop: true,
            defaultOption: { value: data, label: data },
            currentFilter: data
          },
          () => {
            this.myrender(this.state.sampleItems);
          }
        );
        break;
      case "added_on":
        this.setState(
          {
            dragDrop: false,
            defaultOption: { value: data, label: data },
            currentFilter: data
          },
          () => {
            this.getWishlist("added_on");
          }
        );

        break;
      case "price_asc":
        this.setState({
          dragDrop: false,
          defaultOption: { value: data, label: data },
          currentFilter: data
        });
        this.getWishlist("price_asc");
        break;
      case "price_desc":
        this.setState({
          dragDrop: false,
          defaultOption: { value: data, label: data },
          currentFilter: data
        });
        this.getWishlist("price_desc");
        break;
      case "discount":
        this.setState({
          dragDrop: false,
          defaultOption: { value: data, label: data },
          currentFilter: data
        });
        this.getWishlist("discount");
        break;
      default:
        break;
    }
    if (data) {
      sortGTM(label || data);
    }
    window.scrollTo(0, 0);
  };

  removeProduct = (data: WishlistItem) => {
    this.setState({
      isLoading: true
    });
    const { currency } = this.props;
    this.props
      .removeFromWishlist(this.state.defaultOption.value, undefined, data.id)
      .finally(() => {
        // this.props.countWishlist();
        Moengage.track_event("remove_from_wishlist", {
          "Product id": data.id,
          "Product name": data.productName,
          quantity: 1,
          price: data.price?.[currency] ? +data.price?.[currency] : "",
          Currency: currency,
          // "Collection name": collection,
          "Category name": data.category[0]?.split(">")[0],
          "Sub Category Name": data.category[0]?.split(">")[1] || ""
        });
        this.setState({ isLoading: false });
      });
  };

  componentDidMount() {
    this.getWishlist(this.state.defaultOption.value);

    this.container = document.getElementById("wishlist");
    this.root = createRoot(this.container);
    window.addEventListener("resize", debounce(this.updateStyle, 100));
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 1000);
    this.updateGrid(this.props);
    this.props
      .fetchFeaturedContent()
      .then(data => {
        this.setState({
          featureData: data.widgetImages
        });
      })
      .catch(function(error) {
        console.log(error);
      });
    pageViewGTM("Wishlist");
  }

  componentWillUnmount() {
    window.removeEventListener("resize", debounce(this.updateStyle, 100));
    if (this.props.isShared) {
      this.getWishlist(this.state.defaultOption.value, true);
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.state.currentFilter != prevState.currentFilter) {
      AbsoluteGrid = createAbsoluteGrid(
        SampleDisplay,
        {
          grid: this.props,
          removeProduct: this.removeProduct,
          mobile: this.props.mobile,
          currency: this.props.currency,
          isSale: this.props.isSale,
          sortBy: this.state.currentFilter,
          isShared: this.props.isShared
        },
        false
      );
    }
    // this.state.filterListing
    //   ? document.body.classList.add(globalStyles.noScroll)
    //   : document.body.classList.remove(globalStyles.noScroll);
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    this.updateGrid(nextProps);

    if (
      this.props.currency !== nextProps.currency ||
      this.props.isSale !== nextProps.isSale
    ) {
      if (this.state.defaultOption.value == "discount") {
        this.setState(
          {
            defaultOption: { value: "added_on", label: "Recently Added" },
            currentFilter: "added_on"
          },
          () => {
            this.getWishlist(this.state.defaultOption.value);
          }
        );
      } else {
        this.getWishlist(this.state.defaultOption.value);
      }
      AbsoluteGrid = createAbsoluteGrid(
        SampleDisplay,
        {
          grid: nextProps,
          removeProduct: this.removeProduct,
          mobile: nextProps.mobile,
          currency: nextProps.currency,
          isSale: nextProps.isSale,
          sortBy: this.state.currentFilter,
          isShared: this.props.isShared
        },
        false
      );
    }
  }

  updateGrid = (nextProps: Props) => {
    const { currency } = this.props;

    if (!nextProps.wishlistData) {
      return false;
    }
    if (this.props.mobile != document.body.clientWidth <= 992) {
      // this.setState({
      //     mobile: document.body.clientWidth <= 992
      // })
    }
    let newWishlistData: WishListGridItem[] = [];

    if (
      this.state.dragDrop &&
      this.state.sampleItems.length > 0 &&
      nextProps.wishlistData.length == this.state.sampleItems.length
      //nextProps.wishlistCountData == this.state.sampleItems.length
    ) {
      newWishlistData = nextProps.wishlistData.map((data, i) => {
        const item = this.state.sampleItems.filter(
          (newdata, j) => newdata.id == data.id
        )[0];
        const gridItem: WishListGridItem = Object.assign(
          {},
          { key: item.key, sort: data.dndSequence },
          item,
          {
            size: data.size
          }
        );
        return gridItem;
      });
    } else {
      newWishlistData = nextProps.wishlistData.map((data, i) => {
        return Object.assign({}, { key: data.id, sort: i }, data);
      });
    }
    const product = nextProps.wishlistData.map((prod, i) => {
      if (Object.keys(prod).length === 0) return false;
      const index = prod.category.length - 1;
      let category = prod.category[index]
        ? prod.category[index].replace(/\s/g, "")
        : "";
      category = category.replace(/>/g, "/");
      const listPath = `Wishlist`;
      return prod.stockDetails.map(gtmItem => {
        const cur = this.state.saleStatus
          ? gtmItem.discountedPrice[currency]
          : gtmItem.price[currency];
        return Object.assign(
          {},
          {
            name: prod.productName,
            id: gtmItem.sku,
            category: category,
            list: listPath,
            price: cur,
            brand: "Goodearth",
            position: i + 1,
            variant: prod.size || ""
          }
        );
      });
    });
    if (product.length > 0 && this.impression) {
      this.impression = false;
      const userConsent = CookieService.getCookie("consent").split(",");
      if (userConsent.includes(GA_CALLS)) {
        dataLayer.push({
          event: "productImpression",
          ecommerce: {
            currencyCode: this.props.currency,
            impressions: product
          }
        });
      }
    }

    const wishlistTotal = nextProps.wishlistData.map(item => {
      const { isSale } = this.props;
      if (!item.size && item.stockDetails.length > 1) {
        const itemTotal = item.stockDetails.reduce((prev, curr) => {
          const prevprices = parseFloat(
            prev.discountedPrice[currency].toString()
          );
          const currprices = parseFloat(
            curr.discountedPrice[currency].toString()
          );
          return prevprices < currprices ? prev : curr;
        });
        return isSale
          ? +itemTotal.discountedPrice[currency]
          : +itemTotal.price[currency];
      } else if (item.size) {
        let vars = 0;
        item.stockDetails.forEach(function(items, key) {
          if (item.size == items.size) {
            vars = isSale
              ? +items.discountedPrice[currency]
              : +items.price[currency];
          }
        });
        return vars;
      } else {
        return item.stockDetails[0]
          ? isSale
            ? +item.stockDetails[0].discountedPrice[currency]
            : +item.stockDetails[0].price[currency]
          : 0;
      }
    });
    const wishlistSubtotal = wishlistTotal.reduce((total, num) => {
      return total + num;
    }, 0);
    this.setState(
      {
        sampleItems: newWishlistData,
        wishlistCount: nextProps.wishlistData.length,
        totalPrice: wishlistSubtotal
      },
      () => {
        this.myrender(newWishlistData);
      }
    );
  };

  onDropWishlist = (e?: any) => {
    const sequencing: [number, number][] = [];
    if (!this.dragFlag) return false;
    this.state.sampleItems.map(item => {
      return sequencing.push([item.id, item.sort]);
    });

    this.props
      .updateWishlistSequencing(sequencing)
      .then(data => {
        if (data.success) {
          this.dragFlag = false;
          this.getWishlist("sequence");
        }
      })
      .catch(function(error) {
        // console.log(error);
      });
  };

  onDragWishlist(e?: any) {
    this.dragFlag = true;
  }

  getWishlistSubtotal() {
    return (
      <div>
        <span>
          {"(" +
            this.state.wishlistCount +
            ` item${this.state.wishlistCount === 1 ? "" : "s"}) Subtotal:`}
          &nbsp;
        </span>
        <span>
          {Number.isSafeInteger(+this.state.totalPrice)
            ? displayPriceWithCommas(this.state.totalPrice, this.props.currency)
            : displayPriceWithCommasFloat(
                this.state.totalPrice,
                this.props.currency
              )}
        </span>
      </div>
    );
  }

  updateStyle = () => {
    const elem = document.getElementsByClassName(
      "absoluteGrid"
    )?.[0] as HTMLElement;
    if (elem) {
      if (window.innerWidth <= 377) {
        elem.style.display = "flex";
        // elem.style.justifyContent = "center";
      } else {
        elem.style.display = "block";
      }
    }
  };

  myrender = (data: WishListGridItem[]) => {
    if (data.length > 0) {
      if (this.props.mobile) {
        this.root.render(
          <AbsoluteGrid
            items={data}
            currency={this.props.currency}
            dragEnabled={this.state.dragDrop}
            onDragEnd={() => this.onDropWishlist()}
            onDragMove={() => this.onDragWishlist()}
            itemWidth={160}
            itemHeight={340}
            responsive={true}
            onMove={debounce(this.onMoveDebounced, 40)}
          />
          // document.getElementById("wishlist"),
          // this.updateStyle
        );
      } else {
        this.root.render(
          <AbsoluteGrid
            currency={this.props.currency}
            items={data}
            dragEnabled={this.state.dragDrop}
            onDragEnd={() => this.onDropWishlist()}
            onDragMove={() => this.onDragWishlist()}
            itemWidth={280}
            itemHeight={520}
            responsive={true}
            onMove={debounce(this.onMoveDebounced, 40)}
          />
          // document.getElementById("wishlist"),
          // this.updateStyle
        );
      }
    } else {
      this.root.render(
        <></>
        // , document.getElementById("wishlist")
      );
    }
  };

  onMoveDebounced = (source: any, target: any) => {
    source = find(this.state.sampleItems, { key: parseInt(source, 10) });
    target = find(this.state.sampleItems, { key: parseInt(target, 10) });
    const targetSort = target.sort;

    //CAREFUL, For maximum performance we must maintain the array's order, but change sort
    const sampleItems = this.state.sampleItems.map(function(item, i) {
      //Decrement sorts between positions when target is greater
      if (item.key === source.key) {
        return Object.assign({}, item, { sort: targetSort });
      } else if (
        target.sort > source.sort &&
        item.sort <= target.sort &&
        item.sort > source.sort
      ) {
        return Object.assign({}, item, { sort: item.sort - 1 });
        //Increment sorts between positions when source is greater
      } else if (item.sort >= target.sort && item.sort < source.sort) {
        return Object.assign({}, item, { sort: item.sort + 1 });
      }
      return item;
    });
    this.setState({
      sampleItems: sampleItems
    });
    this.myrender(sampleItems);
  };

  setWishlistFilter = (data: { value: string; label: string }) => {
    // this.root.unmount(document.getElementById("wishlist") as HTMLDivElement);
    switch (data.value) {
      case "sequence":
        this.setState(
          {
            dragDrop: true,
            defaultOption: data,
            filterListing: false,
            currentFilter: data.value
          },
          () => {
            this.myrender(this.state.sampleItems);
          }
        );
        break;
      case "discount":
        this.setState(
          {
            dragDrop: false,
            defaultOption: data,
            filterListing: false,
            currentFilter: data.value
          },
          () => {
            this.getWishlist("discount");
          }
        );
        break;
      case "added_on":
        this.setState(
          {
            dragDrop: false,
            defaultOption: data,
            filterListing: false,
            currentFilter: data.value
          },
          () => {
            this.getWishlist("added_on");
          }
        );

        break;
      case "price_asc":
        this.setState({
          dragDrop: false,
          defaultOption: data,
          filterListing: false,
          currentFilter: data.value
        });
        this.getWishlist("price_asc");
        break;
      case "price_desc":
        this.setState({
          dragDrop: false,
          defaultOption: data,
          filterListing: false,
          currentFilter: data.value
        });
        this.getWishlist("price_desc");
        break;
      default:
        break;
    }
    document.body.classList.remove(globalStyles.noScroll);
  };

  onSortClick = () => {
    if (this.state.wishlistCount > 0) {
      this.setState({ filterListing: true });
      document.body.classList.add(globalStyles.noScroll);
    }
  };

  onCloseFilter = () => {
    this.setState({ filterListing: false });
    document.body.classList.remove(globalStyles.noScroll);
  };

  render() {
    const { mobile, isLoggedIn, sortedDiscount } = this.props;
    const options = [
      { value: "added_on", label: "Recently Added" },
      { value: "sequence", label: "Drag and Drop" },
      { value: "price_asc", label: "Price Low To High" },
      { value: "price_desc", label: "Price High To Low" }
    ];
    if (sortedDiscount) {
      options.splice(1, 0, {
        value: "discount",
        label: "Discount"
      });
    }
    const emptyWishlistContent = (
      <div>
        <div
          className={cs(
            bootstrapStyles.row,
            { [globalStyles.marginT30]: !mobile },
            styles.minheight
          )}
        >
          {isLoggedIn && (
            <>
              <div
                className={cs(
                  bootstrapStyles.colMd12,
                  styles.wishlistHeading,
                  { [styles.wishlistHeadingMobile]: mobile },
                  globalStyles.textCenter
                )}
              >
                <h2 className={globalStyles.voffset5}>Your Favorites</h2>
              </div>
              <div
                className={cs(
                  bootstrapStyles.colMd12,
                  bootstrapStyles.col12,
                  globalStyles.textCenter
                )}
              >
                {
                  <div className={styles.npfMsg}>
                    Mark your favorite pieces for later!
                  </div>
                }
              </div>
            </>
          )}
          <div
            className={cs(
              bootstrapStyles.colMd12,
              styles.searchHeading,
              { [styles.searchHeadingMobile]: mobile },
              globalStyles.textCenter
            )}
          >
            <h2 className={globalStyles.voffset5}>
              Looking to discover some ideas?
            </h2>
          </div>
          <div className={cs(bootstrapStyles.col12, globalStyles.voffset3)}>
            <div className={bootstrapStyles.row}>
              <div
                className={cs(
                  bootstrapStyles.colMd12,
                  bootstrapStyles.col12,
                  styles.noResultPadding,
                  styles.checkheight,
                  { [styles.checkheightMobile]: mobile }
                )}
              >
                {this.state.featureData.length > 0
                  ? this.state.featureData.map((data, i) => {
                      return (
                        <div
                          key={i}
                          className={cs(
                            bootstrapStyles.colMd3,
                            bootstrapStyles.col6
                          )}
                        >
                          <div className={styles.searchImageboxNew}>
                            <Link to={data.ctaUrl}>
                              <img
                                src={
                                  data.ctaImage == ""
                                    ? "/src/image/noimageplp.png"
                                    : data.ctaImage
                                }
                                // onError={this.addDefaultSrc}
                                alt={data.ctaText}
                                className={styles.imageResultNew}
                              />
                            </Link>
                          </div>
                          <div className={styles.imageContent}>
                            <p className={styles.searchImageTitle}>
                              {data.ctaText}
                            </p>
                            <p className={styles.searchFeature}>
                              <Link to={data.ctaUrl}>{data.title}</Link>
                            </p>
                          </div>
                        </div>
                      );
                    })
                  : ""}
              </div>
            </div>
            {mobile ? (
              ""
            ) : (
              <div className={bootstrapStyles.row}>
                <div
                  className={cs(bootstrapStyles.colMd12, bootstrapStyles.col12)}
                >
                  <div className={cs(styles.searchBottomBlockSecond)}>
                    <div className=" text-center"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
    const emptySharedWishlistContent = (
      <div
        className={cs(styles.emptySharedWishlistContent, {
          [globalStyles.marginT100]: this.props.ownerName
        })}
      >
        <p>{this.props.message}</p>
        <Button
          className={cs({ [globalStyles.btnFullWidth]: mobile })}
          variant="mediumMedCharcoalCta366"
          label={"PROCEED TO GOODEARTH.IN"}
          onClick={() => this.props.history.push("/")}
        />
      </div>
    );

    return (
      <div
        className={cs(bootstrapStyles.containerFluid, {
          [styles.pageBodyTimer]: this.props.showTimer && mobile,
          [styles.sharedEmptyContainer]:
            this.state.wishlistCount == 0 &&
            this.props.isShared &&
            !this.props.ownerName
        })}
      >
        {!this.props.isShared &&
          (mobile ? (
            <div
              className={cs(
                bootstrapStyles.row,
                { [styles.pageBody]: !mobile },
                { [styles.pageBodyMobile]: mobile },
                {
                  [styles.pageBodyTimer]: this.props.showTimer
                }
              )}
            >
              <div className={cs(styles.cSort, styles.subheaderAccount)}>
                <div
                  className={cs(bootstrapStyles.col12, styles.productNumber)}
                  style={{ borderBottom: "1px solid #efeaea" }}
                >
                  <div
                    className={cs(bootstrapStyles.col10, styles.wishlistHeader)}
                  >
                    Saved Items
                  </div>
                  <div className={bootstrapStyles.col2}>
                    <div
                      className={cs(styles.iconSort, {
                        [styles.disable]: this.state.wishlistCount === 0
                      })}
                      onClick={() => this.onSortClick()}
                    >
                      SORT
                    </div>
                  </div>
                  <div
                    className={
                      this.state.filterListing
                        ? bootstrapStyles.row
                        : globalStyles.hidden
                    }
                  >
                    <div
                      className={cs(styles.mobileFilterHeader, {
                        [styles.mobileFilterHeaderTimer]: this.props.showTimer
                      })}
                      id="filterHeader"
                    >
                      <div className={styles.filterCross}>
                        <span>Saved Items</span>
                        <span onClick={() => this.onCloseFilter()}>
                          <i
                            className={cs(
                              iconStyles.icon,
                              iconStyles.iconCrossNarrowBig,
                              styles.iconClose
                            )}
                          ></i>
                        </span>
                      </div>
                    </div>
                    <div className={bootstrapStyles.row}>
                      <div
                        id="mobileFilterMenu"
                        className={cs(
                          bootstrapStyles.col12,
                          styles.mobileFilterMenu,
                          {
                            [styles.mobileFilterMenuTimer]: this.props.showTimer
                          }
                        )}
                      >
                        <ul className={styles.sort}>
                          {options.map((data, index) => {
                            return (
                              <li key={index}>
                                <a
                                  onClick={() => this.setWishlistFilter(data)}
                                  className={
                                    this.state.currentFilter == data.value
                                      ? globalStyles.gold
                                      : ""
                                  }
                                >
                                  {data.label}
                                </a>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <SecondaryHeader>
              <div
                className={cs(
                  bootstrapStyles.colMd7,
                  bootstrapStyles.offsetMd1,
                  styles.careersHeader,
                  globalStyles.verticalMiddle
                )}
              >
                <div>
                  <span className={styles.heading}>SAVED ITEMS</span>
                </div>
              </div>
              <div
                className={cs(
                  bootstrapStyles.colMd3,
                  bootstrapStyles.offsetMd1,
                  globalStyles.verticalMiddle
                )}
              >
                <p className={styles.filterText}>SORT</p>
                <SecondaryHeaderDropdown
                  id="sort-dropdown-wishlist"
                  items={options}
                  value={this.state.defaultOption.value}
                  onChange={this.onChangeFilter}
                  disabled={this.props.wishlistData.length === 0}
                />
              </div>
            </SecondaryHeader>
          ))}
        {this.state.wishlistCount == 0 &&
          this.props.isShared &&
          !this.props.ownerName &&
          emptySharedWishlistContent}
        <div
          className={cs(
            bootstrapStyles.row,
            { [styles.wishlistBlockOuter]: !mobile },
            { [styles.wishlistBlockOuterTimer]: this.props.showTimer }
          )}
        >
          {!isLoggedIn && !this.props.isShared && (
            <div className={styles.topBlockContainer}>
              <div className={styles.innerContainer}>
                <h3 className={styles.heading}>Your Saved List</h3>
                <p className={styles.subheading}>
                  {/* {this.state.wishlistCount > 0 ? ( */}
                  <>
                    Here are your saved items. Login to share the list and
                    <br />
                    continue where you left off.
                  </>
                  {/* ) : (
                    <>
                      Looking for your saved items?
                      <br />
                      Login to pick up where you left off
                    </>
                  )} */}
                </p>
                <Button
                  label={"Login"}
                  variant="smallMedCharcoalCta"
                  onClick={() => this.props.openLogin("/wishlist", false)}
                />
              </div>
            </div>
          )}

          {this.props.isShared && this.props.ownerName && (
            <div className={styles.sharedWrapper}>
              <h2 className={styles.heading}>
                {this.props.ownerName
                  .toLowerCase()
                  .replace(/\b(\w)/g, x => x.toUpperCase())}
                &apos;s Saved List
              </h2>
              <p className={styles.subheading}>
                A wishlist has been shared with you.{mobile && <br />} Start
                shopping!
              </p>
            </div>
          )}
          <div
            className={cs(bootstrapStyles.col10, bootstrapStyles.offset1, {
              [globalStyles.marginT50]: !mobile && !this.props.isShared,
              [globalStyles.marginT30]: mobile && !this.props.isShared
            })}
          >
            {this.state.wishlistCount > 0 && (
              <div>
                <div
                  className={cs(styles.wishlistTop, styles.wishlistSubtotal)}
                >
                  {this.getWishlistSubtotal()}
                </div>
                {!this.props.isShared && (
                  <div
                    className={styles.shareList}
                    onClick={() =>
                      this.props.isLoggedIn
                        ? this.props.openSharePopup(this.props.mobile)
                        : this.props.openLogin("/wishlist", true)
                    }
                  >
                    <img src={linkIcon} alt="link" />
                    <span>SHARE LIST</span>
                  </div>
                )}
              </div>
            )}
            <div
              className={cs(styles.wishlistBlock, styles.awesome)}
              id="wishlist"
            ></div>
            <div
              className={cs(styles.wishlistBlock, styles.awesome)}
              id="emptyWishlist"
            >
              {this.state.wishlistCount == 0 &&
                !this.props.isShared &&
                emptyWishlistContent}
              {this.state.wishlistCount == 0 &&
                this.props.isShared &&
                this.props.ownerName &&
                emptySharedWishlistContent}
            </div>
            {/* {this.state.wishlistCount > 0 && (
              <div className={cs({ [globalStyles.textCenter]: mobile })}>
                <div
                  className={cs(styles.wishlistBottom, styles.wishlistSubtotal)}
                >
                  {this.getWishlistSubtotal()}
                </div>
              </div>
            )} */}
          </div>
        </div>
        <div className="">
          {/* {this.props.popup.type ? this.findPopup(this.props.popup.type) : this.props.popup.type} */}
        </div>

        {this.state.isLoading && <Loader />}
      </div>
    );
  }
}
const WishlistRoute = withRouter(Wishlist);

export default connect(mapStateToProps, mapDispatchToProps)(WishlistRoute);
