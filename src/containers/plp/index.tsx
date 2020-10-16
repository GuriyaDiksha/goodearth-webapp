import loadable from "@loadable/component";
import React, { Fragment } from "react";
import SecondaryHeader from "components/SecondaryHeader";
import SelectableDropdownMenu from "components/dropdown/selectableDropdownMenu";
import initActionCollection from "./initAction";
import { DropdownItem } from "components/dropdown/baseDropdownMenu/typings";
import cs from "classnames";
import { AppState } from "reducers/typings";
import { connect, DispatchProp } from "react-redux";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
import styles from "./styles.scss";
import globalStyles from "styles/global.scss";
import FilterList from "./filterList";
import CorporateFilter from "./corporateList";
import PlpDropdownMenu from "components/PlpDropDown";
import PlpResultItem from "components/plpResultItem";
import GiftcardItem from "components/plpResultItem/giftCard";
import PlpBreadcrumbs from "components/PlpBreadcrumbs";
import mapDispatchToProps from "../../components/Modal/mapper/actions";
import Loader from "components/Loader";
import MakerEnhance from "maker-enhance";

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
    plpMaker: boolean;
    toggel: boolean;
    corporoateGifting: boolean;
    isThirdParty: boolean;
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
      flag: false,
      plpMaker: false,
      toggel: false,
      corporoateGifting:
        props.location.pathname.includes("corporate-gifting") ||
        props.location.search.includes("&src_type=cp"),
      isThirdParty: props.location.search.includes("&src_type=cp")
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

  componentDidMount() {
    dataLayer.push({
      event: "PlpView",
      PageURL: this.props.location.pathname,
      PageTitle: "virtual_plp_view"
    });
    this.setState({
      plpMaker: true
    });
    if (this.props.device.mobile) {
      const elem = document.getElementById("pincode-bar");
      elem && elem.classList.add(globalStyles.hiddenEye);
      const chatButtonElem = document.getElementById("chat-button");
      const scrollToTopButtonElem = document.getElementById("scrollToTop-btn");
      if (scrollToTopButtonElem) {
        scrollToTopButtonElem.style.bottom = "65px";
      }
      if (chatButtonElem) {
        chatButtonElem.style.bottom = "10px";
      }
    }
  }

  componentDidUpdate(nextProps: Props) {
    if (
      this.props.location.pathname != nextProps.location.pathname &&
      !this.state.plpMaker
    ) {
      const queryString = nextProps.location.search;
      const urlParams = new URLSearchParams(queryString);
      const param = urlParams.get("sort_by");
      this.setState({
        plpMaker: true,
        sortValue: param ? param : "hc"
      });
    }
  }

  onStateChange = () => {
    this.setState({
      plpMaker: false
    });
  };

  onClickQuickView = (id: number) => {
    const { updateComponentModal, changeModalState, plpProductId } = this.props;
    updateComponentModal(
      <Quickview
        id={id}
        productListId={plpProductId}
        corporatePDP={this.state.corporoateGifting}
      />,
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

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (this.props.location.pathname != nextProps.location.pathname) {
      this.setState({
        plpMaker: false,
        corporoateGifting:
          nextProps.location.pathname.includes("corporate-gifting") ||
          nextProps.location.search.includes("&src_type=cp"),
        isThirdParty: nextProps.location.search.includes("&src_type=cp")
      });
    }
  }

  render() {
    const {
      device: { mobile },
      currency,
      data: {
        results: { breadcrumb, banner, bannerMobile, data },
        count
      }
    } = this.props;
    const { plpMaker, corporoateGifting } = this.state;
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
                  className={cs(bootstrap.colMd12)}
                  isViewAll={this.child.state?.isViewAll}
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
        {corporoateGifting &&
          (mobile ? (
            <div
              className={cs(
                bootstrap.row,
                styles.subcHeader4,
                globalStyles.textCenter
              )}
            >
              <div className={cs(bootstrap.col12, globalStyles.textCenter)}>
                <h1>Good Earth X Souk</h1>
                <h1 className={styles.corporateHeading}>
                  An Online Exhibit & Pop-Up
                </h1>
                <p
                  className={cs(styles.corporateSubHeading, {
                    [styles.corporateSubHeadingMobile]: mobile
                  })}
                >
                  AVAILABLE IN INDIA ONLY
                </p>
              </div>
              {!this.state.isThirdParty && (
                <div
                  className={cs(
                    globalStyles.voffset3,
                    globalStyles.textCenter,
                    styles.downloadWidth
                  )}
                >
                  <a
                    href="https://indd.adobe.com/view/e046249f-f38d-419b-9dc3-af8bea0326ab"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={globalStyles.cerise}
                  >
                    DOWNLOAD CATALOGUE
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className={cs(bootstrap.row, styles.subcHeader)}>
              <div className={cs(bootstrap.col12, globalStyles.textCenter)}>
                <h1>Good Earth X Souk</h1>
                <h1 className={styles.corporateHeading}>
                  An Online Exhibit & Pop-Up
                </h1>
                <p className={styles.corporateSubHeading}>
                  AVAILABLE IN INDIA ONLY
                </p>
              </div>
            </div>
          ))}
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
            {corporoateGifting ? (
              <CorporateFilter
                onRef={(el: any) => (this.child = el)}
                onChangeFilterState={this.onChangeFilterState}
                key={this.props.location.pathname}
                changeLoader={this.changeLoader}
                onStateChange={this.onStateChange}
              />
            ) : (
              <FilterList
                onRef={(el: any) => (this.child = el)}
                onChangeFilterState={this.onChangeFilterState}
                key={this.props.location.pathname}
                changeLoader={this.changeLoader}
                onStateChange={this.onStateChange}
              />
            )}
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
            {banner || bannerMobile ? (
              <div className={cs(bootstrap.row)}>
                <div className={cs(globalStyles.textCenter, bootstrap.col12)}>
                  <img
                    src={mobile ? bannerMobile : banner}
                    className={globalStyles.imgResponsive}
                  />
                </div>
              </div>
            ) : (
              ""
            )}

            {plpMaker && (!banner || !bannerMobile) && (
              <MakerEnhance
                user="goodearth"
                href={`${window.location.origin}${this.props.location.pathname}?${this.props.location.search}`}
              />
            )}

            {!mobile ? (
              <div
                className={cs(styles.productNumber, styles.imageContainer, {
                  [styles.border]: mobile
                })}
              >
                <span>
                  {count > 1
                    ? (!this.state.corporoateGifting ? count + 1 : count) +
                      " products found"
                    : (!this.state.corporoateGifting ? count + 1 : count) +
                      " product found"}{" "}
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
                      isCorporate={this.state.corporoateGifting}
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
                {this.state.corporoateGifting ? "" : <GiftcardItem />}
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
