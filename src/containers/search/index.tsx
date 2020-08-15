import loadable from "@loadable/component";
import React, { Fragment } from "react";
import SecondaryHeader from "components/SecondaryHeader";
import SelectableDropdownMenu from "components/dropdown/selectableDropdownMenu";
import initActionSearch from "./initAction";
import { DropdownItem } from "components/dropdown/baseDropdownMenu/typings";
import cs from "classnames";
import { AppState } from "reducers/typings";
import { connect, DispatchProp } from "react-redux";
import iconStyles from "../../styles/iconFonts.scss";
import styles from "./styles.scss";
import globalStyles from "styles/global.scss";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
import FilterListSearch from "./filterList";
import PlpDropdownMenu from "components/PlpDropDown";
import PlpResultItem from "components/plpResultItem";
import mapDispatchToProps from "../../components/Modal/mapper/actions";
// import Loader from "components/Loader";
import MakerEnhance from "../../components/maker";
import { PartialProductItem } from "typings/product";

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
type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  DispatchProp;

class Search extends React.Component<
  Props,
  {
    filterData: string;
    showmobileSort: boolean;
    mobileFilter: boolean;
    searchText: string;
    sortValue: string;
    searchMaker: boolean;
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
      searchMaker: false
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
          price: skuItem.priceRecords[this.props.currency],
          brand: "Goodearth",
          category: category,
          variant: skuItem.color ? skuItem.color[0] : "",
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

  onClickSearch = (event: any) => {
    this.child.changeSearchValue(this.state.searchText);
  };

  render() {
    const {
      device: { mobile },
      currency,
      data: {
        results: { banner, data },
        count
      }
    } = this.props;
    const { searchMaker } = this.state;
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
      <div className={styles.pageBody}>
        {mobile ? (
          <PlpDropdownMenu
            list={items}
            onChange={this.onchangeFilter}
            onStateChange={this.onChangeFilterState}
            showCaret={this.state.showmobileSort}
            open={false}
            value="hc"
          />
        ) : (
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
            {searchMaker && (
              <MakerEnhance
                user="goodearth"
                index="1"
                href={`${window.location.origin}${this.props.location.pathname}?${this.props.location.search}`}
              />
            )}
            {!mobile ? (
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
                    <PlpResultItem
                      product={item}
                      addedToWishlist={false}
                      currency={currency}
                      key={item.id}
                      mobile={mobile}
                      onClickQuickView={this.onClickQuickView}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);
export { initActionSearch };
