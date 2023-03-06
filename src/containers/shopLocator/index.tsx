import React, { Fragment } from "react";
import SecondaryHeader from "components/SecondaryHeader";
import initActionSearch from "./initAction";
import cs from "classnames";
import { AppState } from "reducers/typings";
import { connect, DispatchProp } from "react-redux";
// import iconStyles from "../../styles/iconFonts.scss";
import styles from "./styles.scss";
import globalStyles from "styles/global.scss";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
import { DropdownItem } from "components/dropdown/baseDropdownMenu/typings";
import SelectableDropdownMenu from "components/dropdown/selectableDropdownMenu";
import { ShopProps } from "./typings";
import ShopDropdownMenu from "components/MobileDropdown/shopLocatorDropdown";
import ShopPage from "./shopPage";
import ShopDetail from "./shopDetails";
import locIcon from "../../images/location-icon.svg";
import iconStyles from "../../styles/iconFonts.scss";
import { Link, withRouter, RouteComponentProps } from "react-router-dom";
import { pageViewGTM } from "utils/validate";
import debounce from "lodash/debounce";

const mapStateToProps = (state: AppState) => {
  return {
    currency: state.currency,
    device: state.device,
    shopData: state.shop.shopData,
    showTimer: state.info.showTimer
  };
};
type Props = ShopProps &
  ReturnType<typeof mapStateToProps> &
  DispatchProp &
  RouteComponentProps;

class ShopLocator extends React.Component<
  Props,
  {
    currentSection: string;
    showmobileSort: boolean;
    menuList: any;
    city: string;
    highlight: string;
  }
> {
  constructor(props: Props) {
    super(props);

    this.state = {
      currentSection: this.props.shopname ? "details" : "shop",
      showmobileSort: false,
      menuList: [],
      city: this.props.city,
      highlight: this.props.history.location.hash == "#cafe" ? "cafe" : "shop"
    };
  }

  setCurrentSection = (section: string) => {
    this.setState({
      currentSection: section
    });
  };

  componentDidMount() {
    pageViewGTM("ShopLocator");
    window.addEventListener("scroll", debounce(this.handleScroll, 100));
  }

  UNSAFE_componentWillReceiveProps = (nextProps: Props) => {
    if (nextProps.city !== this.props.city) {
      this.setState({
        city: nextProps.city
      });
    }
    if (nextProps.shopname !== this.props.shopname) {
      this.setCurrentSection(nextProps.shopname ? "details" : "shop");
    }

    if (nextProps.location !== this.props.location) {
      window.scrollTo(0, 0);
      // for handling scroll to particalar element with hash
      let { hash } = nextProps.location;
      hash = hash.replace("#", "");
      if (hash) {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView();
          const headerHeight = 50;
          const secondaryHeaderHeight = 50;
          const announcementBarHeight = 30;
          window.scrollBy(
            0,
            -(headerHeight + secondaryHeaderHeight + announcementBarHeight)
          );
        }
      }
    }
  };

  setSelectedSection = () => {
    const {
      shopData,
      device: { mobile }
    } = this.props;
    const { city } = this.state;
    switch (this.state.currentSection) {
      case "shop":
        return <ShopPage mobile={mobile} data={shopData[city]} />;
      case "details": {
        const shopname = this.props.shopname?.replace(/_/g, " ");
        const shopdata = shopData[city]?.filter(
          (data: any) => data?.place == shopname
        );
        return <ShopDetail mobile={mobile} data={shopdata} />;
      }
      default:
        return "";
    }
  };

  onchangeFilter = (data: any): void => {
    if (data !== this.state.city) {
      const newPath = this.props.location.pathname.replace(
        this.state.city,
        data
      );
      this.props.history.push(newPath);
      const {
        device: { mobile }
      } = this.props;
      // sortGTM(data);
      if (mobile) {
        // this.child.clickCloseFilter();
      } else {
        this.setState({
          city: data
        });
      }
    }
  };

  handleScroll = () => {
    const elem = document.getElementById("cafe");
    if (elem) {
      if (elem.getBoundingClientRect().top <= 135) {
        if (this.state.highlight == "shop") {
          this.setState({
            highlight: "cafe"
          });
        }
      } else {
        if (this.state.highlight == "cafe") {
          this.setState({
            highlight: "shop"
          });
        }
      }
    }
  };
  backLink = () => {
    const {
      device: { mobile }
    } = this.props;

    const isCafe =
      this.props.shopData[this.state.city]?.filter(
        (store: any) =>
          store.place.replace(/\s/g, "_") == this.props.shopname &&
          store.cafeHeading2
      ).length > 0;

    return (
      <SecondaryHeader>
        {!mobile && (
          <div className={cs(bootstrap.colMd3, styles.innerHeader)}>
            <Link to={"/Cafe-Shop/" + this.state.city}>
              <span className={styles.heading}>
                {" "}
                {!mobile && `< Back To Shops`}{" "}
              </span>
            </Link>
          </div>
        )}
        {mobile && (
          <div
            className={cs(
              bootstrap.col12,
              styles.moveLink,
              styles.moveLinkMobile,
              globalStyles.textCenter
            )}
          >
            <span className={styles.shopLink}>
              <Link
                to="#shop"
                id="shopname"
                className={cs({
                  [globalStyles.cerise]: this.state.highlight == "shop"
                })}
              >
                SHOP{" "}
              </Link>
            </span>{" "}
            &nbsp;
            {isCafe && (
              <span className={styles.cafeLink}>
                | &nbsp;
                <Link
                  to="#cafe"
                  id="cafename"
                  className={cs({
                    [globalStyles.cerise]: this.state.highlight == "cafe"
                  })}
                >
                  CAFE{" "}
                </Link>
              </span>
            )}
            <span className={styles.lessthan}>
              <Link to={"/Cafe-Shop/" + this.state.city}>
                <span className={styles.lessthan}>{"<"}</span>
              </Link>
            </span>
          </div>
        )}
      </SecondaryHeader>
    );
  };

  render() {
    const {
      device: { mobile },
      city,
      shopData,
      shopname,
      showTimer
    } = this.props;
    const items: DropdownItem[] = Object.keys(shopData).map(data => {
      return {
        label: data,
        value: data
      };
    });

    return (
      <div
        className={cs(styles.pageBody, { [styles.pageBodyTimer]: showTimer })}
      >
        {mobile ? (
          shopname ? (
            this.backLink()
          ) : (
            <ShopDropdownMenu
              list={items}
              onChange={this.onchangeFilter}
              showCaret={true}
              open={false}
              value={city}
            />
          )
        ) : shopname ? (
          this.backLink()
        ) : (
          <SecondaryHeader>
            <Fragment>
              <div
                className={cs(
                  bootstrap.colMd4,
                  styles.innerHeader,
                  styles.dropDiv
                )}
              >
                <div className={cs(styles.headerHeight, styles.uc)}>
                  <i
                    className={cs(
                      iconStyles.icon,
                      iconStyles.iconLocation,
                      styles.mapIcon
                    )}
                  ></i>
                  Shop Locator
                </div>
                <div className={styles.dropdownCenter}>
                  <span className={styles.locIcon}>
                    <img src={locIcon} />{" "}
                  </span>

                  <SelectableDropdownMenu
                    id="filter-dropdown-shoplocator"
                    align="right"
                    className={styles.dropdownRoot}
                    items={items}
                    value={city}
                    onChange={this.onchangeFilter}
                    showCaret={true}
                  ></SelectableDropdownMenu>
                </div>
              </div>
              <div className={cs(bootstrap.colMd7, bootstrap.offsetMd1)}></div>
            </Fragment>
          </SecondaryHeader>
        )}
        <div>{this.setSelectedSection()}</div>
      </div>
    );
  }
}
const ShopLocatorRoute = withRouter(ShopLocator);

export default connect(mapStateToProps)(ShopLocatorRoute);
export { initActionSearch };
