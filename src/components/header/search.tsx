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
  PartialChildProductAttributes
} from "typings/product";
import bootstrapStyles from "../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "../../styles/global.scss";
import styles from "./styles.scss";
import iconStyles from "../../styles/iconFonts.scss";
import cs from "classnames";
import noImagePlp from "images/noimageplp.png";
import { withRouter, RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import { updateModal } from "actions/modal";

const mapStateToProps = (state: AppState) => {
  return {
    currency: state.currency,
    mobile: state.device.mobile,
    isSale: state.info.isSale
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
} & ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps;

type State = {
  searchValue: string;
  productData: PartialProductItem[];
  url: string;
  value: string;
  count: number;
  featureData: WidgetImage[];
  showDifferentImage: boolean;
  currentImageIndex: number;
  suggestions: any[];
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
      suggestions: []
    };
  }

  searchBoxRef = React.createRef<HTMLInputElement>();

  addDefaultSrc = (e: any) => {
    // e.target.src = "/static/img/noimageplp.png";
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
  }

  closeSearch = () => {
    this.props.toggle();
  };

  handleChange = (e: any) => {
    const regex = /^[A-Za-z0-9 ]+$/;
    const key = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (!regex.test(key)) {
      e.preventDefault();
      return false;
    }
    this.setState({ searchValue: e.target.value });
  };

  UNSAFE_componentWillReceiveProps = (nextProps: Props) => {
    if (nextProps.location.pathname !== this.props.location.pathname) {
      this.props.toggle();
    }
    if (this.props.currency != nextProps.currency) {
      this.getSearchDataApi(this.state.value);
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
    let category = "";
    if (itemData.categories) {
      const index = itemData.categories.length - 1;
      category = itemData.categories[index].replace(/\s/g, "");
      category = category.replace(/>/g, "/");
    }
    const cur = this.props.isSale
      ? itemData.discountedPriceRecords[this.props.currency]
      : itemData.priceRecords[this.props.currency];
    const listPath = `SearchResults`;
    CookieService.setCookie("listPath", listPath);
    dataLayer.push({
      event: "productClick",
      ecommerce: {
        currencyCode: this.props.currency,
        click: {
          // actionField: { list: "Search Popup" },
          actionField: { list: listPath },
          products: [
            {
              name: data.title,
              id: itemData.childAttributes?.[0].sku,
              price: cur,
              brand: "Goodearth",
              category: category,
              variant: itemData.childAttributes?.[0].size || "",
              position: indices
            }
          ]
        }
      }
    });
    this.props.history.push(data.url);
  }

  onClickSearch = (event: any) => {
    if (this.state.value.length > 2) {
      // console.log(encodeURIComponent(this.state.url))
      this.props.history.push(this.state.url);
      this.closeSearch();
      return false;
    }
  };

  checkSearchValue = (event: any) => {
    const regex = /^[A-Za-z0-9% ]+$/;
    const key = String.fromCharCode(
      !event.charCode ? event.which : event.charCode
    );
    if (
      event.type != "paste" &&
      !regex.test(key) &&
      (!event.charCode ? event.which : event.charCode) != 13
    ) {
      event.preventDefault();
      return false;
    }
  };

  checkSearchValueUp = (event: any) => {
    if (event.target.value.length > 2) {
      if ((!event.charCode ? event.which : event.charCode) == 13) {
        this.props.history.push(
          "/search?q=" +
            encodeURIComponent(event.target.value.replace(/[^A-Z0-9% ]+/i, ""))
        );
        this.closeSearch();
        return false;
      }
      this.setState({
        value: event.target.value.replace(/[^A-Z0-9% ]+/i, "")
      });
      this.getSearchDataApi(event.target.value.replace(/[^A-Z0-9% ]+/i, ""));
    } else {
      this.setState({
        productData: [],
        count: 0,
        url: "/search"
      });
    }
  };

  getSearchDataApi = (name: string) => {
    const searchUrl = "/search?q=" + encodeURIComponent(name);
    this.setState({
      url: searchUrl
    });
    this.props
      .fetchSearchProducts(searchUrl.split("/search")[1])
      .then(data => {
        valid.productImpression(data, "SearchResults", this.props.currency);
        this.setState({
          productData: data.results.data,
          url: searchUrl,
          count: data.count,
          suggestions: data.results.suggestions
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

  render() {
    // const cur = "price" + this.props.currency.toLowerCase();
    // const originalCur = "original_price_" + this.props.currency.toLowerCase();
    const suggestionsExist = this.state.suggestions.length > 0;
    const productsExist = this.state.productData.length > 0;
    const { mobile } = this.props;
    return (
      <div className={cs(globalStyles.minimumWidth, styles.search)}>
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
                  onKeyPress={this.checkSearchValue}
                  onPaste={this.checkSearchValue}
                  onKeyUp={this.checkSearchValueUp}
                  onChange={this.handleChange.bind(this)}
                />
                <span
                  className={styles.linkResults}
                  onClick={this.onClickSearch}
                >
                  {`view all results${
                    this.state.count ? `  (${this.state.count})` : ""
                  }`}
                </span>
                <i
                  className={cs(
                    iconStyles.icon,
                    iconStyles.iconSearch,
                    styles.iconSearchPopup
                  )}
                  onClick={this.onClickSearch}
                ></i>
                {!mobile && (
                  <i
                    className={cs(
                      iconStyles.icon,
                      iconStyles.iconCrossNarrowBig,
                      styles.iconStyle,
                      styles.iconSearchCross
                    )}
                    onClick={() => {
                      this.closeSearch();
                    }}
                  ></i>
                )}
              </div>
            </div>

            <div
              className={
                !productsExist &&
                this.state.value.length <= 2 &&
                !suggestionsExist
                  ? cs(bootstrapStyles.row, globalStyles.voffset5)
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
                    {this.state.searchValue.length > 1 ? (
                      <div className={styles.npfMsg}>
                        No products were found matching &nbsp;
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
                this.state.value.length > 2
                  ? cs(bootstrapStyles.row, globalStyles.voffset2)
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
                  ? cs(bootstrapStyles.row, globalStyles.voffset5)
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
                  {mobile && (
                    <p
                      className={cs(
                        styles.suggestion,
                        globalStyles.voffset2,
                        globalStyles.marginB10
                      )}
                    >
                      products
                    </p>
                  )}
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
                            const imageSource = !data.plpImages?.[0]
                              ? noImagePlp
                              : !data.plpImages?.[1]
                              ? data.plpImages?.[0]
                              : this.state.showDifferentImage &&
                                !this.props.mobile &&
                                this.state.currentImageIndex == i
                              ? data.plpImages?.[1]
                              : data.plpImages?.[0];
                            return (
                              <div
                                key={i}
                                className={cs(
                                  bootstrapStyles.colMd4,
                                  bootstrapStyles.col6
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
                                    <img src={data.salesBadgeImage} />
                                  </div>
                                ) : (
                                  ""
                                )}
                                <div className={styles.imageboxNew}>
                                  <Link
                                    to={data.url}
                                    onClick={this.showProduct.bind(
                                      this,
                                      data,
                                      i
                                    )}
                                    onMouseOver={this.mouseOverImage.bind(
                                      this,
                                      i
                                    )}
                                    onMouseOut={this.mouseOutImage.bind(
                                      this,
                                      i
                                    )}
                                  >
                                    <img
                                      src={imageSource}
                                      onError={this.addDefaultSrc}
                                      alt=""
                                      className={styles.imageResultNew}
                                    />
                                  </Link>
                                  {totalStock <= 0 ? (
                                    <div className={styles.outstock}>
                                      <Link to={data.url}> NOTIFY ME </Link>
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                </div>
                                <div className={styles.imageContent}>
                                  <p className={styles.productH}>
                                    {data.collections}
                                  </p>
                                  <p className={styles.productN}>
                                    <Link
                                      to={data.url}
                                      onClick={e => {
                                        this.showProduct.bind(this, data, i);
                                      }}
                                    >
                                      {data.productClass == "GiftCard"
                                        ? "Gift Card"
                                        : data.title}
                                    </Link>
                                  </p>
                                  {data.productClass == "GiftCard" ? (
                                    ""
                                  ) : (
                                    <p className={styles.productN}>
                                      {this.props.isSale && data.discount ? (
                                        <span className={styles.discountprice}>
                                          {String.fromCharCode(
                                            ...currencyCodes[
                                              this.props.currency
                                            ]
                                          )}
                                          &nbsp;{" "}
                                          {
                                            data.discountedPriceRecords[
                                              this.props.currency
                                            ]
                                          }{" "}
                                          &nbsp;{" "}
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                      {this.props.isSale && data.discount ? (
                                        <span className={styles.strikeprice}>
                                          {String.fromCharCode(
                                            ...currencyCodes[
                                              this.props.currency
                                            ]
                                          )}
                                          &nbsp;{" "}
                                          {
                                            data.priceRecords[
                                              this.props.currency
                                            ]
                                          }
                                        </span>
                                      ) : (
                                        <p
                                          className={cs(styles.productN, {
                                            [globalStyles.cerise]:
                                              data.badgeType == "B_flat"
                                          })}
                                        >
                                          {String.fromCharCode(
                                            ...currencyCodes[
                                              this.props.currency
                                            ]
                                          )}
                                          &nbsp;{" "}
                                          {
                                            data.discountedPriceRecords[
                                              this.props.currency
                                            ]
                                          }
                                        </p>
                                      )}
                                    </p>
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
                          <div className={styles.count}>
                            {" "}
                            {this.state.count} Search Results Found
                          </div>
                          <p onClick={this.onClickSearch}>View All Results</p>
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
                this.state.value.length > 2
                  ? cs(
                      bootstrapStyles.row,
                      styles.searchProducts,
                      globalStyles.voffset5
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
                {this.state.searchValue.length > 1 ? (
                  <div className={styles.npfMsg}>
                    No products were found matcing &nbsp;
                    <span>{this.state.searchValue}</span>
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
                                    alt=""
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
