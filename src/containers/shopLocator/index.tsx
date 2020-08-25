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

const mapStateToProps = (state: AppState) => {
  return {
    currency: state.currency,
    device: state.device,
    shopData: state.shop.shopData
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
  }
> {
  constructor(props: Props) {
    super(props);

    this.state = {
      currentSection: this.props.shopname ? "details" : "shop",
      showmobileSort: false,
      menuList: [],
      city: this.props.city
    };
  }

  setCurrentSection = (section: string) => {
    this.setState({
      currentSection: section
    });
  };

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
        let element = null;
        if (hash == "cafe") {
          element = document.getElementById("mycafe");
        }
        if (hash == "shop") {
          element = document.getElementById("myshop");
        }
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
      if (mobile) {
        // this.child.clickCloseFilter();
      } else {
        this.setState({
          city: data
        });
      }
    }
  };

  backLink = () => {
    const {
      device: { mobile }
    } = this.props;

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
              <Link to="#shop" id="shopname">
                SHOP{" "}
              </Link>
            </span>{" "}
            &nbsp;
            {this.props.shopData.length > 0 &&
              this.props.shopData[0]?.cafeHeading2 && (
                <span className={styles.cafeLink}>
                  <Link to="#cafe" id="cafename">
                    | &nbsp; CAFE{" "}
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
      shopname
    } = this.props;
    const items: DropdownItem[] = Object.keys(shopData).map(data => {
      return {
        label: data,
        value: data
      };
    });

    return (
      <div className={styles.pageBody}>
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
                  bootstrap.colMd3,
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
