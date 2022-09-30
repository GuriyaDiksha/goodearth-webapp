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
import iconStyles from "../../styles/iconFonts.scss";
import multiColour from "../../images/multiColour.svg";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";

const mapStateToProps = (state: AppState) => {
  return {
    data: state.searchList.data,
    onload: state.searchList.onload,
    mobile: state.device.mobile,
    currency: state.currency,
    salestatus: state.info.isSale,
    facets: state.searchList.data.results.facets,
    facetObject: state.searchList.facetObject,
    nextUrl: state.searchList.data.next,
    listdata: state.searchList.data.results.data,
    customerGroup: state.user.customerGroup,
    filtered_facets: state.searchList.data.results.filtered_facets
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
      activeindex2: 1,
      selectedCatShop: "View All",
      isViewAll: false,
      urltempData: { categoryObj: {}, id: "" },
      isCategoryClicked: false
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
              // const csKey = cc[i].trim();
              // filter.categoryShop[csKey] = true;
            }
            if (cc.length > 1) {
              let qparam = "";

              cc.map((val: any, index: number) => {
                qparam += index === 0 ? val : qparam ? "|" + val : val;
              });

              filter.categoryShop["selectedCatShop"] = qparam;
            } else if (!cc[0].startsWith("View All")) {
              filter.categoryShop["selectedCatShop"] = cc[0];
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
          case "q":
            filter.q[key] = vars[key];
            break;
          default:
            break;
        }
      }
    }

    if (!this.state.isCategoryClicked) {
      this.setState({
        showmenulevel2: true,
        categoryindex: 0,
        categorylevel1: true
      });
    }
    this.setState({
      filter: filter,
      // showmenulevel2: openCat || this.state.showmenulevel2,
      // categoryindex: openCat ? -1 : 0,
      activeindex: this.state.openMenu,
      activeindex2: 1
      // categorylevel1: openCat || this.state.categorylevel1
    });
  };

  getSortedFacets = (facets: any): any => {
    if (facets.length == 0) return false;
    const categories: any = [],
      subCategories: any = [],
      categoryNames: any = [],
      categoryObj: any = {};
    // counts = {};

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
        // labelArr.shift();

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

    // facets.categories.map((data: any) => (count = count + data[2]));
    // console.log("count facets.categories====",facets.categories,facets.subCategories,facets.categoryShop)
    categoryObj[`View All (${facets.subCategories?.[0][1]})`] = [];

    if (filter.categoryShop["selectedCatShop"]) {
      selectIndex = filter.categoryShop["selectedCatShop"].split(">")[0].trim();
    } else {
      filter.categoryShop[
        "selectedCatShop"
      ] = selectIndex = `View All (${facets.subCategories?.[0][1]})`;
    }

    this.setState({ filter: filter });

    facets.categories.map((data: any, i: number) => {
      const tempKey = data[0].split(">")[0]?.trim(),
        viewData = data[0].split(">");

      // viewData.length > 2 ? viewData.pop() : "";
      if (!categoryObj[tempKey]) {
        categoryObj[tempKey] = [["View all ", viewData.join(">").trim()]];
        categoryObj[tempKey][0][3] = facets?.categoryShopDetail.filter(
          (ele: any) => ele.name === tempKey
        )?.[0]?.["all_count"];
      }

      if (data[0].split(">")[1]) {
        categoryObj[tempKey].push([data[0].split(">")[1].trim()].concat(data));
        // counts[tempKey] = counts[tempKey] + data[2];
        // categoryObj[tempKey][0][3] = counts[tempKey];
      }
    });

    // code for setting all values of filter false
    // facets.subCategories.map((data: any, i: number) => {
    //   const key = data[0].split(">")[0]?.trim();
    //   if (filter.categoryShop[key]) {
    //     // check that view all is clicked or not by (arrow key >)
    //     if (filter.categoryShop[key][data[0]]) {
    //       // nestedList[1].split('>').length == 2 ? check = data : '';
    //       selectIndex = key;
    //       // this.state.old_selected_category = key;
    //       // filter.categoryShop[key][data[0]] = false
    //     }
    //   } else {
    //     filter.categoryShop[key] = {};
    //     filter.categoryShop[key][data[0]] = false;
    //   }
    // });
    //  let oldSelectedCategory: any = this.state.oldSelectedCategory;
    // code for setting  all values of filter is false
    // Object.keys(categoryObj).map((data, i) => {
    //   categoryObj[data].map((nestedList: any, j: number) => {
    //     if (filter.categoryShop[data]) {
    //       // check that view all is clicked or not by (arrow key >)
    //       if (filter.categoryShop[data][nestedList[1]]) {
    //         nestedList[1].split(">").length == 2 ? (check = data) : "";
    //         selectIndex = data;
    //         oldSelectedCategory = data;
    //       } else {
    //         if (check == data) {
    //           filter.categoryShop[data][nestedList[1]] = true;
    //           selectIndex = data;
    //         } else {
    //           filter.categoryShop[data][nestedList[1]] = false;
    //         }
    //       }
    //     } else {
    //       filter.categoryShop[data] = {};
    //       filter.categoryShop[data][nestedList[1]] = false;
    //     }
    //   });
    // });
    // code for all product_by filter false
    // if (facets.categoryProductTypeMapping) {
    //   Object.keys(facets.categoryProductTypeMapping).map((level4: any) => {
    //     facets.categoryProductTypeMapping[level4].map((productBy: any) => {
    //       if (!filter.productType["pb_" + productBy]) {
    //         filter.productType["pb_" + productBy] = false;
    //       }
    //     });
    //   });
    // }
    //code for set active open state and set selected old value
    //if (!oldSelectedCategory) {

    // Object.keys(filter.categoryShop).map((level2: any, i: number) => {
    //   Object.keys(filter.categoryShop[level2]).map(
    //     (level3: any, j: number) => {
    //       if (filter.categoryShop[level2][level3]) {
    //         selectIndex = level2;
    //         oldSelectedCategory = level2.split(">")[0];
    //       }
    //     }
    //   );
    //});
    //}
    this.handleAnimation(selectIndex + "l", false, true);

    this.setState({
      activeindex2: selectIndex + "l",
      // oldSelectedCategory: oldSelectedCategory,
      filter: filter,
      isViewAll: filter.categoryShop["selectedCatShop"].includes("|")
    });

    return { categoryObj: categoryObj, facets: facets };
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
    const { isViewAll, urltempData, filter } = this.state;
    const { history } = this.props;
    let filterUrl = "",
      mainurl: string | undefined = "",
      colorVars = "",
      sizeVars = "",
      categoryShopVars = "",
      productVars = "",
      discountVars = "",
      searchValue = "",
      categoryKey: any;

    if (isViewAll) {
      let qparam = "";
      Object.keys(urltempData?.categoryObj).map(ele => {
        if (ele.trim() == urltempData?.id.split(">")[0].trim()) {
          urltempData?.categoryObj[ele].map((val: any, index: number) => {
            qparam += index === 0 ? "" : qparam ? "|" + val[1] : val[1];
          });
        }
      });

      filter.categoryShop["selectedCatShop"] = qparam;
    } else if (urltempData?.id !== "all") {
      filter.categoryShop["selectedCatShop"] = urltempData?.id;
    } else if (filter.categoryShop["selectedCatShop"]?.startsWith("View All")) {
      filter.categoryShop["selectedCatShop"] = "";
    }

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
            // if (array[filterType][key]) {
            //   categoryShopVars = encodeURIComponent(key).replace(/%20/g, "+");
            //   console.log("categoryShop=======",categoryShopVars,filterType)
            // }
            categoryKey = array[filterType][key];

            //Object.keys(categoryKey).map(data => {
            if (categoryKey) {
              categoryShopVars = encodeURIComponent(categoryKey).replace(
                /%20/g,
                "+"
              );

              // categoryShopVars == ""
              //   ? (categoryShopVars = data)
              //   : (categoryShopVars += "|" + data);
              // mainurl = this.getMainUrl(orignalData);
            }
            //});
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
      rangevalue: [value[0], value[1]],
      isCategoryClicked: true
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
        rangevalue: [value[0], value[1]],
        isCategoryClicked: true
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
      const filterUrl = "?" + nextUrl.split("?")[1];
      // const pageSize = mobile ? 10 : 20;
      const pageSize = 20;
      this.setState({ isLoading: true });
      changeLoader?.(true);
      updateProduct(filterUrl + `&page_size=${pageSize}`, listdata)
        .then(searchList => {
          changeLoader?.(false);
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
          searchList.results.filtered_facets[currentCurrency]?.map(function(
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
              totalItems: searchList.count
            },
            () => {
              if (!this.state.scrollView && this.state.shouldScroll) {
                this.handleProductSearch();
              }
            }
          );
          this.props.updateFacets(
            this.getSortedFacets(searchList.results.facets)
          );
        })
        .finally(() => {
          this.setState({ isLoading: false });
          changeLoader?.(false);
        });
    }
  };

  updateDataFromAPI = (onload?: string) => {
    const { mobile, fetchSearchProducts, history, changeLoader } = this.props;
    if (!onload && mobile) {
      // return true;
    }
    // this.setState({
    //     disableSelectedbox: true
    // });
    const url = decodeURI(history.location.search);
    const filterUrl = "?" + url.split("?")[1];

    // const pageSize = mobile ? 10 : 20;
    const pageSize = 20;
    this.setState({ isLoading: true });
    changeLoader?.(true);
    fetchSearchProducts(filterUrl + `&page_size=${pageSize}`)
      .then(searchList => {
        changeLoader?.(false);
        valid.productImpression(searchList, "PLP", this.props.currency);
        this.createList(searchList);
        this.props.updateFacets(
          this.getSortedFacets(searchList.results.facets)
        );
      })
      .finally(() => {
        changeLoader?.(false);
        this.setState({ isLoading: false });
      });
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
      this.handleAnimation("category", false);
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
          this.createUrlfromFilter();
          nextProps.mobile ? this.updateDataFromAPI("load") : "";
        }
      );
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
  }

  handleAnimation = (id: string, isShow: boolean, isSubCat = false) => {
    if (typeof document == "object" && document.getElementById(id)) {
      if (!isShow) {
        if (
          isSubCat &&
          typeof document == "object" &&
          document.getElementById("category")
        ) {
          document.getElementById(
            "category"
          ).style.maxHeight = document.getElementById("category")?.scrollHeight
            ? `${Number(
                (document.getElementById("category")?.scrollHeight || 0) +
                  (document.getElementById(id)?.scrollHeight || 0)
              )}px`
            : "max-content";
        }
        document.getElementById(id).style.maxHeight = document.getElementById(
          id
        )?.scrollHeight
          ? `${document.getElementById(id)?.scrollHeight}px`
          : "max-content";
      } else {
        document.getElementById(id).style.maxHeight = "0px";
      }
    }
  };

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

  generateCatagory = (categoryObj: any, data: any, html: any) => {
    const { filter, isViewAll } = this.state;

    html.push(
      <ul key={`category-${data}`}>
        <li key={data + "l"}>
          <span
            className={cs(
              this.state.showmenulevel2 && this.state.activeindex2 == data + "l"
                ? cs(
                    data.startsWith("View All")
                      ? styles.menulevel2ViewAll
                      : styles.menulevel2,
                    data.startsWith("View All")
                      ? styles.menulevel2ViewAll
                      : styles.menulevel2Open
                  )
                : data.startsWith("View All")
                ? styles.menulevel2ViewAll
                : styles.menulevel2,
              this.state.activeindex2 == data + "l"
                ? styles.selectedCatShop
                : ""
            )}
            onClick={() => {
              this.Clickmenulevel2(data + "l");
              this.handleAnimation(
                data + "l",
                this.state.showmenulevel2 &&
                  this.state.activeindex2 == data + "l",
                true
              );
            }}
          >
            {data}
          </span>
          <div
            id={data + "l"}
            className={
              this.state.showmenulevel2 && this.state.activeindex2 == data + "l"
                ? styles.showheader2
                : styles.hideDiv
            }
          >
            <ul className={styles.categorylabel}>
              {categoryObj[data].map((nestedList: any, j: number) => {
                return (
                  <li key={nestedList[0]}>
                    {/* <input
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
                    /> */}
                    <label
                      className={
                        (!isViewAll &&
                          filter.categoryShop["selectedCatShop"]
                            ?.split(">")[1]
                            ?.trim() === nestedList[0]) ||
                        (isViewAll &&
                          nestedList[0]?.startsWith("View all") &&
                          filter.categoryShop["selectedCatShop"]?.split("|")
                            .length &&
                          filter.categoryShop["selectedCatShop"]
                            ?.split(">")[0]
                            .trim() === data)
                          ? styles.selectedCatShop
                          : ""
                      }
                      htmlFor={nestedList[1]}
                      id={nestedList[1]}
                      onClick={e =>
                        this.handleClickCategory(
                          e,
                          data,
                          categoryObj,
                          nestedList[0]?.startsWith("View all")
                        )
                      }
                    >
                      {nestedList[0]}
                      {nestedList[3] && ` (${nestedList[3]})`}
                    </label>
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

  generateSubCatagory = (data: any, html: any, categoryObj: any) => {
    const name = data && data?.[0].split(">")?.[1]?.trim(),
      id = data?.[0]?.trim();

    html.push(
      <ul
        className={cs(styles.categorylabel, styles.searchCategory)}
        key={`subcategory-${name}-${id}`}
      >
        <li className={styles.categoryTitle} key={id}>
          <span
            className={
              Object.keys(this.state.filter.categoryShop).length == 0
                ? globalStyles.cerise
                : ""
            }
            // onClick={this.handleClickCategory}
            data-value="all"
            id="all"
          >
            All (
            {categoryObj.categoryShop?.[0]
              ? categoryObj.categoryShop.filter(
                  (category: any) => category?.[0] == "All"
                )?.[0][1]
              : "0"}
            )
          </span>
        </li>
      </ul>
    );

    return html;
  };

  createCatagoryFromFacets = (categoryObj: any, categorydata: any) => {
    // const html: any = [];
    // if (!categoryObj.categoryShop) return false;

    // if (categoryObj.categoryShop) {
    //   html.push(
    //     <ul className={cs(styles.categorylabel, styles.searchCategory)}>
    //       <li className={styles.categoryTitle}>
    //         <span
    //           className={
    //             Object.keys(this.state.filter.categoryShop).length == 0
    //               ? globalStyles.cerise
    //               : ""
    //           }
    //           onClick={this.handleClickCategory}
    //           data-value="all"
    //           id="all"
    //         >
    //           All (
    //           {categoryObj.categoryShop[0]
    //             ? categoryObj.categoryShop.filter(
    //                 (category: any) => category[0] == "All"
    //               )[0][1]
    //             : "0"}
    //           )
    //         </span>
    //       </li>
    //     </ul>
    //   );
    // }
    // categoryObj.categoryShop.map((data: any, i: number) => {
    //   if (data[0] == "All") return false;
    //   const len = data[0].split(">").length;
    //   html.push(
    //     <ul className={cs(styles.categorylabel, styles.searchCategory)}>
    //       <li className={styles.categoryTitle}>
    //         <span
    //           className={
    //             this.state.filter.categoryShop[data[0]]
    //               ? globalStyles.cerise
    //               : ""
    //           }
    //           onClick={this.handleClickCategory}
    //           data-value={data}
    //           id={data[0]}
    //         >
    //           {data[0].split(">")[len - 1] + " (" + data[2] + ")"}
    //         </span>
    //       </li>
    //     </ul>
    //   );
    // });

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

    for (const key in categoryObj) {
      html = this.generateCatagory(categoryObj, key, html);
    }

    subcat.map((data: any) => {
      categorydata.subCategories.map((sub: any) => {
        if (data[0].indexOf(sub[0]) > -1) {
          // html = this.generateSubCatagory(sub, html, categoryObj);
        }
      });
    });

    return html;
  };

  handleClickCategory = (
    event: any,
    data: any,
    categoryObj: any,
    isViewAll: boolean
  ) => {
    //code for checked view all true

    const { filter } = this.state;
    filter.categoryShop = {};
    if (event.target.id == "all") {
      // do nothing
    } else {
      // if (isViewAll) {
      //   let qparam = "";
      //   Object.keys(categoryObj).map(ele => {
      //     if (ele.trim() == event.target.id.split(">")[0].trim()) {
      //       categoryObj[ele].map((val: any, index: number) => {
      //         qparam += index === 0 ? "" : qparam ? "|" + val[1] : val[1];
      //       });
      //     }
      //   });
      //   filter.categoryShop["selectedCatShop"] = qparam;
      // } else {
      //   filter.categoryShop["selectedCatShop"] = event.target.id;
      // }
    }
    if (filter.sortBy["sortBy"] == "discount") {
      filter.sortBy = {};
    }
    this.clearFilter(undefined, "all", true);
    this.setState(
      {
        filter: filter,
        selectedCatShop: data,
        isViewAll: isViewAll,
        urltempData: { categoryObj: categoryObj, id: event.target.id }
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

    if (isNaN(index || 0) && index?.startsWith("View All")) {
      this.handleClickCategory(
        { target: { id: "all" } },
        "View All",
        null,
        false
      );
    }
  };

  handleClickColor = (event: any) => {
    const { filter } = this.state;
    filter.currentColor[event.target.id] = {
      isChecked: event.target.checked,
      value: event.target.value
    };
    this.setState({
      filter: filter,
      isCategoryClicked: true
    });
    this.createUrlfromFilter();
    event.stopPropagation();
  };

  createColorCheckbox = (facets: any, filtered_facets: any) => {
    if (!facets.currentColor || facets.length == 0) return false;
    const html: any = [];
    const { filter } = this.state;
    facets.currentColor.map((data: any, i: number) => {
      const color: any = {
        "--my-color-var": "#" + data[0].split("-")[0]
      };
      const multicolorImage: any = {
        "--my-bg-image": `url(${multiColour})`
      };
      if (data[0].toLowerCase() == "multicolor") {
        html.push(
          <li
            className={cs(styles.colorlabel, styles.multicolorlabel)}
            key={data[0]}
          >
            <input
              type="checkbox"
              id={data}
              checked={
                filter.currentColor[data[0]]
                  ? filter.currentColor[data[0]].isChecked
                  : false
              }
              onClick={this.handleClickColor}
              value={data[0]}
              // disabled={
              //   filtered_facets?.currentColor.filter(
              //     (e: string[]) => e[0] === data[0]
              //   ).length === 0
              // }
            />
            <label
              className={
                filtered_facets?.currentColor.filter(
                  (e: string[]) => e[0] === data[0]
                ).length === 0
                  ? styles.disableColors
                  : ""
              }
              htmlFor={data[0]}
              style={multicolorImage}
            >
              {data[0].split("-")[0]}
            </label>
          </li>
        );
      } else {
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
              // disabled={
              //   filtered_facets?.currentColor.filter(
              //     (e: string[]) => e[0] === data[0]
              //   ).length === 0
              // }
            />
            <label
              className={
                filtered_facets?.currentColor.filter(
                  (e: string[]) => e[0] === data[0]
                ).length === 0
                  ? styles.disableColors
                  : ""
              }
              htmlFor={data[0]}
              style={color}
            >
              {data[0].split("-")[1]}
            </label>
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
    this.setState(
      {
        filter: filter,
        isCategoryClicked: true
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
    if (key == "price" || key == "all") {
      this.setState({
        rangevalue: [
          this.state.initialrangevalue.min,
          this.state.initialrangevalue.max
        ]
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
                <span>{data == "currentColor" ? "Color" : "Size"}: </span>
                <ul>{filter}</ul>
              </li>
            );
            filterCount += filter.length;
          }
          break;
        }
        case "categoryShop":
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
    if (html.length > 0) {
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
            // disabled={
            //   filtered_facets?.availableSize.filter(
            //     (e: string[]) => e[0] === data[0]
            //   ).length === 0
            // }
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
    } else if (sort == "discount") {
      filter.sortBy = { sortBy: "discount" };
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
    const { filter } = this.state;
    const newFilter = {
      ...filter,
      currentColor: {},
      availableSize: {},
      categoryShop: {},
      price: {},
      availableDiscount: {},
      productType: {},
      currency: {},
      q: {
        q: value
      }
    };
    this.setState(
      {
        filter: newFilter
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
          <li
            className={cs(styles.filterElements, {
              [styles.noBorder]:
                this.renderFilterList(filter).length == 0 && mobile
            })}
          >
            {!mobile && <span>Filter By</span>}
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
                this.handleAnimation(
                  "category",
                  this.state.categoryindex == 0 && this.state.categorylevel1
                );
              }}
            >
              Category
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
          {this.props.salestatus && (
            <li
              className={
                this.props.facets &&
                this.props.facets.availableDiscount &&
                this.props.facets.availableDiscount.length > 0
                  ? ""
                  : (styles.removeBorder, globalStyles.hidden)
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
                  onClick={() => {
                    this.toggleFilterByDiscountMenu();
                    this.handleAnimation(
                      "discount",
                      this.state.showFilterByDiscountMenu
                    );
                  }}
                >
                  FILTER BY DISCOUNT
                </span>
              ) : (
                ""
              )}
              <div
                id="discount"
                className={
                  this.state.showFilterByDiscountMenu
                    ? styles.showheader1
                    : styles.hideDiv
                }
              >
                {this.createDiscountType(
                  this.props.facets && this.props.facets.availableDiscount
                )}
                <div data-name="availableDiscount">
                  <span
                    onClick={e => this.clearFilter(e, "availableDiscount")}
                    className={styles.plp_filter_sub}
                  >
                    Clear
                  </span>
                </div>
              </div>
            </li>
          )}
          <li
            className={
              this.productData.length > 0 ? "" : `${styles.removeBorder} hidden`
            }
          >
            {this.productData.length > 0 ? (
              <span
                className={
                  this.state.showProductFilter
                    ? cs(styles.menulevel1, styles.menulevel1Open)
                    : globalStyles.menulevel1
                }
                onClick={() => {
                  this.ClickProductCategory();
                  this.handleAnimation(
                    "producttype",
                    this.state.showProductFilter
                  );
                }}
              >
                PRODUCT TYPE
              </span>
            ) : (
              ""
            )}
            <div
              id="producttype"
              className={
                this.state.showProductFilter
                  ? styles.showheader1
                  : styles.hideDiv
              }
            >
              {this.createProductType(
                this.props.facetObject.categoryObj,
                this.props.facets
              )}
              <div data-name="productType">
                <span
                  onClick={e => this.clearFilter(e, "productType")}
                  className={styles.plp_filter_sub}
                >
                  Clear
                </span>
              </div>
            </div>
          </li>
          <li
            className={
              this.props.facets?.currentColor?.length > 0
                ? ""
                : (globalStyles.hidden, styles.removeBorder)
            }
          >
            <span
              className={
                this.state.activeindex == 1 && this.state.showmenulevel1
                  ? cs(styles.menulevel1, styles.menulevel1Open)
                  : styles.menulevel1
              }
              onClick={() => {
                this.Clickmenulevel1(1);
                this.handleAnimation(
                  "color",
                  this.state.activeindex == 1 && this.state.showmenulevel1
                );
              }}
            >
              COLOR
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
                <div data-name="currentColor">
                  <span
                    onClick={e => this.clearFilter(e, "currentColor")}
                    className={styles.plp_filter_sub}
                  >
                    Clear
                  </span>
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
                  onClick={() => {
                    this.Clickmenulevel1(2);
                    this.handleAnimation(
                      "size",
                      this.state.activeindex == 2 && this.state.showmenulevel1
                    );
                  }}
                >
                  size
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
                  <div data-name="availableSize">
                    <span
                      onClick={e => this.clearFilter(e, "availableSize")}
                      className={styles.plp_filter_sub}
                    >
                      Clear
                    </span>
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
              onClick={() => {
                this.Clickmenulevel1(3);
                this.handleAnimation(
                  "price",
                  this.state.activeindex == 3 && this.state.showmenulevel1
                );
              }}
            >
              Price
            </span>
            <div
              id="price"
              className={
                this.state.activeindex == 3 && this.state.showmenulevel1
                  ? "showheader1"
                  : styles.hideDiv
              }
            >
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
              <div className={styles.sliderText}>
                <div className={styles.sliderBox}>
                  {this.state.rangevalue[0]}
                </div>

                <div className={styles.sliderBox}>
                  {this.state.rangevalue[1]}
                </div>
              </div>
              <div data-name="price">
                <span
                  onClick={e => this.clearFilter(e, "price")}
                  className={styles.plp_filter_sub}
                >
                  Clear
                </span>
              </div>
            </div>
          </li>
        </ul>
        {mobile ? (
          <div className={cs(styles.filterButton, bootstrap.row)}>
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
