import loadable from "@loadable/component";
import React, { Fragment, ReactNode } from "react";
import SecondaryHeader from "components/SecondaryHeader";
import SelectableDropdownMenu from "components/dropdown/selectableDropdownMenu";
import initActionSearch from "./initAction";
import { DropdownItem } from "components/dropdown/baseDropdownMenu/typings";
import cs from "classnames";
import { AppState } from "reducers/typings";
import { connect } from "react-redux";
import iconStyles from "../../styles/iconFonts.scss";
import styles from "./styles.scss";
import globalStyles from "styles/global.scss";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
import FilterListSearch from "./filterList";
import PlpDropdownMenu from "components/PlpDropDown";
import PlpResultItem from "components/plpResultItem";
import ModalActions from "../../components/Modal/mapper/actions";
// import Loader from "components/Loader";
// import MakerEnhance from "maker-enhance";
import { PartialProductItem } from "typings/product";
import { WidgetImage } from "components/header/typings";
import { Dispatch } from "redux";
import HeaderService from "services/headerFooter";
import { withRouter, RouteComponentProps, Link } from "react-router-dom";
import { updateComponent, updateModal } from "actions/modal";
import GiftcardItem from "components/plpResultItem/giftCard";

const Quickview = loadable(() => import("components/Quickview"));

const mapStateToProps = (state: AppState) => {
  return {
    plpProductId: state.searchList.searchProductId,
    facetObject: state.searchList.facetObject,
    data: state.searchList.data,
    location: state.router.location,
    currency: state.currency,
    device: state.device
  };
};
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    fetchFeaturedContent: async () => {
      const res = HeaderService.fetchSearchFeaturedContent(dispatch);
      return res;
    },
    updateComponentModal: (component: ReactNode, fullscreen?: boolean) => {
      dispatch(updateComponent(component, fullscreen));
    },
    changeModalState: (data: boolean) => {
      dispatch(updateModal(data));
    }
  };
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  ReturnType<typeof ModalActions> &
  RouteComponentProps;
// &
// DispatchProp;

class Search extends React.Component<
  Props,
  {
    filterData: string;
    showmobileSort: boolean;
    mobileFilter: boolean;
    searchText: string;
    sortValue: string;
    searchMaker: boolean;
    featureData: WidgetImage[];
  }
> {
  private child: any = FilterListSearch;
  constructor(props: Props) {
    super(props);
    const queryString = props.location.search;
    const urlParams = new URLSearchParams(queryString);
    const param = urlParams.get("sort_by");
    const searchValue = urlParams.get("q");
    this.state = {
      filterData: "All",
      showmobileSort: false,
      mobileFilter: false,
      searchText: searchValue ? searchValue : "",
      sortValue: param ? param : "hc",
      searchMaker: false,
      featureData: []
    };
  }

  onchangeFilter = (data: any): void => {
    this.child.changeValue(null, data);
    const {
      device: { mobile }
    } = this.props;
    if (mobile) {
      this.child.clickCloseFilter();
    }
  };

  onClickQuickView = (id: number) => {
    const { updateComponentModal, changeModalState, plpProductId } = this.props;
    updateComponentModal(
      <Quickview id={id} productListId={plpProductId} />,
      true
    );
    changeModalState(true);
  };
  componentDidMount() {
    this.setState({
      searchMaker: true
    });
    dataLayer.push({
      event: "SearchView",
      PageURL: this.props.location.pathname,
      PageTitle: "virtual_search_view"
    });
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

  handleChange = (event: any) => {
    this.setState({
      searchText: event.target.value
    });
  };

  onEnterSearch = (event: any) => {
    if (event.keyCode == 13) {
      this.child.changeSearchValue(this.state.searchText);
    }
  };

  gtmPushSearchClick = (e: any, item: PartialProductItem, i: number) => {
    const index = item.categories.length - 1;
    let category = item.categories[index].replace(/\s/g, "");
    category = category.replace(/>/g, "/");
    localStorage.setItem("list", "Search Page");
    if (item.childAttributes && item.childAttributes.length > 0) {
      const product = (item.childAttributes as any).map((skuItem: any) => {
        return {
          name: item.title,
          id: skuItem.sku,
          price:
            skuItem.discountedPriceRecords[this.props.currency] ||
            skuItem.priceRecords[this.props.currency],
          brand: "Goodearth",
          category: category,
          variant: skuItem.color ? skuItem.color[0] : skuItem.size || "",
          position: i
        };
      });
      // let cur = this.state.salestatus ? item.product.discounted_pricerecord[window.currency] : item.product.pricerecords[window.currency]
      dataLayer.push({
        event: "productClick",
        ecommerce: {
          currencyCode: this.props.currency,
          click: {
            actionField: { list: "Search Page" },
            products: product
          }
        }
      });
    }
  };

  showProduct(data: PartialProductItem | WidgetImage, indices: number) {
    this.props.history.push((data as WidgetImage).ctaUrl);
  }

  addDefaultSrc = (e: any) => {
    // e.target.src = "/static/img/noimageplp.png";
  };

  onClickSearch = (event: any) => {
    this.child.changeSearchValue(this.state.searchText);
  };

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    const queryString = nextProps.location.search;
    const urlParams = new URLSearchParams(queryString);
    const searchValue = urlParams.get("q");
    if (searchValue !== this.state.searchText) {
      this.setState({
        searchText: searchValue ? searchValue : ""
      });
    }
  }

  render() {
    const {
      device: { mobile },
      currency,
      data: {
        results: { banner, data },
        count
      }
    } = this.props;
    // const { searchMaker } = this.state;
    const items: DropdownItem[] = [
      {
        label: "Our Curation",
        value: "hc"
      },
      {
        label: "Newest",
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
    return (
      <div className={cs(styles.pageBody, bootstrap.containerFluid)}>
        {!mobile && (
          <SecondaryHeader classname={styles.subHeader}>
            <Fragment>
              <div
                className={cs(
                  bootstrap.colMd7,
                  bootstrap.offsetMd1,
                  styles.searchBlockPage
                )}
              >
                <input
                  type="text"
                  placeholder="Looking for something?"
                  value={this.state.searchText}
                  onKeyUp={this.onEnterSearch}
                  onChange={this.handleChange}
                />
                <i
                  className={cs(
                    iconStyles.icon,
                    iconStyles.iconSearch,
                    styles.iconSearchbar
                  )}
                  onClick={this.onClickSearch}
                ></i>
              </div>
              <div className={cs(bootstrap.colMd3, styles.innerHeader)}>
                <p className={styles.filterText}>Sort</p>
                <SelectableDropdownMenu
                  align="right"
                  className={styles.dropdownRoot}
                  items={items}
                  value="hc"
                  onChange={this.onchangeFilter}
                  showCaret={true}
                ></SelectableDropdownMenu>
              </div>
            </Fragment>
          </SecondaryHeader>
        )}
        <div className={cs(bootstrap.row, globalStyles.minimumWidth)}>
          <div
            id="filter_by"
            className={
              mobile
                ? this.state.mobileFilter
                  ? cs(bootstrap.col12, styles.mobileFilterMenu)
                  : globalStyles.hidden
                : cs(bootstrap.colMd2, styles.filterSticky)
            }
          >
            <FilterListSearch
              key={"search"}
              onRef={(el: any) => (this.child = el)}
              onChangeFilterState={this.onChangeFilterState}
            />
          </div>
          <div
            className={cs(
              { [globalStyles.hidden]: this.state.showmobileSort },
              { [globalStyles.paddTop80]: !this.state.showmobileSort },
              { [styles.spCat]: !this.state.showmobileSort },
              bootstrap.colMd10,
              bootstrap.col12
            )}
          >
            {/* <div className={cs(bootstrap.row, globalStyles.voffset5)}>
                  <div className={cs(bootstrap.colMd10, bootstrap.offsetMd1, bootstrap.col12, globalStyles.textCenter)}>
                      <div className={styles.npfMsg}>No products were found matching
                      </div>
                  </div>
              </div> */}
            {/* {banner ?
                  <div className="row banner-mobile-category">
                      {window.maker.plp ? <MakerEnhance user='goodearth'/> : ""}
                      <div className="col-xs-12 text-center" >
                          <img src={banner} className="img-responsive" />
                      </div>
                  </div> : ""} */}
            {/* {searchMaker && (
              <MakerEnhance
                user="goodearth"
                index="1"
                href={`${window.location.origin}${this.props.location.pathname}?${this.props.location.search}`}
              />
            )} */}
            {!mobile && data.length ? (
              <div
                className={cs(
                  styles.productNumber,
                  globalStyles.voffset5,
                  styles.imageContainer,
                  {
                    [styles.border]: mobile
                  }
                )}
              >
                <span>
                  {count > 1
                    ? count + " products found"
                    : count + " product found"}{" "}
                </span>
              </div>
            ) : (
              ""
            )}
            <div
              className={
                mobile
                  ? banner
                    ? cs(bootstrap.row, styles.imageContainerMobileBanner)
                    : cs(bootstrap.row, bootstrap.imageContainerMobile)
                  : cs(bootstrap.row, styles.imageContainer, styles.minHeight)
              }
              id="product_images"
            >
              {data.map((item, i) => {
                return (
                  <div
                    className={cs(
                      bootstrap.colMd4,
                      bootstrap.col6,
                      styles.setWidth
                    )}
                    key={item.id}
                    onClick={e => {
                      this.gtmPushSearchClick(e, item, i);
                    }}
                  >
                    {item.productClass != "GiftCard" ? (
                      <PlpResultItem
                        page="Search"
                        position={i}
                        product={item}
                        addedToWishlist={false}
                        currency={currency}
                        key={item.id}
                        mobile={mobile}
                        onClickQuickView={this.onClickQuickView}
                        isCorporate={false}
                      />
                    ) : (
                      <GiftcardItem />
                    )}
                  </div>
                );
              })}
            </div>
            <div
              className={
                (data && this.state.searchText
                ? data.length == 0 && this.state.searchText.length > 2
                : false)
                  ? " voffset5 row image-container search searchpage mobile-nosearch"
                  : globalStyles.hidden
              }
            >
              <div
                className={cs(
                  bootstrap.row,
                  globalStyles.marginT50,
                  styles.minheight
                )}
              >
                <div
                  className={cs(
                    bootstrap.colMd12,
                    bootstrap.col12,
                    globalStyles.textCenter
                  )}
                >
                  {(this.state.searchText ? (
                    this.state.searchText.length > 1
                  ) : (
                    false
                  )) ? (
                    <div className={styles.npfMsg}>
                      No products were found matching &nbsp;
                      <span>{this.state.searchText}</span>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <div
                  className={cs(
                    bootstrap.colMd12,
                    styles.searchHeading,
                    globalStyles.textCenter
                  )}
                >
                  <h2 className={globalStyles.voffset5}>Featured Categories</h2>
                </div>
                <div className={cs(bootstrap.col12, globalStyles.voffset3)}>
                  <div className={bootstrap.row}>
                    <div
                      className={cs(
                        bootstrap.colMd12,
                        bootstrap.col12,
                        styles.noResultPadding,
                        styles.checkheight,
                        { [styles.checkheightMobile]: mobile }
                      )}
                    >
                      {this.state.featureData.length > 0
                        ? this.state.featureData.map((data, i) => {
                            return (
                              <div
                                key={i}
                                className={cs(bootstrap.colMd3, bootstrap.col6)}
                              >
                                <div className={styles.searchImageboxNew}>
                                  <Link
                                    to={data.ctaUrl}
                                    onClick={this.showProduct.bind(
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
                                    {data.ctaText}
                                  </p>
                                  <p className={styles.searchFeature}>
                                    <Link
                                      to={data.ctaUrl}
                                      onClick={this.showProduct.bind(
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
                  {mobile ? (
                    ""
                  ) : (
                    <div className={bootstrap.row}>
                      <div className={cs(bootstrap.colMd12, bootstrap.col12)}>
                        <div className={cs(styles.searchBottomBlockSecond)}>
                          <div className=" text-center"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {mobile && (
          <PlpDropdownMenu
            list={items}
            onChange={this.onchangeFilter}
            onStateChange={this.onChangeFilterState}
            showCaret={this.state.showmobileSort}
            open={false}
            value="hc"
          />
        )}
      </div>
    );
  }
}

const SearchRoute = withRouter(Search);
export default connect(mapStateToProps, mapDispatchToProps)(SearchRoute);
export { initActionSearch };
