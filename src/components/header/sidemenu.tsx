import React, { Fragment } from "react";
// import { currencyCode } from "../../typings/currency";
import { SideMenuProps } from "./typings";
import styles from "./styles.scss";
import cs from "classnames";
import iconStyles from "../../styles/iconFonts.scss";
import SelectableDropdownMenu from "../dropdown/selectableDropdownMenu";
import { DropdownItem } from "../dropdown/baseDropdownMenu/typings";
import storyStyles from "../../styles/stories.scss";
import DropdownMenu from "../dropdown/dropdownMenu";
import { Basket } from "typings/basket";
import { connect } from "react-redux";
import UserContext from "contexts/user";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { AppState } from "reducers/typings";
import mapDispatchToProps from "./mapper/actions";
import Loader from "components/Loader";

interface State {
  showc: boolean;
  showp: boolean;
  cartCount: number;
  openProfile: boolean;
  isLoading: boolean;
}

const mapStateToProps = (state: AppState) => {
  return {
    cookies: state.cookies,
    slab: state.user.slab,
    currencyList: state.info.currencyList,
    user: state.user
  };
};

type Props = SideMenuProps &
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps;

class SideMenu extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showc: false,
      showp: false,
      cartCount: 0,
      openProfile: false,
      isLoading: false
    };
  }
  static contextType = UserContext;
  // CODE FOR CURRENCY CHANGE IN DESKTOP
  changeCurrency = (cur: any) => {
    const { changeCurrency, reloadPage, history, currency } = this.props;
    const data: any = {
      currency: cur
    };
    if (!this.state.isLoading && this.props.currency != data.currency) {
      this.setState({
        isLoading: true
      });
      return changeCurrency(data)
        .then((response: any) => {
          // if (data.currency == "INR") {
          //   history.push("/maintenance");
          // }
          if (history.location.pathname.indexOf("/catalogue/category/") > -1) {
            const path =
              history.location.pathname +
              history.location.search.replace(currency, response.currency);
            history.replace(path);
          }
          this.props.onSideMenuClick("Currency");
          reloadPage(
            this.props.cookies,
            response.currency,
            this.props.user.customerGroup,
            history.location.pathname,
            this.props.user.isLoggedIn
          );
        })
        .finally(() => {
          this.setState({
            isLoading: false
          });
        });
    }
  };

  toggleSearch = () => {
    if (
      this.props.history.location.pathname.indexOf("/bridal/") > 0 &&
      !this.props.location.pathname.includes("/account/")
    ) {
      return false;
    }
    this.props.toggleSearch();
    this.props.onSideMenuClick("Search");
  };
  render() {
    const { isLoggedIn } = this.context;
    const curryList = this.props.currencyList.map(data => {
      // return data.currencyCode
      return {
        label: data.currencyCode + " " + data.currencySymbol,
        value: data.currencyCode
      };
    });
    const items: DropdownItem[] = curryList;

    const profileItems: DropdownItem[] = [];
    isLoggedIn &&
      profileItems.push(
        {
          label: "My Profile",
          href: "/account/profile",
          type: "link"
        },
        {
          label: "My Orders",
          href: "/account/my-orders",
          type: "link"
        }
      );
    profileItems.push(
      {
        label: "Track Order",
        href: "/account/track-order",
        type: "link"
      },
      {
        label: "Good Earth Registry",
        href: isLoggedIn ? "/account/bridal" : "",
        onClick: isLoggedIn
          ? () => null
          : () => this.props.goLogin(undefined, "/account/bridal"),
        type: isLoggedIn ? "link" : "button",
        value: "Good Earth Registry"
      },
      {
        label: "Activate Gift Card",
        href: "/account/giftcard-activation",
        type: "link",
        value: "Activate Gift Card"
      },
      {
        label: "Cerise Program",
        href:
          isLoggedIn && this.props.slab && this.props.slab != "Fresh"
            ? "/account/cerise"
            : "/cerise",
        type: "link",
        value: "Cerise Program"
      },
      {
        label: "Check Balance",
        href: "/account/check-balance",
        type: "link",
        value: "Check Balance"
      },
      {
        label: isLoggedIn ? "Logout" : "Login",
        onClick: isLoggedIn
          ? () =>
              this.props.handleLogOut(
                this.props.history,
                this.props.currency,
                this.props.user.customerGroup
              )
          : this.props.goLogin,
        type: "button",
        value: isLoggedIn ? "Logout" : "Login"
      }
    );
    const gtmPushWishlistClick = () => {
      dataLayer.push({
        event: "eventsToSend",
        eventAction: "wishListClick",
        eventCategory: "Click",
        eventLabel: this.props.location.pathname
      });
    };
    const selectClass = this.state.showp
      ? cs(
          iconStyles.icon,
          iconStyles.iconProfile,
          styles.iconStyle,
          styles.cerise
        )
      : cs(iconStyles.icon, iconStyles.iconProfile, styles.iconStyle);

    const bagitem: Basket = this.props.sidebagData;
    const wishlistCount = this.props.wishlistData.length;
    let bagCount = 0;
    const item = bagitem.lineItems;
    for (let i = 0; i < item.length; i++) {
      bagCount = bagCount + item[i].quantity;
    }
    const { mobile, location } = this.props;
    const isBridalRegistryPage =
      location.pathname.indexOf("/bridal/") > -1 &&
      !this.props.location.pathname.includes("/account/");
    const disableClass =
      location.pathname.indexOf("/bridal/") > -1 &&
      !this.props.location.pathname.includes("/account/")
        ? styles.iconStyleDisabled
        : "";
    return (
      <Fragment>
        <ul className={styles.sideMenuContainer}>
          {mobile ? (
            ""
          ) : (
            <li
              className={cs(
                styles.sideMenuItem,
                styles.curr,
                styles.currencyMenu,
                disableClass
              )}
            >
              <SelectableDropdownMenu
                id="currency-dropdown"
                align="right"
                className={storyStyles.greyBG}
                items={items}
                value={this.props.currency}
                showCaret={true}
                disabled={isBridalRegistryPage ? true : false}
                onChangeCurrency={this.changeCurrency}
              ></SelectableDropdownMenu>
            </li>
          )}
          {mobile ? (
            ""
          ) : (
            <li
              className={
                this.state.showp
                  ? cs(
                      styles.sideMenuItem,
                      styles.curr,
                      styles.hiddenXs,
                      styles.hiddenSm,
                      disableClass
                    )
                  : cs(
                      styles.sideMenuItem,
                      styles.hiddenXs,
                      styles.hiddenSm,
                      disableClass
                    )
              }
            >
              <div className={styles.innerProfileContainer}>
                <DropdownMenu
                  id="profile-dropdown"
                  display={<i className={selectClass}></i>}
                  className={storyStyles.greyBG}
                  align="right"
                  items={profileItems}
                  onDropDownMenuClick={this.props.onSideMenuClick}
                  disabled={isBridalRegistryPage ? true : false}
                ></DropdownMenu>
              </div>
            </li>
          )}
          {mobile ? (
            ""
          ) : (
            <li
              className={cs(
                styles.sideMenuItem,
                styles.hiddenXs,
                styles.hiddenSm
              )}
            >
              <div
                className={cs(
                  styles.iconStyle,
                  styles.innerWishContainer,
                  disableClass
                )}
              >
                <Link
                  to={isBridalRegistryPage ? "#" : "/wishlist"}
                  onClick={() => {
                    gtmPushWishlistClick();
                    this.props.onSideMenuClick("Wishlist");
                    this.props.hideSearch();
                  }}
                >
                  <i
                    className={cs(
                      iconStyles.icon,
                      iconStyles.iconWishlist,
                      styles.iconStyle
                    )}
                  ></i>
                  <span className={styles.badge}>
                    {wishlistCount > 0 ? wishlistCount : ""}
                  </span>
                </Link>
              </div>
            </li>
          )}
          {mobile ? (
            ""
          ) : (
            <li
              className={cs(styles.sideMenuItem, {
                [styles.sideMenuItemMobile]: mobile
              })}
            >
              <div className={cs(styles.iconStyle, styles.innerCartContainer)}>
                <i
                  className={cs(iconStyles.icon, iconStyles.iconCart)}
                  onClick={(): void => {
                    this.props.setShowBag(true);
                    this.props.onSideMenuClick("Cart");
                  }}
                ></i>
                <span
                  className={styles.badge}
                  onClick={(): void => {
                    this.props.setShowBag(true);
                    this.props.onSideMenuClick("Cart");
                  }}
                >
                  {bagCount}
                </span>
              </div>
            </li>
          )}
        </ul>
        <ul>
          {mobile ? (
            <li className={cs(styles.firstMenu, disableClass)}>
              <p
                className={styles.searchText}
                onClick={isBridalRegistryPage ? () => null : this.toggleSearch}
              >
                <i
                  className={
                    this.props.showSearch
                      ? cs(
                          iconStyles.icon,
                          iconStyles.iconCrossNarrowBig,
                          styles.iconStyleCross
                        )
                      : cs(
                          iconStyles.icon,
                          iconStyles.iconSearch,
                          styles.iconStyle
                        )
                  }
                ></i>
                {mobile ? "" : <span>Search</span>}
              </p>
            </li>
          ) : (
            <li className={cs(styles.firstMenu, disableClass)}>
              <p
                className={styles.searchText}
                onClick={isBridalRegistryPage ? () => null : this.toggleSearch}
              >
                <i
                  className={cs(
                    iconStyles.icon,
                    iconStyles.iconSearch,
                    styles.iconStyle
                  )}
                ></i>
                {mobile ? "" : <span>Search</span>}
              </p>
            </li>
          )}
        </ul>
        {this.state.isLoading && <Loader />}
      </Fragment>
    );
  }
}
const SideMenuWithRouter = withRouter(SideMenu);
export default connect(mapStateToProps, mapDispatchToProps)(SideMenuWithRouter);
