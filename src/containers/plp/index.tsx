import loadable from "@loadable/component";
import React, { Fragment } from "react";
import SecondaryHeader from "components/SecondaryHeader";
import SelectableDropdownMenu from "components/dropdown/selectableDropdownMenu";
import initActionCollection from "./initAction";
import { DropdownItem } from "components/dropdown/baseDropdownMenu/typings";
import cs from "classnames";
import { AppState } from "reducers/typings";
import { connect, DispatchProp } from "react-redux";
import styles from "./styles.scss";
import globalStyles from "styles/global.scss";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
import FilterList from "./filterList";
import PlpDropdownMenu from "components/PlpDropDown";
import PlpResultItem from "components/plpResultItem";
import GiftcardItem from "components/plpResultItem/giftCard";
import PlpBreadcrumbs from "components/PlpBreadcrumbs";
import mapDispatchToProps from "../../components/Modal/mapper/actions";
import Loader from "components/Loader";

const Quickview = loadable(() => import("components/Quickview"));

const mapStateToProps = (state: AppState) => {
  return {
    plpProductId: state.plplist.plpProductId,
    facetObject: state.plplist.facetObject,
    data: state.plplist.data,
    location: state.router.location,
    currency: state.currency,
    device: state.device
  };
};
type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  DispatchProp;

class PLP extends React.Component<
  Props,
  {
    filterData: string;
    showmobileSort: boolean;
    mobileFilter: boolean;
    sortValue: string;
    flag: boolean;
  }
> {
  constructor(props: Props) {
    super(props);
    // get the required parameter
    const queryString = props.location.search;
    const urlParams = new URLSearchParams(queryString);
    const param = urlParams.get("sort_by");
    this.state = {
      filterData: "All",
      showmobileSort: false,
      mobileFilter: false,
      sortValue: param ? param : "hc",
      flag: false
    };
  }
  private child: any = FilterList;

  onchangeFilter = (data: any): void => {
    this.child.changeValue(null, data);
    const {
      device: { mobile }
    } = this.props;
    if (mobile) {
      this.child.clickCloseFilter();
    }
    this.setState({ sortValue: data });
  };

  onClickQuickView = (id: number) => {
    const { updateComponentModal, changeModalState, plpProductId } = this.props;
    updateComponentModal(
      <Quickview id={id} productListId={plpProductId} />,
      true
    );
    changeModalState(true);
  };

  changeLoader = (value: boolean) => {
    this.setState({
      flag: value
    });
  };

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

  render() {
    const {
      device: { mobile },
      currency,
      data: {
        results: { breadcrumb, banner, data },
        count
      }
    } = this.props;
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
            value={this.state.sortValue}
            key={"plpPageMobile"}
          />
        ) : (
          <SecondaryHeader>
            <Fragment>
              <div className={cs(bootstrap.colMd7, bootstrap.offsetMd1)}>
                <PlpBreadcrumbs
                  levels={breadcrumb}
                  className={cs(bootstrap.colMd7)}
                  isViewAll={false}
                />
              </div>
              <div className={cs(bootstrap.colMd3, styles.innerHeader)}>
                <p className={styles.filterText}>Sort</p>
                <SelectableDropdownMenu
                  align="right"
                  className={styles.dropdownRoot}
                  items={items}
                  onChange={this.onchangeFilter}
                  showCaret={true}
                  value={this.state.sortValue}
                  key={"plpPage"}
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
            <FilterList
              onRef={(el: any) => (this.child = el)}
              onChangeFilterState={this.onChangeFilterState}
              key={this.props.location.pathname}
              changeLoader={this.changeLoader}
            />
          </div>
          <div
            className={cs(
              { [globalStyles.hidden]: this.state.showmobileSort },
              { [globalStyles.paddTop20]: !this.state.showmobileSort },
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

            {!mobile ? (
              <div
                className={cs(styles.productNumber, styles.imageContainer, {
                  [styles.border]: mobile
                })}
              >
                <span>
                  {count > 1
                    ? count + 1 + " products found"
                    : count + 1 + " product found"}{" "}
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
                    : cs(bootstrap.row, styles.imageContainerMobile)
                  : cs(bootstrap.row, styles.imageContainer, styles.minHeight)
              }
              id="product_images"
            >
              {this.state.flag ? <Loader /> : ""}
              {data.map((item, index) => {
                return (
                  <div
                    className={cs(
                      bootstrap.colMd4,
                      bootstrap.col6,
                      styles.setWidth
                    )}
                    key={item.id}
                  >
                    <PlpResultItem
                      product={item}
                      addedToWishlist={false}
                      currency={currency}
                      key={item.id}
                      mobile={mobile}
                      isVisible={index < 3 ? true : undefined}
                      onClickQuickView={this.onClickQuickView}
                    />
                  </div>
                );
              })}
              <div
                className={cs(
                  bootstrap.colMd4,
                  bootstrap.col6,
                  styles.setWidth
                )}
                key={1}
              >
                <GiftcardItem />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PLP);
export { initActionCollection };
