import React, { Fragment } from "react";
import styles from "./styles.scss";
import cs from "classnames";
import { AppState } from "reducers/typings";
import { connect } from "react-redux";
import mapActionsToProps from "./mapper/actions";
import "./slider.css";
import globalStyles from "styles/global.scss";
import "rc-slider/assets/index.css";
import "./slider.css";
import { State, FilterProps } from "./typings";
import { withRouter } from "react-router";
import { RouteComponentProps } from "react-router-dom";
import * as valid from "utils/validate";

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
    salestatus: state.info.isSale
  };
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapActionsToProps> &
  FilterProps &
  RouteComponentProps;

class CorporateFilter extends React.Component<Props, State> {
  public productData: any = [];
  public unlisten: any = "";
  public haveCorporate = false;
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
        availableDiscount: {}
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
      isViewAll: false
    };
    this.props.onRef(this);
  }

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
              const csKey = cc[i].split(">")?.[0]?.trim();
              filter.categoryShop[csKey] = Object.assign(
                {},
                filter.categoryShop[csKey]
              );
              // filter.categoryShop[csKey][cc[i].replace(/%2B/g, "+")] = true;
              // if (cc[i].split(">").length == 2) {
              //   isViewAll = true;
              // }

              if (cc[i] == "Corporate Gifting") {
                this.haveCorporate = true;
              } else {
                filter.categoryShop[csKey][cc[i]] = true;
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
            filter.sortBy[key] = vars[key];
            break;
          // case "product_type":
          //   for (let i = 0; i < cc.length; i++) {
          //     filter.productType["pb_" + cc[i]] = true;
          //   }
          //   break;
          // case "available_discount":
          //   for (let i = 0; i < cc.length; i++) {
          //     filter.availableDiscount["disc_" + cc[i]] = {
          //       isChecked: true,
          //       value:
          //         (filter.availableDiscount["disc_" + cc[i]] &&
          //           filter.availableDiscount["disc_" + cc[i]].value) ||
          //         cc[i]
          //     };
          //   }
          //   break;
          default:
            if (key !== "source") {
              this.setState(prevState => {
                return {
                  extraParams: Object.assign({}, prevState.extraParams, {
                    [key]: vars[key]
                  })
                };
              });
            }
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
      urllist.map((urlData: any) => {
        currentKey = urlData.name?.trim();
        if (matchkey.replace(/\+/g, " ") == currentKey) {
          mainUrl = urlData.url;
        }
        // urlData.children.map((url: any) => {
        //   currentKey = url.name?.trim();
        //   if (matchkey.replace(/\+/g, " ") == currentKey) {
        //     mainUrl = url.url;
        //     return url;
        //   }
        // });
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
      categoryKey: any,
      mainurl: string | undefined = "",
      colorVars = "",
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
            Object.keys(categoryKey).map(data => {
              if (categoryKey[data]) {
                const orignalData = data;
                data = encodeURIComponent(data).replace(/%20/g, "+");
                categoryShopVars == ""
                  ? (categoryShopVars = data)
                  : (categoryShopVars += "|" + data);
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
    sizeVars != "" ? (filterUrl += "&available_size=" + sizeVars) : "";
    categoryShopVars != ""
      ? (filterUrl += "&category_shop=" + categoryShopVars)
      : "";
    productVars != "" ? (filterUrl += "&product_type=" + productVars) : "";
    discountVars != ""
      ? (filterUrl += "&available_discount=" + discountVars)
      : "";
    Object.keys(this.state.extraParams).map(key => {
      filterUrl += `&${key}=${this.state.extraParams[key]}`;
    });
    this.setState({
      extraParams: {}
    });
    if (mainurl == "" || !mainurl) {
      mainurl = history.location.pathname;
    }
    history.replace(mainurl + "?source=plp" + filterUrl, {});
    this.updateDataFromAPI(load);
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
    this.setState({
      filter: filter,
      rangevalue: [value[0], value[1]]
    });
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
    const {
      nextUrl,
      mobile,
      listdata,
      currency,
      updateProduct,
      changeLoader
    } = this.props;
    const { filter } = this.state;
    if (nextUrl) {
      this.setState({
        disableSelectedbox: true
      });
    }
    if (nextUrl && this.state.flag && this.state.scrollload) {
      this.setState({ flag: false });
      changeLoader?.(true);
      const filterUrl = "?" + nextUrl.split("?")[1];
      const pageSize = mobile ? 10 : 20;
      updateProduct(filterUrl + `&page_size=${pageSize}`, listdata).then(
        plpList => {
          changeLoader?.(false);
          valid.productImpression(
            plpList,
            "PLP",
            this.props.currency,
            plpList.results.data.length
          );
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
              if (!this.state.scrollView && this.state.shouldScroll) {
                this.handleProductSearch();
              }
            }
          );
          this.props.updateFacets(this.getSortedFacets(plpList.results.facets));
        }
      );
    }
  };

  updateDataFromAPI = (onload?: string) => {
    const { mobile, fetchPlpProducts, history, changeLoader } = this.props;
    if (!onload && mobile) {
      return true;
    }
    changeLoader?.(true);
    const url = decodeURI(history.location.search);
    const filterUrl = "?" + url.split("?")[1];
    const pageSize = mobile ? 10 : 20;
    fetchPlpProducts(filterUrl + `&page_size=${pageSize}`).then(plpList => {
      valid.productImpression(plpList, "PLP", this.props.currency);
      changeLoader?.(false);
      this.createList(plpList);
      this.props.updateFacets(this.getSortedFacets(plpList.results.facets));
    });
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
            availableDiscount: {}
          }
        },
        () => {
          this.props.updateOnload(true);
          this.props.mobile
            ? this.updateDataFromAPI("load")
            : this.updateDataFromAPI();
        }
      );
    }
  };

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
    this.unlisten = this.props.history.listen(this.stateChange);
  }

  UNSAFE_componentWillReceiveProps = (nextProps: Props) => {
    if (
      nextProps.onload &&
      nextProps.facets.categoryShop &&
      this.props.updateFacets
    ) {
      this.props.updateOnload(false);
      this.createList(nextProps.data);
      this.props.updateFacets(this.getSortedFacets(nextProps.facets));
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

  getSortedFacets = (facets: any): any => {
    if (facets.length == 0) return false;
    const categories: any = [],
      subCategories: any = [],
      categoryNames: any = [],
      categoryObj: any = {};
    const { filter } = this.state;

    let selectIndex: any = -1;

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
    facets.categoryShop.map((data: any, i: number) => {
      // const key = data[0].split(">")[1].trim();
      const key = data[0].split(">")[0]
        ? data[0].split(">")[0].trim()
        : data[0].trim();
      if (key.indexOf("View All") == -1) {
        if (filter.categoryShop[key]) {
          // check that view all is clicked or not by (arrow key >)
          if (filter.categoryShop[key][data[0]]) {
            // nestedList[1].split('>').length == 2 ? check = data : '';
            selectIndex = key;
            // this.state.old_selected_category = key;
            // filter.categoryShop[key][data[0]] = false
          } else {
            if (this.haveCorporate) {
              filter.categoryShop[key][data[0].trim()] = true;
            } else {
              filter.categoryShop[key][data[0].trim()] = false;
            }
          }
        } else {
          filter.categoryShop[key] = {};
          if (this.haveCorporate) {
            filter.categoryShop[key][data[0].trim()] = true;
          } else {
            filter.categoryShop[key][data[0].trim()] = false;
          }
          // filter.categoryShop[key][data[0]] = false;
        }
      }
    });
    const oldSelectedCategory: any = this.state.oldSelectedCategory;

    const someSelected = Object.keys(filter.categoryShop).some((data, i) => {
      const nestedVal = Object.keys(filter.categoryShop[data]).some(
        (nestedList, j) => {
          return !filter.categoryShop[data][nestedList];
        }
      );
      return nestedVal;
    });
    // this.view_all = !someSelected;

    this.setState({
      activeindex2: selectIndex + "l",
      oldSelectedCategory: oldSelectedCategory,
      filter: filter,
      isViewAll: !someSelected
    });
    return { categoryObj: categoryObj, facets: facets };
  };

  onClickLevel4 = (event: any) => {
    const id = event.target.id;
    const { filter } = this.state;
    filter.productType[id] = event.target.checked;
    // this.old_level4Value = event.target.value;
    this.setState({
      filter: filter
    });
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
    this.setState({
      filter
    });
    this.createUrlfromFilter();
    event.stopPropagation();
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

  generateSubCatagory = (data: any, html: any) => {
    const name = data[0].split(">")[1].trim(),
      id = data[0].trim();
    const { filter } = this.state;
    html.push(
      <ul>
        <li key={id}>
          <span
            className={
              this.state.showmenulevel2 && this.state.activeindex2 == name + "l"
                ? cs(styles.menulevel2, styles.menulevel2Open)
                : styles.menulevel2
            }
            onClick={this.Clickmenulevel2.bind(this, name + "l")}
          >
            {data[0].split(">")[1].length > 15 && !this.props.mobile
              ? data[0].split(">")[1].substring(0, 15) + "..."
              : data[0].split(">")[1]}
          </span>
          <div
            className={
              this.state.showmenulevel2 && this.state.activeindex2 == name + "l"
                ? styles.showheader2
                : globalStyles.hidden
            }
          >
            <ul className={styles.categorylabel}>
              <li>
                <input
                  type="checkbox"
                  id={id}
                  disabled={this.state.disableSelectedbox}
                  checked={
                    filter.categoryShop[name]
                      ? filter.categoryShop[name][id]
                      : false
                  }
                  onClick={this.handleClickCategory}
                  value={data[0].split(">")[1].trim()}
                  name="View all"
                />
                <label htmlFor={id}>View all</label>
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
      <ul>
        <li key={data + "l"}>
          <span
            className={
              this.state.showmenulevel2 && this.state.activeindex2 == data + "l"
                ? cs(styles.menulevel2, styles.menulevel2Open)
                : styles.menulevel2
            }
            onClick={this.Clickmenulevel2.bind(this, data + "l")}
          >
            {data.length > 14 && !this.props.mobile
              ? data.substring(0, 14) + "..."
              : data}
          </span>
          <div
            className={
              this.state.showmenulevel2 && this.state.activeindex2 == data + "l"
                ? styles.showheader2
                : globalStyles.hidden
            }
          >
            <ul className={styles.categorylabel}>
              {categoryObj[data].map((nestedList: any, j: number) => {
                return (
                  <li key={nestedList[1]}>
                    <input
                      type="checkbox"
                      id={nestedList[1]}
                      disabled={this.state.disableSelectedbox}
                      checked={
                        filter.categoryShop[data]
                          ? filter.categoryShop[data][nestedList[1]]
                          : false
                      }
                      onClick={this.handleClickCategory}
                      value={data}
                      name={nestedList[0]}
                    />
                    <label htmlFor={nestedList[1]}>{nestedList[0]}</label>
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
    const html: any = [];
    const { filter } = this.state;
    if (!categoryObj) return false;
    categorydata.categoryShop.map((data: any, i: number) => {
      const name = data[0].split(">")[1]
          ? data[0].split(">")[1].trim()
          : data[0].split(">")[0].trim(),
        id = data[0].trim(),
        cat = data[0].split(">")[0].trim();
      if (id == "View All") {
        html.push(
          <ul>
            <li>
              <p className="showheader2">
                <ul className={styles.categorylabel}>
                  <li>
                    <input
                      type="checkbox"
                      id={id}
                      disabled={this.state.disableSelectedbox}
                      checked={this.state.isViewAll}
                      onClick={this.handleClickCategory}
                      name="View all"
                      value={cat}
                    />
                    <label htmlFor={id}>{name}</label>
                  </li>
                </ul>
              </p>
            </li>
          </ul>
        );
      } else {
        html.push(
          <ul>
            <li>
              <p className="showheader2">
                <ul className={styles.categorylabel}>
                  <li>
                    <input
                      type="checkbox"
                      id={id}
                      disabled={this.state.disableSelectedbox}
                      checked={
                        filter.categoryShop[cat]
                          ? filter.categoryShop[cat][id]
                          : false
                      }
                      onClick={this.handleClickCategory}
                      value={cat}
                      name={cat}
                    />
                    <label htmlFor={id}>{name}</label>
                  </li>
                </ul>
              </p>
            </li>
          </ul>
        );
      }
    });
    return html;
  };

  handleClickCategory = (event: any) => {
    // let checkallSelectedValue;
    const categoryObj = this.state.filter.categoryShop,
      viewData = event.target.id.split(">");
    viewData.length > 2 ? viewData.pop() : "";
    const { filter, isViewAll } = this.state;
    let viewAll = isViewAll;
    //code for checked view all true
    if (event.target.name.indexOf("View all") > -1 && !event.target.checked) {
      event.target.checked = true;
      return false;
    }

    if (event.target.name.indexOf("View all") > -1) {
      // filter.categoryShop[event.target.value] = Object.assign(
      //   {},
      //   filter.categoryShop[event.target.value]
      // );
      Object.keys(filter.categoryShop).map(key => {
        if (event.target.checked) {
          Object.keys(filter.categoryShop[key]).map(product => {
            filter.categoryShop[key][product] = event.target.checked;
          });
        }
      });
      viewAll = true;
    } else {
      this.haveCorporate = false;
      viewAll = false;
      filter.categoryShop[event.target.value] = Object.assign(
        {},
        filter.categoryShop[event.target.value]
      );
      filter.categoryShop[event.target.value][event.target.id] =
        event.target.checked;
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
      isViewAll: viewAll,
      oldSelectedCategory: event.target.value
    });

    this.createUrlfromFilter();
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
      showmobileFilterList: false
    });
    this.props.onChangeFilterState(false, true);
    event.stopPropagation();
  };

  render() {
    const { mobile } = this.props;
    const { filter } = this.state;
    // const productHtml = this.createProductType(
    //   this.props.facetObject.categoryObj,
    //   this.props.facets
    // );
    return (
      <Fragment>
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
              onClick={() => {
                this.ClickmenuCategory(0);
              }}
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
              {this.createCatagoryFromFacets(
                this.props.facetObject.categoryObj,
                this.props.facetObject.facets
              )}
            </div>
          </li>
          {!mobile && (
            <>
              <div
                className={cs(
                  styles.catalogFont,
                  globalStyles.voffset3,
                  globalStyles.textCenter
                )}
              >
                {" "}
                For enquiries, write to us at{" "}
                <a
                  className={globalStyles.cerise}
                  href="mailto:customercare@goodearth.in"
                  rel="noopener noreferrer"
                >
                  customercare@goodearth.in
                </a>
                , or call us at +91 9582 999 555
              </div>
              <div
                className={cs(
                  styles.catalogFont,
                  globalStyles.voffset3,
                  globalStyles.textCenter
                )}
              >
                <a
                  href="https://indd.adobe.com/view/e046249f-f38d-419b-9dc3-af8bea0326ab"
                  className={globalStyles.cerise}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  DOWNLOAD CATALOGUE
                </a>
              </div>
            </>
          )}
        </ul>
        {mobile ? (
          <div className={styles.filterButton}>
            <div className={styles.numberDiv}>
              <span>{this.state.totalItems} Product found</span>
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

const FilterListPLP = withRouter(CorporateFilter);
export default connect(mapStateToProps, mapActionsToProps)(FilterListPLP);
