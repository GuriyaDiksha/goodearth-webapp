import React, { Fragment } from "react";
import SecondaryHeader from "components/SecondaryHeader";
import SelectableDropdownMenu from "components/dropdown/selectableDropdownMenu";
import initActionSearch from "./initAction";
import { DropdownItem } from "components/dropdown/baseDropdownMenu/typings";
import cs from "classnames";
import { AppState } from "reducers/typings";
import { connect } from "react-redux";
import iconStyles from "../../styles/iconFonts.scss";
import styles from "./styles.scss";
import globalStyles from "styles/global.scss";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
import FilterListSearch from "./filterList";
import PlpDropdownMenu from "components/PlpDropDown";
import PlpResultItem from "components/plpResultItem";
import ModalActions from "../../components/Modal/mapper/actions";
// import Loader from "components/Loader";
// import MakerEnhance from "maker-enhance";
import { PartialProductItem } from "typings/product";
import { WidgetImage } from "components/header/typings";
import { Dispatch } from "redux";
import HeaderService from "services/headerFooter";
import { withRouter, RouteComponentProps, Link } from "react-router-dom";
import { updateComponent, updateModal } from "actions/modal";
import GiftcardItem from "components/plpResultItem/giftCard";
import CookieService from "../../services/cookie";
import { POPUP } from "constants/components";
import * as util from "utils/validate";

const mapStateToProps = (state: AppState) => {
  return {
    plpProductId: state.searchList.searchProductId,
    facetObject: state.searchList.facetObject,
    data: state.searchList.data,
    location: state.router.location,
    currency: state.currency,
    device: state.device,
    showTimer: state.info.showTimer,
    scrollDown: state.info.scrollDown
  };
};
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    fetchFeaturedContent: async () => {
      const res = HeaderService.fetchSearchFeaturedContent(dispatch);
      return res;
    },
    updateComponentModal: (
      component: string,
      props: any,
      fullscreen?: boolean
    ) => {
      dispatch(updateComponent(component, props, fullscreen));
    },
    changeModalState: (data: boolean) => {
      dispatch(updateModal(data));
    }
  };
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  ReturnType<typeof ModalActions> &
  RouteComponentProps;
// &
// DispatchProp;

class Search extends React.Component<
  Props,
  {
    filterData: string;
    showmobileSort: boolean;
    filterCount: number;
    mobileFilter: boolean;
    searchText: string;
    sortValue: string;
    searchMaker: boolean;
    featureData: WidgetImage[];
    flag: boolean;
  }
> {
  private child: any = FilterListSearch;
  constructor(props: Props) {
    super(props);
    const queryString = props.location.search;
    const urlParams = new URLSearchParams(queryString);
    const param = urlParams.get("sort_by");
    const searchValue = urlParams.get("q");
    this.state = {
      filterData: "All",
      filterCount: 0,
      showmobileSort: false,
      mobileFilter: false,
      searchText: searchValue ? searchValue : "",
      sortValue: param ? param : "hc",
      searchMaker: false,
      flag: false,
      featureData: []
    };
  }

  onchangeFilter = (data: any, label?: string): void => {
    this.child.changeValue(null, data);
    const {
      device: { mobile }
    } = this.props;
    if (mobile) {
      this.child.clickCloseFilter();
    }
    util.sortGTM(label || data);
  };

  setFilterCount = (count: number) => {
    if (count != this.state.filterCount)
      this.setState({
        filterCount: count
      });
  };

  onClickQuickView = (id: number) => {
    const { updateComponentModal, changeModalState, plpProductId } = this.props;
    const {
      data: {
        results: { data }
      }
    } = this.props;
    const selectItem: any = data.filter(item => {
      return item.id == id;
    });
    updateComponentModal(
      POPUP.QUICKVIEW,
      {
        id: id,
        productListId: plpProductId,
        source: "Search",
        corporatePDP:
          ["Pero", "Souk", "Eka"].indexOf(selectItem[0]?.partner) > -1
            ? true
            : false
      },
      true
    );
    changeModalState(true);
  };
  componentDidMount() {
    util.moveChatDown();
    this.setState({
      searchMaker: true
    });
    dataLayer.push(function(this: any) {
      this.reset();
    });
    util.pageViewGTM("Search");
    dataLayer.push({
      event: "SearchView",
      PageURL: this.props.location.pathname,
      PageTitle: "virtual_search_view"
    });
    Moengage.track_event("Page viewed", {
      "Page URL": this.props.location.pathname,
      "Page Name": "SearchView"
    });
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
  }

  componentWillUnmount() {
    util.moveChatUp();
  }

  onChangeFilterState = (state: boolean, cross?: boolean) => {
    if (cross) {
      this.setState({
        mobileFilter: state,
        showmobileSort: true
      });
    } else {
      this.setState({
        mobileFilter: state,
        showmobileSort: false
      });
    }
  };

  handleChange = (event: any) => {
    // const regex = /^[A-Za-z0-9% ]+$/;
    // if (event.target.value == "" || regex.test(event.target.value)) {
    this.setState({
      searchText: event.target.value
    });
    // }
  };

  onEnterSearch = (event: any) => {
    if (event.target.value.trim().length > 2) {
      if (event.keyCode == 13) {
        this.child.changeSearchValue(this.state.searchText);
      }
    }
  };

  gtmPushSearchClick = (e: any, item: PartialProductItem, i: number) => {
    try {
      let category = "";
      if (item.categories) {
        const index = item.categories.length - 1;
        category = item.categories[index].replace(/\s/g, "");
        category = category.replace(/>/g, "/");
      }
      // localStorage.setItem("list", "Search Page");
      if (item.childAttributes && item.childAttributes.length > 0) {
        const product = (item.childAttributes as any).map((skuItem: any) => {
          return {
            name: item.title,
            id: skuItem.sku,
            price: skuItem.discountedPriceRecords
              ? skuItem.discountedPriceRecords[this.props.currency]
              : skuItem.priceRecords[this.props.currency],
            brand: "Goodearth",
            category: category,
            variant: skuItem.size || "",
            position: i
          };
        });
        const listPath = `SearchResults`;
        CookieService.setCookie("listPath", listPath);
        // let cur = this.state.salestatus ? item.product.discounted_pricerecord[window.currency] : item.product.pricerecords[window.currency]
        dataLayer.push({
          event: "productClick",
          ecommerce: {
            currencyCode: this.props.currency,
            click: {
              // actionField: { list: "Search Page" },
              actionField: { list: listPath },
              products: product
            }
          }
        });
        Moengage.track_event("search", {
          keyword: product.name,
          "Search Suggestions Clicked": true,
          Currency: this.props.currency
        });
      }
    } catch (err) {
      console.log("Search GTM error");
    }
  };

  showProduct(data: PartialProductItem | WidgetImage, indices: number) {
    this.props.history.push((data as WidgetImage).ctaUrl);
  }

  addDefaultSrc = (e: any) => {
    // e.target.src = "/static/img/noimageplp.png";
  };

  onClickSearch = (event: any) => {
    if (this.state.searchText.trim().length > 2) {
      this.child.changeSearchValue(this.state.searchText);
    }
  };

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    const queryString = nextProps.location.search;
    const urlParams = new URLSearchParams(queryString);
    const searchValue = urlParams.get("q");
    if (searchValue !== this.state.searchText) {
      this.setState({
        searchText: searchValue ? searchValue : ""
      });
    }
    const sort = urlParams.get("sort_by");
    if (sort !== this.state.sortValue) {
      this.setState({
        sortValue: sort ? sort : "hc"
      });
    }
  }

  changeLoader = (value: boolean) => {
    this.setState({
      flag: value
    });
  };

  render() {
    const {
      device: { mobile },
      currency,
      data: {
        results: { banner, data, facets },
        count
      }
    } = this.props;
    // const { searchMaker } = this.state;
    const items: DropdownItem[] = [
      {
        label: "Our Curation",
        value: "hc"
      },
      {
        label: "Newest First",
        value: "is_new"
      },
      {
        label: "Price: Lowest First",
        value: "price_asc"
      },
      {
        label: "Price: Highest First",
        value: "price_desc"
      }
    ];
    if (facets.sortedDiscount) {
      items.splice(1, 0, {
        label: "Discount",
        value: "discount"
      });
    }
    return (
      <div
        className={cs(
          styles.pageBody,
          { [styles.pageBodyTimer]: this.props.showTimer },
          bootstrap.containerFluid
        )}
      >
        {!mobile && (
          <SecondaryHeader classname={styles.subHeader}>
            <Fragment>
              <div
                className={cs(
                  bootstrap.colMd7,
                  bootstrap.offsetMd1,
                  styles.searchBlockPage
                )}
              >
                <input
                  type="text"
                  placeholder="Looking for something?"
                  value={this.state.searchText}
                  onKeyUp={this.onEnterSearch}
                  onChange={this.handleChange}
                />
                <i
                  className={cs(
                    iconStyles.icon,
                    iconStyles.iconSearch,
                    styles.iconSearchbar
                  )}
                  onClick={this.onClickSearch}
                ></i>
              </div>
              <div className={cs(bootstrap.colMd3, styles.innerHeader)}>
                <p className={styles.filterText}>Sort</p>
                <SelectableDropdownMenu
                  id="sort-dropdown-search"
                  align="right"
                  className={styles.dropdownRoot}
                  items={items}
                  value={this.state.sortValue}
                  onChange={this.onchangeFilter}
                  showCaret={true}
                  disabled={data.length == 0 ? true : false}
                ></SelectableDropdownMenu>
              </div>
            </Fragment>
          </SecondaryHeader>
        )}
        <div className={cs(bootstrap.row, globalStyles.minimumWidth)}>
          <div
            id="filter_by"
            className={
              mobile
                ? cs(
                    { [globalStyles.active]: this.state.mobileFilter },
                    bootstrap.col12,
                    styles.mobileFilterMenu,
                    { [styles.mobileFilterMenuTimer]: this.props.showTimer },
                    globalStyles.hideLeft
                  )
                : cs(bootstrap.colMd2, styles.filterSticky)
            }
          >
            <FilterListSearch
              key={"search"}
              onRef={(el: any) => (this.child = el)}
              setFilterCount={this.setFilterCount}
              changeLoader={this.changeLoader}
              onChangeFilterState={this.onChangeFilterState}
            />
          </div>
          <div
            className={cs(
              { [globalStyles.hidden]: this.state.showmobileSort },
              { [globalStyles.paddTop80]: !this.state.showmobileSort },
              { [styles.spCat]: !this.state.showmobileSort },
              bootstrap.colMd10,
              bootstrap.col12
            )}
          >
            {/* <div className={cs(bootstrap.row, globalStyles.voffset5)}>
                  <div className={cs(bootstrap.colMd10, bootstrap.offsetMd1, bootstrap.col12, globalStyles.textCenter)}>
                      <div className={styles.npfMsg}>No products were found matching
                      </div>
                  </div>
              </div> */}
            {/* {banner ?
                  <div className="row banner-mobile-category">
                      {window.maker.plp ? <MakerEnhance user='goodearth'/> : ""}
                      <div className="col-xs-12 text-center" >
                          <img src={banner} className="img-responsive" />
                      </div>
                  </div> : ""} */}
            {/* {searchMaker && (
              <MakerEnhance
                user="goodearth"
                index="1"
                href={`${window.location.origin}${this.props.location.pathname}?${this.props.location.search}`}
              />
            )} */}
            {!mobile && data.length ? (
              <div
                className={cs(
                  styles.productNumber,
                  globalStyles.voffset5,
                  styles.imageContainer,
                  {
                    [styles.border]: mobile
                  }
                )}
              >
                <span>
                  {count > 1
                    ? count + " products found"
                    : count + " product found"}{" "}
                </span>
              </div>
            ) : (
              ""
            )}
            <div
              className={
                mobile
                  ? banner
                    ? cs(bootstrap.row, styles.imageContainerMobileBanner)
                    : cs(bootstrap.row, bootstrap.imageContainerMobile)
                  : cs(bootstrap.row, styles.imageContainer, styles.minHeight)
              }
              id="product_images"
            >
              {data.map((item, i) => {
                if (item.priceRecords[currency] > 0) {
                  return (
                    <div
                      className={cs(
                        bootstrap.colMd4,
                        bootstrap.col6,
                        styles.setWidth
                      )}
                      key={item.id}
                      // onClick={e => {
                      //   this.gtmPushSearchClick(e, item, i);
                      // }}
                    >
                      {item.productClass != "GiftCard" ? (
                        <PlpResultItem
                          page="SearchResults"
                          position={i}
                          product={item}
                          addedToWishlist={false}
                          currency={currency}
                          key={item.id}
                          mobile={mobile}
                          onClickQuickView={this.onClickQuickView}
                          loader={this.state.flag}
                          isCorporate={
                            ["Pero", "Souk", "Eka"].indexOf(
                              item.partner || ""
                            ) > -1
                              ? true
                              : false
                          }
                        />
                      ) : (
                        <GiftcardItem isCorporateGifting={false} />
                      )}
                    </div>
                  );
                }
              })}
            </div>
            <div
              className={
                (data && this.state.searchText
                ? data.length == 0 && this.state.searchText.length > 2
                : false)
                  ? " voffset5 row image-container search searchpage mobile-nosearch"
                  : globalStyles.hidden
              }
            >
              <div
                className={cs(
                  bootstrap.row,
                  globalStyles.marginT50,
                  styles.minheight
                )}
              >
                <div
                  className={cs(
                    bootstrap.colMd12,
                    bootstrap.col12,
                    globalStyles.textCenter
                  )}
                >
                  {(this.state.searchText ? (
                    this.state.searchText.length > 1
                  ) : (
                    false
                  )) ? (
                    <div className={styles.npfMsg}>
                      {"Sorry, we couldn't find any matching result for"} &nbsp;
                      <span>{this.state.searchText}</span>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <div
                  className={cs(
                    bootstrap.colMd12,
                    styles.searchHeading,
                    globalStyles.textCenter
                  )}
                >
                  <h2 className={globalStyles.voffset5}>Featured Categories</h2>
                </div>
                <div className={cs(bootstrap.col12, globalStyles.voffset3)}>
                  <div className={bootstrap.row}>
                    <div
                      className={cs(
                        bootstrap.colMd12,
                        bootstrap.col12,
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
                                className={cs(bootstrap.colMd3, bootstrap.col6)}
                              >
                                <div className={styles.searchImageboxNew}>
                                  <Link
                                    to={data.ctaUrl}
                                    onClick={this.showProduct.bind(
                                      this,
                                      data,
                                      i
                                    )}
                                  >
                                    <img
                                      src={
                                        data.ctaImage == ""
                                          ? "/src/image/noimageplp.png"
                                          : data.ctaImage
                                      }
                                      onError={this.addDefaultSrc}
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
                                    <Link
                                      to={data.ctaUrl}
                                      onClick={this.showProduct.bind(
                                        this,
                                        data,
                                        i
                                      )}
                                    >
                                      {data.title}
                                    </Link>
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
                    <div className={bootstrap.row}>
                      <div className={cs(bootstrap.colMd12, bootstrap.col12)}>
                        <div className={cs(styles.searchBottomBlockSecond)}>
                          <div className=" text-center"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {mobile && (
          <PlpDropdownMenu
            filterCount={this.state.filterCount}
            list={items}
            onChange={this.onchangeFilter}
            onStateChange={this.onChangeFilterState}
            showCaret={this.state.showmobileSort}
            open={false}
            value="hc"
            sortedDiscount={facets.sortedDiscount}
          />
        )}
      </div>
    );
  }
}

const SearchRoute = withRouter(Search);
export default connect(mapStateToProps, mapDispatchToProps)(SearchRoute);
export { initActionSearch };
