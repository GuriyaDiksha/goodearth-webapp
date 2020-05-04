import React, { Fragment } from "react";
import styles from "./styles.scss";
import cs from "classnames";
import { AppState } from "reducers/typings";
import { connect, DispatchProp } from "react-redux";
import mapActionsToProps from "./mapper/actions";
import "./slider.css";
import globalStyles from "styles/global.scss";
import { Range } from "rc-slider";
import "rc-slider/assets/index.css";
import "./slider.css";
import PlpService from "services/plp";
import { State } from "./typings";

const mapStateToProps = (state: AppState) => {
  return {
    data: state.plplist.data,
    mobile: state.device.mobile,
    currency: state.currency,
    location: state.router.location,
    facets: state.plplist.data.results.facets,
    facetObject: state.plplist.facetObject,
    nextUrl: state.plplist.data.next,
    listdata: state.plplist.data.results.data
  };
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapActionsToProps> &
  DispatchProp;

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
        sort_by: {},
        productType: {},
        availableDiscount: {}
      },
      searchUrl: this.props.location,
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
  }

  createFilterfromUrl = () => {
    let vars: any = {};
    const { location } = this.props;
    let url = decodeURI(location.search.replace(/\+/g, " "));

    let re = /[?&]+([^=&]+)=([^&]*)/gi;
    let match;
    while ((match = re.exec(url))) {
      vars[match[1]] = match[2];
    }

    // url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value){
    //     vars[key] = value;
    // });
    for (var key in vars) {
      if (vars.hasOwnProperty(key)) {
        var cc = vars[key].replace(/%26/g, "&").split("|");

        switch (key) {
          case "current_color":
            for (let i = 0; i < cc.length; i++) {
              this.state.filter.currentColor[cc[i]] = {
                isChecked: true,
                value: cc[i]
              };
            }
            break;
          case "available_size":
            for (let i = 0; i < cc.length; i++) {
              this.state.filter.availableSize[cc[i]] = {
                isChecked: true,
                value: cc[i]
              };
            }
            break;
          case "category_shop":
            for (let i = 0; i < cc.length; i++) {
              var cs_key = cc[i].split(">")[1].trim();
              this.state.filter.categoryShop[cs_key] = Object.assign(
                {},
                this.state.filter.categoryShop[cs_key]
              );
              this.state.filter.categoryShop[cs_key][
                cc[i].replace(/%2B/g, "+")
              ] = true;
            }
            break;
          case "min_price":
          case "max_price":
            this.state.filter.price[key] = vars[key];
            break;
          case "currency":
            this.state.filter.currency[key] = vars[key];
            break;
          case "sort_by":
            this.state.filter.sort_by[key] = vars[key];
            break;
          case "product_type":
            for (let i = 0; i < cc.length; i++) {
              this.state.filter.productType["pb_" + cc[i]] = true;
            }
            break;
          case "available_discount":
            for (let i = 0; i < cc.length; i++) {
              this.state.filter.availableDiscount["disc_" + cc[i]] = {
                isChecked: true,
                value:
                  (this.state.filter.availableDiscount["disc_" + cc[i]] &&
                    this.state.filter.availableDiscount["disc_" + cc[i]]
                      .value) ||
                  cc[i]
              };
            }
            break;
          default:
            break;
        }
      }
    }
    this.setState({
      filter: this.state.filter,
      showmenulevel2: true,
      categoryindex: 0,
      activeindex: this.state.openMenu,
      activeindex2: 1,
      categorylevel1: true
    });
  };

  getMainUrl = (matchkey: any) => {
    let base = location.origin,
      current_key,
      main_url,
      urllist;
    if (this.props.facets) {
      urllist = this.props.facets.categoryShopDetail;
      urllist.some((url: any) => {
        current_key = Object.keys(url)[0];
        if (matchkey.replace(/\+/g, " ") == current_key) {
          main_url = base + url[current_key];
          return true;
        }
      });
    } else {
      main_url = base + location.pathname;
    }

    return main_url;
  };

  createUrlfromFilter = (load?: any) => {
    let array = this.state.filter,
      filter_url = "",
      category_key: any,
      mainurl: string | undefined = "",
      color_vars = "",
      size_vars = "",
      category_shop_vars = "",
      product_vars = "",
      discount_vars = "";
    Object.keys(array).map((filter_type, i) => {
      Object.keys(array[filter_type]).map((key, i) => {
        switch (filter_type) {
          case "currentColor":
            if (
              array[filter_type][key].value &&
              array[filter_type][key].isChecked
            ) {
              color_vars == ""
                ? (color_vars = array[filter_type][key].value)
                : (color_vars += "|" + array[filter_type][key].value);
            }
            break;
          case "availableSize":
            if (
              array[filter_type][key].value &&
              array[filter_type][key].isChecked
            ) {
              size_vars == ""
                ? (size_vars = array[filter_type][key].value)
                : (size_vars += "|" + array[filter_type][key].value);
            }
            break;
          case "categoryShop":
            category_key = array[filter_type][key];
            Object.keys(category_key).map(data => {
              if (category_key[data]) {
                let orignal_data = data;
                data = encodeURIComponent(data).replace(/%20/g, "+");
                category_shop_vars == ""
                  ? (category_shop_vars = data)
                  : (category_shop_vars += "|" + data);
                mainurl = this.getMainUrl(orignal_data);
              }
            });
            break;
          case "price":
            filter_url += "&" + key + "=" + array[filter_type][key];
            break;
          case "currency":
            filter_url += "&" + key + "=" + array[filter_type][key];
            break;
          case "sort_by":
            filter_url += "&" + key + "=" + array[filter_type][key];
            break;
          case "productType":
            let product = array[filter_type];
            product_vars = "";
            Object.keys(product).map(data => {
              if (product[data]) {
                data = encodeURIComponent(data).replace(/%20/g, "+");
                data = data.replace("pb_", "");
                product_vars == ""
                  ? (product_vars = data)
                  : (product_vars += "|" + data);
              }
            });
            break;
          case "availableDiscount":
            let discount = array[filter_type];
            discount_vars = "";
            Object.keys(discount).map(data => {
              if (discount[data].isChecked) {
                data = encodeURIComponent(data).replace(/%20/g, "+");
                data = data.replace("disc_", "");
                discount_vars == ""
                  ? (discount_vars = data)
                  : (discount_vars += "|" + data);
              }
            });
            break;
          default:
            break;
        }
      });
    });
    color_vars != "" ? (filter_url += "&current_color=" + color_vars) : "";
    size_vars != "" ? (filter_url += "&available_size=" + size_vars) : "";
    category_shop_vars != ""
      ? (filter_url += "&category_shop=" + category_shop_vars)
      : "";
    product_vars != "" ? (filter_url += "&product_type=" + product_vars) : "";
    discount_vars != ""
      ? (filter_url += "&available_discount=" + discount_vars)
      : "";
    if (mainurl == "" || !mainurl) {
      mainurl = location.origin + location.pathname;
    }
    // filter_url = filter_url.replace(/\s/g, "+");
    history.replaceState({}, "", mainurl + "?source=plp" + filter_url);
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
    this.state.filter.price["min_price"] = value[0];
    this.state.filter.price["max_price"] = value[1];
    this.setState({
      filter: this.state.filter,
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
    let value = innerfilter.scrollTop;
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
    let min_maxvalue: any = [],
      current_range: any = [];
    this.createFilterfromUrl();
    let pricearray: any = [],
      currentCurrency =
        "price" +
        this.props.currency[0].toUpperCase() +
        this.props.currency.substring(1).toLowerCase();
    plpList.results.facets[currentCurrency].map(function(a: any) {
      pricearray.push(+a[0]);
    });
    if (pricearray.length > 0) {
      min_maxvalue.push(
        pricearray.reduce(function(a: any, b: any) {
          return Math.min(a, b);
        })
      );
      min_maxvalue.push(
        pricearray.reduce(function(a: any, b: any) {
          return Math.max(a, b);
        })
      );
    }
    if (this.state.filter.price.min_price) {
      current_range.push(this.state.filter.price.min_price);
      current_range.push(this.state.filter.price.max_price);
    } else {
      current_range = min_maxvalue;
    }
    this.setState(
      {
        rangevalue: current_range,
        initialrangevalue: {
          min: min_maxvalue[0],
          max: min_maxvalue[1]
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
    let min_maxvalue: any = [],
      current_range: any = [];
    const { nextUrl, mobile, listdata, currency, dispatch } = this.props;
    if (nextUrl) {
      this.setState({
        disableSelectedbox: true
      });
    }
    if (nextUrl && this.state.flag && this.state.scrollload) {
      this.setState({ flag: false });
      const filterUrl = "?" + nextUrl.split("?")[1];
      const pageSize = mobile ? 10 : 20;
      PlpService.updateProduct(
        dispatch,
        filterUrl + `&page_size=${pageSize}`,
        listdata
      ).then(plpList => {
        this.createFilterfromUrl();
        let pricearray: any = [],
          currentCurrency = "price_" + currency.toLowerCase();
        plpList.results.facets[currentCurrency].map(function(a: any) {
          pricearray.push(+a[0]);
        });
        if (pricearray.length > 0) {
          min_maxvalue.push(
            pricearray.reduce(function(a: number, b: number) {
              return Math.min(a, b);
            })
          );
          min_maxvalue.push(
            pricearray.reduce(function(a: number, b: number) {
              return Math.max(a, b);
            })
          );
        }

        if (this.state.filter.price.min_price) {
          current_range.push(this.state.filter.price.min_price);
          current_range.push(this.state.filter.price.max_price);
        } else {
          current_range = min_maxvalue;
        }

        this.setState(
          {
            rangevalue: current_range,
            initialrangevalue: {
              min: min_maxvalue[0],
              max: min_maxvalue[1]
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
      });
    }
  };

  updateDataFromAPI = (onload?: string) => {
    const { mobile, dispatch } = this.props;
    if (!onload && mobile) {
      return true;
    }
    // this.setState({
    //     disableSelectedbox: true
    // });
    let url = decodeURI(location.href);
    const filterUrl = "?" + url.split("?")[1];

    const pageSize = mobile ? 10 : 20;
    debugger;
    PlpService.fetchPlpProducts(
      dispatch,
      filterUrl + `&page_size=${pageSize}`
    ).then(plpList => {
      this.createList(plpList);
      this.props.updateFacets(this.getSortedFacets(plpList.results.facets));
    });
  };

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillReceiveProps = (nextProps: Props) => {
    if (
      !nextProps.facetObject.category_obj &&
      nextProps.facets.categoryShop &&
      this.props.updateFacets
    ) {
      this.createList(nextProps.data);
      this.props.updateFacets(this.getSortedFacets(nextProps.facets));
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
    let hasPdpScrollableProduct = this.getPdpProduct();
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
    let pdpProductScrollId = this.getPdpProduct().pdpProductDetails.id;
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
  }

  getSortedFacets = (facets: any): any => {
    if (facets.length == 0) return false;
    let categories: any = [],
      subCategories: any = [],
      categoryNames: any = [],
      category_obj: any = {},
      check = "",
      select_index: any = -1;

    if (facets.categoryShop && facets.categoryShop.length > 0) {
      facets.categoryShop.map((v: any, i: number) => {
        var baseCategory = v[0];
        if (facets.categoryShopDetail && facets.categoryShopDetail.length > 0) {
          var categoryUrl = facets.categoryShopDetail.filter(function(
            k: any,
            i: any
          ) {
            return k.hasOwnProperty(baseCategory);
          })[0];
        }
        if (categoryUrl) {
          v.push(categoryUrl[baseCategory]);
        }
        var labelArr = baseCategory.split(">");
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

    for (var i = 0; i < categoryNames.length; i++) {
      facets.subCategories.map(function(v: any, k: any) {
        if (v[0].indexOf(categoryNames[i]) != -1) {
          facets.categories.push(v);
          facets.subCategories.splice(k, 1);
        }
      });
    }

    facets.categories.map((data: any, i: number) => {
      var temp_key = data[0].split(">")[1].trim(),
        view_data = data[0].split(">");
      view_data.length > 2 ? view_data.pop() : "";
      category_obj[temp_key]
        ? false
        : (category_obj[temp_key] = [["View all", view_data.join(">").trim()]]);
      if (data[0].split(">")[2]) {
        category_obj[temp_key].push(
          [data[0].split(">")[2].trim()].concat(data)
        );
      }
    });

    // code for setting all values of filter false
    facets.subCategories.map((data: any, i: number) => {
      let key = data[0].split(">")[1].trim();
      if (this.state.filter.categoryShop[key]) {
        // check that view all is clicked or not by (arrow key >)
        if (this.state.filter.categoryShop[key][data[0]]) {
          // nested_list[1].split('>').length == 2 ? check = data : '';
          select_index = key;
          // this.state.old_selected_category = key;
          // this.state.filter.categoryShop[key][data[0]] = false
        }
      } else {
        this.state.filter.categoryShop[key] = {};
        this.state.filter.categoryShop[key][data[0]] = false;
      }
    });
    let oldSelectedCategory: any = this.state.oldSelectedCategory;
    // code for setting  all values of filter is false
    Object.keys(category_obj).map((data, i) => {
      category_obj[data].map((nested_list: any, j: number) => {
        if (this.state.filter.categoryShop[data]) {
          // check that view all is clicked or not by (arrow key >)
          if (this.state.filter.categoryShop[data][nested_list[1]]) {
            nested_list[1].split(">").length == 2 ? (check = data) : "";
            select_index = data;
            oldSelectedCategory = data;
          } else {
            if (check == data) {
              this.state.filter.categoryShop[data][nested_list[1]] = true;
              select_index = data;
            } else {
              this.state.filter.categoryShop[data][nested_list[1]] = false;
            }
          }
        } else {
          this.state.filter.categoryShop[data] = {};
          this.state.filter.categoryShop[data][nested_list[1]] = false;
        }
      });
    });
    // code for all product_by filter false
    if (facets.categoryProductTypeMapping) {
      Object.keys(facets.categoryProductTypeMapping).map((level4: any) => {
        facets.categoryProductTypeMapping[level4].map((product_by: any) => {
          if (!this.state.filter.productType["pb_" + product_by]) {
            this.state.filter.productType["pb_" + product_by] = false;
          }
        });
      });
    }
    // code for set active open state and set selected old value
    if (!oldSelectedCategory) {
      Object.keys(this.state.filter.categoryShop).map(
        (level2: any, i: number) => {
          Object.keys(this.state.filter.categoryShop[level2]).map(
            (level3: any, j: number) => {
              if (this.state.filter.categoryShop[level2][level3]) {
                select_index = level2;
                oldSelectedCategory = level2.split(">")[0];
              }
            }
          );
        }
      );
    }

    this.setState({
      activeindex2: select_index + "l",
      oldSelectedCategory: oldSelectedCategory,
      filter: this.state.filter
    });
    return { category_obj: category_obj, facets: facets };
  };

  onClickLevel4 = (event: any) => {
    let id = event.target.id;
    this.state.filter.productType[id] = event.target.checked;
    // this.old_level4Value = event.target.value;
    this.setState({
      filter: this.state.filter
    });
    this.createUrlfromFilter();
    event.stopPropagation();
  };

  onClickDiscount = (event: any) => {
    let id = event.target.id;
    let filter = this.state.filter;
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

  createProductType = (category_obj: any, categorydata: any) => {
    let html = [];
    this.productData = [];
    if (!category_obj) return false;
    Object.keys(category_obj).map((data, i) => {
      category_obj[data].map((nested_list: any, j: number) => {
        this.state.filter.categoryShop[data]
          ? this.state.filter.categoryShop[data][nested_list[1]]
            ? categorydata.categoryProductTypeMapping[nested_list[1]].map(
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
    for (let prop in this.state.filter.productType) {
      if (this.productData.indexOf(prop.replace("pb_", "")) == -1) {
        this.state.filter.productType[prop] = false;
      }
    }
    html.push(
      <ul>
        <li>
          <ul className={styles.categorylabel}>
            {this.productData.map((level4: any) => {
              return (
                <li>
                  <input
                    type="checkbox"
                    onClick={this.onClickLevel4}
                    id={"pb_" + level4}
                    checked={
                      this.state.filter.productType["pb_" + level4]
                        ? this.state.filter.productType["pb_" + level4]
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
    let html = [];
    // this.productData = [];
    if (!availableDiscount) return false;
    for (let prop in this.state.filter.availableDiscount) {
      if (
        this.props.facets &&
        this.props.facets.availableDiscount
          .map((discount: any) => discount[0])
          .indexOf(prop.replace("disc_", "")) == -1
      ) {
        // this.state.filter.availableDiscount[prop] = false;
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
                      this.state.filter.availableDiscount["disc_" + discount[0]]
                        ? this.state.filter.availableDiscount[
                            "disc_" + discount[0]
                          ].isChecked
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
    let name = data[0].split(">")[1].trim(),
      id = data[0].trim();
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
                    this.state.filter.categoryShop[name]
                      ? this.state.filter.categoryShop[name][id]
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

  generateCatagory = (category_obj: any, data: any, html: any) => {
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
              {category_obj[data].map((nested_list: any, j: number) => {
                return (
                  <li key={nested_list[1]}>
                    <input
                      type="checkbox"
                      id={nested_list[1]}
                      disabled={this.state.disableSelectedbox}
                      checked={
                        this.state.filter.categoryShop[data]
                          ? this.state.filter.categoryShop[data][nested_list[1]]
                          : false
                      }
                      onClick={this.handleClickCategory}
                      value={data}
                      name={nested_list[0]}
                    />
                    <label htmlFor={nested_list[1]}>{nested_list[0]}</label>
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

  createCatagoryFromFacets = (category_obj: any, categorydata: any) => {
    var html: any = [];
    if (!category_obj) return false;
    let cat = categorydata.categories
      .concat(categorydata.subCategories)
      .filter(function(a: any) {
        return a[0].split(">").length == 2;
      });

    let subcat = cat.sort(function(a: any, b: any) {
      return +a[1] - +b[1];
    });
    subcat.map((data: any) => {
      for (let key in category_obj) {
        if (data[0].indexOf(key) > -1) {
          html = this.generateCatagory(category_obj, key, html);
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
    var view_data = event.target.id.split(">"),
      checkallSelectedValue,
      atleast_one_Selected,
      category_obj = this.state.filter.categoryShop;
    view_data.length > 2 ? view_data.pop() : "";
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
      if (Object.keys(this.state.filter.categoryShop).length > 0) {
        for (let prop in this.state.filter.categoryShop[
          this.state.oldSelectedCategory
        ]) {
          this.state.filter.categoryShop[this.state.oldSelectedCategory][
            prop
          ] = false;
        }
      }
      for (let prop in this.state.filter.productType) {
        this.state.filter.productType[prop] = false;
      }
      // clear filters
      this.clearFilter(undefined, "all", true);
    }

    // code to tick all when clicked on viewall / normal checkbox
    if (event.target.name.indexOf("View all") > -1) {
      this.state.filter.categoryShop[event.target.value] = Object.assign(
        {},
        this.state.filter.categoryShop[event.target.value]
      );
      Object.keys(this.state.filter.categoryShop).map(key => {
        if (key == event.target.value) {
          Object.keys(this.state.filter.categoryShop[key]).map(product => {
            this.state.filter.categoryShop[key][product] = event.target.checked;
          });
        }
      });
    } else {
      this.state.filter.categoryShop[event.target.value] = Object.assign(
        {},
        this.state.filter.categoryShop[event.target.value]
      );
      this.state.filter.categoryShop[event.target.value][event.target.id] =
        event.target.checked;
      checkallSelectedValue = Object.keys(
        this.state.filter.categoryShop[event.target.value]
      ).every(data => {
        if (data.split(">").length < 3) {
          return true;
        } else {
          return this.state.filter.categoryShop[event.target.value][data];
        }
      });
      for (let prop in this.state.filter.productType) {
        if (this.productData.indexOf(prop.replace("pb_", "")) == -1) {
          this.state.filter.productType[prop] = false;
        }
      }
      this.state.filter.categoryShop[event.target.value][
        view_data.join(">").trim()
      ] = checkallSelectedValue ? true : false;
    }

    atleast_one_Selected = Object.keys(category_obj).every((data, i) => {
      let nested_val = Object.keys(category_obj[data]).every(
        (nested_list, j) => {
          return !this.state.filter.categoryShop[data][nested_list];
        }
      );
      return nested_val;
    });
    if (atleast_one_Selected) {
      this.state.filter.categoryShop[event.target.value][
        event.target.id
      ] = true;
      event.target.checked = true;
      return false;
    }

    this.setState({
      filter: this.state.filter,
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
    this.state.filter.currentColor[event.target.id] = {
      isChecked: event.target.checked,
      value: event.target.value
    };
    this.setState({
      filter: this.state.filter
    });
    this.createUrlfromFilter();
    event.stopPropagation();
  };

  createColorCheckbox = (facets: any) => {
    if (!facets.currentColor || facets.length == 0) return false;
    var html: any = [];
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
              this.state.filter.currentColor[data[0]]
                ? this.state.filter.currentColor[data[0]].isChecked
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
    this.state.filter.availableSize[event.target.value] = {
      isChecked: event.target.checked,
      value: event.target.value
    };
    this.setState({
      filter: this.state.filter
    });
    this.createUrlfromFilter(undefined);
    event.stopPropagation();
  };

  deleteFilter = (event: any, key: string, value: any) => {
    if (key == "price") {
      this.state.filter[key] = {};
    } else if (key == "productType") {
      this.state.filter[key][value] = false;
    } else if (key == "availableDiscount") {
      this.state.filter[key][value] = {
        isChecked: false
      };
    } else {
      this.state.filter[key][value] = {
        isChecked: false
      };
    }
    this.setState({
      filter: this.state.filter
    });
    this.createUrlfromFilter();
    event.stopPropagation();
  };

  clearFilter = (event: any, key: string, ischange?: boolean) => {
    const elementCount: any = document.getElementById("currentFilter");
    if ((elementCount ? elementCount.childElementCount : null) == 0)
      return false;
    switch (key) {
      case "currentColor":
        this.state.filter[key] = {};
        break;
      case "availableSize":
        this.state.filter[key] = {};
        break;
      case "price":
        // case 'min_price':
        //     case 'max_price':
        this.state.filter.price = {};
        break;
      case "currency":
        break;
      case "sort_by":
        this.state.filter.sort_by = {};
        break;

      case "productType":
        for (let prop in this.state.filter.productType) {
          this.state.filter.productType[prop] = false;
        }
        break;
      case "availableDiscount":
        for (let prop in this.state.filter.availableDiscount) {
          this.state.filter.availableDiscount[prop].isChecked = false;
        }
        break;
      case "all":
        this.state.filter.currentColor = {};
        this.state.filter.availableSize = {};
        this.state.filter.price = {};
        for (let prop in this.state.filter.productType) {
          this.state.filter.productType[prop] = false;
        }
        for (let prop in this.state.filter.availableDiscount) {
          this.state.filter.availableDiscount[prop].isChecked = false;
        }
        break;
      default:
        break;
    }
    if (!ischange) {
      this.createUrlfromFilter();
    }
    this.setState({
      filter: this.state.filter
    });
    if (event) {
      event.stopPropagation();
    }
  };

  renderFilterList = (filter_obj: any) => {
    var html = [];
    Object.keys(filter_obj).map(data => {
      switch (data) {
        case "currentColor":
        case "availableSize":
          Object.keys(filter_obj[data]).map((data1, index) => {
            if (!filter_obj[data][data1].isChecked) return false;
            html.push(
              <li key={data}>
                <span>{data.split("_")[1]}: </span>
                <span>
                  {data == "currentColor"
                    ? filter_obj[data][data1].value.split("-")[1]
                    : filter_obj[data][data1].value}
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
          if (Object.keys(filter_obj[data]).length == 0) return false;
          html.push(
            <li>
              <span>Price: </span>
              <span>
                {filter_obj[data].min_price}-{filter_obj[data].max_price}
              </span>
              <span onClick={e => this.deleteFilter(e, data, undefined)}>
                x
              </span>
            </li>
          );
          break;
        case "productType":
          Object.keys(filter_obj[data]).map((data1, index) => {
            if (!filter_obj[data][data1]) return false;
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
          Object.keys(filter_obj[data]).map((data1, index) => {
            if (!filter_obj[data][data1].isChecked) return false;
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
                  {filter_obj[data][data1].value}
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
    var html: any = [];
    facets.availableSize.map((data: any, i: number) => {
      html.push(
        <span key={data[0] + i}>
          <input
            type="checkbox"
            id={data[0] + i}
            checked={
              this.state.filter.availableSize[data[0]]
                ? this.state.filter.availableSize[data[0]].isChecked
                : false
            }
            onClick={this.handleClickSize}
            value={data[0]}
          />
          <li>
            <label
              htmlFor={data[0] + i}
              className={
                this.state.filter.availableSize[data[0]] &&
                this.state.filter.availableSize[data[0]].isChecked
                  ? "size-cat select_size"
                  : "size-cat"
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
    event.stopPropagation();
  };

  ClickProductCategory = () => {
    this.setState({
      showProductFilter: !this.state.showProductFilter
    });
  };

  changeValue = (event: any, sort: any) => {
    if (sort.value == "price_asc") {
      this.state.filter.sort_by = { sort_by: "price_asc" };
    } else if (sort.value == "price_desc") {
      this.state.filter.sort_by = { sort_by: "price_desc" };
    } else if (sort.value == "is_new") {
      this.state.filter.sort_by = { sort_by: "is_new" };
    } else if (sort.value == "hc") {
      this.state.filter.sort_by = {};
    }
    this.setState({
      filter: this.state.filter,
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
    event.stopPropagation();
  };

  render() {
    const { mobile } = this.props;
    return (
      <Fragment>
        <ul id="inner_filter" className={styles.filterSideMenu}>
          <li className={styles.filterElements}>
            <span>Filtered By</span>
            <ul id="currentFilter">
              {this.renderFilterList(this.state.filter)}
            </ul>
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
              {this.createCatagoryFromFacets(
                this.props.facetObject.category_obj,
                this.props.facetObject.facets
              )}
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
                this.props.facetObject.category_obj,
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
              COLOUR FAMILY
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
                    className="plp_filter_sub"
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

export default connect(mapStateToProps, mapActionsToProps)(FilterList);
