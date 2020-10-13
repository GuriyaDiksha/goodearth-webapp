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
import * as valid from "utils/validate";
import Loader from "components/Loader";

const mapStateToProps = (state: AppState) => {
  return {
    data: state.searchList.data,
    onload: state.searchList.onload,
    mobile: state.device.mobile,
    currency: state.currency,
    facets: state.searchList.data.results.facets,
    facetObject: state.searchList.facetObject,
    nextUrl: state.searchList.data.next,
    listdata: state.searchList.data.results.data
  };
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapActionsToProps> &
  FilterProps &
  RouteComponentProps;

class FilterList extends React.Component<Props, State> {
  public productData: any = [];
  constructor(props: Props) {
    super(props);
    this.state = {
      shouldScroll: false,
      showmenulevel1: false,
      categorylevel1: false,
      showmobileFilterList: false,
      show: false,
      showDifferentImage: false,
      salestatus: false,
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
        q: {}
      },
      isLoading: false,
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
      activeindex2: 1
    };
    this.props.onRef(this);
  }

  public unlisten: any = "";

  createFilterfromUrl = () => {
    const vars: any = {};
    const { history } = this.props;
    const url = decodeURI(history.location.search.replace(/\+/g, " "));
    const { filter } = this.state;

    const re = /[?&]+([^=&]+)=([^&]*)/gi;
    let match;
    while ((match = re.exec(url))) {
      vars[match[1]] = match[2];
    }

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
              const csKey = cc[i].trim();
              filter.categoryShop[csKey] = true;
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
            filter.sortBy[key] = vars[key];
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
          case "q":
            filter.q[key] = vars[key];
            break;
          default:
            break;
        }
      }
    }
    this.setState({
      filter: filter,
      showmenulevel2: true,
      categoryindex: 0,
      activeindex: this.state.openMenu,
      activeindex2: 1,
      categorylevel1: true
    });
  };

  getMainUrl = (matchkey: any) => {
    const { pathname } = this.props.history.location;
    let currentKey, mainUrl, urllist;
    if (this.props.facets) {
      urllist = this.props.facets.categoryShopDetail;
      urllist.some((url: any) => {
        currentKey = Object.keys(url)[0];
        if (matchkey.replace(/\+/g, " ") == currentKey) {
          mainUrl = url[currentKey];
          return true;
        }
      });
    } else {
      mainUrl = pathname;
    }

    return mainUrl;
  };

  createUrlfromFilter = (load?: any) => {
    const array = this.state.filter;
    const { history } = this.props;
    let filterUrl = "",
      mainurl: string | undefined = "",
      colorVars = "",
      sizeVars = "",
      categoryShopVars = "",
      productVars = "",
      discountVars = "",
      searchValue = "";
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
            // this.state.old_selected_category = k]y;
            if (array[filterType][key]) {
              categoryShopVars = encodeURIComponent(key).replace(/%20/g, "+");
            }
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
    sizeVars != "" ? (filterUrl += "&available_size=" + sizeVars) : "";
    searchValue = this.state.filter.q.q
      ? encodeURIComponent(this.state.filter.q.q)
      : "";
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
    // filter_url = filter_url.replace(/\s/g, "+");
    history.replace(mainurl + "?q=" + searchValue + filterUrl, {});
    // history.replaceState({}, "", mainurl + "?q=" + searchValue + filterUrl);
    this.updateDataFromAPI(load);
  };

  stateChange = (location: any, action: any) => {
    if (action == "PUSH" && location.pathname.includes("/search")) {
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
            q: {}
          }
        },
        () => {
          this.props.updateOnload(true);
          this.props.mobile
            ? this.updateDataFromAPI("load")
            : this.updateDataFromAPI();
        }
      );
      // this.setState({
      //   value:
      // });
      // this.getSearchDataApi();
    }
  };

  onchangeRange = (value: any) => {
    if (value[0] == value[1]) return false;
    this.setState({
      rangevalue: [value[0], value[1]]
    });
  };

  afterChangeValue = (value: any) => {
    if (value[0] == value[1]) return false;
    const { filter } = this.state;
    filter.price["min_price"] = value[0];
    filter.price["max_price"] = value[1];
    this.setState(
      {
        filter: filter,
        rangevalue: [value[0], value[1]]
      },
      () => {
        this.createUrlfromFilter();
      }
    );
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
    // html.clientHeight <= (window.pageYOffset + window.innerHeight-100)
    if (windowBottom + 2000 >= docHeight && this.state.scrollload) {
      this.appendData();
    }
  };
  createList = (plpList: any) => {
    if (!plpList.results.facets.categoryShop) return false;
    const { currency } = this.props;
    const { filter } = this.state;
    const minMaxvalue: any = [];
    let currentRange: any = [];
    this.createFilterfromUrl();
    const pricearray: any = [],
      currentCurrency =
        "price" +
        currency[0].toUpperCase() +
        currency.substring(1).toLowerCase();
    plpList.results.facets[currentCurrency].map(function(a: any) {
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
        if (!this.state.scrollView) {
          this.checkForProductScroll();
        }
        window.scrollTo(0, 0);
      }
    );
  };

  appendData = () => {
    const minMaxvalue: any = [];
    let currentRange: any = [];
    const { nextUrl, listdata, currency, updateProduct } = this.props;
    const { filter } = this.state;
    if (nextUrl) {
      this.setState({
        disableSelectedbox: true
      });
    }
    if (nextUrl && this.state.flag && this.state.scrollload) {
      this.setState({ flag: false });
      const filterUrl = "?" + nextUrl.split("?")[1];
      // const pageSize = mobile ? 10 : 20;
      const pageSize = 20;
      this.setState({ isLoading: true });
      updateProduct(filterUrl + `&page_size=${pageSize}`, listdata)
        .then(searchList => {
          valid.productImpression(
            searchList,
            "PLP",
            this.props.currency,
            searchList.results.data.length
          );
          this.createFilterfromUrl();
          const pricearray: any = [],
            currentCurrency =
              "price" +
              currency[0].toUpperCase() +
              currency.substring(1).toLowerCase();
          searchList.results.facets[currentCurrency].map(function(a: any) {
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
              totalItems: searchList.count
            },
            () => {
              if (!this.state.scrollView && this.state.shouldScroll) {
                this.handleProductSearch();
              }
            }
          );
        })
        .finally(() => {
          this.setState({ isLoading: false });
        });
    }
  };

  updateDataFromAPI = (onload?: string) => {
    const { mobile, fetchSearchProducts, history } = this.props;
    if (!onload && mobile) {
      return true;
    }
    // this.setState({
    //     disableSelectedbox: true
    // });
    const url = decodeURI(history.location.search);
    const filterUrl = "?" + url.split("?")[1];

    // const pageSize = mobile ? 10 : 20;
    const pageSize = 20;
    this.setState({ isLoading: true });
    fetchSearchProducts(filterUrl + `&page_size=${pageSize}`)
      .then(searchList => {
        valid.productImpression(searchList, "PLP", this.props.currency);
        this.createList(searchList);
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  };

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
    this.unlisten = this.props.history.listen(this.stateChange);
  }

  UNSAFE_componentWillReceiveProps = (nextProps: Props) => {
    if (nextProps.onload && nextProps.facets.categoryShop) {
      this.props.updateOnload(false);
      this.createList(nextProps.data);
    }
    if (this.props.currency != nextProps.currency) {
      nextProps.mobile
        ? this.updateDataFromAPI("load")
        : this.updateDataFromAPI();
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
      }, 0);
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
  }

  onClickLevel4 = (event: any) => {
    const id = event.target.id;
    const { filter } = this.state;
    filter.productType[id] = event.target.checked;
    // this.old_level4Value = event.target.value;
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

    event.stopPropagation();
  };

  createProductType = (categoryObj: any, categorydata: any) => {
    const html = [];
    this.productData = [];
    if (!categoryObj) return false;
    const { filter } = this.state;
    Object.keys(categoryObj).map((data, i) => {
      categoryObj[data].map((nestedList: any, j: number) => {
        filter.categoryShop[data]
          ? filter.categoryShop[data][nestedList[1]]
            ? categorydata.categoryProductTypeMapping[nestedList[1]].map(
                (level4: any) => {
                  if (this.productData.indexOf(level4) == -1) {
                    this.productData.push(level4);
                  }
                }
              )
            : ""
          : "";
      });
    });
    for (const prop in filter.productType) {
      if (this.productData.indexOf(prop.replace("pb_", "")) == -1) {
        filter.productType[prop] = false;
      }
    }
    html.push(
      <ul>
        <li>
          <ul className={styles.categorylabel}>
            {this.productData.map((level4: any) => {
              return (
                <li key={"pb_" + level4}>
                  <input
                    type="checkbox"
                    onClick={this.onClickLevel4}
                    id={"pb_" + level4}
                    checked={
                      filter.productType["pb_" + level4]
                        ? filter.productType["pb_" + level4]
                        : false
                    }
                    value={"pb_" + level4}
                  />
                  <label htmlFor={"pb_" + level4}>{level4}</label>
                </li>
              );
            })}
          </ul>
        </li>
      </ul>
    );

    return html;
  };

  createDiscountType = (availableDiscount: any) => {
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
      <ul>
        <li>
          <ul className={styles.categorylabel}>
            {this.props.facets.availableDiscount.map((discount: any) => {
              return (
                <li key={discount[0]}>
                  <input
                    type="checkbox"
                    onClick={this.onClickDiscount}
                    id={"disc_" + discount[0]}
                    checked={
                      filter.availableDiscount["disc_" + discount[0]]
                        ? filter.availableDiscount["disc_" + discount[0]]
                            .isChecked
                        : false
                    }
                    value={discount[1]}
                  />
                  <label htmlFor={"disc_" + discount[0]}>{discount[1]}</label>
                </li>
              );
            })}
          </ul>
        </li>
      </ul>
    );

    return html;
  };

  createCatagoryFromFacets = (categoryObj: any) => {
    const html: any = [];
    if (!categoryObj.categoryShop) return false;

    if (categoryObj.categoryShop) {
      html.push(
        <ul className={cs(styles.categorylabel, styles.searchCategory)}>
          <li>
            <span
              className={
                Object.keys(this.state.filter.categoryShop).length == 0
                  ? globalStyles.cerise
                  : ""
              }
              onClick={this.handleClickCategory}
              data-value="all"
              id="all"
            >
              All (
              {categoryObj.categoryShop[0]
                ? categoryObj.categoryShop.filter(
                    (category: any) => category[0] == "All"
                  )[0][1]
                : "0"}
              )
            </span>
          </li>
        </ul>
      );
    }
    categoryObj.categoryShop.map((data: any, i: number) => {
      if (data[0] == "All") return false;
      const len = data[0].split(">").length;
      html.push(
        <ul className={cs(styles.categorylabel, styles.searchCategory)}>
          <li>
            <span
              className={
                this.state.filter.categoryShop[data[0]]
                  ? globalStyles.cerise
                  : ""
              }
              onClick={this.handleClickCategory}
              data-value={data}
              id={data[0]}
            >
              {data[0].split(">")[len - 1] + " (" + data[2] + ")"}
            </span>
          </li>
        </ul>
      );
    });
    return html;
  };

  handleClickCategory = (event: any) => {
    //code for checked view all true
    const { filter } = this.state;
    filter.categoryShop = {};
    if (event.target.id.indexOf("all") > -1) {
      // do nothing
    } else {
      filter.categoryShop[event.target.id] = true;
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

  Clickmenulevel1 = (index: number) => {
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
  };

  ClickmenuCategory = (index: number) => {
    index == this.state.categoryindex
      ? this.setState({
          categoryindex: -1,
          categorylevel1: !this.state.categorylevel1
        })
      : this.setState({ categoryindex: index, categorylevel1: true });
  };

  toggleFilterByDiscountMenu = () => {
    this.setState(prevState => {
      return {
        showFilterByDiscountMenu: !prevState.showFilterByDiscountMenu
      };
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
    this.setState({
      filter: filter
    });
    this.createUrlfromFilter();
    event.stopPropagation();
  };

  createColorCheckbox = (facets: any) => {
    if (!facets.currentColor || facets.length == 0) return false;
    const html: any = [];
    const { filter } = this.state;
    facets.currentColor.map((data: any, i: number) => {
      const color: any = {
        "--my-color-var": "#" + data[0].split("-")[0]
      };
      html.push(
        <li className={styles.colorlabel} key={data[0]}>
          <input
            type="checkbox"
            id={data[0]}
            checked={
              filter.currentColor[data[0]]
                ? filter.currentColor[data[0]].isChecked
                : false
            }
            onClick={this.handleClickColor}
            value={data[0]}
          />
          <label htmlFor={data[0]} style={color}>
            {data[0].split("-")[1]}
          </label>
        </li>
      );
    });
    return html;
  };

  handleClickSize = (event: any) => {
    const { filter } = this.state;
    filter.availableSize[event.target.value] = {
      isChecked: event.target.checked,
      value: event.target.value
    };
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
    if (event) {
      event.stopPropagation();
    }
  };

  renderFilterList = (filterObj: any) => {
    const html = [];
    Object.keys(filterObj).map(data => {
      switch (data) {
        case "currentColor":
        case "availableSize":
          Object.keys(filterObj[data]).map((data1, index) => {
            if (!filterObj[data][data1].isChecked) return false;
            html.push(
              <li key={data}>
                <span>{data == "currentColor" ? "Color" : "Size"}: </span>
                <span>
                  {data == "currentColor"
                    ? filterObj[data][data1].value.split("-")[1]
                    : filterObj[data][data1].value}
                </span>
                <span
                  onClick={e => this.deleteFilter(e, data, data1)}
                  data-color={data}
                >
                  x
                </span>
              </li>
            );
          });
          break;
        case "categoryShop":
          break;
        case "price":
          if (Object.keys(filterObj[data]).length == 0) return false;
          html.push(
            <li>
              <span>Price: </span>
              <span>
                {filterObj[data].min_price}-{filterObj[data].max_price}
              </span>
              <span onClick={e => this.deleteFilter(e, data, null)}>x</span>
            </li>
          );
          break;
        case "productType":
          Object.keys(filterObj[data]).map((data1, index) => {
            if (!filterObj[data][data1]) return false;
            html.push(
              <li key={data1}>
                <span>Product Type: </span>
                <span>{data1.split("_")[1]}</span>
                <span
                  onClick={e => this.deleteFilter(e, data, data1)}
                  data-product={data}
                >
                  x
                </span>
              </li>
            );
          });
          break;
        case "availableDiscount":
          Object.keys(filterObj[data]).map((data1, index) => {
            if (!filterObj[data][data1].isChecked) return false;
            html.push(
              <li key={data1}>
                <span>Discount: </span>
                <span>
                  {/* {self.props.facetObject.facets && self.props.facetObject.facets[data].map((discount) => {
                                if(discount[0] == data1.split('_')[1]){
                                    return discount[1];
                                }
                            })} */}
                  {/* {data1.split('_')[1]} */}
                  {filterObj[data][data1].value}
                </span>
                <span
                  onClick={e => this.deleteFilter(e, data, data1)}
                  data-discount={data}
                >
                  x
                </span>
              </li>
            );
          });
          break;
      }
    });
    const name: any = "all";
    if (html.length > 0) {
      html.push(
        <div
          onClick={e => this.clearFilter(e, "all")}
          data-name={name}
          className={styles.plp_filter_sub}
        >
          Clear All
        </div>
      );
    }

    return html;
  };

  createSizeCheckbox = (facets: any) => {
    if (facets.length == 0) return false;
    const html: any = [];
    const { filter } = this.state;
    facets.availableSize.map((data: any, i: number) => {
      html.push(
        <span key={data[0] + i}>
          <input
            type="checkbox"
            id={data[0] + i}
            checked={
              filter.availableSize[data[0]]
                ? filter.availableSize[data[0]].isChecked
                : false
            }
            onClick={this.handleClickSize}
            value={data[0]}
          />
          <li>
            <label
              htmlFor={data[0] + i}
              className={
                filter.availableSize[data[0]] &&
                filter.availableSize[data[0]].isChecked
                  ? cs(styles.sizeCat, styles.select_size)
                  : styles.sizeCat
              }
            >
              {data[0]}
            </label>
          </li>
        </span>
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
      showProductFilter: !this.state.showProductFilter
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
    } else if (sort == "hc") {
      filter.sortBy = {};
    }
    this.setState(
      {
        filter: filter,
        mobileFilter: false,
        showmobileSort: false,
        showmobileText: "",
        showmobileFilterList: false,
        show: false,
        showDifferentImage: false
      },
      () => {
        this.createUrlfromFilter("load");
      }
    );

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
      showmobileFilterList: false
    });
    this.props.onChangeFilterState(false, true);
    event.stopPropagation();
  };

  changeSearchValue = (value: string) => {
    if (value == "") return false;
    let { filter } = this.state;
    filter = {
      currentColor: {},
      availableSize: {},
      categoryShop: {},
      price: {},
      // currency: {
      //   currency: this.props.currency
      // },
      sortBy: {},
      q: {
        q: value
      }
    };
    this.setState(
      {
        filter: filter
      },
      () => {
        this.createUrlfromFilter();
      }
    );
  };

  render() {
    const { mobile } = this.props;
    const { filter } = this.state;
    return (
      <Fragment>
        {this.state.isLoading && <Loader />}
        <ul id="inner_filter" className={styles.filterSideMenu}>
          <li className={styles.filterElements}>
            <span>Filtered By</span>
            <ul id="currentFilter">{this.renderFilterList(filter)}</ul>
          </li>
          <li>
            <span
              className={
                this.state.categoryindex == 0 && this.state.categorylevel1
                  ? cs(styles.menulevel1, styles.menulevel1Open)
                  : styles.menulevel1
              }
              onClick={this.ClickmenuCategory.bind(this, 0)}
            >
              Category
            </span>
            <div
              className={
                this.state.categoryindex == 0 && this.state.categorylevel1
                  ? styles.showheader1
                  : globalStyles.hidden
              }
            >
              {this.createCatagoryFromFacets(this.props.data.results.facets)}
            </div>
          </li>
          {this.state.salestatus && (
            <li
              className={
                this.props.facets &&
                this.props.facets.availableDiscount &&
                this.props.facets.availableDiscount.length > 0
                  ? ""
                  : globalStyles.hidden
              }
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
                  onClick={this.toggleFilterByDiscountMenu.bind(this)}
                >
                  FILTER BY DISCOUNT
                </span>
              ) : (
                ""
              )}
              <div
                className={
                  this.state.showFilterByDiscountMenu
                    ? styles.showheader1
                    : globalStyles.hidden
                }
              >
                {this.createDiscountType(
                  this.props.facets && this.props.facets.availableDiscount
                )}
                <div
                  onClick={e => this.clearFilter(e, "availableDiscount")}
                  data-name="availableDiscount"
                  className={styles.plp_filter_sub}
                >
                  Clear
                </div>
              </div>
            </li>
          )}
          <li className={this.productData.length > 0 ? "" : "hidden"}>
            {this.productData.length > 0 ? (
              <span
                className={
                  this.state.showProductFilter
                    ? cs(styles.menulevel1, styles.menulevel1Open)
                    : globalStyles.menulevel1
                }
                onClick={this.ClickProductCategory.bind(this)}
              >
                PRODUCT TYPE
              </span>
            ) : (
              ""
            )}
            <div
              className={
                this.state.showProductFilter
                  ? styles.showheader1
                  : globalStyles.hidden
              }
            >
              {this.createProductType(
                this.props.facetObject.categoryObj,
                this.props.facets
              )}
              <div
                onClick={e => this.clearFilter(e, "productType")}
                data-name="productType"
                className={styles.plp_filter_sub}
              >
                Clear
              </div>
            </div>
          </li>
          <li>
            <span
              className={
                this.state.activeindex == 1 && this.state.showmenulevel1
                  ? cs(styles.menulevel1, styles.menulevel1Open)
                  : styles.menulevel1
              }
              onClick={this.Clickmenulevel1.bind(this, 1)}
            >
              COLOR
            </span>
            <div
              className={
                this.state.activeindex == 1 && this.state.showmenulevel1
                  ? styles.colorhead
                  : globalStyles.hidden
              }
            >
              <ul>
                <span>{this.createColorCheckbox(this.props.facets)}</span>
                <div
                  onClick={e => this.clearFilter(e, "currentColor")}
                  data-name="currentColor"
                  className={styles.plp_filter_sub}
                >
                  Clear
                </div>
              </ul>
            </div>
          </li>
          {this.props.facets.availableSize ? (
            this.props.facets.availableSize.length > 0 ? (
              <li>
                <span
                  className={
                    this.state.activeindex == 2 && this.state.showmenulevel1
                      ? cs(styles.menulevel1, styles.menulevel1Open)
                      : styles.menulevel1
                  }
                  onClick={this.Clickmenulevel1.bind(this, 2)}
                >
                  size
                </span>
                <div
                  className={
                    this.state.activeindex == 2 && this.state.showmenulevel1
                      ? styles.showheader1
                      : globalStyles.hidden
                  }
                >
                  <ul className={styles.sizeList}>
                    {this.createSizeCheckbox(this.props.facets)}
                  </ul>
                  <div
                    onClick={e => this.clearFilter(e, "availableSize")}
                    data-name="availableSize"
                    className={styles.plp_filter_sub}
                  >
                    Clear
                  </div>
                </div>
              </li>
            ) : (
              ""
            )
          ) : (
            ""
          )}
          <li
            className={
              this.state.rangevalue.length > 0 &&
              this.state.initialrangevalue.min !=
                this.state.initialrangevalue.max
                ? "custom-slider"
                : globalStyles.hidden
            }
          >
            <span
              className={
                this.state.activeindex == 3 && this.state.showmenulevel1
                  ? cs(styles.menulevel1, styles.menulevel1Open)
                  : styles.menulevel1
              }
              onClick={this.Clickmenulevel1.bind(this, 3)}
            >
              Price
            </span>
            <div
              className={
                this.state.activeindex == 3 && this.state.showmenulevel1
                  ? "showheader1"
                  : globalStyles.hidden
              }
            >
              {this.state.rangevalue.length > 0 ? (
                <Range
                  value={this.state.rangevalue}
                  min={this.state.initialrangevalue.min}
                  max={this.state.initialrangevalue.max}
                  onAfterChange={this.afterChangeValue}
                  onChange={this.onchangeRange}
                  step="100"
                />
              ) : (
                ""
              )}
              <div className={styles.sliderText}>
                <div className={styles.sliderBox}>
                  {this.state.rangevalue[0]}
                </div>

                <div className={styles.sliderBox}>
                  {this.state.rangevalue[1]}
                </div>
              </div>
              <div
                onClick={e => this.clearFilter(e, "price")}
                data-name="price"
                className={styles.plp_filter_sub}
              >
                Clear
              </div>
            </div>
          </li>
        </ul>
        {mobile ? (
          <div className={styles.filterButton}>
            <div className={styles.numberDiv}>
              <span>{this.state.totalItems} Search Results Found</span>
            </div>
            <div className={styles.applyButton} onClick={this.mobileApply}>
              <span>Apply</span>
            </div>
          </div>
        ) : (
          ""
        )}
      </Fragment>
    );
  }
}
const FilterListSearch = withRouter(FilterList);
export default connect(mapStateToProps, mapActionsToProps)(FilterListSearch);
