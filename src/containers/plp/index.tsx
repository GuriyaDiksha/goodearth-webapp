import React, { Fragment } from "react";
import SecondaryHeader from "components/SecondaryHeader";
import SelectableDropdownMenu from "components/dropdown/selectableDropdownMenu";
import initActionCollection from "./initAction";
import { DropdownItem } from "components/dropdown/baseDropdownMenu/typings";
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
import iconFonts from "../../styles/iconFonts.scss";
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
      count: 0,
      corporoateGifting:
        props.location.pathname.includes("corporate-gifting") ||
        props.location.search.includes("&src_type=cp"),
      isThirdParty: props.location.search.includes("&src_type=cp")
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
    dataLayer.push(function(this: any) {
      this.reset();
    });
    util.pageViewGTM("PLP");
    dataLayer.push({
      event: "PlpView",
      PageURL: this.props.location.pathname,
      PageTitle: "virtual_plp_view"
    });
    // dataLayer.push(
    //   {
    //   'Event Category':'GA Ecommerce',
    //   'Event Action':'PLP ',
    //   'Event Label':'Pass the L3 product category',
    //   'Product Category':'Pass the product category L1 - L2 - L3',
    //   "Login Status": this.props.isLoggedIn
    //           ? "logged in"
    //           : "logged out",
    //   "Time Stamp": new Date().toISOString(),
    //   "Page Url": location.href,
    //   "Page Type": util.getPageType(),
    //   "Page referrer url": CookieService.getCookie("prevUrl")
    //   });

    Moengage.track_event("Page viewed", {
      "Page URL": this.props.location.pathname,
      "Page Name": "PlpView"
    });
    window.addEventListener(
      "scroll",
      throttle(() => {
        this.setProductCount();
      }, 50)
    );
    // if (this.props.device.mobile) {
    //   const elem = document.getElementById("pincode-bar");
    //   elem && elem.classList.add(globalStyles.hiddenEye);
    //   const chatButtonElem = document.getElementById("chat-button");
    //   const scrollToTopButtonElem = document.getElementById("scrollToTop-btn");
    //   if (scrollToTopButtonElem) {
    //     scrollToTopButtonElem.style.bottom = "65px";
    //   }
    //   if (chatButtonElem) {
    //     chatButtonElem.style.bottom = "10px";
    //   }
    // }
    this.setState({
      plpMaker: true
    });
    util.moveChatDown();
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
      badgeType
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
        list: "plp"
      },
      false,
      ModalStyles.bottomAlign
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
        id = this.props.data.results.data[currentIndex].id;
      }
    }
    return { id, currentIndex };
  };

  setProductCount = () => {
    const { currentIndex } = this.getVisibleProductID();
    const isGrid = this.props.plpMobileView == "grid";
    this.setState({
      count: isGrid ? (currentIndex > 0 ? currentIndex : 0) : currentIndex + 1
    });
  };

  updateMobileView = (plpMobileView: "list" | "grid") => {
    if (this.props.plpMobileView != plpMobileView) {
      this.props.updateMobileView(plpMobileView);
      CookieService.setCookie("plpMobileView", plpMobileView);
      util.viewSelectionGTM(plpMobileView);
      const { id } = this.getVisibleProductID();
      if (id != -1) {
        window.setTimeout(() => {
          const elem = document.getElementById(id.toString());
          if (elem) {
            const offsetPos = elem.getBoundingClientRect().top - 130;
            window.scrollBy({ top: offsetPos, behavior: "smooth" });
          }
        }, 500);
      }
    }
  };

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    const queryString = nextProps.location.search;
    const urlParams = new URLSearchParams(queryString);
    const param = urlParams.get("sort_by");
    if (this.props.location.pathname != nextProps.location.pathname) {
      util.pageViewGTM("PLP");
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

  render() {
    const {
      device: { mobile, tablet },
      currency,
      data: {
        results: { breadcrumb, banner, bannerMobile, data, facets, bannerUrl },
        count
      }
    } = this.props;
    const { plpMaker, corporoateGifting } = this.state;
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
                <p className={styles.filterText}>Sort</p>
                <SelectableDropdownMenu
                  id="sort-dropdown-plp"
                  align="right"
                  className={styles.dropdownRoot}
                  items={items}
                  onChange={this.onchangeFilter}
                  showCaret={true}
                  value={this.state.sortValue}
                  key={"plpPage"}
                ></SelectableDropdownMenu>
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
                : cs(bootstrap.colMd2, styles.filterSticky)
            }
          >
            {corporoateGifting ? (
              <CorporateFilter
                onRef={(el: any) => (this.child = el)}
                onChangeFilterState={this.onChangeFilterState}
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
              />
            )}
          </div>

          <div
            className={cs(
              { [globalStyles.hidden]: this.state.showmobileSort },
              { [styles.spCat]: !this.state.showmobileSort },
              bootstrap.colLg10,
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
                            styles.setWidth
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
                            styles.listViewContainer
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
                    ? cs(bootstrap.colLg4, bootstrap.col6, styles.setWidth)
                    : cs(
                        bootstrap.colLg4,
                        bootstrap.col12,
                        styles.setWidth,
                        styles.listViewContainer
                      )
                }
                key={1}
              >
                {this.state.corporoateGifting ? "" : <GiftcardItem />}
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
              <i
                key="grid-icon"
                className={cs(iconFonts.icon, iconFonts.iconGridView, {
                  [styles.active]: this.props.plpMobileView == "grid"
                })}
                onClick={() => this.updateMobileView("grid")}
              />
              <i
                key="list-icon"
                className={cs(iconFonts.icon, iconFonts.iconListView, {
                  [styles.active]: this.props.plpMobileView == "list"
                })}
                onClick={() => this.updateMobileView("list")}
              />
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
          />
        )}
        {/* {mobile && this.state.count > 0 && (
          <ProductCounter
            current={this.state.count}
            total={this.props.data.results.data.length + 1}
          />
        )} */}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PLP);
export { initActionCollection };
