import React, { Fragment } from "react";
import SecondaryHeader from "components/SecondaryHeader";
import SecondaryHeaderDropdown from "components/dropdown/secondaryHeaderDropdown";
import initActionCollection from "./initAction";
import cs from "classnames";
import { AppState } from "reducers/typings";
import { connect, DispatchProp } from "react-redux";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
import styles from "./styles.scss";
import globalStyles from "styles/global.scss";
import FilterList from "./filterList";
import CorporateFilter from "./corporateList";
import PlpDropdownMenu from "components/PlpDropDown";
import PlpResultItem from "components/plpResultItem";
import GiftcardItem from "components/plpResultItem/giftCard";
import PlpBreadcrumbs from "components/PlpBreadcrumbs";
import mapDispatchToProps from "../../components/Modal/mapper/actions";
import MakerEnhance from "maker-enhance";
// import iconFonts from "../../styles/iconFonts.scss";
import PlpResultListViewItem from "components/plpResultListViewItem";
import PlpResultTabItem from "components/plpResultTabItem";
import ModalStyles from "components/Modal/styles.scss";
import { ChildProductAttributes, PLPProductItem } from "typings/product";
import { POPUP } from "constants/components";
import * as util from "utils/validate";
import { Link } from "react-router-dom";
import CookieService from "services/cookie";
import Banner from "./components/Banner";
import Product from "./components/Product";
import ProductBanner from "./components/ProductBanner";
import ProductCounter from "components/ProductCounter";
import throttle from "lodash/throttle";
import activeGrid from "../../images/plpIcons/active_grid.svg";
import inactiveGrid from "../../images/plpIcons/inactive_grid.svg";
import activeList from "../../images/plpIcons/active_list.svg";
import inactiveList from "../../images/plpIcons/inactive_list.svg";
import { CategoryMenu } from "containers/categoryLanding/typings";
import { GA_CALLS, ANY_ADS } from "constants/cookieConsent";

const mapStateToProps = (state: AppState) => {
  return {
    plpProductId: state.plplist.plpProductId,
    facetObject: state.plplist.facetObject,
    data: state.plplist.data,
    plpMobileView: state.plplist.plpMobileView,
    scrollDown: state.info.scrollDown,
    location: state.router.location,
    currency: state.currency,
    device: state.device,
    isSale: state.info.isSale,
    showTimer: state.info.showTimer,
    isLoggedIn: state.user.isLoggedIn,
    plpTemplates: state.plplist.plpTemplates
  };
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  DispatchProp;

class PLP extends React.Component<
  Props,
  {
    filterData: string;
    showmobileSort: boolean;
    filterCount: number;
    mobileFilter: boolean;
    sortValue: string;
    flag: boolean;
    plpMaker: boolean;
    toggel: boolean;
    corporoateGifting: boolean;
    isThirdParty: boolean;
    count: number;
    showProductCounter: boolean;
  }
> {
  constructor(props: Props) {
    super(props);
    // get the required parameter
    const queryString = props.location.search;
    const urlParams = new URLSearchParams(queryString);
    const param = urlParams.get("sort_by");
    this.state = {
      filterData: "All",
      filterCount: 0,
      showmobileSort: false,
      mobileFilter: false,
      sortValue: param ? param : "hc",
      flag: false,
      plpMaker: false,
      toggel: false,
      count: -1,
      corporoateGifting:
        props.location.pathname.includes("corporate-gifting") ||
        props.location.search.includes("&src_type=cp"),
      isThirdParty: props.location.search.includes("&src_type=cp"),
      showProductCounter: true
    };
  }
  private child: any = FilterList;

  onchangeFilter = (data: any, label?: string): void => {
    this.child.changeValue(null, data);
    const {
      device: { mobile }
    } = this.props;
    if (mobile) {
      this.child.clickCloseFilter();
    }
    this.setState({ sortValue: data });
    util.sortGTM(label || data);
  };

  componentDidMount() {
    const that = this;
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS) || true) {
      dataLayer.push(function(this: any) {
        this.reset();
      });

      util.pageViewGTM("PLP");
      dataLayer.push({
        event: "PlpView",
        PageURL: this.props.location.pathname,
        Page_Title: "virtual_plp_view"
      });
    }
    if (userConsent.includes(ANY_ADS) || true) {
      Moengage.track_event("Page viewed", {
        "Page URL": this.props.location.pathname,
        "Page Name": "PlpView"
      });
    }
    window.addEventListener(
      "scroll",
      throttle(() => {
        this.setProductCount();
      }, 50)
    );
    if (this.props.device.mobile) {
      const elem = document.getElementById("pincode-bar");
      elem && elem.classList.add(globalStyles.hiddenEye);
      const chatButtonElem = document.getElementById("chat-button");
      const scrollToTopButtonElem = document.getElementById("scrollToTop-btn");
      if (scrollToTopButtonElem) {
        scrollToTopButtonElem.style.bottom = "65px";
      }
      if (chatButtonElem) {
        chatButtonElem.style.bottom = "10px";
      }
    }
    this.setState({
      plpMaker: true
    });
    util.moveChatDown();
    // const cards = document.querySelectorAll(".product-container");
    // if (cards.length > 0) {
    //   if (cards[0].getBoundingClientRect().y > 330) {
    //     this.setState({ count: -1 });
    //   }
    // }
    let previousUrl = "";
    const observer = new MutationObserver(function(mutations) {
      if (location.href !== previousUrl) {
        previousUrl = location.href;
        that.setState({ count: -1 });
      }
    });
    const config = { subtree: true, childList: true };
    observer.observe(document, config);
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

  componentDidUpdate(nextProps: Props) {
    if (!this.state.plpMaker) {
      this.setState({
        plpMaker: true
      });
    }
  }

  onStateChange = () => {
    this.setState({
      plpMaker: false
    });
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
      collections,
      priceRecords,
      discountedPriceRecords,
      childAttributes,
      title,
      discount,
      badgeType,
      plpSliderImages
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
        collection: collections && collections.length > 0 ? collections[0] : "",
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
        sliderImages: plpSliderImages
      },
      false,
      this.props.device.mobile ? ModalStyles.bottomAlignSlideUp : "",
      this.props.device.mobile ? "slide-up-bottom-align" : ""
    );
    changeModalState(true);
  };
  onClickQuickView = (id: number) => {
    const { updateComponentModal, changeModalState, plpProductId } = this.props;
    updateComponentModal(
      POPUP.QUICKVIEW,
      {
        id: id,
        productListId: plpProductId,
        corporatePDP: this.state.corporoateGifting,
        source: "PLP"
      },
      true
    );
    changeModalState(true);
  };

  changeLoader = (value: boolean) => {
    this.setState({
      flag: value
    });
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

  getVisibleProductID = () => {
    const count = this.props.data.results.data.length;
    let id = -1;
    let currentIndex = -1;
    const bannerElem = document.getElementById("product_images");
    if (count) {
      const isGrid = this.props.plpMobileView == "grid";
      const elem = document.getElementById(
        isGrid ? "first-grid-item" : "first-list-item"
      );
      let height = elem?.clientHeight;
      let offsetY = window.scrollY;
      if (bannerElem) {
        offsetY -= bannerElem.clientHeight;
      }
      if (height && offsetY > 0) {
        if (elem) {
          height = isGrid ? elem?.clientHeight : elem?.clientHeight + 30;
        }
        currentIndex = Math.floor((offsetY + window.innerHeight / 2) / height);
        currentIndex = isGrid ? currentIndex * 2 : currentIndex;
        if (currentIndex >= count) {
          currentIndex = count - 1;
        }
        id = this.props.data.results.data[currentIndex]?.id;
      }
    }
    return { id, currentIndex };
  };

  setProductCount = () => {
    const cards = document.querySelectorAll(".product-container");
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
      util.viewSelectionGTM(plpMobileView);
      const cards = document.querySelectorAll(".product-container");
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
            this.props.updateMobileView(plpMobileView);
            const top: number =
              leftMostElement.getBoundingClientRect().top - 135;
            window.scrollBy({ top: top, behavior: "smooth" });
            if (productID == cardIDs[0]) this.setState({ count: -1 });
          } else {
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
  };

  plpViewGTM(newdata: any) {
    const product = newdata.data.results?.data[0];
    const len = product?.categories?.length;
    const category = product?.categories[len - 1];
    // const l3Len = category.split(">").length;
    const l1 = category?.split(">")[0];

    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS) || true) {
      dataLayer.push({
        "Event Category": "GA Ecommerce",
        "Event Action": "PLP ",
        "Event Label": l1,
        "Product Category": category?.replace(/>/g, "-"),
        "Login Status": this.props.isLoggedIn ? "logged in" : "logged out",
        "Time Stamp": new Date().toISOString(),
        "Page Url": location.href,
        "Page Type": util.getPageType(),
        "Page referrer url": CookieService.getCookie("prevUrl")
      });
    }
  }
  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    const queryString = nextProps.location.search;
    const urlParams = new URLSearchParams(queryString);
    const param = urlParams.get("sort_by");
    if (
      this.props.data.results.data.length == 0 &&
      nextProps.data.results.data.length > 0
    ) {
      this.plpViewGTM(nextProps);
    }
    if (this.props.location.pathname != nextProps.location.pathname) {
      util.pageViewGTM("PLP");
      this.plpViewGTM(nextProps);
      this.setState({
        plpMaker: false,
        sortValue: param ? param : "hc",
        corporoateGifting:
          nextProps.location.pathname.includes("corporate-gifting") ||
          nextProps.location.search.includes("&src_type=cp"),
        isThirdParty: nextProps.location.search.includes("&src_type=cp")
      });
    }
    if (
      this.props.currency != nextProps.currency ||
      this.props.isLoggedIn != nextProps.isLoggedIn
    ) {
      this.setState({
        plpMaker: false
      });
    }

    if (!param && this.state.sortValue != "hc") {
      this.setState({
        sortValue: "hc"
      });
    }
  }

  toggleSort = (state: boolean) => {
    this.setState({ showProductCounter: state });
  };

  render() {
    const {
      device: { mobile, tablet },
      currency,
      data: {
        results: { breadcrumb, banner, bannerMobile, facets, bannerUrl },
        count
      }
    } = this.props;
    let {
      data: {
        results: { data }
      }
    } = this.props;

    data = data.filter((item: any) => {
      return +item.priceRecords[currency] != 0;
    });

    const { plpMaker, corporoateGifting } = this.state;
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
    const showTemplates: any = {
      Banner: null,
      Product: null,
      ProductBanner: null
    };

    let productTemplatePos = -1;
    let productBannerTemplatePos = -1;
    if (this.props.plpTemplates.templates.length > 0) {
      this.props.plpTemplates.templates.map(template => {
        showTemplates[template.template] = template;
      });
      if (showTemplates["Product"]) {
        productTemplatePos = parseInt(showTemplates["Product"].placement);
      }
      if (showTemplates["ProductBanner"]) {
        productBannerTemplatePos = parseInt(
          showTemplates["ProductBanner"].placement.split("-")[0]
        );
        if (
          productTemplatePos > -1 &&
          productBannerTemplatePos > productTemplatePos
        ) {
          productBannerTemplatePos--;
        }
      }
    }
    return (
      <div
        className={cs(
          styles.pageBody,
          {
            [styles.pageBodyTimer]: this.props.showTimer,
            [styles.pageBodyTab]: tablet,
            [styles.pageBodyTabTimer]: this.props.showTimer && tablet
          },
          bootstrap.containerFluid
        )}
      >
        {!mobile && (
          <SecondaryHeader>
            <Fragment>
              <div className={cs(bootstrap.colMd7, bootstrap.offsetMd1)}>
                <PlpBreadcrumbs
                  levels={breadcrumb}
                  className={cs(bootstrap.colMd12)}
                  isViewAll={this.child.state?.isViewAll}
                />
              </div>
              <div className={cs(bootstrap.colMd3, styles.innerHeader)}>
                <p className={styles.filterText}>Sort By: </p>
                {/* <SelectableDropdownMenu
                  id="sort-dropdown-plp"
                  align="right"
                  className={styles.dropdownRoot}
                  items={items}
                  onChange={this.onchangeFilter}
                  showCaret={true}
                  value={this.state.sortValue}
                  key={"plpPage"}
                ></SelectableDropdownMenu> */}
                <SecondaryHeaderDropdown
                  id="collection-landing-filter"
                  items={items}
                  value={this.state.sortValue}
                  onChange={this.onchangeFilter}
                />
              </div>
            </Fragment>
          </SecondaryHeader>
        )}
        {/* {corporoateGifting &&
          (mobile ? (
            <div
              className={cs(
                bootstrap.row,
                styles.subcHeader4,
                globalStyles.textCenter
              )}
            >
              <div className={cs(bootstrap.col12, globalStyles.textCenter)}>
                <h1>Good Earth X Souk</h1>
                <h1 className={styles.corporateHeading}>
                  An Online Exhibit & Pop-Up
                </h1>
                <p
                  className={cs(styles.corporateSubHeading, {
                    [styles.corporateSubHeadingMobile]: mobile
                  })}
                >
                  AVAILABLE IN INDIA ONLY
                </p>
              </div>
              {!this.state.isThirdParty && (
                <div
                  className={cs(
                    globalStyles.voffset3,
                    globalStyles.textCenter,
                    styles.downloadWidth
                  )}
                >
                  <a
                    href="https://indd.adobe.com/view/e046249f-f38d-419b-9dc3-af8bea0326ab"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={globalStyles.cerise}
                  >
                    DOWNLOAD CATALOGUE
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className={cs(bootstrap.row, styles.subcHeader)}>
              <div className={cs(bootstrap.col12, globalStyles.textCenter)}>
                <h1>Good Earth X Souk</h1>
                <h1 className={styles.corporateHeading}>
                  An Online Exhibit & Pop-Up
                </h1>
                <p className={styles.corporateSubHeading}>
                  AVAILABLE IN INDIA ONLY
                </p>
              </div>
            </div>
          ))} */}
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
                : cs(bootstrap.colMd3, styles.filterSticky)
            }
          >
            {corporoateGifting ? (
              <CorporateFilter
                onRef={(el: any) => (this.child = el)}
                onChangeFilterState={this.onChangeFilterState}
                setFilterCount={this.setFilterCount}
                key="corporate-plp-filter"
                changeLoader={this.changeLoader}
                onStateChange={this.onStateChange}
              />
            ) : (
              <FilterList
                onRef={(el: any) => (this.child = el)}
                onChangeFilterState={this.onChangeFilterState}
                setFilterCount={this.setFilterCount}
                key="plp-filter"
                changeLoader={this.changeLoader}
                onStateChange={this.onStateChange}
                filterCount={this.state.filterCount}
              />
            )}
          </div>

          <div
            className={cs(
              { [globalStyles.hidden]: this.state.showmobileSort },
              { [styles.spCat]: !this.state.showmobileSort },
              bootstrap.colLg9,
              bootstrap.col12
            )}
          >
            {/* <div className={cs(bootstrap.row, globalStyles.voffset5)}>
                  <div className={cs(bootstrap.colMd10, bootstrap.offsetMd1, bootstrap.col12, globalStyles.textCenter)}>
                      <div className={styles.npfMsg}>No products were found matching
                      </div>
                  </div>
              </div> */}
            {banner || bannerMobile ? (
              <div className={cs(bootstrap.row)}>
                <div className={cs(globalStyles.textCenter, bootstrap.col12)}>
                  {bannerUrl ? (
                    <Link to={bannerUrl}>
                      <img
                        src={mobile ? bannerMobile : banner}
                        className={globalStyles.imgResponsive}
                      />
                    </Link>
                  ) : (
                    <img
                      src={mobile ? bannerMobile : banner}
                      className={globalStyles.imgResponsive}
                    />
                  )}
                </div>
              </div>
            ) : (
              ""
            )}

            {plpMaker && (!banner || !bannerMobile) && (
              <MakerEnhance
                user="goodearth"
                href={`${window.location.origin}${this.props.location.pathname}?${this.props.location.search}`}
              />
            )}

            {/* <div className={cs(bootstrap.row)}>
              <div className={cs(globalStyles.textCenter, bootstrap.col12)}>
                <iframe
                  width="100%"
                  allow="fullscreen"
                  src="https://viewer.helloar.io/?id=611369966722ec004d7f4375"
                ></iframe>
              </div>
            </div> */}
            <div
              className={
                mobile
                  ? banner
                    ? cs(
                        bootstrap.row,
                        styles.imageContainerMobileBanner,
                        globalStyles.paddTop20
                      )
                    : cs(
                        bootstrap.row,
                        styles.imageContainerMobile,
                        globalStyles.paddTop20
                      )
                  : cs(
                      bootstrap.row,
                      styles.imageContainer,
                      styles.minHeight,
                      globalStyles.paddTop20
                    )
              }
              id="product_images"
            >
              {showTemplates.Banner && (
                <Banner data={showTemplates.Banner} mobile={mobile} />
              )}
            </div>

            {!mobile ? (
              <div
                className={cs(styles.productNumber, styles.imageContainer, {
                  [styles.border]: mobile
                })}
              >
                <span>
                  {count > 1
                    ? (!this.state.corporoateGifting ? count + 1 : count) +
                      " products found"
                    : (!this.state.corporoateGifting ? count + 1 : count) +
                      " product found"}{" "}
                </span>
              </div>
            ) : (
              <div
                className={cs(styles.productNumber, styles.imageContainer, {})}
              >
                <span>
                  {count > 1
                    ? (!this.state.corporoateGifting ? count + 1 : count) +
                      " products found"
                    : (!this.state.corporoateGifting ? count + 1 : count) +
                      " product found"}{" "}
                </span>
              </div>
            )}
            <div
              className={
                mobile
                  ? banner
                    ? cs(
                        bootstrap.row,
                        styles.imageContainerMobileBanner,
                        globalStyles.paddTop10,
                        "products_container"
                      )
                    : cs(
                        bootstrap.row,
                        styles.imageContainerMobile,
                        globalStyles.paddTop10,
                        "products_container"
                      )
                  : cs(
                      bootstrap.row,
                      styles.imageContainer,
                      styles.minHeight,
                      globalStyles.paddTop20,
                      "products_container"
                    )
              }
              id="product_images"
            >
              {!mobile || this.props.plpMobileView == "grid"
                ? data.map((item, index) => {
                    return (
                      <>
                        {showTemplates["Product"] &&
                        data.length >= productTemplatePos &&
                        index == productTemplatePos - 1 ? (
                          <Product
                            key={`product-${index}`}
                            data={showTemplates.Product}
                            view={this.props.plpMobileView}
                            mobile={mobile}
                          />
                        ) : (
                          ""
                        )}
                        {showTemplates["ProductBanner"] &&
                        data.length >= productBannerTemplatePos &&
                        index == productBannerTemplatePos - 1 ? (
                          <ProductBanner
                            data={showTemplates.ProductBanner}
                            mobile={mobile}
                          />
                        ) : (
                          ""
                        )}
                        <div
                          className={cs(
                            bootstrap.colLg4,
                            bootstrap.col6,
                            styles.setWidth,
                            "product-container"
                          )}
                          key={item.id}
                          id={index == 0 ? "first-grid-item" : ""}
                        >
                          {tablet ? (
                            <PlpResultTabItem
                              page="PLP"
                              position={index}
                              product={item}
                              addedToWishlist={false}
                              currency={currency}
                              key={item.id}
                              mobile={mobile}
                              isVisible={index < 3 ? true : undefined}
                              onClickQuickView={this.onClickQuickView}
                              isCorporate={this.state.corporoateGifting}
                              notifyMeClick={this.notifyMeClick}
                              onEnquireClick={this.onEnquireClick}
                              loader={this.state.flag}
                            />
                          ) : (
                            <PlpResultItem
                              page="PLP"
                              position={index}
                              product={item}
                              addedToWishlist={false}
                              currency={currency}
                              key={item.id}
                              mobile={mobile}
                              isVisible={index < 3 ? true : undefined}
                              onClickQuickView={this.onClickQuickView}
                              isCorporate={this.state.corporoateGifting}
                              loader={this.state.flag}
                            />
                          )}
                        </div>
                      </>
                    );
                  })
                : data.map((item, index) => {
                    return (
                      <>
                        {showTemplates["Product"] &&
                        data.length >= productTemplatePos &&
                        index == productTemplatePos - 1 ? (
                          <Product
                            key={`product-${index}`}
                            data={showTemplates.Product}
                            view={this.props.plpMobileView}
                            mobile={mobile}
                          />
                        ) : (
                          ""
                        )}
                        {showTemplates["ProductBanner"] &&
                        data.length >= productBannerTemplatePos &&
                        index == productBannerTemplatePos - 1 ? (
                          <ProductBanner
                            data={showTemplates.ProductBanner}
                            mobile={mobile}
                          />
                        ) : (
                          ""
                        )}
                        <div
                          className={cs(
                            bootstrap.colLg4,
                            bootstrap.col12,
                            styles.setWidth,
                            styles.listViewContainer,
                            "product-container"
                          )}
                          key={item.id}
                          id={index == 0 ? "first-list-item" : ""}
                        >
                          <PlpResultListViewItem
                            page="PLP"
                            position={index}
                            product={item}
                            addedToWishlist={false}
                            currency={currency}
                            key={item.id}
                            mobile={mobile}
                            isVisible={index < 3 ? true : undefined}
                            onClickQuickView={this.onClickQuickView}
                            isCorporate={this.state.corporoateGifting}
                            notifyMeClick={this.notifyMeClick}
                            onEnquireClick={this.onEnquireClick}
                            loader={this.state.flag}
                          />
                        </div>
                      </>
                    );
                  })}
              <div
                className={
                  !mobile || this.props.plpMobileView == "grid"
                    ? cs(bootstrap.colLg4, bootstrap.col6, styles.setWidth, {
                        ["product-container"]: !this.state.corporoateGifting
                      })
                    : cs(
                        bootstrap.colLg4,
                        bootstrap.col12,
                        styles.setWidth,
                        styles.listViewContainer,
                        { ["product-container"]: !this.state.corporoateGifting }
                      )
                }
                key={1}
              >
                {this.state.corporoateGifting ? (
                  ""
                ) : (
                  <GiftcardItem
                    isCorporateGifting={!this.state.corporoateGifting}
                  />
                )}
              </div>
            </div>
          </div>
          {mobile && !tablet && (
            <div
              className={cs(styles.listGridBar, {
                [styles.listGridBarTimer]: this.props.showTimer,
                [styles.hide]: this.props.scrollDown
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
          )}
        </div>
        {mobile && (
          <PlpDropdownMenu
            filterCount={this.state.filterCount}
            list={items}
            onChange={this.onchangeFilter}
            onStateChange={this.onChangeFilterState}
            showCaret={this.state.showmobileSort}
            open={false}
            value={this.state.sortValue}
            key={"plpPageMobile"}
            sortedDiscount={facets.sortedDiscount}
            toggleSort={this.toggleSort}
          />
        )}
        {mobile && this.state.count > -1 && this.state.showProductCounter && (
          <ProductCounter
            current={this.state.count}
            total={!this.state.corporoateGifting ? count + 1 : count}
            id="plp-product-counter"
          />
        )}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PLP);
export { initActionCollection };
