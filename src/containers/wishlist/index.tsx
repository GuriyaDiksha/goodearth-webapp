import React from "react";
import { connect } from "react-redux";
import cs from "classnames";
import iconStyles from "../../styles/iconFonts.scss";
import createAbsoluteGrid from "react-absolute-grid";
import SampleDisplay from "./display";
import ReactDOM from "react-dom";
import { currencyCodes } from "constants/currency";
import { AppState } from "reducers/typings";
import { Dispatch } from "redux";
import Loader from "components/Loader";
import SecondaryHeader from "components/SecondaryHeader";
import SelectableDropdownMenu from "components/dropdown/selectableDropdownMenu";
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
import { POPUP } from "constants/components";
import * as util from "utils/validate";

let AbsoluteGrid: any;

const mapStateToProps = (state: AppState) => {
  return {
    mobile: state.device.mobile,
    currency: state.currency,
    wishlistData: state.wishlist.items,
    isLoggedIn: state.user.isLoggedIn,
    isSale: state.info.isSale
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
    updateWishlistSequencing: async (sequencing: [number, number][]) =>
      await WishlistService.updateWishlistSequencing(dispatch, sequencing),
    openPopup: (
      item: WishListGridItem,
      currency: Currency,
      sortBy: string,
      isSale?: boolean
    ) => {
      const childAttributes = item.stockDetails.map(
        ({ discountedPrice, productId, stock, size, price, sku }) => {
          return {
            discountedPriceRecords: discountedPrice,
            id: productId,
            isBridalProduct: false,
            sku: sku,
            priceRecords: price,
            size: size,
            stock: stock
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
        await WishlistService.modifyWishlistItem(
          dispatch,
          item.id,
          size,
          quantity,
          sortBy
        );
      };

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
            list: "wishlist"
          },
          false,
          ModalStyles.bottomAlign
        )
      );
      dispatch(updateModal(true));
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
  options: { value: string; label: string }[];
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
  constructor(props: Props) {
    super(props);
    this.state = {
      featureData: [],
      isLoading: false,
      dragDrop: false,
      sampleItems: [],
      filterListing: false,
      options: [
        { value: "added_on", label: "Recently Added" },
        {
          value: "sequence",
          label: "Drag and Drop"
        },
        { value: "price_asc", label: "Price Low To High" },
        { value: "price_desc", label: "Price High To Low" }
      ],
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
        grid: props,
        removeProduct: this.removeProduct,
        mobile: this.props.mobile,
        currency: this.props.currency,
        isSale: this.props.isSale,
        sortBy: this.state.currentFilter
      },
      false
    );
  }

  getWishlist = (sortBy: string) => {
    this.setState({
      isLoading: true
    });
    if (!sortBy && this.state.defaultOption.value) {
      sortBy = this.state.defaultOption.value;
    }
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
  };

  onChangeFilter = (data?: string, label?: string) => {
    ReactDOM.unmountComponentAtNode(
      document.getElementById("wishlist") as HTMLDivElement
    );
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
      default:
        break;
    }
    if (data) {
      util.sortGTM(label || data);
    }
    window.scrollTo(0, 0);
  };

  removeProduct = (data: WishlistItem) => {
    this.setState({
      isLoading: true
    });

    this.props
      .removeFromWishlist(this.state.defaultOption.value, undefined, data.id)
      .finally(() => {
        this.setState({ isLoading: false });
      });
  };

  componentDidMount() {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 1000);
    if (!this.props.isLoggedIn) {
      this.props.history.push("/");
    }
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
    util.pageViewGTM("Wishlist");
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
          sortBy: this.state.currentFilter
        },
        false
      );
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    this.updateGrid(nextProps);
    if (!nextProps.isLoggedIn) {
      this.props.history.push("/");
    }
    if (this.props.currency !== nextProps.currency) {
      this.getWishlist(this.state.defaultOption.value);
      AbsoluteGrid = createAbsoluteGrid(
        SampleDisplay,
        {
          grid: nextProps,
          removeProduct: this.removeProduct,
          mobile: nextProps.mobile,
          currency: nextProps.currency,
          isSale: nextProps.isSale,
          sortBy: this.state.currentFilter
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
      dataLayer.push({
        event: "productImpression",
        ecommerce: {
          currencyCode: this.props.currency,
          impressions: product
        }
      });
    }

    const wishlistTotal = nextProps.wishlistData.map(item => {
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
        return +itemTotal.discountedPrice[currency];
      } else if (item.size) {
        let vars = 0;
        item.stockDetails.forEach(function(items, key) {
          if (item.size == items.size) {
            vars = +items.discountedPrice[currency];
          }
        });
        return vars;
      } else {
        return item.stockDetails[0]
          ? +item.stockDetails[0].discountedPrice[currency]
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
        <span>{"(" + this.state.wishlistCount + " items) Subtotal: "}</span>
        <span
          className={cs(
            globalStyles.cerise,
            styles.cerise,
            globalStyles.italic
          )}
        >
          {String.fromCharCode(...currencyCodes[this.props.currency]) +
            " " +
            this.state.totalPrice}
        </span>
      </div>
    );
  }

  myrender = (data: WishListGridItem[]) => {
    if (data.length > 0) {
      if (this.props.mobile) {
        ReactDOM.render(
          <AbsoluteGrid
            items={data}
            currency={this.props.currency}
            dragEnabled={this.state.dragDrop}
            onDragEnd={() => this.onDropWishlist()}
            onDragMove={() => this.onDragWishlist()}
            itemWidth={150}
            itemHeight={300}
            responsive={true}
            onMove={debounce(this.onMoveDebounced, 40)}
          />,
          document.getElementById("wishlist")
        );
      } else {
        ReactDOM.render(
          <AbsoluteGrid
            currency={this.props.currency}
            items={data}
            dragEnabled={this.state.dragDrop}
            onDragEnd={() => this.onDropWishlist()}
            onDragMove={() => this.onDragWishlist()}
            itemWidth={280}
            itemHeight={480}
            responsive={true}
            onMove={debounce(this.onMoveDebounced, 40)}
          />,
          document.getElementById("wishlist")
        );
      }
    } else {
      ReactDOM.render(<></>, document.getElementById("wishlist"));
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
    ReactDOM.unmountComponentAtNode(
      document.getElementById("wishlist") as HTMLDivElement
    );
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
  };

  render() {
    const { mobile } = this.props;
    const emptyWishlistContent = (
      <div>
        <div
          className={cs(
            bootstrapStyles.row,
            { [globalStyles.marginT30]: !mobile },
            styles.minheight
          )}
        >
          <div
            className={cs(
              bootstrapStyles.colMd12,
              bootstrapStyles.col12,
              globalStyles.textCenter
            )}
          >
            {
              <div className={styles.npfMsg}>
                Your wishlist is currently empty
              </div>
            }
          </div>
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
                                alt=""
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
    return (
      <div className={bootstrapStyles.containerFluid}>
        {mobile ? (
          <div className={cs(bootstrapStyles.row, globalStyles.voffset7)}>
            <div className={cs(styles.cSort, styles.subheaderAccount)}>
              <div
                className={cs(bootstrapStyles.col12, styles.productNumber)}
                style={{ borderBottom: "1px solid #efeaea" }}
              >
                <div
                  className={cs(bootstrapStyles.col10, styles.wishlistHeader)}
                >
                  Wishlist
                </div>
                <div className={bootstrapStyles.col2}>
                  <i
                    className={cs(
                      iconStyles.icon,
                      iconStyles.iconSort,
                      styles.iconSort
                      // globalStyles.cerise
                    )}
                    onClick={
                      this.state.wishlistCount > 0
                        ? () => this.setState({ filterListing: true })
                        : () => null
                    }
                  ></i>
                </div>
                <div
                  className={
                    this.state.filterListing
                      ? bootstrapStyles.row
                      : globalStyles.hidden
                  }
                >
                  <div className={styles.mobileFilterHeader}>
                    <div className={styles.filterCross}>
                      <span>Wishlist</span>
                      <span
                        onClick={() => this.setState({ filterListing: false })}
                      >
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
                      className={cs(
                        bootstrapStyles.col12,
                        styles.mobileFilterMenu
                      )}
                    >
                      <ul className={styles.sort}>
                        {this.state.options.map((data, index) => {
                          return (
                            <li key={index}>
                              <a
                                onClick={() => this.setWishlistFilter(data)}
                                className={
                                  this.state.currentFilter == data.value
                                    ? globalStyles.cerise
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
                <span className={styles.heading}>Wishlist</span>
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
              <SelectableDropdownMenu
                align="right"
                className={styles.dropdownRoot}
                items={this.state.options}
                value={this.state.defaultOption.value}
                onChange={this.onChangeFilter}
                disabled={this.state.wishlistCount == 0}
                showCaret={true}
              ></SelectableDropdownMenu>
            </div>
          </SecondaryHeader>
        )}
        <div
          className={cs(
            bootstrapStyles.row,
            { [styles.wishlistBlockOuter]: !mobile },
            { [styles.wishlistBlockOuterMobile]: mobile }
          )}
        >
          <div className={cs(bootstrapStyles.col10, bootstrapStyles.offset1)}>
            {this.state.wishlistCount > 0 && (
              <div className={cs(styles.wishlistTop, styles.wishlistSubtotal)}>
                {this.getWishlistSubtotal()}
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
              {this.state.wishlistCount == 0 && emptyWishlistContent}
            </div>
            {this.state.wishlistCount > 0 && (
              <div className={cs({ [globalStyles.textCenter]: mobile })}>
                <div
                  className={cs(styles.wishlistBottom, styles.wishlistSubtotal)}
                >
                  {this.getWishlistSubtotal()}
                </div>
              </div>
            )}
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
