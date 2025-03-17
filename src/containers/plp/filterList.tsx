import React, { Fragment } from "react";
import styles from "./styles.scss";
import cs from "classnames";
import { AppState } from "reducers/typings";
import { connect } from "react-redux";
import mapActionsToProps from "./mapper/actions";
import "./slider.css";
import globalStyles from "styles/global.scss";
import { Range } from "rc-slider";
import "rc-slider/assets/index.css";
import "./slider.css";
import { State, FilterProps } from "./typings";
import { withRouter } from "react-router";
import { RouteComponentProps } from "react-router-dom";
import { productImpression } from "utils/validate";
import iconStyles from "../../styles/iconFonts.scss";
import multiColour from "../../images/multiColour.svg";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
import CookieService from "services/cookie";
import { GA_CALLS } from "constants/cookieConsent";
import { displayPriceWithCommas } from "utils/utility";
import CheckboxWithLabel from "components/CheckboxWithLabel";

const mapStateToProps = (state: AppState) => {
  return {
    data: state.plplist.data,
    onload: state.plplist.onload,
    mobile: state.device.mobile,
    currency: state.currency,
    facets: state.plplist.data.results.facets,
    facetObject: state.plplist.facetObject,
    nextUrl: state.plplist.data.next,
    listdata: state.plplist.data.results.data,
    salestatus: state.info.isSale,
    scrollDown: state.info.scrollDown,
    customerGroup: state.user.customerGroup,
    filtered_facets: state.plplist.data.results.filtered_facets,
    showTimer: state.info.showTimer,
    mobileMenuOpenState: state.header.mobileMenuOpenState,
    previousUrl: state.plplist.data.previous
  };
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapActionsToProps> &
  FilterProps &
  RouteComponentProps;

class FilterList extends React.Component<Props, State> {
  public productData: any = [];
  public unlisten: any = "";
  timeout: any;
  constructor(props: Props) {
    super(props);
    this.state = {
      extraParams: {},
      shouldScroll: false,
      showmenulevel1: false,
      categorylevel1: false,
      showmobileFilterList: false,
      show: false,
      showDifferentImage: false,
      flag: true,
      showmenulevel2: false,
      banner: "",
      initialrangevalue: {
        min: 0,
        max: 0
      },
      rangevalue: [],
      filter: {
        currentColor: {},
        availableSize: {},
        categoryShop: {},
        price: {},
        currency: {},
        sortBy: {},
        productType: {},
        availableDiscount: {},
        currentMaterial: {}
      },
      searchUrl: this.props.history.location,
      mobileFilter: false,
      showmobileSort: false,
      showmobileText: "",
      filterUrl: "",
      oldSelectedCategory: "",
      showWishList: true,
      disableSelectedbox: false,
      openMenu: -1,
      scrolllastvalue: 0,
      scrollfilterlastvalue: 0,
      scrollload: false,
      totalItems: 0,
      showProductFilter: false,
      scrollView: false,
      showFilterByDiscountMenu: true,
      categoryindex: -1,
      activeindex: -1,
      activeindex2: 1,
      isViewAll: false,
      isPopupOpen: false,
      totalHeight: 0
    };
    this.props.onRef(this);
  }

  createFilterfromUrl = (openCat: boolean) => {
    const vars: any = {};
    const { history } = this.props;
    const url = decodeURI(history.location.search.replace(/\+/g, " "));
    const { filter } = this.state;
    const re = /[?&]+([^=&]+)=([^&]*)/gi;
    let match;
    while ((match = re.exec(url))) {
      vars[match[1]] = match[2];
    }
    let isViewAll = false;
    for (const key in vars) {
      if (Object.prototype.hasOwnProperty.call(vars, key)) {
        const cc = vars[key].replace(/%26/g, "&").split("|");
        switch (key) {
          case "current_color":
            for (let i = 0; i < cc.length; i++) {
              filter.currentColor[cc[i]] = {
                isChecked: true,
                value: cc[i]
              };
            }
            break;
          case "current_material":
            for (let i = 0; i < cc.length; i++) {
              filter.currentMaterial[cc[i]] = {
                isChecked: true,
                value: cc[i]
              };
            }
            break;
          case "available_size":
            for (let i = 0; i < cc.length; i++) {
              filter.availableSize[cc[i]] = {
                isChecked: true,
                value: cc[i]
              };
            }
            break;
          case "category_shop":
            for (let i = 0; i < cc.length; i++) {
              const csKey = cc[i].split(">")[1].trim();
              filter.categoryShop[csKey] = Object.assign(
                {},
                filter.categoryShop[csKey]
              );
              filter.categoryShop[csKey][cc[i].replace(/%2B/g, "+")] = true;
              if (cc[i].split(">").length == 2) {
                isViewAll = true;
              }
            }
            break;
          case "min_price":
          case "max_price":
            filter.price[key] = vars[key];
            break;
          case "currency":
            filter.currency[key] = vars[key];
            break;
          case "sort_by":
            filter.sortBy["sortBy"] = vars[key];
            break;
          case "product_type":
            for (let i = 0; i < cc.length; i++) {
              filter.productType["pb_" + cc[i]] = true;
            }
            break;
          case "available_discount":
            for (let i = 0; i < cc.length; i++) {
              filter.availableDiscount["disc_" + cc[i]] = {
                isChecked: true,
                value:
                  (filter.availableDiscount["disc_" + cc[i]] &&
                    filter.availableDiscount["disc_" + cc[i]].value) ||
                  cc[i]
              };
            }
            break;
          default:
            break;
        }
      }
    }
    if (openCat) {
      this.setState({
        showmenulevel2: true,
        categoryindex: 0,
        categorylevel1: true
      });
    }
    this.setState({
      filter: filter,
      // showmenulevel2: true,
      // categoryindex: 0,
      activeindex: this.state.openMenu,
      activeindex2: 1,
      // categorylevel1: true,
      isViewAll: isViewAll
    });
  };

  getMainUrl = (matchkey: any) => {
    const { pathname } = this.props.history.location;
    let currentKey, mainUrl, urllist;
    if (this.props.facets) {
      urllist = this.props.facets.categoryShop;
      urllist.some((urlData: any) => {
        currentKey = Object.keys(urlData)[0];
        if (matchkey.replace(/\+/g, " ") == currentKey) {
          mainUrl = urlData[currentKey];
          return true;
        }
      });
    } else {
      mainUrl = pathname;
    }

    return mainUrl;
  };

  createUrlfromFilter = (load?: any, currency?: string) => {
    const array = this.state.filter;
    const { history } = this.props;

    const urlParams = new URLSearchParams(history.location.search);
    const categoryShop = urlParams.get("category_shop");

    let filterUrl = "",
      categoryKey: any,
      mainurl: string | undefined = "",
      colorVars = "",
      materialVars = "",
      sizeVars = "",
      categoryShopVars = "",
      productVars = "",
      discountVars = "";
    Object.keys(array).map((filterType, i) => {
      Object.keys(array[filterType]).map((key, i) => {
        switch (filterType) {
          case "currentColor":
            if (
              array[filterType][key].value &&
              array[filterType][key].isChecked
            ) {
              colorVars == ""
                ? (colorVars = array[filterType][key].value)
                : (colorVars += "|" + array[filterType][key].value);
            }
            break;
          case "currentMaterial":
            if (
              array[filterType][key].value &&
              array[filterType][key].isChecked
            ) {
              materialVars == ""
                ? (materialVars = array[filterType][key].value)
                : (materialVars += "|" + array[filterType][key].value);
            }
            break;
          case "availableSize":
            if (
              array[filterType][key].value &&
              array[filterType][key].isChecked
            ) {
              sizeVars == ""
                ? (sizeVars = array[filterType][key].value)
                : (sizeVars += "|" + array[filterType][key].value);
            }
            break;
          case "categoryShop":
            categoryKey = array[filterType][key];
            let l2Selected = false;
            Object.keys(categoryKey).map(data => {
              if (categoryKey[data] && !l2Selected) {
                const orignalData = data;
                data = encodeURIComponent(data).replace(/%20/g, "+");
                if ((data.match(/%3E/g) || []).length == 1) {
                  // Break loop if l2 is selected. No need to add l3s now.
                  categoryShopVars = data;
                  l2Selected = true;
                } else {
                  categoryShopVars == ""
                    ? (categoryShopVars = data)
                    : (categoryShopVars += "|" + data);
                }
                mainurl = this.getMainUrl(orignalData);
              }
            });
            break;
          case "price":
            filterUrl += "&" + key + "=" + array[filterType][key];
            break;
          case "currency":
            filterUrl += "&" + key + "=" + array[filterType][key];
            break;
          case "sortBy":
            filterUrl += "&sort_by=" + array[filterType][key];
            break;
          case "productType": {
            const product = array[filterType];
            productVars = "";
            Object.keys(product).map(data => {
              if (product[data]) {
                data = encodeURIComponent(data).replace(/%20/g, "+");
                data = data.replace("pb_", "");
                productVars == ""
                  ? (productVars = data)
                  : (productVars += "|" + data);
              }
            });
            break;
          }
          case "availableDiscount": {
            const discount = array[filterType];
            discountVars = "";
            Object.keys(discount).map(data => {
              if (discount[data].isChecked) {
                data = encodeURIComponent(data).replace(/%20/g, "+");
                data = data.replace("disc_", "");
                discountVars == ""
                  ? (discountVars = data)
                  : (discountVars += "|" + data);
              }
            });
            break;
          }
          default:
            break;
        }
      });
    });
    colorVars != "" ? (filterUrl += "&current_color=" + colorVars) : "";
    materialVars != ""
      ? (filterUrl += "&current_material=" + materialVars)
      : "";
    sizeVars != "" ? (filterUrl += "&available_size=" + sizeVars) : "";
    categoryShopVars != ""
      ? (filterUrl += "&category_shop=" + categoryShopVars)
      : "";
    productVars != "" ? (filterUrl += "&product_type=" + productVars) : "";
    discountVars != ""
      ? (filterUrl += "&available_discount=" + discountVars)
      : "";
    if (mainurl == "" || !mainurl) {
      mainurl = history.location.pathname;
    }
    history.replace(mainurl + "?source=plp" + filterUrl, {});

    const currentCategoryShop = encodeURIComponent(categoryShop || "").replace(
      /%20/g,
      "+"
    );
    const isUpdateTemplate = currentCategoryShop !== categoryShopVars;
    this.updateDataFromAPI(load, currency, isUpdateTemplate);
  };

  createUrlfromFilterForCategory = (load?: any, currency?: string) => {
    const array = this.state.filter;
    const { history } = this.props;

    const urlParams = new URLSearchParams(history.location.search);
    const categoryShop = urlParams.get("category_shop");

    let filterUrl = "",
      categoryKey: any,
      mainurl: string | undefined = "",
      colorVars = "",
      materialVars = "",
      sizeVars = "",
      categoryShopVars = "",
      productVars = "",
      discountVars = "";
    Object.keys(array).map((filterType, i) => {
      Object.keys(array[filterType]).map((key, i) => {
        switch (filterType) {
          case "currentColor":
            if (
              array[filterType][key].value &&
              array[filterType][key].isChecked
            ) {
              colorVars == ""
                ? (colorVars = array[filterType][key].value)
                : (colorVars += "|" + array[filterType][key].value);
            }
            break;
          case "currentMaterial":
            if (
              array[filterType][key].value &&
              array[filterType][key].isChecked
            ) {
              materialVars == ""
                ? (materialVars = array[filterType][key].value)
                : (materialVars += "|" + array[filterType][key].value);
            }
            break;
          case "availableSize":
            if (
              array[filterType][key].value &&
              array[filterType][key].isChecked
            ) {
              sizeVars == ""
                ? (sizeVars = array[filterType][key].value)
                : (sizeVars += "|" + array[filterType][key].value);
            }
            break;
          case "categoryShop":
            categoryKey = array[filterType][key];
            let l2Selected = false;
            Object.keys(categoryKey).map(data => {
              if (categoryKey[data] && !l2Selected) {
                const orignalData = data;
                data = encodeURIComponent(data).replace(/%20/g, "+");
                if ((data.match(/%3E/g) || []).length == 1) {
                  // Break loop if l2 is selected. No need to add l3s now.
                  categoryShopVars = data;
                  l2Selected = true;
                } else {
                  categoryShopVars == ""
                    ? (categoryShopVars = data)
                    : (categoryShopVars += "|" + data);
                }
                mainurl = this.getMainUrl(orignalData);
              }
            });
            break;
          case "price":
            filterUrl += "&" + key + "=" + array[filterType][key];
            break;
          case "currency":
            filterUrl += "&" + key + "=" + array[filterType][key];
            break;
          case "sortBy":
            filterUrl += "&sort_by=" + array[filterType][key];
            break;
          case "productType": {
            const product = array[filterType];
            productVars = "";
            Object.keys(product).map(data => {
              if (product[data]) {
                data = encodeURIComponent(data).replace(/%20/g, "+");
                data = data.replace("pb_", "");
                productVars == ""
                  ? (productVars = data)
                  : (productVars += "|" + data);
              }
            });
            break;
          }
          case "availableDiscount": {
            const discount = array[filterType];
            discountVars = "";
            Object.keys(discount).map(data => {
              if (discount[data].isChecked) {
                data = encodeURIComponent(data).replace(/%20/g, "+");
                data = data.replace("disc_", "");
                discountVars == ""
                  ? (discountVars = data)
                  : (discountVars += "|" + data);
              }
            });
            break;
          }
          default:
            break;
        }
      });
    });
    categoryShopVars != ""
      ? (filterUrl += "&category_shop=" + categoryShopVars)
      : "";
    // colorVars != "" ? (filterUrl += "&current_color=" + colorVars) : "";
    // materialVars != ""
    // ? (filterUrl += "&current_material=" + materialVars)
    // : "";
    // sizeVars != "" ? (filterUrl += "&available_size=" + sizeVars) : "";
    // productVars != "" ? (filterUrl += "&product_type=" + productVars) : "";
    // discountVars != ""
    //   ? (filterUrl += "&available_discount=" + discountVars)
    //   : "";
    if (mainurl == "" || !mainurl) {
      mainurl = history.location.pathname;
    }
    history.replace(mainurl + "?source=plp" + filterUrl, {});

    const currentCategoryShop = encodeURIComponent(categoryShop || "").replace(
      /%20/g,
      "+"
    );
    const isUpdateTemplate = currentCategoryShop !== categoryShopVars;
    this.updateDataFromAPI(load, currency, isUpdateTemplate);
  };

  onchangeRange = (value: any) => {
    if (value[0] == value[1]) return false;
    this.setState({
      rangevalue: [value[0], value[1]]
    });
  };
  prevScroll = 0;

  afterChangeValue = (value: any) => {
    if (value[0] == value[1]) return false;
    const { filter } = this.state;
    filter.price["min_price"] = value[0];
    filter.price["max_price"] = value[1];
    this.setState({
      filter: filter,
      rangevalue: [value[0], value[1]]
    });
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({
        event: "Filter used",
        "Filter type": "Price",
        "Filter value": value[0] + "-" + value[1]
      });
    }
    this.createUrlfromFilter();
  };

  handleScroll = (event: any) => {
    const windowHeight =
      "innerHeight" in window
        ? window.innerHeight
        : document.documentElement.offsetHeight;
    const body = document.body;
    const html: any = document.getElementById("product_images");
    // const filter = document.getElementById("filter_by");
    const innerfilter: any = document.getElementById("inner_filter");
    const docHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
    const windowBottom = windowHeight + window.pageYOffset;
    //new speed controller
    if (!this.props.mobile) {
      const value = innerfilter.scrollTop;
      if (this.state.scrolllastvalue < window.scrollY) {
        innerfilter.scrollTo(0, value + 4);
        this.setState({
          scrolllastvalue: window.scrollY
        });
      } else {
        innerfilter.scrollTo(0, value - 4);
        this.setState({
          scrolllastvalue: window.scrollY
        });
      }
    }

    // html.clientHeight <= (window.pageYOffset + window.innerHeight-100)
    if (
      windowBottom + 2000 >= docHeight &&
      this.state.scrollload &&
      this.state.flag
    ) {
      this.appendData();
    }

    // to check if scrolling down
    if (this.props.mobile) {
      const scroll = window.pageYOffset || document.documentElement.scrollTop;
      if (this.prevScroll < scroll - 5) {
        if (!this.props.scrollDown) {
          this.props.updateScrollDown(true);
        }
      } else if (this.prevScroll > scroll || scroll === 0) {
        if (this.props.scrollDown) {
          this.props.updateScrollDown(false);
        }
      }
      this.prevScroll = scroll;
    }
    !this.props.mobile && this.updateTotalHeight();
  };
  createList = (plpList: any, openCat: boolean) => {
    if (!plpList.results.facets.categoryShop) return false;
    const { currency } = this.props;
    const { filter } = this.state;
    const minMaxvalue: any = [];
    let currentRange: any = [];
    this.createFilterfromUrl(openCat);
    const pricearray: any = [],
      currentCurrency =
        "price" +
        currency[0].toUpperCase() +
        currency.substring(1).toLowerCase();
    plpList.results.filtered_facets[currentCurrency]?.map(function(a: any) {
      pricearray.push(+a[0]);
    });
    if (pricearray.length > 0) {
      minMaxvalue.push(
        pricearray.reduce(function(a: any, b: any) {
          return Math.min(a, b);
        })
      );
      minMaxvalue.push(
        pricearray.reduce(function(a: any, b: any) {
          return Math.max(a, b);
        })
      );
    }

    if (filter.price.min_price) {
      currentRange.push(filter.price.min_price);
      currentRange.push(filter.price.max_price);
    } else {
      currentRange = minMaxvalue;
    }
    this.setState(
      {
        rangevalue: currentRange,
        initialrangevalue: {
          min: minMaxvalue[0],
          max: minMaxvalue[1]
        },
        disableSelectedbox: false,
        scrollload: true,
        totalItems: plpList.count,
        banner: plpList.results.banner
      },
      () => {
        if (!this.state.scrollView && this.props.history.action === "POP") {
          this.checkForProductScroll();
        }
        window.scrollTo(0, 0);
      }
    );
  };

  appendData = (plpMobileView?: string) => {
    const minMaxvalue: any = [];
    let currentRange: any = [];
    const {
      nextUrl,
      // mobile,
      listdata,
      currency,
      updateProduct,
      changeLoader,
      previousUrl
    } = this.props;
    const { filter } = this.state;
    if (nextUrl || (previousUrl && plpMobileView)) {
      this.setState(
        {
          disableSelectedbox: true,
          flag: false
        },
        () => {
          changeLoader?.(true);
          let filterUrl = plpMobileView && previousUrl ? previousUrl : nextUrl;
          // let filterUrl = "?" + nextUrl.split("?")[1];
          // const pageSize = mobile ? 10 : 20;
          const pageSize = 40;
          const urlParams = new URLSearchParams(
            this.props.history.location.search
          );
          const categoryShopL1 = urlParams
            .get("category_shop")
            ?.split(">")[1]
            ?.trim();

          if (plpMobileView && filterUrl) {
            const url = new URL(filterUrl);
            url.searchParams.set("page", "1");
            url.searchParams.set("page_size", "40");
            filterUrl = "?" + url.toString().split("?")[1];
          } else {
            filterUrl = "?" + filterUrl?.split("?")[1];
            const isPageSizeExist = new URLSearchParams(filterUrl).get(
              "page_size"
            );
            if (!isPageSizeExist) {
              filterUrl = filterUrl + `&page_size=${pageSize}`;
            }
          }

          updateProduct(filterUrl, listdata, plpMobileView)
            .then(plpList => {
              changeLoader?.(false);
              try {
                productImpression(
                  plpList,
                  categoryShopL1 || "PLP",
                  this.props.currency,
                  plpList.results.data.length,
                  undefined,
                  this.state.filter.price.max_price &&
                    this.state.filter.price.min_price
                    ? `${this.state.filter.price.max_price} - ${this.state.filter.price.min_price}`
                    : undefined
                );
              } catch (e) {
                console.log("plp GA error====", e);
              }
              // this.createFilterfromUrl(false);
              const pricearray: any = [],
                currentCurrency =
                  "price" +
                  currency[0].toUpperCase() +
                  currency.substring(1).toLowerCase();
              plpList.results.filtered_facets[currentCurrency]?.map(function(
                a: any
              ) {
                pricearray.push(+a[0]);
              });
              if (pricearray.length > 0) {
                minMaxvalue.push(
                  pricearray.reduce(function(a: number, b: number) {
                    return Math.min(a, b);
                  })
                );
                minMaxvalue.push(
                  pricearray.reduce(function(a: number, b: number) {
                    return Math.max(a, b);
                  })
                );
              }

              if (filter.price.min_price) {
                currentRange.push(filter.price.min_price);
                currentRange.push(filter.price.max_price);
              } else {
                currentRange = minMaxvalue;
              }

              this.setState(
                {
                  rangevalue: currentRange,
                  initialrangevalue: {
                    min: minMaxvalue[0],
                    max: minMaxvalue[1]
                  },
                  disableSelectedbox: false,
                  scrollload: true,
                  flag: true,
                  totalItems: plpList.count
                },
                () => {
                  if (
                    !this.state.scrollView &&
                    this.state.shouldScroll &&
                    this.props.history.action === "POP"
                  ) {
                    this.handleProductSearch();
                  }
                }
              );
              // this.props.updateFacets(
              //   this.getSortedFacets(plpList.results.facets)
              // );
            })
            .catch(err => {
              console.log("PLP appendata error", err);
            });

          // if (categoryShop) {
          //   fetchPlpTemplates(categoryShop);
          // }
        }
      );
    }
  };

  updateDataFromAPI = (
    onload?: string,
    currency?: string,
    isUpdateTemplate?: boolean
  ) => {
    const {
      mobile,
      fetchPlpProducts,
      history,
      changeLoader,
      fetchPlpTemplates
    } = this.props;
    if (!onload && mobile && !this.state.isPopupOpen) {
      // return true;
    }
    changeLoader?.(true);
    const url = decodeURI(history.location.search);
    let filterUrl = "?" + url.split("?")[1];
    const urlParams = new URLSearchParams(history.location.search);
    const categoryShop = urlParams.get("category_shop");
    const categoryShopL1 = urlParams
      .get("category_shop")
      ?.split(">")[1]
      ?.trim();
    // const pageSize = mobile ? 10 : 20;
    const pageSize = 40;
    const isPageSizeExist = new URLSearchParams(filterUrl).get("page_size");

    if (!isPageSizeExist) {
      filterUrl = filterUrl + `&page_size=${pageSize}`;
    }
    fetchPlpProducts(filterUrl, currency).then(plpList => {
      productImpression(
        plpList,
        categoryShopL1 || "PLP",
        this.props.currency,
        undefined,
        undefined,
        this.state.filter.price.max_price && this.state.filter.price.min_price
          ? `${this.state.filter.price.max_price} - ${this.state.filter.price.min_price}`
          : undefined
      );
      changeLoader?.(false);
      this.createList(plpList, false);
      this.props.updateFacets(this.getSortedFacets(plpList.results.facets));
      // fixes for filter hide issue on safari
      setTimeout(() => {
        window.scrollTo(50, 0);
      }, 500);
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 1000);
      // end fixes for filter hide issue on safari
    });

    if (categoryShop && isUpdateTemplate) {
      fetchPlpTemplates(categoryShop);
    }
  };

  stateChange = (location: any, action: any) => {
    if (action == "REPLACE") {
      this.props.onStateChange?.();
    } else if (
      action == "PUSH" &&
      location.pathname.includes("/catalogue/category/")
    ) {
      this.setState(
        {
          filter: {
            currentColor: {},
            availableSize: {},
            categoryShop: {},
            price: {},
            currency: {},
            sortBy: {},
            productType: {},
            availableDiscount: {},
            currentMaterial: {}
          }
        },
        () => {
          this.props.updateOnload(true);
          this.props.mobile
            ? this.updateDataFromAPI("load", undefined, true)
            : this.updateDataFromAPI(undefined, undefined, true);
        }
      );
    }
  };
  updateTotalHeight = (): void => {
    // function to maintain filter bottom space
    const windowScroll = window?.scrollY || 0;
    const annBar = document?.getElementById("announcement_bar");
    const annHeight = (annBar as HTMLElement)?.clientHeight || 0;
    const myHeader = document.getElementById("myHeader");
    const headerHeight = (myHeader as HTMLElement)?.clientHeight || 0;
    const secondaryHeader = document.getElementById("secondaryHeader");
    const timeDiv = document.getElementById("ge-timer");
    const timeDivHeight = (timeDiv as HTMLElement)?.clientHeight || 0;
    const secondaryHeaderHeight =
      (secondaryHeader as HTMLElement)?.clientHeight || 0;

    const adjustedAnnHeight =
      windowScroll > annHeight ? -8 : annHeight - windowScroll;
    const totalHeight =
      adjustedAnnHeight + headerHeight + secondaryHeaderHeight + timeDivHeight;

    if (this.state.totalHeight !== totalHeight) {
      this.setState({
        totalHeight
      });
    }
  };

  sendDataToParent = (): void => {
    const uniqueData: any = Array.from(
      new Map(
        this.productData
          .filter((item: any) => item[1]) // Filter out items with empty image
          .map((item: any) => [item[0], item])
      ).values()
    ).map((item: any) => ({
      name: item[0],
      image: item[1],
      url: null,
      checked: this.state.filter.productType["pb_" + item[0]] ?? false
    }));
    this.props.onSendData?.(uniqueData);
  };

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll, { passive: true });
    !this.props.mobile && this.updateTotalHeight();
    this.props.updateScrollDown(false);
    this.unlisten = this.props.history.listen(this.stateChange);
    this.sendDataToParent();

    const header = document.getElementById("myHeader");
    const sticky = (header as HTMLElement)?.offsetTop;
    const filterMenu = document.getElementById("filter_by");
    const filterMenuHeader = document.getElementById("filter-menu-header");
    const timer = this.props.showTimer;
    if (window?.pageYOffset > sticky) {
      if (filterMenu) {
        const tim = timer !== undefined ? timer : this.props.showTimer;

        if (tim) {
          (filterMenu as HTMLElement).style.top = "130px";
        } else {
          (filterMenu as HTMLElement).style.top = "100px";
        }
      }
      if (filterMenuHeader) {
        const tim = timer !== undefined ? timer : this.props.showTimer;

        if (tim) {
          (filterMenuHeader as HTMLElement).style.top = "90px";
        } else {
          (filterMenuHeader as HTMLElement).style.top = "50px";
        }
      }
    } else {
      if (filterMenu) {
        const tim = timer !== undefined ? timer : this.props.showTimer;

        if (tim) {
          (filterMenu as HTMLElement).style.top = "180px";
        } else {
          (filterMenu as HTMLElement).style.top = "160px";
        }
      }
      if (filterMenuHeader) {
        const tim = timer !== undefined ? timer : this.props.showTimer;

        if (tim) {
          (filterMenuHeader as HTMLElement).style.top = "130px";
        } else {
          (filterMenuHeader as HTMLElement).style.top = "90px";
        }
      }
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevProps.data !== this.props.data) {
      this.timeout = setTimeout(() => this.sendDataToParent(), 1000);
      this.sendDataToParent();
    }
    if (!this.props.mobile) {
      const annBar = document.getElementById("announcement_bar");
      const annHeight = (annBar as HTMLElement)?.clientHeight || 0;
      if (annHeight !== prevState.totalHeight) {
        this.updateTotalHeight();
      }
    }
  }

  UNSAFE_componentWillReceiveProps = (nextProps: Props) => {
    if (
      nextProps.onload &&
      nextProps.facets.categoryShop &&
      this.props.updateFacets
    ) {
      this.props.updateOnload(false);
      this.createList(nextProps.data, true);
      this.props.updateFacets(this.getSortedFacets(nextProps.facets));
      this.handleAnimation("category", false);

      this.setState({
        activeindex: 0,
        showFilterByDiscountMenu: false,
        showProductFilter: false,
        showmenulevel1: false
      });
    }
    if (
      this.props.currency != nextProps.currency ||
      this.props.customerGroup != nextProps.customerGroup
    ) {
      const { filter } = this.state;
      if (filter.sortBy && filter.sortBy["sortBy"] == "discount") {
        filter.sortBy = {};
      }
      filter.price = {};
      this.setState(
        {
          filter
        },
        () => {
          this.createUrlfromFilter(undefined, nextProps.currency);
          nextProps.mobile
            ? this.updateDataFromAPI("load", nextProps.currency)
            : "";
        }
      );
    }
    //Commented: for not closing filter section on clear all filteres
    // if (
    //   Object.entries(vars).length === 2 &&
    //   Object.entries(vars).filter(
    //     e => e[0] === "source" || e[0] === "category_shop"
    //   ).length === 2
    // ) {
    //   this.setState({
    //     activeindex: 0,
    //     showFilterByDiscountMenu: false,
    //     showProductFilter: false,
    //     showmenulevel1: false
    //   });
    // }

    if (this.props.mobileMenuOpenState !== nextProps.mobileMenuOpenState) {
      this.props.onChangeFilterState(false, false);
    }
  };

  getPdpProduct = (): any => {
    let hasPdpProductDetails = false;
    let pdpProductDetails;
    if (localStorage.getItem("pdpProductScroll")) {
      hasPdpProductDetails = true;
      const item: any = localStorage.getItem("pdpProductScroll");
      pdpProductDetails = JSON.parse(item);
    }
    return { hasPdpProductDetails, pdpProductDetails };
  };

  checkForProductScroll() {
    const currentTimeStamp = new Date().getTime();
    let shouldScroll;
    let pdpProductScroll;
    const hasPdpScrollableProduct = this.getPdpProduct();
    if (hasPdpScrollableProduct.hasPdpProductDetails) {
      pdpProductScroll = hasPdpScrollableProduct.pdpProductDetails;
      if (pdpProductScroll) {
        const pdpTimeStamp = new Date(pdpProductScroll.timestamp).getTime();
        shouldScroll = currentTimeStamp - pdpTimeStamp < 8000;
        this.setState(
          {
            shouldScroll: shouldScroll
          },
          () => {
            if (this.state.shouldScroll) {
              this.handleProductSearch();
            }
          }
        );
      }
    }
  }

  handleProductSearch() {
    const pdpProductScrollId = this.getPdpProduct().pdpProductDetails.id;
    if (document.getElementById(pdpProductScrollId)) {
      setTimeout(() => {
        const element = document.getElementById(pdpProductScrollId);
        element ? element.scrollIntoView(true) : "";
        window.scrollBy(0, -150);
        localStorage.removeItem("pdpProductScroll");
      }, 1000);
      this.setState({
        scrollView: true
      });
    } else {
      this.appendData();
    }
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
    this.unlisten();
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  getSortedFacets = (facets: any): any => {
    if (facets.length == 0) return false;
    const categories: any = [],
      subCategories: any = [],
      categoryNames: any = [],
      categoryObj: any = {};
    const { filter } = this.state;

    let selectIndex: any = -1,
      check = "";

    if (facets.categoryShop && facets.categoryShop.length > 0) {
      facets.categoryShop.map((v: any, i: number) => {
        const baseCategory = v[0];
        let categoryUrl: any = "";
        if (facets.categoryShopDetail && facets.categoryShopDetail.length > 0) {
          categoryUrl = facets.categoryShopDetail.filter(function(
            k: any,
            i: any
          ) {
            return Object.prototype.hasOwnProperty.call(k, baseCategory);
          })[0];
        }
        if (categoryUrl) {
          v.push(categoryUrl[baseCategory]);
        }
        const labelArr = baseCategory.split(">");
        labelArr.shift();
        if (labelArr.length > 1) {
          //categories having child categories
          categories.push(v);
          if (categoryNames.indexOf(labelArr[0].trim()) == -1) {
            categoryNames.push(labelArr[0].trim());
          }
        } else if (labelArr.length == 1) {
          subCategories.push(v);
        }
      });

      facets.categories = categories;
      facets.subCategories = subCategories;
    }

    for (let i = 0; i < categoryNames.length; i++) {
      facets.subCategories.map(function(v: any, k: any) {
        if (v[0].indexOf(categoryNames[i]) != -1) {
          facets.categories.push(v);
          facets.subCategories.splice(k, 1);
        }
      });
    }

    facets.categories.map((data: any, i: number) => {
      const tempKey = data[0].split(">")[1].trim(),
        viewData = data[0].split(">");
      viewData.length > 2 ? viewData.pop() : "";
      categoryObj[tempKey]
        ? false
        : (categoryObj[tempKey] = [["View all", viewData.join(">").trim()]]);
      if (data[0].split(">")[2]) {
        categoryObj[tempKey].push([data[0].split(">")[2].trim()].concat(data));
      }
    });

    // code for setting all values of filter false
    facets.subCategories.map((data: any, i: number) => {
      const key = data[0].split(">")[1].trim();
      if (filter.categoryShop[key]) {
        // check that view all is clicked or not by (arrow key >)
        if (filter.categoryShop[key][data[0]]) {
          // nestedList[1].split('>').length == 2 ? check = data : '';
          selectIndex = key;
          // this.state.old_selected_category = key;
          // filter.categoryShop[key][data[0]] = false
        }
      } else {
        filter.categoryShop[key] = {};
        filter.categoryShop[key][data[0]] = false;
      }
    });
    let oldSelectedCategory: any = this.state.oldSelectedCategory;
    // code for setting  all values of filter is false
    Object.keys(categoryObj).map((data, i) => {
      categoryObj[data].map((nestedList: any, j: number) => {
        if (filter.categoryShop[data]) {
          // check that view all is clicked or not by (arrow key >)
          if (filter.categoryShop[data][nestedList[1]]) {
            nestedList[1].split(">").length == 2 ? (check = data) : "";
            selectIndex = data;
            oldSelectedCategory = data;
          } else {
            if (check == data) {
              filter.categoryShop[data][nestedList[1]] = true;
              selectIndex = data;
            } else {
              filter.categoryShop[data][nestedList[1]] = false;
            }
          }
        } else {
          filter.categoryShop[data] = {};
          filter.categoryShop[data][nestedList[1]] = false;
        }
      });
    });
    // code for all product_by filter false
    if (facets.categoryProductTypeMapping) {
      Object.keys(facets.categoryProductTypeMapping).map((level4: any) => {
        facets.categoryProductTypeMapping[level4].map((productBy: any) => {
          if (!("pb_" + productBy[0] in filter.productType)) {
            filter.productType["pb_" + productBy[0]] = false;
          }
        });
      });
    }
    // code for set active open state and set selected old value
    if (!oldSelectedCategory) {
      Object.keys(filter.categoryShop).map((level2: any, i: number) => {
        Object.keys(filter.categoryShop[level2]).map(
          (level3: any, j: number) => {
            if (filter.categoryShop[level2][level3]) {
              selectIndex = level2;
              oldSelectedCategory = level2.split(">")[0];
            }
          }
        );
      });
    }

    // Remove unwanted filters
    const filterTypes = [
      "currentColor",
      "currentMaterial",
      "availableSize",
      // "availableDiscount",
      "productType"
    ];
    for (let i = 0; i < filterTypes.length; i++) {
      const allOptions: any = [];
      const filterBackup = structuredClone(filter[filterTypes[i]]);
      if (filterTypes[i] in facets) {
        for (let j = 0; j < facets[filterTypes[i]].length; j++) {
          allOptions.push(facets[filterTypes[i]][j][0]);
        }
        if (allOptions.length > 0) {
          Object.keys(filterBackup).map((filterObject: any, j: number) => {
            if (!allOptions.includes(filterObject)) {
              delete filter[filterTypes[i]][filterObject];
            }
          });
        }
      }
    }

    this.handleAnimation(selectIndex + "l", false, true);
    this.setState({
      activeindex2: selectIndex + "l",
      oldSelectedCategory: oldSelectedCategory,
      filter: filter
    });
    return { categoryObj: categoryObj, facets: facets };
  };

  onClickPlpBubbleL4 = (
    title: string,
    e: React.MouseEvent,
    isChecked: boolean
  ): void => {
    const key = `pb_${title}`;
    const { filter } = this.state;
    filter.productType[key] = isChecked;
    this.setState({
      filter: filter
    });
    this.createUrlfromFilter();
    e.stopPropagation();
  };

  onClickLevel4 = (event: any) => {
    const id = event.target.id;
    const { filter } = this.state;
    filter.productType[id] = event.target.checked;
    // this.old_level4Value = event.target.value;
    this.setState({
      filter: filter
    });
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({
        event: "Filter used",
        "Filter type": "Product Type",
        "Filter value": event.target.value
      });
    }
    this.createUrlfromFilter();
    event.stopPropagation();
  };

  onClickDiscount = (event: any) => {
    const id = event.target.id;
    const { filter } = this.state;
    filter.availableDiscount[id] = {
      isChecked: event.target.checked,
      value: event.target.value
    };
    // this.old_level4Value = event.target.value;
    this.setState(
      {
        filter
      },
      () => {
        this.createUrlfromFilter();
      }
    );
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({
        event: "Filter used",
        "Filter type": "Discount Type",
        "Filter value": event.target.value
      });
    }
    event.stopPropagation();
  };

  createProductType = (
    categoryObj: any,
    categorydata: any,
    filtered_facets: any
  ) => {
    const html = [];
    this.productData = [];
    const filteredProductType: any = [];
    if (!categoryObj) return false;
    const { filter } = this.state;
    Object.keys(categoryObj).map((data, i) => {
      categoryObj[data].map((nestedList: any, j: number) => {
        filter.categoryShop[data]
          ? filter.categoryShop[data][nestedList[1]]
            ? categorydata.categoryProductTypeMapping[nestedList[1]]?.map(
                (level4: any) => {
                  if (this.productData.indexOf(level4) == -1) {
                    this.productData.push(level4);
                  }
                }
              )
            : ""
          : "";
        filter.categoryShop[data]
          ? filter.categoryShop[data][nestedList[1]]
            ? filtered_facets.categoryProductTypeMapping[nestedList[1]]?.map(
                (level4: any) => {
                  if (filteredProductType.indexOf(level4[0]) == -1) {
                    filteredProductType.push(level4[0]);
                  }
                }
              )
            : ""
          : "";
      });
    });

    for (const prop in filter.productType) {
      if (
        !this.productData.some(
          ([name]: [string, string]) => name === prop.replace("pb_", "")
        )
      ) {
        filter.productType[prop] = false;
      }
    }
    html.push(
      <ul key="productType">
        <li>
          <ul className={styles.categorylabel}>
            {this.productData.map((level4: any) => {
              return (
                <li key={"pb_" + level4[0]}>
                  <CheckboxWithLabel
                    onChange={this.onClickLevel4}
                    id={"pb_" + level4[0]}
                    checked={
                      filter.productType["pb_" + level4[0]]
                        ? filter.productType["pb_" + level4[0]]
                        : false
                    }
                    value={"pb_" + level4[0]}
                    disabled={
                      filteredProductType?.filter(
                        (e: string[]) => e === level4[0]
                      ).length === 0
                    }
                    label={[
                      <label
                        key={"pb_" + level4[0]}
                        className={cs({
                          [styles.disableType]:
                            filteredProductType?.filter(
                              (e: string[]) => e === level4[0]
                            ).length === 0
                        })}
                        htmlFor={"pb_" + level4[0]}
                      >
                        {level4[0]}
                      </label>
                    ]}
                  />
                </li>
              );
            })}
          </ul>
        </li>
      </ul>
    );
    return html;
  };

  createDiscountType = (availableDiscount: any, filtered_facets: any) => {
    const html = [];
    const { filter } = this.state;
    if (!availableDiscount) return false;
    for (const prop in filter.availableDiscount) {
      if (
        this.props.facets &&
        this.props.facets.availableDiscount
          .map((discount: any) => discount[0])
          .indexOf(prop.replace("disc_", "")) == -1
      ) {
        // filter.availableDiscount[prop] = false;
      }
    }
    html.push(
      <ul key="discountType">
        <li>
          <ul className={styles.categorylabel}>
            {this.props.facets.availableDiscount.map((discount: any) => {
              return (
                <li key={discount[0]}>
                  <CheckboxWithLabel
                    onChange={this.onClickDiscount}
                    id={"disc_" + discount[0]}
                    checked={
                      filter.availableDiscount["disc_" + discount[0]]
                        ? filter.availableDiscount["disc_" + discount[0]]
                            .isChecked
                        : false
                    }
                    value={discount[1]}
                    disabled={
                      filtered_facets?.availableDiscount?.filter(
                        (e: string[]) => e[0] === discount[0]
                      ).length === 0
                    }
                    label={[
                      <label
                        className={cs({
                          [styles.disableType]:
                            filtered_facets?.availableDiscount?.filter(
                              (e: string[]) => e[0] === discount?.[0]
                            ).length === 0
                        })}
                        htmlFor={"disc_" + discount[0]}
                        key={"disc_" + discount[0]}
                      >
                        {discount[1]}
                      </label>
                    ]}
                  />
                </li>
              );
            })}
          </ul>
        </li>
      </ul>
    );

    return html;
  };

  createMaterial = (facets: any, filtered_facets: any) => {
    if (!facets?.currentMaterial || facets.length == 0) return false;
    const html: any = [];
    const { filter } = this.state;
    facets?.currentMaterial.map((data: any, i: number) => {
      const itemCount = data?.[1];
      html.push(
        <li className={styles.materiallabel} key={data?.[0]}>
          <CheckboxWithLabel
            id={data?.[0]}
            checked={
              filter?.currentMaterial[data[0]]
                ? filter?.currentMaterial[data[0]]?.isChecked
                : false
            }
            onChange={this.handleClickMaterial}
            value={data?.[0]}
            disabled={
              filtered_facets?.currentMaterial?.filter(
                (e: string[]) => e[0] === data[0]
              ).length === 0
            }
            className={cs(globalStyles.flex, globalStyles.gutterBetween)}
            label={[
              <label
                className={cs({
                  [styles.disableColors]:
                    filtered_facets?.currentMaterial?.filter(
                      (e: string[]) => e[0] === data?.[0]
                    ).length === 0
                })}
                htmlFor={data?.[0]}
                key={data?.[0]}
              >
                {data?.[0]}
              </label>
            ]}
            itemCount={itemCount}
          />
        </li>
      );
    });
    return html;
  };

  generateSubCatagory = (data: any, html: any) => {
    const name = data[0].split(">")[1].trim(),
      id = data[0].trim();
    const { filter } = this.state;
    html.push(
      <ul key={`subcategory-${name}`}>
        <li key={id}>
          <span
            className={
              this.state.showmenulevel2 && this.state.activeindex2 == name + "l"
                ? cs(styles.menulevel2, styles.menulevel2Open)
                : styles.menulevel2
            }
            onClick={() => {
              this.handleAnimation(
                name + "l",
                this.state.showmenulevel2 &&
                  this.state.activeindex2 == name + "l",
                true
              );
              this.Clickmenulevel2(name + "l");
            }}
          >
            {data[0].split(">")[1]}
          </span>
          <div
            id={`${name + "l"}`}
            className={
              this.state.showmenulevel2 && this.state.activeindex2 == name + "l"
                ? styles.showheader2
                : styles.hideDiv
            }
          >
            <ul className={styles.categorylabel}>
              <li>
                <CheckboxWithLabel
                  id={id}
                  disabled={this.state.disableSelectedbox}
                  checked={
                    filter.categoryShop[name]
                      ? filter.categoryShop[name][id]
                      : false
                  }
                  onChange={this.handleClickCategory}
                  value={data[0].split(">")[1].trim()}
                  name="View all"
                  label={[
                    <label key={id} htmlFor={id}>
                      View all
                    </label>
                  ]}
                />
              </li>
            </ul>
          </div>
        </li>
      </ul>
    );

    return html;
  };

  generateCatagory = (categoryObj: any, data: any, html: any) => {
    const { filter } = this.state;
    html.push(
      <ul key={`category-${data}`}>
        <li key={data + "l"}>
          <span
            className={
              this.state.showmenulevel2 && this.state.activeindex2 == data + "l"
                ? cs(styles.menulevel2, styles.menulevel2Open)
                : styles.menulevel2
            }
            onClick={() => {
              this.handleAnimation(
                `${data + "l"}`,
                this.state.showmenulevel2 &&
                  this.state.activeindex2 == data + "l",
                true
              );
              this.Clickmenulevel2(data + "l");
            }}
          >
            {data}
          </span>
          <div
            id={`${data + "l"}`}
            className={
              this.state.showmenulevel2 && this.state.activeindex2 == data + "l"
                ? styles.showheader2
                : styles.hideDiv
            }
          >
            <ul className={styles.categorylabel}>
              {categoryObj[data].map((nestedList: any, j: number) => {
                return (
                  <li key={nestedList[1]}>
                    <CheckboxWithLabel
                      id={nestedList[1]}
                      disabled={this.state.disableSelectedbox}
                      checked={
                        filter.categoryShop[data]
                          ? filter.categoryShop[data][nestedList[1]]
                          : false
                      }
                      onChange={e => {
                        this.handleClickCategory(e);
                        this.clearFilter(e, "productType");
                      }}
                      value={data}
                      name={nestedList[0]}
                      label={[
                        <label key={nestedList[1]} htmlFor={nestedList[1]}>
                          {nestedList[0]}
                        </label>
                      ]}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        </li>
      </ul>
    );
    return html;
  };

  createCatagoryFromFacets = (categoryObj: any, categorydata: any) => {
    let html: any = [];
    if (!categoryObj) return false;
    const cat = categorydata.categories
      .concat(categorydata.subCategories)
      .filter(function(a: any) {
        return a[0].split(">").length == 2;
      });

    const subcat = cat.sort(function(a: any, b: any) {
      return +a[1] - +b[1];
    });
    subcat.map((data: any) => {
      for (const key in categoryObj) {
        if (data[0].endsWith(key)) {
          html = this.generateCatagory(categoryObj, key, html);
        }
      }
      categorydata.subCategories.map((sub: any) => {
        if (data[0].indexOf(sub[0]) > -1) {
          html = this.generateSubCatagory(sub, html);
        }
      });
    });
    return html;
  };

  handleClickCategory = (event: any) => {
    let checkallSelectedValue;
    const categoryObj = this.state.filter.categoryShop,
      viewData = event.target.id.split(">");
    viewData.length > 2 ? viewData.pop() : "";
    const { filter } = this.state;
    //code for checked view all true
    if (event.target.name.indexOf("View all") > -1 && !event.target.checked) {
      event.target.checked = true;
      return false;
    }

    // code for checking old category is clicked or not
    if (
      this.state.oldSelectedCategory != event.target.value &&
      this.state.oldSelectedCategory != ""
    ) {
      if (Object.keys(filter.categoryShop).length > 0) {
        for (const prop in filter.categoryShop[
          this.state.oldSelectedCategory
        ]) {
          filter.categoryShop[this.state.oldSelectedCategory][prop] = false;
        }
      }
      for (const prop in filter.productType) {
        filter.productType[prop] = false;
      }
      if (filter.sortBy["sortBy"] == "discount") {
        filter.sortBy = {};
      }
      // clear filters
      this.clearFilter(undefined, "all", true);
      this.setState({
        activeindex: 0,
        showFilterByDiscountMenu: false,
        showProductFilter: false,
        showmenulevel1: false
      });
    }

    // code to tick all when clicked on viewall / normal checkbox
    if (event.target.name.indexOf("View all") > -1) {
      filter.categoryShop[event.target.value] = Object.assign(
        {},
        filter.categoryShop[event.target.value]
      );
      Object.keys(filter.categoryShop).map(key => {
        if (key == event.target.value) {
          Object.keys(filter.categoryShop[key]).map(product => {
            filter.categoryShop[key][product] = event.target.checked;
          });
        }
      });
      this.setState({
        isViewAll: true
      });
    } else {
      filter.categoryShop[event.target.value] = Object.assign(
        {},
        filter.categoryShop[event.target.value]
      );
      filter.categoryShop[event.target.value][event.target.id] =
        event.target.checked;
      checkallSelectedValue = Object.keys(
        filter.categoryShop[event.target.value]
      ).every(data => {
        if (data.split(">").length < 3) {
          return true;
        } else {
          return filter.categoryShop[event.target.value][data];
        }
      });
      for (const prop in filter.productType) {
        if (this.productData.indexOf(prop.replace("pb_", "")) == -1) {
          filter.productType[prop] = false;
        }
      }
      filter.categoryShop[event.target.value][
        viewData.join(">").trim()
      ] = checkallSelectedValue ? true : false;
      this.setState({
        isViewAll: checkallSelectedValue
      });
    }

    const atleastOneSelected = Object.keys(categoryObj).every((data, i) => {
      const nestedVal = Object.keys(categoryObj[data]).every((nestedLst, j) => {
        return !filter.categoryShop[data][nestedLst];
      });
      return nestedVal;
    });
    if (atleastOneSelected) {
      filter.categoryShop[event.target.value][event.target.id] = true;
      event.target.checked = true;
      return false;
    }

    this.setState({
      filter: filter,
      oldSelectedCategory: event.target.value
    });
    const userConsent = CookieService.getCookie("consent").split(",");
    const val =
      event.target.id.split(">")?.[2] !== undefined
        ? ` -${event.target.id.split(">")?.[2]}`
        : "";
    if (userConsent.includes(GA_CALLS)) {
      if (event.target.checked) {
        dataLayer.push({
          event: "Filter used",
          "Filter type": "Category",
          "Filter value": event.target.value + val
        });
      } else {
        dataLayer.push({
          event: "filter_remove",
          "Filter type": "Category",
          "Filter value": event.target.value + val
        });
      }
    }
    this.createUrlfromFilterForCategory();
    event.stopPropagation();
  };

  Clickmenulevel1 = (index: number) => {
    if (window.innerWidth <= 992) {
      index == this.state.activeindex
        ? this.setState({
            activeindex: index,
            openMenu: index,
            showmenulevel1: true,
            showFilterByDiscountMenu: false,
            showProductFilter: false
          })
        : this.setState({
            activeindex: index,
            openMenu: index,
            showmenulevel1: true,
            showFilterByDiscountMenu: false,
            showProductFilter: false
          });
      index == 0
        ? this.setState({
            categoryindex: index,
            categorylevel1: true,
            showFilterByDiscountMenu: false,
            showProductFilter: false
          })
        : this.setState({
            categoryindex: -1,
            categorylevel1: !this.state.categorylevel1,
            showFilterByDiscountMenu: false,
            showProductFilter: false
          });
    } else {
      index == this.state.activeindex
        ? this.setState({
            activeindex: index,
            openMenu: index,
            showmenulevel1: !this.state.showmenulevel1
          })
        : this.setState({
            activeindex: index,
            openMenu: index,
            showmenulevel1: true
          });
    }
  };
  handleAnimation = (id: string, isShow: boolean, isSubCat = false): void => {
    if (window.innerWidth >= 993) {
      const element = document.getElementById(id) as HTMLElement | null;
      const categoryElement = document.getElementById(
        "category"
      ) as HTMLElement | null;

      if (element) {
        if (!isShow) {
          if (isSubCat && categoryElement) {
            const categoryScrollHeight = categoryElement.scrollHeight || 0;
            const elementScrollHeight = element.scrollHeight || 0;
            categoryElement.style.maxHeight = `${categoryScrollHeight +
              elementScrollHeight}px`;
          }

          element.style.maxHeight =
            id !== "category" && element.scrollHeight
              ? `${element.scrollHeight}px`
              : "max-content";
        } else {
          element.style.maxHeight = "0px";
        }
      }
    }
  };

  ClickmenuCategory = (index: number) => {
    index == this.state.categoryindex
      ? this.setState({
          categoryindex: -1,
          categorylevel1: !this.state.categorylevel1
          // showmenulevel2: false
        })
      : this.setState({
          categoryindex: index,
          categorylevel1: true
          // showmenulevel2: false
        });
  };

  toggleFilterByDiscountMenu = () => {
    this.setState(prevState => {
      return {
        showFilterByDiscountMenu: !prevState.showFilterByDiscountMenu
      };
    });
  };

  mobileFilterByDiscountMenu = () => {
    this.setState({
      showFilterByDiscountMenu: true,
      categorylevel1: false,
      showmenulevel1: false
    });
  };

  Clickmenulevel2 = (index: number | string) => {
    index == this.state.activeindex2
      ? this.setState({
          activeindex2: index,
          showmenulevel2: !this.state.showmenulevel2
        })
      : this.setState({ activeindex2: index, showmenulevel2: true });
  };

  handleClickColor = (event: any) => {
    const { filter } = this.state;
    filter.currentColor[event.target.id] = {
      isChecked: event.target.checked,
      value: event.target.value
    };
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({
        event: "Filter used",
        "Filter type": "Color",
        "Filter value": event.target.value
      });
    }
    this.setState({
      filter: filter
    });
    this.createUrlfromFilter();
    event.stopPropagation();
  };

  handleClickMaterial = (event: any) => {
    const { filter } = this.state;
    filter.currentMaterial[event.target.id] = {
      isChecked: event.target.checked,
      value: event.target.value
    };

    this.setState({
      filter: filter
    });

    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({
        event: "Filter used",
        "Filter type": "Material",
        "Filter value": event.target.value
      });
    }
    this.createUrlfromFilter();
    event.stopPropagation();
  };

  createColorCheckbox = (facets: any, filtered_facets: any) => {
    if (!facets.currentColor || facets.length == 0) return false;
    const html: any = [];
    const { filter } = this.state;
    const { mobile } = this.props;
    facets.currentColor.map((data: any, i: number) => {
      const itemCount = data[1];
      const color: any = {
        "--my-color-var": "#" + data[0].split("-")[0]
      };
      const multicolorImage: any = {
        "--my-bg-image": `url(${multiColour})`
      };
      if (data[0].endsWith("Multi")) {
        html.push(
          <li
            className={cs(
              styles.colorlabel,
              styles.multicolorlabel,
              globalStyles.flex,
              globalStyles.guttereBetween
            )}
            key={data[0]}
          >
            <input
              type="checkbox"
              id={data[0]}
              checked={
                filter.currentColor[data[0]]
                  ? filter.currentColor[data[0]].isChecked
                  : false
              }
              onChange={this.handleClickColor}
              value={data[0]}
              disabled={
                filtered_facets?.currentColor?.filter(
                  (e: string[]) => e[0] === data[0]
                ).length === 0
              }
            />
            <label
              className={
                filtered_facets?.currentColor?.filter(
                  (e: string[]) => e[0] === data[0]
                ).length === 0
                  ? styles.disableColors
                  : ""
              }
              htmlFor={data[0]}
              style={multicolorImage}
            >
              {data[0].split("-")[1]}
            </label>
            {mobile && <span className={styles.itemCount}>{itemCount}</span>}
          </li>
        );
      } else {
        html.push(
          <li
            className={cs(
              styles.colorlabel,
              globalStyles.flex,
              globalStyles.guttereBetween
            )}
            key={data[0]}
          >
            <input
              type="checkbox"
              id={data[0]}
              checked={
                filter.currentColor[data[0]]
                  ? filter.currentColor[data[0]].isChecked
                  : false
              }
              onChange={this.handleClickColor}
              value={data[0]}
              disabled={
                filtered_facets?.currentColor?.filter(
                  (e: string[]) => e[0] === data[0]
                ).length === 0
              }
            />
            <label
              className={cs(
                {
                  [styles.disableColors]:
                    filtered_facets?.currentColor?.filter(
                      (e: string[]) => e[0] === data[0]
                    ).length === 0
                },
                { [styles.whiteTick]: data[0].endsWith("Whites") }
              )}
              htmlFor={data[0]}
              style={color}
            >
              {data[0].split("-")[1]}
            </label>
            {mobile && <span className={styles.itemCount}>{itemCount}</span>}
          </li>
        );
      }
    });
    return html;
  };

  handleClickSize = (event: any) => {
    const { filter } = this.state;
    filter.availableSize[event.target.value] = {
      isChecked: event.target.checked,
      value: event.target.value
    };
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({
        event: "Filter used",
        "Filter type": "Size​",
        "Filter value": event.target.value
      });
    }

    this.setState({
      filter: filter
    });
    this.createUrlfromFilter();
    event.stopPropagation();
  };

  deleteFilter = (event: any, key: string, value: any) => {
    const { filter } = this.state;
    if (key == "price") {
      filter[key] = {};
    } else if (key == "productType") {
      filter[key][value] = false;
    } else if (key == "availableDiscount") {
      filter[key][value] = {
        isChecked: false
      };
    } else {
      filter[key][value] = {
        isChecked: false
      };
    }
    this.setState(
      {
        filter: filter
      },
      () => {
        this.createUrlfromFilter();
      }
    );

    event.stopPropagation();
  };

  clearFilter = (event: any, key: string, ischange?: boolean) => {
    const elementCount: any = document.getElementById("currentFilter");
    const { filter } = this.state;
    if ((elementCount ? elementCount.childElementCount : null) == 0)
      return false;
    switch (key) {
      case "currentMaterial":
        filter[key] = {};
        break;
      case "currentColor":
        filter[key] = {};
        break;
      case "availableSize":
        filter[key] = {};
        break;
      case "price":
        // case 'min_price':
        //     case 'max_price':
        filter.price = {};
        break;
      case "currency":
        break;
      case "sortBy":
        filter.sortBy = {};
        break;

      case "productType":
        for (const prop in filter.productType) {
          filter.productType[prop] = false;
        }
        break;
      case "availableDiscount":
        for (const prop in filter.availableDiscount) {
          filter.availableDiscount[prop].isChecked = false;
        }
        break;
      case "all":
        filter.currentColor = {};
        filter.availableSize = {};
        filter.currentMaterial = {};
        filter.price = {};
        for (const prop in filter.productType) {
          filter.productType[prop] = false;
        }
        for (const prop in filter.availableDiscount) {
          filter.availableDiscount[prop].isChecked = false;
        }
        break;
      default:
        break;
    }
    if (!ischange) {
      this.createUrlfromFilter();
    }
    this.setState({
      filter: filter
    });
    if (key == "price" || key == "all") {
      this.setState({
        rangevalue: [
          this.state.initialrangevalue.min,
          this.state.initialrangevalue.max
        ]
      });
    }
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({
        event: "Filter used",
        "Filter type": key === "all" ? "Clear All" : "Clear",
        "Filter value": "NA"
      });
    }
    if (event) {
      event.stopPropagation();
    }
  };

  renderFilterList = (filterObj: any) => {
    const html = [];
    let filterCount = 0;
    Object.keys(filterObj).map(data => {
      switch (data) {
        case "currentColor":
        case "currentMaterial":
        case "availableSize": {
          const filter: any = [];
          Object.keys(filterObj[data]).map((data1, index) => {
            if (!filterObj[data][data1].isChecked) return false;
            filter.push(
              <li
                key={data1}
                className={cs(globalStyles.inlineFlex, styles.width100)}
              >
                <span className={cs(styles.filterItem, styles.ellipses)}>
                  {data == "currentColor"
                    ? filterObj[data][data1].value.toLowerCase() == "multicolor"
                      ? filterObj[data][data1].value
                      : filterObj[data][data1].value.split("-")[1]
                    : filterObj[data][data1].value}
                </span>
                <span
                  className={styles.filterItemCross}
                  onClick={e => this.deleteFilter(e, data, data1)}
                  data-color={data}
                >
                  <i
                    className={cs(
                      iconStyles.icon,
                      iconStyles.iconCrossNarrowBig,
                      styles.crossfontSize
                    )}
                  ></i>
                </span>
              </li>
            );
          });
          if (filter.length > 0) {
            html.push(
              <li key={data}>
                <span>
                  {data == "currentColor"
                    ? "Color"
                    : data == "currentMaterial"
                    ? "Material"
                    : "Size"}
                  :{" "}
                </span>
                <ul>{filter}</ul>
              </li>
            );
            filterCount += filter.length;
          }
          break;
        }
        case "categoryShop":
          // const { filter } = this.state;
          // const categoryObjArr = Object.values(filter.categoryShop);
          // const filteredArrays = categoryObjArr.filter(obj =>
          //   Object.values(obj as any).some(value => value === true)
          // );
          // const dataArray = Object.values(filteredArrays);
          // const categoryTrueValues: string[] = [];
          // dataArray.forEach(data => {
          //   Object.entries(data as any).forEach(([key, value]) => {
          //     if (value === true) {
          //       categoryTrueValues.push(key);
          //     }
          //   });
          // });
          // const CategoryFilterCount = categoryTrueValues.length;
          // if (CategoryFilterCount > 0) {
          //   filterCount += CategoryFilterCount;
          // }
          break;
        case "price": {
          const filter: any = [];
          if (Object.keys(filterObj[data]).length == 0) return false;
          filter.push(
            <li
              key={"price"}
              className={cs(globalStyles.inlineFlex, styles.width100)}
            >
              <span className={cs(styles.filterItem, styles.ellipses)}>
                {filterObj[data].min_price}-{filterObj[data].max_price}
              </span>
              <span
                className={styles.filterItemCross}
                onClick={e => this.deleteFilter(e, data, null)}
              >
                <i
                  className={cs(
                    iconStyles.icon,
                    iconStyles.iconCrossNarrowBig,
                    styles.crossfontSize
                  )}
                ></i>
              </span>
            </li>
          );
          if (filter.length > 0) {
            html.push(
              <li>
                <span>Price: </span>
                <ul>{filter}</ul>
              </li>
            );
            filterCount += filter.length;
          }
          break;
        }
        case "productType": {
          const filter: any = [];
          Object.keys(filterObj[data]).map((data1, index) => {
            if (!filterObj[data][data1]) return false;
            filter.push(
              <li
                key={data1}
                className={cs(globalStyles.inlineFlex, styles.width100)}
              >
                <span className={cs(styles.filterItem, styles.ellipses)}>
                  {data1.split("_")[1]}
                </span>
                <span
                  className={styles.filterItemCross}
                  onClick={e => this.deleteFilter(e, data, data1)}
                  data-product={data}
                >
                  <i
                    className={cs(
                      iconStyles.icon,
                      iconStyles.iconCrossNarrowBig,
                      styles.crossfontSize
                    )}
                  ></i>
                </span>
              </li>
            );
          });
          if (filter.length > 0) {
            html.push(
              <li key={data}>
                <span>Product Type: </span>
                <ul>{filter}</ul>
              </li>
            );
            filterCount += filter.length;
          }
          break;
        }
        case "availableDiscount": {
          const filter: any = [];
          Object.keys(filterObj[data]).map((data1, index) => {
            if (!filterObj[data][data1].isChecked) return false;
            filter.push(
              <li
                key={data1}
                className={cs(globalStyles.inlineFlex, styles.width100)}
              >
                <span className={cs(styles.filterItem, styles.ellipses)}>
                  {/* {self.props.facetObject.facets && self.props.facetObject.facets[data].map((discount) => {
                                if(discount[0] == data1.split('_')[1]){
                                    return discount[1];
                                }
                            })} */}
                  {/* {data1.split('_')[1]} */}
                  {filterObj[data][data1].value}
                </span>
                <span
                  className={styles.filterItemCross}
                  onClick={e => this.deleteFilter(e, data, data1)}
                  data-discount={data}
                >
                  <i
                    className={cs(
                      iconStyles.icon,
                      iconStyles.iconCrossNarrowBig,
                      styles.crossfontSize
                    )}
                  ></i>
                </span>
              </li>
            );
          });
          if (filter.length > 0) {
            html.push(
              <li key={data}>
                <span>Discount: </span>
                <ul>{filter}</ul>
              </li>
            );
            filterCount += filter.length;
          }
          break;
        }
      }
    });
    const name: any = "all";
    if (html.length > 0 || filterCount > 0) {
      html.push(
        <div data-name={name}>
          <span
            onClick={e => this.clearFilter(e, "all")}
            className={styles.plp_filter_sub}
          >
            Clear All
          </span>
        </div>
      );
      this.props.setFilterCount?.(filterCount);
    } else {
      this.props.setFilterCount?.(0);
    }

    return html;
  };

  createSizeCheckbox = (facets: any, filtered_facets: any) => {
    if (facets.length == 0) return false;
    const html: any = [];
    const { filter } = this.state;
    const { mobile } = this.props;
    facets.availableSize.map((data: any, i: number) => {
      const itemCount = data?.[1];
      html.push(
        <>
          {mobile ? (
            <li className={styles.materiallabel} key={data?.[0]}>
              <CheckboxWithLabel
                id={data?.[0]}
                checked={
                  filter?.availableSize[data[0]]
                    ? filter?.availableSize[data[0]]?.isChecked
                    : false
                }
                onChange={this.handleClickSize}
                value={data?.[0]}
                disabled={
                  filtered_facets?.availableSize?.filter(
                    (e: string[]) => e[0] === data[0]
                  ).length === 0
                }
                className={cs(globalStyles.flex, globalStyles.gutterBetween)}
                label={[
                  <label
                    className={cs({
                      [styles.disableSize]:
                        filtered_facets?.availableSize?.filter(
                          (e: string[]) => e[0] === data?.[0]
                        ).length === 0
                    })}
                    htmlFor={data?.[0]}
                    key={data?.[0]}
                  >
                    {data?.[0]}
                  </label>
                ]}
                itemCount={itemCount}
              />
            </li>
          ) : (
            <span key={data[0] + i}>
              <input
                type="checkbox"
                id={data[0] + i}
                checked={
                  filter.availableSize[data[0]]
                    ? filter.availableSize[data[0]].isChecked
                    : false
                }
                onChange={this.handleClickSize}
                value={data[0]}
                disabled={
                  filtered_facets?.availableSize?.filter(
                    (e: string[]) => e[0] === data[0]
                  ).length === 0
                }
              />
              <li>
                <label
                  htmlFor={data[0] + i}
                  className={cs(
                    filter.availableSize[data[0]] &&
                      filter.availableSize[data[0]].isChecked
                      ? cs(styles.sizeCat, styles.select_size)
                      : filtered_facets?.availableSize.filter(
                          (e: string[]) => e[0] === data[0]
                        ).length === 0
                      ? cs(styles.disableSize)
                      : cs(styles.sizeCat)
                  )}
                >
                  {data[0]}
                </label>
              </li>
            </span>
          )}
        </>
      );
    });
    return html;
  };

  clickMobilefilter(id: number | string) {
    switch (id) {
      case "Sort":
        this.setState({
          mobileFilter: true,
          showmobileSort: true,
          showmobileText: id,
          showmobileFilterList: false
        });
        break;
      case "Refine":
        this.setState({
          mobileFilter: true,
          showmobileSort: false,
          showmobileFilterList: true,
          showmobileText: id
        });
        break;
      default:
        break;
    }
  }

  clickCloseFilter = (event: any) => {
    this.setState({
      mobileFilter: false,
      showmobileSort: false,
      showmobileText: "",
      showmobileFilterList: false
    });
    event ? event.stopPropagation() : "";
  };

  ClickProductCategory = () => {
    this.setState({
      showProductFilter: !this.state.showProductFilter,
      categorylevel1: this.state.categorylevel1,
      showmenulevel1: !this.state.showmenulevel1
    });
  };

  mobileClickProductCategory = () => {
    this.setState({
      showProductFilter: true,
      categorylevel1: false,
      showmenulevel1: false
    });
  };

  changeValue = (event: any, sort: any) => {
    const { filter } = this.state;
    if (sort == "price_asc") {
      filter.sortBy = { sortBy: "price_asc" };
    } else if (sort == "price_desc") {
      filter.sortBy = { sortBy: "price_desc" };
    } else if (sort == "is_new") {
      filter.sortBy = { sortBy: "is_new" };
    } else if (sort == "discount") {
      filter.sortBy = { sortBy: "discount" };
    } else if (sort == "hc") {
      filter.sortBy = {};
    }
    this.setState({
      filter: filter,
      mobileFilter: false,
      showmobileSort: false,
      showmobileText: "",
      showmobileFilterList: false,
      show: false,
      showDifferentImage: false
    });
    this.createUrlfromFilter("load");
    if (event) {
      event.preventDefault();
    }
  };

  mobileApply = (event: any) => {
    this.updateDataFromAPI("load");
    this.setState({
      mobileFilter: false,
      showmobileSort: false,
      showmobileText: "",
      showmobileFilterList: false,
      isPopupOpen: false
    });
    this.props.openResetPopup?.(false);
    this.props.onChangeFilterState(false, true);
    event.stopPropagation();
  };

  resetFilterClick = () => {
    this.props.openResetPopup?.(true);
    this.setState({
      isPopupOpen: true
    });
  };

  discardFilter = (e: any) => {
    this.clearFilter(e, "all");
    this.setState({
      mobileFilter: false,
      showmobileSort: false,
      showmobileText: "",
      showmobileFilterList: false,
      isPopupOpen: false
    });
    this.props.openResetPopup?.(false);
    this.props.onChangeFilterState(false, true);
    this.props.setFilterCount?.(0);
  };

  render() {
    const { mobile } = this.props;
    const { filter } = this.state;
    const productHtml = this.createProductType(
      this.props.facetObject.categoryObj,
      this.props.facets,
      this.props.filtered_facets
    );

    // const catObjArr = Object.values(filter.categoryShop);
    // const catFilteredArrays = catObjArr.filter(obj =>
    //   Object.values(obj as any).some(value => value === true)
    // );
    // const catDataArray = Object.values(catFilteredArrays);
    // const catTrueValues: string[] = [];
    // catDataArray.forEach(data => {
    //   Object.entries(data as any).forEach(([key, value]) => {
    //     if (value === true) {
    //       catTrueValues.push(key);
    //     }
    //   });
    // });
    // const categoryFilterCount = catTrueValues.length;

    const colorObjArr = Object.values(filter.currentColor);
    const colorFilteredArrays = colorObjArr.filter(obj =>
      Object.values(obj as any).some(value => value === true)
    );
    const colorDataArray = Object.values(colorFilteredArrays);
    const colorTrueValues: string[] = [];
    colorDataArray.forEach(data => {
      Object.entries(data as any).forEach(([key, value]) => {
        if (value === true) {
          colorTrueValues.push(key);
        }
      });
    });
    const colorFilterCount = colorTrueValues.length;

    const sizeObjArr = Object.values(filter.availableSize);
    const sizeFilteredArrays = sizeObjArr.filter(obj =>
      Object.values(obj as any).some(value => value === true)
    );
    const sizeDataArray = Object.values(sizeFilteredArrays);
    const sizeTrueValues: string[] = [];
    sizeDataArray.forEach(data => {
      Object.entries(data as any).forEach(([key, value]) => {
        if (value === true) {
          sizeTrueValues.push(key);
        }
      });
    });
    const sizeFilterCount = sizeTrueValues.length;

    const materialObjArr = Object.values(filter.currentMaterial);
    const materialFilteredArrays = materialObjArr.filter(obj =>
      Object.values(obj as any).some(value => value === true)
    );
    const materialDataArray = Object.values(materialFilteredArrays);
    const materialTrueValues: string[] = [];
    materialDataArray.forEach(data => {
      Object.entries(data as any).forEach(([key, value]) => {
        if (value === true) {
          materialTrueValues.push(key);
        }
      });
    });
    const materialFilterCount = materialTrueValues.length;

    const prodTypeObjArr = Object.values(filter.productType);
    const prodTypeFilteredArrays = prodTypeObjArr.filter(obj =>
      Object.values(obj as any).some(value => value === true)
    );
    const prodTypeDataArray = Object.values(prodTypeFilteredArrays);
    const prodTypeTrueValues: string[] = [];
    prodTypeDataArray.forEach(data => {
      Object.entries(data as any).forEach(([key, value]) => {
        if (value === true) {
          prodTypeTrueValues.push(key);
        }
      });
    });
    const prodTypeFilterCount = prodTypeTrueValues.length;

    const avlDisObjArr = Object.values(filter.availableDiscount);
    const avlDisFilteredArrays = avlDisObjArr.filter(obj =>
      Object.values(obj as any).some(value => value === true)
    );
    const avlDisDataArray = Object.values(avlDisFilteredArrays);
    const avlDisTrueValues: string[] = [];
    avlDisDataArray.forEach(data => {
      Object.entries(data as any).forEach(([key, value]) => {
        if (value === true) {
          avlDisTrueValues.push(key);
        }
      });
    });
    const avlDisFilterCount = avlDisTrueValues.length;
    return (
      <Fragment>
        <ul
          id="inner_filter"
          className={styles.filterSideMenu}
          style={{
            height: `calc(100vh - 24px - ${this.state.totalHeight ?? 0}px)`
          }}
        >
          <li
            className={cs(styles.L1, styles.filterElements, {
              [styles.noBorder]:
                this.renderFilterList(filter).length == 0 && mobile,
              [styles.hide]: mobile
            })}
          >
            {!mobile && <span>Filter By</span>}
            <ul id="currentFilter">{this.renderFilterList(filter)}</ul>
          </li>

          {this.props.salestatus &&
            this.props.facets?.availableDiscount?.length > 0 && (
              <li
                className={cs(
                  styles.L1,
                  this.props.facets &&
                    this.props.facets.availableDiscount &&
                    this.props.facets.availableDiscount.length > 0
                    ? ""
                    : globalStyles.hidden,
                  { [styles.open]: this.state.showFilterByDiscountMenu }
                )}
              >
                {this.props.facets &&
                this.props.facets.availableDiscount &&
                this.props.facets.availableDiscount.length > 0 ? (
                  <span
                    className={
                      this.state.showFilterByDiscountMenu
                        ? cs(styles.menulevel1, styles.menulevel1Open)
                        : styles.menulevel1
                    }
                    onClick={() => {
                      mobile
                        ? this.mobileFilterByDiscountMenu()
                        : this.toggleFilterByDiscountMenu();
                      this.handleAnimation(
                        "discount",
                        this.state.showFilterByDiscountMenu
                      );
                    }}
                  >
                    {`BY DISCOUNT ${
                      mobile && avlDisFilterCount > 0
                        ? `(${avlDisFilterCount})`
                        : ""
                    }`}
                  </span>
                ) : (
                  ""
                )}
                <div
                  className={
                    this.state.showFilterByDiscountMenu
                      ? styles.showheader1
                      : styles.hideDiv
                  }
                  id="discount"
                >
                  {this.createDiscountType(
                    this.props.facets && this.props.facets.availableDiscount,
                    this.props.filtered_facets
                  )}
                  {!mobile && (
                    <div data-name="availableDiscount">
                      <span
                        onClick={e => this.clearFilter(e, "availableDiscount")}
                        className={styles.plp_filter_sub}
                      >
                        Clear
                      </span>
                    </div>
                  )}
                </div>
              </li>
            )}

          <li
            className={cs(styles.L1, {
              [styles.open]:
                this.state.categoryindex == 0 && this.state.categorylevel1
            })}
          >
            <span
              className={cs(
                this.state.categorylevel1,
                this.state.categoryindex == 0 && this.state.categorylevel1
                  ? cs(styles.menulevel1, styles.menulevel1Open)
                  : styles.menulevel1
              )}
              onClick={() => {
                // this.ClickmenuCategory(0);
                mobile ? this.Clickmenulevel1(0) : this.ClickmenuCategory(0);
                this.handleAnimation(
                  "category",
                  this.state.categoryindex == 0 && this.state.categorylevel1
                );
              }}
            >
              Category
              {/* {`Category ${
                mobile && categoryFilterCount > 0
                  ? `(${categoryFilterCount})`
                  : ""
              }`} */}
            </span>
            <div
              id="category"
              className={
                this.state.categoryindex == 0 && this.state.categorylevel1
                  ? styles.showheader1
                  : styles.hideDiv
              }
            >
              {this.createCatagoryFromFacets(
                this.props.facetObject.categoryObj,
                this.props.facetObject.facets
              )}
            </div>
          </li>

          {this.productData.length > 0 && (
            // this.props.facets?.productType?.length > 0 && (
            <li
              className={cs(styles.L1, {
                [globalStyles.hidden]: this.productData.length == 0,
                [styles.open]: this.state.showProductFilter
              })}
            >
              <span
                className={
                  this.state.showProductFilter
                    ? cs(styles.menulevel1, styles.menulevel1Open)
                    : styles.menulevel1
                }
                onClick={() => {
                  mobile
                    ? this.mobileClickProductCategory()
                    : this.ClickProductCategory();
                  this.handleAnimation(
                    "producttype",
                    this.state.showProductFilter
                  );
                }}
              >
                {`PRODUCT TYPE ${
                  mobile && prodTypeFilterCount > 0
                    ? `(${prodTypeFilterCount})`
                    : ""
                }`}
              </span>
              <div
                id="producttype"
                className={
                  this.state.showProductFilter
                    ? styles.showheader1
                    : styles.hideDiv
                }
              >
                {productHtml}
                {!mobile && (
                  <div data-name="productType">
                    <span
                      onClick={e => this.clearFilter(e, "productType")}
                      className={styles.plp_filter_sub}
                    >
                      Clear
                    </span>
                  </div>
                )}
              </div>
            </li>
          )
          // )
          }

          {this.props.facets?.currentColor?.length > 0 && (
            <li
              className={cs(styles.L1, {
                [styles.open]:
                  this.state.activeindex == 1 && this.state.showmenulevel1
              })}
            >
              <span
                className={
                  this.state.activeindex == 1 && this.state.showmenulevel1
                    ? cs(styles.menulevel1, styles.menulevel1Open)
                    : styles.menulevel1
                }
                onClick={() => {
                  this.Clickmenulevel1(1);
                  // this.handleAnimation(
                  //   "color",
                  //   this.state.activeindex == 1 && this.state.showmenulevel1
                  // );
                }}
              >
                {`COLOUR FAMILY ${
                  mobile && colorFilterCount > 0 ? `(${colorFilterCount})` : ""
                }`}
              </span>
              <div
                id="color"
                className={
                  this.state.activeindex == 1 && this.state.showmenulevel1
                    ? styles.colorhead
                    : styles.hideDiv
                }
              >
                <ul>
                  <span>
                    {this.createColorCheckbox(
                      this.props.facets,
                      this.props.filtered_facets
                    )}
                  </span>
                  {!mobile && (
                    <div data-name="currentColor">
                      <span
                        onClick={e => this.clearFilter(e, "currentColor")}
                        className={styles.plp_filter_sub}
                      >
                        Clear
                      </span>
                    </div>
                  )}
                </ul>
              </div>
            </li>
          )}

          {this.props.facets?.availableSize?.length > 0 && (
            <li
              className={cs(styles.L1, {
                [styles.open]:
                  this.state.activeindex == 2 && this.state.showmenulevel1
              })}
            >
              <span
                className={
                  this.state.activeindex == 2 && this.state.showmenulevel1
                    ? cs(styles.menulevel1, styles.menulevel1Open)
                    : styles.menulevel1
                }
                onClick={() => {
                  this.Clickmenulevel1(2);
                  this.handleAnimation(
                    "size",
                    this.state.activeindex == 2 && this.state.showmenulevel1
                  );
                }}
              >
                {`SIZE ${
                  mobile && sizeFilterCount > 0 ? `(${sizeFilterCount})` : ""
                }`}
              </span>
              <div
                id="size"
                className={
                  this.state.activeindex == 2 && this.state.showmenulevel1
                    ? styles.showheader1
                    : styles.hideDiv
                }
              >
                <ul className={styles.sizeList}>
                  {this.createSizeCheckbox(
                    this.props.facets,
                    this.props.filtered_facets
                  )}
                </ul>
                {!mobile && (
                  <div data-name="availableSize">
                    <span
                      onClick={e => this.clearFilter(e, "availableSize")}
                      className={styles.plp_filter_sub}
                    >
                      Clear
                    </span>
                  </div>
                )}
              </div>
            </li>
          )}

          {this.props.facets?.currentMaterial?.length > 0 && (
            <li
              className={cs(styles.L1, {
                [styles.open]:
                  this.state.activeindex == 4 && this.state.showmenulevel1
              })}
            >
              <span
                className={
                  this.state.activeindex == 4 && this.state.showmenulevel1
                    ? cs(styles.menulevel1, styles.menulevel1Open)
                    : styles.menulevel1
                }
                onClick={() => {
                  this.Clickmenulevel1(4);
                  this.handleAnimation(
                    "material",
                    this.state.activeindex == 4 && this.state.showmenulevel1
                  );
                }}
              >
                {`MATERIAL ${
                  mobile && materialFilterCount > 0
                    ? `(${materialFilterCount})`
                    : ""
                }`}
              </span>
              <div
                id="material"
                className={
                  this.state.activeindex == 4 && this.state.showmenulevel1
                    ? styles.colorhead
                    : styles.hideDiv
                }
              >
                <ul>
                  <span>
                    {this.createMaterial(
                      this.props.facets,
                      this.props.filtered_facets
                    )}
                  </span>
                  {!mobile && (
                    <div data-name="currentMaterial">
                      <span
                        onClick={e => this.clearFilter(e, "currentMaterial")}
                        className={styles.plp_filter_sub}
                      >
                        Clear
                      </span>
                    </div>
                  )}
                </ul>
              </div>
            </li>
          )}

          <li
            className={cs(
              styles.L1,
              {
                [styles.open]:
                  this.state.activeindex == 3 && this.state.showmenulevel1
              },
              this.state.rangevalue.length > 0 &&
                this.state.initialrangevalue.min !=
                  this.state.initialrangevalue.max
                ? "custom-slider"
                : globalStyles.hidden
            )}
          >
            <span
              className={
                this.state.activeindex == 3 && this.state.showmenulevel1
                  ? cs(styles.menulevel1, styles.menulevel1Open)
                  : styles.menulevel1
              }
              onClick={() => {
                this.Clickmenulevel1(3);
                this.handleAnimation(
                  "price",
                  this.state.activeindex == 3 && this.state.showmenulevel1
                );
              }}
            >
              {`Price ${
                mobile && Object.keys(filter.price).length > 0 ? "(1)" : ""
              }`}
            </span>
            <div
              id="price"
              className={
                this.state.activeindex == 3 && this.state.showmenulevel1
                  ? "showheader1"
                  : styles.hideDiv
              }
            >
              {mobile && (
                <>
                  <div className={styles.dragText}>Drag to select a range</div>
                  <div className={styles.sliderText}>
                    <span>{this.state.rangevalue[0]} </span>
                    <span>&nbsp; - &nbsp;</span>
                    <span>{this.state.rangevalue[1]} </span>
                  </div>
                </>
              )}

              {this.state.rangevalue.length > 0 ? (
                <Range
                  value={this.state.rangevalue}
                  min={this.state.initialrangevalue.min}
                  max={this.state.initialrangevalue.max}
                  onAfterChange={this.afterChangeValue}
                  onChange={this.onchangeRange}
                  step={this.props.currency == "INR" ? "100" : "10"}
                />
              ) : (
                ""
              )}
              {!mobile && (
                <>
                  <div className={styles.sliderText}>
                    <div className={styles.sliderBox}>
                      {displayPriceWithCommas(
                        this.state.rangevalue[0] || "",
                        this.props.currency,
                        false
                      )}
                    </div>
                    <div className={styles.sliderBox}>
                      {displayPriceWithCommas(
                        this.state.rangevalue[1] || "",
                        this.props.currency,
                        false
                      )}
                    </div>
                  </div>
                  {!mobile && (
                    <div data-name="price">
                      <span
                        onClick={e => this.clearFilter(e, "price")}
                        className={styles.plp_filter_sub}
                      >
                        Clear
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </li>

          {mobile && (
            <div className={styles.numberDiv}>
              <span>
                {this.state.totalItems > 1
                  ? this.state.totalItems + " products found"
                  : this.state.totalItems + " product found"}
              </span>
            </div>
          )}
        </ul>

        {mobile && (
          <div className={cs(styles.filterButton, bootstrap.row)}>
            {this.props.filterCount && this.props.filterCount > 0 ? (
              <div
                className={styles.resetFilter}
                onClick={this.resetFilterClick}
              >
                <span>Reset Filters</span>
              </div>
            ) : (
              <div className={cs(styles.resetFilter, styles.disableResetCta)}>
                <span>Reset Filters</span>
              </div>
            )}
            <div className={styles.applyButton} onClick={this.mobileApply}>
              <span>{`Apply Filters ${
                this.props.filterCount && this.props.filterCount > 0
                  ? `(${this.props.filterCount})`
                  : ""
              }`}</span>
            </div>
          </div>
        )}
      </Fragment>
    );
  }
}

const FilterListPLP = withRouter(FilterList);
export default connect(mapStateToProps, mapActionsToProps)(FilterListPLP);
