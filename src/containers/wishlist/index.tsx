import React from "react";
// import PropTypes from 'prop-types'
// import {Provider} from 'react-redux'
// import BaseLayout from "components/base_layout"
// import * as mapper from "pages/wishlist/mapper/wishlistM"
import { connect } from "react-redux";
// import Size from './size.jsx'
// import Notify from './notify'

import SelectableDropdownMenu from "components/dropdown/selectableDropdownMenu";
import styles from "./styles.scss";
import globalStyles from "../../styles/global.scss";
// import secondaryHeaderStyles from "components/SecondaryHeader/styles.scss";
import bootstrapStyles from "../../styles/bootstrap/bootstrap-grid.scss";
import cs from "classnames";
import createAbsoluteGrid from "react-absolute-grid";
import SampleDisplay from "./display";
import ReactDOM from "react-dom";
import { currencyCodes } from "constants/currency";
import { AppState } from "reducers/typings";
import { Dispatch } from "redux";
import Loader from "components/Loader";
import SecondaryHeader from "components/SecondaryHeader";
// import WishlistGrid from './gridLayout';
import { WishlistItem, WishListGridItem } from "typings/wishlist";
import WishlistService from "services/wishlist";
// import { Link } from 'react-router-dom';
import * as _ from "lodash";
import NotifyMePopup from "components/NotifyMePopup";
import { updateComponent, updateModal } from "../../actions/modal";
import { Currency } from "typings/currency";

let AbsoluteGrid: any;

const mapStateToProps = (state: AppState) => {
  return {
    mobile: state.device.mobile,
    currency: state.currency,
    wishlistData: state.wishlist.items
  };
};
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    removeFromWishlist: async (productId: number, sortBy: string) =>
      await WishlistService.removeFromWishlist(dispatch, productId, sortBy),
    updateWishlist: async (sortBy: string) =>
      await WishlistService.updateWishlist(dispatch, sortBy),
    updateWishlistSequencing: async (sequencing: [number, number][]) =>
      await WishlistService.updateWishlistSequencing(dispatch, sequencing),
    openPopup: (item: WishListGridItem, currency: Currency) => {
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
      let selectedIndex = 0;
      childAttributes.map((v, i) => {
        if (v.size === item?.size) {
          selectedIndex = i;
        }
      });
      const changeSize = async (size: string, quantity?: number) => {
        await WishlistService.modifyWishlistItem(
          dispatch,
          item.id,
          size,
          quantity
        );
      };
      dispatch(
        updateComponent(
          <NotifyMePopup
            price={item.price[currency]}
            currency={String.fromCharCode(currencyCodes[currency])}
            title={item.productName}
            childAttributes={childAttributes}
            selectedIndex={selectedIndex}
            changeSize={changeSize}
          />,
          false
        )
      );
      dispatch(updateModal(true));
    },
    changeSize: async (id: number, size: string, quantity: number) => {
      await WishlistService.modifyWishlistItem(dispatch, id, size, quantity);
    }
  };
};

export type Props = {
  wishlistData: WishlistItem[];
} & ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

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
};

class Wishlist extends React.Component<Props, State> {
  dragFlag: boolean;
  constructor(props: Props) {
    super(props);
    this.state = {
      isLoading: false,
      dragDrop: true,
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
      defaultOption: { value: "sequence", label: "Drag and Drop" },
      currentFilter: "sequence",
      wishlistCount: 0,
      totalPrice: 0,
      saleStatus: false
    };
    // let impression = true;
    this.dragFlag = false;
    AbsoluteGrid = createAbsoluteGrid(
      SampleDisplay,
      {
        grid: props,
        removeProduct: this.removeProduct,
        mobile: this.props.mobile,
        currency: this.props.currency
      },
      false
    );
  }

  // findPopup(popupType) {
  //     let temp = null;
  //     switch (popupType) {
  //         case 'SIZE':
  //             for (let wishlist_item of this.state.sampleItems) {
  //                 if (this.props.popup.data.id === wishlist_item.id) {
  //                     temp = wishlist_item;
  //                     break;
  //                 }
  //             }
  //             return <Size wishlist_product={temp} closePopup={this.props.closePopup}
  //                          dispatch={this.props.dispatch}
  //                          removeProduct={this.removeProduct} callWishlist={this.getWishlist}
  //                          notifymsg={this.notifymsg} showNotify={this.props.showNotify}
  //                          showNotification={this.props.showNotification}/>;
  //         case 'NOTIFY' :
  //             for (let wishlist_item of this.state.sampleItems) {
  //                 if (this.props.popup.data == wishlist_item.product_id) {
  //                     temp = wishlist_item;
  //                     break;
  //                 }
  //             }
  //             return <Size wishlist_product={temp} closePopup={this.props.closePopup}
  //                          dispatch={this.props.dispatch}
  //                          removeProduct={this.removeProduct} callWishlist={this.getWishlist}
  //                          notifymsg={this.notifymsg} showNotify={this.props.showNotify}
  //                          showNotification={this.props.showNotification}/>;
  //         default:
  //             return null;
  //     }
  // }

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

  onChangeFilter = (data?: string) => {
    ReactDOM.unmountComponentAtNode(
      document.getElementById("wishlist") as HTMLDivElement
    );
    switch (data) {
      case "sequence":
        this.setState(
          {
            dragDrop: true,
            defaultOption: { value: data, label: data }
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
            defaultOption: { value: data, label: data }
          },
          () => {
            this.getWishlist("added_on");
          }
        );

        break;
      case "price_asc":
        this.setState({
          dragDrop: false,
          defaultOption: { value: data, label: data }
        });
        this.getWishlist("price_asc");
        break;
      case "price_desc":
        this.setState({
          dragDrop: false,
          defaultOption: { value: data, label: data }
        });
        this.getWishlist("price_desc");
        break;
      default:
        break;
    }
    window.scrollTo(0, 0);
  };

  // notifymsg() {
  //     this.props.showNotification("Item has been added to your bag!")
  //     setTimeout(()=>this.props.showNotification(''), 2000);
  // }

  // removeItemFromList(id) {
  //     let new_list = [];
  //     this.state.sampleItems.map(data => {
  //         if (data.id == id) {
  //             data.filtered = true;
  //             new_list.push(data);
  //         } else {
  //             new_list.push(data);
  //         }
  //     })
  //     this.setState({
  //         sampleItems: new_list
  //     })
  //     this.myrender(new_list)
  // }

  removeProduct = (data: WishlistItem) => {
    this.setState({
      isLoading: true
    });

    this.props
      .removeFromWishlist(data.productId, this.state.defaultOption.value)
      .finally(() => {
        this.setState({ isLoading: false });
      });
  };

  componentDidMount() {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 1000);
    this.updateGrid(this.props);
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    this.updateGrid(nextProps);
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
          item
        );
        return gridItem;
      });
    } else {
      newWishlistData = nextProps.wishlistData.map((data, i) => {
        return Object.assign({}, { key: i, sort: i }, data);
      });
    }
    const product = nextProps.wishlistData.map((prod, i) => {
      if (Object.keys(prod).length === 0) return false;
      const index = prod.category.length - 1;
      let category = prod.category[index]
        ? prod.category[index].replace(/\s/g, "")
        : "";
      category = category.replace(/>/g, "/");
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
            list: "Wishlist",
            price: cur,
            brand: "Goodearth",
            position: i + 1,
            variant: prod.gaVariant ? prod.gaVariant : null
          }
        );
      });
    });
    if (
      product.length > 0 &&
      //  this.impression
      true
    ) {
      // impression = false;
      // dataLayer.push({
      //     event: 'productImpression',
      //     ecommerce: {
      //         'currencyCode': window.currency,
      //         'impressions': product
      //     }
      // })
    }

    const wishlistTotal = nextProps.wishlistData.map(item => {
      if (!item.size && item.stockDetails.length > 1) {
        const itemTotal = item.stockDetails.reduce((prev, curr) => {
          const prevprices = parseFloat(prev.price[currency].toString());
          const currprices = parseFloat(curr.price[currency].toString());
          return prevprices < currprices ? prev : curr;
        });
        return +itemTotal.price[currency];
      } else if (item.size) {
        let vars = 0;
        item.stockDetails.forEach(function(items, key) {
          if (item.size == items.size) {
            vars = +items.price[currency];
          }
        });
        return vars;
      } else {
        return item.stockDetails[0] ? +item.stockDetails[0].price[currency] : 0;
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
          {String.fromCharCode(currencyCodes[this.props.currency]) +
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
            dragEnabled={this.state.dragDrop}
            onDragEnd={() => this.onDropWishlist()}
            onDragMove={() => this.onDragWishlist()}
            itemWidth={150}
            itemHeight={300}
            responsive={true}
            onMove={_.debounce(this.onMoveDebounced, 40)}
          />,
          document.getElementById("wishlist")
        );
      } else {
        ReactDOM.render(
          <AbsoluteGrid
            items={data}
            dragEnabled={this.state.dragDrop}
            onDragEnd={() => this.onDropWishlist()}
            onDragMove={() => this.onDragWishlist()}
            itemWidth={280}
            itemHeight={480}
            responsive={true}
            onMove={_.debounce(this.onMoveDebounced, 40)}
          />,
          document.getElementById("wishlist")
        );
      }
    } else {
      ReactDOM.render(
        <div>Your wishlist is empty.</div>,
        document.getElementById("wishlist")
      );
    }
  };

  onMoveDebounced = (source: any, target: any) => {
    source = _.find(this.state.sampleItems, { key: parseInt(source, 10) });
    target = _.find(this.state.sampleItems, { key: parseInt(target, 10) });
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
    return (
      <>
        {mobile ? (
          <div className="row hidden-lg hidden-md">
            <div className="c-sort subheader-account">
              <div
                className="col-xs-12 product-number"
                style={{ borderBottom: "1px solid #efeaea" }}
              >
                <div className=" col-xs-10 wishlist-header">Wishlist</div>
                <div className="hidden-md hidden-lg col-xs-2">
                  <i
                    className="icon icon_sort"
                    onClick={() => this.setState({ filterListing: true })}
                  ></i>
                </div>
                <div
                  className={
                    this.state.filterListing
                      ? "row hidden-lg hidden-md"
                      : "hidden"
                  }
                >
                  <div className="mobile-filter-header">
                    <div className="filter-cross">
                      <span>Wishlist</span>
                      <span
                        onClick={() => this.setState({ filterListing: false })}
                      >
                        <i className="icon icon_cross"></i>
                      </span>
                    </div>
                  </div>
                  <div className="row minimumWidth">
                    <div className="col-xs-12 col-sm-12 mobile-filter-menu ">
                      <ul className="sort hidden-md hidden-lg">
                        {this.state.options.map((data, index) => {
                          return (
                            <li key={index}>
                              <a
                                onClick={() => this.setWishlistFilter(data)}
                                className={
                                  this.state.currentFilter == data.value
                                    ? "cerise"
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
                showCaret={true}
              ></SelectableDropdownMenu>
            </div>
          </SecondaryHeader>
        )}
        <div className={cs(bootstrapStyles.row, styles.wishlistBlockOuter)}>
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
            {this.state.wishlistCount > 0 && (
              <div className={globalStyles.textCenter}>
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
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Wishlist);
