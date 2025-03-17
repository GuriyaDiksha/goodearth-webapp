import React, { Fragment } from "react";
import SecondaryHeader from "components/SecondaryHeader";
import initActionSearch from "./initAction";
import cs from "classnames";
import { AppState } from "reducers/typings";
import { connect } from "react-redux";
// import iconStyles from "../../styles/iconFonts.scss";
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
import SecondaryHeaderDropdown from "components/dropdown/secondaryHeaderDropdown";
import { CategoryMenu } from "containers/plp/typings";
import { GA_CALLS } from "constants/cookieConsent";
import ProductCounter from "components/ProductCounter";
import { throttle } from "lodash";
import ResetFiltersTile from "components/plpResultItem/resetFiltersTile";
import { viewSelectionGTM } from "utils/validate";
import activeGrid from "../../images/plpIcons/active_grid.svg";
import inactiveGrid from "../../images/plpIcons/inactive_grid.svg";
import activeList from "../../images/plpIcons/active_list.svg";
import inactiveList from "../../images/plpIcons/inactive_list.svg";
import { updatePlpMobileView } from "actions/plp";
import PlpResultListViewItem from "components/plpResultListViewItem";
import { ChildProductAttributes, PLPProductItem } from "typings/product";
import ModalStyles from "components/Modal/styles.scss";
import ResetFilterModal from "./ResetFilterModal";

const mapStateToProps = (state: AppState) => {
  return {
    plpProductId: state.searchList.searchProductId,
    facetObject: state.searchList.facetObject,
    data: state.searchList.data,
    location: state.router.location,
    currency: state.currency,
    device: state.device,
    isSale: state.info.isSale,
    showTimer: state.info.showTimer,
    scrollDown: state.info.scrollDown,
    plpMobileView: state.plplist.plpMobileView
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
    },
    updateMobileView: (plpMobileView: "list" | "grid") => {
      dispatch(updatePlpMobileView(plpMobileView));
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
    count: number;
    showProductCounter: boolean;
    corporoateGifting: boolean;
    isPopup: boolean;
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
      featureData: [],
      count: -1,
      corporoateGifting:
        props.location.pathname.includes("corporate-gifting") ||
        props.location.search.includes("&src_type=cp"),
      showProductCounter: true,
      isPopup: false
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

  onEnquireClick = (id: number, partner?: string) => {
    const { updateComponentModal, changeModalState } = this.props;
    const mobile = this.props.device.mobile;
    updateComponentModal(
      // <CorporateEnquiryPopup id={id} quantity={quantity} />,
      POPUP.THIRDPARTYENQUIRYPOPUP,
      {
        id,
        partner: partner || ""
      },
      mobile ? true : false,
      mobile ? ModalStyles.bottomAlign : undefined
    );
    changeModalState(true);
  };

  notifyMeClick = (product: PLPProductItem) => {
    const {
      categories,
      collection,
      collections,
      priceRecords,
      discountedPriceRecords,
      childAttributes,
      title,
      discount,
      badgeType,
      plpSliderImages,
      badge_text
    } = product;
    const selectedIndex = childAttributes?.length == 1 ? 0 : undefined;
    const {
      updateComponentModal,
      changeModalState,
      currency,
      isSale
    } = this.props;
    // childAttributes?.map((v, i) => {
    //   if (v.id === selectedSize?.id) {
    //     selectedIndex = i;
    //   }
    // });
    const index = categories.length - 1;
    let category = categories[index]
      ? categories[index].replace(/\s/g, "")
      : "";
    category = category.replace(/>/g, "/");
    updateComponentModal(
      POPUP.NOTIFYMEPOPUP,
      {
        // collection: collections && collections.length > 0 ? collections[0] : "",
        collection: collection,
        category: category,
        price: priceRecords[currency],
        currency: currency,
        childAttributes: childAttributes as ChildProductAttributes[],
        title: title,
        selectedIndex: selectedIndex,
        discount: discount,
        badgeType: badgeType,
        isSale: isSale,
        discountedPrice: discountedPriceRecords[currency],
        list: "plp",
        sliderImages: plpSliderImages,
        badge_text: badge_text
      },
      false,
      this.props.device.mobile ? ModalStyles.bottomAlignSlideUp : "",
      this.props.device.mobile ? "slide-up-bottom-align" : ""
    );
    changeModalState(true);
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
          ["Pero", "Souk", "Eka", "Object D Art"].indexOf(
            selectItem[0]?.partner
          ) > -1
            ? true
            : false
      },
      true
    );
    changeModalState(true);
  };

  componentDidMount() {
    const queryString = this.props.location.search;
    const urlParams = new URLSearchParams(queryString);
    const searchValue: any = urlParams.get("q") || "";
    CookieService.setCookie("search", searchValue, 365);

    const that = this;
    util.moveChatDown();
    this.setState({
      searchMaker: true
    });
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push(function(this: any) {
        this.reset();
      });
      util.pageViewGTM("Search");
      dataLayer.push({
        event: "SearchView",
        PageURL: this.props.location.pathname,
        Page_Title: "virtual_search_view"
      });
    }
    if (userConsent.includes(GA_CALLS)) {
      Moengage.track_event("Page viewed", {
        "Page URL": this.props.location.pathname,
        "Page Name": "SearchView"
      });
    }
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
    window.addEventListener(
      "scroll",
      throttle(() => {
        this.setProductCount();
      }, 50)
    );
    let previousUrl = "";
    const observer = new MutationObserver(function(mutations) {
      if (location.href !== previousUrl) {
        previousUrl = location.href;
        that.setState({ count: -1 });
      }
    });
    const config = { subtree: true, childList: true };
    observer.observe(document, config);
    if (this.props.device.mobile) {
      const view: string = CookieService.getCookie("plpMobileView") || "grid";
      this.updateMobileView(view);
    }
    // fixes for filter hide issue on safari
    setTimeout(() => {
      window.scrollTo(50, 0);
    }, 500);
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 1000);
    // end fixes for filter hide issue on safari
  }

  componentDidUpdate() {
    const queryString = this.props.location.search;
    const urlParams = new URLSearchParams(queryString);
    const searchValue: any = urlParams.get("q") || "";
    CookieService.setCookie("search", searchValue, 365);
  }

  componentWillUnmount() {
    util.moveChatUp();
    window.removeEventListener(
      "scroll",
      throttle(() => {
        this.setProductCount();
      }, 100)
    );
  }

  setProductCount = () => {
    const cards = document.querySelectorAll(".search-container");
    const cardIDs: any = [];

    cards.forEach(card => {
      cardIDs.push(
        Array.from(card.children[0].children).filter(e => e.id != "")[0]?.id
      );
    });
    const observer = new IntersectionObserver(
      entries => {
        let maxIndex = -Infinity;
        let element: any;
        let productID: any, idx: any;
        entries.forEach((entry, index) => {
          if (
            entry.isIntersecting &&
            entry.target.getBoundingClientRect().bottom <
              window.innerHeight - 50
          ) {
            productID = Array.from(entry.target.children[0].children).filter(
              e => e.id != ""
            )[0]?.id;
            idx = cardIDs.findIndex((e: string) => e == productID);
            if (idx > maxIndex) {
              maxIndex = idx;
              element = entry.target;
            }
          }
        });
        if (element) {
          if (idx > -1 && !this.state.flag) {
            this.setState({ count: idx + 1 });
          }
          if (window.scrollY < 120) {
            this.setState({ count: -1 });
          }
        } else if (
          cards[cards.length - 1].getBoundingClientRect().bottom < 130 ||
          window.scrollY < 120
        ) {
          this.setState({ count: -1 });
        }
        observer.disconnect();
      },
      {
        rootMargin: "-130px 0px -90px 0px"
      }
    );
    cards.forEach(card => {
      observer.observe(card);
    });
  };

  updateMobileView = (plpMobileView: "list" | "grid") => {
    if (this.props.plpMobileView != plpMobileView) {
      CookieService.setCookie("plpMobileView", plpMobileView);
      viewSelectionGTM(plpMobileView);
      if (this.props.device.mobile) {
        const cards = document.querySelectorAll(".search-container");
        const cardIDs: any = [];

        cards.forEach(card => {
          cardIDs.push(card.children[0].children[0]?.id);
        });

        const observer = new IntersectionObserver(
          entries => {
            let topMostPos = Infinity;
            let leftMostPos = Infinity;
            let leftMostElement: any;
            entries.forEach((entry, index) => {
              if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
                const y: number = entry.target.getBoundingClientRect().y;
                const x: number = entry.target.getBoundingClientRect().x;
                if (y < topMostPos) {
                  topMostPos = y;
                }
                if (x < leftMostPos) {
                  leftMostPos = x;
                  leftMostElement = entry.target;
                }
              }
            });
            if (leftMostPos != Infinity) {
              const productID = leftMostElement.children[0].children[0]?.id;
              // console.log(this.props.scrollDown);
              this.child.appendData(plpMobileView);
              this.props.updateMobileView(plpMobileView);
              const top: number =
                leftMostElement.getBoundingClientRect().top - 135;
              // window.scrollBy({ top: top, behavior: "smooth" });
              if (productID == cardIDs[0]) this.setState({ count: -1 });
            } else {
              this.child.appendData(plpMobileView);
              this.props.updateMobileView(plpMobileView);
            }
            observer.disconnect();
          },
          {
            rootMargin: "-130px 0px -90px 0px"
          }
        );
        cards.forEach(card => {
          observer.observe(card);
        });
      }
    }
  };

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

  onResetFilterClick = (value: boolean) => {
    this.setState({
      isPopup: value
    });
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
            position: i,
            dimension12: skuItem?.color
          };
        });
        const listPath = `SearchResults`;
        CookieService.setCookie("listPath", listPath);
        // let cur = this.state.salestatus ? item.product.discounted_pricerecord[window.currency] : item.product.pricerecords[window.currency]
        const userConsent = CookieService.getCookie("consent").split(",");
        if (userConsent.includes(GA_CALLS)) {
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
        }
        if (userConsent.includes(GA_CALLS)) {
          Moengage.track_event("search", {
            keyword: product.name,
            "Search Suggestions Clicked": true,
            Currency: this.props.currency
          });
        }
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

  onClickSearch = () => {
    if (this.state.searchText.trim().length > 2) {
      this.child.changeSearchValue(this.state.searchText);
    }
  };

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    const queryString = nextProps.location.search;
    const urlParams = new URLSearchParams(queryString);
    const searchValue: any = urlParams.get("q") || "";

    if (searchValue !== this.state.searchText) {
      this.setState(
        {
          searchText: searchValue ? searchValue : ""
        },
        () => {
          this.onClickSearch();
        }
      );
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

  decodeSearchString(value: string) {
    try {
      return decodeURIComponent(value);
    } catch (e) {
      return value;
    }
  }

  render() {
    const {
      device: { mobile, tablet },
      currency,
      data: {
        results: { banner, data, facets },
        count
      }
    } = this.props;
    // const { searchMaker } = this.state;
    const queryString = this.props.location.search;
    const urlParams = new URLSearchParams(queryString);
    const searchValue: any = urlParams.get("q") || "";
    const items: CategoryMenu[] = [
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
                {/* <input
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
                ></i> */}
              </div>
              <div className={cs(bootstrap.colMd3, styles.innerHeader)}>
                <p className={styles.filterText}>Sort By:</p>
                {/* <SelectableDropdownMenu
                  id="sort-dropdown-search"
                  align="right"
                  className={styles.dropdownRoot}
                  items={items}
                  value={this.state.sortValue}
                  onChange={this.onchangeFilter}
                  showCaret={true}
                  disabled={data.length == 0 ? true : false}
                ></SelectableDropdownMenu> */}
                <SecondaryHeaderDropdown
                  id="sort-dropdown-search"
                  items={items}
                  onChange={this.onchangeFilter}
                  value={this.state.sortValue}
                  className={styles.searchHeaderDropdown}
                  disabled={!this.props.data?.results?.data?.length}
                />
              </div>
            </Fragment>
          </SecondaryHeader>
        )}
        <div
          className={cs(
            bootstrap.row,
            globalStyles.minimumWidth,
            styles.serachWrapperData
          )}
        >
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
                : cs(bootstrap.colMd3, styles.filterSticky)
            }
          >
            <FilterListSearch
              key={"search"}
              onRef={(el: any) => (this.child = el)}
              setFilterCount={this.setFilterCount}
              changeLoader={this.changeLoader}
              onChangeFilterState={this.onChangeFilterState}
              filterCount={this.state.filterCount}
              openResetPopup={this.onResetFilterClick}
            />
          </div>
          {/* Open GridList option code */}
          {count > 1
            ? mobile &&
              !tablet && (
                <div
                  id="gridList"
                  className={cs(styles.listGridBar, {
                    [styles.listGridBarTimer]: this.props.showTimer
                    // [styles.hide]: this.props.scrollDown
                  })}
                >
                  <div
                    className={styles.gridContainer}
                    onClick={() => this.updateMobileView("grid")}
                  >
                    <span
                      className={cs(styles.gridSpan, {
                        [styles.active]: this.props.plpMobileView == "grid"
                      })}
                    >
                      Grid
                    </span>
                    <img
                      src={
                        this.props.plpMobileView == "grid"
                          ? activeGrid
                          : inactiveGrid
                      }
                      className={cs(styles.gridIcon)}
                    />
                  </div>
                  <div
                    className={styles.listContainer}
                    onClick={() => this.updateMobileView("list")}
                  >
                    <img
                      src={
                        this.props.plpMobileView == "list"
                          ? activeList
                          : inactiveList
                      }
                      className={cs(styles.listIcon)}
                    />
                    <span
                      className={cs(styles.listSpan, {
                        [styles.active]: this.props.plpMobileView == "list"
                      })}
                    >
                      List
                    </span>
                  </div>
                </div>
              )
            : ""}
          {/* Close GridList option Code */}
          <div
            className={cs(
              { [globalStyles.hidden]: this.state.showmobileSort },
              { [globalStyles.paddTop80]: !this.state.showmobileSort },
              { [styles.spCat]: !this.state.showmobileSort },
              bootstrap.colMd9,
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
            {data.length ? (
              <div
                className={cs(
                  styles.productNumber,
                  globalStyles.marginT20,
                  styles.imageContainer,
                  {
                    [styles.border]: mobile,
                    [globalStyles.marginL0]: count == 1 && mobile && !tablet,
                    [globalStyles.marginT0]: count == 1 && mobile && !tablet
                  }
                )}
              >
                <span className={styles.searchRes}>
                  Showing&nbsp;
                  {count > 1 ? count + " results" : count + " result"}
                  &nbsp;for
                  <span>&nbsp;&ldquo;{this.state.searchText}&rdquo;</span>
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
                return (
                  <div
                    className={
                      !mobile || this.props.plpMobileView == "grid"
                        ? cs(
                            bootstrap.colLg4,
                            bootstrap.col6,
                            styles.setWidth,
                            "search-container"
                          )
                        : cs(
                            bootstrap.colLg4,
                            bootstrap.col12,
                            styles.setWidth,
                            styles.listViewContainer,
                            "search-container"
                          )
                    }
                    key={item.id}
                    id={i == 0 ? "first-item" : ""}
                    // onClick={() => this.updateMobileView()
                    // onClick={e => {
                    //   this.gtmPushSearchClick(e, item, i);
                    // }}
                  >
                    {item.productClass != "GiftCard" ? (
                      !mobile || this.props.plpMobileView == "grid" ? (
                        <PlpResultItem
                          page={searchValue}
                          position={i}
                          product={item}
                          addedToWishlist={false}
                          currency={currency}
                          key={item.id}
                          mobile={mobile}
                          tablet={tablet}
                          onClickQuickView={this.onClickQuickView}
                          loader={this.state.flag}
                          isCorporate={
                            ["Pero", "Souk", "Eka", "Object D Art"].indexOf(
                              item.partner || ""
                            ) > -1
                              ? true
                              : false
                          }
                          isSearch={true}
                          notifyMeClick={this.notifyMeClick}
                          onEnquireClick={this.onEnquireClick}
                        />
                      ) : (
                        <PlpResultListViewItem
                          page={searchValue}
                          position={i}
                          product={item}
                          addedToWishlist={false}
                          currency={currency}
                          key={item.id}
                          mobile={mobile}
                          isVisible={i < 3 ? true : undefined}
                          onClickQuickView={this.onClickQuickView}
                          isCorporate={this.state.corporoateGifting}
                          notifyMeClick={this.notifyMeClick}
                          onEnquireClick={this.onEnquireClick}
                          loader={this.state.flag}
                        />
                      )
                    ) : (
                      <GiftcardItem isCorporateGifting={false} />
                    )}
                  </div>
                );
              })}
            </div>
            <div
              className={
                (data && this.state.searchText
                ? data.length == 0 &&
                  this.state.searchText.length &&
                  this.state.filterCount < 1
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
                    this.state.searchText.length
                  ) : (
                    false
                  )) ? (
                    <div className={styles.npfMsg}>
                      {"Sorry, we couldn't find any matching result for"} &nbsp;
                      <span>
                        {this.decodeSearchString(this.state.searchText)}
                      </span>
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
            {data.length == 0 &&
            this.state.searchText.length > 2 &&
            this.state.filterCount > 0 ? (
              <div className={cs(styles.npfContainer)}>
                <div className={cs(styles.npf)}>No products found</div>
                <div className={cs(bootstrap.row, styles.tilesContainer)}>
                  <div className={cs(bootstrap.colMd4, bootstrap.col6)}>
                    <GiftcardItem isCorporateGifting={false} />
                  </div>
                  <div className={cs(bootstrap.colMd4, bootstrap.col6)}>
                    <ResetFiltersTile
                      resetFilters={this.child.clearFilter}
                      mobileApply={this.child.updateDataFromAPI}
                      mobile={mobile}
                      tablet={false}
                      view={"grid"}
                    />
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
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
        {this.state.count > -1 && this.state.showProductCounter && (
          <ProductCounter
            current={this.state.count}
            total={count}
            id="plp-product-counter"
          />
        )}
        {mobile && this.state.isPopup && (
          <div
            id="resetFilterModal"
            className={styles.modalFullscreenContainer}
          >
            <div className={styles.modalFullscreen}>
              <ResetFilterModal
                applyClick={this.child.mobileApply}
                discardClick={this.child.discardFilter}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

const SearchRoute = withRouter(Search);
export default connect(mapStateToProps, mapDispatchToProps)(SearchRoute);
export { initActionSearch };
