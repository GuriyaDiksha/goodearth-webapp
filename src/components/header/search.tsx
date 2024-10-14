import React from "react";
// import * as mapper from "mappers/header"
// import {connect} from 'react-redux'
// import axios from 'axios';
// import Config from 'components/config'
import { gaEventsForSearch, productImpression } from "utils/validate";
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
import { GA_CALLS, SEARCH_HISTORY } from "constants/cookieConsent";
// import giftCardTile from "images/giftcard-tile.png";
import newGiftCardTile from "images/giftCardImages/Group 1747.jpg";
import { debounce } from "lodash";
import WishlistButton from "components/WishlistButton";

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
    },
    fetchTrendingKeyword: async () => {
      const res = await HeaderService.fetchTrendingKeyword(dispatch);
      return res;
    },
    fetchYouMightLikeProducts: async () => {
      const res = await HeaderService.fetchYouMightLikeProducts(dispatch);
      return res;
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
  trendingWords: any[];
  spellchecks: any[];
  recentSearchs: any[];
  youMightLikeProducts: any[];
  suggestedData: any[];
};
class Search extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      searchValue: "",
      suggestedData: [],
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
      usefulLink: [],
      trendingWords: [],
      spellchecks: [],
      recentSearchs: [],
      youMightLikeProducts: []
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
    this.props
      .fetchTrendingKeyword()
      .then(res => {
        this.setState({
          trendingWords: res.data
        });
      })
      .catch(function(error) {
        console.log(error);
      });

    this.props
      .fetchYouMightLikeProducts()
      .then(res => {
        this.setState({
          youMightLikeProducts: res?.results
        });
      })
      .catch(function(error) {
        console.log(error);
      });
    document.addEventListener("mousedown", this.handleClickOutside);
    this.setState({
      recentSearchs: localStorage.getItem("recentSearch")
        ? JSON.parse(localStorage.getItem("recentSearch") || "[]")
        : []
    });
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

  handleChange = debounce((e: any) => {
    // const regex = /^[A-Za-z0-9 ]+$/;
    // const key = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    // if (!regex.test(key)) {
    //   e.preventDefault();
    //   return false;
    // }
    localStorage.setItem("inputValue", this.state.searchValue.trim());
    localStorage.setItem("clickType", "Input");

    this.setState({ searchValue: e.target.value });
  }, 300);

  UNSAFE_componentWillReceiveProps = (nextProps: Props) => {
    this.setState({
      recentSearchs: localStorage.getItem("recentSearch")
        ? JSON.parse(localStorage.getItem("recentSearch") || "[]")
        : []
    });
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

  getTextFromHtml = (html: any) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  showProduct(
    data: PartialProductItem | WidgetImage,
    indices: number,
    isYml?: boolean
  ) {
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
            position: indices,
            dimension12: child?.color
          }
        );
      }
    );
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
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

      if (isYml) {
        CookieService.setCookie(
          "search",
          this.getTextFromHtml(data?.product || data?.title),
          365
        );
        localStorage.setItem("clickType", "You Might Like");
        dataLayer.push({
          event: "search_bar_results_found",
          cta_name: this.getTextFromHtml(data?.product || data?.title),
          click_type: "You Might Like",
          search_term: ""
        });
      } else {
        localStorage.setItem("clickType", "Products");
        gaEventsForSearch(
          data,
          "Products",
          this.getTextFromHtml(data?.product || data?.title),
          this.state.searchValue
        );
      }
    }
    // this.props.toggle();
    this.props.hideSearch();
    this.props.history.push(data.url);
  }

  onlyUnique(value: any, index: any, self: any) {
    return self.indexOf(value) === index;
  }

  titleCase(str: string) {
    if (str.match(/^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/)) {
      const splitStr = str.toLowerCase().split(" ");
      splitStr?.map((val, i) => {
        splitStr[i] = val.charAt(0).toUpperCase() + val.substring(1);
      });

      return splitStr.join(" ");
    }

    return str;
  }

  recentSearch(value: string | null) {
    const searchValue = value || this.state.searchValue;
    const searchArr = localStorage.getItem("recentSearch")
      ? JSON.parse(localStorage.getItem("recentSearch") || "[]")
      : [];

    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(SEARCH_HISTORY)) {
      const arr = JSON.stringify(
        [this.titleCase(searchValue), ...searchArr]
          .filter(this.onlyUnique)
          .slice(0, 5)
      );

      localStorage.setItem("recentSearch", arr);
    }
  }

  onClickSearch = (event: any) => {
    if (this.state.searchValue?.trim().length > 0) {
      localStorage.setItem("inputValue", this.state.searchValue?.trim());
      localStorage.setItem("clickType", "Input");

      this.props.history.push(
        `/search/${this.state?.url?.split("/autocomplete")?.[1]}`
      );
      // this.closeSearch();

      this.props.hideSearch();
      this.recentSearch(null);
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

  checkSearchValueUp = debounce((event: any) => {
    if (event.target.value.trim().length > 0) {
      if ((!event.charCode ? event.which : event.charCode) == 13) {
        localStorage.setItem("inputValue", this.state.searchValue.trim());
        localStorage.setItem("clickType", "Input");

        this.props.history.push(
          "/search/?q=" + encodeURIComponent(event.target.value)
        );
        // this.closeSearch();
        this.props.hideSearch();
        this.props.hideMenu();
        this.recentSearch(event.target.value);
        return false;
      }
      this.setState({
        searchValue: event.target.value
      });
      this.getSearchDataApi(event.target.value);
      CookieService.setCookie("search", event.target.value, 365);
    } else {
      this.setState({
        suggestedData: [],
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
  }, 400);

  getSearchDataApi = debounce((name: string) => {
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
        productImpression(data, "SearchResults", this.props.currency);
        this.setState({
          suggestedData: data.results?.suggested_keywords || [],
          productData: data.results?.products || [],
          url: searchUrl,
          count: data.results?.products.length || [],
          suggestions: [],
          categories: data.results?.categories || [],
          collections: data.results?.collections || [],
          usefulLink: data.results?.useful_links || [],
          spellchecks: data?.results?.spellchecks || []
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  }, 200);

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
        {data?.slice(0, 5)?.map((item: any, i: number) => {
          return (
            <div key={item.id} className={styles.collection}>
              <Link
                to={item.link}
                onClick={() => {
                  // this.props.toggle();
                  gaEventsForSearch(
                    data,
                    "Collections",
                    this.getTextFromHtml(item.collection),
                    this.state.searchValue
                  );
                  localStorage.setItem("clickType", "Collections");

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
                {/* <p className={styles.title}>
                  {" "}
                  {`${item.category.replace(">", "/")} `}{" "}
                </p> */}
                <p className={cs(styles.productN, styles.collectionN)}>
                  <Link
                    to={item.link}
                    onClick={() => {
                      // this.props.toggle();
                      gaEventsForSearch(
                        data,
                        "Collections",
                        this.getTextFromHtml(item.collection),
                        this.state.searchValue
                      );
                      localStorage.setItem("clickType", "Collections");
                      this.props.hideSearch();
                    }}
                  >
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
  decodeSearchString(value: string) {
    try {
      return decodeURIComponent(value);
    } catch (e) {
      return value;
    }
  }
  render() {
    // const cur = "price" + this.props.currency.toLowerCase();
    // const originalCur = "original_price_" + this.props.currency.toLowerCase();
    const suggestionsExist = this.state.suggestions.length > 0;
    const { mobile, showTimer } = this.props;
    const {
      collections,
      categories,
      usefulLink,
      suggestedData,
      productData,
      trendingWords,
      searchValue,
      spellchecks,
      recentSearchs,
      youMightLikeProducts
    } = this.state;
    const productsExist =
      collections.length > 0 ||
      categories.length > 0 ||
      usefulLink.length > 0 ||
      suggestedData.length > 0 ||
      productData.length > 0 ||
      (trendingWords.length > 0 && searchValue.length == 0) ||
      (recentSearchs.length > 0 && searchValue.length == 0);

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
                  styles.searchTabContainer,
                  bootstrapStyles.colLg8,
                  bootstrapStyles.colMd12,
                  bootstrapStyles.col12,
                  bootstrapStyles.offsetLg2,
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
                  onInput={this.checkSearchValueUp}
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
                        <span>
                          {this.decodeSearchString(this.state.searchValue)}
                        </span>
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
                      bootstrapStyles.offsetLg2,
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
                  styles.searchTabContainer,
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
                <ul
                  className={cs(styles.suggestedData, {
                    [styles.suggestDataDiv]: mobile,
                    [bootstrapStyles.row]: !mobile,
                    [styles.noSuggestionPadding]: !mobile && !suggestionsExist,
                    [globalStyles.marginT10]: !mobile
                  })}
                >
                  {this.state.suggestedData.slice(0, 6).map((data, i) => {
                    const words = data
                      .split(" ")
                      .filter((word: string) => word.trim() !== "");
                    const allWordsExceptLast = words.slice(0, -1).join(" ");
                    const lastWord = words[words.length - 1];
                    return (
                      data.length > 0 && (
                        <Link to={`/search/?q=${encodeURIComponent(data)}`}>
                          <li
                            key={i}
                            onClick={e => {
                              this.props.hideSearch();
                              e.preventDefault();
                              this.props.history.push(
                                `/search/?q=${encodeURIComponent(data)}`
                              );
                            }}
                          >
                            <span>{allWordsExceptLast}</span>
                            <span className={styles.searchLastWord}>
                              {lastWord}
                            </span>
                          </li>
                        </Link>
                      )
                    );
                  })}
                </ul>
                <div className={cs(bootstrapStyles.row, styles.suggestionWrap)}>
                  {spellchecks?.length ? (
                    <div
                      className={cs(
                        globalStyles.textCenter,
                        { [globalStyles.paddTop30]: !mobile },
                        { [globalStyles.paddBottom50]: !mobile },
                        { [globalStyles.paddTop10]: mobile },
                        { [globalStyles.paddBottom10]: mobile },
                        { [globalStyles.paddLeft70]: mobile },
                        { [globalStyles.paddRight70]: mobile },
                        styles.didYouMeanText
                      )}
                    >
                      No results found for{" "}
                      <span className={globalStyles.gold}>{searchValue}</span>.
                      Showing results for&nbsp;
                      {spellchecks?.map((e, i) => (
                        <Link
                          to={"/search/?q=" + e}
                          onClick={(eve: any) => {
                            this.props.history.push("/search/?q=" + e);
                            this.props.hideSearch();
                            e.preventDefault();
                          }}
                          key={i}
                        >
                          <span className={cs(globalStyles.gold)}>
                            {e}
                            {spellchecks.length === i + 1 ? null : ","}
                          </span>
                        </Link>
                      ))}
                    </div>
                  ) : null}
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
                    {trendingWords.length > 0 &&
                      this.state.searchValue.length == 0 && (
                        <div
                          className={cs(
                            bootstrapStyles.offsetLg2,
                            { [globalStyles.marginT30]: !mobile },
                            { [globalStyles.marginT10]: mobile },
                            { [styles.trendingdesktopPad]: !mobile },
                            { [styles.trendingmobilePad]: mobile }
                          )}
                        >
                          <p
                            className={cs(
                              styles.productHeading,
                              globalStyles.marginB10
                            )}
                          >
                            POPULAR SEARCHES
                          </p>
                          <div className={cs(styles.trending)}>
                            {trendingWords?.map((cat, ind) => {
                              return (
                                <Link
                                  to={cat.link}
                                  onClick={(e: any) => {
                                    localStorage.setItem(
                                      "popularSearch",
                                      cat?.name
                                    );
                                    localStorage.setItem(
                                      "clickType",
                                      "Popular Searches"
                                    );

                                    if (
                                      !cat.link &&
                                      this.searchBoxRef &&
                                      this.searchBoxRef.current
                                    ) {
                                      this.props.history.push(
                                        "/search/?q=" + cat.name
                                      );
                                      this.props.hideSearch();
                                      e.preventDefault();
                                    } else {
                                      this.props.hideSearch();
                                    }
                                  }}
                                  key={ind}
                                >
                                  <i
                                    className={cs(
                                      iconStyles.icon,
                                      iconStyles.iconSearch,
                                      styles.iconCross
                                    )}
                                  ></i>
                                  <span
                                    className={cs(
                                      styles.trendingcat
                                      // { [styles.padding]: !mobile },
                                      // { [styles.paddingMobile]: mobile }
                                    )}
                                  >
                                    {ReactHtmlParser(cat.name)}
                                  </span>
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    {recentSearchs?.length &&
                    this.state.searchValue.length == 0 ? (
                      <div className={styles.recentWrp}>
                        <div className={styles.recentWrpHead}>
                          <p
                            className={cs(
                              styles.productHeading,
                              globalStyles.marginB10
                            )}
                          >
                            RECENT SEARCHES
                          </p>
                          <button
                            onClick={() => {
                              this.setState({ recentSearchs: [] });
                              localStorage.setItem(
                                "recentSearch",
                                JSON.stringify([])
                              );
                            }}
                          >
                            Clear All
                          </button>
                        </div>

                        {recentSearchs?.map((ele, ind) => (
                          <div className={styles.recentBlock} key={ind}>
                            <Link
                              to={"/search/?q=" + encodeURIComponent(ele)}
                              onClick={() => {
                                localStorage.setItem("recentSearchValue", ele);
                                localStorage.setItem(
                                  "clickType",
                                  "recent searches"
                                );
                                CookieService.setCookie("search", ele, 365);
                                this.recentSearch(ele);
                                this.props.hideSearch();
                              }}
                              key={ind}
                            >
                              {ele}
                            </Link>
                            <i
                              className={cs(
                                iconStyles.icon,
                                iconStyles.iconCross,
                                styles.iconStyle,
                                styles.iconSearchCross,
                                styles.searchCross
                              )}
                              onClick={() => {
                                this.setState({
                                  recentSearchs: recentSearchs.filter(
                                    e => e !== ele
                                  )
                                });
                                localStorage.setItem(
                                  "recentSearch",
                                  JSON.stringify(
                                    recentSearchs.filter(e => e !== ele)
                                  )
                                );
                              }}
                            ></i>
                          </div>
                        ))}
                      </div>
                    ) : null}
                    {youMightLikeProducts.length > 0 &&
                      this.state.searchValue.length == 0 && (
                        <>
                          <div
                            className={cs(
                              bootstrapStyles.offsetLg2,
                              globalStyles.marginT50,
                              { [styles.ymlpPadding]: mobile }
                            )}
                          >
                            <p
                              className={cs(
                                styles.productName,
                                globalStyles.marginB20
                              )}
                            >
                              YOU MIGHT LIKE
                            </p>
                          </div>

                          <div
                            className={cs(
                              bootstrapStyles.row,
                              bootstrapStyles.offsetLg2
                            )}
                          >
                            <div
                              className={cs(
                                bootstrapStyles.colLg10,
                                bootstrapStyles.colMd12,
                                bootstrapStyles.colSm10,
                                styles.ymlpWrapper
                              )}
                            >
                              {youMightLikeProducts?.map((data, idx) => (
                                <div
                                  key={idx}
                                  className={cs(
                                    bootstrapStyles.col6,
                                    styles.ymlpTile
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
                                    <div
                                      className={cs(
                                        globalStyles.textCenter,
                                        globalStyles.desktopWishlist,
                                        {
                                          [globalStyles.mobileWishlistPlp]: mobile
                                        }
                                      )}
                                    >
                                      <WishlistButton
                                        gtmListType="Search"
                                        title={data?.title}
                                        childAttributes={data?.childAttributes}
                                        priceRecords={data?.priceRecords}
                                        discountedPriceRecords={
                                          data?.discountedPriceRecords
                                        }
                                        categories={data?.categories}
                                        id={data?.id}
                                        showText={false}
                                        key={data?.id}
                                        mobile={mobile}
                                        isPlpTile={true} //passing true for new icons
                                      />
                                    </div>
                                    {data?.badge_text && (
                                      <div
                                        className={cs(
                                          globalStyles.textCenter,
                                          globalStyles.badgePositionDesktop,
                                          {
                                            [globalStyles.badgePositionMobile]: mobile
                                          }
                                        )}
                                      >
                                        <div
                                          className={cs(
                                            globalStyles.badgeContainer
                                          )}
                                        >
                                          {data?.badge_text}
                                        </div>
                                      </div>
                                    )}
                                    <Link
                                      to={data.link}
                                      onClick={this.showProduct.bind(
                                        this,
                                        data,
                                        data?.id,
                                        true
                                      )}
                                    >
                                      <img
                                        src={data.image}
                                        onError={this.addDefaultSrc}
                                        alt={data.altText || data.title}
                                        className={styles.imageResultNew}
                                      />
                                    </Link>
                                  </div>
                                  <div className={styles.imageContent}>
                                    <p className={styles.productN}>
                                      <Link
                                        to={data.link}
                                        onClick={this.showProduct.bind(
                                          this,
                                          data,
                                          data?.id,
                                          true
                                        )}
                                      >
                                        {ReactHtmlParser(data.product)}{" "}
                                      </Link>
                                    </p>
                                    {
                                      <Price
                                        product={data}
                                        code={
                                          currencyCodes[this.props.currency]
                                        }
                                        isSale={this.props.isSale}
                                        currency={this.props.currency}
                                      />
                                    }
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
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
                        {usefulLink?.map((cat, ind) => {
                          return (
                            <Link
                              to={cat.link}
                              onClick={() => {
                                //this.props.toggle();
                                this.props.hideSearch();
                              }}
                              key={ind}
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
                      <div
                        className={cs({
                          // [globalStyles.marginT50]: !mobile,
                          [globalStyles.marginT30]: mobile
                        })}
                      >
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
                        {categories?.map((cat, ind) => {
                          return (
                            <Link
                              to={cat.link}
                              onClick={() => {
                                //this.props.toggle();
                                gaEventsForSearch(
                                  categories,
                                  "Categories",
                                  `${cat.parent.replace(" > ", "/")}/` +
                                    this.getTextFromHtml(cat.category),
                                  this.state.searchValue
                                );
                                localStorage.setItem("clickType", "Categories");
                                this.props.hideSearch();
                              }}
                              key={ind}
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

                  {productData.length > 0 && (
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
                                    {data?.badge_text && (
                                      <div
                                        className={cs(
                                          globalStyles.textCenter,
                                          globalStyles.badgePositionDesktop,
                                          {
                                            [globalStyles.badgePositionMobile]: mobile
                                          }
                                        )}
                                      >
                                        <div
                                          className={cs(
                                            globalStyles.badgeContainer
                                          )}
                                        >
                                          {data?.badge_text}
                                        </div>
                                      </div>
                                    )}
                                    <Link
                                      to={data.link}
                                      onClick={this.showProduct.bind(
                                        this,
                                        data,
                                        i,
                                        false
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
                                        src={
                                          data.link == "/giftcard"
                                            ? newGiftCardTile
                                            : data.image
                                        }
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
                                    {data?.link == "/giftcard"
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
                  )}
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
