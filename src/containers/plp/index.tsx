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
import Breadcrumbs from "components/Breadcrumbs";
import mapDispatchToProps from "../../components/Modal/mapper/actions";
import Quickview from "components/Quickview";

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
  { filterData: string; showmobileSort: boolean; mobileFilter: boolean }
> {
  // child = React.createRef();

  state = {
    filterData: "All",
    showmobileSort: false,
    mobileFilter: false
  };

  onchangeFilter = (data: any): void => {
    // console.log(data, this.refs);
    // debugger;
    // this.changeSort()
    // this.setState({
    //   filterData: data
    // });
  };

  onClickQuickView = (id: number) => {
    const { updateComponentModal, changeModalState, plpProductId } = this.props;
    updateComponentModal(
      <Quickview id={id} productListId={plpProductId} />,
      true
    );
    changeModalState(true);
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
    console.log(this.props.dispatch);
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
        <SecondaryHeader>
          {mobile ? (
            <div>
              <PlpDropdownMenu
                list={items}
                onChange={this.onchangeFilter}
                showCaret={true}
                open={false}
                value="hc"
              />
            </div>
          ) : (
            <Fragment>
              <div className={cs(bootstrap.colMd7, bootstrap.offsetMd1)}>
                <Breadcrumbs
                  levels={breadcrumb}
                  className={cs(bootstrap.colMd7)}
                />
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
          )}
        </SecondaryHeader>
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
            <FilterList dispatch={this.props.dispatch} />
          </div>
          <div
            className={cs(
              { [globalStyles.hidden]: this.state.showmobileSort },
              { [globalStyles.paddTop80]: !this.state.showmobileSort },
              { [globalStyles.spCat]: !this.state.showmobileSort },
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
              {data.map(item => {
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

export default connect(mapStateToProps, mapDispatchToProps)(PLP);
export { initActionCollection };
