import React from "react";
// import * as mapper from "mappers/header"
// import {connect} from 'react-redux'
// import axios from 'axios';
// import Config from 'components/config'
import * as valid from "utils/validate";
import { currencyCodes } from "constants/currency";
import { AppState } from "reducers/typings";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import HeaderService from "services/headerFooter";
import CookieService from "../../services/cookie";
import { WidgetImage } from "./typings";
import {
  PartialProductItem,
  PartialChildProductAttributes,
  ChildProductAttributes
} from "typings/product";
import bootstrapStyles from "../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "../../styles/global.scss";
import styles from "./styles.scss";
import iconStyles from "../../styles/iconFonts.scss";
import cs from "classnames";
import { withRouter, RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import { updateModal } from "actions/modal";
import Price from "components/Price";
import ReactHtmlParser from "react-html-parser";
import { GA_CALLS } from "constants/cookieConsent";

const mapStateToProps = (state: AppState) => {
  return {
    currency: state.currency,
    mobile: state.device.mobile,
    isSale: state.info.isSale,
    showTimer: state.info.showTimer
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    fetchFeaturedContent: async () => {
      const res = HeaderService.fetchSearchFeaturedContent(dispatch);
      return res;
    },
    fetchSearchProducts: async (url: string) => {
      const res = await HeaderService.fetchSearchProducts(dispatch, url);
      return res;
    },
    changeModalState: (show: boolean) => {
      dispatch(updateModal(show));
    }
  };
};

type Props = {
  toggle: () => void;
  ipad: boolean;
  closePopup: (e: any) => void;
  hideSearch: () => void;
  hideMenu: () => void;
} & ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps;

type State = {
  searchValue: string;
  productData: any[];
  url: string;
  value: string;
  count: number;
  featureData: WidgetImage[];
  showDifferentImage: boolean;
  currentImageIndex: number;
  suggestions: any[];
  collections: any[];
  categories: any[];
  usefulLink: any[];
};
class Search extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      searchValue: "",
      productData: [],
      url: "/search",
      value: "",
      count: 0,
      featureData: [],
      showDifferentImage: false,
      currentImageIndex: -1,
      suggestions: [],
      collections: [],
      categories: [],
      usefulLink: []
    };
  }

  searchBoxRef = React.createRef<HTMLInputElement>();
  impactRef = React.createRef<HTMLInputElement>();

  addDefaultSrc = (e: any) => {
    // e.target.src = "/static/img/noimageplp.png";
  };

  handleClickOutside = (evt: any) => {
    if (
      this.impactRef.current &&
      !this.impactRef.current.contains(evt.target)
    ) {
      //Do what you want to handle in the callback
      this.props.closePopup(evt);
    }
  };

  componentDidMount() {
    this.searchBoxRef.current && this.searchBoxRef.current.focus();
    document.body.classList.add(globalStyles.noScroll);
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
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentDidUpdate() {
    if (
      this.state.searchValue.length <= 2 &&
      this.state.suggestions.length > 0
    ) {
      this.setState({
        suggestions: []
      });
    }
  }
  componentWillUnmount() {
    document.body.classList.remove(globalStyles.noScroll);
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  closeSearch = () => {
    this.props.toggle();
  };

  handleChange = (e: any) => {
    // const regex = /^[A-Za-z0-9 ]+$/;
    // const key = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    // if (!regex.test(key)) {
    //   e.preventDefault();
    //   return false;
    // }
    this.setState({ searchValue: e.target.value });
  };

  UNSAFE_componentWillReceiveProps = (nextProps: Props) => {
    if (nextProps.location.pathname !== this.props.location.pathname) {
      this.props.toggle();
    }
    if (this.props.currency != nextProps.currency) {
      this.getSearchDataApi(this.state.searchValue);
      // nextProps.mobile
      //   ? this.updateDataFromAPI("load")
      //   : this.updateDataFromAPI();
    }
  };

  handleFeaturedProductClick(data: WidgetImage, index: number) {
    this.props.history.push(data.ctaUrl);
    this.props.changeModalState(false);
  }

  showProduct(data: PartialProductItem | WidgetImage, indices: number) {
    const itemData = data as PartialProductItem;
    const products: any = [];
    if (!data) return false;
    let category = "";
    if (itemData.categories) {
      const index = itemData.categories.length - 1;
      category = itemData.categories[index].replace(/\s/g, "");
      category = category.replace(/>/g, "/");
    }
    const listPath = `SearchResults`;
    CookieService.setCookie("listPath", listPath);
    const attr = (itemData.childAttributes as ChildProductAttributes[])?.map(
      (child: any) => {
        return Object.assign(
          {},
          {
            name: data.title,
            id: itemData.childAttributes?.[0].sku,
            price: child.discountedPriceRecords
              ? child.discountedPriceRecords[this.props.currency]
              : child.priceRecords[this.props.currency],
            brand: "Goodearth",
            category: category,
            variant: itemData.childAttributes?.[0].size || "",
            position: indices
          }
        );
      }
    );
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS) || true) {
      dataLayer.push({
        event: "productClick",
        ecommerce: {
          currencyCode: this.props.currency,
          click: {
            // actionField: { list: "Search Popup" },
            actionField: { list: listPath },
            products: products.concat(attr)
          }
        }
      });
    }
    // this.props.toggle();
    this.props.hideSearch();
    this.props.history.push(data.url);
  }

  onClickSearch = (event: any) => {
    if (this.state.searchValue.trim().length > 0) {
      this.props.history.push(
        `/search/${this.state.url.split("/autocomplete")[1]}`
      );
      // this.closeSearch();
      this.props.hideSearch();
      return false;
    }
  };

  checkSearchValue = (event: any) => {
    // const regex = /^[A-Za-z0-9% ]+$/;
    // const key = String.fromCharCode(
    //   !event.charCode ? event.which : event.charCode
    // );
    if (
      event.type != "paste"
      // &&
      // !regex.test(key) &&
      // (!event.charCode ? event.which : event.charCode) != 13
    ) {
      event.preventDefault();
      return false;
    }
  };

  checkSearchValueUp = (event: any) => {
    if (event.target.value.trim().length > 0) {
      if ((!event.charCode ? event.which : event.charCode) == 13) {
        this.props.history.push(
          "/search/?q=" + encodeURIComponent(event.target.value)
        );
        // this.closeSearch();
        this.props.hideSearch();
        this.props.hideMenu();
        return false;
      }
      this.setState({
        searchValue: event.target.value
      });
      this.getSearchDataApi(event.target.value);
      CookieService.setCookie("search", event.target.value, 365);
    } else {
      this.setState({
        productData: [],
        collections: [],
        categories: [],
        usefulLink: [],
        count: 0,
        url: "/search",
        searchValue: event.target.value
      });
      CookieService.setCookie("search", event.target.value, 365);
    }
  };

  getSearchDataApi = (name: string) => {
    const searchUrl = "/autocomplete?q=" + encodeURIComponent(name);
    this.setState({
      url: searchUrl
    });
    this.props
      .fetchSearchProducts(
        `${searchUrl.split("/autocomplete")[1]}&currency=${
          this.props.currency
        }&source=frontend`
      )
      .then(data => {
        // debugger;
        valid.productImpression(data, "SearchResults", this.props.currency);
        this.setState({
          productData: data.results.products,
          url: searchUrl,
          count: data.results.products.length,
          suggestions: [],
          categories: data.results.categories,
          collections: data.results.collections,
          usefulLink: data.results.useful_links
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  mouseOverImage = (index: number) => {
    this.setState({
      showDifferentImage: true,
      currentImageIndex: index
    });
  };

  mouseOutImage = (index: number) => {
    this.setState({
      showDifferentImage: false,
      currentImageIndex: index
    });
  };

  renderCollectionTile = (data?: any) => {
    // As discussed data will be only two section
    return (
      <div className={styles.collectionlist}>
        {data?.map((item: any, i: number) => {
          return (
            <div key={item.id} className={styles.collection}>
              <Link
                to={item.link}
                onClick={() => {
                  // this.props.toggle();
                  this.props.hideSearch();
                }}
              >
                <img
                  // alt={item.altText || item.title}
                  src={item.image}
                  className={cs(globalStyles.imgResponsive, styles.sliderImage)}
                />
              </Link>
              <div className={styles.moreBlock}>
                <p className={styles.title}>
                  {" "}
                  {`${item.category.replace(">", "/")} `}{" "}
                </p>
                <p className={styles.productN}>
                  <Link to={item.link}>
                    {" "}
                    {ReactHtmlParser(item.collection)}
                  </Link>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  render() {
    // const cur = "price" + this.props.currency.toLowerCase();
    // const originalCur = "original_price_" + this.props.currency.toLowerCase();
    const suggestionsExist = this.state.suggestions.length > 0;
    const { mobile, showTimer } = this.props;
    const { collections, categories, usefulLink, productData } = this.state;
    const productsExist =
      collections.length > 0 ||
      categories.length > 0 ||
      usefulLink.length > 0 ||
      productData.length > 0;
    return (
      <div
        className={cs(globalStyles.minimumWidth, styles.search, {
          [styles.searchTimer]: showTimer
        })}
        ref={this.impactRef}
      >
        <div>
          <div className={bootstrapStyles.col12}>
            <div className={cs(bootstrapStyles.row, styles.searchShadow)}>
              <div
                className={cs(
                  bootstrapStyles.colMd8,
                  bootstrapStyles.offsetMd2,
                  bootstrapStyles.col12,
                  styles.searchInputBlock
                )}
              >
                <input
                  type="text"
                  placeholder="Looking for something?"
                  ref={this.searchBoxRef}
                  // onKeyPress={this.checkSearchValue}
                  // onPaste={this.checkSearchValue}
                  onKeyUp={this.checkSearchValueUp}
                  onChange={this.handleChange.bind(this)}
                />
                <span
                  className={cs(styles.linkResults, {
                    [styles.mobileLinkResults]: mobile
                  })}
                  onClick={this.onClickSearch}
                >
                  {`view all results`}
                </span>
                {
                  <i
                    className={cs(
                      iconStyles.icon,
                      iconStyles.iconSearch,
                      styles.iconSearchPopup
                    )}
                    onClick={this.onClickSearch}
                  ></i>
                }
                {!mobile && (
                  <i
                    className={cs(
                      iconStyles.icon,
                      iconStyles.iconCrossNarrowBig,
                      styles.iconStyle,
                      styles.iconSearchCross
                    )}
                    onClick={() => {
                      this.props.hideSearch();
                    }}
                  ></i>
                )}
              </div>
            </div>

            <div
              className={
                !productsExist &&
                this.state.searchValue.length <= 2 &&
                !suggestionsExist
                  ? cs(bootstrapStyles.row, globalStyles.marginT30)
                  : globalStyles.hidden
              }
            >
              <div
                className={cs(
                  bootstrapStyles.col12,
                  styles.searchProducts,
                  {
                    [styles.onlySuggestionHeight]:
                      suggestionsExist && !productsExist
                  },
                  { [styles.searchProductsM]: mobile },
                  {
                    [styles.searchProductsIpad]: this.props.ipad && !mobile
                  }
                )}
              >
                <div className={bootstrapStyles.row}>
                  <div
                    className={cs(
                      bootstrapStyles.colMd12,
                      bootstrapStyles.col12,
                      globalStyles.textCenter,
                      styles.checkheight,
                      {
                        [styles.noSuggestionPadding]:
                          !mobile && !suggestionsExist,
                        [styles.onlySuggestionMinHeight]:
                          suggestionsExist && !productsExist,
                        [styles.checkheightMobile]: mobile
                      }
                    )}
                  >
                    {this.state.searchValue.length > 2 ? (
                      <div className={styles.npfMsg}>
                        {"Sorry, we couldn't find any matching result for"}{" "}
                        &nbsp;
                        <span>{this.state.searchValue}</span>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div
              className={
                !productsExist &&
                suggestionsExist &&
                this.state.searchValue.length > 2
                  ? cs(bootstrapStyles.row, globalStyles.marginT30)
                  : globalStyles.hidden
              }
            >
              <div
                className={cs(
                  bootstrapStyles.col12,
                  styles.searchProducts,
                  {
                    [styles.onlySuggestionHeight]:
                      suggestionsExist && !productsExist
                  },
                  { [styles.searchProductsM]: mobile },
                  {
                    [styles.searchProductsIpad]: this.props.ipad && !mobile
                  }
                )}
              >
                <div className={bootstrapStyles.row}>
                  <div
                    className={cs(
                      bootstrapStyles.colMd8,
                      bootstrapStyles.offsetMd2,
                      styles.checkheight,
                      {
                        [styles.noSuggestionPadding]:
                          !mobile && !suggestionsExist,
                        [styles.onlySuggestionMinHeight]:
                          suggestionsExist && !productsExist,
                        [styles.onlySuggestionMobile]: mobile,
                        [styles.checkheightMobile]: mobile
                      }
                    )}
                  >
                    <p className={styles.suggestion}>suggestions</p>
                    {this.state.suggestions.map(list => {
                      return (
                        <p
                          className={styles.suggestionText}
                          key={Math.random()
                            .toString(36)
                            .substring(7)}
                        >
                          <a
                            href={list.url}
                            className={cs(
                              globalStyles.cerise,
                              styles.firstText
                            )}
                          >
                            {list.highlight}
                          </a>
                          <span>{` in ${list.title}`}</span>
                        </p>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div
              className={
                productsExist
                  ? cs(bootstrapStyles.row, globalStyles.marginT30)
                  : globalStyles.hidden
              }
            >
              <div
                className={cs(
                  bootstrapStyles.col12,
                  styles.searchProducts,
                  {
                    [styles.bothProductsSuggestionsMobile]: mobile,
                    [styles.onlySuggestionHeight]:
                      suggestionsExist && !productsExist
                  },
                  { [styles.searchProductsM]: mobile },
                  {
                    [styles.searchProductsIpad]: !this.props.ipad && !mobile
                  }
                )}
              >
                <div className={bootstrapStyles.row}>
                  {suggestionsExist && (
                    <div
                      className={cs(
                        bootstrapStyles.colMd3,
                        globalStyles.textCenter,
                        { [styles.suggestionsFlex]: mobile }
                      )}
                    >
                      <p className={styles.suggestion}>suggestions</p>
                      {this.state.suggestions.map(list => {
                        return (
                          <p
                            className={styles.suggestionText}
                            key={Math.random()
                              .toString(36)
                              .substring(7)}
                          >
                            <a
                              href={list.url}
                              className={cs(
                                globalStyles.cerise,
                                styles.firstText
                              )}
                            >
                              {list.highlight}
                            </a>
                            <span>{` in ${list.title}`}</span>
                          </p>
                        );
                      })}
                    </div>
                  )}
                  <div>
                    {usefulLink.length > 0 && (
                      <div className={globalStyles.marginT30}>
                        <p
                          className={cs(
                            styles.productHeading,
                            globalStyles.marginB10,
                            { [styles.padding]: !mobile },
                            { [styles.paddingMobile]: mobile }
                          )}
                        >
                          USEFUL LINKS
                        </p>
                        {usefulLink?.map(cat => {
                          return (
                            <Link
                              to={cat.link}
                              onClick={() => {
                                //this.props.toggle();
                                this.props.hideSearch();
                              }}
                            >
                              <p
                                className={cs(
                                  styles.categories,
                                  { [styles.padding]: !mobile },
                                  { [styles.paddingMobile]: mobile }
                                )}
                              >
                                {ReactHtmlParser(cat.name)}
                              </p>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                    {categories.length > 0 && (
                      <div className={globalStyles.marginT30}>
                        <p
                          className={cs(
                            styles.productHeading,
                            globalStyles.marginB10,
                            { [styles.padding]: !mobile },
                            { [styles.paddingMobile]: mobile }
                          )}
                        >
                          CATEGORIES
                        </p>
                        {categories?.map(cat => {
                          return (
                            <Link
                              to={cat.link}
                              onClick={() => {
                                //this.props.toggle();
                                this.props.hideSearch();
                              }}
                            >
                              <p
                                className={cs(
                                  styles.categories,
                                  { [styles.padding]: !mobile },
                                  { [styles.paddingMobile]: mobile }
                                )}
                              >
                                {`${cat.parent.replace(">", "/")} / `}
                                {ReactHtmlParser(cat.category)}
                                {`(${cat.product_count})`}
                              </p>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                    {collections.length > 0 && (
                      <div className={globalStyles.marginT30}>
                        <p
                          className={cs(
                            styles.productHeading,
                            globalStyles.marginB10,
                            { [styles.padding]: !mobile },
                            { [styles.paddingMobile]: mobile }
                          )}
                        >
                          COLLECTIONS
                        </p>
                        <div
                          className={cs(
                            { [styles.padding]: !mobile },
                            { [styles.paddingMobile]: mobile },
                            styles.productHeading,
                            globalStyles.voffset2,
                            globalStyles.marginB20
                          )}
                        >
                          {this.renderCollectionTile(collections)}
                        </div>
                      </div>
                    )}
                    {productData.length > 0 && (
                      <div>
                        <p
                          className={cs(
                            styles.productName,
                            globalStyles.marginT30,
                            globalStyles.marginB10,
                            { [styles.padding]: !mobile },
                            { [styles.paddingMobile]: mobile }
                          )}
                        >
                          PRODUCTS
                        </p>
                      </div>
                    )}
                  </div>

                  {/* {mobile && (
                    <p
                      className={cs(
                        styles.suggestion,
                        globalStyles.voffset2,
                        globalStyles.marginB10
                      )}
                    >
                      products
                    </p>
                  )} */}
                  <div
                    className={cs(bootstrapStyles.row, {
                      [bootstrapStyles.colMd8]: suggestionsExist,
                      [bootstrapStyles.colMd12]: !suggestionsExist
                    })}
                  >
                    <div
                      className={cs(
                        bootstrapStyles.colMd12,
                        bootstrapStyles.col12,
                        styles.checkheight,
                        styles.left,
                        {
                          [styles.noSuggestionPadding]:
                            !mobile && !suggestionsExist,
                          [styles.onlySuggestionMinHeight]:
                            suggestionsExist && !productsExist,
                          [styles.checkheightMobile]: mobile
                        }
                      )}
                    >
                      {this.state.productData.length > 0
                        ? this.state.productData.map((data, i) => {
                            const isCombo = data.inStock;

                            let totalStock = (data.childAttributes as PartialChildProductAttributes[])?.reduce(
                              (
                                total: number,
                                num: PartialChildProductAttributes
                              ) => {
                                return total + +num.stock;
                              },
                              0
                            );
                            totalStock = isCombo ? 100 : totalStock;
                            // const imageSource = !data.plpImages?.[0]
                            //   ? noImagePlp
                            //   : !data.plpImages?.[1]
                            //   ? data.plpImages?.[0]
                            //   : this.state.showDifferentImage &&
                            //     !this.props.mobile &&
                            //     this.state.currentImageIndex == i
                            //   ? data.plpImages?.[1]
                            //   : data.plpImages?.[0];
                            return (
                              <div
                                key={i}
                                className={cs(
                                  // bootstrapStyles.colMd4,
                                  bootstrapStyles.colMd2,
                                  styles.suggestionBoxWidth
                                )}
                              >
                                {data.salesBadgeImage ? (
                                  <div
                                    className={cs(
                                      {
                                        [styles.badgePositionPlpMobile]: this
                                          .props.mobile
                                      },
                                      {
                                        [styles.badgePositionPlp]: !this.props
                                          .mobile
                                      }
                                    )}
                                  >
                                    <img
                                      src={data.salesBadgeImage}
                                      alt="sales-badge"
                                    />
                                  </div>
                                ) : (
                                  ""
                                )}
                                <div className={styles.imageboxNew}>
                                  <Link
                                    to={data.link}
                                    onClick={this.showProduct.bind(
                                      this,
                                      data,
                                      i
                                    )}
                                    // onMouseOver={this.mouseOverImage.bind(
                                    //   this,
                                    //   i
                                    // )}
                                    // onMouseOut={this.mouseOutImage.bind(
                                    //   this,
                                    //   i
                                    // )}
                                  >
                                    <img
                                      src={data.image}
                                      onError={this.addDefaultSrc}
                                      alt={data.altText || data.title}
                                      className={styles.imageResultNew}
                                    />
                                  </Link>
                                  {/* {totalStock <= 0 ? (
                                    <div className={styles.outstock}>
                                      <Link to={data.url}> NOTIFY ME </Link>
                                    </div>
                                  ) : (
                                    ""
                                  )} */}
                                </div>
                                <div className={styles.imageContent}>
                                  {/* <p className={styles.productH}>
                                    {data.collections}
                                  </p> */}
                                  <p className={styles.productN}>
                                    <Link
                                      to={data.link}
                                      onClick={this.showProduct.bind(
                                        this,
                                        data,
                                        i
                                      )}
                                    >
                                      {data.productClass == "GiftCard"
                                        ? "Gift Card"
                                        : ReactHtmlParser(data.product)}
                                    </Link>
                                  </p>
                                  {data?.productClass == "GiftCard"
                                    ? ""
                                    : !(
                                        data?.invisibleFields?.indexOf(
                                          "price"
                                        ) > -1
                                      ) && (
                                        <Price
                                          product={data}
                                          code={
                                            currencyCodes[this.props.currency]
                                          }
                                          isSale={this.props.isSale}
                                          currency={this.props.currency}
                                        />
                                      )}
                                </div>
                              </div>
                            );
                          })
                        : ""}
                    </div>
                  </div>
                </div>
                {this.state.count > 0 ? (
                  <div className={bootstrapStyles.row}>
                    <div
                      className={cs(
                        bootstrapStyles.colMd12,
                        bootstrapStyles.col12
                      )}
                    >
                      <div className={styles.searchBottomBlock}>
                        <div className={globalStyles.textCenter}>
                          <button onClick={this.onClickSearch}>
                            {/* {`View All ${this.state.count} Results`}{" "} */}
                            {`View All Results`}{" "}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div
              className={`${
                !productsExist &&
                !suggestionsExist &&
                this.state.searchValue.length > 2
                  ? cs(
                      bootstrapStyles.row,
                      styles.searchProducts,
                      globalStyles.marginT30
                    )
                  : globalStyles.hidden
              } ${
                mobile == true
                  ? styles.searchProductsM
                  : this.props.ipad == true
                  ? styles.searchProductsIpad
                  : ""
              }`}
            >
              <div
                className={cs(
                  bootstrapStyles.colMd12,
                  bootstrapStyles.col12,
                  globalStyles.textCenter
                )}
              >
                {this.state.searchValue.length > 2 ? (
                  <div className={cs(styles.npfMsg, globalStyles.marginT30)}>
                    {`Sorry, we couldn’t find any matching result for`} &nbsp;
                    <span>
                      {`"`}
                      {this.state.searchValue}
                      {`"`}
                    </span>
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div
                className={cs(
                  globalStyles.col12,
                  styles.searchHeading,
                  globalStyles.textCenter
                )}
              >
                <h2 className={globalStyles.voffset5}>Featured Categories</h2>
              </div>
              <div className={cs(bootstrapStyles.col12, globalStyles.voffset5)}>
                <div className={bootstrapStyles.row}>
                  <div
                    className={cs(
                      bootstrapStyles.colMd12,
                      bootstrapStyles.col12,
                      styles.checkheight,
                      {
                        [styles.noSuggestionPadding]:
                          !mobile && !suggestionsExist,
                        [styles.checkheightMobile]: mobile
                      }
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
                                <Link
                                  to={data.ctaUrl}
                                  onClick={this.handleFeaturedProductClick.bind(
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
                                    alt={data.title}
                                    className={styles.imageResultNew}
                                  />
                                </Link>
                              </div>
                              <div className={styles.imageContent}>
                                <p className={styles.searchImageTitle}>
                                  {data?.ctaText}
                                </p>
                                <p className={styles.searchFeature}>
                                  <Link
                                    to={data.ctaUrl}
                                    onClick={this.handleFeaturedProductClick.bind(
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
                <div className={bootstrapStyles.row}>
                  <div
                    className={cs(
                      bootstrapStyles.colMd12,
                      bootstrapStyles.col12
                    )}
                  >
                    <div className={styles.searchBottomBlockSecond}>
                      <div className={globalStyles.textCenter}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const SearchRoute = withRouter(Search);
export default connect(mapStateToProps, mapDispatchToProps)(SearchRoute);
